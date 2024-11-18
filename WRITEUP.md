# AutoPlan Calendar

## Write-Up

The pitch for the project was:
The idea of this project revolves around a calendar that automatically schedules tasks given to it using certain parameters. The calendar would still be able to be used as a normal calendar, with manual scheduling and adjustments. The interesting part is that all the tasks not manually scheduled are scheduled around the manually scheduled tasks, and are automatically adjusted around the user's manual adjustments. if a task is not marked as done, the program would just find a new spot for it. The program should be able to reschedule everything automatically to satisfy priorities. There should also be options to block out time that the auto scheduler cannot schedule on. The only thing the user would have to worry about is accurately estimating how long a task is going to take. The focus of this auto scheduler and calendar is not to be a planner for the most mundane of tasks, such as teeth brushing and eating. The focus is for non habitual responsibilities. Such as homework assignments, project tasks, meetings, etc.

AutoPlan is a web-based calendar app that combines traditional calendar functionality with task management and automated scheduling capabilities.

The application is built using vanilla JavaScript, HTML, and CSS.

## DEMO

- **LINK**: <https://youtu.be/or3Nj17TzaQ>

## Inspiration

### 1. dig.Shovelapp

- **Shovel**: <https://shovelapp.io/>

### 2. Calendar on Github

- **opensource-coding/Responsive-Calendar-with-Events**: <https://github.com/opensource-coding/Responsive-Calendar-with-Events>

## Core Components

### 1. Calendar Interface

- **Dual View Modes**: Supports both monthly and weekly calendar views
- **Interactive Navigation**: Previous/Next buttons for time period navigation
- **Date Selection**: Click-to-select date functionality
- **Visual Indicators**: Shows events and tasks counts on calendar days
- **Responsive Design**: Adapts to different screen sizes

### 2. Event Management

- **Event Creation**: Add events with title, date, and time range
- **Event Display**: Shows events in both list and timeline views
- **Event Deletion**: Remove individual events
- **Persistence**: Local storage for event data
- **Filtering**: View all events or specific day's events

### 3. Task Management

- **Task Creation**: Add tasks with title, optional deadline (date/time), duration, and priority levels (Urgent/High Priority)
- **Task Status**: Track completion status
- **Task Views**: List and timeline representations
- **Smart Features**: Automatic scheduling and rescheduling

### 4. Automated Scheduling

- **Intelligent Scheduling**: Automatically assigns tasks to available time slots
- **Priority-Based**: Considers urgency and importance
- **Conflict Avoidance**: Respects existing events and sleep hours
- **Adaptive Rescheduling**: Handles overdue tasks automatically
- **Sleep Hours**: Configurable rest periods
  - I only did sleep hours as a proof of concept. This concept can be expanded to include custom blocked hours. (Eating, Personal time)

### 5. User Interface Features

- **Interactive Timeline**: Visual representation of daily schedule
- **Detail Popups**: Information display for each event and task
- **Edit Capabilities**: Modify task properties
  - As a proof of concept. I only implemented edit functionality for tasks
- **Status Indicators**: Visual cues for task properties
- **Action Controls**: Quick access to common functions

## Technical Implementation

### HTML Structure

The application uses a two-column layout:

1. **Left Column**: Calendar view (monthly/weekly)
2. **Right Column**: Event/task details and schedule

Key HTML components:

- Calendar grid with dynamic day generation
- Event/task input forms
- Timeline view with hour markers
- Settings and detail popups

### JavaScript Architecture

#### 1. State Management

- **Data Structures**:
  - Events Array: `eventsArr` for storing all calendar events
  - Tasks Array: `tasksArr` for managing pending tasks
  - Completed Tasks: `doneTasksArr` for finished tasks
  - View State Tracking: Boolean flags for current view mode
- **Persistence Layer**:
  - LocalStorage integration for all data arrays
  - Automatic save on all modifications
  - Data recovery on page load
- **View State Management**:
  - Tracks active day/month/year
  - Manages view mode (weekly/monthly)
  - Handles list/timeline view states

#### 2. Date and Time Utilities

- **Date Processing**:
  - Custom date formatting functions
  - Date comparison utilities
  - Week/month boundary calculations
- **Time Handling**:
  - 12/24 hour format conversion
  - Time slot availability checking
  - Duration calculations

#### 3. Events

- **Event Listeners**:
  - Dynamic elements
  - Touch/click handling
  - Form submission processing
