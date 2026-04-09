require('dotenv').config();
const { connectDB } = require('./config/db');

async function checkThumbnails() {
  try {
    await connectDB();
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    const courses = await db.collection('courses').find({ status: 'published' }).limit(3).toArray();
    
    console.log('\n📸 Checking thumbnails:\n');
    courses.forEach((course, i) => {
      console.log(`${i + 1}. ${course.title}`);
      console.log(`   Thumbnail: ${course.thumbnail || 'NOT SET'}`);
      console.log(`   PromoVideo: ${course.promoVideoUrl || 'NOT SET'}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkThumbnails();
