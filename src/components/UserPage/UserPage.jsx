import React, { useEffect, useState } from "react";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import Habit from "./Habit/habit";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { gapi } from "gapi-script";
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
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  document.getElementById("authorize_button").style.visibility = "hidden";
  document.getElementById("signout_button").style.visibility = "hidden";

  /**
   * Callback after api.js is loaded.
   */
  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  /**
   * Callback after Google Identity Services are loaded.
   */
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  }

  /**
   * Enables user interaction after all libraries are loaded.
   */
  function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      document.getElementById("authorize_button").style.visibility = "visible";
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      document.getElementById("signout_button").style.visibility = "visible";
      document.getElementById("authorize_button").innerText = "Refresh";

    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      document.getElementById("content").innerText = "";
      document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
    }
  }

  
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
      <button id="authorize_button" onClick={()=>handleAuthClick()}>
        Authorize
      </button>
      <button id="signout_button" onClick={()=>handleSignoutClick()}>
        Sign Out
      </button>

      <div className="list">
        {habits.map((habit) => (
          <Habit
            habit={habit}
            refreshHabit={() => getHabits()}
            key={habit.id}
          />
        ))}
      </div>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
