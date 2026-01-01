const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progress");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

document.getElementById("addTask").addEventListener("click", addTask);

function addTask() {
  if (taskInput.value.trim() === "") return;

  tasks.push({
    text: taskInput.value,
    category: categoryInput.value,
    date: dateInput.value,
    done: false
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  dateInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "done") return task.done;
    if (currentFilter === "pending") return !task.done;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    const info = document.createElement("div");
    info.className = "task-info";
    const timeInfo = getTimeRemaining(task.date);

info.innerHTML = `
  <strong>${task.text}</strong>
  <small>${task.category}</small>
  <span class="time ${timeInfo.includes("Atrasada") ? "late" : ""}">
    ⏱ ${timeInfo}
  </span>
`;


    info.onclick = () => toggleTask(index);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.onclick = () => removeTask(index);

    li.appendChild(info);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });

  updateProgress();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function updateProgress() {
  const done = tasks.filter(t => t.done).length;
  progressText.textContent = `Progresso: ${done} de ${tasks.length} tarefas concluídas`;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();
function getTimeRemaining(date) {
  if (!date) return "Sem data";

  const now = new Date();
  const dueDate = new Date(date + "T23:59:59");
  const diff = dueDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  if (diff < 0) {
    const lateDays = Math.abs(days);
    return `Atrasada há ${lateDays} dia(s)`;
  }

  if (days > 0) {
    return `Faltam ${days} dia(s)`;
  }

  if (hours > 0) {
    return `Faltam ${hours} hora(s)`;
  }

  return "Vence hoje";
}
