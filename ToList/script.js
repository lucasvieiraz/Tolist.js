document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
    document.getElementById("clearButton").addEventListener("click", clearTasks);
});

function addTask() {
    var taskInput = document.getElementById("taskInput").value;
    var urgencyInput = document.getElementById("urgencyInput").value;
    var areaInput = document.getElementById("areaInput").value;
    
    if (taskInput.trim() === "" || urgencyInput.trim() === "") {
        alert("Por favor, preencha tanto a tarefa quanto o grau de urgência.");
        return;
    }

    var urgency = parseInt(urgencyInput);
    if (urgency < 1 || urgency > 5) {
        alert("Por favor, insira um número entre 1 e 5 para o grau de urgência.");
        return;
    }

    var task = {
        name: taskInput,
        urgency: urgency,
        area: areaInput || "Sem área"
    };

    saveTask(task);
    displayTasks();
}

function saveTask(task) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    displayTasks();
}

function displayTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    var tasksByArea = {};
    tasks.forEach(task => {
        if (!tasksByArea[task.area]) {
            tasksByArea[task.area] = [];
        }
        tasksByArea[task.area].push(task);
    });
    
    var areasContainer = document.getElementById("areasContainer");
    areasContainer.innerHTML = "";

    for (var area in tasksByArea) {
        var areaTasks = tasksByArea[area];
        var areaTasksList = document.createElement("ul");
        areaTasksList.classList.add("task-list");
        areaTasksList.innerHTML = "<h2>" + area + "</h2>";
        areaTasks.forEach(task => {
            displayTask(task, areaTasksList);
        });
        areasContainer.appendChild(areaTasksList);
    }

    displayImportantTasks();
}

function displayTask(task, container, showArea = false) {
    var li = document.createElement("li");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function() {
        li.style.textDecoration = this.checked ? "line-through" : "none";
        if (this.checked) {
            markRelatedImportantTaskAsCompleted(task);
        }
    });
    
    li.appendChild(checkbox);
    
    var taskDescription = document.createElement("span");
    taskDescription.textContent = task.name + " - Urgência: " + task.urgency;
    if (showArea && task.area) {
        taskDescription.textContent += " (Área: " + task.area + ")";
    }
    li.appendChild(taskDescription);

    if (task.urgency <= 2) {
        li.classList.add("important");
    }
    
    container.appendChild(li);
}

function displayImportantTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var importantTasksContainer = document.getElementById("importantTasks");
    importantTasksContainer.innerHTML = "";

    var importantTasks = tasks.filter(task => task.urgency <= 2);
    importantTasks.sort((a, b) => a.urgency - b.urgency);

    importantTasks.forEach(task => {
        displayTask(task, importantTasksContainer, true);
        // Se a tarefa estiver marcada como concluída, riscar a tarefa
        var li = importantTasksContainer.querySelector("li:last-child");
        var checkbox = li.querySelector("input[type='checkbox']");
        if (checkbox.checked) {
            li.style.textDecoration = "line-through";
        }
    });
}

function clearTasks() {
    localStorage.removeItem("tasks");
    displayTasks();
}

function markRelatedImportantTaskAsCompleted(task) {
    var importantTasks = document.querySelectorAll("#importantTasks .task-list li");
    importantTasks.forEach(importantTask => {
        var taskName = importantTask.textContent.split(" - ")[0];
        if (taskName === task.name) {
            importantTask.style.textDecoration = "line-through";
            importantTask.querySelector("input[type='checkbox']").checked = true;
        }
    });
}
