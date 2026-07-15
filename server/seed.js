require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');

const sampleVideos = [
  {
    title: 'Introduction to React',
    description: 'Learn the basics of React, including components, state, and props. This comprehensive tutorial covers everything you need to get started with React development.',
    thumbnail: '/thumbnails/How_To_Use_React_JS_ebe36dcaee.jpg',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 600
  },
  {
    title: 'JavaScript ES6 Features',
    description: 'Explore modern JavaScript features including arrow functions, destructuring, spread operator, and more. Master the latest JavaScript syntax.',
    thumbnail: '/thumbnails/OIP (6).jpg',
    videoUrl: '  https://youtu.be/rfObCuGLSek?si=xoR4oeXgcEmg5wFp', 
    duration: 720
  },
  {
    title: 'Node.js Fundamentals',
    description: 'Understand Node.js architecture, event loop, and how to build backend applications. Learn to create RESTful APIs with Express.',
    thumbnail: '/thumbnails/380534.png',
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
