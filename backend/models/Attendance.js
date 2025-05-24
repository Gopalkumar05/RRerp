import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  attendance: { type: [String], default: Array(31).fill("") }, // "P", "A", or ""
});

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  username: { type: String, required: true }, // ✅ User ke hisaab se data store hoga
  collegeName: { type: String, required: true },
  branchName: { type: String, required: true },
  roomNo: { type: String, required: true },
  hodName: { type: String, required: true },
  deanName: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true }, // 1-12 for Jan-Dec
  students: [StudentSchema], // Array of students
  holidays: { type: [Number], default: [] }, // Holidays ka list
});

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
export default AttendanceModel;