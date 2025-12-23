// DOM ELEMENTS
const modal = document.getElementById("addTaskModal");
const toggleModalBtn = document.getElementById("toggle-modal");
const addTaskBtn = document.getElementById("add-new-task");
const themeToggle = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const priorityFilter = document.getElementById("priority-filter");

const titleInput = document.getElementById("task-title-input");
const descInput = document.getElementById("task-desc-input");
const priorityInput = document.getElementById("task-priority");
const dateInput = document.getElementById("task-date");

const columns = {
    todo: document.querySelector("#todo-column .tasks"),
    progress: document.querySelector("#inprogress-column .tasks"),
    done: document.querySelector("#done-column .tasks"),
};

// MODAL
toggleModalBtn.addEventListener("click", () => modal.classList.add("active"));
modal.addEventListener("click", e => {
    if (e.target.classList.contains("modal-bg"))
        modal.classList.remove("active");
});

// SAVE TASKS
const saveTasks = () => {
    const data = {
        todo: columns.todo.innerHTML,
        progress: columns.progress.innerHTML,
        done: columns.done.innerHTML
    };
    localStorage.setItem("kanbanTasks", JSON.stringify(data));
};

// ENABLE DELETE BUTTON
function enableDelete(task) {
    const del = task.querySelector(".delete-btn");
    if (!del) return;

    del.addEventListener("click", () => {
        task.remove();
        saveTasks();
        updateAllCounts();
    });
}

// RESTORE FROM LOCAL STORAGE
const loadTasks = () => {
    const data = JSON.parse(localStorage.getItem("kanbanTasks"));
    if (!data) return;

    columns.todo.innerHTML = data.todo;
    columns.progress.innerHTML = data.progress;
    columns.done.innerHTML = data.done;

    // Reattach delete + drag events
    document.querySelectorAll(".task-card").forEach(task => {
        enableDelete(task);
        enableDrag(task);
    });

    updateAllCounts();
};
loadTasks();

// CREATE TASK
function createTask(title, desc, priority, date, column = "todo") {
    const task = document.createElement("div");
    task.classList.add("task-card");
    task.setAttribute("draggable", "true");
    task.dataset.priority = priority;

    task.innerHTML = `
        <div class="task-top">
            <h3>${title}</h3>
            <span class="priority ${priority.toLowerCase()}">${priority}</span>
        </div>
        <p class="task-desc">${desc}</p>
        <div class="task-bottom">
            <span class="date"><i class="ri-calendar-line"></i> ${date}</span>
            <button class="delete-btn"><i class="ri-delete-bin-6-line"></i></button>
        </div>
    `;

    columns[column].appendChild(task);

    enableDelete(task);
    enableDrag(task);
    saveTasks();
    updateAllCounts();
}

// ADD TASK BUTTON
addTaskBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const priority = priorityInput.value;
    const date = dateInput.value;

    if (!title || !priority || !date) {
        alert("Please fill all required fields!");
        return;
    }

    createTask(title, desc, priority, date);

    modal.classList.remove("active");
    titleInput.value = "";
    descInput.value = "";
    priorityInput.value = "";
    dateInput.value = "";
});

// DRAG & DROP
function enableDrag(task) {
    task.addEventListener("dragstart", () => task.classList.add("dragging"));
    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
        saveTasks();
        updateAllCounts();
    });
}

document.querySelectorAll(".tasks").forEach(col => {
    col.addEventListener("dragover", e => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (dragging) col.appendChild(dragging);
    });
});

// SEARCH
searchInput.addEventListener("input", () => {
    const val = searchInput.value.toLowerCase();
    document.querySelectorAll(".task-card").forEach(task => {
        const title = task.querySelector("h3").innerText.toLowerCase();
        task.style.display = title.includes(val) ? "block" : "none";
    });
});

// PRIORITY FILTER
priorityFilter.addEventListener("change", () => {
    const filter = priorityFilter.value;
    document.querySelectorAll(".task-card").forEach(task => {
        const priority = task.dataset.priority;
        task.style.display = (filter === "" || filter === priority) ? "block" : "none";
    });
});

// THEME TOGGLE
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.innerHTML = document.body.classList.contains("light")
        ? '<i class="ri-sun-fill"></i>'
        : '<i class="ri-moon-fill"></i>';
});

// UPDATE COLUMN COUNTS
function updateAllCounts() {
    document.querySelectorAll(".task-column").forEach(col => {
        const count = col.querySelectorAll(".task-card").length;
        col.querySelector(".task-count").innerText = count;
    });
}
