import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const StudentView = () => {
  const [user, setUser] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState(new Date(selectedYear, selectedMonth, 0).getDate());

  useEffect(() => {
    socket.on("receiveAttendance", (updatedAttendance) => {
      setAttendance(updatedAttendance);
    });

    return () => {
      socket.off("receiveAttendance");
    };
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    setDaysInMonth(new Date(selectedYear, selectedMonth, 0).getDate());
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const fetchInitial = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.username) return;

      const username = storedUser.username;

      try {
        const res = await fetch(`http://localhost:5000/api/students/view/${username}/${selectedYear}/${selectedMonth}`);
        if (!res.ok) throw new Error("Failed to fetch attendance");

        const data = await res.json();
        if (!data.students) return;

        setStudents(data.students);
        setAttendance(data.students.map(s => s.attendance || []));
      } catch (err) {
        console.error("Failed to load initial attendance", err);
      }
    };

    fetchInitial();
  }, [selectedYear, selectedMonth]);

  const filteredStudents = students
    .map((student, index) => {
      const attendanceRow = attendance[index] || [];
      const present = attendanceRow.filter(x => x === "P").length;
      const absent = attendanceRow.filter(x => x === "A").length;
      const percent = present + absent > 0 ? ((present / (present + absent)) * 100).toFixed(2) : "0.00";
      return { ...student, present, absent, percent };
    })
    .filter((student) => {
      const query = searchQuery.toLowerCase();
      return (
        student.name?.toLowerCase().includes(query) ||
        student.rollNo?.toString().includes(query) ||
        student.percent.includes(query)
      );
    });

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Student Attendance View</h2>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          >
            {months.map((month, i) => (
              <option key={i} value={i + 1}>{month}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll, or %"
            className="border p-2 w-64 rounded"
          />
        </div>
      </div>

      {/* Student Summary View */}
      {searchQuery && filteredStudents.length > 0 ? (
        <div className="bg-white shadow p-4 rounded border max-w-xl mx-auto">
          {filteredStudents.map((student, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <h3 className="text-lg font-semibold text-blue-700 mb-1">Student Summary</h3>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Roll No:</strong> {student.rollNo}</p>
              <p><strong>Month:</strong> {months[selectedMonth - 1]} {selectedYear}</p>
              <p><strong>Total Working Days:</strong> {student.present + student.absent}</p>
              <p><strong>Present Days:</strong> <span className="text-green-600">{student.present}</span></p>
              <p><strong>Absent Days:</strong> <span className="text-red-600">{student.absent}</span></p>
              <p><strong>Attendance %:</strong> {student.percent}%</p>
            </div>
          ))}
        </div>
      ) : (
        // Default Table View
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse border-gray-300 text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Roll No</th>
                <th className="border px-4 py-2">Name</th>
                {[...Array(daysInMonth)].map((_, i) => (
                  <th key={i} className="border px-2 py-1">{i + 1}</th>
                ))}
                <th className="border px-2">P</th>
                <th className="border px-2">A</th>
                <th className="border px-2">%</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const attendanceRow = attendance[index] || [];
                const present = attendanceRow.filter(x => x === "P").length;
                const absent = attendanceRow.filter(x => x === "A").length;
                const percent = present + absent > 0 ? ((present / (present + absent)) * 100).toFixed(2) : "0.00";

                return (
                  <tr key={index} className="bg-yellow-100">
                    <td className="border px-2 py-1">{student.rollNo}</td>
                    <td className="border px-2 py-1">{student.name}</td>
                    {[...Array(daysInMonth)].map((_, dayIndex) => (
                      <td key={dayIndex} className="border px-1 py-1">
                        {attendanceRow[dayIndex] || "-"}
                      </td>
                    ))}
                    <td className="border text-green-600">{present}</td>
                    <td className="border text-red-600">{absent}</td>
                    <td className="border">{percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentView;
