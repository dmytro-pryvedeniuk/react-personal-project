import { MAIN_URL, TOKEN } from "../REST/config";

export const api = {

    async createTask(message) {
        const response = await fetch(MAIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify({ message }),
        });
        const { data: task } = await response.json();
        return task;
    },

    async completeAllTasks(notCompleteTasks) {
        const tasksToUpdate = notCompleteTasks.map(task => ({ ...task, completed: true }));
        await Promise.all(tasksToUpdate.map(task => this.updateTask(task)));
    },

    async fetchTasks() {
        const response = await fetch(MAIN_URL, {
            method: 'GET',
            headers: {
                Authorization: TOKEN,
            }
        });
        const { data: tasks } = await response.json();
        return tasks;
    },

    async removeTask(id) {
        await fetch(`${MAIN_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: TOKEN,
            }
        });
    },

    async updateTask(updatedTask) {
        const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify([updatedTask]),
        });
        const { data: result } = await response.json();
        return result[0];
    }
}