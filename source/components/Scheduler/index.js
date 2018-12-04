// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from '../../theme/assets/Checkbox';
import Task from '../Task';

export default class Scheduler extends Component {

    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,

        tasks: [
            {'id': '1', message: 'Task A', completed: 'true', favorite: 'true' },
            {'id': '2', message: 'Task B', completed: 'false', favorite: 'true' },
            {'id': '3', message: 'Task C', completed: 'false', favorite: 'true' }
        ]  
    }

    render() {
        const {tasks} = this.state; 

        console.log(tasks);
        var tasksJSX = tasks.map((task) => 
            <Task key = {task.id} {...task}></Task>
        );

        return (
            <section className={Styles.scheduler}>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder="Поиск" type="search" />
                    </header>
                    <section>
                        <form>
                            <input placeholder="Описание моей новой задачи" type="text" />
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
