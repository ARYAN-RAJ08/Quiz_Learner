import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Play, Target, Award } from 'lucide-react';

export default function MainBody() {
  const classes = [
    {
      id: 9,
      name: 'Class IX',
      path: '/class9',
      description: 'Foundation subjects for 9th grade',
      color: 'from-blue-500 to-blue-600',
      icon: BookOpen
    },
    {
      id: 10,
      name: 'Class X',
      path: '/class10',
      description: 'Core subjects for 10th grade',
      color: 'from-green-500 to-green-600',
      icon: Play
    },
    {
      id: 11,
      name: 'Class XI',
      path: '/class11',
      description: 'Advanced subjects for 11th grade',
      color: 'from-purple-500 to-purple-600',
      icon: Target
    },
    {
      id: 12,
      name: 'Class XII',
      path: '/class12',
      description: 'Final year subjects for 12th grade',
      color: 'from-red-500 to-red-600',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Learner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your class and start practicing with our comprehensive test series
          </p>
        </motion.div>

        {/* Class Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((cls, index) => {
            const IconComponent = cls.icon;
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link to={cls.path}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${cls.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {cls.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {cls.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      Start Learning
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Choose Your Class</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Select your grade level and subject
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 dark:text-green-400 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Take the Test</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Answer questions and track your progress
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Review Results</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                See your score and detailed explanations
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
