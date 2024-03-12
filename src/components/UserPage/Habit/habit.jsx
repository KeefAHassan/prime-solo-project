function Habit({ habit }) {
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
    // Pad single digits with leading zeros
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
  }
  return (
    <div className="habit">
      <h2>{habit.title}</h2>
      <p>{generateTimeRange(habit.time)}</p>
      <div className="icons">
        {!habit.is_complete && (
          <label class="checkbox" style={{ fontSize: "10vmin" }}>
            <input type="checkbox" />
            <div class="check"></div>
          </label>
        )}
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-trash-2"
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