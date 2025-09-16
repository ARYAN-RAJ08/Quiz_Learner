import React from 'react';
import { motion } from "framer-motion";

export default function Exam() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Exam Component
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          This is an exam component with modern styling.
        </p>
      </motion.div>
    </div>
  );
}