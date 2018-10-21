import React, { Component } from 'react'
import Invite from './Invite.js';
import './Invite.css';
/*
 * Renders the header of the message, containing the username
 * and sent time, and the content, which contains the actual message
 */
export class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {message: this.renderEmoji()};
    }

    componentDidMount() {
        var messageContainer = document.getElementsByClassName("message-container");
        messageContainer[0].scrollTop = messageContainer[0].scrollHeight;
    }

    /*Text within two "::" (i.e. ::smile::) will be swapped with emoji if a correct emoji code is given*/
    renderEmoji() {
        let emoji = "";
        let code = "::";
        let startIndex = -1;
        let endIndex = -1;
        let userString = this.props.message;
        let emojiString = "";
        for (let i=0; i<userString.length; i++) {
            if ((userString[i] === code[0]) && (userString[i+1] === code[1])) {
                if (startIndex === -1) {
                    startIndex = i;
                } else {
                    endIndex = i+code.length;
                    emojiString = userString.substring(startIndex+code.length, i); //endIndex-code.length
                    emoji = this.props.map.get(emojiString);
                    if (emoji !== undefined) {
                        userString = (userString.substring(0, startIndex)) + emoji + (userString.substring(endIndex, userString.length));
                        i = i-(endIndex-startIndex);
                    }
                    startIndex = -1;
                    endIndex = -1;
                }
            }
        }
        return userString;
    }
    //let emojiString = userString.substring(0, startIndex) + emoji + (userString.substring(endIndex, userString.length));
    
    render() {
        return (
            <div className="message">
                <MessageHeader
                    user={this.props.user.toString()}
                    date={this.props.date.toString()}
                />
            <MessageContent message={this.state.message} />
            </div>
        );
    }
}

/*
 * Contains the invitation menu
 */
export class MessageHeader extends Component {
    render() {
        return (
            <div className="message-header">
                <div className="composer">
				      <ul>
						<Invite  className="message-username message-time hover-cursor inner-invite-menu" 
						name={this.props.user} 
						items={[' Invite to private chat', 'Invite someone to this room', 'Mute']}
						/>

					  </ul>

                    
                </div>
	
                <h3 className="message-time hover-cursor">{this.props.date}</h3>
            </div>
        );
    }
}


/*
 * Contains the text for the messages
 */
export class MessageContent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <p className="message-content hover-cursor">
                {this.props.message}
            </p>
        );
    }
}