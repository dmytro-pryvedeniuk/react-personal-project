// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from '../../theme/assets/Checkbox';
import Task from '../Task';
import { BaseTaskModel } from '../../instruments';

export default class Scheduler extends Component {

    state = {
        newTaskMessage: '',
        tasksFilter: '',
        isTasksFetching: false,

        tasks: [
            { 'id': '1', message: 'Task A', completed: 'true', favorite: false },
            { 'id': '2', message: 'Task B', completed: 'false', favorite: true },
            { 'id': '3', message: 'Task C', completed: 'false', favorite: false }
        ]
    }

    _addTask = () => {
        const { newTaskMessage, tasks } = this.state;

        if (!newTaskMessage)
            return null;

        const task = new BaseTaskModel();
        task.message = newTaskMessage;

        this.setState({
            newTaskMessage: '',
            tasks: [task, ...tasks]
        })
    }

    _toggleFavorite = (id) => {
        const { tasks } = this.state;
        const task = tasks.find(task => task.id == id);
        if (!task)
            return;
        const taskToUse = {
            ...task,
            favorite: !task.favorite
        };

        this.setState({
            tasks: taskToUse.favorite
                ? [taskToUse, ...tasks.filter(task => task.id !== id)]
                : [...tasks.filter(task => task.id !== id), taskToUse]
        })
    }

    _deleteTask = (id) => {
        const { tasks } = this.state;

        this.setState({
            tasks: tasks.filter(task => task.id !== id)
        })
    }

    _updateCurrentText = (event) => {
        console.log(event.target.value);
        this.setState({
            newTaskMessage: event.target.value
        });
    }

    _handleOnCommit = (event) => {
        event.preventDefault();
        this._addTask();
    }

    _handleOnKeyPress = (event) => {
        if (event.key == "Enter") {
            event.preventDefault();
            this._addTask();
        }
    }

    render() {
        const { tasks, newTaskMessage } = this.state;

        var tasksJSX = tasks.map((task) =>
            <Task
                key={task.id}
                {...task}
                actionColor='#3b8ef3'
                actionBackground='#FFF'
                _deleteTask={this._deleteTask}
                _toggleFavorite={this._toggleFavorite}
            />
        );

        return (
            <section className={Styles.scheduler}>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder="Поиск" type="search" />
                    </header>
                    <section>
                        <form onSubmit={this._handleOnCommit}>
                            <input
                                value={newTaskMessage}
                                onChange={this._updateCurrentText}
                                onKeyPress={this._handleOnKeyPress}
                                placeholder="Описание моей новой задачи"
                                type="text" />
                            <button>Добавить задачу</button>
                        </form>
                        <ul>
                            {tasksJSX}
                        </ul>
                    </section>
                    <footer>
                        <div>
                            <Checkbox color1='#363636' color2='#fff' />
                        </div>
                        <span className={Styles.completeAllTasks}>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
