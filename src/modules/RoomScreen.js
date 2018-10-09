import React, { Component } from 'react'
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
        this.state = {
            lastMessage: '',
            activeRoom: "Block Net"
        };
        this.updateMessage = this.updateMessage.bind(this);
        this.activateRoom = this.activateRoom.bind(this);
    };

    /*This is the point where we will want to give the to-be-activated room name to the backend for it to send back messages*/
    activateRoom(roomName) {
        this.setState({ activeRoom: roomName });
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
        return (
            <div className="content room-screen">
                <RoomNav onRoomButtonClick={this.activateRoom}
                    rooms={this.props.rooms}
                    activeRoom={this.state.activeRoom} />
                <MessageContainer
                    ref={this.child}
                    messageHistory={this.props.messageHistory}
                />
                <ChatBox updateMessage={(e) => this.updateMessage(e)} />
            </div>
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
    }

    /*Converts array of room names passed down as prop from backend into corresponding buttons in room nav menu*/
    roomList() {
        let roomButtons = (this.props.rooms).map((room) =>
            <RoomButton
                key={room} //this makes the assumption that no rooms will have the identical name
                roomName={room}
                onRoomButtonClick={this.activateRoom}
                activeRoom={this.props.activeRoom}
            />    
        );
        return (
            roomButtons
        );
    }

    activateRoom(roomName) {
        this.props.onRoomButtonClick(roomName);
    }

   render() {
        return (
            <div className="room-menu">
                <div className="room-nav text-unselectable">
                    {this.roomList()}
                </div>
                <div className="room-menu-button">
                    <FontAwesomeIcon className="plus-icon" icon="plus" />
                </div>
            </div>
        );
    }
}

export class addRoom extends Component {
    render() {
        return (
            <div className="add-room-button">
                
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
        this.props.onRoomButtonClick(this.props.roomName)
    }
    render() {
        let selectedStatus = "unselected-button";
        //console.log("this: " + this.props.roomName + "| active: " + this.props.activeRoom)
        if (this.props.activeRoom === this.props.roomName) {
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

export class MessageContainer extends Component {
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
                map={this.generateEmojiMap()}
            />
        });
    }

    render() {
        return (
            <div className="message-container">
                {this.renderMessages()}
            </div>
        );
    }
}