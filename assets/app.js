 let todos = [];
        let currentFilter = 'all';

        const todoForm = document.getElementById('todo-form');
        const todoInput = document.getElementById('todo-input');
        const todoList = document.getElementById('todo-list');
        const itemsLeft = document.getElementById('items-left');
        const clearCompletedBtn = document.getElementById('clear-completed');
        const filterBtns = document.querySelectorAll('.filter-btn');

        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        function getFilteredTodos() {
            switch (currentFilter) {
                case 'active': return todos.filter(todo => !todo.completed);
                case 'completed': return todos.filter(todo => todo.completed);
                default: return todos;
            }
        }

        function updateItemsLeft() {
            const activeCount = todos.filter(todo => !todo.completed).length;
            itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
        }

        function createTodoElement(todo) {
            const li = document.createElement('li');
            li.className = `todo-item${todo.completed ? ' completed' : ''}`;
            li.dataset.id = todo.id;
            
            li.innerHTML = `
                <button class="checkbox" aria-label="Toggle complete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" aria-label="Delete todo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            const checkbox = li.querySelector('.checkbox');
            const deleteBtn = li.querySelector('.delete-btn');
            const todoText = li.querySelector('.todo-text');
            
            checkbox.addEventListener('click', () => toggleTodo(todo.id));
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            todoText.addEventListener('dblclick', () => startEditing(li, todo));
            
            return li;
        }

        
        function renderEmptyState() {
            const messages = {
                all: "No tasks yet. Add one above!",
                active: "No active tasks. Great job!",
                completed: "No completed tasks yet."
            };
            
            return `
                <li class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <p>${messages[currentFilter]}</p>
                </li>
            `;
        }

        function render() {
            const filteredTodos = getFilteredTodos();
            
            if (filteredTodos.length === 0) {
                todoList.innerHTML = renderEmptyState();
            } else {
                todoList.innerHTML = '';
                filteredTodos.forEach(todo => {
                    todoList.appendChild(createTodoElement(todo));
                });
            }
            
            updateItemsLeft();
        }
        
        function addTodo(text) {
            const trimmedText = text.trim();
            if (!trimmedText) return;
            
            const newTodo = {
                id: generateId(),
                text: trimmedText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            todos.unshift(newTodo);
            render();
        }

        function toggleTodo(id) {
            todos = todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            render();
        }

        function deleteTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    
    if (todoItem) {
        todoItem.classList.add('removing');
    }

    setTimeout(() => {
        if (Array.isArray(todos)) {
            todos = todos.filter(todo => todo && todo.id !== id);
            
            if (typeof render === 'function') render();
        }
    }, 300);
}

function updateTodo(id, newText) {
    const trimmedText = (newText || "").toString().trim();

    if (!trimmedText) {
        deleteTodo(id);
        return;
    }
    
    if (Array.isArray(todos)) {
        todos = todos.map(todo => {
            if (todo && todo.id === id) {
                return { ...todo, text: trimmedText };
            }
            return todo;
        });
        
        if (typeof render === 'function') render();
    }
}

    function clearCompleted() {
        const completedItems = document.querySelectorAll('.todo-item.completed');
        completedItems.forEach(item => item.classList.add('removing'));
            
        setTimeout(() => {
            todos = todos.filter(todo => !todo.completed);
            render();
            }, 300);
        }

    function startEditing(li, todo) {
        const todoText = li.querySelector('.todo-text');
        todoText.setAttribute('contenteditable', 'true');
        todoText.classList.add('editing');
        todoText.focus();
            
        const range = document.createRange();
        range.selectNodeContents(todoText);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
            
    function finishEditing() {
        todoText.setAttribute('contenteditable', 'false');
        todoText.classList.remove('editing');
        updateTodo(todo.id, todoText.textContent);
    }
            
    todoText.addEventListener('blur', finishEditing, { once: true });
    todoText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            todoText.blur();
        }
        if (e.key === 'Escape') {
            todoText.textContent = todo.text;
            todoText.blur();
        }
    });
    } 






