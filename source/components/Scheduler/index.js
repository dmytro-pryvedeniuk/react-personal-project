// Core
import React, { Component } from 'react';

import Spinner from '../Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from '../../theme/assets/Checkbox';
import Task from '../Task';

export default class Scheduler extends Component {

    state = {
        newTaskMessage: '',
        tasksFilter: '',
        isTasksFetching: false,
        tasks: []
    }

    componentDidMount() {
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
        var tasks = await api.fetchTasks();
        this.setState({ tasks: tasks });
        this._setTasksFetchingState(false);
    }

    _createTaskAsync = async (event) => {
        event.preventDefault();

        const { newTaskMessage } = this.state;
        if (!newTaskMessage)
            return null;

        this._setTasksFetchingState(true);
        const task = api.createTask(newTaskMessage);
        this.setState(({ tasks }) => ({
            tasks: [task, ...tasks],
            newTaskMessage: '',
        }));

        this._setTasksFetchingState(false);
    }

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);

        api.removeTask(id);
        this.setState(({ tasks }) => ({
            tasks: tasks.filter(task => task.id != id)
        }));

        this._setTasksFetchingState(false);
    }

    _completeAllTasksAsync = async () => {
        const { tasks } = this.state;
        const notCompleteTasks = tasks.filter(task => !task.completed);
        if (notCompleteTasks.length == 0)
            return null;
        this._setTasksFetchingState(true);
        await api.completeAllTasks(notCompleteTasks);

        this.setState(({ tasks }) => ({
            tasks: tasks.map(task =>
                notCompleteTasks.some(notCompleteTask => notCompleteTask.id == task.id)
                    ? ({ ...task, completed: true })
                    : task)
        }));

        this._setTasksFetchingState(false);
    }


    _updateTaskAsync = async (updatedTask) => {
        this._setTasksFetchingState(true);
        api.updateTask(updatedTask);
        this.setState(({ tasks }) => ({
            tasks: tasks.map(task => task.id == updatedTask.id ? updatedTask : task)
        }));
        this._setTasksFetchingState(false);
    }

    _getAllCompleted = () => {
        const { tasks } = this.state;
        return !tasks.some(task => !task.completed);
    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value
        });
    }

    _createTaskOnKeyPress = (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            this._createTaskAsync(event);
        }
    }

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLowerCase()
        });
    }

    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
    }

    _updateTasksFilterOnKeyDown = (event) => {
        if (event.key == 'Escape') {
            this._clearTasksFilter();
        }
    }

    _clearTasksFilter = () => {
        this.setState({
            tasksFilter: ''
        });
    }

    render() {
        const { tasks, newTaskMessage, tasksFilter, isTasksFetching } = this.state;
        const allCompleted = this._getAllCompleted();

        const filteredTasks = tasksFilter.length == 0 
            ? tasks 
            : tasks.filter(task => task.message && task.message.toLowerCase().includes(tasksFilter));
        const tasksJSX = filteredTasks.map((task) =>
            <Task
                key={task.id}
                {...task}
                _removeTaskAsync={this._removeTaskAsync}
                _updateTaskAsync={this._updateTaskAsync}
            >
            </Task>
        );

        return (
            <section className={Styles.scheduler}>
                <Spinner isSpinning={isTasksFetching} />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder="Поиск"
                            type="search"
                            value={tasksFilter}
                            onKeyDown={this._updateTasksFilterOnKeyDown}
                            onChange={this._updateTasksFilter} />
                    </header>
                    <section>
                        <form onSubmit={this._createTaskAsync}>
                            <input
                                className={Styles.createTask}
                                maxLength={50}
                                value={newTaskMessage}
                                onChange={this._updateNewTaskMessage}
                                onKeyPress={this._createTaskOnKeyPress}
                                placeholder="Описание моей новой задачи"
                                type="text" />
                            <button>Добавить задачу</button>
                        </form>
                        <ul>
                            {tasksJSX}
                        </ul>
                    </section>
                    <footer>
                        <Checkbox
                            color1='#363636'
                            color2='#fff'
                            checked={allCompleted}
                            onClick={this._completeAllTasksAsync}
                        />
                        <span className={Styles.completeAllTasks}>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
