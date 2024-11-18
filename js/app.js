//================ DOM ELEMENTS & GLOBAL VARIABLES ================

// Calendar Core Elements
const calendar = document.querySelector(".calendar"),
      date = document.querySelector(".date"),
      daysContainer = document.querySelector(".days"),
      prev = document.querySelector(".prev"),
      next = document.querySelector(".next");
      
// Navigation and Control Elements
const todayBtn = document.querySelector(".today-btn"),
      gotoBtn = document.querySelector(".goto-btn"),
      dateInput = document.querySelector(".date-input"),
      viewEventsBtn = document.querySelector(".view-events-btn"),
      viewTasksBtn = document.querySelector(".view-tasks-btn"),
      clearEventsBtn = document.querySelector(".clear-events-btn");

// Today's View Elements
const todayContainer = document.querySelector(".today-container"),
      eventDay = document.querySelector(".event-day"),
      eventDate = document.querySelector(".event-date"),
      eventsContainer = document.querySelector(".events");

// Event Management Elements
const addEventBtn = document.querySelector(".add-event"),
      addEventWrapper = document.querySelector(".add-event-wrapper"),
      addEventCloseBtn = document.querySelector(".close"),
      addEventTitle = document.querySelector(".event-name"),
      addEventDate = document.querySelector(".event-date-input"),
      addEventFrom = document.querySelector(".event-time-from"),
      addEventTo = document.querySelector(".event-time-to"),
      addEventSubmit = document.querySelector(".add-event-btn");

// Task Management Elements
const tasksContainer = document.querySelector(".tasks"),
      addTaskBtn = document.querySelector(".add-task"),
      addTaskWrapper = document.querySelector(".add-task-wrapper"),
      addTaskCloseBtn = document.querySelector(".close"),
      addTaskTitle = document.querySelector(".task-name"),
      addTaskDeadDate = document.querySelector(".task-dead-date"),
      addTaskDeadTime = document.querySelector(".task-dead-time"),
      addTaskUrgent = document.querySelector(".task-urgent"),
      addTaskPriority = document.querySelector(".task-priority"),
      addTaskLength = document.querySelector("#task-length"),
      addTaskSubmit = document.querySelector(".add-task-btn");

// View Control Elements
const weeklyViewBtn = document.getElementById("weekly-view");
const monthlyViewBtn = document.getElementById("monthly-view");
let isWeeklyView = true; // Default to weekly view

// Date Tracking
let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
let currentMonth = month;
let currentYear = year;

// Constants
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Data Storage
const eventsArr = [];
const tasksArr = [];
const doneTasksArr = [];

// Initialize Data
getEvents();
getTasks();
getDoneTasks();

//================ TASK STORAGE ================

// Retrieves completed tasks from local storage and adds them to doneTasksArr. 
function getDoneTasks() {
  const storedDoneTasks = localStorage.getItem("doneTasks");
  if (storedDoneTasks !== null) {
    doneTasksArr.push(...JSON.parse(storedDoneTasks));
  }
}

// Save Completed Tasks in doneTasksArr to local storage 
function saveDoneTasks() {
  localStorage.setItem("doneTasks", JSON.stringify(doneTasksArr));
}

// Save Active Tasks in tasksArr containing all active tasks to local storage.
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

// Retrieves active tasks from local storage and adds them to tasksArr.
function getTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks !== null) {
    tasksArr.push(...JSON.parse(storedTasks));
  }
}

// Initialize Calendar Display
function initCalendar() {
  if (isWeeklyView) {
    initWeeklyCalendar();  // Display week view
  } else {
    initMonthlyCalendar(); // Display month view
  }
}

// Initialize Weekly Calendar View
function initWeeklyCalendar() {
  const today = new Date(year, month, activeDay); // Selected date
  const currentDay = today.getDay(); // Current day of week (0-6)
  const startDate = new Date(today); // Week start (Sunday)
  const endDate = new Date(today); // Week end (Saturday)

  // Update calendar header
  date.innerHTML = months[month] + " " + year;

  // Calculate week boundaries
  startDate.setDate(today.getDate() - currentDay); // Move to Sunday
  endDate.setDate(today.getDate() + (6 - currentDay)); // Move to Saturday

  // Initialize HTML container for days
  let days = "";

  // count tasks for a specific date
  function getTaskCount(day, month, year) {
    let count = 0;
    tasksArr.forEach(taskObj => {
      if (taskObj.day === day && taskObj.month === month && taskObj.year === year) {
        count += taskObj.tasks.length;
      }
    });
    return count;
  }

  // Loop thru days of the week (Sunday to Saturday)
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + i); // Get date for each day of week

    let event = false; // Flag to check if the current day has events
    eventsArr.forEach((eventObj) => {
      if (eventObj.day === dayDate.getDate() && eventObj.month === month + 1 && eventObj.year === year) {
        event = true;  // Mark as true if the day has events
      }
    });

    // Check if the date is in the current month
    if (dayDate.getMonth() === month) {
      const taskCount = getTaskCount(dayDate.getDate(), month + 1, year);
      const taskCountHtml = taskCount > 0 ? `<span class="task-count">${taskCount}</span>` : '';
        
      // Mark today's date as active
      if (dayDate.getDate() === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
        activeDay = dayDate.getDate(); // Set the active day to today
        getActiveDay(dayDate.getDate()); // Display active day details
        updateEvents(dayDate.getDate()); // Update events for today
        days += event ? 
          `<div class="day today active event weekly-view">${dayDate.getDate()}${taskCountHtml}</div>` : 
          `<div class="day today active weekly-view">${dayDate.getDate()}${taskCountHtml}</div>`;
      } else {
        days += event ? 
          `<div class="day event weekly-view">${dayDate.getDate()}${taskCountHtml}</div>` : 
          `<div class="day weekly-view">${dayDate.getDate()}${taskCountHtml}</div>`;
      }
    }
    else {
      // If date is not in current month, add prev-date-week class
      days += `<div class="day prev-date-week">${dayDate.getDate()}</div>`;
    }
  }

  // Update the daysContainer with the days of the current week
  daysContainer.innerHTML = days;
  addListner();  // Add event listeners to te day elements
}

// initialize the calendar with monthly view
function initMonthlyCalendar() {
  const firstDay = new Date(year, month, 1); // First day of the month
  const lastDay = new Date(year, month + 1, 0); // Last day of the month
  const prevLastDay = new Date(year, month, 0); // Last day of the previous month
  const prevDays = prevLastDay.getDate(); // Number of days in the previous month
  const lastDate = lastDay.getDate(); // Number of days in the current month
  const day = firstDay.getDay(); // Day of the week the current month starts on
  const nextDays = 7 - lastDay.getDay() - 1; // Number of days to display for the next month

  date.innerHTML = months[month] + " " + year; // Update the calendar header with the current month and year

  let days = ""; // Placeholder for HTML to populate calendar days

  // count tasks for a specific date
  function getTaskCount(day, month, year) {
    let count = 0;
    tasksArr.forEach(taskObj => {
      if (taskObj.day === day && taskObj.month === month && taskObj.year === year) {
        count += taskObj.tasks.length;
      }
    });
    return count;
  }

  // Add previous month's days
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // Add current month's days
  for (let i = 1; i <= lastDate; i++) {
    let event = false;  // Flag to check if the current day has events
    eventsArr.forEach((eventObj) => {
      if (eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year) {
        event = true;  // Mark as true if the day has events
      }
    });

    const taskCount = getTaskCount(i, month + 1, year);
    const taskCountHtml = taskCount > 0 ? `<span class="task-count">${taskCount}</span>` : '';

    // Mark today's date as active
    if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
      activeDay = i; // Set the active day to today
      getActiveDay(i); // Display active day details
      updateEvents(i); // Update events for today
      days += event ? 
        `<div class="day today active event">${i}${taskCountHtml}</div>` : 
        `<div class="day today active">${i}${taskCountHtml}</div>`;
    } else {
      days += event ? 
        `<div class="day event">${i}${taskCountHtml}</div>` : 
        `<div class="day">${i}${taskCountHtml}</div>`;
    }
  }

  // Add next month's days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days; // Update the calendar days
  addListner(); // Add event listeners to the day elements
}