- **Custom Events**:
  - View change notifications
  - Data updates
  - Error/warning signals
- **Action Handlers**:
  - Delete operations
  - Status updates
  - Edit functions

#### 4. Scheduling Algorithm

The scheduling system implements an algorithm:

1. **Task Prioritization**:
   - Urgent tasks get highest priority
   - Deadline-based sorting
   - Priority level consideration (Things are either high priority or normal priority)
   - Duration length-based optimization

2. **Slot Finding**:

   ```javascript
   function findAvailableSlot(task) {
     // Start from current time for today, start of day for future dates
     let startTime = (isToday) ? getCurrentTime() : getDayStart();
     
     while (startTime < endOfDay) {
       if (isSlotAvailable(startTime, task.duration) && 
           !isDuringSleep(startTime) && 
           !hasConflicts(startTime, task.duration)) {
         return startTime;
       }
       startTime += SLOT_INCREMENT;
     }
     return null;
   }
   ```

3. **Conflict Resolution**:
   - Checks for existing events
   - Validates against sleep hours
   - Handles overlapping tasks
   - Maintains minimum gaps

4. **Rescheduling Logic**:
   - Detects overdue tasks
   - Finds next available slots
   - Preserves task priorities
   - Updates affected tasks

#### 5. Display Management

- **Calendar Generation**:
  - Dynamic grid creation
  - Date calculation and display
  - Event/task indicators
  - View mode switching
- **Timeline Visualization**:
  - Hour marker generation
  - Event positioning
  - Overlap handling
  - Interactive elements
- **List Views**:
  - Sorted event/task lists
  - Filtering capabilities
  - Status indicators
  - Action buttons

### CSS Implementation

- **Theme System**:

  ```css
  :root {
    --primary-clr: #4F3276;
    --secondary-clr: #3f4458;
    --text-clr: #878895;
    --bg-clr: #e2e1dc;
    --white: #fff;
  }
  ```

- **Layout Framework**:
  - CSS Grid for calendar
  - Flexbox for components
  - Responsive breakpoints
  - Mobile optimization
- **Component Styling**:
  - Consistent visual language
  - Interactive states
  - Accessibility features
  - Animation system
- **Timeline Design**:
  - Hour markers
  - Event blocks
  - Overlap handling
  - Visual hierarchy

## Advanced Features

### 1. Task Scheduling

- **Algorithm Complexity**: O(n * m) where n = tasks, m = time slots
- **Priority Handling**:

  ```javascript
  tasks.sort((a, b) => {
    if (a.urgent !== b.urgent) return b.urgent ? 1 : -1;
    if (a.deadline !== b.deadline) return a.deadline - b.deadline;
    return b.priority - a.priority;
  });
  ```

- **Conflict Resolution**:
  - Forward-looking conflict detection
  - Backtracking for optimal fit
  - Priority preservation
  - Deadline respect

### 2. Data Management

- **Storage Strategy**:
  - Efficient data structures
  - Quick access patterns
  - Atomic updates
- **State Synchronization**:
  - View consistency
  - Real-time updates
  - Error recovery
  - Data validation

### 3. Error Handling

- **User Input Validation**:
  - Type checking
  - Range validation
  - Format verification
- **Runtime Error**:
  - Error logging

## Future

There are many things I would like to improve here.

### 1. Technical Improvements

- **Performance**:
  - I would like to research optimization
- **Architecture**:
  - I love organization and clean code. I would like to research how to be more organized and whatnot

### 2. Feature Additions

- **Collaboration**:
  - Real-time sync
  - Sharing options
  - Permissions system
  - Conflict resolution
- **Integration**:
  - External calendars
  - API connectivity
  - Export options
- **Functionality**:
  - Clear finished tasks list
  - Edit event attributes
  - Edit task event attributes and reflect them in tasks
  - Integrated warnings
  - Custom time blocking
  - Many tiny improvements, its hard to find a stopping point...

### 3. User Experience

- **Mobile Support**:
  - Touch optimization
  - Offline capability
  - Responsive design
- **Customization**:
  - Themes
  - Layouts
  - Preferences

## Conclusion

AutoPlan Calendar was a really fun project. I think I will continue to work on this for personal use. I use a similar tool for time management, but it does not do any automatic scheduling. It only does task management. The whole point of this project was to make myself a replica of that tool with something helpful to me. But I realized it didn't have to be exact so I wrote this simpler calendar.
