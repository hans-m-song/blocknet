import React, { Component } from 'react'

/*
 * Renders the header of the message, containing the username
 * and sent time, and the content, which contains the actual message
 */
export class Message extends Component {
    componentDidMount() {
        var messageContainer = document.getElementsByClassName("message-container");
        messageContainer[0].scrollTop = messageContainer[0].scrollHeight;
    }

    render() {
        return (
            <div className="message">
                <MessageHeader
                    user={this.props.user.toString()}
                    date={this.props.date.toString()}
                />
            <MessageContent message={this.props.message.toString()} />
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