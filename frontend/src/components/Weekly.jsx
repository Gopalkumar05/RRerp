import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

const downloadWeeklyAttendanceAsDoc = (
  collegeName = "",
  branchName = "",
  roomNo = "",
  selectedYear = new Date().getFullYear(),
  selectedMonth = new Date().getMonth() + 1,
  hodName = "",
  deanName = "",
  students = [],
  attendance = [],
  daysInMonth = 30,
  holidays = [] // Array of holidays (e.g., ["2024-03-10", "2024-03-15"])
) => {
  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
    month: "long",
  });

  const weeks = [];
  let currentWeek = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    const dateString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    if (date.getDay() !== 0 && !holidays.includes(dateString)) {
      // Exclude Sundays and holidays
      currentWeek.push(day);
    }

    if (date.getDay() === 6 || day === daysInMonth) {
      // Push completed week or last remaining days of the month
      if (currentWeek.length > 0) weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }

  // Generate a document for each week
  weeks.forEach((weekDays, weekIndex) => {
    const headerContent = [
      new Paragraph({ text: `Weekly Attendance Report (Week ${weekIndex + 1})`, heading: "Title", alignment: "center" }),
      new Paragraph({ text: `College: ${collegeName} | Branch: ${branchName} | Room No: ${roomNo}`, alignment: "center" }),
      new Paragraph({ text: `Month: ${monthName} ${selectedYear}`, alignment: "center" }),
      new Paragraph({ text: `HOD: ${hodName} | Dean: ${deanName}`, alignment: "center" }),
      new Paragraph({ text: "" }), // Spacer
    ];

    // Table Header Row
    const tableHeader = new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Roll No")], width: { size: 10, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph("Student Name")], width: { size: 20, type: WidthType.PERCENTAGE } }),
        ...weekDays.map((day) => {
          const date = new Date(selectedYear, selectedMonth - 1, day);
          return new TableCell({
            children: [
              new Paragraph(
                `${day} (${date.toLocaleDateString("en-US", { weekday: "short" })})`
              ),
            ],
          });
        }),
        new TableCell({ children: [new Paragraph("Total")] }),
        new TableCell({ children: [new Paragraph("%")] }),
      ],
    });

    // Student Attendance Rows
    const studentRows = students.map((student, index) => {
      const studentAttendance = weekDays.map((day) => attendance[index]?.[day - 1] || "-");
      const presentDays = studentAttendance.filter((day) => day === "P").length;
      const percentage = weekDays.length > 0 ? ((presentDays / weekDays.length) * 100).toFixed(2) : "0.00";

      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(student.rollNo.toString())] }),
          new TableCell({ children: [new Paragraph(student.name)] }),
          ...studentAttendance.map((day) => new TableCell({ children: [new Paragraph(day)] })),
          new TableCell({ children: [new Paragraph(`${presentDays}/${weekDays.length}`)] }),
          new TableCell({ children: [new Paragraph(`${percentage}%`)] }),
        ],
      });
    });

    // Create Document
    const doc = new Document({
      sections: [{ children: [...headerContent, new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [tableHeader, ...studentRows] })] }],
    });

    // Generate and Download
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Weekly_Attendance_Week${weekIndex + 1}_${selectedYear}_${selectedMonth}.docx`);
    });
  });
};

export default downloadWeeklyAttendanceAsDoc;
