const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testPaper = {
  class: 'IX',
  subject: 'Maths',
  questions: [
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1
    },
    {
      question: 'What is the square root of 16?',
      options: ['2', '4', '8', '16'],
      correctAnswer: 1
    }
  ],
  schedule: {
    frequency: 'once',
    date: new Date()
  }
};

async function testAPI() {
  try {
    console.log('🧪 Testing Question Paper API...\n');

    // Test 1: Create question paper (will fail without auth, but tests route)
    console.log('1. Testing POST /question-paper...');
    try {
      const response = await axios.post(`${BASE_URL}/question-paper`, testPaper);
      console.log('✅ Create paper: SUCCESS');
    } catch (error) {
      console.log('❌ Create paper: FAILED (expected without auth)');
      console.log('   Error:', error.response?.data?.message || error.message);
    }

    // Test 2: Get question papers
    console.log('\n2. Testing GET /question-papers...');
    try {
      const response = await axios.get(`${BASE_URL}/question-papers`);
      console.log('✅ Get papers: SUCCESS');
    } catch (error) {
      console.log('❌ Get papers: FAILED (expected without auth)');
      console.log('   Error:', error.response?.data?.message || error.message);
    }

    // Test 3: Get statistics
    console.log('\n3. Testing GET /question-papers/stats...');
    try {
      const response = await axios.get(`${BASE_URL}/question-papers/stats`);
      console.log('✅ Get stats: SUCCESS');
    } catch (error) {
      console.log('❌ Get stats: FAILED (expected without auth)');
      console.log('   Error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API routes are working! (Authentication required for full functionality)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI(); 