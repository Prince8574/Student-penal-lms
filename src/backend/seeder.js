/**
 * seeder.js
 * Seeds the database with sample categories and courses.
 *
 * Usage:
 *   node seeder.js -i   → Import sample data
 *   node seeder.js -d   → Delete all data
 */

const { connectDB, disconnectDB } = require('./config/db');
const Category = require('./models/Category');
const User     = require('./models/User');
const Course   = require('./models/Course');

const categories = [
  { name: 'Web Development',      slug: 'web-development',    icon: '💻', color: '#3b82f6', description: 'HTML, CSS, JavaScript, React, Node.js' },
  { name: 'AI & Machine Learning',slug: 'ai-machine-learning',icon: '🤖', color: '#a78bfa', description: 'AI, ML, Deep Learning, Data Science' },
  { name: 'Cloud & DevOps',       slug: 'cloud-devops',       icon: '☁️', color: '#f0a500', description: 'AWS, Azure, Docker, Kubernetes' },
  { name: 'UI/UX Design',         slug: 'ui-ux-design',       icon: '🎨', color: '#f472b6', description: 'Figma, User Research, Prototyping' },
  { name: 'Data Science',         slug: 'data-science',       icon: '📊', color: '#4ade80', description: 'Python, Pandas, SQL, Data Analysis' },
  { name: 'Mobile Development',   slug: 'mobile-development', icon: '📱', color: '#22d3ee', description: 'iOS, Android, React Native, Flutter' },
  { name: 'Cybersecurity',        slug: 'cybersecurity',      icon: '🔒', color: '#ef4444', description: 'Ethical Hacking, Network Security' },
  { name: 'Blockchain',           slug: 'blockchain',         icon: '⛓️', color: '#6366f1', description: 'Web3, Smart Contracts, DeFi' },
];

async function importData() {
  try {
    await connectDB();

    await Category.deleteMany();
    await Course.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories imported`);

    // Sample instructor
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.create({
        name: 'Admin Instructor',
        email: 'instructor@learnverse.com',
        password: 'Instructor@1234',  // pre('save') hook will hash this
        role: 'instructor',
        isVerified: true,
      });
      console.log('✅ Sample instructor created');
    }

    const sampleCourses = [
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js and build real-world projects',
        instructor: instructor._id,
        category: createdCategories[0]._id,
        level: 'Beginner',
        price: 2499,
        originalPrice: 8999,
        duration: '48h',
        tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        rating: 4.8,
        enrolledStudents: 15420,
        badge: 'Bestseller',
        status: 'published',
        isPublished: true,
      },
      {
        title: 'Machine Learning A-Z',
        description: 'Master Machine Learning with Python, TensorFlow and real-world projects',
        instructor: instructor._id,
        category: createdCategories[1]._id,
        level: 'Intermediate',
        price: 3299,
        originalPrice: 11999,
        duration: '62h',
        tags: ['Python', 'ML', 'TensorFlow', 'AI'],
        rating: 4.9,
        enrolledStudents: 8920,
        badge: 'Top Rated',
        status: 'published',
        isPublished: true,
      },
      {
        title: 'AWS Solutions Architect',
        description: 'Prepare for AWS certification and learn cloud architecture',
        instructor: instructor._id,
        category: createdCategories[2]._id,
        level: 'Advanced',
        price: 2799,
        originalPrice: 9499,
        duration: '36h',
        tags: ['AWS', 'Cloud', 'DevOps'],
        rating: 4.7,
        enrolledStudents: 12100,
        badge: 'Hot',
        status: 'published',
        isPublished: true,
      },
    ];

    await Course.insertMany(sampleCourses);
    console.log(`✅ ${sampleCourses.length} sample courses imported`);
    console.log('\n🎉 Data imported successfully!');

  } catch (err) {
    console.error('❌ Error importing data:', err.message);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

async function deleteData() {
  try {
    await connectDB();
    await Category.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log('✅ All data deleted');
  } catch (err) {
    console.error('❌ Error deleting data:', err.message);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

const arg = process.argv[2];
if (arg === '-i')      importData();
else if (arg === '-d') deleteData();
else {
  console.log('Usage:');
  console.log('  node seeder.js -i   Import sample data');
  console.log('  node seeder.js -d   Delete all data');
  process.exit(0);
}
