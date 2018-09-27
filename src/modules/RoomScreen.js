import React, { Component } from 'react'
import { ChatBox } from './ChatBox'
import { Message } from './Message'

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
    activateRoom(roomName) {
        this.props.onRoomButtonClick(roomName);
    }
    render() {
        return (
            <div className="room-nav text-unselectable">
                <RoomButton roomName="Block Net"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Programming"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Gaming"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Work"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Lifestyle"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 1"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 2"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 3"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 4"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 5"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 6"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 7"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 8"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 9"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 10"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 11"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 12"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 13"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
                <RoomButton roomName="Room 14"
                    onRoomButtonClick={this.activateRoom}
                    activeRoom={this.props.activeRoom} />
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
        let selectedStatus = "unselected-room-button";
        //console.log("this: " + this.props.roomName + "| active: " + this.props.activeRoom)
        if (this.props.activeRoom === this.props.roomName) {
            selectedStatus = "selected-room-button";
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
    //Helper method for render to render every value in the messages list
    renderMessages() {
        return this.props.messageHistory.map(message => {
            //return <Message key={message.key} msg={message.data}/>
            return <Message
                key={message.date}
                user={message.user.toString()}
                date={message.date.toString()}
                message={message.message.toString()}
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