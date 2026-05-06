require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Lead = require('../src/models/Lead');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});

    console.log('Cleared existing data');

    // Create test user
    const testUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    await testUser.save();
    console.log('Test user created: admin@example.com / password123');

    // Create sample leads
    const sampleLeads = [
      {
        leadName: 'John Smith',
        companyName: 'Tech Corp',
        email: 'john@techcorp.com',
        phone: '+1-555-0101',
        leadSource: 'Website',
        assignedSalesperson: 'John Doe',
        status: 'New',
        dealValue: 50000,
        notes: [],
      },
      {
        leadName: 'Jane Doe',
        companyName: 'Innovation Inc',
        email: 'jane@innovationinc.com',
        phone: '+1-555-0102',
        leadSource: 'LinkedIn',
        assignedSalesperson: 'Sarah Johnson',
        status: 'Contacted',
        dealValue: 75000,
        notes: [],
      },
      {
        leadName: 'Michael Johnson',
        companyName: 'Global Ventures',
        email: 'michael@globalventures.com',
        phone: '+1-555-0103',
        leadSource: 'Referral',
        assignedSalesperson: 'John Doe',
        status: 'Qualified',
        dealValue: 100000,
        notes: [],
      },
      {
        leadName: 'Emily Wilson',
        companyName: 'Enterprise Solutions',
        email: 'emily@enterprise.com',
        phone: '+1-555-0104',
        leadSource: 'Cold Email',
        assignedSalesperson: 'Sarah Johnson',
        status: 'Proposal Sent',
        dealValue: 150000,
        notes: [],
      },
      {
        leadName: 'David Brown',
        companyName: 'Success Group',
        email: 'david@successgroup.com',
        phone: '+1-555-0105',
        leadSource: 'Event',
        assignedSalesperson: 'John Doe',
        status: 'Won',
        dealValue: 200000,
        notes: [],
      },
      {
        leadName: 'Lisa Anderson',
        companyName: 'Future Tech',
        email: 'lisa@futuretech.com',
        phone: '+1-555-0106',
        leadSource: 'Website',
        assignedSalesperson: 'Sarah Johnson',
        status: 'Lost',
        dealValue: 50000,
        notes: [],
      },
    ];

    await Lead.insertMany(sampleLeads);
    console.log('Sample leads created');

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(() => {
  seedDatabase();
});
