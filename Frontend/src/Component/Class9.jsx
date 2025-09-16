import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, Globe, Microscope, Palette, Code, History, Languages } from 'lucide-react';

export default function Class9() {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      description: 'Algebra, Geometry, and Trigonometry',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      testDetails: {
        title: "Class IX - Mathematics Test",
        subject: "Algebra, Geometry, and Trigonometry",
        duration: 45,
        totalQuestions: 20,
        instructions: [
          "Read each question carefully before answering",
          "You can navigate between questions using Previous/Next buttons",
          "You can review and change your answers before submitting",
          "Once submitted, you cannot retake the test",
          "Ensure stable internet connection during the test",
          "Do not refresh the page during the test",
          "Use calculator for complex calculations if needed"
        ]
      }
    },
    {
      id: 2,
      name: 'Science',
      description: 'Physics, Chemistry, and Biology',
      icon: Microscope,
      color: 'from-green-500 to-green-600',
      testDetails: {
        title: "Class IX - Science Test",
        subject: "Physics, Chemistry, and Biology",
        duration: 60,
        totalQuestions: 25,
        instructions: [
          "Read each question carefully before answering",
          "You can navigate between questions using Previous/Next buttons",
          "You can review and change your answers before submitting",
          "Once submitted, you cannot retake the test",
          "Ensure stable internet connection during the test",
          "Do not refresh the page during the test",
          "Pay attention to units and scientific notation"
        ]
      }
    },
    {
      id: 3,
      name: 'English',
      description: 'Literature, Grammar, and Composition',
      icon: Languages,
      color: 'from-purple-500 to-purple-600',
      testDetails: {
        title: "Class IX - English Test",
        subject: "Literature, Grammar, and Composition",
        duration: 40,
        totalQuestions: 18,
        instructions: [
          "Read each question carefully before answering",
          "You can navigate between questions using Previous/Next buttons",
          "You can review and change your answers before submitting",
          "Once submitted, you cannot retake the test",
          "Ensure stable internet connection during the test",
          "Do not refresh the page during the test",
          "Pay attention to grammar rules and literary devices"
        ]
      }
    },
    {
      id: 4,
      name: 'Hindi',
      description: 'Hindi Literature and Grammar',
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600',
      testDetails: {
        title: "Class IX - Hindi Test",
        subject: "Hindi Literature and Grammar",
        duration: 35,
        totalQuestions: 15,
        instructions: [
          "Read each question carefully before answering",
          "You can navigate between questions using Previous/Next buttons",
          "You can review and change your answers before submitting",
          "Once submitted, you cannot retake the test",
          "Ensure stable internet connection during the test",
          "Do not refresh the page during the test",
          "Pay attention to Hindi grammar and vocabulary"
        ]
      }
    },
    {
      id: 5,
      name: 'History',
      description: 'Ancient and Modern History',
      icon: History,
      color: 'from-red-500 to-red-600',
      testDetails: {
        title: "Class IX - History Test",
        subject: "Ancient and Modern History",
        duration: 30,
        totalQuestions: 15,
        instructions: [
          "Read each question carefully before answering",
          "You can navigate between questions using Previous/Next buttons",
          "You can review and change your answers before submitting",
          "Once submitted, you cannot retake the test",
          "Ensure stable internet connection during the test",
          "Do not refresh the page during the test",
          "Remember important dates and historical events"
        ]
      }
    },
    {
      id: 6,
      name: 'Geography',
      description: 'Physical and Human Geography',
      icon: Globe,
      color: 'from-teal-500 to-teal-600',
      testDetails: {
        title: "Class IX - Geography Test",
        subject: "Physical and Human Geography",
        duration: 35,
        totalQuestions: 16,
        instructions: [
          "Read each question carefully before answering",
          "You can navigate between questions using Previous/Next buttons",
          "You can review and change your answers before submitting",
          "Once submitted, you cannot retake the test",
          "Ensure stable internet connection during the test",
          "Do not refresh the page during the test",
          "Pay attention to geographical features and locations"
        ]
      }
    },
    {
      id: 7,
      name: 'Civics',
      description: 'Political Science and Government',
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-600',
      testDetails: {
        title: "Class IX - Civics Test",
        subject: "Political Science and Government",
        duration: 30,
        totalQuestions: 14,
        instructions: [
          "Read each question carefully before answering",
          "You can navigate between questions using Previous/Next buttons",
          "You can review and change your answers before submitting",
          "Once submitted, you cannot retake the test",
          "Ensure stable internet connection during the test",
          "Do not refresh the page during the test",
          "Understand democratic principles and government structure"
        ]
      }
    },
    {
      id: 8,
      name: 'Computer Science',
      description: 'Programming and Technology',
      icon: Code,
      color: 'from-pink-500 to-pink-600',
      testDetails: {
        title: "Class IX - Computer Science Test",
        subject: "Programming and Technology",
        duration: 40,
        totalQuestions: 18,
        instructions: [
          "Read each question carefully before answering",
          "You can navigate between questions using Previous/Next buttons",
          "You can review and change your answers before submitting",
          "Once submitted, you cannot retake the test",
          "Ensure stable internet connection during the test",
          "Do not refresh the page during the test",
          "Pay attention to programming concepts and logic"
        ]
      }
    }
  ];

  const handleSubjectClick = (subject) => {
    navigate('/test-instructions', { 
      state: { testDetails: subject.testDetails }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Class IX Subjects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose a subject to start your practice test
          </p>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => {
            const IconComponent = subject.icon;
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => handleSubjectClick(subject)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {subject.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {subject.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    Start Test
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}