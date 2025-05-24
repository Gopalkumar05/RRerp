import React, { useState, useEffect } from "react";
import axios from "axios";
import downloadWeeklyAttendanceAsDoc from "./components/Weekly";
import downloadMonthlyAttendanceAsExcel from "./components/Monthly";
import { useNavigate } from "react-router-dom";

const AttendanceSheet = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
 const [saveSuccess, setSaveSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

   useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  
 const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState(Array(65).fill().map(() => Array(31).fill("")));
    const [holidays, setHolidays] = useState([]);
    const [collegeName, setCollegeName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [roomNo, setRoomNo] = useState("");
    const [hodName, setHodName] = useState("");
    const [deanName, setDeanName] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const currentDate = (month, year) => new Date(year, month, 0).getDate();// or however you determine the month/year
    const CdaysInMonth = currentDate(selectedMonth, selectedYear);
    

const [dailyAttendanceCount, setDailyAttendanceCount] = useState(Array(CdaysInMonth).fill(0));
useEffect(() => {
  calculateDailyAttendance();
}, [attendance]);


useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.username) {
        console.warn("🚨 No user found. Redirecting to login...");
        return;
    }

    const username = storedUser.username;

    const fetchAttendance = async () => {
        try {
            console.log(`🔄 Fetching attendance for ${username}, Year: ${selectedYear}, Month: ${selectedMonth}`);

            const response = await axios.get(
                `http://localhost:5000/getAttendance/${username}/${selectedYear}/${selectedMonth}`
            );

            const data = response.data;

            if (!data || !data.students || data.students.length === 0) {
                console.warn("🆕 No previous attendance found. Creating a new sheet.");

                const defaultStudents = Array(65).fill().map((_, i) => ({
                    rollNo: i + 1,
                    name: `Student ${i + 1}`,
                    attendance: Array(31).fill(""),
                }));

                setCollegeName(data.collegeName || "");
                setBranchName(data.branchName || "");
                setRoomNo(data.roomNo || "");
                setHodName(data.hodName || "");
                setDeanName(data.deanName || "");
                setStudents(defaultStudents);
                setAttendance(defaultStudents.map(student => student.attendance));

                // ✅ Ensure new attendance is stored in the database
                await axios.post("http://localhost:5000/saveAttendance", {
                    username,
                    collegeName: data.collegeName || "",
                    branchName: data.branchName || "",
                    roomNo: data.roomNo || "",
                    hodName: data.hodName || "",
                    deanName: data.deanName || "",
                    year: selectedYear,
                    month: selectedMonth,
                    students: defaultStudents
                });

                console.log("✅ Fresh attendance sheet created in DB.");
            } else {
                console.log("✅ Attendance Data Loaded from DB:", data);

                setCollegeName(data.collegeName);
                setBranchName(data.branchName);
                setRoomNo(data.roomNo);
                setHodName(data.hodName);
                setDeanName(data.deanName);
                setStudents(data.students);
                setAttendance(data.students.map(student => student.attendance || Array(31).fill("")));
              
            }
        } catch (err) {
            console.error("❌ Failed to load attendance:", err);
            alert("❌ Failed to load attendance. Try again later.");
        }
    };

    fetchAttendance();
}, [selectedYear, selectedMonth]);




  

  const saveAttendance = () => {
    if (!students || students.length === 0) {
        alert("No students found. Cannot save attendance.");
        return;
    }

    if (!attendance || attendance.length !== students.length) {
        alert("Attendance data is missing or mismatched with students.");
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.username) {
        alert("User not found. Please log in again.");
        return;
    }

    const username = storedUser.username;

    const attendanceData = {
        username,
        collegeName,
        branchName,
        roomNo,
        hodName,
        deanName,
        year: selectedYear,
        month: selectedMonth,
        students: students.map((student, index) => ({
            ...student,
            attendance: attendance[index] || Array(31).fill(""), // ✅ Ensure correct mapping
        })),
    };

    console.log("📌 Sending Attendance Data:", JSON.stringify(attendanceData, null, 2)); // Debugging

    axios.post("http://localhost:5000/saveAttendance", attendanceData)
        .then((res) => {
            console.log("✅ Attendance saved to DB:", res.data);
            alert("✅ Attendance saved successfully!");
        })
        .catch((err) => {
            console.error("❌ Error saving:", err);
            alert("❌ Failed to save attendance. Try again.");
        });
};




  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const markAttendance = (studentIndex, dayIndex, status) => {
        setAttendance(prevAttendance => {
            const updatedAttendance = [...prevAttendance];
            updatedAttendance[studentIndex] = [...updatedAttendance[studentIndex]];

            updatedAttendance[studentIndex][dayIndex] = updatedAttendance[studentIndex][dayIndex] === status ? "" : status;

            return updatedAttendance;
        });
    };


  
  const calculatePercentage = (studentIndex) => {
    if (!attendance || !attendance[studentIndex]) return "0.00"; // Prevent errors
  
    // Count present and absent days
    const presentDays = attendance[studentIndex].filter(status => status === "P").length;
    const absentDays = attendance[studentIndex].filter(status => status === "A").length;
  
    // Calculate total working days (only marked P or A)
    const totalWorkingDays = presentDays + absentDays;
    if (totalWorkingDays === 0) return "0.00"; // Avoid division by zero
  
    // Calculate percentage
    return ((presentDays / totalWorkingDays) * 100).toFixed(2);
  };
  


  const calculateDailyAttendance = () => {
  const newDailyCount = Array(CdaysInMonth).fill(0);

  filteredStudents.forEach((_, studentIndex) => {
    attendance[studentIndex]?.forEach((status, dayIndex) => {
      if (status === "P") {
        newDailyCount[dayIndex]++;
      }
    });
  });

  setDailyAttendanceCount(newDailyCount);
};

  
  

  const toggleHoliday = (dayIndex) => {
    setHolidays((prevHolidays) =>
      prevHolidays.includes(dayIndex)
        ? prevHolidays.filter((day) => day !== dayIndex)
        : [...prevHolidays, dayIndex]
    );
  };

  const isHoliday = (dayIndex) => {
    const date = new Date(selectedYear, selectedMonth - 1, dayIndex + 1);
    return date.getDay() === 0 || holidays.includes(dayIndex);
  };

