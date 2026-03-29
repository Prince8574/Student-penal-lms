/**
 * create-test-user.js
 * Run: node create-test-user.js
 *
 * Creates a verified test student account in the database.
 * Default credentials:
 *   Email    : test@learnverse.com
 *   Password : Test@1234
 */

const { connectDB, disconnectDB } = require('./config/db');

const TEST_USER = {
  name       : 'Test Student',
  email      : 'test@learnverse.com',
  username   : 'teststudent',
  password   : 'Test@1234',
  role       : 'student',
  isVerified : true,
};

async function createTestUser() {
  try {
    await connectDB();

    const User = require('./models/User');

    // Check if already exists
    const existing = await User.findOne({ email: TEST_USER.email });
    if (existing) {
      console.log('\nℹ️  Test user already exists:');
      console.log(`   Email    : ${TEST_USER.email}`);
      console.log(`   Password : ${TEST_USER.password}`);
      console.log(`   Verified : ${existing.isVerified ? '✅ Yes' : '⏳ No'}`);
      return;
    }

    const user = new User({
      name       : TEST_USER.name,
      email      : TEST_USER.email,
      username   : TEST_USER.username,
      password   : TEST_USER.password,  // pre('save') hook will hash this
      role       : TEST_USER.role,
      isVerified : TEST_USER.isVerified,
    });

    await user.save();

    console.log('\n✅ Test user created successfully!');
    console.log(`   Name     : ${TEST_USER.name}`);
    console.log(`   Email    : ${TEST_USER.email}`);
    console.log(`   Password : ${TEST_USER.password}`);
    console.log(`   Role     : ${TEST_USER.role}`);
    console.log('\n🚀 Login at http://localhost:3001\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.code === 11000) {
      console.error('   Duplicate key — user with this email/username already exists.');
    }
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

createTestUser();
