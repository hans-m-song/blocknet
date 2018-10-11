import React, { Component } from 'react'

/**
 * Add room screen. GUI for creating and specifying rooms.
 */
export class CreateRoomScreen extends Component {
    render() {
        return (
            <div className="create-room-screen">
                <NewRoomForm
                    addRoom={this.props.addRoom}
                />
            </div>
        );
    }
}

export class NewRoomForm extends Component {


    render() {
        return( 
            <form onSubmit={this.handleSubmit}>
                <div className="name-input">
                    <label>Room name:</label><br/>
                    <input type="text" name="room-name"></input><br/>
                </div>
            </form>
        );
    }
}