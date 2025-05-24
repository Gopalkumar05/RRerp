import express from 'express';
import Result from '../models/Result.js'; // Assuming your schema is in the models folder

const router = express.Router();

// Save Results
router.post('/grid-save', async (req, res) => {
  try {
    const { batch, semester,branch, examType, subjects, students } = req.body;

    // Check if result with the same batch, semester, and examType already exists
    let result = await Result.findOne({ batch, semester,branch, examType });

    if (result) {
      // Update the existing result
      result.subjects = subjects;
      result.students = students;
    } else {
      // Create a new result entry
      result = new Result({
        batch,
        semester,
        branch,
        examType,
        subjects,
        students
      });
    }

    // Save the result to the database
    await result.save();
    res.status(200).json({ message: 'Results saved successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving results!' });
  }
});


// router.get('/grid-fetch', async (req, res) => {
//   try {
//     const { batch, semester, examType } = req.query;

//     const result = await Result.findOne({ batch, semester, examType });

//     if (result) {
//       // Calculate total and percentage for each student
//       result.students.forEach(student => {
//         let totalMarks = 0;
//         let totalObtainedMarks = 0;

//         // Calculate total marks and obtained marks for each student
//         student.marks.forEach(mark => {
//           totalMarks += mark.totalMarks;
//           totalObtainedMarks += mark.marksObtained;
//         });

//         // Calculate percentage
//         student.totalMarks = totalMarks;
//         student.obtainedMarks = totalObtainedMarks;
//         student.percentage = ((totalObtainedMarks / totalMarks) * 100).toFixed(2);
//       });

//       res.status(200).json(result);
//     } else {
//       // If result not found, create a new sheet (fresh sheet)
//       const newResult = new Result({
//         batch,
//         semester,
//         branch,
//         examType,
//         subjects: [],  // Empty subjects initially
//         students: []   // Empty students initially
//       });

//       await newResult.save();

//       res.status(200).json(newResult);  // Return the newly created sheet
//     }
//   } catch (err) {
//     console.error('Error fetching results:', err);
//     res.status(500).json({ message: 'Error fetching results!' });
//   }
// });


// Get last used session
router.get('/last-session', async (req, res) => {
  try {
    const last = await Result.findOne().sort({ updatedAt: -1 });
    if (!last) {
      return res.status(404).json({ message: 'No previous session found' });
    }

    res.json({
      batch: last.batch,
      semester: last.semester,
      branch:last.branch,
      examType: last.examType
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching last session!' });
  }
});


export default router;
router.get('/grid-fetch', async (req, res) => {
  try {
    const { batch, semester,branch, examType, rollNo } = req.query;

    const result = await Result.findOne({ batch, semester, examType });

    if (result) {
      // Filter students if rollNo is provided
      let students = result.students;

      if (rollNo) {
        const roll = rollNo.trim().toLowerCase();
        students = students.filter(student => student.rollNo.toLowerCase() === roll);
      }

      // Calculate total, obtained, and percentage
      students.forEach(student => {
        let totalMarks = 0;
        let totalObtainedMarks = 0;

        student.marks.forEach(mark => {
          totalMarks += mark.totalMarks;
          totalObtainedMarks += mark.marksObtained;
        });

        student.totalMarks = totalMarks;
        student.obtainedMarks = totalObtainedMarks;
        student.percentage = ((totalObtainedMarks / totalMarks) * 100).toFixed(2);
      });

      return res.status(200).json({
        students,
        branch: result.branch,
        subjects: result.subjects
      });
    } 
    else {
      // If result not found, create new result sheet
      const newResult = new Result({
        batch,
        semester,
        branch,
        examType,
        subjects: [],
        students: []
      });

      await newResult.save();
      return res.status(200).json({
        students: [],
        branch,
        subjects: []
      });
    }
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Error fetching results!' });
  }
});
