import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function Habit({ habit, refreshHabit }) {
  function generateTimeRange(startTime) {
    // Parse input time
    const [hours, minutes, seconds] = startTime.split(":").map(Number);

    // Add an hour to the start time
    const endHours = (hours + 1) % 24;

    // Format start and end times
    const formattedStartTime = formatTime(hours, minutes);
    const formattedEndTime = formatTime(endHours, minutes);

    // Determine if it's AM or PM
    const period = hours < 12 ? "AM" : "PM";

    // Generate the text
    return `${formattedStartTime} ${period} - ${formattedEndTime} ${period}`;
  }

  function formatTime(hours, minutes) {
    // Convert hours to 12-hour format
    const period = hours < 12 ? "AM" : "PM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
  }
//mark as done
  const [loading, setLoading] = useState(false);
  const markAsDone = async () => {
    try {
      setLoading(true);
      const response = await axios.put("/api/habit/" + habit.id);
      console.log(response.data);
      refreshHabit();
    } catch (error) {
      console.error("Error adding habit:", error);
      setLoading(false);
      alert("Error adding habit");
    }
  };
  const deleteHabit = async () => {
    try {
      setLoading(true);
      const response = await axios.delete("/api/habit/" + habit.id);
      console.log(response.data);
      refreshHabit();
    } catch (error) {
      console.error("Error adding habit:", error);
      setLoading(false);
      alert("Error adding habit");
    }
  };
  function formatDate(inputDate) {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    if (inputDate.toDateString() === currentDate.toDateString()) {
      return "today";
    } else if (inputDate.toDateString() === tomorrow.toDateString()) {
      return "tomorrow";
    } else if (inputDate.toDateString() === yesterday.toDateString()) {
      return "yesterday";
    } else {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return inputDate.toLocaleDateString("en-US", options);
    }
  }

  return (
    <div className={`habit ${habit.is_complete && "done"}`}>
     {!habit.is_complete && <Link className="edit" to ={`/create-habit?id=${habit.id}`}>Edit</Link>}
      <h2>{habit.title}</h2>
      <p className="comments">{habit.comments}</p>
      <p>{habit.frequency}</p>
      <p className="due">
        {habit.is_complete ? "Done" : "Due"}{" "}
        {formatDate(new Date(habit.due)).toUpperCase()}
      </p>
      <p>{generateTimeRange(habit.time)}</p>
      <div className="icons">
       {!habit.is_complete && <p className="markDone">Done</p>}
        {!habit.is_complete ? (
          <label className="checkbox" style={{ fontSize: "10vmin" }}>
            <input
              type="checkbox"
              disabled={loading}
              onChange={(e) => {
                if (e.target.checked) {
                  markAsDone();
                }
              }}
            />
            <div className="check"></div>
          </label>
        ) : (
          <p className="complete">COMPLETE</p>
        )}
        <button onClick={() => deleteHabit()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}
export default Habit;
