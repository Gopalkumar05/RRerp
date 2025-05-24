import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
  subject: String,
  marksObtained: Number,
  totalMarks: Number
});

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: {
    type: String,
    required: true,
    unique: true // Globally unique roll number
  },

  marks: [marksSchema] // Array of marks for each student
});

const resultSchema = new mongoose.Schema({
  batch: String,

  semester: String,
  branch: String,
  examType: String,
  subjects: [String],
  students: [studentSchema]
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
