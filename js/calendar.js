console.log("Calendar JavaScript is connected!");

let currentDate = new Date();
let selectedDate = null;
let editingEventId = null;

let calendarEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];

const calendarGrid = document.getElementById("calendar-grid");
const calendarMonthYear = document.getElementById("calendar-month-year");
const previousMonthButton = document.getElementById("previous-month");
const nextMonthButton = document.getElementById("next-month");
const todayButton = document.getElementById("today-button");
const upcomingEventsList = document.getElementById("upcoming-events-list");

const eventModal = document.getElementById("event-modal");
const eventForm = document.getElementById("event-form");
const eventModalTitle = document.getElementById("event-modal-title");
const eventTitle = document.getElementById("event-title");
const eventDescription = document.getElementById("event-description");
const eventDate = document.getElementById("event-date");
const eventReminder = document.getElementById("event-reminder");
const closeEventModal = document.getElementById("close-event-modal");
const cancelEventButton = document.getElementById("cancel-event-button");

const dateEventsModal = document.getElementById("date-events-modal");
const selectedDateTitle = document.getElementById("selected-date-title");
const selectedDateEvents = document.getElementById("selected-date-events");
const closeDateEventsModal = document.getElementById("close-date-events-modal");
const addEventForDateButton = document.getElementById("add-event-for-date");


/* ========================================= */
/* SAVE EVENTS */
/* ========================================= */

function saveEvents() {
    localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
}


/* ========================================= */
/* DATE FUNCTIONS */
/* ========================================= */

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


/* ========================================= */
/* RENDER CALENDAR */
/* ========================================= */

function renderCalendar() {
    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarMonthYear.textContent = currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-date empty";
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = formatDate(date);

        const dateCell = document.createElement("div");
        dateCell.className = "calendar-date";

        if (dateString === formatDate(new Date())) {
            dateCell.classList.add("today-date-cell");
        }

        if (dateString === selectedDate) {
            dateCell.classList.add("selected-date-cell");
        }

        const dateEvents = calendarEvents.filter(event => event.date === dateString);

        dateCell.innerHTML = `
            <span class="calendar-day-number">${day}</span>
            ${dateEvents.length > 0 ? '<span class="calendar-event-dot"></span>' : ""}
        `;

        dateCell.addEventListener("click", () => openDateEvents(dateString));

        calendarGrid.appendChild(dateCell);
    }
}


/* ========================================= */
/* SELECTED DATE EVENTS */
/* ========================================= */

function openDateEvents(dateString) {
    selectedDate = dateString;

    selectedDateTitle.textContent = formatDisplayDate(dateString);
    selectedDateEvents.innerHTML = "";

    const dateEvents = calendarEvents.filter(event => event.date === dateString);

    if (dateEvents.length === 0) {
        selectedDateEvents.innerHTML = `
            <p class="calendar-empty-message">No events for this date.</p>
        `;
    } else {
        dateEvents.forEach(event => {
            const eventItem = document.createElement("div");
            eventItem.className = "selected-event-item";

            eventItem.innerHTML = `
                <div class="selected-event-info">
                    <h3>${event.title}</h3>
                    ${event.description ? `<p>${event.description}</p>` : ""}
                    <span>Reminder: ${getReminderText(event.reminder)}</span>
                </div>

                <div class="selected-event-actions">
                    <button type="button" class="edit-calendar-event" data-id="${event.id}">
                        Edit
                    </button>

                    <button type="button" class="delete-calendar-event" data-id="${event.id}">
                        Delete
                    </button>
                </div>
            `;

            selectedDateEvents.appendChild(eventItem);
        });

        attachEventActionButtons();
    }

    dateEventsModal.classList.add("show");
}


/* ========================================= */
/* REMINDER TEXT */
/* ========================================= */

function getReminderText(reminder) {
    const days = Number(reminder);

    if (days === 0) return "On the event day";
    if (days === 1) return "1 day before";
    if (days === 2) return "2 days before";
    if (days === 7) return "1 week before";

    return `${days} days before`;
}


/* ========================================= */
/* ADD EVENT */
/* ========================================= */

function openAddEventModal(dateString) {
    editingEventId = null;

    eventModalTitle.textContent = "Add Event";
    eventForm.reset();
    eventDate.value = dateString;
    eventReminder.value = "1";

    eventModal.classList.add("show");
}


/* ========================================= */
/* EDIT EVENT */
/* ========================================= */

function openEditEvent(eventId) {
    const event = calendarEvents.find(item => item.id === eventId);

    if (!event) return;

    editingEventId = eventId;

    eventModalTitle.textContent = "Edit Event";
    eventTitle.value = event.title;
    eventDescription.value = event.description || "";
    eventDate.value = event.date;
    eventReminder.value = event.reminder;

    dateEventsModal.classList.remove("show");
    eventModal.classList.add("show");
}


/* ========================================= */
/* DELETE EVENT */
/* ========================================= */

