import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("https://rrerp.onrender.com/api/activities");
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }); // e.g. 10 May 2025, 03:45 PM
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      <h2 className="text-4xl font-bold text-blue-800 mb-6">Latest College Activities</h2>
      <ul className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <li key={index} className="border-b pb-2">
               <p className="text-sm text-gray-600 mb-1">
                Posted on: {formatDate(activity.createdAt)}
              </p>
              <p className="font-medium">{activity.text}</p>
             
              {activity.file && (
                <a
                  href={`https://rrerp.onrender.com/uploads/${activity.file}`}
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Attached File
                </a>
              )}
            </li>
          ))
        ) : (
          <li>No activities available</li>
        )}
      </ul>
      <Link
        to="/"
        className="mt-6 inline-block text-blue-600 hover:text-blue-800 font-medium underline"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ActivitiesPage;
