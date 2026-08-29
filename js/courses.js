let  courses = [{
    id: 1,
    name: "Database Management System",
    code: "CS301",
    instructor: "Dr.sharma",
    credits: 4,
    semester: 1
},
{
    id: 2,
    name: "Data structures and Algorithms",
    code: "CS302",
    instructor: "Dr.verma",
    credits: 4,
    semester: 1
},

];
function renderCourses() {

    const courseList = document.querySelector(".course-list");

    courseList.innerHTML = "";

    courses.forEach(function (course) {
        const courseCard = document.createElement("div");
        courseCard.classList.add("course-card")

        const courseName = document.createElement("h3");
        courseName.textContent = course.name;

        const courseCode = document.createElement("p");
        courseCode.textContent = "Code: " + course.code;

        const instructor = document.createElement("p");
        instructor.textContent = "Instructor:" + course.instructor;

        const credits = document.createElement("p");
        credits.textContent = "Credits: " + course.credits;

        const semester = document.createElement("p");
        semester.textContent = "semester: " + course.semester;

        courseCard.appendChild(courseName);
        courseCard.appendChild(courseCode);
        courseCard.appendChild(instructor);
        courseCard.appendChild(credits);
        courseCard.appendChild(semester);

        //create Edit button
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        courseCard.appendChild(editButton);

        // Create Delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        // Add Delete button to course card
        courseCard.appendChild(deleteButton);


        // Delete course when Delete button is clicked
        deleteButton.addEventListener("click", function () {

            // Remove the selected course from the array
            courses = courses.filter(function (item) {
                return item.id !== course.id;
            });

            // Display the updated courses
            renderCourses();

        });

        editButton.addEventListener("click", function () {

            // Find the selected course using its ID
            const selectedCourse = courses.find(function (item) {
                return item.id === course.id;
            });

            console.log("Selected course:", selectedCourse);

            // Remember which course we are editing

            editingCourseId = selectedCourse.id;

            // Change modal text
            courseModalTitle.textContent = "Edit Course";
            courseSubmitButton.textContent = "Update Course";

            // Put existing course information into the form

            courseNameInput.value = selectedCourse.name;
            courseCodeInput.value = selectedCourse.code;
            courseInstructorInput.value = selectedCourse.instructor;
            courseCreditsInput.value = selectedCourse.credits;
            courseSemesterInput.value = selectedCourse.semester;

            // Open the course modal

            courseModal.style.display = "flex";

        });
        courseCard.appendChild(editButton);

        courseList.appendChild(courseCard);
    });
}
renderCourses();

// Select Course modal elements

const addCourseButton = document.querySelector("#add-course-button");
const courseModal = document.querySelector("#course-modal");
const closeCourseModalButton = document.querySelector("#close-course-modal-button");
const cancelCourseButton = document.querySelector("#cancel-course-button");

// Open Course Modal

addCourseButton.addEventListener("click", function () {
    courseModal.style.display = "flex";
});

// Close Course Modal using X button

closeCourseModalButton.addEventListener("click", function () {
    courseModal.style.display = "none";
});

// Close Course Modal using Cancel button

cancelCourseButton.addEventListener("click", function () {
    courseModal.style.display = "none";
});
// Select Course form elements

const courseForm = document.querySelector("#course-form");
const courseNameInput = document.querySelector("#course-name-input");
const courseCodeInput = document.querySelector("#course-code-input");
const courseInstructorInput = document.querySelector("#course-instructor-input");
const courseCreditsInput = document.querySelector("#course-credits-input");
const courseSemesterInput = document.querySelector("#course-semester-input");

// Course modal title and submit button

const courseModalTitle = document.querySelector("#course-modal .modal-header h2");
const courseSubmitButton = document.querySelector("#course-form button[type='submit']");

// Store the ID of the course currently being edited

let editingCourseId = null;

// Handle Course form submission

courseForm.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();

    // Get values entered by the user
    const courseName = courseNameInput.value.trim();
    const courseCode = courseCodeInput.value.trim();
    const instructor = courseInstructorInput.value.trim();
    const credits = Number(courseCreditsInput.value);
    const semester = Number(courseSemesterInput.value);


    // Check whether we are editing or adding
    if (editingCourseId !== null) {

        // Find the course that we are editing
        const courseToEdit = courses.find(function (course) {
            return course.id === editingCourseId;
        });

        // Update the existing course
        courseToEdit.name = courseName;
        courseToEdit.code = courseCode;
        courseToEdit.instructor = instructor;
        courseToEdit.credits = credits;
        courseToEdit.semester = semester;

        console.log("Course updated:", courseToEdit);

    } else {

        // Create a new course object
        const newCourse = {
            id: Date.now(),
            name: courseName,
            code: courseCode,
            instructor: instructor,
            credits: credits,
            semester: semester
        };

        // Add new course to courses array
        courses.push(newCourse);

        console.log("New course added:", newCourse);
    }

    // Display updated courses
    renderCourses();

    // Clear the form
    courseForm.reset();

    // Close the modal
    courseModal.style.display = "none";

    // Reset editing mode
    editingCourseId = null;

    // console.log("New course added:", newCourse);
});