const filteredStudents = students.filter((student, studentIndex) => {
  if (!attendance || !attendance[studentIndex]) return false; // Prevents errors if attendance is missing

  const query = searchQuery.trim().toLowerCase(); // Ensure trimmed and lowercase search query
  const rollNoStr = student.rollNo?.toString().trim() || ""; // Ensure rollNo is a valid string

  const studentNameMatch = student.name?.toLowerCase().includes(query) || false;
  const rollNoMatch = rollNoStr.includes(query);  // Ensure rollNo is treated as a clean string

  // ✅ Safely access attendance array
  const presentCount = attendance[studentIndex]?.filter(status => status === "P").length || 0;
  const absentCount = attendance[studentIndex]?.filter(status => status === "A").length || 0;

  const presentMatch = query === presentCount.toString();
  const absentMatch = query === absentCount.toString();
  const percentageMatch = calculatePercentage(studentIndex)?.toString().includes(query) || false;

  // ✅ Day-wise filter (if `searchQuery` is a date)
  let dayMatch = false;
  const dayIndex = parseInt(query) - 1; // Convert searchQuery into array index
  if (!isNaN(dayIndex) && dayIndex >= 0 && dayIndex < daysInMonth && attendance[studentIndex]) {
    dayMatch = attendance[studentIndex][dayIndex] === "P" || attendance[studentIndex][dayIndex] === "A";
  }

  return studentNameMatch || rollNoMatch || presentMatch || absentMatch || percentageMatch || dayMatch;
});

  return (
    
    <div className="p-6 max-w-screen-lg mx-auto border-2 border-red-500">
   <h2 className="text-1xl font-bold">
  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 inline-block text-transparent bg-clip-text">
    Welcome,
  </span>  
  <span className="bg-gradient-to-r from-blue-400 to-purple-500 inline-block text-transparent bg-clip-text">
    {user.username}
  </span>
</h2>


      <div className="text-center mb-4">
        <input
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          className="text-xl font-bold border-b-2 border-gray-500 text-center w-full p-2"
        />
      </div>

      <div className="flex justify-between mb-4">
        <input value={branchName} onChange={(e) => setBranchName(e.target.value)} className="border p-2 rounded w-1/2" placeholder="Branch Name" />
        <input value={roomNo} onChange={(e) => setRoomNo(e.target.value)} className="border p-2 rounded w-1/3" placeholder="Room No" />
      </div>

      <div className="flex justify-center space-x-4 mb-4">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="border p-2 rounded">
          {[...Array(12).keys()].map((m) => (
            <option key={m + 1} value={m + 1}>
              {new Date(0, m).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="border p-2 rounded w-20" />
      </div>

      {/* Search Input */}
      <div className="mb-4">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="border p-2 rounded w-full"
    placeholder="Search by name, roll no, attendance (P/A), or %"
  />
</div>

{/* Student Summary Section */}
{filteredStudents.length === 1 && (
  <div className="border p-4 rounded bg-gray-100 mb-4">
    <h2 className="text-lg font-bold">Student Summary</h2>
    <p><strong>Roll No:</strong> {filteredStudents[0].rollNo}</p>
    <p><strong>Name:</strong> {filteredStudents[0].name}</p>
    <p><strong>Month:</strong> {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })}</p>

    {/* Total Working Days Calculation */}
    <p><strong>Total Working Days:</strong> {attendance[students.findIndex(s => s.rollNo === filteredStudents[0].rollNo)].filter(status => status === "P" || status === "A").length}</p>

    {/* Present & Absent Count */}
    <p><strong>Present Days:</strong> {attendance[students.findIndex(s => s.rollNo === filteredStudents[0].rollNo)].filter(status => status === "P").length}</p>
    <p><strong>Absent Days:</strong> {attendance[students.findIndex(s => s.rollNo === filteredStudents[0].rollNo)].filter(status => status === "A").length}</p>
    
    {/* Attendance Percentage */}
    <p><strong>Attendance %:</strong> {calculatePercentage(students.findIndex(s => s.rollNo === filteredStudents[0].rollNo))}%</p>
  </div>
)}




      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-18 py-2">Roll No</th>
              <th className="border border-gray-300 px-15 py-2">Student</th>
              {[...Array(daysInMonth).keys()].map((day) => (
                <th key={day + 1} className="border border-gray-300 px-2">
                  {new Date(selectedYear, selectedMonth - 1, day + 1).toLocaleDateString("en-US", { weekday: "short" })}
                </th>
              ))}
                <th className="border border-gray-300 px-4 py-2">P</th>
                <th className="border border-gray-300 px-4 py-2">A</th>
              <th className="border border-gray-300 px-4 py-2">%</th>
           
            </tr>
            <tr className="bg-gray-100">
              <th></th>
              <th></th>
              {[...Array(daysInMonth).keys()].map((day) => (
                <th key={day + 1} className={`border border-gray-300 px-2 ${isHoliday(day) ? "bg-red-200" : ""}`}>
                  <button onClick={() => toggleHoliday(day)} className="text-xs">
                    {isHoliday(day) ? "H" : day + 1}
                  </button>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
  {filteredStudents.map((student, studentIndex) => {
     const presentCount = attendance[studentIndex]?.filter(day => day === "P").length || 0;
     const absentCount = attendance[studentIndex]?.filter(day => day === "A").length || 0;
   
    return (
      <tr key={studentIndex} className="text-center bg-yellow-200">
        <td className="border border-gray-300 px-4 py-2">
          <input 
            value={student.rollNo} 
            onChange={(e) => {
              const updatedStudents = [...students];
              updatedStudents[studentIndex].rollNo = e.target.value;
              setStudents(updatedStudents);
            }}
            className="border p-1 rounded w-full text-center"
          />
        </td>
        <td className="border border-gray-300 px-4 py-2">
          <input 
            value={student.name} 
            onChange={(e) => {
              const updatedStudents = [...students];
              updatedStudents[studentIndex].name = e.target.value;
              setStudents(updatedStudents);
            }}
            className="border p-1 rounded w-full text-center"
          />
        </td>

   {/* Attendance Marking Section */}
{attendance[studentIndex].slice(0, daysInMonth).map((status, dayIndex) => (
  <td key={dayIndex} className="border border-gray-300 px-2 py-1 text-center">
    {isHoliday(dayIndex) ? (
      <span className="text-red-500 font-bold">H</span>
    ) : (
      <>
        <button 
          onClick={() => markAttendance(studentIndex, dayIndex, "P")}
          className={`px-2 py-1 text-white rounded ${status === "P" ? "bg-green-500" : "bg-gray-300"}`}>
          P
        </button>
        <button 
          onClick={() => markAttendance(studentIndex, dayIndex, "A")}
          className={`px-2 py-1 text-white rounded ${status === "A" ? "bg-red-500" : "bg-gray-300"}`}>
          A
        </button>
        <button 
          onClick={() => markAttendance(studentIndex, dayIndex, "H")}
          className={`px-2 py-1 text-white rounded ${status === "H" ? "bg-yellow-500" : "bg-gray-300"}`}>
          H
        </button>
      </>
    )}
  </td>
))}


        {/* Attendance Percentage */}
        <td className="border border-gray-300 px-4 py-2 font-bold text-green-600">{presentCount}</td>
        <td className="border border-gray-300 px-4 py-2 font-bold text-red-600">{absentCount}</td>
        <td className="border border-gray-300 px-4 py-2">{calculatePercentage(studentIndex)}%</td>
       
      </tr>
    );
  })}
</tbody> 
         <tfoot>
  <tr className="bg-gray-100 font-bold text-center">
    <td colSpan="2" className="border border-gray-300 px-4 py-2">Total Present</td>
    {[...Array(CdaysInMonth).keys()].map((dayIndex) => {
      const totalPresent = filteredStudents.reduce((count, _, studentIndex) => {
        return attendance[studentIndex]?.[dayIndex] === "P" ? count + 1 : count;
      }, 0);

      return (
        <td key={dayIndex} className="border border-gray-300 px-2">
          {totalPresent}
        </td>
      );
    })}
    <td colSpan="3" className="border border-gray-300"></td>
  </tr>
</tfoot>



        </table>
      </div>

      <div className="flex justify-between mt-4">
        <input
          value={hodName}
          onChange={(e) => setHodName(e.target.value)}
          className="border p-2 rounded w-1/2"
          placeholder="HOD Name"
        />
        <input
          value={deanName}
          onChange={(e) => setDeanName(e.target.value)}
          className="border p-2 rounded w-1/3"
          placeholder="Dean Name"
        />
      </div>
      <div className="text-center mt-6 space-x-4">
        {/* Monthly Attendance Download Button */}
        <button
          onClick={() =>downloadMonthlyAttendanceAsExcel(
            collegeName, branchName, roomNo, selectedYear,
            selectedMonth, hodName, deanName, students,
            attendance, daysInMonth
          )}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          Download Monthly Attendance
        </button>

        {/* Weekly Attendance Download Button */}
        <button
          onClick={() => downloadWeeklyAttendanceAsDoc(
            collegeName, branchName, roomNo, selectedYear,
            selectedMonth, hodName, deanName, students,
            attendance, daysInMonth
          )}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          Download Weekly Attendance
        </button>
      </div>
      <div className="p-6 max-w-screen-lg mx-auto">
        <div className="text-center mt-6 space-x-4">
        <button
  onClick={saveAttendance}
  className={`font-bold py-2 px-6 rounded transition ${
    saveSuccess ? "bg-green-500 hover:bg-green-700" : "bg-pink-500 hover:bg-pink-700"
  } text-white`}
>
  {saveSuccess ? "Attendance Saved!" : "Save Attendance"}
</button>


          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded">
            Logout
          </button>
        
      

        </div>
      </div>
  
    </div>
  );
};

export default AttendanceSheet;