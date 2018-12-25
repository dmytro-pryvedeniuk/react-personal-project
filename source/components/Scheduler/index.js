// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';
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

        const task = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks: [task, ...tasks],
            newTaskMessage: '',
        }));

        this._setTasksFetchingState(false);
    }

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);

        await api.removeTask(id);

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

    _updateTaskAsync = async (taskToUpdate) => {
        this._setTasksFetchingState(true);

        const updatedTask = await api.updateTask(taskToUpdate);

        this.setState(({ tasks }) => ({
            tasks: tasks.map(task => task.id === taskToUpdate.id ? updatedTask : task)
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

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLowerCase()
        });
    }

    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
    }

    _getStateIndex = (task) => {
        // !complete+favorite   - 11 
        // !complete+!favorite  - 10
        // complete+favorite    - 1
        // complete+!favorite   - 0
        let result = 0;
        if (!task.completed)
            result += 10;
        if (task.favorite)
            result += 1;
        return result;
    }

    _compareTasks = (a, b) => {
        var compareByIndex = this._getStateIndex(b) - this._getStateIndex(a);
        if (compareByIndex != 0)
            return compareByIndex;
        // If two tasks have the same state the newer one should be first
        return new Date(b.created).getTime() - new Date(a.created).getTime();
    }

    render() {
        const { tasks: notSortedTasks, newTaskMessage, tasksFilter, isTasksFetching } = this.state;
        const allCompleted = this._getAllCompleted();

        const tasks = notSortedTasks.sort(this._compareTasks);

        const filteredTasks = tasksFilter.length == 0
            ? tasks
            : tasks.filter(task => task.message && task.message.toLowerCase().includes(tasksFilter));

        const tasksJSX = filteredTasks.map((task) =>
            <Task
                key={task.id}
                {...task}
                _removeTaskAsync={this._removeTaskAsync}
                _updateTaskAsync={this._updateTaskAsync}
            />
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
                            onChange={this._updateTasksFilter} />
                    </header>
                    <section>
                        <form onSubmit={this._createTaskAsync}>
                            <input
                                className={Styles.createTask}
                                maxLength={50}
                                value={newTaskMessage}
                                onChange={this._updateNewTaskMessage}
                                placeholder="Описaние моей новой задачи"
                                type="text" />
                            <button>Добавить задачу</button>
                        </form>
                        <div className="overlay">
                            <ul>
                                <FlipMove duration={400}>
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
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
