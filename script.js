console.log("StudentHub JavaScript is connected!");

const addTaskButton = document.querySelector("button");
const taskList = document.querySelector(".task-list");
const taskCount = document.querySelector(".task-count");


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


// Add Delete button to existing tasks
const existingTasks = document.querySelectorAll(".task-item");

existingTasks.forEach(function (taskItem) {

    addDeleteButton(taskItem);

});


console.log(addTaskButton);
console.log(taskList);
console.log(taskCount);


// ADD TASK
addTaskButton.addEventListener("click", function () {

    console.log("Add task button was clicked!");

    const taskName = prompt("Enter your task:");

    console.log("Task entered:", taskName);


    if (taskName === null || taskName.trim() === "") {
        return;
    }

    // Create new task
    const newTask = document.createElement("div");
    newTask.classList.add("task-item");

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Create task information
    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");

    // Create task title
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = taskName;


    // Create task due date
    const taskDue = document.createElement("p");
    taskDue.textContent = "Due Today";


    // Put title and due date inside taskInfo
    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskDue);


    // Put checkbox and taskInfo inside newTask
    newTask.appendChild(checkbox);
    newTask.appendChild(taskInfo);


    // Add newTask to task list
    taskList.appendChild(newTask);


    // Add Delete button to the new task
    addDeleteButton(newTask);


    // Checkbox functionality
    checkbox.addEventListener("change", function () {

        if (checkbox.checked) {

            newTask.classList.add("completed");
            taskDue.textContent = "Completed";

        } else {

            newTask.classList.remove("completed");
            taskDue.textContent = "Due Today";

        }

    });


    // Update task count
    taskCount.textContent = taskList.children.length;


    console.log("New task added:", newTask);

});