console.log("Notes JavaScript is connected!");

// NOTES DATA

let notes = [];
const savedNotes = localStorage.getItem("notes");

if (savedNotes) {
    notes = JSON.parse(savedNotes);
}

function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );
}

// HTML ELEMENTS

const notesContainer =
    document.getElementById("notes-container");

const notesSearch =
    document.getElementById("notes-search");

const subjectNotesTab =
    document.getElementById("subject-notes-tab");

const personalNotesTab =
    document.getElementById("personal-notes-tab");

const addNoteButton =
    document.getElementById("add-note-button");

const noteModal =
    document.getElementById("note-modal");

const noteModalTitle =
    document.getElementById("note-modal-title");

const closeNoteModal =
    document.getElementById("close-note-modal");

const cancelNoteButton =
    document.getElementById("cancel-note-button");

const noteForm =
    document.getElementById("note-form");

const noteTypeInput =
    document.getElementById("note-type-input");

const noteCourseInput =
    document.getElementById("note-course-input");

const noteCourseGroup =
    document.getElementById("note-course-group");

const noteTitleInput =
    document.getElementById("note-title-input");

const noteContentInput =
    document.getElementById("note-content-input");

const saveNoteButton =
    document.getElementById("save-note-button");

// PAGE STATE

let currentNoteType = "subject";
let editingNoteId = null;

// LOAD COURSES

function loadCourseOptions() {

    if (typeof courses === "undefined") {
        return;
    }

    noteCourseInput.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Select course";

    noteCourseInput.appendChild(
        defaultOption
    );

    courses.forEach(function (course) {

        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.name + " (" + course.code + ")";
        noteCourseInput.appendChild(option);
    });
}

// SHOW / HIDE COURSE FIELD

function updateCourseField() {
    if (noteTypeInput.value === "subject") {
        noteCourseGroup.style.display = "block";
        noteCourseInput.required = true;
    } else {
        noteCourseGroup.style.display = "none";
        noteCourseInput.required = false;
        noteCourseInput.value = "";
    }
}

// OPEN ADD NOTE MODAL

function openAddNoteModal() {

    editingNoteId = null;
    noteModalTitle.textContent = "Add Note";
    saveNoteButton.textContent = "Save Note";
    noteForm.reset();
    noteTypeInput.value = currentNoteType;
    loadCourseOptions();
    updateCourseField();
    noteModal.style.display = "flex";

}

// OPEN EDIT NOTE MODAL

function openEditNoteModal(note) {

    editingNoteId = note.id;
    noteModalTitle.textContent = "Edit Note";
    saveNoteButton.textContent = "Update Note";
    loadCourseOptions();
    noteTypeInput.value = note.type;
    noteCourseInput.value = note.courseId || "";
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    updateCourseField();
    noteModal.style.display = "flex";
}

// CLOSE MODAL

function closeNoteModalWindow() {

    noteModal.style.display = "none";
    noteForm.reset();
    editingNoteId = null;
}

// GET COURSE NAME

function getCourseName(courseId) {
    if (typeof courses === "undefined") {
        return "Unknown Course";
    }

    const course = courses.find(function (item) {
        return String(item.id) === String(courseId);
    });

    return course ? course.name : "Unknown Course";
}

// RENDER NOTES

