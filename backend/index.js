
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import AttendanceModel from "./models/Attendance.js";
import userRoute from "./routes/user.route.js";
import studentRoutes from './routes/attendanceRoutes.js';
import mongoose from 'mongoose';
import multer from "multer";
import resultRoutes from './routes/resultRoutes.js'
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
connectDB();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ✅ Middleware Setup
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Allow frontend origin
  credentials: true, // Allow cookies (important for JWT authentication)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// ✅ Routes


app.use('/api/students', studentRoutes); // 👈 Add this
app.use('/api/results', resultRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/v1/user", userRoute);


// app.use('/api/attendance', attendanceRoutes);
app.post("/saveAttendance", async (req, res) => {
  try {
      console.log("📌 Received Attendance Data:", JSON.stringify(req.body, null, 2));

      const { username, collegeName, branchName, roomNo, hodName, deanName, year, month, students } = req.body;

      if (!username || !students || students.length === 0) {
          console.warn("🚨 Missing required data.");
          return res.status(400).json({ message: "All required fields must be provided" });
      }

      const numericYear = Number(year);
      const numericMonth = Number(month);

      if (isNaN(numericYear) || isNaN(numericMonth)) {
          return res.status(400).json({ message: "Invalid year or month format" });
      }

      // Format student data properly
      const formattedStudents = students.map((student) => ({
          rollNo: student.rollNo || 0,
          name: student.name || "Unknown",
          attendance: Array.isArray(student.attendance) ? student.attendance : Array(31).fill(""),
      }));

      console.log("📌 Formatted Attendance Data:", formattedStudents);

      // ✅ Check if record exists
      const existingRecord = await AttendanceModel.findOne({ username, year: numericYear, month: numericMonth });

      if (existingRecord) {
          await AttendanceModel.updateOne(
              { username, year: numericYear, month: numericMonth },
              { $set: { students: formattedStudents , collegeName,
                      branchName,   
                      roomNo,       
                      hodName,     
                      deanName     } }
          );
          console.log("✅ Attendance Updated in DB");
          return res.status(200).json({ message: "Attendance updated successfully" });
      }

      // ✅ Create new record if no previous data exists
      const newAttendance = new AttendanceModel({
          username,
          collegeName,
          branchName,
          roomNo,
          hodName,
          deanName,
          year: numericYear,
          month: numericMonth,
          students: formattedStudents,
      });

      await newAttendance.save();
      console.log("✅ New Attendance Saved:", newAttendance);
      res.status(201).json({ message: "Attendance saved successfully" });

  } catch (error) {
      console.error("❌ SERVER ERROR:", error.message);
      res.status(500).json({ message: "Error saving attendance", error: error.message });
  }
});
app.get("/getAttendance/:username/:year/:month", async (req, res) => {
  try {
      const { username, year, month } = req.params;
      const numericYear = Number(year);
      const numericMonth = Number(month);

      console.log(`🔍 Fetching attendance for ${username}, Year: ${numericYear}, Month: ${numericMonth}`);

      if (isNaN(numericYear) || isNaN(numericMonth)) {
          console.error("🚨 Invalid year or month format.");
          return res.status(400).json({ message: "Invalid year or month format" });
      }

      let savedData = await AttendanceModel.findOne({ username, year: numericYear, month: numericMonth });

      if (!savedData) {
          console.warn("🚨 No attendance data found for this user. Creating a fresh sheet.");

          // ✅ Fetch last month's data (might be null for a new user)
          const lastMonthData = await AttendanceModel.findOne({ username }).sort({ year: -1, month: -1 });

          console.log("📌 Last Month's Data:", lastMonthData);  // Check if this is null

          // Ensure we don't try to access properties of null
          const collegeName = lastMonthData?.collegeName || "collage name";
          const branchName = lastMonthData?.branchName || "branch name";
          const roomNo = lastMonthData?.roomNo || "room no";
          const hodName = lastMonthData?.hodName || "hod name";
          const deanName = lastMonthData?.deanName || "dean name";

          // Generate student list
          const students = lastMonthData?.students?.map(s => ({
              rollNo: s.rollNo,
              name: s.name,
              attendance: Array(31).fill(""),
          })) || Array.from({ length: 65 }, (_, i) => ({
              rollNo: i + 1,
              name: `Student ${i + 1}`,
              attendance: Array(31).fill(""),
          }));

          console.log("📌 Fresh Attendance Data to be saved:", {
              username,
              collegeName,
              branchName,
              roomNo,
              hodName,
              deanName,
              students,
              year: numericYear,
              month: numericMonth
          });

          // Create new record
          const newSheet = new AttendanceModel({
              username,
              collegeName,
              branchName,
              roomNo,
              hodName,
              deanName,
              students,
              holidays: [],
              year: numericYear,
              month: numericMonth,
          });

          await newSheet.save();
          console.log("✅ Fresh attendance sheet created in DB.");
          return res.status(200).json(newSheet);
      }

      console.log("✅ Attendance Data Found:", savedData);
   
       res.status(200).json(savedData);
  
  } catch (error) {
      console.error("❌ SERVER ERROR:", error.message);
      res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
});


const activitySchema = new mongoose.Schema({
  text: { type: String, required: true },
  file: { type: String }, // Optional file field
  createdAt: { type: Date, default: Date.now },
});

const Activity = mongoose.model("Activity", activitySchema);

// Set up Multer for file upload (if file is provided)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route to add an activity (with optional file upload)
app.post("/api/activities", upload.single("file"), async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file ? req.file.filename : null;

    const activity = new Activity({
      text,
      file,
    });

    await activity.save();
    res.status(200).json({ message: "Activity added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error adding activity", error: err });
  }
});

// Route to get all activities
// Route to get all activities (latest first)
app.get("/api/activities", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }); // 🕒 sort by time
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activities", error: err });
  }
});



















// ✅ Create HTTP server for WebSocket
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // adjust in production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 A user connected");

  socket.on("updateAttendance", (updatedAttendance) => {
    console.log("📡 Broadcasting updated attendance");
    socket.broadcast.emit("receiveAttendance", updatedAttendance);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected");
  });
});


// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
