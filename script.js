let tasksData = JSON.parse(localStorage.getItem("tasks")) || {
    todo: [],
    progress: [],
    done: []
};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];

let dragElement = null;

// ---------- RENDER TASKS ----------
function renderTasks() {
    columns.forEach(col => col.querySelectorAll(".task").forEach(t => t.remove()));

    for (const col in tasksData) {
        const column = document.querySelector(`#${col}`);

        tasksData[col].forEach(task => {
            const div = document.createElement("div");
            div.classList.add("task");
            div.setAttribute("draggable", "true");

            div.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
                <p class="priority">Priority: ${task.priority}</p>
                <p class="priority">Due: ${task.date || "None"}</p>
                <button class="delete">Delete</button>
            `;

            // DRAG
            div.addEventListener("drag", () => dragElement = div);

            // DELETE
            div.querySelector(".delete").addEventListener("click", () => {
                tasksData[col] = tasksData[col].filter(t => t !== task);
                save();
                renderTasks();
            });

            column.appendChild(div);
        });
    }

    updateCounts();
}

// ---------- COUNTS ----------
function updateCounts() {
    document.querySelectorAll(".count").forEach((c, i) => {
        c.innerText = columns[i].querySelectorAll(".task").length;
    });
}

// ---------- SAVE ----------
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// ---------- DRAG EVENTS ----------
function enableColumnDrag(column) {
    column.addEventListener("dragover", e => e.preventDefault());

    column.addEventListener("drop", () => {
        if (!dragElement) return;

        const fromCol = dragElement.parentElement.id;
        const toCol = column.id;

        const title = dragElement.querySelector("h3").innerText;
        const desc = dragElement.querySelector("p").innerText;

        const task = tasksData[fromCol].find(t => t.title === title);
        tasksData[fromCol] = tasksData[fromCol].filter(t => t !== task);
        tasksData[toCol].push(task);

        save();
        renderTasks();
    });
}

enableColumnDrag(todo);
enableColumnDrag(progress);
enableColumnDrag(done);

// ---------- ADD TASK ----------
document.querySelector("#add-new-task").addEventListener("click", () => {
    const title = document.querySelector("#task-title-input").value.trim();
    const desc = document.querySelector("#task-desc-input").value.trim();
    const priority = document.querySelector("#task-priority").value;
    const date = document.querySelector("#task-date").value;

    if (!title) return;

    tasksData.todo.push({ title, desc, priority, date });

    save();
    renderTasks();

    document.querySelector(".modal").classList.remove("active");
});

// ---------- SEARCH ----------
document.querySelector("#search-input").addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();

    document.querySelectorAll(".task").forEach(task => {
        const text = task.innerText.toLowerCase();
        task.style.display = text.includes(keyword) ? "block" : "none";
    });
});

// ---------- PRIORITY FILTER ----------
document.querySelector("#priority-filter").addEventListener("change", e => {
    const value = e.target.value;

    document.querySelectorAll(".task").forEach(task => {
        const pri = task.querySelector(".priority").innerText.includes(value);
        task.style.display = value === "" || pri ? "block" : "none";
    });
});

// ---------- THEME TOGGLE ----------
document.querySelector("#theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
});

// ---------- MODAL ----------
document.querySelector("#toggle-modal").addEventListener("click", () => {
    document.querySelector(".modal").classList.add("active");
});

document.querySelector(".modal .bg").addEventListener("click", () => {
    document.querySelector(".modal").classList.remove("active");
});

// ---------- FIRST LOAD ----------
renderTasks();
