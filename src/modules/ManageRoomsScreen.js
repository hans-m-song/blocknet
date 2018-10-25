import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Add room screen. GUI for creating and specifying rooms.
 */
export class ManageRoomsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedRoomIndex: 0};
        this.incrementIndex = this.incrementIndex.bind(this);
        this.decrementIndex = this.decrementIndex.bind(this);
        this.handleRoomOptionClick = this.handleRoomOptionClick.bind(this);
        this.getWhitelist = this.getWhitelist.bind(this);
        this.getWhitelist();
    }

    handleRoomOptionClick(index) {
        this.setState({selectedRoomIndex: index})
    }

    incrementIndex() {
        if (this.state.selectedRoomIndex < this.props.rooms.length-1) {
            this.setState({ selectedRoomIndex: this.state.selectedRoomIndex+1});
        } 
    }

    decrementIndex() {
        if (this.state.selectedRoomIndex > 0) {
            this.setState({ selectedRoomIndex: this.state.selectedRoomIndex-1});
        }
    }

    getWhitelist() {
        this.props.manageWhitelist(this.props.rooms[this.state.selectedRoomIndex].id, -1, -1);
    }

    render() {
        //check if selected room is private; i.e. has a whitelist to manage
        

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
                        //roomList={this.props.roomList}
                        manageRooms={this.props.manageRooms}
                        incrementIndex={this.incrementIndex}
                        decrementIndex={this.decrementIndex}
                        selectedRoomIndex={this.state.selectedRoomIndex}
                        handleRoomOptionClick={this.handleRoomOptionClick}
                    />
                    <ManageWhitelist 
                        manageWhitelist={this.props.manageWhitelist}
                        rooms={this.props.rooms}
                        selectedRoomIndex={this.state.selectedRoomIndex}
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

        //this.state = { selectedRoom: this.props.rooms[0].id}
        //this.state = { selectedRoomIndex: 0}
    }

    generateRoomOptions() {
        var i = 0;
        let roomOptions = (this.props.rooms).map((room, index) => 
            //console.log("room otpion index: " + index)}
            //<option value="{room.id}" key="{room.id}" onClick={(e) => this.handleRoomOptionClick(e)}>{room.name}</option>
            <RoomOption 
                id={room.id} 
                name={room.name} 
                index={index} 
                handleRoomOptionClick={this.props.handleRoomOptionClick}
                selectedRoomIndex={this.props.selectedRoomIndex}
            />
        );
        return roomOptions;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.addRoom(this.state);
        //this.props.activateRoom(this.state.roomID);
    }

    render() {
        return (
            <div className="form-container">
                <h1>Manage Rooms</h1>
                <label>Room list:</label>
                <div className="remove-rooms-container">
                    <div className="manage-rooms input-div border-div">
                        {this.generateRoomOptions()}
                    </div>
                    <div className="manage-rooms-button-container">
                        <ManageRoomButton
                            action="delete"
                            manageRooms={this.props.manageRooms}
                            selectedRoomIndex={this.props.selectedRoomIndex}
                            changeIndex={this.props.decrementIndex}
                            rooms={this.props.rooms}
                        />
                        <ManageRoomButton 
                            action="moveUp"
                            manageRooms={this.props.manageRooms}
                            selectedRoomIndex={this.props.selectedRoomIndex}
                            changeIndex={this.props.decrementIndex}
                            rooms={this.props.rooms}
                        />
                        <ManageRoomButton 
                            action="moveDown"
                            manageRooms={this.props.manageRooms}
                            selectedRoomIndex={this.props.selectedRoomIndex}
                            changeIndex={this.props.incrementIndex}
                            rooms={this.props.rooms}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export class RoomOption extends Component {
    handleClick(event) {
        this.props.handleRoomOptionClick(this.props.index)
    }

    render() {
        let selectedStatus = "unselected-option text-unselectable";
        if (this.props.selectedRoomIndex === this.props.index) {
            selectedStatus = "selected-option text-unselectable";
        }
        let classes = `${selectedStatus}`
        return (
            <div className={classes} value="{this.props.id}" key="{this.props.id}" onClick={(e) => this.handleClick(e)}>{this.props.name}</div>
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
        console.log(this.props.action + " room index:" + this.props.index);
        this.props.manageRooms(this.props.action, this.props.selectedRoomIndex);
        if (this.props.action === "moveUp" || this.props.action === "moveDown") {
            this.props.changeIndex();
        }
        if (this.props.action === "delete") {
            console.log("index:" + this.props.index + " | roomlength-2" + this.props.rooms.length);
            if (this.props.index === this.props.rooms.length-2) {
                this.props.changeIndex();
            }
        }
    }

    render() {
        const isRemove = (this.props.action === "delete");
        return (
            <div className="submit-icon black-submit" onClick={(e) => this.handleClick(e)}> 
                { isRemove ? (
                    <div className="text-unselectable">Remove</div>
                ) : (
                <FontAwesomeIcon className="move-icon" icon={this.icon} />
                )}
            </div>
        );
    }
}

export class ManageWhitelist extends Component {
    /*
    generateWhitelist() {
        let userList = ["user 1", "user 2", "user 3", "user 4"];
        let whiteList = userList.map((user) => 
            <div className="text-unselectable" value="">{user}</div>
        );
        return whiteList;
    }
    */

    generateWhitelist() {
        /*
        let userList = this.props.manageWhitelist(this.props.rooms[0].id, -1, -1);
        //let userList = this.props.manageWhitelist(4, -1, -1);
        
        userList.then((list) => {
            console.log("USER LIST > " + userList + "list -> " + list);
            console.log("is array : " + list.constructor === Array)
            let whiteList = list.map((user) => 
                <div className="text-unselectable" value="">{user}</div>
                );
            return whiteList;
        })        
        */
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
                            <div className="manage-rooms input-div border-div">
                                {this.generateWhitelist()}
                            </div>
                            <input 
                                type="submit" 
                                className="manage-rooms-button black-submit"
                                value="Remove">
                            </input>
                            <div className="add-to-whitelist-field">
                                <input type="text"></input>
                                <input type="submit" value="Add"></input>
                            </div>
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