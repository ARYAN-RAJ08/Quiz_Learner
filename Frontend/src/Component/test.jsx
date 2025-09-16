import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle,
  Flag,
  BookOpen,
  Timer
} from 'lucide-react';
import { Quuesstion } from '../JSX/Question';

export default function Test() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);

  const testDetails = location.state?.testDetails || {
    title: "Mathematics Test",
    duration: 30
  };
  const startTime = location.state?.startTime || Date.now();

  const questions = Quuesstion;
  const totalQuestions = questions.length;

  // Initialize timer
  useEffect(() => {
    const durationMs = testDetails.duration * 60 * 1000;
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, durationMs - elapsed);
    setTimeLeft(remaining);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, testDetails.duration]);

  // Auto-submit when time runs out
  const handleAutoSubmit = useCallback(() => {
    if (!showResults) {
      calculateScore();
      setShowResults(true);
    }
  }, [showResults]);

  // Enter fullscreen on component mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (error) {
        console.log('Fullscreen not supported or denied');
      }
    };
    enterFullscreen();

    return () => {
      // Safe exit fullscreen with error handling
      const exitFullscreen = async () => {
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
          }
        } catch (error) {
          console.log('Error exiting fullscreen:', error);
        }
      };
      exitFullscreen();
    };
  }, []);

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const toggleFlagQuestion = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(percentage);
  };

    const handleSubmit = () => {
    setShowConfirmSubmit(true);
  };

  const confirmSubmit = () => {
    calculateScore();
    setShowResults(true);
    setShowConfirmSubmit(false);
  };

  const handleViewExplanation = () => {
    navigate('/explanation', { 
      state: { 
        answers, 
        questions,
        testDetails,
        score,
        timeTaken: testDetails.duration * 60 - Math.floor(timeLeft / 1000)
      } 
    });
  };

    const handleRetake = () => {
    setCurrentQuestion(0);
        setAnswers({});
    setShowResults(false);
        setScore(0);
    setFlaggedQuestions(new Set());
    setShowConfirmSubmit(false);
    navigate('/test-instructions', { state: { testDetails } });
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestion];
  const userAnswer = answers[currentQ?.id];
  const isFlagged = flaggedQuestions.has(currentQuestion);

  // Results screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Test Completed!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {testDetails.title}
            </p>
          </div>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {score}%
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              You got {Math.round((score / 100) * totalQuestions)} out of {totalQuestions} questions correct
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Time taken: {formatTime(testDetails.duration * 60 * 1000 - timeLeft)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewExplanation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Explanation</span>
            </motion.button>
            <button
              onClick={handleRetake}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Retake Test
            </button>
            <button
              onClick={() => navigate('/home')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Confirm submit modal
  if (showConfirmSubmit) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Submit Test?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to submit your test? You cannot change your answers after submission.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowConfirmSubmit(false)}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmSubmit}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

        return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {testDetails.title}
              </h1>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeLeft < 300000 ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              }`}>
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              
              {/* Question Palette Button */}
              <button
                onClick={() => setShowQuestionPalette(!showQuestionPalette)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Question {currentQuestion + 1}
                </h2>
                <button
                  onClick={toggleFlagQuestion}
                  className={`p-2 rounded-lg transition-colors ${
                    isFlagged 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-100 hover:text-red-600'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {[
                  currentQ.optionOne,
                  currentQ.optionTwo,
                  currentQ.optionThree,
                  currentQ.optionFour
                ].map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(currentQ.id, option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      userAnswer === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        userAnswer === option
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {option}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex gap-4">
                  {currentQuestion < totalQuestions - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Test</span>
                    </button>
                  )}
                </div>
            </div>
            </motion.div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Question Palette
              </h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((_, index) => {
                  const isAnswered = answers[questions[index]?.id];
                  const isCurrent = index === currentQuestion;
                  const isFlagged = flaggedQuestions.has(index);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 relative ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isAnswered
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {index + 1}
                      {isFlagged && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Not Answered</span>
                                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Current</span>
                </div>
                    </div>
            </div>
                    </div>
                    </div>
                </div>
            </div>
        );
}