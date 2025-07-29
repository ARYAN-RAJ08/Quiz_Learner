import React from 'react';
import { motion } from "framer-motion";
import { BookOpen, Play, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function Class12() {
  const subjects = [
    {
      name: "Mathematics",
      description: "Advanced Calculus and Statistics",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      name: "Physics",
      description: "Electromagnetism and Modern Physics",
      icon: Play,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      name: "Chemistry",
      description: "Advanced Organic and Physical Chemistry",
      icon: Target,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      name: "Biology",
      description: "Advanced Genetics and Biotechnology",
      icon: Award,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Class 12 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Subjects</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose your subject to start learning
          </p>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`${subject.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <Link to="/test" className="block">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${subject.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {subject.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}