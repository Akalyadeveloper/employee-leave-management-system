import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'

const DEFAULT_LEAVE_BALANCE = { sick: 10, casual: 5, vacation: 5 }

const clone = (value) => {
  if (value === undefined) {
    return undefined
  }

  return JSON.parse(
    JSON.stringify(value, (_, input) => (typeof input === 'function' ? undefined : input)),
  )
}

const compareValues = (left, right) => {
  if (left instanceof Date || right instanceof Date) {
    return new Date(left).getTime() - new Date(right).getTime()
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  return String(left).localeCompare(String(right))
}

const matchesValue = (actual, expected) => {
  if (expected && typeof expected === 'object' && !Array.isArray(expected) && !(expected instanceof Date)) {
    if (Object.prototype.hasOwnProperty.call(expected, '$in')) {
      return expected.$in.some((item) => matchesValue(actual, item))
    }

    if (Object.prototype.hasOwnProperty.call(expected, '$gte')) {
      return compareValues(actual, expected.$gte) >= 0
    }

    if (Object.prototype.hasOwnProperty.call(expected, '$lte')) {
      return compareValues(actual, expected.$lte) <= 0
    }

    return Object.entries(expected).every(([key, value]) => matchesValue(actual?.[key], value))
  }

  if (actual instanceof Date || expected instanceof Date) {
    return new Date(actual).getTime() === new Date(expected).getTime()
  }

  return actual === expected
}

const matchesFilter = (doc, filter = {}) => Object.entries(filter).every(([key, expected]) => matchesValue(doc[key], expected))

const applySelect = (doc, selectSpec) => {
  if (!selectSpec) {
    return clone(doc)
  }

  const fields = String(selectSpec)
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (!fields.length) {
    return clone(doc)
  }

  const excluded = fields.filter((field) => field.startsWith('-')).map((field) => field.slice(1))
  if (excluded.length) {
    const projected = clone(doc)
    for (const field of excluded) {
      delete projected[field]
    }
    return projected
  }

  const projected = {}
  if (doc._id !== undefined) {
    projected._id = doc._id
  }

  for (const field of fields) {
    if (doc[field] !== undefined) {
      projected[field] = clone(doc[field])
    }
  }

  return projected
}

const getStore = () => {
  if (!globalThis.__leaveMgmtDemoStore) {
    globalThis.__leaveMgmtDemoStore = createSeedState()
  }
  return globalThis.__leaveMgmtDemoStore
}

const persistStore = (nextStore) => {
  globalThis.__leaveMgmtDemoStore = nextStore
  return nextStore
}

const createUserDoc = (raw) => {
  if (!raw) return null
  const doc = clone(raw)

  doc.hasEnoughLeave = function hasEnoughLeave(type, days) {
    return (this.leaveBalance?.[type] ?? 0) >= days
  }

  doc.useLeave = function useLeave(type, days) {
    if (!this.hasEnoughLeave(type, days)) {
      throw new Error('Not enough leave balance')
    }
    this.leaveBalance[type] -= days
    return this.leaveBalance[type]
  }

  doc.restoreLeave = function restoreLeave(type, days) {
    if (!this.leaveBalance) {
      this.leaveBalance = { ...DEFAULT_LEAVE_BALANCE }
    }
    this.leaveBalance[type] += days
    return this.leaveBalance[type]
  }

  doc.save = async function save() {
    const store = getStore()
    const index = store.users.findIndex((user) => user._id === this._id)
    const payload = sanitizeDoc(this)
    payload.updatedAt = new Date()

    if (index >= 0) {
      store.users[index] = payload
    } else {
      store.users.push(payload)
    }

    return createUserDoc(payload)
  }

  return doc
}

const createLeaveDoc = (raw) => {
  if (!raw) return null
  const doc = clone(raw)

  doc.save = async function save() {
    const store = getStore()
    const index = store.leaves.findIndex((leave) => leave._id === this._id)
    const payload = sanitizeDoc(this)
    payload.user = typeof this.user === 'object' && this.user?._id ? this.user._id : this.user
    payload.updatedAt = new Date()

    if (index >= 0) {
      store.leaves[index] = payload
    } else {
      store.leaves.push(payload)
    }

    return createLeaveDoc(payload)
  }

  doc.deleteOne = async function deleteOne() {
    const store = getStore()
    store.leaves = store.leaves.filter((leave) => leave._id !== this._id)
    return { deletedCount: 1 }
  }

  return doc
}

const sanitizeDoc = (doc) => {
  const payload = {}
  for (const [key, value] of Object.entries(doc)) {
    if (typeof value !== 'function') {
      payload[key] = clone(value)
    }
  }
  return payload
}

const attachCollectionMethods = (doc, collection) => {
  if (collection === 'users') {
    return createUserDoc(doc)
  }
  if (collection === 'leaves') {
    return createLeaveDoc(doc)
  }
  return clone(doc)
}

const populateLeafUser = (leaf, selectFields) => {
  if (!leaf || !leaf.user) {
    return leaf
  }

  const store = getStore()
  const userId = typeof leaf.user === 'object' ? leaf.user._id : leaf.user
  const rawUser = store.users.find((user) => user._id === userId)
  if (!rawUser) {
    return leaf
  }

  const projected = applySelect(rawUser, selectFields)
  leaf.user = createUserDoc(projected)
  return leaf
}

const sortDocs = (docs, sortSpec) => {
  if (!sortSpec) {
    return docs
  }

  const entries = Object.entries(sortSpec)
  if (!entries.length) {
    return docs
  }

  const [field, direction] = entries[0]
  const multiplier = direction >= 0 ? 1 : -1
  return [...docs].sort((left, right) => compareValues(left[field], right[field]) * multiplier)
}

const materialize = (docs, collection, selectSpec, populateSpec) => {
  const prepared = docs.map((doc) => attachCollectionMethods(doc, collection))

  const populated = populateSpec
    ? prepared.map((doc) => {
        if (collection === 'leaves' && populateSpec.path === 'user') {
          return populateLeafUser(doc, populateSpec.select)
        }
        return doc
      })
    : prepared

  const projected = selectSpec ? populated.map((doc) => applySelect(doc, selectSpec)) : populated
  return projected.map((doc) => attachCollectionMethods(doc, collection))
}

class DemoQuery {
  constructor(collection, filter = {}, single = false) {
    this.collection = collection
    this.filter = filter
    this.single = single
    this.sortSpec = null
    this.limitCount = null
    this.selectSpec = null
    this.populateSpec = null
  }

  sort(sortSpec) {
    this.sortSpec = sortSpec
    return this
  }

  limit(count) {
    this.limitCount = count
    return this
  }

  select(selectSpec) {
    this.selectSpec = selectSpec
    return this
  }

  populate(path, selectSpec) {
    this.populateSpec = { path, select: selectSpec }
    return this
  }

  async exec() {
    const store = getStore()
    const source = this.collection === 'users' ? store.users : store.leaves
    const filtered = source.filter((doc) => matchesFilter(doc, this.filter))
    const sorted = sortDocs(filtered, this.sortSpec)
    const limited = this.limitCount == null ? sorted : sorted.slice(0, this.limitCount)
    const results = materialize(limited, this.collection, this.selectSpec, this.populateSpec)

    if (this.single) {
      return results[0] ?? null
    }

    return results
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject)
  }
}

