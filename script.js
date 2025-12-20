let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let dragelement = null;

function addTask(title, desc, column) {
    const div = document.createElement("div")

    div.classList.add("task")
    div.setAttribute("draggable", "true")

    div.innerHTML = `
        <h2>${taskTitle}</h2>
        <p>${taskDesc}</p>
        <button>Delete</button>
    `;

    column.addEventListener('drag', (e) =>{
        dragelement = div
    })

    return div;
}

const columns = [todo, progress, done];


// ---------------- LOAD FROM LOCAL STORAGE ----------------
if (localStorage.getItem("tasks")) {
    tasksData = JSON.parse(localStorage.getItem("tasks"));

    for (const col in tasksData) {
        const column = document.querySelector(`#${col}`);

        tasksData[col].forEach(task => {
            const div = document.createElement("div");

            div.classList.add("task");
            div.setAttribute("draggable", "true");

            div.innerHTML = `
                <h2>${task.title}</h2>
                <p>${task.ddesc}</p>
                <button>Delete</button>
            `;

            column.appendChild(div);

            // make draggable
            div.addEventListener("drag", () => {
                dragelement = div;
            });
        });
    }

    // update counts
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");
        count.innerText = tasks.length;
    });
}


// --------------- MAKE INITIAL TASKS DRAGGABLE ---------------
document.querySelectorAll(".task").forEach(task => {
    task.addEventListener("drag", () => {
        dragelement = task;
    });
});


// ---------------- DRAG + DROP SYSTEM ----------------
function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", e => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", e => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", e => {
        e.preventDefault();
    });

    column.addEventListener("drop", e => {
        e.preventDefault();

        if (dragelement) {
            column.appendChild(dragelement);
        }

        column.classList.remove("hover-over");

        // Update tasks + counts + save
        updateTasksAndSave();
    });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);


// ---------------- UPDATE + SAVE TO LOCALSTORAGE ----------------
function updateTasksAndSave() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        tasksData[col.id] = [...tasks].map(t => ({
            title: t.querySelector("h2").innerText,
            ddesc: t.querySelector("p").innerText
        }));

        count.innerText = tasks.length;
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}



// ---------------- ADD NEW TASK ----------------
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDesc = document.querySelector("#task-desc-input").value;

    if (!taskTitle.trim()) return;

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${taskTitle}</h2>
        <p>${taskDesc}</p>
        <button>Delete</button>
    `;

    todo.appendChild(div);

    div.addEventListener("drag", () => {
        dragelement = div;
    });

    updateTasksAndSave();

    modal.classList.remove("active");
});
