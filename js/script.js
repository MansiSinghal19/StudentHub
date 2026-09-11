console.log("StudentHub JavaScript is connected!");

const addTaskButton = document.querySelector("#add-task-button");
const taskList = document.querySelector(".task-list");
const taskCount = document.querySelector(".task-count");


// StudentHub task data
let tasks = [
    {
        id: 1,
        title: "DSA Practice",
        priority: "Medium",
        dueDate: "2026-08-28",
        completed: true
    },
    {
        id: 2,
        title: "DBMS Assignment",
        priority: "High",
        dueDate: "2026-08-29",
        completed: false
    }
];

const savedTasks = localStorage.getItem("tasks");

if(savedTasks){
    tasks = JSON.parse(savedTasks);
}

//save tasks to LocalStorage
function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}
// select elements from the add task modal

const taskModal = document.querySelector("#task-modal");
const taskForm = document.querySelector("#task-form");
const taskNameInput = document.querySelector("#task-name-input");
const taskPriorityInput = document.querySelector("#task-priority-input");
const taskDateInput = document.querySelector("#task-date-input");
const closeModalButton = document.querySelector("#close-modal-button");
const cancelTaskButton = document.querySelector("#cancel-task-button")

//Display tasks from the tasks array
function renderTasks() {

    const taskList = document.querySelector(".task-list");
    const taskCount = document.querySelector(".task-count");

    if (taskCount) {
        taskCount.textContent = tasks.length;
    }

    if (!taskList) {
        return;
    }

    taskList.innerHTML = "";


    //Go through every task 
    tasks.forEach(function(task){

        //create main task container
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        taskItem.dataset.id = task.id;

        //Add completed class if task is completed
        if(task.completed){
            taskItem.classList.add("completed");
        }

        //create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change",function(){
            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();
        });

        //Create  task information container
        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        //create task title 
        const taskTitle = document.createElement("h3");
        taskTitle.textContent = task.title;

        //Create due date
        const taskDue = document.createElement("p");
        taskDue.textContent = "Due: " + task.dueDate;

        //create priority 
        const taskPriority = document.createElement("p");
        taskPriority.textContent = "Priority: " + task.priority;

        //put information inside task-info
        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDue);
        taskInfo.appendChild(taskPriority);

        //put checkbox and task-info inside task-item 
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskInfo);

        //create Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click",function(){

            const taskId = Number(taskItem.dataset.id);

            tasks= tasks.filter(function(task){
                return task.id !== taskId;
            });

            saveTasks();

            renderTasks();
        });
        taskItem.appendChild(deleteButton);

        // Create Edit button
const editButton = document.createElement("button");
editButton.textContent = "Edit";

editButton.addEventListener("click", function () {

    const newTaskName = prompt("Edit your task:",task.title);

    if (newTaskName === null || newTaskName.trim() === "") {
        return;
    }

    task.title = newTaskName.trim();

    saveTasks();
    renderTasks();
});

taskItem.appendChild(editButton);

        // put task-item  inside task-list
        taskList.appendChild(taskItem);
    });

    //update task count 

    if(taskCount){
    taskCount.textContent = tasks.length;
    }
}

renderTasks();

console.log(addTaskButton);
console.log(taskList);
console.log(taskCount);

// OPEN ADD TASK MODAL
if(addTaskButton){
addTaskButton.addEventListener("click",function(){
    //show the modal
    taskModal.style.display ="flex";
});
}

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

    const newTasks ={
        id:Date.now(),
        title:taskName,
        priority:priority,
        dueDate: dueDate,
        completed:false
    };

    console.log("Task Name:", taskName);
    console.log("Priority:", priority);
    console.log("Due Date:", dueDate);

   tasks.push(newTasks);

   saveTasks();

   renderTasks();
   
   //update task count
if (taskCount) {
    taskCount.textContent = tasks.length;
}
   
   taskForm.reset();
   
   taskModal.style.display="none";
    
   console.log("New tasks added:", newTasks);
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