const nextId = () => randomUUID()
const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000)
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000)

const createSeedState = () => {
  const passwordHash = bcrypt.hashSync('123456', 10)

  const employee = {
    _id: 'demo-employee',
    name: 'Demo Employee',
    email: 'employee@test.com',
    password: passwordHash,
    role: 'employee',
    leaveBalance: { sick: 10, casual: 4, vacation: 3 },
    phone: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    dateOfBirth: null,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employeeId: 'EMP-1001',
    joinDate: null,
    emergencyContact: '',
    emergencyPhone: '',
    bio: '',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(2),
  }

  const manager = {
    _id: 'demo-manager',
    name: 'Demo Manager',
    email: 'manager@test.com',
    password: passwordHash,
    role: 'manager',
    leaveBalance: { sick: 10, casual: 5, vacation: 5 },
    phone: '',
    department: 'Engineering',
    designation: 'Engineering Manager',
    dateOfBirth: null,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employeeId: 'MGR-1001',
    joinDate: null,
    emergencyContact: '',
    emergencyPhone: '',
    bio: '',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  }

  const leaves = [
    {
      _id: nextId(),
      user: employee._id,
      leaveType: 'vacation',
      startDate: daysAgo(12),
      endDate: daysAgo(11),
      totalDays: 2,
      reason: 'Family vacation planned',
      status: 'approved',
      managerComment: 'Approved. Enjoy your time off.',
      createdAt: daysAgo(13),
      updatedAt: daysAgo(12),
    },
    {
      _id: nextId(),
      user: employee._id,
      leaveType: 'casual',
      startDate: daysAgo(6),
      endDate: daysAgo(6),
      totalDays: 1,
      reason: 'Personal errands and appointments',
      status: 'rejected',
      managerComment: 'Rejected - urgent deliverable pending.',
      createdAt: daysAgo(7),
      updatedAt: daysAgo(6),
    },
    {
      _id: nextId(),
      user: employee._id,
      leaveType: 'sick',
      startDate: daysFromNow(1),
      endDate: daysFromNow(1),
      totalDays: 1,
      reason: 'Feeling unwell, need to rest and recover',
      status: 'pending',
      managerComment: '',
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
    {
      _id: nextId(),
      user: employee._id,
      leaveType: 'casual',
      startDate: daysFromNow(8),
      endDate: daysFromNow(8),
      totalDays: 1,
      reason: 'Family event to attend',
      status: 'approved',
      managerComment: 'Approved as requested.',
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
    },
  ]

  return {
    users: [employee, manager],
    leaves,
  }
}

const ensureStore = () => {
  if (!globalThis.__leaveMgmtDemoStore) {
    persistStore(createSeedState())
  }
  return globalThis.__leaveMgmtDemoStore
}

const createUserRecord = async (payload) => {
  const now = new Date()
  const store = ensureStore()
  const record = {
    _id: payload._id || nextId(),
    name: payload.name,
    email: String(payload.email).toLowerCase(),
    password: payload.password,
    role: payload.role || 'employee',
    leaveBalance: payload.leaveBalance ? clone(payload.leaveBalance) : { ...DEFAULT_LEAVE_BALANCE },
    phone: payload.phone || '',
    department: payload.department || '',
    designation: payload.designation || '',
    dateOfBirth: payload.dateOfBirth ?? null,
    address: payload.address || '',
    city: payload.city || '',
    state: payload.state || '',
    zipCode: payload.zipCode || '',
    employeeId: payload.employeeId || '',
    joinDate: payload.joinDate ?? null,
    emergencyContact: payload.emergencyContact || '',
    emergencyPhone: payload.emergencyPhone || '',
    bio: payload.bio || '',
    createdAt: payload.createdAt || now,
    updatedAt: now,
  }

  store.users.push(record)
  return createUserDoc(record)
}

const createLeaveRecord = async (payload) => {
  const now = new Date()
  const store = ensureStore()
  const record = {
    _id: payload._id || nextId(),
    user: typeof payload.user === 'object' && payload.user?._id ? payload.user._id : payload.user,
    leaveType: payload.leaveType,
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
    totalDays: payload.totalDays,
    reason: payload.reason,
    status: payload.status || 'pending',
    managerComment: payload.managerComment || '',
    createdAt: payload.createdAt ? new Date(payload.createdAt) : now,
    updatedAt: now,
  }

  store.leaves.push(record)
  return createLeaveDoc(record)
}

const findByIdAndUpdateRecord = async (id, update) => {
  const store = ensureStore()
  const index = store.users.findIndex((user) => user._id === id)
  if (index < 0) return null

  const existing = store.users[index]
  const next = {
    ...existing,
    ...clone(update),
    updatedAt: new Date(),
  }

  store.users[index] = next
  return createUserDoc(next)
}

const deleteManyRecords = async (collection) => {
  const store = ensureStore()

  if (collection === 'users') {
    store.users = []
    return { acknowledged: true, deletedCount: 0 }
  }

  if (collection === 'leaves') {
    store.leaves = []
    return { acknowledged: true, deletedCount: 0 }
  }

  return { acknowledged: true, deletedCount: 0 }
}

const countDocumentsRecord = async (collection, filter = {}) => {
  const store = ensureStore()
  const source = collection === 'users' ? store.users : store.leaves
  return source.filter((doc) => matchesFilter(doc, filter)).length
}

const aggregateLeaves = async (pipeline = []) => {
  const store = ensureStore()
  const groupStage = pipeline.find((stage) => stage.$group)
  if (!groupStage) {
    return []
  }

  const groupField = groupStage.$group._id?.replace('$', '')
  if (!groupField) {
    return []
  }

  const grouped = store.leaves.reduce((acc, leave) => {
    const key = leave[groupField]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([key, count]) => ({ _id: key, count }))
}

const createDemoModel = (collection) => ({
  findOne: (filter = {}) => new DemoQuery(collection, filter, true),
  findById: (id) => new DemoQuery(collection, { _id: id }, true),
  find: (filter = {}) => new DemoQuery(collection, filter, false),
  create: async (payload) => {
    if (collection === 'users') {
      return createUserRecord(payload)
    }
    if (collection === 'leaves') {
      return createLeaveRecord(payload)
    }
    throw new Error(`Unsupported demo collection: ${collection}`)
  },
  deleteMany: async () => deleteManyRecords(collection),
  countDocuments: async (filter = {}) => countDocumentsRecord(collection, filter),
  aggregate: async (pipeline = []) => (collection === 'leaves' ? aggregateLeaves(pipeline) : []),
  findByIdAndUpdate: async (id, update) => findByIdAndUpdateRecord(id, update),
})

export const isDemoMode = () => globalThis.__leaveMgmtDemoMode === true

export const createModelProxy = (mongooseModel, collection) => {
  const demoModel = createDemoModel(collection)

  return new Proxy(mongooseModel, {
    get(target, prop, receiver) {
      if (!isDemoMode()) {
        return Reflect.get(target, prop, receiver)
      }

      if (prop in demoModel) {
        return demoModel[prop]
      }

      return Reflect.get(target, prop, receiver)
    },
  })
}

export const markDemoMode = () => {
  globalThis.__leaveMgmtDemoMode = true
}