// Switch to weekly view when the weekly view button is clicked
weeklyViewBtn.addEventListener("click", () => {
  isWeeklyView = true;
  initCalendar();
});

// Switch to monthly view when the monthly view button is clicked
monthlyViewBtn.addEventListener("click", () => {
  isWeeklyView = false;
  initCalendar();
});

// Functionality for previous button
function prevButt() {
  if (isWeeklyView) {
    const currentDate = new Date(year, month, activeDay);
    currentDate.setDate(currentDate.getDate() - 7);
    year = currentDate.getFullYear();
    month = currentDate.getMonth();
    activeDay = currentDate.getDate();
    initCalendar();
  }
  else {
    month--; // Decrement month
    if (month < 0) { // If the month goes below January
      month = 11; // Set month to December
      year--; // Decrement year
    }
    initCalendar(); // Re-initialize the calendar for the new month
  }
}

// Functionality for next button
function nextButt() {
  if (isWeeklyView) {
    const currentDate = new Date(year, month, activeDay);
    currentDate.setDate(currentDate.getDate() + 7);
    year = currentDate.getFullYear();
    month = currentDate.getMonth();
    activeDay = currentDate.getDate();
    initCalendar();
  }
  else {
    month++; // Increment month
    if (month > 11) { // If the month goes above December
      month = 0; // Set month to January
      year++; // Increment year
    }
    initCalendar(); // Re-initialize the calendar for the new month
  }
}

// Event listeners for the previous and next buttons
prev.addEventListener("click", prevButt);
next.addEventListener("click", nextButt);

initCalendar(); // Initialize the calendar when the page loads
showRightContainer(todayContainer); // Show today container by default

// Check for overdue tasks every minute
setInterval(checkAndRescheduleOverdueTasks, 60000);

// Also check immediately on page load
checkAndRescheduleOverdueTasks();

// Function to add click event listeners to each day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      // Reset view states
      isEventListView = false;
      isTaskListView = false;
      isTodayListView = true;

      const dayNumber = e.target.childNodes[0].textContent; //task indicator is sibling element, this to avoid interfering with date
      getActiveDay(dayNumber); // Set active day details
      updateEvents(Number(dayNumber)); // Update events for the selected day
      activeDay = Number(dayNumber); // Update active day
      
      days.forEach((day) => {
        day.classList.remove("active"); // Remove the 'active' class from all days
      });
      
      // Handle switching months when clicking on a day from the previous or next month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
              day.classList.add("active"); // Mark the selected day as active after switching the month
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
              day.classList.add("active"); // Mark the selected day as active after switching the month
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active"); // Mark the selected day as active
      }

      // Switch to today view for the selected day
      showRightContainer(todayContainer);
    });
  });
}


// Event listener for the "Go to" button to navigate to a specific month and year
gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  if (dateInput.value) {
    // Reset view states
    isEventListView = false;
    isTaskListView = false;
    isTodayListView = true;

    const dateObj = new Date(dateInput.value);
    year = dateObj.getFullYear();
    month = dateObj.getMonth();
    activeDay = dateObj.getDate();
    
    initCalendar();
    
    // Update active day visually
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
      if (
        !day.classList.contains("prev-date") &&
        !day.classList.contains("next-date") &&
        day.innerHTML === activeDay.toString()
      ) {
        day.classList.add("active");
        // Update the event day and date display
        getActiveDay(activeDay);
        updateEvents(activeDay);
      }
    });
    
    // Show today container for the selected date
    showRightContainer(todayContainer);
  }
}

// Add a new variable to track the current main left container view
let isEventListView = false;
let isTaskListView = false;
let isTodayListView = true;

//================ EVENT DISPLAY AND FILTERING ================

// Shows all calendar events chronologically
function displayAllEvents() {
  // Sort events by date
  eventsArr.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });

  // Generate HTML for events
  const events = eventsArr.reduce((html, eventObj) => {
    const eventHtml = eventObj.events.map(event => `
      <div class="event" data-date="${eventObj.day}-${eventObj.month}-${eventObj.year}" data-title="${event.title}">
        <div class="title">
          <h3 class="event-title">${event.title}</h3>
          ${event.isTask ? '<span class="task-badge">Task</span>' : ''}
          ${event.isTask && event.urgent ? '<span class="task-urgent-badge">Urgent</span>' : ''}
          ${event.isTask && event.highPriority ? '<span class="task-priority-badge">High Priority</span>' : ''}
        </div>
        <div class="event-time">
          <span class="event-time">${event.time}</span>
        </div>
        <div class="event-date">${eventObj.day} ${months[eventObj.month - 1]} ${eventObj.year}</div>
        <button class="delete-btn">Delete</button>
        ${event.isTask ? '<button class="done-btn">Done</button>' : ''}
      </div>
    `).join('');
    return html + eventHtml;
  }, '');

  // Display events or "No Events" message
  eventsContainer.innerHTML = events || `
    <div class="no-event">
      <h3>No Events</h3>
    </div>`;

  // Add click handlers for events and delete buttons
  addEventHandlers(eventsContainer);
}

//Shows all tasks in a prioritized list view
function displayAllTasks() {
  // Custom sort function for task prioritization
  tasksArr.sort((a, b) => {
    // Compare tasks within each taskObj
    const taskA = a.tasks[0]; // Using first task since we're comparing taskObj properties
    const taskB = b.tasks[0];

    // Urgent tasks always come first
    if (taskA.urgent && !taskB.urgent) return -1;
    if (!taskA.urgent && taskB.urgent) return 1;

    // If both tasks have due dates, compare them
    const hasDateA = a.day && a.month && a.year;
    const hasDateB = b.day && b.month && b.year;
    
    if (hasDateA && hasDateB) {
      const dateA = new Date(a.year, a.month - 1, a.day);
      const dateB = new Date(b.year, b.month - 1, b.day);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
    }
    
    // If only one task has a due date, it comes first
    if (hasDateA && !hasDateB) return -1;
    if (!hasDateA && hasDateB) return 1;

    // For tasks with same urgency and date status, high priority comes first
    if (taskA.highPriority && !taskB.highPriority) return -1;
    if (!taskA.highPriority && taskB.highPriority) return 1;

    // If all other factors are equal, maintain current order
    return 0;
  });

  // Generate HTML for tasks
  const tasks = tasksArr.reduce((html, taskObj) => {
    const taskHtml = taskObj.tasks.map(task =>
      `<div class="task" data-date="${taskObj.day || ''}-${taskObj.month || ''}-${taskObj.year || ''}" data-title="${task.title}">
          <div class="title">
            <h3 class="task-title" data-length="${task.length || 'Not specified'}">${task.title}</h3>
            ${task.urgent ? '<span class="task-urgent-badge">Urgent</span>' : ''}
            ${task.highPriority ? '<span class="task-priority-badge">High Priority</span>' : ''}
          </div>
          ${(task.dTime && task.day && task.month && task.year) ? `
          <div class="task-time">
            <span class="task-time">${task.dTime}</span>
          </div>
          <div class="task-date">${task.day} ${months[task.month - 1]} ${task.year}</div>
          ` : '<div class="no-deadline">No due date</div>'}
          <button class="delete-btn">Delete</button>
          <button class="done-btn">Done</button>
      </div>`
    ).join('');
    return html + taskHtml;
  }, '');

  tasksContainer.innerHTML = tasks || `
    <div class="no-task">
      <h3>No Tasks</h3>
    </div>`;

  // Add click handlers for tasks and delete buttons
  addTaskHandlers(tasksContainer);
}

