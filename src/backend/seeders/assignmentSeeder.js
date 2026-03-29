const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const User = require('../models/User');
require('dotenv').config();

const seedAssignments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnverse');
    console.log('✅ MongoDB Connected');

    // Get instructor
    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.log('❌ No instructor found. Please run main seeder first.');
      process.exit(1);
    }

    // Get courses
    const courses = await Course.find().limit(3);
    if (courses.length === 0) {
      console.log('❌ No courses found. Please run main seeder first.');
      process.exit(1);
    }

    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log('🗑️  Cleared existing assignments');

    const assignments = [
      {
        title: 'Binary Search Tree — Full Implementation',
        description: 'Implement a complete Binary Search Tree with insert, delete, search, and all three traversal methods (in-order, pre-order, post-order). Include time complexity analysis in comments.',
        course: courses[0]._id,
        courseName: 'Data Structures & Algorithms',
        courseIcon: '🧮',
        courseColor: '#a855f7',
        type: 'Coding',
        points: 50,
        dueDate: new Date('2026-03-12'),
        dueTime: '11:59 PM',
        priority: 'high',
        requirements: [
          'BST class with all operations',
          'All traversal methods',
          'Unit tests using Jest',
          'README with complexity analysis',
          'GitHub repo link'
        ],
        maxFileSize: '50MB',
        allowedTypes: ['js', 'ts', 'zip', 'pdf'],
        estimatedTime: '4-6 hours',
        rubric: [
          { l: 'Correct BST insert/delete', p: 20 },
          { l: 'All traversals working', p: 15 },
          { l: 'Unit tests coverage', p: 10 },
          { l: 'Code quality & comments', p: 5 }
        ],
        createdBy: instructor._id
      },
      {
        title: 'ML Model Evaluation Report',
        description: 'Evaluate at least 3 classification models on the provided dataset. Include confusion matrices, precision, recall, F1-score, and ROC curves. Write a 1500-word analysis comparing model performance.',
        course: courses[1]._id,
        courseName: 'Machine Learning Fundamentals',
        courseIcon: '🤖',
        courseColor: '#3b82f6',
        type: 'Report',
        points: 30,
        dueDate: new Date('2026-03-14'),
        dueTime: '11:59 PM',
        priority: 'high',
        requirements: [
          'Min 3 classification models',
          'Confusion matrices for each model',
          'ROC curve comparison',
          '1500-word written analysis',
          'Jupyter notebook + PDF'
        ],
        maxFileSize: '100MB',
        allowedTypes: ['ipynb', 'pdf', 'zip'],
        estimatedTime: '6-8 hours',
        rubric: [
          { l: 'Model implementation', p: 12 },
          { l: 'Evaluation metrics', p: 10 },
          { l: 'Written analysis quality', p: 8 }
        ],
        createdBy: instructor._id
      },
      {
        title: 'ER Diagram for Hospital Management System',
        description: 'Design a complete Entity-Relationship diagram for a hospital management system covering patients, doctors, appointments, billing and pharmacy. Normalize up to 3NF and convert to relational schema.',
        course: courses[2]._id,
        courseName: 'Database Management Systems',
        courseIcon: '🗄️',
        courseColor: '#14b8a6',
        type: 'Design',
        points: 40,
        dueDate: new Date('2026-03-18'),
        dueTime: '11:59 PM',
        priority: 'medium',
        requirements: [
          'Complete ER diagram',
          'Relational schema',
          '3NF normalization proof',
          'SQL DDL statements',
          'PDF submission'
        ],
        maxFileSize: '20MB',
        allowedTypes: ['pdf', 'png', 'jpg'],
        estimatedTime: '3-5 hours',
        rubric: [
          { l: 'ER diagram correctness', p: 18 },
          { l: 'Normalization', p: 12 },
          { l: 'SQL DDL quality', p: 10 }
        ],
        createdBy: instructor._id
      },
      {
        title: 'Process Scheduling Simulation',
        description: 'Implement FCFS, SJF, and Round Robin scheduling algorithms. Simulate with given process sets and compare average turnaround time and waiting time. Generate Gantt charts.',
        course: courses[0]._id,
        courseName: 'Operating Systems',
        courseIcon: '⚙️',
        courseColor: '#f59e0b',
        type: 'Coding',
        points: 35,
        dueDate: new Date('2026-03-05'),
        dueTime: '11:59 PM',
        priority: 'low',
        requirements: [
          'All 3 scheduling algorithms',
          'Gantt chart visualization',
          'Performance comparison table',
          'Test with 3 different process sets'
        ],
        maxFileSize: '50MB',
        allowedTypes: ['py', 'pdf', 'zip'],
        estimatedTime: '5-7 hours',
        rubric: [
          { l: 'FCFS implementation', p: 10 },
          { l: 'SJF implementation', p: 10 },
          { l: 'Round Robin', p: 10 },
          { l: 'Visualization', p: 5 }
        ],
        createdBy: instructor._id
      },
      {
        title: 'Socket Programming — TCP Chat Application',
        description: 'Build a multi-client TCP chat application using Python sockets. Implement server-side broadcast, private messaging, and graceful disconnection handling.',
        course: courses[1]._id,
        courseName: 'Computer Networks',
        courseIcon: '🌐',
        courseColor: '#06b6d4',
        type: 'Coding',
        points: 45,
        dueDate: new Date('2026-02-28'),
        dueTime: '11:59 PM',
        priority: 'low',
        requirements: [
          'TCP server with multi-client support',
          'Broadcast messages',
          'Private messaging (@username)',
          'Graceful disconnection',
          'Demo video'
        ],
        maxFileSize: '200MB',
        allowedTypes: ['py', 'mp4', 'zip', 'md'],
        estimatedTime: '5-6 hours',
        rubric: [
          { l: 'Server implementation', p: 18 },
          { l: 'Private messaging', p: 12 },
          { l: 'Error handling', p: 10 },
          { l: 'Documentation', p: 5 }
        ],
        createdBy: instructor._id
      },
      {
        title: 'React Portfolio Website',
        description: 'Build a fully responsive personal portfolio website using React. Must include Projects section, Skills, About, Contact form with EmailJS. Deploy to Vercel or Netlify.',
        course: courses[2]._id,
        courseName: 'Full Stack Web Development',
        courseIcon: '💻',
        courseColor: '#3b82f6',
        type: 'Coding',
        points: 60,
        dueDate: new Date('2026-02-20'),
        dueTime: '11:59 PM',
        priority: 'low',
        requirements: [
          'React with hooks',
          'Responsive on all devices',
          'Contact form with EmailJS',
          'Deployed on Vercel/Netlify',
          'Animations with Framer Motion'
        ],
        maxFileSize: '100MB',
        allowedTypes: ['zip', 'txt', 'pdf'],
        estimatedTime: '8-12 hours',
        rubric: [
          { l: 'React code quality', p: 20 },
          { l: 'Responsive design', p: 15 },
          { l: 'Features complete', p: 15 },
          { l: 'Deployment', p: 10 }
        ],
        createdBy: instructor._id
      },
      {
        title: 'Cloud Cost Optimization Report',
        description: 'Analyze the provided AWS architecture diagram and identify at least 5 cost optimization opportunities. Provide estimated monthly savings and implementation steps for each.',
        course: courses[0]._id,
        courseName: 'AWS Solutions Architect',
        courseIcon: '☁️',
        courseColor: '#f0a500',
        type: 'Report',
        points: 25,
        dueDate: new Date('2026-03-22'),
        dueTime: '11:59 PM',
        priority: 'low',
        requirements: [
          'Min 5 optimization points',
          'Cost calculation for each',
          'Implementation guide',
          'Risk assessment',
          'Executive summary'
        ],
        maxFileSize: '20MB',
        allowedTypes: ['pdf', 'docx', 'pptx'],
        estimatedTime: '3-4 hours',
        rubric: [
          { l: 'Optimization quality', p: 12 },
          { l: 'Cost calculations', p: 8 },
          { l: 'Implementation clarity', p: 5 }
        ],
        createdBy: instructor._id
      },
      {
        title: 'Figma Design System Component Library',
        description: 'Create a complete design system in Figma with at least 40 components including buttons, inputs, cards, navigation, modals and data visualization elements. Include dark and light themes.',
        course: courses[1]._id,
        courseName: 'UI/UX Design',
        courseIcon: '🎨',
        courseColor: '#ec4899',
        type: 'Design',
        points: 55,
        dueDate: new Date('2026-03-25'),
        dueTime: '11:59 PM',
        priority: 'medium',
        requirements: [
          '40+ components',
          'Dark & light themes',
          'Component documentation',
          'Auto Layout usage',
          'Shareable Figma link'
        ],
        maxFileSize: '500MB',
        allowedTypes: ['fig', 'pdf', 'png'],
        estimatedTime: '10-14 hours',
        rubric: [
          { l: 'Component completeness', p: 20 },
          { l: 'Design quality', p: 18 },
          { l: 'Documentation', p: 12 },
          { l: 'Theme implementation', p: 5 }
        ],
        createdBy: instructor._id
      }
    ];

    await Assignment.insertMany(assignments);
    console.log(`✅ Created ${assignments.length} assignments`);

    mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedAssignments();
