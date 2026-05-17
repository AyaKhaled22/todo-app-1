let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('taskInput');
  const dateInput = document.getElementById('dateInput');
  
  if (input.value.trim() === '') return;

  tasks.unshift({
    text: input.value.trim(),
    date: dateInput.value || null,
    completed: false
  });

  input.value = '';
  dateInput.value = '';
  
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  
  const buttons = document.querySelectorAll('.tabs button');
  if (filter === 'all') buttons[0].classList.add('active');
  else if (filter === 'pending') buttons[1].classList.add('active');
  else if (filter === 'completed') buttons[2].classList.add('active');

  renderTasks(filter);
}

function sortTasks(taskArray) {
  return taskArray.sort((a, b) => {
    if (a.completed === b.completed) {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date) - new Date(b.date);
    }
    return 0 ;
  });
}

function renderTasks(filter = 'all') {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  let filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    list.innerHTML = "<p style='text-align:center;color:gray'>No tasks yet </p>";
    return;
}

  filteredTasks = sortTasks(filteredTasks);

  let grouped = {};

  filteredTasks.forEach(task => {
    let key = task.date || "no-date";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });

  let dates = Object.keys(grouped).sort();

  dates.forEach(date => {

    let titleText = "";

    if (date !== "no-date") {
      const today = new Date().toISOString().split("T")[0];

      let tomorrowDate = new Date();
      tomorrowDate.setDate(new Date().getDate() + 1);
      let tomorrow = tomorrowDate.toISOString().split("T")[0];

      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      if (date === today) {
        titleText = `Today - ${formattedDate}`;
      } 
      else if (date === tomorrow) {
        titleText = `Tomorrow - ${formattedDate}`;
      } 
      else {
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        titleText = `${dayName} - ${formattedDate}`;
      }

    } else {
      titleText = "No Date";
    }

    const title = document.createElement('div');
    title.className = "day-title";
    title.innerText = titleText;
    list.appendChild(title);

    grouped[date].forEach(task => {
      const realIndex = tasks.indexOf(task);

      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${realIndex})">
        <span class="task-text">${task.text}</span>
        <button class="delete-btn" onclick="deleteTask(${realIndex})">🗑</button> `;

      list.appendChild(li);
    });

  });
}

window.onload = () => {
  filterTasks('all');
};
