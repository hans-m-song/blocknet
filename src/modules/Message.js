import React, { Component } from 'react'

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

    renderEmoji() {
        let emoji = "";
        let code = "~!";
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
                    emojiString = userString.substring(startIndex+code.length, endIndex-code.length);
                    emoji = this.props.map.get(emojiString);
                    userString = (userString.substring(0, startIndex)) + emoji + (userString.substring(endIndex, userString.length));
                    i = i-(endIndex-startIndex);
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

export class Menu extends Component {
    constructor() {
        super();

        this.state = {

            showMenu: false,
        };

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    showMenu(event) {
        event.preventDefault();

        this.setState({ showMenu: true }, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu(event) {

        if (!this.dropdownMenu.contains(event.target)) {

            this.setState({ showMenu: false }, () => {
                document.removeEventListener('click', this.closeMenu);
            });

        }
    }
}

export class MessageHeader extends Menu {
    render() {
        return (
            <div className="message-header">
                <div className="composer" onClick={this.showMenu}>
                    <h3 className="message-username hover-hand hover-cursor">{this.props.user}</h3>
                    {/* <!-- <button className="invite-button hover-cursor"> Invite </button> -->*/}

                    <div className="invite-menu hover-hand hover-cursor">

                        {
                            this.state.showMenu
                                ? (
                                    <div

                                        ref={(element) => {
                                            this.dropdownMenu = element;
                                        }}
                                    >
                                        <button className="inner-invite-menu" n> Invite to private chat  </button>
                                        <button className="inner-invite-menu"> Invite Someone to this room </button>
                                        <button className="inner-invite-menu"> Mute  </button>
                                    </div>
                                )
                                : (
                                    null
                                )
                        }
                    </div>
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