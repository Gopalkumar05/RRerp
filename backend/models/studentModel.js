import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: String,
  marks: Number,
});

const resultSchema = new mongoose.Schema({
  studentName: String,
  rollNo: String,
  subjects: [subjectSchema],
  total: Number,
  percentage: Number,
  batch: String,
  semester: String,
  sessional: String,
  put: String,
});

export default mongoose.model('Result', resultSchema);
