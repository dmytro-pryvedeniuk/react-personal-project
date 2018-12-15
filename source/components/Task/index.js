// Core
import React, { PureComponent } from 'react';
import { func } from 'prop-types';

import MessageEditor from '../MessageEditor';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {

    static propTypes = {
        _deleteTask: func.isRequired,
        _toggleFavorite: func.isRequired,
        _updateTaskMessage: func.isRequired
    }

    state = {
        isTaskEditingState: false,
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

    _deleteTask = () => {
        const { id, _deleteTask } = this.props;
        _deleteTask(id);
    }

    _toggleFavorite = () => {
        const { id, _toggleFavorite } = this.props;
        _toggleFavorite(id);
    }

    _setTaskEditingState = () => {
        const { isTaskEditingState } = this.state;

        this.setState({
            isTaskEditingState: !isTaskEditingState,
        });
    }

    _applyNewTaskMessage = (text) => {
        const { _updateTaskMessage, id } = this.props;
        _updateTaskMessage(id, text);
    }

    render() {
        const task = this._getTaskShape({});
        const { isTaskEditingState } = this.state;
        const actionColor = '#3B8EF3';

        return (<li className={Styles.task}>
            <div className={Styles.content}>
                <Checkbox
                    className={Styles.toggleTaskCompletedState}
                    color1={actionColor}
                    color2='#FFF'>
                </Checkbox>

                {isTaskEditingState
                    ? <MessageEditor
                        id={task.id}
                        message={task.message}
                        _applyNewTaskMessage={this._applyNewTaskMessage}
                        _setTaskEditingState={this._setTaskEditingState}
                    />
                    : <span>{task.message}</span>
                }
            </div>
            <div className={Styles.actions}>
                <Star
                    color1={actionColor}
                    inlineBlock
                    className={Styles.toggleTaskFavoriteState}
                    onClick={this._toggleFavorite}
                    checked={task.favorite}
                />
                <Edit
                    color1={actionColor}
                    inlineBlock
                    className={Styles.updateTaskMessageOnClick}
                    onClick={this._setTaskEditingState}
                />
                <Remove
                    color1={actionColor}
                    inlineBlock
                    onClick={this._deleteTask}
                />
            </div>
        </li>);
    }
}