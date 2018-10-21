import React, { Component } from 'react'

/**
 * Add room screen. GUI for creating and specifying rooms.
 */
export class ManageRoomsScreen extends Component {
    render() {
        return (
            <div className="create-room-screen">
                <CreateRoomForm
                    addRoom={this.props.addRoom}
                    activateRoom={this.props.activateRoom}
                />
                <JoinRoom 
                />
                <ManageRooms 
                    rooms={this.props.rooms}
                    manageRooms={this.props.manageRooms}
                />
                <ManageWhitelist 
                />
            </div>
        );
    }
}

export class CreateRoomForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /*Pass the form data up*/
    handleSubmit(event) {
        event.preventDefault();
        this.props.addRoom(this.state);
        this.props.activateRoom(this.state.roomName);
    }

    /*Maps the inner state of the the form to the state of the overall component to establish the component as the "one source of truth"*/
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return( 
            <div className="form-container">
                <h1>Create Room</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="new-room-name input-div">
                        <label>Room name:</label><br/>
                        <input 
                            type="text" 
                            name="roomName"
                            onChange={this.handleInputChange}
                        />
                        <br/>
                    </div>
                    <div className="new-room-description input-div">
                        <label>Room description:</label><br/>
                        <textarea 
                            rows="5" 
                            name="roomDescription"
                            onChange={this.handleInputChange}
                        />
                        <br/>
                    </div>
                    <div className="new-room-message-cost input-div">
                        <label>Tokens per message:</label><br/>
                        <input 
                            type="text" 
                            name="messageCost"
                            onChange={this.handleInputChange}
                        />
                        <br/>
                    </div>
                    <div className="new-room-privacy input-div">
                        <label>Privacy:</label><br/>
                        <input 
                            type="text" 
                            name="privacy"
                            onChange={this.handleInputChange}
                            />
                        <br/>
                    </div>
                    <div className="new-room-submit input-div">
                        <br/>
                        <input 
                            type="submit" 
                            value="Submit" 
                            name="submit"
                        />
                        <br/>
                    </div>
                </form>
            </div>
        );
    }
}

export class ManageRooms extends Component {
    constructor(props) {
        super(props);
        this.generateRoomOptions = this.generateRoomOptions.bind(this);
        console.log("calling arrange rooms next:")
        //this.props.manageRooms("delete", 0);
    }

    generateRoomOptions() {
        let roomOptions = (this.props.rooms).map((room) => 
            <option value="">{room}</option>
        );
        return roomOptions;
    }

    render() {
        return (
            <div className="form-container">
                <h1>Manage Rooms</h1>
                <label>Room list:</label>
                <div className="manage-rooms-container">
                    <div className="manage-rooms input-div">
                        <select multiple size="10">
                            {this.generateRoomOptions()}
                        </select>
                    </div>
                    <div className="manage-rooms-button-container">
                        <div className="manage-rooms-button">^</div>
                        <div className="manage-rooms-button">v</div>
                        <div className="manage-rooms-button">X</div>
                    </div>
                </div>
            </div>
        );
    }
}

export class ManageRoomButton extends Component {
    
}

export class ManageWhitelist extends Component {
    generateWhitelist() {
        let userList = ["user 1", "user 2", "user 3", "user 4"];
        let whiteList = userList.map((user) => 
            <option value="">{user}</option>
        );
        return whiteList;
    }

    render() {
        return (
            <div className="form-container">
                <h1>`RoomName` Whitelist:</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="remove-room input-div">
                        <label>Whitelist:
                            <br/>
                            <select multiple size="10">
                                {this.generateWhitelist()}
                            </select>
                        </label>
                    </div>
                </form>
            </div>
        );
    }
}

export class roomOption extends Component {
    render() {
        return (
            <option value="0">"this.props.name"</option>
        );
    }
}

export class JoinRoom extends Component {
    render() {
        return (
            <div className="form-container">
                <h1>Join Room</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="join-room input-div">
                        <label>Room name:</label><br/>
                        <input 
                            type="text" 
                            name="roomName"
                            onChange={this.handleInputChange}
                        />
                        <br/>
                    </div>
                </form>
            </div>
        );
    }
}