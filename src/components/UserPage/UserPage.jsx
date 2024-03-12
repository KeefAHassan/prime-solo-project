import React, { useState } from "react";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import Habit from "./Habit/habit";

function UserPage() {
  const user = useSelector((store) => store.user);
  const [habits, setHabits] = useState([
    {
      id: 2,
      title: "workout",
      time: "08:00:00",
      frequency: "weekly",
      reminder: 10,
      is_complete: true,
      user_id: 1,
      comments: "i workout today",
    },
    {
      id: 3,
      title: "drink water",
      time: "08:00:00",
      frequency: "daily",
      reminder: 10,
      is_complete: false,
      user_id: 1,
      comments: "i drink 10 cups of water today",
    },
    {
      id: 4,
      title: "walking",
      time: "10:00:00",
      frequency: "daily",
      reminder: 10,
      is_complete: false,
      user_id: 1,
      comments: "i walk today",
    },
  ]);
  return (
    <div className="container">
      <div>
        <button className="create">Create New Habit</button>
      </div>
      <div className="list">
        {habits.map((habit) => (
          <Habit habit={habit} />
        ))}
      </div>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
