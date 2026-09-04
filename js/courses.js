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
}];
   // get saved courses from Local Storage

   const savedCourses = localStorage.getItem("courses");

   if(savedCourses){
    courses = JSON.parse(savedCourses);
   }

   //save courses to local storage

   function saveCourses(){
    localStorage.setItem("courses",JSON.stringify(courses));
   }

   //select course count 

   const courseCount = document.querySelector(".course-count");

   //render courses
function renderCourses() {

    const courseList = document.querySelector(".course-list");

    courseList.innerHTML = "";

    //update course count

    if (courseCount) {
        courseCount.textContent = courses.length;
    }

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

        editButton.addEventListener("click",function(){

            // find selected course

            const selectedCourse = courses.find(function(item){
                return item.id === course.id;
            });

            console.log("selected course:",selectedCourse);

            //remember which course is being edited

            editingCourseId = selectedCourse.id;

            //change modal text

            courseModalTitle.textContent = "Edit Course";

            courseSubmitButton.textContent = "update Course";

            // put existing course information into form

            courseNameInput.value = selectedCourse.name;
            courseCodeInput.value = selectedCourse.code;
            courseInstructorInput.value = selectedCourse.instructor;
            courseCreditsInput.value = selectedCourse.credits;
            courseSemesterInput.value = selectedCourse.semester;

            //open course modal

            courseModal.style.display = "flex";

        });

        courseCard.appendChild(editButton);
    

        // Create Delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        // Delete course when Delete button is clicked
        deleteButton.addEventListener("click", function () {

            // Remove the selected course from the array
            courses = courses.filter(function (item) {
                return item.id !== course.id;
            });

            //save updated courses

            saveCourses();

            // Display the updated courses
            renderCourses();

        });

        courseCard.appendChild(deleteButton);

        courseList.appendChild(courseCard);

    });
}

// Select Course modal elements

const addCourseButton = document.querySelector("#add-course-button");
const courseModal = document.querySelector("#course-modal");
const closeCourseModalButton = document.querySelector("#close-course-modal-button");
const cancelCourseButton = document.querySelector("#cancel-course-button");

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

// Open Course Modal for ADD

addCourseButton.addEventListener("click", function () {

    // Reset editing mode

    editingCourseId = null;

    // Change modal back to Add mode

    courseModalTitle.textContent = "Add New Course";
    courseSubmitButton.textContent = "Add Course";

    // Clear previous values

    courseForm.reset();

    // Open modal

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

        //save updated course

        saveCourses();

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

        //save courses
        saveCourses();

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

    // reset modal text
    courseModalTitle.textContent="Add new course";
    courseSubmitButton.textContent="add course";
});

//initial render

renderCourses();