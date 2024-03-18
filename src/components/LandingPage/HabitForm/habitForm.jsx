import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

const HabitForm = () => {
  const [habitData, setHabitData] = useState({
    title: "",
    time: "",
    frequency: "daily",
    reminder: "15",
    comments: "",
  });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const habitId = searchParams.get("id");
  const [habit, setHabit] = useState(null);
  const getHabit = async () => {
    const response = await axios.get("/api/habit/" + habitId);
    console.log(response.data);
    setHabit(response.data);
  };
  useEffect(() => {
    if (habitId) {
      getHabit();
    }
  }, [habitId]);
  useEffect(() => {
    if (habit?.id) {
      setHabitData({
        title: habit.title,
        time: habit.time,
        frequency: habit.frequency,
        reminder: habit.reminder,
        comments: habit.comments,
      });
    }
  }, [habit]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData({ ...habitData, [name]: value });
  };
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = habitId
        ? await axios.put("/api/habit/update/" + habitId, habitData)
        : await axios.post("/api/habit", habitData);
      if (response.status === 201) {
        setHabitData({
          title: "",
          time: "",
          frequency: "daily",
          reminder: "15",
          comments: "",
        });
      }
      history.push("/user");
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
            type="time"
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
          <select
            id="reminder"
            name="reminder"
            value={habitData.reminder}
            onChange={handleChange}
            required
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
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

        <button className="create" type="submit">
          Add Habit
        </button>
      </form>
    </div>
  );
};

export default HabitForm;
