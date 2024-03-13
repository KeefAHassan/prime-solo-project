import React, { useEffect, useState } from "react";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import Habit from "./Habit/habit";
import { useHistory } from "react-router-dom";
import axios from "axios";
function UserPage() {
  const user = useSelector((store) => store.user);
  const history = useHistory();
  const [habits, setHabits] = useState([]);
  const getHabits = async () => {
    const response = await axios.get("/api/habit");
    console.log(response.data);
    setHabits(response.data);
  };
  useEffect(() => {
    getHabits();
  }, []);
  return (
    <div className="container">
      <div>
        <button
          onClick={() => history.push("/create-habit")}
          className="create"
        >
          Create New Habit
        </button>
      </div>
      <div className="list">
        {habits.map((habit) => (
          <Habit habit={habit} refreshHabit={()=>getHabits()} />
        ))}
      </div>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
