import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const downloadMonthlyAttendanceAsExcel = (
  collegeName = "",
  branchName = "",
  roomNo = "",
  selectedYear = new Date().getFullYear(),
  selectedMonth = new Date().getMonth() + 1,
  hodName = "",
  deanName = "",
  students = [],
  attendance = []
) => {
  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  let validDays = [];
  let sundays = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(selectedYear, selectedMonth - 1, i);
    if (date.getDay() === 0) {
      sundays.push(i);
    }
    validDays.push(i);
  }

  const headerRows = [
    ["Monthly Attendance Sheet - " + monthName + " " + selectedYear],
    ["College: " + collegeName, "Branch: " + branchName, "Room No: " + roomNo],
    ["HOD: " + hodName, "Dean: " + deanName],
    []
  ];

  const tableHeader = ["Roll No", "Student Name", ...validDays, "Total", "%"];

  const columnStatus = {};
  validDays.forEach((day, index) => {
    if (sundays.includes(day)) {
      columnStatus[index] = "holiday";
    } else {
      columnStatus[index] = "normal";
    }
  });

  attendance.forEach((studentAttendance) => {
    studentAttendance.forEach((mark, dayIndex) => {
      if (validDays.includes(dayIndex + 1) && mark === "H") {
        columnStatus[validDays.indexOf(dayIndex + 1)] = "holiday";
      }
    });
  });

  const studentRows = students.map((student, index) => {
    const studentAttendance = attendance[index] || Array(daysInMonth).fill("-");

    let row = [student.rollNo, student.name];

    let presentDays = 0;
    let absentDays = 0;

    validDays.forEach((day, colIndex) => {
      let mark = studentAttendance[day - 1] || "-";

      if (columnStatus[colIndex] === "holiday") {
        mark = "H";
      }

      if (mark === "P") presentDays++;
      if (mark === "A") absentDays++;

      row.push(mark);
    });

    const totalDays = presentDays + absentDays;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) + "%" : "0.00%";

    row.push(`${presentDays}/${totalDays}`);
    row.push(percentage);

    return row;
  });

  const finalData = [...headerRows, tableHeader, ...studentRows];

  const ws = XLSX.utils.aoa_to_sheet(finalData);

  // Only merge the title row so other headers show properly
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: tableHeader.length - 1 } }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, `Monthly_Attendance_${selectedYear}_${selectedMonth}.xlsx`);
};

export default downloadMonthlyAttendanceAsExcel;
