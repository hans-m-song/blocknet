import React, { Component } from 'react'

/*
 * ChatBox for typing and sending message
 */
export class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
    }

    //Update value when ever it is changed in the textarea
    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    //Send message to the parent component, RoomScreen, and reset value to ''
    handleSubmit(e) {
        e.preventDefault();
        //var thisMessage = this.state.value;
        var thisMessage = this.state.value;
        this.props.updateMessage(thisMessage);
        this.setState({ value: '' });
    }

    onEnterPress(e) {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    render() {
        return (
            <div className="chat-box">
                <form onSubmit={(e) => this.handleSubmit(e)}
                    ref={formRef => this.myFormRef = formRef}>
                    <textarea cols="1" placeholder="Enter message..."
                        value={this.state.value}
                        onChange={this.handleChange}
                        onKeyDown={(e) => this.onEnterPress(e)} />
                    <input className="chat-box-send" type="submit" value="Send" />
                </form>
            </div>
        );
    }
}