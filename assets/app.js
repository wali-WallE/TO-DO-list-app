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

