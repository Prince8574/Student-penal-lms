const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lms8574:VWRRf6SbOM4etUP6@lms.ts8knu5.mongodb.net/learnverse';

async function debugCourses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const coursesCollection = db.collection('courses');

    // Get all courses
    const allCourses = await coursesCollection.find({}).toArray();
    console.log(`\n📚 Total courses in database: ${allCourses.length}`);

    // Get published courses
    const publishedCourses = await coursesCollection.find({ 
      $or: [
        { status: 'published' },
        { isPublished: true }
      ]
    }).toArray();
    console.log(`✅ Published courses: ${publishedCourses.length}`);

    // Show sample courses
    console.log('\n📋 Sample courses:');
    allCourses.slice(0, 3).forEach((course, i) => {
      console.log(`\n${i + 1}. ${course.title}`);
      console.log(`   - ID: ${course._id}`);
      console.log(`   - Status: ${course.status}`);
      console.log(`   - isPublished: ${course.isPublished}`);
      console.log(`   - Category: ${course.category}`);
      console.log(`   - Level: ${course.level}`);
    });

    // Check filter used by student panel
    const studentPanelFilter = { status: 'published' };
    const studentPanelCourses = await coursesCollection.find(studentPanelFilter).toArray();
    console.log(`\n🎓 Courses matching student panel filter (status: 'published'): ${studentPanelCourses.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Debug complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugCourses();
