// Core
import React, { PureComponent } from 'react';
import { func, string } from 'prop-types';

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
        actionColor: string.isRequired,
        actionBackground: string.isRequired
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

    render() {
        const {
            message, 
            favorite, 
            actionColor, 
            actionBackground
        } = this.props;

        return (<li className={Styles.task}>
            <div className={Styles.content}>
                <Checkbox 
                    className={Styles.toggleTaskCompletedState} 
                    color1={actionColor} 
                    color2={actionBackground}>
                </Checkbox>
                <span>{message}</span>
            </div>
            <div className={Styles.actions}>
                <Star
                    color1={actionColor} 
                    inlineBlock 
                    className={Styles.toggleTaskFavoriteState}
                    onClick = {this._toggleFavorite}
                    checked = {favorite}>
                </Star>
                <Edit inlineBlock className={Styles.updateTaskMessageOnClick}></Edit>
                <Remove inlineBlock onClick={this._deleteTask}></Remove>
            </div>
        </li>);
    }
}
