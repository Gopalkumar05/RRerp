import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  roll: String,
  password: String,
});

export default mongoose.model('Student', studentSchema);
