import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { LeaveRequest } from '../models/LeaveRequest.js'
import { DEFAULT_LEAVE_BALANCE } from '../utils/constants.js'

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://root:123@cluster.03mpd0q.mongodb.net/?appName=Cluster'
const MONGO_DB = process.env.MONGO_DB || 'leave_mgmt'

// Departments and designations for variety
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product', 'Support', 'Legal']
const designations = ['Junior Developer', 'Senior Developer', 'Team Lead', 'Manager', 'Analyst', 'Executive', 'Specialist', 'Coordinator', 'Associate', 'Director']

// Helper function to generate random leave balance
const randomLeaveBalance = () => ({
  sick: Math.floor(Math.random() * 6) + 5,    // 5-10
  casual: Math.floor(Math.random() * 4) + 2,   // 2-5
  vacation: Math.floor(Math.random() * 5) + 1  // 1-5
})

// Sample employees data - Original 10 employees
const employees = [
  {
    name: 'Chris',
    email: 'chris@gmail.com',
    password: 'chris123',
    role: 'employee',
    department: 'Engineering',
    designation: 'Senior Developer',
    leaveBalance: { sick: 8, casual: 3, vacation: 4 }
  },
  {
    name: 'Sarah',
    email: 'sarah@gmail.com',
    password: 'sarah123',
    role: 'employee',
    department: 'Marketing',
    designation: 'Marketing Manager',
    leaveBalance: { sick: 10, casual: 5, vacation: 2 }
  },
  {
    name: 'Michael',
    email: 'michael@gmail.com',
    password: 'michael123',
    role: 'employee',
    department: 'Sales',
    designation: 'Sales Executive',
    leaveBalance: { sick: 6, casual: 4, vacation: 5 }
  },
  {
    name: 'Emily',
    email: 'emily@gmail.com',
    password: 'emily123',
    role: 'employee',
    department: 'HR',
    designation: 'HR Specialist',
    leaveBalance: { sick: 10, casual: 2, vacation: 3 }
  },
  {
    name: 'Robert',
    email: 'robert@gmail.com',
    password: 'robert123',
    role: 'employee',
    department: 'Finance',
    designation: 'Financial Analyst',
    leaveBalance: { sick: 7, casual: 5, vacation: 5 }
  },
  {
    name: 'Amanda',
    email: 'amanda@gmail.com',
    password: 'amanda123',
    role: 'employee',
    department: 'Operations',
    designation: 'Operations Coordinator',
    leaveBalance: { sick: 9, casual: 4, vacation: 1 }
  },
  {
    name: 'David',
    email: 'david@gmail.com',
    password: 'david123',
    role: 'employee',
    department: 'Engineering',
    designation: 'Junior Developer',
    leaveBalance: { sick: 10, casual: 5, vacation: 5 }
  },
  {
    name: 'Jessica',
    email: 'jessica@gmail.com',
    password: 'jessica123',
    role: 'employee',
    department: 'Design',
    designation: 'UI/UX Designer',
    leaveBalance: { sick: 5, casual: 3, vacation: 4 }
  },
  {
    name: 'John',
    email: 'john@gmail.com',
    password: 'john123',
    role: 'employee',
    department: 'Product',
    designation: 'Product Manager',
    leaveBalance: { sick: 8, casual: 5, vacation: 2 }
  },
  {
    name: 'Lisa',
    email: 'lisa@gmail.com',
    password: 'lisa123',
    role: 'employee',
    department: 'Support',
    designation: 'Customer Support Lead',
    leaveBalance: { sick: 10, casual: 1, vacation: 5 }
  },
  // Additional 50 employees
  { name: 'James Wilson', email: 'james.wilson@gmail.com', password: 'james123', role: 'employee', department: 'Engineering', designation: 'Senior Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Emma Thompson', email: 'emma.thompson@gmail.com', password: 'emma123', role: 'employee', department: 'Marketing', designation: 'Marketing Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Daniel Brown', email: 'daniel.brown@gmail.com', password: 'daniel123', role: 'employee', department: 'Sales', designation: 'Sales Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Olivia Garcia', email: 'olivia.garcia@gmail.com', password: 'olivia123', role: 'employee', department: 'HR', designation: 'HR Coordinator', leaveBalance: randomLeaveBalance() },
  { name: 'William Martinez', email: 'william.martinez@gmail.com', password: 'william123', role: 'employee', department: 'Finance', designation: 'Senior Accountant', leaveBalance: randomLeaveBalance() },
  { name: 'Sophia Anderson', email: 'sophia.anderson@gmail.com', password: 'sophia123', role: 'employee', department: 'Engineering', designation: 'DevOps Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Alexander Taylor', email: 'alex.taylor@gmail.com', password: 'alex123', role: 'employee', department: 'Product', designation: 'Product Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Isabella Thomas', email: 'isabella.thomas@gmail.com', password: 'isabella123', role: 'employee', department: 'Design', designation: 'Graphic Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Benjamin Jackson', email: 'ben.jackson@gmail.com', password: 'ben123', role: 'employee', department: 'Operations', designation: 'Operations Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Mia White', email: 'mia.white@gmail.com', password: 'mia123', role: 'employee', department: 'Support', designation: 'Technical Support', leaveBalance: randomLeaveBalance() },
  { name: 'Ethan Harris', email: 'ethan.harris@gmail.com', password: 'ethan123', role: 'employee', department: 'Engineering', designation: 'Backend Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Charlotte Clark', email: 'charlotte.clark@gmail.com', password: 'charlotte123', role: 'employee', department: 'Marketing', designation: 'Content Writer', leaveBalance: randomLeaveBalance() },
  { name: 'Mason Lewis', email: 'mason.lewis@gmail.com', password: 'mason123', role: 'employee', department: 'Sales', designation: 'Account Executive', leaveBalance: randomLeaveBalance() },
  { name: 'Amelia Robinson', email: 'amelia.robinson@gmail.com', password: 'amelia123', role: 'employee', department: 'HR', designation: 'Talent Acquisition', leaveBalance: randomLeaveBalance() },
  { name: 'Lucas Walker', email: 'lucas.walker@gmail.com', password: 'lucas123', role: 'employee', department: 'Finance', designation: 'Budget Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Harper Young', email: 'harper.young@gmail.com', password: 'harper123', role: 'employee', department: 'Engineering', designation: 'Frontend Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Jacob King', email: 'jacob.king@gmail.com', password: 'jacob123', role: 'employee', department: 'Product', designation: 'Scrum Master', leaveBalance: randomLeaveBalance() },
  { name: 'Evelyn Wright', email: 'evelyn.wright@gmail.com', password: 'evelyn123', role: 'employee', department: 'Design', designation: 'Product Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Logan Scott', email: 'logan.scott@gmail.com', password: 'logan123', role: 'employee', department: 'Operations', designation: 'Logistics Coordinator', leaveBalance: randomLeaveBalance() },
  { name: 'Abigail Green', email: 'abigail.green@gmail.com', password: 'abigail123', role: 'employee', department: 'Support', designation: 'Help Desk Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Aiden Adams', email: 'aiden.adams@gmail.com', password: 'aiden123', role: 'employee', department: 'Engineering', designation: 'Full Stack Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Ella Baker', email: 'ella.baker@gmail.com', password: 'ella123', role: 'employee', department: 'Marketing', designation: 'SEO Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Sebastian Nelson', email: 'sebastian.nelson@gmail.com', password: 'sebastian123', role: 'employee', department: 'Sales', designation: 'Business Development', leaveBalance: randomLeaveBalance() },
  { name: 'Avery Hill', email: 'avery.hill@gmail.com', password: 'avery123', role: 'employee', department: 'HR', designation: 'Training Coordinator', leaveBalance: randomLeaveBalance() },
  { name: 'Carter Ramirez', email: 'carter.ramirez@gmail.com', password: 'carter123', role: 'employee', department: 'Finance', designation: 'Payroll Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Sofia Campbell', email: 'sofia.campbell@gmail.com', password: 'sofia123', role: 'employee', department: 'Engineering', designation: 'QA Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Owen Mitchell', email: 'owen.mitchell@gmail.com', password: 'owen123', role: 'employee', department: 'Product', designation: 'Business Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Scarlett Roberts', email: 'scarlett.roberts@gmail.com', password: 'scarlett123', role: 'employee', department: 'Design', designation: 'Motion Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Jack Turner', email: 'jack.turner@gmail.com', password: 'jack123', role: 'employee', department: 'Operations', designation: 'Supply Chain Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Victoria Phillips', email: 'victoria.phillips@gmail.com', password: 'victoria123', role: 'employee', department: 'Support', designation: 'Customer Success', leaveBalance: randomLeaveBalance() },
  { name: 'Liam Evans', email: 'liam.evans@gmail.com', password: 'liam123', role: 'employee', department: 'Engineering', designation: 'Mobile Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Grace Edwards', email: 'grace.edwards@gmail.com', password: 'grace123', role: 'employee', department: 'Marketing', designation: 'Brand Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Noah Collins', email: 'noah.collins@gmail.com', password: 'noah123', role: 'employee', department: 'Sales', designation: 'Regional Sales Rep', leaveBalance: randomLeaveBalance() },
  { name: 'Chloe Stewart', email: 'chloe.stewart@gmail.com', password: 'chloe123', role: 'employee', department: 'HR', designation: 'Benefits Administrator', leaveBalance: randomLeaveBalance() },
  { name: 'Henry Sanchez', email: 'henry.sanchez@gmail.com', password: 'henry123', role: 'employee', department: 'Finance', designation: 'Tax Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Zoey Morris', email: 'zoey.morris@gmail.com', password: 'zoey123', role: 'employee', department: 'Engineering', designation: 'Data Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Samuel Rogers', email: 'samuel.rogers@gmail.com', password: 'samuel123', role: 'employee', department: 'Product', designation: 'Technical Writer', leaveBalance: randomLeaveBalance() },
  { name: 'Lily Reed', email: 'lily.reed@gmail.com', password: 'lily123', role: 'employee', department: 'Design', designation: 'Illustrator', leaveBalance: randomLeaveBalance() },
  { name: 'Ryan Cook', email: 'ryan.cook@gmail.com', password: 'ryan123', role: 'employee', department: 'Operations', designation: 'Facilities Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Hannah Morgan', email: 'hannah.morgan@gmail.com', password: 'hannah123', role: 'employee', department: 'Support', designation: 'Support Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Wyatt Bell', email: 'wyatt.bell@gmail.com', password: 'wyatt123', role: 'employee', department: 'Engineering', designation: 'Cloud Architect', leaveBalance: randomLeaveBalance() },
  { name: 'Aria Murphy', email: 'aria.murphy@gmail.com', password: 'aria123', role: 'employee', department: 'Marketing', designation: 'Social Media Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Matthew Bailey', email: 'matthew.bailey@gmail.com', password: 'matthew123', role: 'employee', department: 'Sales', designation: 'Inside Sales Rep', leaveBalance: randomLeaveBalance() },
  { name: 'Natalie Rivera', email: 'natalie.rivera@gmail.com', password: 'natalie123', role: 'employee', department: 'HR', designation: 'Compensation Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Joseph Cooper', email: 'joseph.cooper@gmail.com', password: 'joseph123', role: 'employee', department: 'Finance', designation: 'Investment Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Riley Richardson', email: 'riley.richardson@gmail.com', password: 'riley123', role: 'employee', department: 'Engineering', designation: 'Security Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Layla Cox', email: 'layla.cox@gmail.com', password: 'layla123', role: 'employee', department: 'Product', designation: 'UX Researcher', leaveBalance: randomLeaveBalance() },
  { name: 'Dylan Howard', email: 'dylan.howard@gmail.com', password: 'dylan123', role: 'employee', department: 'Design', designation: 'Creative Director', leaveBalance: randomLeaveBalance() },
  { name: 'Nora Ward', email: 'nora.ward@gmail.com', password: 'nora123', role: 'employee', department: 'Operations', designation: 'Project Coordinator', leaveBalance: randomLeaveBalance() },
  { name: 'Luke Torres', email: 'luke.torres@gmail.com', password: 'luke123', role: 'employee', department: 'Support', designation: 'IT Support', leaveBalance: randomLeaveBalance() },
  // Additional 50 more employees (batch 2)
  { name: 'Zoe Parker', email: 'zoe.parker@gmail.com', password: 'zoe123', role: 'employee', department: 'Engineering', designation: 'Software Architect', leaveBalance: randomLeaveBalance() },
  { name: 'Nathan Foster', email: 'nathan.foster@gmail.com', password: 'nathan123', role: 'employee', department: 'Marketing', designation: 'Digital Marketing Lead', leaveBalance: randomLeaveBalance() },
  { name: 'Aubrey Hayes', email: 'aubrey.hayes@gmail.com', password: 'aubrey123', role: 'employee', department: 'Sales', designation: 'Enterprise Sales', leaveBalance: randomLeaveBalance() },
  { name: 'Caleb Brooks', email: 'caleb.brooks@gmail.com', password: 'caleb123', role: 'employee', department: 'HR', designation: 'Employee Relations', leaveBalance: randomLeaveBalance() },
  { name: 'Stella Price', email: 'stella.price@gmail.com', password: 'stella123', role: 'employee', department: 'Finance', designation: 'Controller', leaveBalance: randomLeaveBalance() },
  { name: 'Isaac Bennett', email: 'isaac.bennett@gmail.com', password: 'isaac123', role: 'employee', department: 'Engineering', designation: 'Platform Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Aurora Wood', email: 'aurora.wood@gmail.com', password: 'aurora123', role: 'employee', department: 'Product', designation: 'Product Owner', leaveBalance: randomLeaveBalance() },
  { name: 'Eli Barnes', email: 'eli.barnes@gmail.com', password: 'eli123', role: 'employee', department: 'Design', designation: 'Visual Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Hazel Ross', email: 'hazel.ross@gmail.com', password: 'hazel123', role: 'employee', department: 'Operations', designation: 'Vendor Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Jayden Henderson', email: 'jayden.henderson@gmail.com', password: 'jayden123', role: 'employee', department: 'Support', designation: 'Escalation Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Violet Coleman', email: 'violet.coleman@gmail.com', password: 'violet123', role: 'employee', department: 'Engineering', designation: 'Site Reliability Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Leo Jenkins', email: 'leo.jenkins@gmail.com', password: 'leo123', role: 'employee', department: 'Marketing', designation: 'PR Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Paisley Perry', email: 'paisley.perry@gmail.com', password: 'paisley123', role: 'employee', department: 'Sales', designation: 'Channel Partner Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Adrian Powell', email: 'adrian.powell@gmail.com', password: 'adrian123', role: 'employee', department: 'HR', designation: 'HRIS Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Skylar Long', email: 'skylar.long@gmail.com', password: 'skylar123', role: 'employee', department: 'Finance', designation: 'Treasury Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Grayson Patterson', email: 'grayson.patterson@gmail.com', password: 'grayson123', role: 'employee', department: 'Engineering', designation: 'ML Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Savannah Hughes', email: 'savannah.hughes@gmail.com', password: 'savannah123', role: 'employee', department: 'Product', designation: 'Growth Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Julian Flores', email: 'julian.flores@gmail.com', password: 'julian123', role: 'employee', department: 'Design', designation: 'Brand Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Claire Washington', email: 'claire.washington@gmail.com', password: 'claire123', role: 'employee', department: 'Operations', designation: 'Compliance Officer', leaveBalance: randomLeaveBalance() },
  { name: 'Lincoln Butler', email: 'lincoln.butler@gmail.com', password: 'lincoln123', role: 'employee', department: 'Support', designation: 'Knowledge Base Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Bella Simmons', email: 'bella.simmons@gmail.com', password: 'bella123', role: 'employee', department: 'Engineering', designation: 'Integration Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Hudson Foster', email: 'hudson.foster@gmail.com', password: 'hudson123', role: 'employee', department: 'Marketing', designation: 'Events Coordinator', leaveBalance: randomLeaveBalance() },
  { name: 'Lucy Gonzales', email: 'lucy.gonzales@gmail.com', password: 'lucy123', role: 'employee', department: 'Sales', designation: 'Solution Architect', leaveBalance: randomLeaveBalance() },
  { name: 'Jaxon Bryant', email: 'jaxon.bryant@gmail.com', password: 'jaxon123', role: 'employee', department: 'HR', designation: 'Diversity Officer', leaveBalance: randomLeaveBalance() },
  { name: 'Addison Alexander', email: 'addison.alexander@gmail.com', password: 'addison123', role: 'employee', department: 'Finance', designation: 'FP&A Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Levi Russell', email: 'levi.russell@gmail.com', password: 'levi123', role: 'employee', department: 'Engineering', designation: 'Database Administrator', leaveBalance: randomLeaveBalance() },
  { name: 'Brooklyn Griffin', email: 'brooklyn.griffin@gmail.com', password: 'brooklyn123', role: 'employee', department: 'Product', designation: 'Roadmap Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Eliana Diaz', email: 'eliana.diaz@gmail.com', password: 'eliana123', role: 'employee', department: 'Design', designation: 'Accessibility Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Christian Hayes', email: 'christian.hayes@gmail.com', password: 'christian123', role: 'employee', department: 'Operations', designation: 'Risk Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Madelyn Myers', email: 'madelyn.myers@gmail.com', password: 'madelyn123', role: 'employee', department: 'Support', designation: 'Training Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Asher Ford', email: 'asher.ford@gmail.com', password: 'asher123', role: 'employee', department: 'Engineering', designation: 'Embedded Systems', leaveBalance: randomLeaveBalance() },
  { name: 'Peyton Hamilton', email: 'peyton.hamilton@gmail.com', password: 'peyton123', role: 'employee', department: 'Marketing', designation: 'Copywriter', leaveBalance: randomLeaveBalance() },
  { name: 'Naomi Graham', email: 'naomi.graham@gmail.com', password: 'naomi123', role: 'employee', department: 'Sales', designation: 'Pre-Sales Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Ezra Sullivan', email: 'ezra.sullivan@gmail.com', password: 'ezra123', role: 'employee', department: 'HR', designation: 'Recruiter', leaveBalance: randomLeaveBalance() },
  { name: 'Ellie West', email: 'ellie.west@gmail.com', password: 'ellie123', role: 'employee', department: 'Finance', designation: 'Billing Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Colton Jordan', email: 'colton.jordan@gmail.com', password: 'colton123', role: 'employee', department: 'Engineering', designation: 'Automation Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Aaliyah Owens', email: 'aaliyah.owens@gmail.com', password: 'aaliyah123', role: 'employee', department: 'Product', designation: 'Data Product Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Cameron Reynolds', email: 'cameron.reynolds@gmail.com', password: 'cameron123', role: 'employee', department: 'Design', designation: 'Interaction Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Kinsley Fisher', email: 'kinsley.fisher@gmail.com', password: 'kinsley123', role: 'employee', department: 'Operations', designation: 'Process Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Carson Ellis', email: 'carson.ellis@gmail.com', password: 'carson123', role: 'employee', department: 'Support', designation: 'QA Support', leaveBalance: randomLeaveBalance() },
  { name: 'Maya Harrison', email: 'maya.harrison@gmail.com', password: 'maya123', role: 'employee', department: 'Engineering', designation: 'Systems Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Dominic Gibson', email: 'dominic.gibson@gmail.com', password: 'dominic123', role: 'employee', department: 'Marketing', designation: 'Affiliate Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Ruby McDonald', email: 'ruby.mcdonald@gmail.com', password: 'ruby123', role: 'employee', department: 'Sales', designation: 'Territory Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Ian Cruz', email: 'ian.cruz@gmail.com', password: 'ian123', role: 'employee', department: 'HR', designation: 'Onboarding Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Serenity Marshall', email: 'serenity.marshall@gmail.com', password: 'serenity123', role: 'employee', department: 'Finance', designation: 'Credit Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Josiah Ortiz', email: 'josiah.ortiz@gmail.com', password: 'josiah123', role: 'employee', department: 'Engineering', designation: 'Release Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Nevaeh Gomez', email: 'nevaeh.gomez@gmail.com', password: 'nevaeh123', role: 'employee', department: 'Product', designation: 'Analytics Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Everett Murray', email: 'everett.murray@gmail.com', password: 'everett123', role: 'employee', department: 'Design', designation: 'Design Systems', leaveBalance: randomLeaveBalance() },
  { name: 'Willow Freeman', email: 'willow.freeman@gmail.com', password: 'willow123', role: 'employee', department: 'Operations', designation: 'Quality Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Miles Wells', email: 'miles.wells@gmail.com', password: 'miles123', role: 'employee', department: 'Support', designation: 'Community Manager', leaveBalance: randomLeaveBalance() },
  // Additional 40 more employees (batch 3)
  { name: 'Penelope Webb', email: 'penelope.webb@gmail.com', password: 'penelope123', role: 'employee', department: 'Engineering', designation: 'API Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Xavier Simpson', email: 'xavier.simpson@gmail.com', password: 'xavier123', role: 'employee', department: 'Marketing', designation: 'Growth Hacker', leaveBalance: randomLeaveBalance() },
  { name: 'Mackenzie Stevens', email: 'mackenzie.stevens@gmail.com', password: 'mackenzie123', role: 'employee', department: 'Sales', designation: 'Sales Ops', leaveBalance: randomLeaveBalance() },
  { name: 'Roman Tucker', email: 'roman.tucker@gmail.com', password: 'roman123', role: 'employee', department: 'HR', designation: 'People Analytics', leaveBalance: randomLeaveBalance() },
  { name: 'Emilia Porter', email: 'emilia.porter@gmail.com', password: 'emilia123', role: 'employee', department: 'Finance', designation: 'Revenue Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Jameson Hunter', email: 'jameson.hunter@gmail.com', password: 'jameson123', role: 'employee', department: 'Engineering', designation: 'Performance Engineer', leaveBalance: randomLeaveBalance() },
  { name: 'Piper Hicks', email: 'piper.hicks@gmail.com', password: 'piper123', role: 'employee', department: 'Product', designation: 'Feature PM', leaveBalance: randomLeaveBalance() },
  { name: 'Greyson Dunn', email: 'greyson.dunn@gmail.com', password: 'greyson123', role: 'employee', department: 'Design', designation: 'Design Lead', leaveBalance: randomLeaveBalance() },
  { name: 'Quinn Crawford', email: 'quinn.crawford@gmail.com', password: 'quinn123', role: 'employee', department: 'Operations', designation: 'Inventory Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Axel Warren', email: 'axel.warren@gmail.com', password: 'axel123', role: 'employee', department: 'Support', designation: 'Tier 2 Support', leaveBalance: randomLeaveBalance() },
  { name: 'Genesis Snyder', email: 'genesis.snyder@gmail.com', password: 'genesis123', role: 'employee', department: 'Engineering', designation: 'Blockchain Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Silas Dixon', email: 'silas.dixon@gmail.com', password: 'silas123', role: 'employee', department: 'Marketing', designation: 'Campaign Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Clara Burns', email: 'clara.burns@gmail.com', password: 'clara123', role: 'employee', department: 'Sales', designation: 'Renewals Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Micah Gordon', email: 'micah.gordon@gmail.com', password: 'micah123', role: 'employee', department: 'HR', designation: 'Culture Lead', leaveBalance: randomLeaveBalance() },
  { name: 'Ivy Wheeler', email: 'ivy.wheeler@gmail.com', password: 'ivy123', role: 'employee', department: 'Finance', designation: 'Expense Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Easton Nichols', email: 'easton.nichols@gmail.com', password: 'easton123', role: 'employee', department: 'Engineering', designation: 'IoT Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Valentina Herrera', email: 'valentina.herrera@gmail.com', password: 'valentina123', role: 'employee', department: 'Product', designation: 'Innovation Lead', leaveBalance: randomLeaveBalance() },
  { name: 'Cooper Medina', email: 'cooper.medina@gmail.com', password: 'cooper123', role: 'employee', department: 'Design', designation: 'Service Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Emery Ryan', email: 'emery.ryan@gmail.com', password: 'emery123', role: 'employee', department: 'Operations', designation: 'Fleet Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Parker Fernandez', email: 'parker.fernandez@gmail.com', password: 'parker123', role: 'employee', department: 'Support', designation: 'VIP Support', leaveBalance: randomLeaveBalance() },
  { name: 'Rose Weaver', email: 'rose.weaver@gmail.com', password: 'rose123', role: 'employee', department: 'Engineering', designation: 'AR/VR Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Theo Daniels', email: 'theo.daniels@gmail.com', password: 'theo123', role: 'employee', department: 'Marketing', designation: 'Email Marketing', leaveBalance: randomLeaveBalance() },
  { name: 'Kennedy Lawson', email: 'kennedy.lawson@gmail.com', password: 'kennedy123', role: 'employee', department: 'Sales', designation: 'Quote Specialist', leaveBalance: randomLeaveBalance() },
  { name: 'Jasper Mills', email: 'jasper.mills@gmail.com', password: 'jasper123', role: 'employee', department: 'HR', designation: 'Exit Interview Spec', leaveBalance: randomLeaveBalance() },
  { name: 'Delilah Payne', email: 'delilah.payne@gmail.com', password: 'delilah123', role: 'employee', department: 'Finance', designation: 'Audit Analyst', leaveBalance: randomLeaveBalance() },
  { name: 'Harrison Black', email: 'harrison.black@gmail.com', password: 'harrison123', role: 'employee', department: 'Engineering', designation: 'Game Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Reagan Cruz', email: 'reagan.cruz@gmail.com', password: 'reagan123', role: 'employee', department: 'Product', designation: 'Localization PM', leaveBalance: randomLeaveBalance() },
  { name: 'Atlas Francis', email: 'atlas.francis@gmail.com', password: 'atlas123', role: 'employee', department: 'Design', designation: 'Prototype Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Autumn Fields', email: 'autumn.fields@gmail.com', password: 'autumn123', role: 'employee', department: 'Operations', designation: 'Sustainability Lead', leaveBalance: randomLeaveBalance() },
  { name: 'Declan Boyd', email: 'declan.boyd@gmail.com', password: 'declan123', role: 'employee', department: 'Support', designation: 'Documentation Lead', leaveBalance: randomLeaveBalance() },
  { name: 'Jade Stephens', email: 'jade.stephens@gmail.com', password: 'jade123', role: 'employee', department: 'Engineering', designation: 'Edge Computing Dev', leaveBalance: randomLeaveBalance() },
  { name: 'Felix Reyes', email: 'felix.reyes@gmail.com', password: 'felix123', role: 'employee', department: 'Marketing', designation: 'Podcast Producer', leaveBalance: randomLeaveBalance() },
  { name: 'Daisy Burke', email: 'daisy.burke@gmail.com', password: 'daisy123', role: 'employee', department: 'Sales', designation: 'Proposal Writer', leaveBalance: randomLeaveBalance() },
  { name: 'Maverick Garrett', email: 'maverick.garrett@gmail.com', password: 'maverick123', role: 'employee', department: 'HR', designation: 'Wellness Coordinator', leaveBalance: randomLeaveBalance() },
  { name: 'Lydia Hawkins', email: 'lydia.hawkins@gmail.com', password: 'lydia123', role: 'employee', department: 'Finance', designation: 'Cash Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Vincent Stone', email: 'vincent.stone@gmail.com', password: 'vincent123', role: 'employee', department: 'Engineering', designation: 'Kernel Developer', leaveBalance: randomLeaveBalance() },
  { name: 'Athena Moss', email: 'athena.moss@gmail.com', password: 'athena123', role: 'employee', department: 'Product', designation: 'Strategy Lead', leaveBalance: randomLeaveBalance() },
  { name: 'Dean Walters', email: 'dean.walters@gmail.com', password: 'dean123', role: 'employee', department: 'Design', designation: 'Research Designer', leaveBalance: randomLeaveBalance() },
  { name: 'Iris Pearson', email: 'iris.pearson@gmail.com', password: 'iris123', role: 'employee', department: 'Operations', designation: 'Dispatch Manager', leaveBalance: randomLeaveBalance() },
  { name: 'Damian Floyd', email: 'damian.floyd@gmail.com', password: 'damian123', role: 'employee', department: 'Support', designation: 'Enterprise Support', leaveBalance: randomLeaveBalance() }
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

// Function to subtract days from a date
const subtractDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
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
    'Back pain, doctor recommended rest',
    'High fever and body aches',
    'Stomach flu, need to stay home',
    'Eye infection, doctor advised rest',
    'Severe cold and congestion',
    'Allergic reaction, need medical attention',
    'Sprained ankle, difficult to commute',
    'Throat infection with fever',
    'General weakness and fatigue'
  ],
  casual: [
    'Personal errands and appointments',
    'Family event to attend',
    'Home maintenance work scheduled',
    'Moving to a new apartment',
    'Bank and government office visits',
    'Car service and repairs',
    'Attending a wedding',
    'Parent-teacher meeting at school',
    'Utility installation at home',
    'Legal documentation work',
    'House hunting and property visits',
    'Passport renewal appointment',
    'Driving license renewal',
    'Family reunion gathering',
    'Personal medical check-up'
  ],
  vacation: [
    'Family vacation planned',
    'Beach holiday trip',
    'Visiting relatives in another city',
    'Long weekend getaway',
    'Anniversary celebration trip',
    'International travel',
    'Staycation for mental health',
    'Mountain hiking trip',
    'Cruise vacation booked',
    'Theme park visit with family',
    'Cultural heritage tour',
    'Wildlife safari adventure',
    'Spa and wellness retreat',
    'Road trip with friends',
    'Festival celebration with family'
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
    'Granted. Wishing you a speedy recovery.',
    'Approved. Have a great vacation!',
    'Request approved. Enjoy your leave.',
    'Approved after reviewing workload.',
    'Granted. Please update your status on return.'
  ],
  rejected: [
    'Cannot approve due to critical project deadline.',
    'Please reschedule - team is short-staffed.',
    'Rejected - overlaps with another team member\'s leave.',
    'Insufficient leave balance for this request.',
    'Denied - urgent deliverable pending.',
    'Please apply for a different date.',
    'Rejected - training session scheduled on these dates.',
    'Cannot approve - client meeting on these days.',
    'Please discuss with team before reapplying.',
    'Denied - quarter-end closing activities.'
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
    const yesterday = subtractDays(today, 1)
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const oneMonthAhead = new Date(today)
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1)

    let leaveCount = 0

    // Create regular leave requests for employees (2-3 per employee)
    for (const employee of createdEmployees) {
      const numRequests = Math.floor(Math.random() * 2) + 2 // 2-3 requests

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

    // Create additional ~300 leave requests with variety (some from yesterday)
    console.log('📝 Creating additional leave requests (including yesterday\'s requests)...')
    
    const additionalRequests = 300
    for (let i = 0; i < additionalRequests; i++) {
      const randomEmployee = createdEmployees[Math.floor(Math.random() * createdEmployees.length)]
      const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)]
      const totalDays = Math.floor(Math.random() * 5) + 1 // 1-5 days
      
      let startDate, status
      const dateChoice = Math.random()
      
      if (dateChoice < 0.25) {
        // 25% requests from yesterday
        startDate = yesterday
        status = Math.random() < 0.6 ? 'pending' : (Math.random() < 0.7 ? 'approved' : 'rejected')
      } else if (dateChoice < 0.5) {
        // 25% requests from today
        startDate = today
        status = 'pending'
      } else if (dateChoice < 0.75) {
        // 25% past requests
        startDate = randomDate(threeMonthsAgo, subtractDays(today, 2))
        const rand = Math.random()
        if (rand < 0.65) status = 'approved'
        else if (rand < 0.9) status = 'rejected'
        else status = 'pending'
      } else {
        // 25% future requests
        startDate = randomDate(addDays(today, 1), oneMonthAhead)
        status = Math.random() > 0.4 ? 'pending' : 'approved'
      }
      
      const endDate = addDays(startDate, totalDays - 1)

      const leaveRequest = {
        user: randomEmployee._id,
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

    console.log(`   ✓ Created ${leaveCount} leave requests`)

    // Summary
    console.log('\n📊 Seed Summary:')
    console.log(`   • Employees created: ${createdEmployees.length}`)
    console.log(`   • Leave requests: ${leaveCount}`)
    
    console.log('\n🔑 Sample Login Credentials (first 10):')
    employees.slice(0, 10).forEach(emp => {
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
