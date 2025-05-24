


import Attendance from '../models/Attendance.js';

export const getStudentView = async (req, res) => {
  try {
    const { username, year, month} = req.params;

    const data = await Attendance.findOne({
      username,
      year: parseInt(year),
      month: parseInt(month),
     
    });

    if (!data) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
