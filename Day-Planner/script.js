const planner = document.getElementById("planner");

// Time slots (you can change these)
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM"
];

// Load saved tasks
function loadTasks() {
  timeSlots.forEach((time, index) => {
    const task = localStorage.getItem(`task-${index}`) || "";
    createTimeBlock(time, task, index);
  });
}

// Create time block row
function createTimeBlock(time, task, index) {
  const block = document.createElement("div");
  block.className = "time-block";

  const label = document.createElement("div");
  label.className = "time-label";
  label.innerText = time;

  const input = document.createElement("input");
  input.className = "task-input";
  input.type = "text";
  input.value = task;

  const button = document.createElement("button");
  button.className = "save-btn";
  button.innerText = "Save";
  button.onclick = () => {
    localStorage.setItem(`task-${index}`, input.value);
    alert("Task saved!");
  };

  block.appendChild(label);
  block.appendChild(input);
  block.appendChild(button);

  planner.appendChild(block);
}

// Initialize planner
loadTasks();
