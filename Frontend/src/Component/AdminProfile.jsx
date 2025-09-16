import { User, Mail, Phone, Edit, Home, UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminProfile() {
    // Sample user data - in a real app this would come from props or state
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    const Navigate = useNavigate()

    const handleUpdateProfile = () => {
        console.log("Navigate to update profile page");
        // In a real app, this would navigate to edit profile or open a modal
    };

    const handleGoToHome = () => {
        Navigate('/home')
    };

    const handleRegisterNewMember = () => {
        Navigate("/signup")
    }

    const handleLogOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        Navigate('/')
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const tkn = JSON.parse(localStorage.getItem('token'));

                if (!tkn) {
                    console.log("Token not found");
                    return;
                }

                // Decode payload safely
                const base64Url = tkn.split('.')[1]; // should be index 1, not 2
                if (!base64Url) {
                    console.log("Invalid token format");
                    return;
                }

                const decodedPayload = JSON.parse(atob(base64Url));

                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user-detail`, decodedPayload);
                setForm(res.data.user);

            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };

        fetchUserDetails();
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                        User Profile
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage your account information and settings
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-8 text-white">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                                    {form.fullName}
                                </h2>
                                <p className="text-blue-100 text-lg">
                                    Welcome back!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="p-6 sm:p-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Personal Information
                        </h3>

                        <div className="grid gap-6 sm:gap-8">
                            {/* Full Name */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex items-center gap-3 sm:w-48">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                        Full Name
                                    </label>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 border-l-4 border-blue-500">
                                    <p className="text-gray-800 font-medium text-lg">
                                        {form.fullName}
                                    </p>
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex items-center gap-3 sm:w-48">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 border-l-4 border-green-500">
                                    <p className="text-gray-800 font-medium text-lg break-all">
                                        {form.email}
                                    </p>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex items-center gap-3 sm:w-48">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                        Phone Number
                                    </label>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 border-l-4 border-purple-500">
                                    <p className="text-gray-800 font-medium text-lg">
                                        {form.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Update Profile Button */}
                    <button
                        onClick={handleUpdateProfile}
                        className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                        <span className="text-lg">Update Profile</span>
                    </button>

                    {/* Go to Home Page Button */}
                    <button
                        onClick={handleGoToHome}
                        className="group bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-lg">Go to Home Page</span>
                    </button>

                    {/* Register New Member Button */}
                    <button
                        onClick={handleRegisterNewMember}
                        className="group bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 sm:col-span-2 lg:col-span-1"
                    >
                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-lg">Register New Member</span>
                    </button>
                </div>

                <button onClick={handleLogOut}>
                    Log Out
                </button>
            </div>
        </div>
    );
}