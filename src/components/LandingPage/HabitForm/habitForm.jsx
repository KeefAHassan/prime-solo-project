import React, { useState } from "react";
import axios from "axios";

const HabitForm = () => {
  const [habitData, setHabitData] = useState({
    title: "",
    time: "",
    frequency: "daily",
    reminder: "",
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData({ ...habitData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/habits", habitData);
      if (response.status === 201) {
        alert("Habit added successfully");
        setHabitData({
          title: "",
          time: "",
          frequency: "daily",
          reminder: "",
          comments: "",
        });
      }
    } catch (error) {
      console.error("Error adding habit:", error);
      alert("Error adding habit");
    }
  };

  return (
    <div>
      <h2>Add New Habit</h2>
      <form onSubmit={handleSubmit}>
        <div className="group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={habitData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="group">
          <label htmlFor="time">Time:</label>
          <input
            type="text"
            id="time"
            name="time"
            value={habitData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="group">
          <label htmlFor="frequency">Frequency:</label>
          <select
            id="frequency"
            name="frequency"
            value={habitData.frequency}
            onChange={handleChange}
            required
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="group">
          <label htmlFor="reminder">Reminder:</label>
          <input
            type="text"
            id="reminder"
            name="reminder"
            value={habitData.reminder}
            onChange={handleChange}
            required
          />
        </div>
        <div className="group">
          <label htmlFor="comments">Comments:</label>
          <input
            type="text"
            id="comments"
            name="comments"
            value={habitData.comments}
            onChange={handleChange}
          />
        </div>

        <button className="create" type="submit">Add Habit</button>
      </form>
    </div>
  );
};

export default HabitForm;
