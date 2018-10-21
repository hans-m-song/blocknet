import React, { Component } from 'react'

/**
 * Add room screen. GUI for creating and specifying rooms.
 */
export class ManageRoomsScreen extends Component {
    render() {
        return (
            <div>
                <div className="create-room-screen">
                    <JoinRoomForm
                        joinRoom={this.props.joinRoom}
                    />
                    <CreateRoomForm
                        addRoom={this.props.addRoom}
                        activateRoom={this.props.activateRoom}
                    />
                    <ManageRooms 
                        rooms={this.props.rooms}
                        roomList={this.props.roomList}
                        manageRooms={this.props.manageRooms}
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
        let roomOptions = (this.props.roomList).map((room) => 
            <option value="">{room}</option>
        );
        return roomOptions;
    }

    render() {
        return (
            <div className="form-container">
                <h1>Manage Rooms</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="remove-room input-div">
                        <label>Room list:
                            <br/>
                            <select multiple size="10">
                                {this.generateRoomOptions()}
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
                            type="number" 
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
                        />
                        <br />
                    </div>
                </form>
            </div>
        );
    }
}