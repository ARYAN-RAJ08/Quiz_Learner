import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Component/ThemeContext";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Import components directly to avoid Suspense issues
import Navbar from "./Component/Navbar";
import Heading from "./Component/Heading";
import MainBody from "./Component/MainBody";
import ClassIX from "./Component/Class9";
import ClassX from "./Component/Class10";
import ClassXI from "./Component/Class11";
import ClassXII from "./Component/Class12";
import Test from "./Component/test";
import TestInstructions from "./Component/TestInstructions";
import LogIn from "./Component/Login";
import SingUp from "./Component/SingUpS";
import Contact from './Component/Contact';
import Error from './Component/Error';
import AboutUs from './Component/AboutUs';
import Explanation from "./Component/Explanation";
import AdminDashboard from './Component/AdminDashboard';
import StudentProfile from './Component/StudentProfile';
import PrivateRoute from './Component/PrivateRoute';
import VerifyEmail from "./Component/VerifyEmail";
import AdminQuestionPaper from './Component/AdminQuestionPaper';
import { useState } from "react";
import AdminProfile from "./Component/AdminProfile";
import { useEffect } from "react";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </motion.div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Layout wrapper component
const Layout = ({ children, showNavbar = true, showHeading = false }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    {showNavbar && <Navbar />}
    {showHeading && <Heading />}
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

// Unauthorized component
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
    <div className="text-center p-8">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🚫</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Access Denied
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        You don't have permission to access this page. Please contact your administrator.
      </p>
      <button
        onClick={() => window.location.href = '/home'}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
      >
        Go Home
      </button>
    </div>
  </div>
);

export default function App() {
  const [Profile, setProfile] = useState(null);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem('role'));

    if (role === 'student') {
      setProfile(
        <Layout showNavbar>
          <StudentProfile />
        </Layout>
      );
    } else {
      setProfile(<AdminProfile />);
    }
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LogIn />
    },
    {
      path: "/home",
      element: (
        <Layout showNavbar showHeading>
          <MainBody />
        </Layout>
      )
    },
    {
      path: "/aboutus",
      element: (
        <Layout showNavbar>
          <AboutUs />
        </Layout>
      )
    },
    {
      path: "/contactus",
      element: (
        <Layout showNavbar>
          <Contact />
        </Layout>
      )
    },
    // {
    //   path: '/login',
    //   element: <LogIn />
    // },
    {
      path: '/signup',
      element: <SingUp />
    },
    {
      path: "/test-instructions",
      element: <TestInstructions />
    },
    {
      path: "/test",
      element: <Test />
    },
    {
      path: "/explanation",
      element: <Explanation />
    },
    {
      path: "/class9",
      element: (
        <Layout showNavbar showHeading>
          <ClassIX />
        </Layout>
      )
    },
    {
      path: "/class10",
      element: (
        <Layout showNavbar showHeading>
          <ClassX />
        </Layout>
      )
    },
    {
      path: "/class11",
      element: (
        <Layout showNavbar showHeading>
          <ClassXI />
        </Layout>
      )
    },
    {
      path: "/class12",
      element: (
        <Layout showNavbar showHeading>
          <ClassXII />
        </Layout>
      )
    },
    {
      path: "/verify-email",
      element: <VerifyEmail />
    },
    // Admin protected routes
    {
      path: "/admin",
      element: <PrivateRoute allowedRoles={['admin']} />,
      children: [
        {
          path: "/admin",
          element: (
            <Layout showNavbar>
              <AdminDashboard />
            </Layout>
          )
        },
        {
          path: "/admin/question-papers",
          element: (
            <Layout showNavbar>
              <AdminQuestionPaper />
            </Layout>
          )
        }
      ]
    },
    // Student protected routes
    {
      path: "/profile",
      element: <PrivateRoute allowedRoles={['student', 'admin']} />,
      children: [
        {
          path: "/profile",
          element: (
            Profile
          )
        }
      ]
    },
    // Unauthorized route
    {
      path: "/unauthorized",
      element: <Unauthorized />
    },
    {
      path: "*",
      element: <Error />
    }
  ]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}