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


// ADD TASK
addTaskButton.addEventListener("click", function () {

    console.log("Add task button was clicked!");

    const taskName = prompt("Enter your task:");

    console.log("Task entered:", taskName);


    if (taskName === null || taskName.trim() === "") {
        return;
    }

    // Ask the user to select task priority 
    const priority = prompt(
        "Enter task priority:\nHigh\nMedium\nLow"
    );

    //Stop if user cancels or leaves priority empty
    if(priority === null || priority.trim() === ""){
        return ;
    }

    console.log("Task priority :",priority);

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

    //Create task priority
    const taskPriority = document.createElement("p");
   taskPriority.textContent = "Priority: "+ priority;


    // Put title and due date and priority inside taskInfo
    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskDue);
    taskInfo.appendChild(taskPriority);


    // Put checkbox and taskInfo inside newTask
    newTask.appendChild(checkbox);
    newTask.appendChild(taskInfo);


    // Add newTask to task list
    taskList.appendChild(newTask);


    // Add Delete button to the new task
    addDeleteButton(newTask);

    // Add Edit functionality to the new task
    addEditButton(newTask);


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