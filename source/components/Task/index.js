// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {

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

    render() {
        var shape = this._getTaskShape({});
        return (<li className={Styles.task}>
            <div className ={Styles.content}>
               <Checkbox className={Styles.toggleTaskCompletedState} color1='#3B8EF3' color2='#FFF'></Checkbox>
               <span>{shape.message}</span> 
            </div>
            <div className ={Styles.actions}>
                <Star inlineBlock className = {Styles.toggleTaskFavoriteState}></Star>
                <Edit inlineBlock className = {Styles.updateTaskMessageOnClick}></Edit>
                <Remove inlineBlock></Remove>
            </div>
        </li>);
    }
}
