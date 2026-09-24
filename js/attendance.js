console.log("Attendance JavaScript is connected!");

//  HTML ELEMENTS

// Timetable elements

const addTimetableButton =
    document.getElementById("add-timetable-button");

const timetableModal =
    document.getElementById("timetable-modal");

const closeTimetableModal =
    document.getElementById("close-timetable-modal");

const cancelTimetableButton =
    document.getElementById("cancel-timetable-button");

const timetableForm =
    document.getElementById("timetable-form");

const timetableList =
    document.getElementById("timetable-list");

const timetableDay =
    document.getElementById("timetable-day");

const timetableCourse =
    document.getElementById("timetable-course");

const timetableTeacher =
    document.getElementById("timetable-teacher");

const timetableStartTime =
    document.getElementById("timetable-start-time");

const timetableEndTime =
    document.getElementById("timetable-end-time");

const timetableRoom =
    document.getElementById("timetable-room");


// Today's attendance elements

const todayDateElement =
    document.getElementById("today-date");

const todayAttendanceList =
    document.getElementById("today-attendance-list");


// Summary element

const summaryList =
    document.getElementById("attendance-summary-list");


/* LOCAL STORAGE DATA */

// Courses are already managed by courses.js

let timetableRecords =
    JSON.parse(
        localStorage.getItem("timetableRecords")
    ) || [];

let attendanceRecords =
    JSON.parse(
        localStorage.getItem("attendanceRecords")
    ) || [];
let editingTimetableId = null;


/* SAVE DATA FUNCTIONS */

function saveTimetableData() {
    localStorage.setItem(
        "timetableRecords",
        JSON.stringify(timetableRecords)
    );
}

function saveAttendanceData() {
    localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(attendanceRecords)
    );
}


/*  MODAL FUNCTIONS */

function openTimetableModal() {
    timetableModal.classList.remove("hidden");
}

function closeTimetableModalFunction() {
    timetableModal.classList.add("hidden");
    timetableForm.reset();
}


/* COURSE DROPDOWN */

function loadCoursesIntoDropdown() {
    if (!timetableCourse) {
        return;
    }

    timetableCourse.innerHTML = `
        <option value="">
            Select Course
        </option>
    `;

    /*
       courses variable courses.js se aa raha hai.
       Agar courses.js mein courses array hai,
       to uske course names dropdown mein load honge.
    */

    if (typeof courses === "undefined") {
        console.warn("courses variable is not available.");
        return;
    }

    courses.forEach(course => {
        const option =
            document.createElement("option");

        /*
           Course object mein name property honi chahiye.
           Example:
           { name: "DBMS", code: "CS301" }
        */

        option.value = course.name;
        option.textContent = course.name;
        timetableCourse.appendChild(option);
    });
}


/* ADD TIMETABLE ENTRY BUTTON */

addTimetableButton.addEventListener("click", function () {
    editingTimetableId = null;
    timetableForm.reset();
    openTimetableModal();
}
);

/* CLOSE TIMETABLE MODAL*/

closeTimetableModal.addEventListener("click", function () {
    closeTimetableModalFunction();
}
);

cancelTimetableButton.addEventListener("click", function () {
    closeTimetableModalFunction();
}
);

/* SAVE TIMETABLE ENTRY */

timetableForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedDay =
        timetableDay.value;

    const selectedCourse =
        timetableCourse.value;

    const selectedStartTime =
        timetableStartTime.value;

    const selectedEndTime =
        timetableEndTime.value;

    const selectedRoom =
        timetableRoom.value.trim();

    const selectedCourseData =
        courses.find(function (course) {
            return course.name === selectedCourse;
        });

    const selectedTeacher =
        selectedCourseData
            ? selectedCourseData.instructor
            : "";

    if (
        !selectedDay ||
        !selectedCourse ||
        !selectedTeacher ||
        !selectedStartTime ||
        !selectedEndTime ||
        !selectedRoom
    ) {
        alert("Please fill all timetable fields.");
        return;
    }

    if (selectedEndTime <= selectedStartTime) {

        alert("End time must be after start time.");
        return;

    }

    if (editingTimetableId !== null) {

        const timetableEntry =
            timetableRecords.find(
                entry =>
                    entry.id === editingTimetableId
            );

        timetableEntry.day = selectedDay;
        timetableEntry.course = selectedCourse;
        timetableEntry.teacher = selectedTeacher;
        timetableEntry.startTime = selectedStartTime;
        timetableEntry.endTime = selectedEndTime;
        timetableEntry.room = selectedRoom;

    } else {
        const newTimetableEntry = {
            id: Date.now(),
            day: selectedDay,
            course: selectedCourse,
            teacher: selectedTeacher,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
            room: selectedRoom
        };

        timetableRecords.push(
            newTimetableEntry
        );
    }

    saveTimetableData();
    renderTimetable();
    closeTimetableModalFunction();

    editingTimetableId = null;
    alert("Timetable entry added successfully!");
}
);

