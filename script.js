console.log("StudentHub JavaScript is connected!");

const addTaskButton = document.querySelector("#add-task-button");
const taskList = document.querySelector(".task-list");
const taskCount = document.querySelector(".task-count");

// select elements from the add task modal

const taskModal = document.querySelector("#task-modal");
const taskForm = document.querySelector("#task-form");
const taskNameInput = document.querySelector("#task-name-input");
const taskPriorityInput = document.querySelector("#task-priority-input");
const taskDateInput = document.querySelector("#task-date-input");
const closeModalButton = document.querySelector("#close-modal-button");
const cancelTaskButton = document.querySelector("#cancel-task-button")


// // select the due the date input from html 
//  const taskDateInput = document.querySelector("#task-date-input")

// FUNCTION: Add Delete button to a task
function addDeleteButton(taskItem) {

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    taskItem.appendChild(deleteButton);

    deleteButton.addEventListener("click", function () {

        taskItem.remove();

        taskCount.textContent = taskList.children.length;

    });
}
//Function:add edit button to a task 

function addEditButton(taskItem){

    //create the edit button
    const editButton = document.createElement("button");

    //set the text displayed on the button
    editButton.textContent ="Edit";

    //Add the Edit button to the task
    taskItem.appendChild(editButton);

    //run this code when the edit button is clicked 
    editButton.addEventListener("click",function(){
        
        //find the task title inside this task
        const taskTitle = taskItem.querySelector(".task-info h3 ");

        //ask the user for the new task name

        const newTaskName = prompt(
            "Edit your task:",
            taskTitle.textContent
        );
        // stop if the user cancels or enters nothing
        if(newTaskName === null || newTaskName.trim() === ""){
            return ;
        }

        //update the task title 

        taskTitle.textContent = newTaskName;
    });
}


// Add Delete  and Edit button to existing tasks
const existingTasks = document.querySelectorAll(".task-item");

existingTasks.forEach(function (taskItem) {

    addDeleteButton(taskItem);

    //Add Edit functionality to this existing task

    addEditButton(taskItem);

});

// Checkbox functionality for existing tasks
existingTasks.forEach(function (taskItem) {

    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    const taskDue = taskItem.querySelector(".task-info p");

    checkbox.addEventListener("change", function () {

        if (checkbox.checked) {
            taskItem.classList.add("completed");
            taskDue.textContent = "Completed";

        } else {
            taskItem.classList.remove("completed");
            taskDue.textContent = "Due Today";
        }
    });
});

console.log(addTaskButton);
console.log(taskList);
console.log(taskCount);

// OPEN ADD TASK MODAL
addTaskButton.addEventListener("click",function(){
    //show the modal
    taskModal.style.display ="flex";
});

// CLOSE MODAL USING X BUTTON
closeModalButton.addEventListener("click",function(){
    //hide the modal
    taskModal.style.display = "none";
});


//CLOSE MODAL USING CANCEL BUTTON
cancelTaskButton.addEventListener("click",function(){
    //Hide modal
    taskModal.style.display="none";
});

// HANDLE ADD TASK FORM SUBMISSION
taskForm.addEventListener("submit", function (event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get values entered by the user
    const taskName = taskNameInput.value.trim();
    const priority = taskPriorityInput.value;
    const dueDate = taskDateInput.value;

    console.log("Task Name:", taskName);
    console.log("Priority:", priority);
    console.log("Due Date:", dueDate);

    // Create new task
    const newTask = document.createElement("div");
    newTask.classList.add("task-item");

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Create task information container
    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");

    // Create task title
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = taskName;

    // Create task due date
    const taskDue = document.createElement("p");
    taskDue.textContent = "Due: " + dueDate;

    // Create task priority
    const taskPriority = document.createElement("p");
    taskPriority.textContent = "Priority: " + priority;

    // Add task details inside taskInfo
    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskDue);
    taskInfo.appendChild(taskPriority);

    // Add checkbox and task information to newTask
    newTask.appendChild(checkbox);
    newTask.appendChild(taskInfo);

    // Add new task to task list
    taskList.appendChild(newTask);

    // Add Delete functionality
    addDeleteButton(newTask);

    // Add Edit functionality
    addEditButton(newTask);

    // Checkbox functionality
    checkbox.addEventListener("change", function () {

        if (checkbox.checked) {

            newTask.classList.add("completed");
            taskDue.textContent = "Completed";

        } else {
            newTask.classList.remove("completed");
            taskDue.textContent = "Due: " + dueDate;

        }
    });

    // Update task count
    taskCount.textContent = taskList.children.length;

    // Clear the form
    taskForm.reset();

    // Close the modal
    taskModal.style.display = "none";
    console.log("New task added:", newTask);
});
// task filtering

//select all filters buttons
const filterButtons = document.querySelectorAll(".filter-btn");

//Add click event to each filter button
filterButtons.forEach(function(button){

    button.addEventListener("click", function(){

        //get the selected filter
        const selectedFilter = button.dataset.filter;

        //get all tasks
        const allTasks = document.querySelectorAll(".task-item");

        //check every task 
        allTasks.forEach(function(task){

            if (selectedFilter === "all"){

                task.style.display = "flex";
            } else if (selectedFilter === "completed"){

                if (task.classList.contains("completed")){
                    task.style.display ="flex";
                } else{
                    task.style.display = "none";
                }
            } else if (selectedFilter === "pending"){

                if(task.classList.contains("completed")){
                    task.style.display ="none";
                } else{
                    task.style.display ="flex";
                }
            }
        });

        // Remove active class from all buttons
        filterButtons.forEach(function(filterButton){
            filterButton.classList.remove("active");
        });

        //Make clicked button active 
        button.classList.add("active");

    });
});

// TASK SEARCH 

// select the search input
const searchInput = document.querySelector("#task-search-input");

//Run this code whenever the user types something
searchInput.addEventListener("input",function(){

    //Get what the user typed
    const searchText = searchInput.value.toLowerCase();

    //Get all tasks
    const allTasks = document.querySelectorAll(".task-item");

    //Check every task
    allTasks.forEach(function(task){
        //Get the task title
        const taskTitle = task.querySelector(".task-info h3").textContent.toLowerCase();

        // Check whether the task title contains the search text
        if(taskTitle.includes(searchText)){

            task.style.display = "flex";
        } else{
            task.style.display = "none";
        }
    });
});
