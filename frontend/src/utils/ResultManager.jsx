import React, { useState } from 'react';
import axios from 'axios';

const examTypes = ['Sessional1', 'Sessional2', 'PUT'];
const branches = ['CSE', 'ECE', 'ME', 'IT'];

export default function ResultManager() {
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [examType, setExamType] = useState('');
  const [branch, setBranch] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');
const [messageType, setMessageType] = useState(''); // 'success' or 'error'


  const getTotalMarks = () => (examType === 'PUT' ? 100 : 30);

  const addStudent = () => {
    const newStudent = {
      name: '',
      rollNo: '',
      marks: subjects.map(subject => ({
        subject,
        marksObtained: 0,
        totalMarks: getTotalMarks()
      }))
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const removeStudent = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const addSubject = () => {
    const updatedSubjects = [...subjects, ''];
    setSubjects(updatedSubjects);
    setStudents(students.map(student => ({
      ...student,
      marks: [...student.marks, { subject: '', marksObtained: 0, totalMarks: getTotalMarks() }]
    })));
  };

  const removeSubject = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
    setStudents(students.map(student => ({
      ...student,
      marks: student.marks.filter((_, i) => i !== index)
    })));
  };

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = value;
    setSubjects(updatedSubjects);
    setStudents(students.map(student => {
      const updatedMarks = [...student.marks];
      updatedMarks[index].subject = value;
      return { ...student, marks: updatedMarks };
    }));
  };

  const handleStudentChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const handleMarksChange = (studentIdx, subjectIdx, value) => {
    const updated = [...students];
    const marks = [...updated[studentIdx].marks];
    marks[subjectIdx].marksObtained = parseInt(value) || 0;
    marks[subjectIdx].totalMarks = getTotalMarks();
    updated[studentIdx].marks = marks;
    setStudents(updated);
  };

  const saveResults = async () => {
    const isValid = batch && semester && examType && branch &&
      subjects.length > 0 && students.every(s => s.name && s.rollNo && s.marks.length === subjects.length);

      if (!isValid) {
        setMessageType('error');
        setMessage("Please complete all fields");
        return;
      }
    
      const rollNos = students.map(s => s.rollNo.trim());
      const uniqueRollNos = new Set(rollNos);
      if (uniqueRollNos.size !== rollNos.length) {
        setMessageType('error');
        setMessage("Duplicate roll numbers found! Each student must have a unique roll number.");
        return;
      }
    

    try {
      await axios.post('https://rrerp.onrender.com/api/results/grid-save', {
        batch,
        semester,
        examType,
        branch,
        subjects,
        students
      });
      setMessageType('success');
      setMessage("Results saved successfully!");
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 2000);
    } catch (err) {
      console.log(err);
      setMessageType('error');
      setMessage("Error saving results.");
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 2000);
    }
  };

  const fetchResults = async () => {
    if (!(batch && semester && examType && branch)) {
      return alert("Please select all filters (Batch, Semester, Exam Type, Branch) first.");
    }

    try {
      const { data } = await axios.get('https://rrerp.onrender.com/api/results/grid-fetch', {
        params: { batch, semester, examType, branch }
      });
      setSubjects(data.subjects || []);
      setStudents(data.students || []);
      setMessageType('success');
      setMessage("fetching data successfully!");
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 2000);
    } catch (err) {
      console.log(err);
      setMessageType('error');
      setMessage("Error fetching data.");
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 2000);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input placeholder="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} className="border p-2" />
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="border p-2">
          <option value="">Semester</option>
          {[...Array(8)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
        </select>
        <select value={examType} onChange={(e) => setExamType(e.target.value)} className="border p-2">
          <option value="">Exam</option>
          {examTypes.map(type => <option key={type}>{type}</option>)}
        </select>
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="border p-2">
          <option value="">Branch</option>
          {branches.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={fetchResults} className="bg-yellow-500 text-white px-3 py-1 rounded">Fetch Results</button>
        <button onClick={addSubject} className="bg-blue-500 text-white px-3 py-1 rounded">Add Subject</button>
        <button onClick={addStudent} className="bg-green-500 text-white px-3 py-1 rounded">Add Student</button>
        <button onClick={saveResults} className="bg-purple-500 text-white px-3 py-1 rounded">Save Results</button>
      </div>
      {message && (
  <div className={`mb-4 p-2 rounded text-white ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
    {message}
  </div>
)}

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Roll No</th>
            <th className="border p-2">Name</th>
            {subjects.map((subject, i) => (
              <th key={i} className="border p-2">
                <input value={subject} onChange={(e) => handleSubjectChange(i, e.target.value)} className="border px-1" />
                <button onClick={() => removeSubject(i)} className="ml-1 text-red-500">×</button>
              </th>
            ))}
            <th className="border p-2">Obtained</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">%</th>
            <th className="border p-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, i) => {
            const obtained = student.marks.reduce((acc, m) => acc + m.marksObtained, 0);
            const total = student.marks.reduce((acc, m) => acc + m.totalMarks, 0);
            const percent = total ? ((obtained / total) * 100).toFixed(2) : 0;

            return (
              <tr key={i}>
                <td className="border p-2">
                  <input value={student.rollNo} onChange={(e) => handleStudentChange(i, 'rollNo', e.target.value)} className="border px-1" />
                </td>
                <td className="border p-2">
                  <input value={student.name} onChange={(e) => handleStudentChange(i, 'name', e.target.value)} className="border px-1" />
                </td>
                {student.marks.map((mark, j) => (
                  <td key={j} className="border p-2">
                    <input
                      type="number"
                      value={mark.marksObtained}
                      onChange={(e) => handleMarksChange(i, j, e.target.value)}
                      className="w-full border px-1"
                    />
                  </td>
                ))}
                <td className="border p-2">{obtained}</td>
                <td className="border p-2">{total}</td>
                <td className="border p-2">{percent}%</td>
                <td className="border p-2 text-center">
                  <button onClick={() => removeStudent(i)} className="text-red-600 font-bold">×</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
