console.log("StudentHub JavaScript is connected!");

const addTaskButton =document.querySelector("button");
const taskList =document.querySelector(".task-list");
const taskCount = document.querySelector(".task-count");

console.log(addTaskButton);
console.log(taskList);
console.log(taskCount);

addTaskButton.addEventListener("click",function(){
    console.log("Add task button was clicked!");

    const taskName =prompt("Enter your task:");
    console.log("Task entered:",taskName);

    if(taskName===null|| taskName.trim()===""){
        return;
    }
    
    const newTask = document.createElement("div");
  newTask.classList.add("task-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  
  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");

  const taskTitle =document.createElement("h3")
  taskTitle.textContent = taskName;

  const taskDue = document.createElement("p");
  taskDue.textContent = "Due today";

  taskInfo.appendChild(taskTitle);
  taskInfo.appendChild(taskDue);
  newTask.appendChild(checkbox);
  newTask.appendChild(taskInfo);
  taskList.appendChild(newTask);

    console.log("New task added:",newTask)

    taskCount.textContent = taskList.children.length;
}); 
const checkboxes=document.querySelectorAll('input[type="checkbox"]'); 

checkboxes.forEach(function (checkbox){

    checkbox.addEventListener("change",function(){

    const taskItem = checkbox.parentElement;
    const taskDue = taskItem.querySelector(".task-info p");

        if(checkbox.checked){

            taskItem.classList.add("completed");
            taskDue.textContent = "Completed";
        }else{
            taskItem.classList.remove("completed");
            taskDue.textContent = "Due Today";
        }
        });
    });