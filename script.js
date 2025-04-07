document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('taskModal');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const closeModalBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const taskForm = document.getElementById('taskForm');
    const exportBtn = document.getElementById('exportButton');
    const importBtn = document.getElementById('importButton');
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbzX5fgpyx2q5YdQzljYObj8gi9oPBs1sjtEdqaphWNRf03BNaAvP-_-QanvWWhGtUpB0g/exec';

    let editingTaskId = null;

    addTaskBtn.onclick = () => {
        modal.style.display = 'flex';
        taskForm.reset();
        editingTaskId = null;
    };

    const closeModal = () => {
        modal.style.display = 'none';
        taskForm.reset();
        editingTaskId = null;
    };

    closeModalBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;

    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('taskTitle').value;
        const category = document.getElementById('taskCategory').value;
        const deadline = document.getElementById('taskDeadline').value;
        const priority = document.getElementById('taskPriority').value;
        const status = document.getElementById('taskStatus').value;

        let taskCard;

        if (editingTaskId) {
            taskCard = document.querySelector(`[data-id='${editingTaskId}']`);
            if (taskCard) taskCard.remove();
        } else {
            editingTaskId = Date.now();
        }

        taskCard = document.createElement('div');
        taskCard.classList.add('task-card', status);
        taskCard.setAttribute('data-id', editingTaskId);
        taskCard.innerHTML = `
            <strong>${title}</strong>
            <p>📂 ${category}</p>
            <p>📅 ${deadline}</p>
            <p>🎯 ${priority}</p>
        `;

        taskCard.addEventListener('click', () => {
            document.getElementById('taskTitle').value = title;
            document.getElementById('taskCategory').value = category;
            document.getElementById('taskDeadline').value = deadline;
            document.getElementById('taskPriority').value = priority;
            document.getElementById('taskStatus').value = status;
            editingTaskId = taskCard.getAttribute('data-id');
            modal.style.display = 'flex';
        });

        document.querySelector(`#${status} .task-container`).appendChild(taskCard);
        closeModal();
    });

    exportBtn.addEventListener('click', () => {
        const taskCards = document.querySelectorAll('.task-card');
        const tasks = [];

        taskCards.forEach(card => {
            const status = card.classList[1];
            const [title, category, deadline, priority] = Array.from(card.querySelectorAll('p, strong')).map(el => el.textContent.replace(/^.*?\s/, ''));

            tasks.push({
                titolo: title,
                categoria: category,
                scadenza: deadline,
                priorita: priority,
                stato: status,
                dataAttivita: new Date().toISOString()
            });
        });

        fetch(webAppUrl, {
            method: 'POST',
            body: JSON.stringify(tasks),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.text())
        .then(msg => alert("Esportazione completata: " + msg))
        .catch(err => alert("Errore durante l'esportazione: " + err));
    });

    importBtn.addEventListener('click', () => {
        fetch(webAppUrl)
            .then(res => res.json())
            .then(data => {
                document.querySelectorAll('.task-container').forEach(container => container.innerHTML = '');

                data.forEach(task => {
                    const card = document.createElement('div');
                    card.classList.add('task-card', task.stato);
                    card.setAttribute('data-id', Date.now() + Math.random());
                    card.innerHTML = `
                        <strong>${task.titolo}</strong>
                        <p>📂 ${task.categoria}</p>
                        <p>📅 ${task.scadenza}</p>
                        <p>🎯 ${task.priorita}</p>
                    `;
                    document.querySelector(`#${task.stato} .task-container`).appendChild(card);
                });

                alert("Importazione completata");
            })
            .catch(err => alert("Errore durante l'importazione: " + err));
    });
});
