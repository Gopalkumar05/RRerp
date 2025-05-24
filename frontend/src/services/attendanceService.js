import axios from "axios";

const API_URL = "https://rrerp.onrender.com/api/attendance";

export const getAttendance = async (teacherCode) => {
  try {
    const response = await axios.get(`${API_URL}/teacher/${teacherCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return null;
  }
};
