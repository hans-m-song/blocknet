import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Add room screen. GUI for creating and specifying rooms.
 */
export class ManageRoomsScreen extends Component {
    render() {
        return (
            <div className="room-mgmt-screen">
                <div className="create-room-screen">
                    <CreateRoomForm
                        addRoom={this.props.addRoom}
                        activateRoom={this.props.activateRoom}
                    />
                    <JoinRoomForm
                        joinRoom={this.props.joinRoom}
                    />
                    <ManageRooms 
                        rooms={this.props.rooms}
                        roomList={this.props.roomList}
                        manageRooms={this.props.manageRooms}
                    />
                    <ManageWhitelist 
                />
                </div>
            </div>
        );
    }
}

export class CreateRoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = { is_private: false };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /*Pass the form data up*/
    handleSubmit(event) {
        event.preventDefault();
        this.props.addRoom(this.state);
        //this.props.activateRoom(this.state.roomID);
    }

    /*Maps the inner state of the the form to the state of the overall component to establish the component as the "one source of truth"*/
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
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
                        <label>Private?</label><br/>
                        <input 
                            type="checkbox" 
                            name="is_private"
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
                            className="black-submit"
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
        console.log("calling arrange rooms next:");
        this.state = { selectedRoom: "Block Net"}
    }

    handleClick(event) {
        this
    }

    //room.id
    generateRoomOptions() {
        let roomOptions = (this.props.roomList).map((room, index) => 
            <option 
                value={room} 
                onClick={(e) => this.handleClick(e)}
                key={index}
            >
                {room}
            </option>
        );
        return roomOptions;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.addRoom(this.state);
        //this.props.activateRoom(this.state.roomID);
    }

    /*Old version with re-arrange functionality*/
    /*
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
    */

    render() {
        return (
            <div className="form-container">
                <h1>Manage Rooms</h1>
                <label>Room list:</label>
                <div className="remove-rooms-container">
                    <div className="manage-rooms input-div">
                        <select size="10">
                            {this.generateRoomOptions()}
                        </select>
                    </div>
                    <div className="manage-rooms-button-container">
                        <input 
                            type="submit" 
                            className="manage-rooms-button black-submit"
                            value="Remove">
                        </input>
                        <ManageRoomButton 
                            action="moveUp"
                            manageRooms={this.props.manageRooms}
                        />
                        <ManageRoomButton 
                            action="moveDown"
                            manageRooms={this.props.manageRooms}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export class ManageRoomButton extends Component {
    constructor(props) {
        super(props);
        if (this.props.action === "moveUp") {
            this.icon = "chevron-up"
        } else if (this.props.action === "moveDown") {
            this.icon = "chevron-down"
        }
    }

    handleClick(event) {
        this.props.manageRooms(this.props.action, 0);
    }

    render() {
        return (
            <div className="submit-icon black-submit" onClick={(e) => this.handleClick(e)}> 
                <FontAwesomeIcon className="move-icon" icon={this.icon} />
            </div>
        );
    }
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
                <div>
                <h1><span>.</span></h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="whitelist-container input-div">
                        <div>Whitelist:
                            <br/>
                            <select multiple size="10">
                                {this.generateWhitelist()}
                            </select>
                                <input 
                                type="submit" 
                                className="manage-rooms-button black-submit"
                                value="Remove">
                            </input>
                        </div>
                    </div>
                </form>
                </div>
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

export class JoinRoomForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /*Pass the form data up*/
    handleSubmit(event) {
        event.preventDefault();
        this.props.joinRoom(this.state);
        //this.props.activateRoom(this.state.roomID);
    }

    /*Maps the inner state of the the form to the state of the overall component to establish the component as the "one source of truth"*/
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    render() {
        return (
            <div className="form-container">
                <h1>Join Room</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="join-room input-div">
                        <label>Room ID:</label><br/>
                        <input 
                            type="text" 
                            name="roomID"
                            onChange={this.handleInputChange}
                        />
                        <br/>
                    </div>
                    <div className="join-room-submit input-div">
                        <br />
                        <input
                            type="submit"
                            value="Submit"
                            name="submit"
                            className="black-submit"
                        />
                        <br />
                    </div>
                </form>
            </div>
        );
    }
}