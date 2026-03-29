/**
 * check-users.js
 * Run: node check-users.js
 *
 * Lists all users in the database with their key details.
 */

const { connectDB, disconnectDB } = require('./config/db');

async function checkUsers() {
  try {
    await connectDB();

    const User = require('./models/User');

    const users = await User.find({})
      .select('name email username role isVerified createdAt')
      .lean();

    console.log('\n📋 All Users in Database:');
    console.log('═'.repeat(50));

    if (users.length === 0) {
      console.log('❌ No users found in database.');
      console.log('📝 Run: node create-test-user.js  to create one.');
    } else {
      users.forEach((u, i) => {
        console.log(`\n${i + 1}. ${u.name}`);
        console.log(`   Email    : ${u.email}`);
        console.log(`   Username : ${u.username || 'N/A'}`);
        console.log(`   Role     : ${u.role}`);
        console.log(`   Verified : ${u.isVerified ? '✅ Yes' : '⏳ No'}`);
        console.log(`   Joined   : ${u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}`);
      });
      console.log(`\n${'═'.repeat(50)}`);
      console.log(`Total: ${users.length} user(s)\n`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

checkUsers();
