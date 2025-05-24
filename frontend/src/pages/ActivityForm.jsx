import { useState } from "react";
import axios from "axios";

const ActivityForm = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:5000/api/activities", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setText("");
      setFile(null);
      alert("Activity added successfully!");
    } catch (error) {
      console.error("Error adding activity:", error);
      alert("Failed to add activity");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h3 className="text-2xl font-bold mb-4">Add New Activity</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Activity Text</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Attach a File (Optional)</label>
          <input
            type="file"
            className="w-full p-2 border rounded-md"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-md">
          Submit Activity
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;
