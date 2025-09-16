import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BookOpen, 
  Clock, 
  Target,
  ArrowLeft,
  Home,
  RefreshCw
} from 'lucide-react';

export default function Explanation() {
    const location = useLocation();
    const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const { 
    answers = {}, 
    questions = [], 
    testDetails = {},
    score = 0,
    timeTaken = 0
  } = location.state || {};

  // Detailed explanations for each question
    const explanations = {
    1: {
      text: 'A polynomial in one variable has only one type of variable, e.g., x. In this case, the expression contains only the variable x with different powers, making it a polynomial in one variable.',
      concept: 'Polynomials in One Variable',
      difficulty: 'Easy'
    },
    2: {
      text: 'An acute angle is less than 90°. Among the given options, 45° is the only angle that is less than 90°, making it the acute angle.',
      concept: 'Types of Angles',
      difficulty: 'Easy'
    },
    3: {
      text: 'Area of equilateral triangle using Heron\'s formula: s = (a+b+c)/2 = (12+12+12)/2 = 18. Area = √[s(s-a)(s-b)(s-c)] = √[18(6)(6)(6)] = √[18×216] = √3888 = 36√3.',
      concept: 'Heron\'s Formula',
      difficulty: 'Medium'
    },
    4: {
      text: 'The coefficient of x² in 3x³+2x²-x+1 is 2. The coefficient is the number that multiplies the variable term.',
      concept: 'Polynomial Coefficients',
      difficulty: 'Easy'
    },
    5: {
      text: 'Supplementary angles add up to 180°. 30° + 150° = 180°, so these angles are supplementary.',
      concept: 'Supplementary Angles',
      difficulty: 'Easy'
    },
    6: {
      text: 'The degree of a polynomial is the highest power of the variable. In 2x³+3x²+1, the highest power is 3, so the degree is 3.',
      concept: 'Degree of Polynomials',
      difficulty: 'Easy'
    },
    7: {
      text: 'Commutative property states that a + b = b + a. This means the order of addition doesn\'t matter.',
      concept: 'Commutative Property',
      difficulty: 'Easy'
    },
    8: {
      text: 'A triangle always has exactly 3 angles. This is a fundamental property of triangles.',
      concept: 'Properties of Triangles',
      difficulty: 'Easy'
    },
    9: {
      text: 'To find the zero of -5x+5, set it equal to 0: -5x+5=0. Solving: -5x=-5, so x=1.',
      concept: 'Finding Zeros of Polynomials',
      difficulty: 'Medium'
    },
    10: {
      text: 'Supplementary angles add up to 180°. 30° + 150° = 180°, so these angles are supplementary.',
      concept: 'Supplementary Angles',
      difficulty: 'Easy'
    },
    11: {
      text: 'Heron\'s formula is specifically designed for scalene triangles where all sides are different. For equilateral triangles, simpler formulas are more efficient.',
      concept: 'Heron\'s Formula Applications',
      difficulty: 'Medium'
    },
    12: {
      text: 'Associative property states that a × (b × c) = (a × b) × c. The grouping of multiplication doesn\'t affect the result.',
      concept: 'Associative Property',
      difficulty: 'Easy'
    },
    13: {
      text: '20x + 1 is a binomial (two terms) of degree 20. The degree is determined by the highest power of x.',
      concept: 'Binomials and Degree',
      difficulty: 'Easy'
    },
    14: {
      text: '0 divided by any nonzero number is 0. This is a fundamental property of division.',
      concept: 'Division Properties',
      difficulty: 'Easy'
    },
    15: {
      text: 'A point on a line is collinear with the line. Collinear points lie on the same straight line.',
      concept: 'Collinear Points',
      difficulty: 'Easy'
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAnswerStatus = (questionId) => {
    const userAnswer = answers[questionId];
    const correctAnswer = questions.find(q => q.id === questionId)?.correctAnswer;
    
    if (!userAnswer) return 'not-attempted';
    if (userAnswer === correctAnswer) return 'correct';
    return 'incorrect';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct': return 'text-green-600 dark:text-green-400';
      case 'incorrect': return 'text-red-600 dark:text-red-400';
      case 'not-attempted': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'correct': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'incorrect': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'not-attempted': return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
      default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getOptionColor = (option, questionId) => {
    const userAnswer = answers[questionId];
    const correctAnswer = questions.find(q => q.id === questionId)?.correctAnswer;
    
    if (!userAnswer) {
      // Not attempted - show correct answer in blue
      return option === correctAnswer 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400';
    }
    
    if (userAnswer === correctAnswer) {
      // User answered correctly
      return option === correctAnswer
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400';
    } else {
      // User answered incorrectly
      if (option === correctAnswer) {
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      } else if (option === userAnswer) {
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
                                    } else {
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400';
                                        }
                                    }
  };

  const currentQ = questions[currentQuestion];
  const explanation = explanations[currentQ?.id];

                                    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Test Explanation
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {testDetails.title} • Score: {score}% • Time: {formatTime(timeTaken)}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getAnswerStatus(currentQ?.id))} ${getStatusBg(getAnswerStatus(currentQ?.id))}`}>
                  {getAnswerStatus(currentQ?.id) === 'correct' && (
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Correct</span>
                    </span>
                  )}
                  {getAnswerStatus(currentQ?.id) === 'incorrect' && (
                    <span className="flex items-center space-x-1">
                      <XCircle className="w-4 h-4" />
                      <span>Incorrect</span>
                    </span>
                  )}
                  {getAnswerStatus(currentQ?.id) === 'not-attempted' && (
                    <span className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Not Attempted</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentQ?.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {[
                  currentQ?.optionOne,
                  currentQ?.optionTwo,
                  currentQ?.optionThree,
                  currentQ?.optionFour
                ].map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${getOptionColor(option, currentQ?.id)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        option === currentQ?.correctAnswer
                          ? 'border-green-500 bg-green-500 text-white'
                          : option === answers[currentQ?.id] && option !== currentQ?.correctAnswer
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option}</span>
                      {option === currentQ?.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                      {option === answers[currentQ?.id] && option !== currentQ?.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Explanation
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                    {explanation?.text || 'No explanation available for this question.'}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Concept:</span>
                      <p className="text-blue-800 dark:text-blue-200">{explanation?.concept || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Difficulty:</span>
                      <p className="text-blue-800 dark:text-blue-200">{explanation?.difficulty || 'N/A'}</p>
                                        </div>
                            </div>
                            </div>
                        </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  <span>Next</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Question Navigation
              </h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((_, index) => {
                  const status = getAnswerStatus(questions[index]?.id);
                  const isCurrent = index === currentQuestion;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 relative ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : status === 'correct'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : status === 'incorrect'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                    );
                })}
            </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Correct</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Incorrect</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Not Attempted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Current</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Correct:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {questions.filter(q => getAnswerStatus(q.id) === 'correct').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Incorrect:</span>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {questions.filter(q => getAnswerStatus(q.id) === 'incorrect').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Not Attempted:</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {questions.filter(q => getAnswerStatus(q.id) === 'not-attempted').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            </div>
        </div>
    );
} 