function deleteEvent(eventId) {
    const confirmDelete = confirm("Are you sure you want to delete this event?");

    if (!confirmDelete) return;

    calendarEvents = calendarEvents.filter(event => event.id !== eventId);

    saveEvents();
    renderCalendar();
    renderUpcomingEvents();

    if (selectedDate) {
        openDateEvents(selectedDate);
    }
}


/* ========================================= */
/* EDIT / DELETE BUTTONS */
/* ========================================= */

function attachEventActionButtons() {
    document.querySelectorAll(".edit-calendar-event").forEach(button => {
        button.addEventListener("click", () => {
            openEditEvent(Number(button.dataset.id));
        });
    });

    document.querySelectorAll(".delete-calendar-event").forEach(button => {
        button.addEventListener("click", () => {
            deleteEvent(Number(button.dataset.id));
        });
    });
}


/* ========================================= */
/* SAVE EVENT FORM */
/* ========================================= */

eventForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = eventTitle.value.trim();
    const description = eventDescription.value.trim();
    const date = eventDate.value;
    const reminder = Number(eventReminder.value);

    if (!title || !date) return;

    if (editingEventId !== null) {
        const existingEvent = calendarEvents.find(item => item.id === editingEventId);

        if (existingEvent) {
            existingEvent.title = title;
            existingEvent.description = description;
            existingEvent.date = date;
            existingEvent.reminder = reminder;
        }
    } else {
        calendarEvents.push({
            id: Date.now(),
            title,
            description,
            date,
            reminder
        });
    }

    saveEvents();

    eventModal.classList.remove("show");
    editingEventId = null;

    renderCalendar();
    renderUpcomingEvents();

    if (selectedDate) {
        openDateEvents(selectedDate);
    }
});


/* ========================================= */
/* UPCOMING EVENTS */
/* ========================================= */

function renderUpcomingEvents() {
    upcomingEventsList.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = calendarEvents
        .filter(event => {
            const eventDate = new Date(`${event.date}T00:00:00`);
            return eventDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    if (upcomingEvents.length === 0) {
        upcomingEventsList.innerHTML = `
            <p class="calendar-empty-message">No upcoming events.</p>
        `;
        return;
    }

    upcomingEvents.forEach(event => {
        const eventDate = new Date(`${event.date}T00:00:00`);

        const difference = Math.round(
            (eventDate - today) / (1000 * 60 * 60 * 24)
        );

        let relativeText = "";

        if (difference === 0) {
            relativeText = "Today";
        } else if (difference === 1) {
            relativeText = "Tomorrow";
        } else {
            relativeText = `In ${difference} days`;
        }

        const eventItem = document.createElement("div");
        eventItem.className = "upcoming-event-item";

        eventItem.innerHTML = `
            <div class="upcoming-event-date">
                <strong>${eventDate.toLocaleDateString("en-US", { day: "numeric" })}</strong>
                <span>${eventDate.toLocaleDateString("en-US", { month: "short" })}</span>
            </div>

            <div class="upcoming-event-info">
                <h3>${event.title}</h3>
                <p>${relativeText}</p>
            </div>
        `;

        upcomingEventsList.appendChild(eventItem);
    });
}


/* ========================================= */
/* REMINDER CHECK */
/* ========================================= */

function checkReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminderEvents = calendarEvents.filter(event => {
        const eventDate = new Date(`${event.date}T00:00:00`);
        eventDate.setHours(0, 0, 0, 0);

        const reminderDate = new Date(eventDate);
        reminderDate.setDate(
            reminderDate.getDate() - Number(event.reminder)
        );

        return reminderDate.getTime() === today.getTime();
    });

    reminderEvents.forEach(event => {
        const eventDate = new Date(`${event.date}T00:00:00`);

        const daysLeft = Math.round(
            (eventDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft === 0) {
            alert(`🔔 Today: ${event.title}`);
        } else if (daysLeft === 1) {
            alert(`🔔 Reminder: ${event.title} is tomorrow.`);
        } else {
            alert(`🔔 Reminder: ${event.title} is in ${daysLeft} days.`);
        }
    });
}


/* ========================================= */
/* MONTH NAVIGATION */
/* ========================================= */

previousMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

todayButton.addEventListener("click", () => {
    currentDate = new Date();
    selectedDate = formatDate(new Date());

    renderCalendar();
});


/* ========================================= */
/* MODAL BUTTONS */
/* ========================================= */

closeEventModal.addEventListener("click", () => {
    eventModal.classList.remove("show");
});

cancelEventButton.addEventListener("click", () => {
    eventModal.classList.remove("show");
});

closeDateEventsModal.addEventListener("click", () => {
    dateEventsModal.classList.remove("show");
});

addEventForDateButton.addEventListener("click", () => {
    dateEventsModal.classList.remove("show");
    openAddEventModal(selectedDate);
});


/* ========================================= */
/* INITIAL LOAD */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
    renderUpcomingEvents();
    checkReminders();
});