function renderNotes() {
    notesContainer.innerHTML = "";

    const searchText = notesSearch.value.trim().toLowerCase();
    const filteredNotes = notes.filter(function (note) {
        if (note.type !== currentNoteType) {
            return false;
        }

        const courseName =
            note.type === "subject"
                ? getCourseName(note.courseId).toLowerCase()
                : "";


        return (
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText) ||
            courseName.includes(searchText)
        );

    });


    // No notes message

    if (filteredNotes.length === 0) {

        const emptyMessage = document.createElement("div");

        emptyMessage.classList.add(
            "empty-notes-message"
        );

        const heading = document.createElement("h3");

        heading.textContent = searchText? "No matching notes": "No notes yet";

        const paragraph = document.createElement("p");

        paragraph.textContent = searchText ? "Try a different search term."
                : 'Click "Add Note" to create your first note.';

        emptyMessage.appendChild(heading);
        emptyMessage.appendChild(paragraph);
        notesContainer.appendChild(emptyMessage);

        return;
    }

    // Create note cards

    filteredNotes.forEach(function (note) {
        const noteCard = document.createElement("article");
        noteCard.classList.add("note-card");

        // Header

        const noteHeader = document.createElement("div");
        noteHeader.classList.add("note-card-header");

        const noteTitle = document.createElement("h3");
        noteTitle.textContent = note.title;

        // Buttons

        const noteActions = document.createElement("div");
        noteActions.classList.add("note-actions");

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.classList.add("note-edit-button");

        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
                openEditNoteModal(note);
            }
        );

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.classList.add("note-delete-button" );

        deleteButton.textContent ="Delete";

        deleteButton.addEventListener( "click",function () {
                const shouldDelete =
                    confirm("Are you sure you want to delete this note?");

                if (!shouldDelete) {
                    return;
                }

                notes = notes.filter(function (item) {
                    return item.id !== note.id;
                });

                saveNotes();
                renderNotes();
            }
        );

        noteActions.appendChild( editButton);

        noteActions.appendChild(deleteButton);

        noteHeader.appendChild(noteTitle);

        noteHeader.appendChild(noteActions);

        // Note metadata

        const noteMeta = document.createElement("div");

        noteMeta.classList.add("note-meta");


        if (note.type === "subject") {

            const courseText =
                document.createElement("span");

            courseText.textContent =
                "Course: " +
                getCourseName(note.courseId);

            noteMeta.appendChild(
                courseText
            );

        } else {

            const personalText =
                document.createElement("span");

            personalText.textContent =
                "Personal Note";

            noteMeta.appendChild(
                personalText
            );

        }


        const noteDate =
            document.createElement("span");

        noteDate.textContent =
            new Date(
                note.updatedAt ||
                note.createdAt
            ).toLocaleDateString();


        noteMeta.appendChild(
            noteDate
        );


        // Note content

        const noteContent =
            document.createElement("p");

        noteContent.classList.add(
            "note-content"
        );

        noteContent.textContent =
            note.content;


        // Add everything to card

        noteCard.appendChild(
            noteHeader
        );

        noteCard.appendChild(
            noteMeta
        );

        noteCard.appendChild(
            noteContent
        );


        notesContainer.appendChild(
            noteCard
        );

    });

}


// =========================
// SWITCH NOTE TYPE
// =========================

function switchNoteType(type) {

    currentNoteType = type;


    subjectNotesTab.classList.toggle(
        "active",
        type === "subject"
    );


    personalNotesTab.classList.toggle(
        "active",
        type === "personal"
    );


    renderNotes();

}


// =========================
// ADD / UPDATE NOTE
// =========================

noteForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const type =
            noteTypeInput.value;


        const courseId =
            type === "subject"
                ? noteCourseInput.value
                : null;


        const title =
            noteTitleInput.value.trim();


        const content =
            noteContentInput.value.trim();


        if (!title || !content) {
            return;
        }


        const now =
            new Date().toISOString();


        // UPDATE

        if (editingNoteId !== null) {

            const noteToUpdate =
                notes.find(function (note) {

                    return note.id ===
                        editingNoteId;

                });


            if (noteToUpdate) {

                noteToUpdate.type =
                    type;

                noteToUpdate.courseId =
                    courseId;

                noteToUpdate.title =
                    title;

                noteToUpdate.content =
                    content;

                noteToUpdate.updatedAt =
                    now;

            }

        }


        // ADD

        else {

            const newNote = {

                id: Date.now(),

                type: type,

                courseId: courseId,

                title: title,

                content: content,

                createdAt: now,

                updatedAt: now

            };


            notes.unshift(
                newNote
            );

        }


        saveNotes();

        currentNoteType = type;

        closeNoteModalWindow();

        switchNoteType(type);

    }
);


// =========================
// EVENT LISTENERS
// =========================

addNoteButton.addEventListener(
    "click",
    openAddNoteModal
);


closeNoteModal.addEventListener(
    "click",
    closeNoteModalWindow
);


cancelNoteButton.addEventListener(
    "click",
    closeNoteModalWindow
);


subjectNotesTab.addEventListener(
    "click",
    function () {

        switchNoteType("subject");

    }
);


personalNotesTab.addEventListener(
    "click",
    function () {

        switchNoteType("personal");

    }
);


noteTypeInput.addEventListener(
    "change",
    updateCourseField
);


notesSearch.addEventListener(
    "input",
    renderNotes
);


// Close modal when clicking outside

noteModal.addEventListener(
    "click",
    function (event) {

        if (event.target === noteModal) {

            closeNoteModalWindow();

        }

    }
);


// =========================
// INITIAL SETUP
// =========================

loadCourseOptions();

updateCourseField();

renderNotes();