//Manage the visibility of different right-side views (events/tasks/today)
function showRightContainer(container) {
  // Hide all containers first
  eventsContainer.style.display = "none";
  tasksContainer.style.display = "none";
  todayContainer.style.display = "none";

  // Get heading elements
  const eventDay = document.querySelector(".event-day");
  const eventDate = document.querySelector(".event-date");
  const allEventsHeading = document.querySelector(".all-events-heading");
  const allTasksHeading = document.querySelector(".all-tasks-heading");

  // Hide all headings first
  eventDay.style.display = "none";
  eventDate.style.display = "none";
  allEventsHeading.style.display = "none";
  allTasksHeading.style.display = "none";

  // Show appropriate heading based on container
  if (container === eventsContainer) {
    allEventsHeading.style.display = "block";
  } else if (container === tasksContainer) {
    allTasksHeading.style.display = "block";
  } else {
    eventDay.style.display = "block";
    eventDate.style.display = "block";
  }

  //Show the requested container
  container.style.display = "flex";
}

// Switch to events list view
viewEventsBtn.addEventListener("click", () => {
  isEventListView = true;
  isTaskListView = false;
  isTodayListView = false;
  displayAllEvents();
  showRightContainer(eventsContainer);
});

// Settings popup elements
const settingsBtn = document.querySelector(".settings-btn");
const settingsPopup = document.getElementById("settings-popup");
const settingsCloseBtn = settingsPopup.querySelector(".close-popup");

// Settings button click handler
settingsBtn.addEventListener("click", () => {
  settingsPopup.style.display = "block";
});

// Close settings popup
settingsCloseBtn.addEventListener("click", () => {
  settingsPopup.style.display = "none";
});

// Close settings popup when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === settingsPopup) {
    settingsPopup.style.display = "none";
  }
});

// clear all events
document.querySelector(".settings-options .clear-events-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all events? This cannot be undone.")) {
    clearAllEvents();
    settingsPopup.style.display = "none";
  }
});

// clear task events
document.querySelector(".settings-options .clear-task-events-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all task events? This cannot be undone.")) {
    clearTaskEvents();
    settingsPopup.style.display = "none";
  }
});

// clearing all tasks
document.querySelector(".settings-options .clear-tasks-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks? This cannot be undone.")) {
    clearAllTasks();
    settingsPopup.style.display = "none";
  }
});

// schedule tasks
document.querySelector(".settings-options .schedule-tasks-btn").addEventListener("click", () => {
  scheduleTasks();
  settingsPopup.style.display = "none";
});

// generate random tasks
document.querySelector(".settings-options .generate-random-tasks-btn").addEventListener("click", () => {
  generateRandomTasks();
  settingsPopup.style.display = "none";
});

// generate random events
document.querySelector(".settings-options .generate-random-events-btn").addEventListener("click", () => {
  generateRandomEvents();
  settingsPopup.style.display = "none";
});

// view done tasks
document.querySelector(".settings-options .view-done-tasks-btn").addEventListener("click", () => {
  displayDoneTasks();
  settingsPopup.style.display = "none";
});

function displayDoneTasks() {
  let tasks = "";
  
  // Sort done tasks by completion date (newest first)
  doneTasksArr.sort((a, b) => b.completedDate - a.completedDate);
  
  doneTasksArr.forEach((task) => {
    const completedDate = new Date(task.completedDate);
    tasks += `<div class="task done">
        <div class="title">
          <h3 class="task-title" data-length="${task.length || 'Not specified'}">
            ${task.title}
            ${task.urgent ? '<span class="task-urgent-badge">Urgent</span>' : ''}
            ${task.highPriority ? '<span class="task-priority-badge">High Priority</span>' : ''}
          </h3>
        </div>
        ${task.dTime ? `
        <div class="task-time">
          <span class="task-time">${task.dTime}</span>
        </div>
        <div class="task-date">${task.day} ${months[task.month - 1]} ${task.year}</div>
        ` : '<div class="no-deadline">No due date</div>'}
        <div class="completed-date">Completed: ${completedDate.toLocaleDateString()} ${completedDate.toLocaleTimeString()}</div>
    </div>`;
  });

  tasks = tasks || `<div class="no-task"><h3>No Completed Tasks</h3></div>`;
  
  tasksContainer.innerHTML = tasks;
  document.querySelector(".all-tasks-heading").textContent = "Done Tasks";
  showRightContainer(tasksContainer);
}

// mark a task as done
function markTaskAsDone(taskElement, taskTitle) {
  
  // Find the task in tasksArr
  for (let i = 0; i < tasksArr.length; i++) {
    const taskObj = tasksArr[i];
    const taskIndex = taskObj.tasks.findIndex(task => task.title === taskTitle);
    
    if (taskIndex !== -1) {
      // Get the task and add completion date
      const task = taskObj.tasks[taskIndex];
      task.completedDate = new Date().getTime();
      
      // Move to done tasks array
      doneTasksArr.push(task);
      
      // Remove from tasks array
      taskObj.tasks.splice(taskIndex, 1);
      if (taskObj.tasks.length === 0) {
        tasksArr.splice(i, 1);
      }

      // Remove corresponding task event from events array
      for (let i = eventsArr.length - 1; i >= 0; i--) {
        const eventObj = eventsArr[i];
        const originalLength = eventObj.events.length;
        
        // Filter out events that match this task
        eventObj.events = eventObj.events.filter(event => {
          if (!event.isTask) return true;
          return event.title !== taskTitle;
        });

        // If we removed events and now the day is empty, remove the day entry
        if (eventObj.events.length === 0 && originalLength > 0) {
          eventsArr.splice(i, 1);
        }
      }
      
      // Save all arrays
      saveTasks();
      saveDoneTasks();
      saveEvents();
      
      // Reschedule tasks since a slot opened up
      scheduleTasks();
      
      //Update only the current view
      if (isTaskListView) {
        displayAllTasks();
      } else if (isEventListView) {
        displayAllEvents();
      } else if (isTodayListView) {
        updateTasks(activeDay);
        updateEvents(activeDay);
      }
      
      // Refresh calendar
      initCalendar();
      break;
    }
  }
}

function generateRandomEvents() {
  const eventNames = [
    "Team Sync", "Project Review", "Coffee Break", "Lunch Meeting",
    "Workshop", "Training Session", "Brainstorming", "Client Meeting",
    "Strategy Planning", "Product Demo", "Status Update", "Presentation"
  ];

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  for (let i = 0; i < 10; i++) {
    //Generate random date between today and 30 days from now
    const eventDate = new Date(
      today.getTime() + Math.random() * (thirtyDaysFromNow.getTime() - today.getTime())
    );

    // Generate random start time between 9 AM and 5 PM
    const startHour = Math.floor(Math.random() * (17 - 9)) + 9;
    const startMinutes = Math.floor(Math.random() * 4) * 15; // Round to nearest 15 minutes
    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;

    // Generate random duration between 30 mins and 2 hours
    const durationMinutes = (Math.floor(Math.random() * 4) + 1) * 30;
    const endHour = startHour + Math.floor((startMinutes + durationMinutes) / 60);
    const endMinutes = (startMinutes + durationMinutes) % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    const newEvent = {
      title: eventNames[Math.floor(Math.random() * eventNames.length)] + ` ${i + 1}`,
      time: `${convertTime(startTime)} - ${convertTime(endTime)}`,
      timeFro: convertTime(startTime),
      timeT: convertTime(endTime),
      eDate: eventDate.toISOString().split('T')[0]
    };

    // Add event to eventsArr
    const eventObj = {
      day: eventDate.getDate(),
      month: eventDate.getMonth() + 1,
      year: eventDate.getFullYear(),
      events: [newEvent]
    };

    // Find if we already have events for this date
    const existingDateIndex = eventsArr.findIndex(
      item => item.day === eventObj.day && 
              item.month === eventObj.month && 
              item.year === eventObj.year
    );

    if (existingDateIndex !== -1) {
      eventsArr[existingDateIndex].events.push(newEvent);
    } else {
      eventsArr.push(eventObj);
    }
  }

  // Save and update displays
  saveEvents();
  if (isEventListView) {
    displayAllEvents();
  } else {
    updateEvents(activeDay);
  }
  initCalendar();
  alert("10 random events have been generated!");
}

