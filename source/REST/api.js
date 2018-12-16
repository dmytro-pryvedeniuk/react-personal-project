import { BaseTaskModel } from '../instruments'

export const api = {

    tasks: [
        { id: '1', message: 'Task A', completed: true, favorite: false },
        { id: '2', message: 'Task B', completed: false, favorite: true },
        { id: '3', message: 'Task C', completed: false, favorite: false }
    ],

    createTask(message) {
        const task = new BaseTaskModel();
        task.message = message;
        return task;
    },

    async completeAllTasks(notCompleteTasks) {
        this.tasks = this.tasks.map(task => notCompleteTasks.some(notCompleteTask => notCompleteTask.id == task.id) ?
            ({ ...task, completed: true }) : task);
    },

    fetchTasks() {
        return this.tasks;
    },

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    },

    updateTask(updatedTask) {
        this.tasks = this.tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    }
}