const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskStatus = document.getElementById("taskStatus");
const searchTask = document.getElementById("searchTask");
const taskList = document.getElementById("taskList");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const submitBtn = document.getElementById("submitBtn");

const tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks !== null) {
    tasks.push(...JSON.parse(savedTasks));
  }

  renderTasks();
}

let editingTaskId = null;

function renderTasks(taskArray = tasks) {
  taskList.innerHTML = "";

  taskArray.forEach((task) => {
    const article = document.createElement("article");

    article.className =
      "rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 sm:p-5";

    article.innerHTML = `
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0 flex-1">
          <h3 class="task-title sm:text-base text-sm break-words font-semibold"></h3>
          <p class="task-description mt-1 break-words text-xs sm:text-sm leading-6 text-slate-500"></p>

          <div class="mt-3 flex flex-wrap gap-2">
            <span class="task-priority rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"></span>
            <span class="task-status rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"></span>
          </div>
        </div>

        <div class="flex shrink-0 gap-2">
          <button class="edit-btn flex-1 rounded-lg border border-blue-200 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm  font-medium text-blue-600 transition hover:bg-blue-50 sm:flex-none">
            Edit
          </button>
          <button class="delete-btn flex-1 rounded-lg border border-red-200 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm  font-medium text-red-600 transition hover:bg-red-50 sm:flex-none">
            Delete
          </button>
        </div>
      </div>
    `;

    article.querySelector(".task-title").textContent = task.title;
    article.querySelector(".task-description").textContent = task.description;
    article.querySelector(".task-priority").textContent = task.priority;
    article.querySelector(".task-status").textContent = task.status;

    taskList.appendChild(article);

    article.querySelector(".delete-btn").addEventListener("click", () => {
      const updatedTasks = tasks.filter((item) => item.id !== task.id);

      tasks.length = 0;
      tasks.push(...updatedTasks);
      saveTasks();
      applyFilters();
    });

    article.querySelector(".edit-btn").addEventListener("click", () => {
      editingTaskId = task.id;
      submitBtn.textContent = "Update Task";

      taskTitle.value = task.title;
      taskDescription.value = task.description;
      taskPriority.value = task.priority;
      taskStatus.value = task.status;
    });
  });
}

function applyFilters() {
  const searchValue = searchTask.value.toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedPriority = priorityFilter.value;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchValue) ||
      task.description.toLowerCase().includes(searchValue);

    const matchesStatus =
      selectedStatus === "All" || task.status === selectedStatus;

    const matchesPriority =
      selectedPriority === "All" || task.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  renderTasks(filteredTasks);
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitle.value;
  const description = taskDescription.value;
  const priority = taskPriority.value;
  const status = taskStatus.value;

  if (editingTaskId !== null) {
    const updatedTask = tasks.map((task) => {
      if (task.id === editingTaskId) {
        return {
          ...task,
          title: title,
          description: description,
          priority: priority,
          status: status,
        };
      }

      return task;
    });

    tasks.length = 0;
    tasks.push(...updatedTask);
    saveTasks();
    editingTaskId = null;
    submitBtn.textContent = "+ Add Task";
    applyFilters();
    taskForm.reset();
    return;
  }

  const newTask = {
    id: Date.now(),
    title: title,
    description: description,
    priority: priority,
    status: status,
  };

  tasks.push(newTask);
  saveTasks();
  applyFilters();
  taskForm.reset();
});

searchTask.addEventListener("input", applyFilters);

statusFilter.addEventListener("change", applyFilters);

priorityFilter.addEventListener("change", applyFilters);

loadTasks();
