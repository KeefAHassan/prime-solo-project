import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gapi } from "gapi-script";
import { useHistory } from "react-router-dom";

function ConnectGoogle() {
    const history =useHistory()
   
    
      let tokenClient;
      let gapiInited = false;
      let gisInited = false;
    
      function gisLoaded() {
        console.log("GIS LOADED");
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id:
            import.meta.env.VITE_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/calendar",
          callback: "",
        });
        gisInited = true;
        maybeEnableButtons();
      }
    
      function gapiLoaded() {
        console.log("GAPI LOADED");
        gapi.load("client", initializeGapiClient);
      }
    
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey:import.meta.env.
          VITE_GOOGLE_API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
        });
        gapiInited = true;
        maybeEnableButtons();
      }
    
      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          console.log("Both loaded");
        }
      }
    
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw resp;
          }
          console.log("Token response", resp);
         // localStorage.setItem("googleToken", JSON.stringify(tokenClient))
          history.push("/user")
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
    
      useEffect(() => {
        const loadScript = (src, onLoadCallback) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.defer = true;
          script.onload = onLoadCallback;
          document.body.appendChild(script);
          return script;
        };
    
        const gapiScript = loadScript(
          "https://apis.google.com/js/api.js",
          gapiLoaded
        );
        const gisScript = loadScript(
          "https://accounts.google.com/gsi/client",
          gisLoaded
        );
    
        // Cleanup function to remove the dynamically added scripts when component unmounts
        return () => {
          document.body.removeChild(gapiScript);
          document.body.removeChild(gisScript);
        };
      }, []);
    
  return (
    <div className="connect" >
      <h1>Connect Your Google Calendar</h1>
      <button className="create" onClick={()=>handleAuthClick()} >connect</button>
      <Link to="/user">Skip</Link>
    </div>
  );
}
export default ConnectGoogle;