/* DAY ORDER */

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


/* FORMAT TIME */

function formatTime(time) {
    const [hour, minute] = time.split(":");
    let hourNumber = Number(hour);
    const ampm = hourNumber >= 12 ? "PM" : "AM";
    hourNumber = hourNumber % 12 || 12;
    return `${hourNumber}:${minute} ${ampm}`;
}

/* RENDER TIMETABLE */

function renderTimetable() {
    timetableList.innerHTML = "";

    if (timetableRecords.length === 0) {

        timetableList.innerHTML = `
            <p class="empty-state">
                No timetable entries added yet.
            </p>
        `;
        return;
    }

    daysOfWeek.forEach(day => {
        const dayEntries =
            timetableRecords.filter(
                entry =>
                    entry.day === day
            );

        if (dayEntries.length === 0) {
            return;
        }

        dayEntries.sort(
            (firstEntry, secondEntry) => {
                return firstEntry.startTime.localeCompare(
                    secondEntry.startTime
                );
            }
        );

        const dayCard = document.createElement("div");
        dayCard.className = "timetable-day-card";

        const dayHeading = document.createElement("h3");
        dayHeading.textContent = day;

        dayCard.appendChild(dayHeading);

        dayEntries.forEach(entry => {

            const timetableEntry = document.createElement("div");

            timetableEntry.className = "timetable-entry";

            timetableEntry.innerHTML = `

                <div class="timetable-entry-info">

                    <h4>
                        ${entry.course}
                    </h4>

                    <p>
                        Teacher: ${entry.teacher}
                    </p>

                    <p>
                        Time:
                        ${formatTime(entry.startTime)}
                        -
                        ${formatTime(entry.endTime)}
                    </p>

                    <p>
                        Room: ${entry.room}
                    </p>

                </div>

               <div class="timetable-entry-actions">

    <button
        type="button"
        class="edit-button"
        data-id="${entry.id}">
        Edit

    </button>

    <button
        type="button"
        class="delete-button"
        data-id="${entry.id}">
        Delete

    </button>

</div>
            `;

            const deleteButton =
                timetableEntry.querySelector(
                    ".delete-button"
                );

            deleteButton.addEventListener("click", function () {
                deleteTimetableEntry(
                    entry.id
                );
            }
            );

            const editButton =
                timetableEntry.querySelector(
                    ".edit-button"
                );

            editButton.addEventListener("click", function () {
                editingTimetableId = entry.id;

                timetableDay.value = entry.day;
                timetableCourse.value = entry.course;
                timetableStartTime.value = entry.startTime;
                timetableEndTime.value = entry.endTime;
                timetableRoom.value = entry.room;

                openTimetableModal();
            }
            );

            dayCard.appendChild(
                timetableEntry
            );
        });

        timetableList.appendChild(
            dayCard
        );
    });
}

/* DELETE TIMETABLE ENTRY */

function deleteTimetableEntry(entryId) {
    const confirmed = confirm(
        "Are you sure you want to delete this timetable entry?"
    );

    if (!confirmed) {
        return;
    }

    timetableRecords =
        timetableRecords.filter(
            entry =>
                entry.id !== entryId
        );

    saveTimetableData();
    renderTimetable();
}

/* GET TODAY'S DAY */

function getTodayDayName() {
    const today = new Date();

    const dayIndex = today.getDay();

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return dayNames[dayIndex];
}

/* GET TODAY'S DATE */

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* DISPLAY TODAY'S DATE */