function generateRandomTasks() {
  const taskNames = [
    "Review Project Docs", "Team Meeting", "Client Call", 
    "Code Review", "Testing", "Documentation", 
    "Bug Fixes", "Feature Development", "Research",
    "Planning Session", "Status Update", "Design Review"
  ];

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  for (let i = 0; i < 10; i++) {
    // Generate random date between tomorrow and 30 days from now
    const dueDate = new Date(
      today.getTime() + Math.random() * (thirtyDaysFromNow.getTime() - today.getTime())
    );
    dueDate.setDate(dueDate.getDate() + 1); // Ensure it's at least tomorrow

    // Generate random time
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const dueTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Generate random task length between 30 mins and 4 hours
    const lengthMinutes = Math.floor(Math.random() * (240 - 30 + 1)) + 30;
    const lengthHours = Math.floor(lengthMinutes / 60);
    const remainingMinutes = lengthMinutes % 60;
    const taskLength = `${lengthHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;

    const newTask = {
      title: taskNames[Math.floor(Math.random() * taskNames.length)] + ` ${i + 1}`,
      dTime: convertTime(dueTime),
      day: dueDate.getDate(),
      month: dueDate.getMonth() + 1,
      year: dueDate.getFullYear(),
      urgent: Math.random() < 0.3, // 30% chance of being urgent
      highPriority: Math.random() < 0.5, // 50% chance of being high priority
      length: taskLength
    };

    // Add task to tasksArr
    const existingDateIndex = tasksArr.findIndex(
      item => item.day === newTask.day && 
              item.month === newTask.month && 
              item.year === newTask.year
    );

    if (existingDateIndex !== -1) {
      tasksArr[existingDateIndex].tasks.push(newTask);
    } else {
      tasksArr.push({
        day: newTask.day,
        month: newTask.month,
        year: newTask.year,
        tasks: [newTask]
      });
    }
  }

  // Save and update displays
  saveTasks();
  if (isTaskListView) {
    displayAllTasks();
  } else {
    updateTasks(activeDay);
  }
  initCalendar();
  alert("10 random tasks have been generated!");
}

//================ TASK SCHEDULING AND AUTOMATION ================
 
//Periodically checks for and handles overdue tasks
function checkAndRescheduleOverdueTasks() {
  const now = new Date();
  let needsRescheduling = false;

  // Scan all scheduled task events
  eventsArr.forEach((eventObj) => {
    const eventDate = new Date(eventObj.year, eventObj.month - 1, eventObj.day);
    
    eventObj.events.forEach((event) => {
      if (!event.isTask) return;

      // Get event time as Date object
      const [timeStr, period] = event.timeFro.split(' ');
      const [hours, minutes] = timeStr.split(':').map(Number);
      const eventTime = new Date(eventDate);
      eventTime.setHours(
        period === 'PM' && hours !== 12 ? hours + 12 : hours,
        minutes
      );

      // Check for overdue and incomplete tasks
      if (eventTime < now && !doneTasksArr.some(task => task.title === event.title)) {
        needsRescheduling = true;
      }
    });
  });

  // Handle rescheduling if needed
  if (needsRescheduling) {
    clearTaskEvents();
    scheduleTasks();
    alert("Some tasks were overdue and have been rescheduled.");
  }
}

//Main scheduling algorithm that assigns tasks to available time slots.
function scheduleTasks() {
  // First clear all existing task events
  clearTaskEvents();
  
  // Keep track of all scheduled time slots
  const scheduledSlots = [];
  
  // Collect all unscheuled tasks and sort by priority
  const unscheduledTasks = [];
  tasksArr.forEach(taskObj => {
    taskObj.tasks.forEach(task => {
      // Only include tasks that don't have events created for them
      const hasEvent = eventsArr.some(eventObj => 
        eventObj.events.some(event => event.title === task.title && event.isTask)
      );
      if (!hasEvent) {
        unscheduledTasks.push(task);
      }
    });
  });

  // Sort tasks: urgent first, then by priority, then by deadline
  unscheduledTasks.sort((a, b) => {
    if (a.urgent !== b.urgent) return b.urgent ? 1 : -1;
    if (a.highPriority !== b.highPriority) return b.highPriority ? 1 : -1;
    
    // Compare dates if both tasks have them
    const hasDateA = a.year && a.month && a.day;
    const hasDateB = b.year && b.month && b.day;
    
    if (hasDateA && hasDateB) {
      if (a.year !== b.year) return a.year - b.year;
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    }
    
    // Tasks with dates come before tasks without dates
    if (hasDateA) return -1;
    if (hasDateB) return 1;
    
    return 0;
  });

  // Function to parse duration string "HH:mm:ss" into minutes
  function parseDuration(duration) {
    if (!duration || duration === '00:00') return 60; // Default to 60 minutes if no duration or 00:00

    // Remove any seconds portion if present
    duration = duration.split('.')[0];

    // Handle case where duration might include seconds
    const parts = duration.split(':');
    if (parts.length === 3) {
      // If format is HH:mm:ss
      const [hours, minutes] = parts;
      return (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    } else if (parts.length === 2) {
      // If format is HH:mm
      const [hours, minutes] = parts;
      return (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    }
  
    // If invalid format, return default 60 minutes
    return 60;
  }

  // Function to check if a time slot is available
  function isTimeSlotAvailable(date, startHour, startMinute, durationMinutes) {
    const endTime = new Date(date);
    endTime.setHours(startHour);
    endTime.setMinutes(startMinute + durationMinutes);
    
    const startTime = new Date(date);
    startTime.setHours(startHour);
    startTime.setMinutes(startMinute);

    // Check if slot is during sleep hours
    if (isDuringSleepHours(startHour, startMinute) || 
        isDuringSleepHours(endTime.getHours(), endTime.getMinutes())) {
      return false;
    }

    // Check for conflicts with scheduled slots
    const slotStart = startTime.getTime();
    const slotEnd = endTime.getTime();
    
    // Check if this slot overlaps with any previously scheduled slots
    if (scheduledSlots.some(slot => doTimesOverlap(slotStart, slotEnd, slot.start, slot.end))) {
      return false;
    }

    // Check for conflicts with existing events
    return !eventsArr.some(eventObj => {
      if (eventObj.day === date.getDate() && 
          eventObj.month === date.getMonth() + 1 && 
          eventObj.year === date.getFullYear()) {
        return eventObj.events.some(event => {
          const [eventStartHour, eventStartMin] = event.timeFro.split(':')[0].split(' ')[0].split(':').map(Number);
          const [eventEndHour, eventEndMin] = event.timeT.split(':')[0].split(' ')[0].split(':').map(Number);
          
          const eventStart = new Date(date);
          eventStart.setHours(eventStartHour);
          eventStart.setMinutes(eventStartMin);
          
          const eventEnd = new Date(date);
          eventEnd.setHours(eventEndHour);
          eventEnd.setMinutes(eventEndMin);

          return doTimesOverlap(
            startTime.getTime(),
            endTime.getTime(),
            eventStart.getTime(),
            eventEnd.getTime()
          );
        });
      }
      return false;
    });
  }

  // Schedule each task
  const scheduledTasks = [];
  const maxDays = 30; // Look up to 30 days ahead
  
  unscheduledTasks.forEach(task => {
    const taskDuration = parseDuration(task.length);
    let scheduled = false;
    let currentDate = new Date();
    
    // If scheduling for today, start from current time
    let startHour = currentDate.getHours();
    let startMinute = currentDate.getMinutes();
    
    // Round up to nearest 30 minutes
    if (startMinute > 0) {
      startMinute = Math.ceil(startMinute / 30) * 30;
      if (startMinute === 60) {
        startHour++;
        startMinute = 0;
      }
    }

    // Try to schedule within the next maxDays
    for (let day = 0; day < maxDays && !scheduled; day++) {
      // Only reset time if we're starting a new day and haven't scheduled anything yet
      if (day > 0 && startHour >= 21) {
        startHour = 0;
        startMinute = 0;
      }

      // Try each 30-minute slot in the day
      while (startHour < 21 && !scheduled) {
        // Create a new Date object for this time slot
        const slotStartTime = new Date(currentDate);
        slotStartTime.setHours(startHour, startMinute);
        
        if (isTimeSlotAvailable(currentDate, startHour, startMinute, taskDuration)) {
          // Format times for the event
          const timeFrom = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
          const endTime = new Date(slotStartTime);
          endTime.setMinutes(endTime.getMinutes() + taskDuration);

          // Get the final hours and minutes
          const endHour = endTime.getHours();
          const endMinute = endTime.getMinutes();
          
          const timeTo = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

          console.log(`Scheduling task: ${task.title}`);
          console.log(`Duration: ${taskDuration} minutes`);
          console.log(`Start time: ${timeFrom}`);
          console.log(`End time: ${timeTo}`);

          // Create event object
          const newEvent = {
            title: task.title,
            time: `${convertTime(timeFrom)} - ${convertTime(timeTo)}`,
            timeFro: convertTime(timeFrom),
            timeT: convertTime(timeTo),
            isTask: true, 
            urgent: task.urgent,
            highPriority: task.highPriority,
            dueDate: task.day && task.month && task.year ? 
              `${task.day} ${months[task.month - 1]} ${task.year}` : 'No due date',
            dueTime: task.dTime || 'No time set'
          };
          
          console.log('Created event:', newEvent);

          // Add to events array
          const eventDate = {
            day: currentDate.getDate(),
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
          };

          let eventObj = eventsArr.find(e => 
            e.day === eventDate.day && 
            e.month === eventDate.month && 
            e.year === eventDate.year
          );

          if (eventObj) {
            eventObj.events.push(newEvent);
          } else {
            eventsArr.push({
              ...eventDate,
              events: [newEvent]
            });
          }

          scheduled = true;
          scheduledTasks.push({
            task,
            scheduledTime: newEvent
          });

          // Add this slot to our scheduled slots
          scheduledSlots.push({
            start: slotStartTime.getTime(),
            end: endTime.getTime()
          });
        }

        // Move to next slot
        startMinute += 30;
        if (startMinute >= 60) {
          startHour++;
          startMinute = 0;
        }
      }

      // Move to next day
      currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + (day + 1));
      startHour = 0;
      startMinute = 0;
    }
  });

  // Save changes and update displays
  saveEvents();
  
  // Show confirmation with results
  const scheduledCount = scheduledTasks.length;
  const unscheduledCount = unscheduledTasks.length - scheduledCount;
  
  let message = `Scheduled ${scheduledCount} tasks.\n`;
  if (unscheduledCount > 0) {
    message += `Could not schedule ${unscheduledCount} tasks due to insufficient time slots.`;
  }
  alert(message);

  // Refresh displays
  if (isEventListView) {
    displayAllEvents();
  } else if (isTaskListView) {
    displayAllTasks();
  } else {
    updateEvents(activeDay);
  }
  
  // Refresh calendar view
  initCalendar();
}

viewTasksBtn.addEventListener("click", () => {
  isTaskListView = true;
  isEventListView = false;
  isTodayListView = false;
  displayAllTasks();
  showRightContainer(tasksContainer);
});

// Event listener for the "Today" button to go to the current date
todayBtn.addEventListener("click", () => {
  isTodayListView = true;
  isEventListView = false;
  isTaskListView = false;

  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  activeDay = today.getDate();
  
  initCalendar();
  
  // Update active day visually
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    if (
      !day.classList.contains("prev-date") &&
      !day.classList.contains("next-date") &&
      day.innerHTML === activeDay.toString()
    ) {
      day.classList.add("active");
    }
  });
  
  showRightContainer(todayContainer);
});

//================ DATE AND TIME UTILITIES ================

//Updates the calendar header with selected day information
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0]; // Get the day name ( Mon, Tue)
  eventDay.innerHTML = dayName; // Display the day name
  eventDate.innerHTML = date + " " + months[month] + " " + year; // Display the full date
}

//Converts time strings to minutes for calculations.
function timeToMinutes(timeStr) {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function doTimesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

//================ EVENT DISPLAY AND SCHEDULING ================

// Refreshes the events display for a selected date, showing both a list view
//and a timeline view of all events and scheduled tasks.
function updateEvents(date) {
  let events = ""; // Variable to hold event HTML
  let scheduleEvents = []; // Array to hold events for sorting

  // Create 24-hour timeline slots (each slot represents 30 minutes)
  const timeSlots = new Array(48).fill(null);

  // Collect and process events for the selected date
  eventsArr.forEach((event) => {
    if (date === event.day && month + 1 === event.month && year === event.year) {
      event.events.forEach((event) => {
        // Convert event times to minutes for sorting and positioning
        const startMinutes = timeToMinutes(event.timeFro);
        const endMinutes = timeToMinutes(event.timeT);
        
        scheduleEvents.push({
          title: event.title,
          time: event.time,
          timeFrom: event.timeFro,
          timeTo: event.timeT,
          startMinutes,
          endMinutes,
          isTask: event.isTask,
          urgent: event.urgent,
          highPriority: event.highPriority
        });
      });
    }
  });

  // Sort events by start time
  scheduleEvents.sort((a, b) => a.startMinutes - b.startMinutes);

  // Generate schedule HTML
  let scheduleHTML = '<div class="timeline">';
  
  // Add time markers
  for (let hour = 0; hour < 24; hour++) {
    const displayHour = hour === 0 ? '12 AM' : 
                       hour < 12 ? `${hour} AM` : 
                       hour === 12 ? '12 PM' : 
                       `${hour - 12} PM`;
    scheduleHTML += `<div class="time-marker">${displayHour}</div>`;
  }
  scheduleHTML += '</div><div class="schedule-events">';

  // Place events in schedule
  scheduleEvents.forEach((event) => {
    const startPercent = (event.startMinutes / (24 * 60)) * 100;
    const duration = event.endMinutes - event.startMinutes;
    const heightPercent = (duration / (24 * 60)) * 100;
    
    // Find the full event object to get due date/time if it's a task
    const eventObj = event.isTask ? eventsArr.find(e => 
      e.events.some(ev => ev.title === event.title)
    )?.events.find(ev => ev.title === event.title) : null;
    
    scheduleHTML += `
      <div class="schedule-event" style="top: ${startPercent}%; height: ${heightPercent}%" data-title="${event.title}">
        <div class="title">
          <h3 class="event-title">
            ${event.title}
            ${event.isTask ? '<span class="task-badge">Task</span>' : ''}
            ${event.isTask && event.urgent ? '<span class="task-urgent-badge">Urgent</span>' : ''}
            ${event.isTask && event.highPriority ? '<span class="task-priority-badge">High Priority</span>' : ''}
          </h3>
        </div>
        <div class="event-time">
          <span class="event-time">${event.time} ${event.isTask && eventObj ? `(Due: ${eventObj.dueDate} ${eventObj.dueTime})` : ''}</span>
        </div>
        <div class="event-date" style="display: none;">${activeDay} ${months[month]} ${year}</div>
        <button class="delete-btn">Delete</button>
        ${event.isTask ? '<button class="done-btn">Done</button>' : ''}
      </div>`;
  });

  scheduleHTML += '</div>';

  // Update the schedule container
  document.querySelector('.schedule').innerHTML = scheduleHTML;
  
  // Add click handlers for schedule event deletion
  document.querySelectorAll('.schedule-event .delete-btn').forEach(deleteBtn => {
    deleteBtn.addEventListener('click', handleEventDeletion);
  });

  // Generate regular events list
  scheduleEvents.forEach((event) => {
    events += `<div class="event">
        <div class="title">
          <i class="fas fa-circle"></i>
          <h3 class="event-title">${event.title}</h3>
          ${event.isTask ? '<span class="task-badge">Task</span>' : ''}
        </div>
        <div class="event-time">
          <span class="event-time">${event.time}</span>
        </div>
        <div class="event-date" style="display: none;">${activeDay} ${months[month]} ${year}</div>
    </div>`;
  });

  // If there are no events for the selected day, display a "No Events" message
  if (events === "") {
    events = `<div class="no-event"><h3>No Events</h3></div>`;
    scheduleHTML = `<div class="no-event"><h3>No Events</h3></div>`;
  }
  
  // Update both the events container and schedule container
  eventsContainer.innerHTML = events;
  document.querySelector('.schedule').innerHTML = scheduleHTML;
  saveEvents(); // Save events to local storage
}

// show the add event form when the addEventBtn is clicked
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active"); // Toggle visibility of add event form
});

// close the add event form
addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

// add event form if clicked outside of it
document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

// Limit the event title to 60 characters
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

//================ EVENTS ================
// Function to add a new event
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventDate = addEventDate.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;

  // Validate inputs
  if (eventTitle === "" || eventDate === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Please fill all the fields");
    return;
  }

  // Parse event date from the date input (YYYY-MM-DD format)
  const [inputYear, inputMonth, inputDay] = eventDate.split('-').map(Number);
  const year = inputYear;
  const month = inputMonth;
  const day = inputDay;

  // Format times
  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  // Create new event object
  const newEvent = {
    title: eventTitle,
    time: `${timeFrom} - ${timeTo}`,
    eDate: eventDate,
    timeFro: timeFrom,
    timeT: timeTo
  };

  // Find or create event entry for this date
  const eventForDate = eventsArr.find(event => 
    event.day === day && 
    event.month === month && 
    event.year === year
  );

  if (eventForDate) {
    // Add event to existing date
    if (!eventForDate.events) {
      eventForDate.events = [];
    }
    eventForDate.events.push(newEvent);
  } else {
    // Create new date entry with event
    eventsArr.push({
      day: day,
      month: month,
      year: year,
      events: [newEvent]
    });
  }

  // Update displays and save
  saveEvents();

  // Always switch to events list view and show all events after adding
  isEventListView = true;
  isTaskListView = false;
  isTodayListView = false;
  displayAllEvents();
  showRightContainer(eventsContainer);

  // Add event indicator and refresh calendar
  const activeDayElem = document.querySelector(".day.active");
  if (activeDayElem && !activeDayElem.classList.contains("event")) {
    activeDayElem.classList.add("event");
  }

  // Reset form
  addEventTitle.value = "";
  addEventDate.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  addEventWrapper.classList.remove("active");

  // Refresh displays
  if (isEventListView) {
    displayAllEvents();
  }
  
  // Refresh calendar view
  initCalendar();
});

//================ TASK FORM HANDLING ================
// Add task form submission
addTaskSubmit.addEventListener("click", () => {
  const taskTitle = addTaskTitle.value;
  const taskDeadDate = addTaskDeadDate.value;
  const taskDeadTime = addTaskDeadTime.value;

  if (taskTitle === "") {
    alert("Please enter a task name");
    return;
  }

  let deadTime = null;
  if (taskDeadTime && taskDeadDate) {
    const deadTimeArr = taskDeadTime.split(":");
    if (
      deadTimeArr.length !== 2 ||
      deadTimeArr[0] > 23 ||
      deadTimeArr[1] > 59
    ) {
      alert("Invalid Time Format");
      return;
    }
    deadTime = convertTime(taskDeadTime);
  }

  let taskExist = false;
  tasksArr.forEach((task) => {
    if (
      task.day === activeDay &&
      task.month === month + 1 &&
      task.year === year
    ) {
      task.tasks.forEach((task) => {
        if (task.title === taskTitle) {
          taskExist = true;
        }
      });
    }
  });

  if (taskExist) {
    alert("Task already added");
    return;
  }

  const newTask = {
    title: taskTitle,
    dTime: deadTime,
    day: taskDeadDate ? Number(taskDeadDate.split('-')[2]) : null,
    month: taskDeadDate ? Number(taskDeadDate.split('-')[1]) : null,
    year: taskDeadDate ? Number(taskDeadDate.split('-')[0]) : null,
    urgent: addTaskUrgent.checked,
    highPriority: addTaskPriority.checked,
    length: (addTaskLength.value === '00:00' ? '01:00' : addTaskLength.value) || '01:00'
  };

  // Parse the deadline date if provided
  let deadlineDay = null;
  let deadlineMonth = null; 
  let deadlineYear = null;
  
  if (taskDeadDate) {
    [deadlineYear, deadlineMonth, deadlineDay] = taskDeadDate.split('-').map(Number);
  }

  let taskAdded = false;
  if (tasksArr.length > 0) {
    tasksArr.forEach((item) => {
      if (
        item.day === deadlineDay &&
        item.month === deadlineMonth &&
        item.year === deadlineYear
      ) {
        item.tasks.push(newTask);
        taskAdded = true;
      }
    });
  }

  if (!taskAdded && taskDeadDate) {
    tasksArr.push({
      day: deadlineDay,
      month: deadlineMonth,
      year: deadlineYear,
      tasks: [newTask],
    });
  } else if (!taskAdded) {
    // If no deadline, still add the task but without date info
    tasksArr.push({
      tasks: [newTask],
    });
  }

  addTaskWrapper.classList.remove("active");
  addTaskTitle.value = "";
  addTaskDeadDate.value = "";
  addTaskDeadTime.value = "";
  updateTasks(activeDay);
  initCalendar(); // Refresh calendar to update task indicators

});

//================ TASK DISPLAY FUNCTIONS ================
function updateTasks(date) {
  let tasks = "";
  tasksArr.forEach((task) => {
    if (
      date === task.day &&
      month + 1 === task.month &&
      year === task.year
    ) {
      task.tasks.forEach((task) => {
        tasks += `<div class="task">
            <div class="title">
              <h3 class="task-title" data-length="${task.length || 'Not specified'}">
                ${task.title}
                ${task.urgent ? '<span class="task-urgent-badge">Urgent</span>' : ''}
                ${task.highPriority ? '<span class="task-priority-badge">High Priority</span>' : ''}
              </h3>
            </div>
            ${task.dTime ? `
            <div class="task-time">
              <span class="task-time">${task.dTime}</span>
            </div>
            <div class="task-date">${task.day} ${months[task.month - 1]} ${task.year}</div>
            ` : '<div class="no-deadline">No due date</div>'}
        </div>`;
      });
    }
  });

  tasks = tasks || `<div class="no-task">
            <h3>No Tasks</h3>
        </div>`;
  
  tasksContainer.innerHTML = tasks;
  saveTasks();
}

addTaskBtn.addEventListener("click", () => {
  addTaskWrapper.classList.toggle("active"); // Toggle visibility of add task form
});

// close the add task form
addTaskCloseBtn.addEventListener("click", () => {
  addTaskWrapper.classList.remove("active");
});

// Close the add task form if clicked outside of it
document.addEventListener("click", (e) => {
  if (e.target !== addTaskBtn && !addTaskWrapper.contains(e.target)) {
    addTaskWrapper.classList.remove("active");
  }
});

// show popup with details
function showDetailsPopup(title, details, options = {}) {
  const popup = document.getElementById('details-popup');
  const popupTitle = popup.querySelector('.popup-title');
  const popupDetails = popup.querySelector('.popup-details');
  const editForm = popup.querySelector('.edit-task-form');

  popupTitle.textContent = title;
  popupDetails.innerHTML = details;
  popup.style.display = 'block';

  // Show edit form only for tasks
  if (options.isTask) {
    editForm.style.display = 'block';
    const taskData = options.taskData;

    // Set initial form values
    const dateInput = editForm.querySelector('.edit-task-date');
    const timeInput = editForm.querySelector('.edit-task-time');
    const lengthInput = editForm.querySelector('.edit-task-length');
    const urgentInput = editForm.querySelector('.edit-task-urgent');
    const priorityInput = editForm.querySelector('.edit-task-priority');

    // Parse and set date if it exists
    if (taskData.date) {
      const [day, month, year] = taskData.date.split(' ');
      const monthIndex = months.indexOf(month);
      const formattedDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dateInput.value = formattedDate;
    }

    // Parse and set time if it exists
    if (taskData.time) {
      const timeMatch = taskData.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let [_, hours, minutes, period] = timeMatch;
        hours = parseInt(hours);
        if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
        timeInput.value = `${String(hours).padStart(2, '0')}:${minutes}`;
      }
    }

    lengthInput.value = taskData.length;
    urgentInput.checked = taskData.urgent;
    priorityInput.checked = taskData.priority;

    // Add save handler
    const saveBtn = editForm.querySelector('.save-task-btn');
    saveBtn.onclick = () => saveTaskChanges(title, {
      date: dateInput.value,
      time: timeInput.value,
      length: lengthInput.value,
      urgent: urgentInput.checked,
      priority: priorityInput.checked
    });
  } else {
    editForm.style.display = 'none';
  }

  // Close popup when clicking the close button or outside the popup
  const closeBtn = popup.querySelector('.close-popup');
  closeBtn.onclick = () => popup.style.display = 'none';
  window.onclick = (e) => {
    if (e.target === popup) popup.style.display = 'none';
  };
}

//================ EVENT AND TASK INTERACTION HANDLERS ================
//Displays detailed information about an event in a popup.
function handleEventClick(event) {
  const eventElement = event.currentTarget;
  const title = eventElement.querySelector('.event-title').textContent;
  const time = eventElement.querySelector('.event-time').textContent;
  const date = eventElement.querySelector('.event-date').textContent;

  const details = `
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Date:</strong> ${date}</p>
  `;

  showDetailsPopup(title, details);
}

//Displays detailed information about a task in a popup.
function handleTaskClick(event) {
  const taskElement = event.currentTarget;
  const title = taskElement.querySelector('.task-title').textContent;
  const time = taskElement.querySelector('.task-time')?.textContent || '';
  const date = taskElement.querySelector('.task-date')?.textContent;
  const urgent = taskElement.querySelector('.task-urgent-badge') ? 'Yes' : 'No';
  const priority = taskElement.querySelector('.task-priority-badge') ? 'High' : 'Normal';
  const length = taskElement.closest('.task').querySelector('.task-title').dataset.length || '';

  const details = `
    <p><strong>Due Time:</strong> ${time || 'No deadline'}</p>
    <p><strong>Due Date:</strong> ${date || 'No due date'}</p>
    <p><strong>Length:</strong> ${length || 'Not specified'}</p>
    <p><strong>Urgent:</strong> ${urgent}</p>
    <p><strong>Priority:</strong> ${priority}</p>
  `;

  showDetailsPopup(title, details, {
    isTask: true,
    taskData: {
      title,
      time,
      date,
      urgent: urgent === 'Yes',
      priority: priority === 'High',
      length
    }
  });
}

// Attaches click handlers to events for interaction management
function addEventHandlers(container) {
  const events = container.querySelectorAll('.event');
  events.forEach(event => {
    event.addEventListener('click', (e) => {
      // Only show details if not clicking delete button
      if (!e.target.classList.contains('delete-btn')) {
        handleEventClick(e);
      }
    });
  });
}

//Attaches click handlers to all tasks in a container for showing details.
function addTaskHandlers(container) {
  const tasks = container.querySelectorAll('.task');
  tasks.forEach(task => {
    task.addEventListener('click', (e) => {
      // Only show details if not clicking action buttons
      if (!e.target.classList.contains('delete-btn') && !e.target.classList.contains('done-btn')) {
        handleTaskClick(e);
      }
    });
  });
}

// Manages the deletion of events from both the calendar and schedule views
function handleEventDeletion(e) {
  // Only proceed if delete button was clicked
  if (!e.target.classList.contains('delete-btn')) return;
  
  const eventElement = e.target.closest(".event") || e.target.closest(".schedule-event");
  if (eventElement && confirm("Are you sure you want to delete this event?")) {
    // Extract event title based on view type
    let eventTitle;
    if (eventElement.classList.contains('schedule-event')) {
      eventTitle = eventElement.dataset.title; // Schedule view uses data attribute
    } else {
      eventTitle = eventElement.querySelector(".event-title").textContent.trim(); // List view uses text content
    }
      
    // Check if this is a task-generated event
    const isTaskEvent = eventElement.querySelector(".task-badge") !== null;
      
    // Get target date (schedule view uses active day, list view parses date)
    let targetDay = activeDay;
    let targetMonth = month + 1;
    let targetYear = year;

    // Only try to parse date from element if it's not a schedule event
    if (!eventElement.classList.contains('schedule-event')) {
      const eventDate = eventElement.querySelector(".event-date");
      if (eventDate) {
        const dateParts = eventDate.innerHTML.split(" ");
        targetDay = parseInt(dateParts[0]);
        targetMonth = months.indexOf(dateParts[1]) + 1;
        targetYear = parseInt(dateParts[2]);
      }
    }

    // Find and remove the event
    eventsArr.forEach((event, eventIndex) => {
      if (
        event.day === targetDay &&
        event.month === targetMonth &&
        event.year === targetYear
      ) {
        event.events = event.events.filter(item => item.title !== eventTitle);
        
        if (event.events.length === 0) {
          eventsArr.splice(eventIndex, 1);
          // Only update calendar day marker if we're deleting today's event
          if (targetDay === activeDay && targetMonth === month + 1 && targetYear === year) {
            const activeDayEv = document.querySelector(".day.active");
            if (activeDayEv && activeDayEv.classList.contains("event")) {
              activeDayEv.classList.remove("event");
            }
          }
        }
      }
    });

    // If this was a task event, also delete the corresponding task
    if (isTaskEvent) {
      // Use a traditional for loop to safely handle array modification during iteration
      for (let i = tasksArr.length - 1; i >= 0; i--) {
        const taskObj = tasksArr[i];
        taskObj.tasks = taskObj.tasks.filter(task => task.title !== eventTitle);
        if (taskObj.tasks.length === 0) {
          tasksArr.splice(i, 1);
        }
      }
      saveTasks();
      // Refresh task list if in task view
      if (isTaskListView) {
        displayAllTasks();
      }
    }

    // Update the current view without switching
    if (isEventListView) {
      displayAllEvents();
    } else if (isTodayListView) {
      updateEvents(activeDay);
    }
    saveEvents();
    
    // Reschedule tasks since a slot opened up
    scheduleTasks();
    
    // Refresh calendar to update event indicators
    initCalendar();
  }
}

// Function to save task changes
function saveTaskChanges(taskTitle, newData) {
  // Find and update the task in tasksArr
  tasksArr.forEach(taskObj => {
    const taskIndex = taskObj.tasks.findIndex(task => task.title === taskTitle);
    if (taskIndex !== -1) {
      const task = taskObj.tasks[taskIndex];
      
      // Update task properties
      if (newData.date) {
        const [year, month, day] = newData.date.split('-').map(Number);
        task.day = day;
        task.month = month;
        task.year = year;
        taskObj.day = day;
        taskObj.month = month;
        taskObj.year = year;
      }
      
      if (newData.time) {
        task.dTime = convertTime(newData.time);
      }
      
      task.length = newData.length;
      task.urgent = newData.urgent;
      task.highPriority = newData.priority;

      // Also update any corresponding task events
      eventsArr.forEach(eventObj => {
        eventObj.events.forEach(event => {
          if (event.isTask && event.title === taskTitle) {
            event.urgent = newData.urgent;
            event.highPriority = newData.priority;
          }
        });
      });
    }
  });

  // Save changes
  saveTasks();
  saveEvents();

  // Update displays
  if (isTaskListView) {
    displayAllTasks();
  } else if (isEventListView) {
    displayAllEvents();
  } else {
    updateEvents(activeDay);
  }

  // Close popup
  document.getElementById('details-popup').style.display = 'none';

  // Refresh calendar
  initCalendar();
}

// Function to handle task deletion
function handleTaskDeletion(e) {
  const taskElement = e.target.closest(".task");
  if (taskElement && confirm("Are you sure you want to delete this task?")) {
    // Get the clean task title without any badges
    const taskTitleElement = taskElement.querySelector(".task-title");
    // Get only the text content before any span elements(badges)
    const taskTitle = Array.from(taskTitleElement.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join('');
    
    console.log("Deleting task:", taskTitle); // Debug log
    const taskDate = taskElement.querySelector(".task-date");
    
    let targetDay, targetMonth, targetYear;
    
    // Parse the date from the task element if it exists
    if (taskDate) {
      const dateParts = taskDate.innerHTML.split(" ");
      targetDay = parseInt(dateParts[0]);
      targetMonth = months.indexOf(dateParts[1]) + 1;
      targetYear = parseInt(dateParts[2]);
    }

    console.log("Starting task deletion process");
    console.log("Target date:", targetDay, targetMonth, targetYear);
    
    // Find and remove the task
    tasksArr.forEach((taskObj, taskIndex) => {
      console.log("Checking taskObj:", taskObj);
      // Handle tasks with no date
      if (!targetDay && !taskObj.day) {
        console.log("Processing task with no date");
        const originalLength = taskObj.tasks.length;
        taskObj.tasks = taskObj.tasks.filter(task => task.title !== taskTitle);
        console.log(`Filtered tasks: ${originalLength} -> ${taskObj.tasks.length}`);
        if (taskObj.tasks.length === 0) {
          console.log("Removing empty taskObj at index:", taskIndex);
          tasksArr.splice(taskIndex, 1);
        }
      }
      // Handle tasks with dates
      else if (
        taskObj.day === targetDay &&
        taskObj.month === targetMonth &&
        taskObj.year === targetYear
      ) {
        console.log("Found matching date in taskObj");
        const originalLength = taskObj.tasks.length;
        taskObj.tasks = taskObj.tasks.filter(task => task.title !== taskTitle);
        console.log(`Filtered tasks: ${originalLength} -> ${taskObj.tasks.length}`);
        if (taskObj.tasks.length === 0) {
          console.log("Removing empty taskObj at index:", taskIndex);
          tasksArr.splice(taskIndex, 1);
        }
      }
    });

    // Remove any corresponding task events from all dates
    for (let i = eventsArr.length - 1; i >= 0; i--) {
      const eventObj = eventsArr[i];
      const originalLength = eventObj.events.length;
      
      // Filter out events that match this task
      eventObj.events = eventObj.events.filter(event => {
        if (!event.isTask) return true;
        const eventTitle = event.title.trim();
        const match = eventTitle === taskTitle;
        if (match) {
          console.log("Removing event:", eventTitle); // Debug log
        }
        return !match;
      });

      // If we removed events and now the day is empty, remove the day entry
      if (eventObj.events.length === 0 && originalLength > 0) {
        console.log("Removing empty day entry"); // Debug log
        eventsArr.splice(i, 1);
      }
    }

    // Update only the current view
    if (isTaskListView) {
      displayAllTasks();
    } else if (isEventListView) {
      displayAllEvents();
    } else if (isTodayListView) {
      updateEvents(activeDay); // Update schedule view
    }
    
    saveTasks();
    saveEvents();
    
    // Refresh calendar to update task indicators
    initCalendar();
  }
}

// event deletion, done actions and clicks in all containers
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains('delete-btn')) {
    handleEventDeletion(e);
  } else if (e.target.classList.contains('done-btn')) {
    const eventElement = e.target.closest(".event");
    if (eventElement && confirm("Mark this task as done?")) {
      // Get the clean title without any badges
      const taskTitle = Array.from(eventElement.querySelector(".event-title").childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join('');
      markTaskAsDone(eventElement, taskTitle);
    }
  }
});

// tasks container
tasksContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains('delete-btn')) {
    handleTaskDeletion(e);
  } else if (e.target.classList.contains('done-btn')) {
    const taskElement = e.target.closest(".task");
    if (taskElement && confirm("Mark this task as done?")) {
      // Get the clean title without any badges
      const taskTitle = Array.from(taskElement.querySelector(".task-title").childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join('');
      markTaskAsDone(taskElement, taskTitle);
    }
  }
});

document.querySelector('.schedule').addEventListener("click", (e) => {
  if (e.target.classList.contains('delete-btn')) {
    handleEventDeletion(e);
  } else if (e.target.classList.contains('done-btn')) {
    const eventElement = e.target.closest(".schedule-event");
    if (eventElement && confirm("Mark this task as done?")) {
      const taskTitle = eventElement.dataset.title;
      markTaskAsDone(eventElement, taskTitle);
    }
  } else if (e.target.closest('.schedule-event')) {
    const eventElement = e.target.closest('.schedule-event');
    const title = eventElement.dataset.title;
    const time = eventElement.querySelector('.event-time').textContent;
    const date = eventElement.querySelector('.event-date').textContent;
    const isTask = eventElement.querySelector('.task-badge') !== null;
    const isUrgent = eventElement.querySelector('.task-urgent-badge') !== null;
    const isHighPriority = eventElement.querySelector('.task-priority-badge') !== null;
      
    let details = `
      <p><strong>Scheduled Time:</strong> ${time}</p>
      <p><strong>Scheduled Date:</strong> ${date}</p>`;

    if (isTask) {
      // Find the corresponding event object to get due date/time
      const eventObj = eventsArr.find(e => 
        e.events.some(ev => ev.title === title)
      )?.events.find(ev => ev.title === title);
      
      details += `
      <p><strong>Type:</strong> Task</p>
      <p><strong>Due Date:</strong> ${eventObj?.dueDate || 'No due date'}</p>
      <p><strong>Due Time:</strong> ${eventObj?.dueTime || 'No time set'}</p>
      <p><strong>Urgent:</strong> ${isUrgent ? 'Yes' : 'No'}</p>
      <p><strong>Priority:</strong> ${isHighPriority ? 'High' : 'Normal'}</p>`;
    } else {
      details += `<p><strong>Type:</strong> Event</p>`;
    }
      
    showDetailsPopup(title, details);
  }
});

//================ EVENT PERSISTENCE AND MANAGEMENT ================

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  const storedEvents = localStorage.getItem("events");
  if (storedEvents !== null) {
    eventsArr.push(...JSON.parse(storedEvents));
  }
}

function clearAllEvents() {
  while(eventsArr.length > 0) {
    eventsArr.pop();
  }
  updateAfterEventsClear();
}

function clearTaskEvents() {
  eventsArr.forEach((eventObj, index) => {
    eventObj.events = eventObj.events.filter(event => !event.isTask);
    if (eventObj.events.length === 0) {
      eventsArr.splice(index, 1);
    }
  });
  updateAfterEventsClear();
}

function updateAfterEventsClear() {
  saveEvents();
  if (isEventListView) {
    displayAllEvents();
  } else {
    updateEvents(activeDay);
  }
  initCalendar();
}

function clearAllTasks() {
  // Clear the tasks array completely
  while(tasksArr.length > 0) {
    tasksArr.pop();
  }
  saveTasks();
  if (isTaskListView) {
    displayAllTasks();
  } else {
    updateTasks(activeDay);
  }
  initCalendar(); // Refresh calendar to update task indicators
}

//================ TASK MANAGEMENT ================

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function getTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks !== null) {
    tasksArr.push(...JSON.parse(storedTasks));
  }
}

//================ HELPER FUNCTIONS ================
// Determines if a given time falls within the user's designated sleep hours.
function isDuringSleepHours(hour, minute) {
  const sleepStart = document.getElementById('sleep-time-start').value || '22:00';
  const sleepEnd = document.getElementById('sleep-time-end').value || '07:00';
  const [sleepStartHour, sleepStartMin] = sleepStart.split(':').map(Number);
  const [sleepEndHour, sleepEndMin] = sleepEnd.split(':').map(Number);

  // Convert times to minutes for easier comparison
  const timeInMinutes = hour * 60 + minute;
  const sleepStartInMinutes = sleepStartHour * 60 + sleepStartMin;
  const sleepEndInMinutes = sleepEndHour * 60 + sleepEndMin;

  if (sleepStartInMinutes > sleepEndInMinutes) {
    // Sleep period crosses midnight
    return timeInMinutes >= sleepStartInMinutes || timeInMinutes <= sleepEndInMinutes;
  } else {
    // Sleep period within same day
    return timeInMinutes >= sleepStartInMinutes && timeInMinutes <= sleepEndInMinutes;
  }
}

// Converts time between 24-hour and 12-hour formats.
function convertTime(time) {
  if (!time) return '';
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM"; // Determine AM/PM
  timeHour = timeHour % 12 || 12; // Convert to 12-hour format
  time = timeHour + ":" + timeMin + " " + timeFormat; // Format time as HH:MM AM/PM
  return time;
}
