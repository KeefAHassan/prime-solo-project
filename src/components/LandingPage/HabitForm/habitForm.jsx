import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { gapi } from "gapi-script";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

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
  const [habitTitle, setHabitTitle] = useState("");
  useEffect(() => {
    if (habit?.id) {
      setHabitData({
        title: habit.title,
        time: habit.time,
        frequency: habit.frequency,
        reminder: habit.reminder,
        comments: habit.comments,
      });
      setHabitTitle({value:habit.title, label:habit.title})
    }
  }, [habit]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData({ ...habitData, [name]: value });
  };
  const history = useHistory();
  // gapi.load("client", function () {
  //   gapi.client
  //     .init({})
  //     .then(function () {
  //       let googleToken = localStorage.getItem("googleToken");
  //       const credentials = JSON.parse(googleToken); // parse it if you got it as string
  //       gapi.client.setToken(credentials);
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //     });
  // });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body={...habitData,title:habitTitle.value}
      const response = habitId
        ? await axios.put("/api/habit/update/" + habitId, body)
        : await axios.post("/api/habit", body);
      if (response.status === 201) {
        const addEvent = () => {
          const event = {
            summary: habitData.title,
            description: habitData.comments,
            start: {
              dateTime: new Date(),
              timeZone: "America/Chicago",
            },
            end: {
              dateTime: new Date(new Date().getTime() + 3600000),
              timeZone: "America/Chicago",
            },
            recurrence: [`RRULE:FREQ=${habitData.frequency.toUpperCase()}`],
            reminders: {
              useDefault: false,
              overrides: [{ method: "popup", minutes: habitData.reminder }],
            },
          };

          const request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });

          request.execute(function (event) {
            console.log(event);
          });
        };
        const authInstance = gapi.auth2.getAuthInstance();
        console.log(authInstance);
        authInstance.then(
          function () {
            // onInit
            console.log(authInstance.isSignedIn.get());
          },
          function () {
            // onError
          }
        );
        addEvent();
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
      //alert("Error adding habit");
      history.push("/user");
    }
  };
  const suggestedHabits = [
    { value: "Exercise", label: "Exercise" },
    { value: "Meditation", label: "Meditation" },
    { value: "Journaling",label: "Journaling" },
    { value: "Healthy Eating", label: "Healthy Eating" },
    { value: "Gratitude Practice",label: "Gratitude Practice" },
    { value: "Mindfulness", label: "Mindfulness" },
    { value: "Time Management", label: "Time Management" },
    { value: "Goal Setting", label: "Goal Setting" },
    { value: "Socializing", label: "Socializing" },
    { value: "Budgeting",label: "Budgeting" },
    { value: "Learning a new skill", label: "Learning a new skill" },
    { value: "Volunteering", label: "Volunteering" },
    { value: "Creativity Practice", label: "Creativity Practice" },
    { value: "Positive Affirmations", label: "Positive Affirmations" },
    { value: "Environmental Sustainability", label: "Environmental Sustainability" },
    { value: "Digital Detox",label: "Digital Detox" },
    { value: "Self-care Routine", label: "Self-care Routine" },
    { value: "Reading",label: "Reading" },
    { value: "Running", label: "Running" },
    { value: "Cooking", label: "Cooking" }
  ];
  return (
    <div>
      <h2>Add New Habit</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <CreatableSelect
                options={suggestedHabits}
                className="mt-2"
                value={habitTitle}
                onChange={setHabitTitle}
                placeholder="Select or type title..."
              />
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