function renderTodayDate() {
    const today = new Date();


    todayDateElement.textContent =
        today.toLocaleDateString("en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}

/* RENDER TODAY'S ATTENDANCE */

function renderTodayAttendance() {
    todayAttendanceList.innerHTML = "";
    const todayDay = getTodayDayName();

    const todayDate = getTodayDate();

    const todayEntries = timetableRecords.filter(entry =>
        entry.day === todayDay
    );

    if (todayEntries.length === 0) {
        todayAttendanceList.innerHTML = `
            <p class="empty-state">
                No classes scheduled for today.
            </p>
        `;
        return;
    }

    todayEntries.sort(
        (firstEntry, secondEntry) => {
            return firstEntry.startTime.localeCompare(
                secondEntry.startTime
            );
        }
    );

    todayEntries.forEach(entry => {
        const recordId = `${todayDate}-${entry.id}`;

        const existingRecord = attendanceRecords.find(record =>
            record.recordId === recordId
        );

        const attendanceCard = document.createElement("div");

        attendanceCard.className =
            "today-attendance-card";

        attendanceCard.innerHTML = `
            <div class="today-attendance-info">
                <h3>
                    ${entry.course}
                </h3>
                <p>
                    ${formatTime(entry.startTime)}
                    -
                    ${formatTime(entry.endTime)}
                </p>

                <p>
                    Teacher: ${entry.teacher}
                </p>

                <p>
                    Room: ${entry.room}
                </p>

            </div>

            <div class="attendance-status-buttons">

                <button
                    type="button"
                    class="attendance-status-button present-button
                    ${existingRecord && existingRecord.status === "Present" ? "selected" : ""
            }"
                    data-status="Present">
                    Present
                </button>

                <button
                    type="button"
                    class="attendance-status-button absent-button
                    ${existingRecord && existingRecord.status === "Absent" ? "selected" : ""
            }"
                    data-status="Absent">
                    Absent
                </button>

            </div>
        `;

        const statusButtons = attendanceCard.querySelectorAll(
            ".attendance-status-button"
        );

        statusButtons.forEach(button => {

            button.addEventListener("click",
                function () {
                    const selectedStatus = button.dataset.status;

                    markAttendance(
                        recordId,
                        todayDate,
                        entry.course,
                        selectedStatus
                    );
                }
            );
        });

        todayAttendanceList.appendChild(
            attendanceCard
        );
    });
}

/* MARK ATTENDANCE */

function markAttendance(
    recordId,
    date,
    course,
    status
) {
    const existingRecordIndex =
        attendanceRecords.findIndex(record =>
            record.recordId === recordId
        );

    const newRecord = {
        recordId: recordId,
        date: date,
        course: course,
        status: status
    };

    if (existingRecordIndex !== -1) {
        attendanceRecords[existingRecordIndex] = newRecord;
    } else {
        attendanceRecords.push(
            newRecord
        );
    }

    saveAttendanceData();
    renderTodayAttendance();
    renderAttendanceSummary();
}

/* RENDER ATTENDANCE SUMMARY */

function renderAttendanceSummary() {summaryList.innerHTML = "";
    const courseSummary = {};

    attendanceRecords.forEach(record => {
        if (
            !courseSummary[record.course]
        ) {
            courseSummary[record.course] = {
                total: 0,
                present: 0,
                absent: 0
            };
        }

        courseSummary[record.course].total++;

        if (
            record.status === "Present"
        ) {
            courseSummary[ record.course ].present++;
        }

        if (
            record.status === "Absent"
        ) {

            courseSummary[ record.course ].absent++;
        }
    });

    const courseNames = Object.keys(courseSummary);

    if (courseNames.length === 0) {
        summaryList.innerHTML = `
            <p class="empty-state">
                No attendance data available yet.
            </p>
        `;
        return;
    }

    courseNames.forEach(course => {

        const data = courseSummary[course];

        const percentage =data.total === 0 ? 0: (
                    data.present /data.total) * 100;

        const summaryCard = document.createElement("div");

        summaryCard.className = "attendance-summary-card";

        summaryCard.innerHTML = `
            <h3>
                ${course}
            </h3>

            <p>
                Total Classes:
                <strong>${data.total}</strong>
            </p>

            <p>
                Present:
                <strong>${data.present}</strong>
            </p>

            <p>
                Absent:
                <strong>${data.absent}</strong>
            </p>

            <p class="attendance-percentage">
                Attendance:
                ${percentage.toFixed(1)}%
            </p>

        `;

        summaryList.appendChild(
            summaryCard
        );
    });
}

/* INITIAL PAGE LOAD */

loadCoursesIntoDropdown();
renderTimetable();
renderTodayDate();
renderTodayAttendance();
renderAttendanceSummary();