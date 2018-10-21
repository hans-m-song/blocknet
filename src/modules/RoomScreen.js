import React, { Component } from 'react'
import { ManageRoomsScreen } from './ManageRoomsScreen' 
import { ChatBox } from './ChatBox'
import { Message } from './Message'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Main room screen containing the room navigation menu, message list and chat box
 */
export class RoomScreen extends Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
        
        /*setting the state in constructor means there is no 'memory' of the last position (i.e. room) the user was in if they navigate to a different screen (i.e. settings)and will default to these. May be worth keeping track of last position in the main screen.*/
        this.state = {
            lastMessage: '',
            activeRoom: "BlockNet",
            creatingRoom: false
        };

        this.updateMessage = this.updateMessage.bind(this);
        this.activateRoom = this.activateRoom.bind(this);
        this.activateCreateRoom = this.activateCreateRoom.bind(this);
    };

    /*This is the point where we will want to give the to-be-activated room name to the backend for it to send back messages
    
    NOTE: this may need to be moved further up to the backend when incorporating frontend with backend.
    */
    activateRoom(roomName) {
        this.setState({ activeRoom: roomName });
        this.props.setRoom(roomName);
        this.setState({ creatingRoom: false });
    }

    activateCreateRoom() {
        if (this.state.creatingRoom) {
            this.setState({ creatingRoom: false });
        } else {
            this.setState({ creatingRoom: true })
        }
    }

    //Calls the addMessage function from MessageContainer
    updateMessage(msg) {
        //this.setState({ lastMessage: msg });
        //this.child.current.addMessage(msg);
        this.sendMessageToBlock(msg);
    }

    sendMessageToBlock(msg) {
        this.props.sendMessage(msg);
    }

    //Bind message container to this.child so that the addMessage
    //function from MessageContainer can be accessed in updateMessage
    render() {
        const creatingRoom = this.state.creatingRoom;
        let content;
        if (creatingRoom) {
            content = 
                <div className="content room-screen">
                    <RoomNav 
                        onRoomButtonClick={this.activateRoom}
                        onAddRoomButtonClick={this.activateCreateRoom}
                        rooms={this.props.rooms}
                        activeRoom={this.state.activeRoom} 
                        creatingRoom={this.state.creatingRoom}
                    />
                    <ManageRoomsScreen
                        activateRoom={this.activateRoom}
                        addRoom={this.props.addRoom}
                        rooms={this.props.rooms}
                        manageRooms={this.props.manageRooms}
                    />
                </div>
        } else {
            content = 
                <div className="content room-screen">
                    <RoomNav 
                        onRoomButtonClick={this.activateRoom}
                        onAddRoomButtonClick={this.activateCreateRoom}
                        rooms={this.props.rooms}
                        activeRoom={this.state.activeRoom} 
                        creatingRoom={this.state.creatingRoom}
                    />
                    <MessageContainer
                        ref={this.child}
                        messageHistory={this.props.messageHistory}
                        lastMessage={this.props.lastMessage}
                    />
                    <ChatBox updateMessage={(e) => this.updateMessage(e)} />
                </div>
        }

        return (
            content
        );
    }
}

/*
 * Contains all the messages
 */
export class RoomNav extends Component {
    constructor(props) {
        super(props);
        this.activateRoom = this.activateRoom.bind(this);
        this.activateCreateRoom = this.activateCreateRoom.bind(this);
    }

    /*Converts array of room names passed down as prop from backend into corresponding buttons in room nav menu*/
    roomList() {
        let roomButtons = (this.props.rooms).map((room) =>
            <RoomButton
                key={room} //this makes the assumption that no rooms will have the identical name
                roomName={room}
                onRoomButtonClick={this.activateRoom}
                activeRoom={this.props.activeRoom}
                creatingRoom={this.props.creatingRoom}
            />    
        );
        return (
            roomButtons
        );
    }

    activateRoom(roomName) {
        this.props.onRoomButtonClick(roomName);
    }

    activateCreateRoom() {
        this.props.onAddRoomButtonClick();
    }

   render() {
        return (
            <div className="room-menu">
                <div className="room-nav text-unselectable">
                    {this.roomList()}
                </div>
                <AddRoomButton 
                    creatingRoom={this.props.creatingRoom}
                    onAddRoomButtonClick={this.activateCreateRoom}
                />
            </div>
        );
    }
}

/**
 * Button for rooms. Changes colour according to whether selected or not 
 */
export class RoomButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.onRoomButtonClick(this.props.roomName);
    }
    render() {
        let selectedStatus = "unselected-button";
        if ((this.props.activeRoom === this.props.roomName) && (!this.props.creatingRoom)) {
            selectedStatus = "selected-button";
        }
        let classes = `${selectedStatus}`
        return (
            <div className={classes} onClick={(e) => this.handleClick(e)}>
                {this.props.roomName}
            </div>
        );
    }
}

export class AddRoomButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onAddRoomButtonClick();
    }

    render() {
        let selectedStatus = "";

        if (this.props.creatingRoom) {
            selectedStatus = "selected-add-room-button";
        }
        let classes = `${selectedStatus}`

        return (
            <div className={classes + " " + "room-menu-button"} onClick={(e) => this.handleClick(e)}>
                <FontAwesomeIcon className="plus-icon" icon="plus" />
            </div>
        );
    }
}

export class MessageContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { emojiMap: this.generateEmojiMap() };
    }
    /**
     * Probably a good idea to copy verbatim the discord emoji shortcuts because it is familiar with our target audience
     */
    generateEmojiMap() {
        var map = new Map();
        map.set('dog', String.fromCodePoint(0x1F436));
        map.set('smile', String.fromCodePoint(0x1F600));
        map.set('laugh', String.fromCodePoint(0x1F602));
        map.set('wink', String.fromCodePoint(0x1F609));
        map.set('sad', String.fromCodePoint(0x1F613));
        map.set('cheeky', String.fromCodePoint(0x1F61B));
        map.set('poo', String.fromCodePoint(0x1F4A9));
        map.set('water', String.fromCodePoint(0x1F4A6));
        map.set('cat', String.fromCodePoint(0x1F431));
        map.set('chick', String.fromCodePoint(0x1F425));
        return map
    }

    //Helper method for render to render every value in the messages list
    renderMessages() {
        return this.props.messageHistory.map(message => {
            return <Message
                key={message.date}
                user={message.user.toString()}
                date={message.date.toString()}
                message={message.message.toString()}
                map={this.state.emojiMap}
            />
        });
    }

    renderTemp() {
        if (this.props.lastMessage !== null) {
            return <div className="temporary-message">
                <Message
                    key={this.props.lastMessage.date}
                    user={this.props.lastMessage.user.toString()}
                    date={this.props.lastMessage.date.toString()}
                    message={this.props.lastMessage.message.toString()}
                    map={this.generateEmojiMap()}
                />
                <div>
                    <img className="sending-message" src="https://drive.google.com/uc?id=1V5tY3mtS2cQh6Zr-z9NdpAXDTUBAyCAt"/>
                    <p className="icon-caption">Sending message...</p>
                </div>
            </div>
        }
    }

    render() {
        return (
            <div className="message-container">
                {this.renderMessages()}
                {this.renderTemp()}
            </div>
        );
    }
}