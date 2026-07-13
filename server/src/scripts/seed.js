import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { LeaveRequest } from '../models/LeaveRequest.js'
import { DEFAULT_LEAVE_BALANCE } from '../utils/constants.js'

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://root:123@cluster.03mpd0q.mongodb.net/?appName=Cluster'
const MONGO_DB = process.env.MONGO_DB || 'leave_mgmt'

// Sample employees data
const employees = [
  {
    name: 'Chris',
    email: 'chris@gmail.com',
    password: 'chris123',
    role: 'employee',
    leaveBalance: { sick: 8, casual: 3, vacation: 4 }
  },
  {
    name: 'Sarah',
    email: 'sarah@gmail.com',
    password: 'sarah123',
    role: 'employee',
    leaveBalance: { sick: 10, casual: 5, vacation: 2 }
  },
  {
    name: 'Michael',
    email: 'michael@gmail.com',
    password: 'michael123',
    role: 'employee',
    leaveBalance: { sick: 6, casual: 4, vacation: 5 }
  },
  {
    name: 'Emily',
    email: 'emily@gmail.com',
    password: 'emily123',
    role: 'employee',
    leaveBalance: { sick: 10, casual: 2, vacation: 3 }
  },
  {
    name: 'Robert',
    email: 'robert@gmail.com',
    password: 'robert123',
    role: 'employee',
    leaveBalance: { sick: 7, casual: 5, vacation: 5 }
  },
  {
    name: 'Amanda',
    email: 'amanda@gmail.com',
    password: 'amanda123',
    role: 'employee',
    leaveBalance: { sick: 9, casual: 4, vacation: 1 }
  },
  {
    name: 'David',
    email: 'david@gmail.com',
    password: 'david123',
    role: 'employee',
    leaveBalance: { sick: 10, casual: 5, vacation: 5 }
  },
  {
    name: 'Jessica',
    email: 'jessica@gmail.com',
    password: 'jessica123',
    role: 'employee',
    leaveBalance: { sick: 5, casual: 3, vacation: 4 }
  },
  {
    name: 'John',
    email: 'john@gmail.com',
    password: 'john123',
    role: 'employee',
    leaveBalance: { sick: 8, casual: 5, vacation: 2 }
  },
  {
    name: 'Lisa',
    email: 'lisa@gmail.com',
    password: 'lisa123',
    role: 'employee',
    leaveBalance: { sick: 10, casual: 1, vacation: 5 }
  }
]

// Function to generate random date within range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Sample leave reasons
const leaveReasons = {
  sick: [
    'Feeling unwell, need to rest and recover',
    'Doctor appointment and medical tests',
    'Flu symptoms, staying home to prevent spreading',
    'Dental surgery recovery',
    'Food poisoning, need rest',
    'Migraine, unable to work',
    'Back pain, doctor recommended rest'
  ],
  casual: [
    'Personal errands and appointments',
    'Family event to attend',
    'Home maintenance work scheduled',
    'Moving to a new apartment',
    'Bank and government office visits',
    'Car service and repairs',
    'Attending a wedding'
  ],
  vacation: [
    'Family vacation planned',
    'Beach holiday trip',
    'Visiting relatives in another city',
    'Long weekend getaway',
    'Anniversary celebration trip',
    'International travel',
    'Staycation for mental health'
  ]
}

const getRandomReason = (type) => {
  const reasons = leaveReasons[type]
  return reasons[Math.floor(Math.random() * reasons.length)]
}

const managerComments = {
  approved: [
    'Approved. Take care!',
    'Approved. Enjoy your time off.',
    'Approved as requested.',
    'Have a good break!',
    'Approved. Please ensure handover is done.',
  ],
  rejected: [
    'Cannot approve due to critical project deadline.',
    'Please reschedule - team is short-staffed.',
    'Rejected - overlaps with another team member\'s leave.',
    'Insufficient leave balance for this request.',
  ]
}

const seed = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB,
      serverSelectionTimeoutMS: 10000,
    })
    console.log('✅ Connected to MongoDB')

    // Clear existing data (optional - comment out to keep existing data)
    console.log('🧹 Clearing existing data...')
    await User.deleteMany({})
    await LeaveRequest.deleteMany({})

    // Create employees only (no managers)
    console.log('👥 Creating employees...')
    const createdEmployees = []
    for (const emp of employees) {
      const hashedPassword = await bcrypt.hash(emp.password, 10)
      const user = await User.create({
        ...emp,
        password: hashedPassword
      })
      createdEmployees.push(user)
      console.log(`   ✓ Employee: ${user.email} (password: ${emp.password})`)
    }

    // Create leave requests
    console.log('📝 Creating leave requests...')
    const leaveTypes = ['sick', 'casual', 'vacation']
    const statuses = ['pending', 'approved', 'rejected']
    
    const today = new Date()
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const oneMonthAhead = new Date(today)
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1)

    let leaveCount = 0

    for (const employee of createdEmployees) {
      // Each employee gets 2-4 leave requests
      const numRequests = Math.floor(Math.random() * 3) + 2

      for (let i = 0; i < numRequests; i++) {
        const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)]
        const totalDays = Math.floor(Math.random() * 3) + 1 // 1-3 days
        const startDate = randomDate(threeMonthsAgo, oneMonthAhead)
        const endDate = addDays(startDate, totalDays - 1)
        
        // Determine status based on date
        let status
        if (startDate > today) {
          // Future leaves are mostly pending
          status = Math.random() > 0.3 ? 'pending' : 'approved'
        } else {
          // Past leaves are mostly approved/rejected
          const rand = Math.random()
          if (rand < 0.6) status = 'approved'
          else if (rand < 0.85) status = 'rejected'
          else status = 'pending'
        }

        const leaveRequest = {
          user: employee._id,
          leaveType,
          startDate,
          endDate,
          totalDays,
          reason: getRandomReason(leaveType),
          status,
        }

        // Add manager comment for approved/rejected requests
        if (status === 'approved') {
          leaveRequest.managerComment = managerComments.approved[Math.floor(Math.random() * managerComments.approved.length)]
        } else if (status === 'rejected') {
          leaveRequest.managerComment = managerComments.rejected[Math.floor(Math.random() * managerComments.rejected.length)]
        }

        await LeaveRequest.create(leaveRequest)
        leaveCount++
      }
    }

    console.log(`   ✓ Created ${leaveCount} leave requests`)

    // Summary
    console.log('\n📊 Seed Summary:')
    console.log(`   • Employees created: ${createdEmployees.length}`)
    console.log(`   • Leave requests: ${leaveCount}`)
    
    console.log('\n🔑 Login Credentials:')
    employees.forEach(emp => {
      console.log(`   • ${emp.email} / ${emp.password}`)
    })

    console.log('\n✅ Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
