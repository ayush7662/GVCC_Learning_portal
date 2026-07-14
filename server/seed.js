require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');

const sampleVideos = [
  {
    title: 'Introduction to React',
    description: 'Learn the basics of React, including components, state, and props. This comprehensive tutorial covers everything you need to get started with React development.',
    // thumbnail: "/thumbnails/OIP (6).jpg",
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 600
  },
  {
    title: 'JavaScript ES6 Features',
    description: 'Explore modern JavaScript features including arrow functions, destructuring, spread operator, and more. Master the latest JavaScript syntax.',
    thumbnail: 'https://via.placeholder.com/640x360/10B981/FFFFFF?text=ES6+Features',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 720
  },
  {
    title: 'Node.js Fundamentals',
    description: 'Understand Node.js architecture, event loop, and how to build backend applications. Learn to create RESTful APIs with Express.',
    thumbnail: 'https://via.placeholder.com/640x360/8B5CF6/FFFFFF?text=Node.js',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 900
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal');
    console.log('Connected to MongoDB');

    await Video.deleteMany({});
    console.log('Cleared existing videos');

    await Video.insertMany(sampleVideos);
    console.log('Inserted sample videos');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
