import React, { PureComponent } from 'react';
import { string, func } from 'prop-types';

export default class MessageEditor extends PureComponent {

    static propTypes = {
        id: string.isRequired,
        message: string.isRequired,
        _applyNewTaskMessage: func.isRequired,
        _setTaskEditingState: func.isRequired
    }

    state = {
        newMessage: ''
    }

    constructor() {
        super();
        this.textInput = React.createRef();
    }

    componentWillMount() {
        const { message } = this.props;

        this.setState({
            newMessage: message
        })
    }

    componentDidMount() {
        this.textInput.current.focus();
    }

    componentWillUnmount() {
        this._applyNewTaskMessage();
    }

    _onChangeMessage = (event) => {
        this.setState({
            newMessage: event.target.value
        });
    }

    _onMessageKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            this.props._setTaskEditingState();
        }
        else if (event.key === "Escape") {
            this.discardChanges = true;
            this.props._setTaskEditingState();
        }
    }

    _applyNewTaskMessage = () => {
        if (this.discardChanges) return;
        const { message, _applyNewTaskMessage } = this.props;
        const { newMessage } = this.state;
        if (message !== newMessage)
            _applyNewTaskMessage(newMessage);
    }

    render() {
        const { newMessage } = this.state;

        return (
            <input
                ref={this.textInput}
                type='text'
                value={newMessage}
                onChange={this._onChangeMessage}
                onKeyDown={this._onMessageKeyDown}
            />
        );
    }
}