import { useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResultPage = () => {
  const [selectedBatch, setSelectedBatch] = useState("2021");
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedExamType, setSelectedExamType] = useState("Sessional1");
  const [rollNo, setRollNo] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [branch, setBranch] = useState("");
  const resultRef = useRef(null);

  const batches = ["2021", "2022", "2023", "2024", "2025", "2026"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const examTypes = ["Sessional1", "Sessional2", "PUT"];

  const fetchStudentResult = async () => {
    const trimmed = rollNo.trim().toLowerCase();
    if (!trimmed) return;

    try {
      const response = await axios.get('http://localhost:5000/api/results/grid-fetch', {
        params: {
          batch: selectedBatch,
          semester: selectedSemester,
          examType: selectedExamType,
          rollNo: trimmed,
        },
      });

      const studentData = response.data.students;
      setFilteredStudents(studentData);
      setBranch(response.data.branch || "");
    } catch (error) {
      console.error("Error fetching student data", error);
      setFilteredStudents([]);
    }
  };

  const downloadPDF = async () => {
    const element = resultRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filteredStudents[0].rollNo}_Result.pdf`);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 to-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Student Result Lookup</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="p-2 border rounded">
          {batches.map(batch => <option key={batch} value={batch}>{batch} Batch</option>)}
        </select>

        <select value={selectedSemester} onChange={(e) => setSelectedSemester(Number(e.target.value))} className="p-2 border rounded">
          {semesters.map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
        </select>

        <select value={selectedExamType} onChange={(e) => setSelectedExamType(e.target.value)} className="p-2 border rounded">
          {examTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>

        <input
          type="text"
          placeholder="Enter Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchStudentResult()}
          className="p-2 border rounded"
        />

        <button onClick={fetchStudentResult} className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </div>

      {filteredStudents.length === 1 ? (
        <div>
          <div
            ref={resultRef}
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              maxWidth: '42rem',
              margin: '1.5rem auto',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              color: '#1e3a8a',
              fontFamily: 'sans-serif'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
              R R Institute of Modern Technology (RRIMT)
            </h2>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#4b5563', marginBottom: '1.5rem' }}>
              Affiliated to Dr. A.P.J. Abdul Kalam Technical University, Lucknow, Uttar Pradesh
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: '#1f2937', marginBottom: '1rem' }}>
              <p><strong>Name:</strong> {filteredStudents[0].name}</p>
              <p><strong>Roll No:</strong> {filteredStudents[0].rollNo}</p>
              <p><strong>Branch:</strong> {branch}</p>
              <p><strong>Batch:</strong> {selectedBatch}</p>
              <p><strong>Semester:</strong> {selectedSemester}</p>
              <p><strong>Exam:</strong> {selectedExamType}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db', marginTop: '1rem' }}>
              <thead style={{ backgroundColor: '#ebf8ff' }}>
                <tr>
                  <th style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>Subject</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>Obtained Marks</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>Total Marks</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents[0].marks.map((mark, i) => {
                  const percentage = ((mark.marksObtained / mark.totalMarks) * 100).toFixed(2);
                  let grade = "F";
                  if (percentage >= 90) grade = "A+";
                  else if (percentage >= 80) grade = "A";
                  else if (percentage >= 70) grade = "B+";
                  else if (percentage >= 60) grade = "B";
                  else if (percentage >= 50) grade = "C";
                  else if (percentage >= 40) grade = "D";

                  return (
                    <tr key={i} style={{ textAlign: 'center' }}>
                      <td style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>{mark.subject}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>{mark.marksObtained}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>{mark.totalMarks}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>{grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: '1rem', textAlign: 'center', fontWeight: '500', color: '#1f2937' }}>
              <p><strong>Total Marks:</strong> {filteredStudents[0].marks.reduce((acc, m) => acc + m.totalMarks, 0)}</p>
              <p><strong>Marks Obtained:</strong> {filteredStudents[0].marks.reduce((acc, m) => acc + m.marksObtained, 0)}</p>
              <p><strong>Overall Percentage:</strong> {(
                (filteredStudents[0].marks.reduce((acc, m) => acc + m.marksObtained, 0) /
                  filteredStudents[0].marks.reduce((acc, m) => acc + m.totalMarks, 0)) * 100
              ).toFixed(2)}%</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      ) : rollNo ? (
        <p className="text-center text-red-600 mt-6">No student found with Roll No: {rollNo}</p>
      ) : null}
    </div>
  );
};

export default ResultPage;
