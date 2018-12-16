// Core
import React, { PureComponent } from 'react';
import { func, string, bool } from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {

    static propTypes = {
        id: string.isRequired,
        message: string.isRequired,
        completed: bool.isRequired,
        favorite: bool.isRequired,
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired
    }

    state = {
        isTaskEditing: false,
        newMessage: ''
    }

    constructor() {
        super();
        this.taskInput = React.createRef();
    }

    componentWillMount() {
        const { message } = this.props;

        this.setState({
            newMessage: message
        })
    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _removeTask = () => {
        const { id, _removeTaskAsync } = this.props;
        _removeTaskAsync(id);
    }

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;
        const task = this._getTaskShape({ favorite: !favorite });
        _updateTaskAsync(task);
    }

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;
        const task = this._getTaskShape({ completed: !completed });
        _updateTaskAsync(task);
    }

    _setTaskEditingState = (state) => {
        this.setState({
            isTaskEditing: state,
        });

        if (state) {
            const taskInput = this.taskInput.current;
            taskInput.disabled = false;
            taskInput.focus();
        }
    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value
        });
    }

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;
        try {
            if (message == newMessage) return null;
            const task = this._getTaskShape({ message: newMessage });
            _updateTaskAsync(task);
        }
        finally {
            this._setTaskEditingState(false);
        }
    }

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;
        if (isTaskEditing) {
            this._updateTask();
            return null;
        } else {
            this._setTaskEditingState(true);
        }
    }

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;
        this._setTaskEditingState(false);
        this.setState({
            newMessage: message
        });
    }

    _updateTaskMessageOnKeyDown = (event) => {
        if (event.key === "Enter") {
            const { newMessage } = this.state;
            if (!newMessage) return null;

            this._updateTask();
        }
        else if (event.key === "Escape") {
            const { newMessage } = this.state;
            if (!newMessage) return null;

            this._cancelUpdatingTaskMessage();
        }
    }

    render() {
        const task = this._getTaskShape({});
        const { isTaskEditing, newMessage } = this.state;

        return (<li className={Styles.task}>
            <div className={Styles.content}>
                <Checkbox
                    className={Styles.toggleTaskCompletedState}
                    color1='#3B8EF3'
                    color2='#FFF'
                    inlineBlock={true}
                    checked={task.completed}
                    onClick={this._toggleTaskCompletedState}
                />

                <input
                    ref={this.taskInput}
                    type='text'
                    maxLength={50}
                    value={newMessage}
                    onChange={this._updateNewTaskMessage}
                    onKeyDown={this._updateTaskMessageOnKeyDown}
                    disabled={!isTaskEditing}
                />
            </div>
            <div className={Styles.actions}>
                <Star
                    color1='#3B8EF3'
                    color2='#000'
                    inlineBlock={true}
                    className={Styles.toggleTaskFavoriteState}
                    onClick={this._toggleTaskFavoriteState}
                    checked={task.favorite}
                />
                <Edit
                    checked={false}
                    color1='#3B8EF3'
                    color2='#000'
                    inlineBlock={true}
                    className={Styles.updateTaskMessageOnClick}
                    onClick={this._updateTaskMessageOnClick}
                />
                <Remove
                    color1='#3B8EF3'
                    color2='#000'
                    inlineBlock={true}
                    className={Styles.removeTask}
                    onClick={this._removeTask}
                />
            </div>
        </li>);
    }
}