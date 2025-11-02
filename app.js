// Simple To-Do with localStorage
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const tpl = document.getElementById('task-template');
const dateEl = document.getElementById('current-date');

// Display current date
const today = new Date();
const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateEl.textContent = today.toLocaleDateString(undefined, opts);

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('todo_tasks') || '[]');

function saveTasks(){ localStorage.setItem('todo_tasks', JSON.stringify(tasks)); }

function render(){
  list.innerHTML = '';
  tasks.forEach((t, idx) => {
    const node = tpl.content.cloneNode(true);
    const li = node.querySelector('li');
    const check = node.querySelector('.task-check');
    const textSpan = node.querySelector('.task-text');
    const editInput = node.querySelector('.task-edit-input');
    const editBtn = node.querySelector('.edit-btn');
    const saveBtn = node.querySelector('.save-btn');
    const cancelBtn = node.querySelector('.cancel-btn');
    const deleteBtn = node.querySelector('.delete-btn');

    textSpan.textContent = t.text;
    editInput.value = t.text;
    check.checked = !!t.done;
    if(t.done) li.classList.add('completed');

    // toggle complete (checkbox)
    check.addEventListener('change', () => {
      t.done = check.checked;
      if(t.done) li.classList.add('completed');
      else li.classList.remove('completed');
      saveTasks();
      render();
    });

    // delete
    deleteBtn.addEventListener('click', () => {
      tasks.splice(idx,1);
      saveTasks();
      render();
    });

    // edit
    editBtn.addEventListener('click', () => {
      textSpan.style.display = 'none';
      editInput.style.display = 'block';
      editInput.focus();
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
      cancelBtn.style.display = 'inline-block';
    });

    // save edit
    saveBtn.addEventListener('click', () => {
      const val = editInput.value.trim();
      if(!val){ alert('Task cannot be empty'); return; }
      t.text = val;
      saveBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';
      editInput.style.display = 'none';
      textSpan.style.display = 'inline';
      saveTasks();
      render();
    });

    // cancel edit
    cancelBtn.addEventListener('click', () => {
      editInput.value = t.text;
      editInput.style.display = 'none';
      textSpan.style.display = 'inline';
      saveBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';
    });

    // inline save on Enter while editing
    editInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') saveBtn.click();
      if(e.key === 'Escape') cancelBtn.click();
    });

    list.appendChild(node);
  });
}

// add task function
function addTask(text){
  const trimmed = text.trim();
  if(!trimmed) return alert('Please enter a task.');
  tasks.unshift({ text: trimmed, done:false, created: Date.now() });
  saveTasks();
  render();
  input.value = '';
  input.focus();
}

// events
addBtn.addEventListener('click', () => addTask(input.value));
input.addEventListener('keydown', (e) => { if(e.key === 'Enter') addTask(input.value); });

// initial render
render();
