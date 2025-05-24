import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentShow() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4">
      
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Student 🎓</h1>
          <p className="mt-2 text-md text-gray-600">
            Choose an option to view your information:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => navigate('/student-view')}
            className="bg-blue-500 hover:bg-blue-600 text-white text-center py-10 rounded-xl shadow-md transform hover:scale-105 transition-all cursor-pointer"
          >
            <h2 className="text-2xl font-semibold">📋 View Attendance</h2>
          </div>

          <div
            onClick={() => navigate('/result')}
            className="bg-green-500 hover:bg-green-600 text-white text-center py-10 rounded-xl shadow-md transform hover:scale-105 transition-all cursor-pointer"
          >
            <h2 className="text-2xl font-semibold">📝 View Result</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
