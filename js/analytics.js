console.log("Analytics JavaScript is connected!");

/* TASK ANALYTICS */

function calculateTaskAnalytics() {
    const tasks = JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed === true;
    }).length;

    const incompleteTasks = totalTasks - completedTasks;

    let completionPercentage = 0;

    if (totalTasks > 0) {
        completionPercentage = Math.round(
            (completedTasks / totalTasks) * 100
        );
    }

    document.getElementById("total-tasks").textContent = totalTasks;

    document.getElementById("completed-tasks").textContent = completedTasks;

    document.getElementById("pending-tasks").textContent = incompleteTasks;

    document.getElementById("task-completion-percent").textContent = completionPercentage + "%";

    const taskDonut = document.getElementById("task-donut");

    if (taskDonut) {
        const completedAngle = completionPercentage * 3.6;

        taskDonut.style.setProperty("--completed-angle",completedAngle + "deg"
        );
    }
}

/* COURSE OVERVIEW */

function calculateCourseOverview() {

    const courseList = typeof courses !== "undefined"? courses: [];

    document.getElementById("total-courses").textContent = courseList.length;

    const instructors = new Set();

    let currentSemester = 0;

    courseList.forEach(function (course) {

        /* UNIQUE INSTRUCTORS */

        if (course.instructor) {
            instructors.add(course.instructor
            );
        }

        /* CURRENT SEMESTER */

        const semester = Number(course.semester);

        if (!isNaN(semester) && semester > currentSemester) {

            currentSemester = semester;
        }
    });

    document.getElementById("total-instructors").textContent = instructors.size;

    document.getElementById("total-semesters").textContent = currentSemester;}

/* ATTENDANCE ANALYTICS */

function calculateAttendanceAnalytics() {

    const courseList = typeof courses !== "undefined"? courses: [];

    const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") ) || [];

    const container = document.getElementById("course-attendance-container");

    container.innerHTML = "";

    if (courseList.length === 0) {

        container.innerHTML = `
            <p class="analytics-empty-state">
                No courses available yet.
            </p>
        `;
        return;
    }

    courseList.forEach(function (course) {

        /*
           Only Present and Absent records
           are included.No Class is ignored.
        */

        const courseRecords =
            attendanceRecords.filter(
                function (record) {

                    return (
                        record.course === course.name &&
                        (
                            record.status === "Present" ||
                            record.status === "Absent"
                        )
                    );
                }
            );

        const totalLectures =courseRecords.length;

        const presentLectures = courseRecords.filter(function (record) {
                    return record.status === "Present";
                }).length;

        let attendancePercentage = 0;
        if (totalLectures > 0) {
            attendancePercentage =
                Math.round(
                    (
                        presentLectures /
                        totalLectures
                    ) * 100
                );
        }

        const attendanceItem = document.createElement("div");

        attendanceItem.className = "attendance-circle-item";

        /*
           If there is no attendance data, show N/A instead of treating it
           as actual 0% attendance.
        */

        if (totalLectures === 0) {
            attendanceItem.innerHTML = `
                <div
                    class="analytics-donut attendance-donut no-attendance">

                    <div class="donut-center">

                        <span class="donut-percentage">
                            N/A
                        </span>

                        <span class="donut-label">
                            Attendance
                        </span>

                    </div>

                </div>


                <h3 class="attendance-course-name">
                    ${course.name}
                </h3>

                <p class="attendance-class-info">
                    No attendance data
                </p>
            `;
        }
         else {
            const statusClass = attendancePercentage >= 75
                    ? "attendance-good": "attendance-low";

            const attendanceAngle = attendancePercentage * 3.6;

            attendanceItem.innerHTML = `
                <div
                    class="analytics-donut attendance-donut ${statusClass}"
                    style="--attendance-angle: ${attendanceAngle}deg;" >

                    <div class="donut-center">

                        <span class="donut-percentage">
                            ${attendancePercentage}%
                        </span>

                        <span class="donut-label">
                            Attendance
                        </span>

                    </div>

                </div>

                <h3 class="attendance-course-name">
                    ${course.name}
                </h3>

                <p class="attendance-class-info">
                    ${presentLectures}
                    of
                    ${totalLectures}
                    classes present
                </p>
            `;
        }

        container.appendChild(
            attendanceItem
        );
    });
}

/* NOTES ANALYTICS */

function calculateNotesAnalytics() {

    const notes = JSON.parse(localStorage.getItem("notes")
        ) || [];

    const totalNotes = notes.length;

    let subjectNotes = 0;
    let personalNotes = 0;

    notes.forEach(function (note) {

        /*
           Different possible property names
           are supported so the analytics
           remains compatible with the Notes
           module.
        */

        const noteType =note.type ||note.category ||note.noteType ||"";

        const type = String(noteType).toLowerCase().trim();

        if (
            type === "subject" ||
            type === "subject note" ||
            type === "academic"
        ) {
            subjectNotes++;
        }

        else if (
            type === "personal" ||
            type === "personal note"
        ) {
            personalNotes++;
        }
    });

    document.getElementById("total-notes").textContent = totalNotes;

    document.getElementById("notes-total-center").textContent = totalNotes;

    document.getElementById("subject-notes").textContent = subjectNotes;

    document.getElementById("personal-notes").textContent = personalNotes;

    const notesDonut = document.getElementById("notes-donut");

    if (!notesDonut) {
        return;
    }

    if (totalNotes === 0) {
        notesDonut.style.setProperty("--subject-angle","0deg" );

        notesDonut.classList.add("no-notes");

        return;
    }

    notesDonut.classList.remove(
        "no-notes"
    );

    const subjectPercentage =  (subjectNotes /totalNotes) * 100;

    const subjectAngle = subjectPercentage * 3.6;

    notesDonut.style.setProperty("--subject-angle",subjectAngle + "deg");
}

/* LOAD ALL ANALYTICS */

function loadAnalytics() {

    calculateTaskAnalytics();

    calculateCourseOverview();

    calculateAttendanceAnalytics();

    calculateNotesAnalytics();

}

document.addEventListener(
    "DOMContentLoaded",
    loadAnalytics
);