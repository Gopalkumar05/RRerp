import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeacherPanel() {
  const navigate = useNavigate();
  const code = JSON.parse(localStorage.getItem("teacherCode"));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Teacher 👋</h1>
          <p className="mt-2 text-md text-gray-600">
            Share this code with your students to join: 
            <span className="ml-2 font-semibold text-purple-600 text-lg bg-purple-100 px-3 py-1 rounded-md shadow-sm">
              {code}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => navigate('/teacher-dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-center py-10 rounded-xl shadow-md transform hover:scale-105 transition-all cursor-pointer"
          >
            <h2 className="text-2xl font-semibold">📋 Fill Attendance</h2>
          </div>

          <div
            onClick={() => navigate('/resultManager')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-10 rounded-xl shadow-md transform hover:scale-105 transition-all cursor-pointer"
          >
            <h2 className="text-2xl font-semibold">📝 Fill Result</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
