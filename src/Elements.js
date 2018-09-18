import React, { Component } from 'react'
import PerfectScrollbar from 'perfect-scrollbar'

/********** Main Screen and Panels ************/

/*Header navigation bar*/
export class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1 className="title text-unselectable hover-cursor">BLOCK NET >></h1>
        <nav className="header-nav">
          <div>
            <a href="#">Dev Blog</a>
          </div>
          <div>
            <a href="#">About Us</a>
          </div>
        </nav>
      </div>
    );
  }
}

/*Page body High level elements of the page body, including:
    - Left panel
    - Content body
    - Right panel
*/
export class MainPage extends Component {
  constructor(props) {
    super(props);
    this.activateSection = this.activateSection.bind(this);
    this.state = { activeSection: "Rooms" };
  }
  activateSection(sectionName) {
    this.setState({ activeSection: sectionName });
  }
  render() {
    return (
      <div className="main-page">
        <div className="main-screen">
          <LeftPanel onSectionClick={this.activateSection} activeSection={this.state.activeSection} />
          <Content section={this.state.activeSection} />
          <RightPanel />
        </div>
      </div>
    );
  }
}

/*Left panel containing sections for main sections of application*/
export class LeftPanel extends Component {
  constructor(props) {
    super(props);
    this.activateSection = this.activateSection.bind(this);
  }
  activateSection(sectionName) {
    this.props.onSectionClick(sectionName);
  }
  render() {
    return (
      <div className="left-panel">
        <SectionButton sectionName="Rooms" onSectionClick={this.activateSection} activeSection={this.props.activeSection} />
        <SectionButton sectionName="Messages" onSectionClick={this.activateSection} activeSection={this.props.activeSection} />
        <SectionButton sectionName="History" onSectionClick={this.activateSection} activeSection={this.props.activeSection} />
        <SectionButton sectionName="Settings" onSectionClick={this.activateSection} activeSection={this.props.activeSection} />
      </div>
    )
  }
  //<SectionButton sectionName="Invitates" onSectionClick={this.activateSection} activeSection={this.props.activeSection}/>

}

/*Button that links to the main sections of the site*/
export class SectionButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.prop
  }
  handleClick() {
    console.log(this.props.sectionName + " was clicked.")
    this.props.onSectionClick(this.props.sectionName);
  }
  render() {
    let selectedStatus = "unselected";
    //console.log("active: {" + this.props.activeSection + "}| this: {" + this.props.sectionName + "}");
    if (this.props.activeSection === this.props.sectionName) {
      selectedStatus = "selected";
    }
    var classes = `${selectedStatus} section-button text-unselectable`;

    return (
      <div className={classes} onClick={(e) => this.handleClick(e)}>{this.props.sectionName}</div>
    );
  }
}

/*Right panel, for stylistic purposes (acting as a border for now)
    -content: unsure for now, icons could potentially be added
*/
export class RightPanel extends Component {
  render() {
    return (
      <div className="right-panel">

      </div>
    )
  }
}

/**
 * Rooms and Messages
 * */
export class Content extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    switch (this.props.section) {
      case "Rooms":
        return (
          <RoomScreen />
        );
      case "Messages":
        return (
          <div className="content">
            <PrivateChatsScreen />
          </div>
        );
      case "History":
        return (
          <div className="content">
            <HistoryScreen />
          </div>
        );
      case "Settings":
        return (
          <div className="content">
            <SettingsScreen />
          </div>
        );
      case "Invitates":
        return (<InvitationScreen />);
    }
  }
}

/*
 * The main component for storing the components for a room
 */
export class RoomScreen extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      lastMessage: ''
    };

    this.updateMessage = this.updateMessage.bind(this);
  };

  //Calls the addMessage function from MessageContainer
  updateMessage(msg) {
    this.setState({ lastMessage: msg });
    this.child.current.addMessage(msg);
  }

  //Bind message container to this.child so that the addMessage
  //function from MessageContainer can be accessed in updateMessage()
  render() {
    return (
      <div className="room-screen">
        <div className="room-nav">
          <ul>
            <li><a href="#room1">Room 1</a></li>
            <li><a href="#room2">Room 2</a></li>
            <li><a href="#room3">Room 3</a></li>
            <li><a href="#room4">Room 4</a></li>
            <li><a href="#room5">Room 5</a></li>
          </ul>
        </div>
        <MessageContainer ref={this.child} />
        <ChatBox updateMessage={(e)=>this.updateMessage(e)} />
      </div>
    );
  }
}

/*
 * Contains all the messages
 */
export class MessageContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: []
    };

    this.addMessage = this.addMessage.bind(this);
  };

  componentDidMount() {
    const container = document.querySelector('.scroll-container');
    const scrollbar = new PerfectScrollbar(container, {
      wheelSpeed: 2,
      wheelPropagation: true,

    });
  }

  //Create a new variable containing the message and a unique key
  //and add it to the messages list
  addMessage(message) {
    var newMessage = {
      data: message,
      key: Date.now()
    };

    this.setState((prevState) => {
      return {
        messages: prevState.messages.concat(newMessage)
      };
    });
  }

  //Helper method for render to render every value in the messages list
  renderMessages() {
    return this.state.messages.map(message => {
      return <Message key={message.key} msg={message.data}/>
    });
  }

  render() {
    return (
      <div className="scroll-container">
        <div className="message-container">
          {this.renderMessages()}
        </div>
      </div>

    );
  }
}

/*
 * Renders the header of the message, containing the username
 * and sent time, and the content, which contains the actual message
 */
export class Message extends Component {
  constructor(props){
    super(props);

    console.log(this.props)
  };

  render() {
    return (
      <div className="message">
        <MessageHeader />
        <MessageContent msg={this.props.msg} />
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
          <h3 className="message-username hover-hand hover-cursor"> #123321</h3>
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
        <h3 className="message-time hover-cursor">Jan 1, 12:33 PM</h3>
      </div>
    );
  }
}

/*
 * Contains the text for the messages
 */
export class MessageContent extends Component {
  constructor(props){
    super(props);
  };

  render() {
    console.log(this.props);
    return (
      <p className="message-content hover-cursor">
        {this.props.msg}
      </p>
    );
  }
}

/*
 * ChatBox for typing and sending message
 */
export class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Update value when ever it is changed in the textarea
  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  //Send message to the parent component, RoomScreen, and reset value to ''
  handleSubmit(e) {
    e.preventDefault();
    var thisMessage = this.state.value;
    this.props.updateMessage(thisMessage);
    this.setState({ value: '' });
  }

  render() {
    return (
      <div className="chat-box">
        <form onSubmit={(e)=>this.handleSubmit(e)}>
          <textarea cols="1" placeholder="Enter message..."
            value={this.state.value}
            onChange={this.handleChange} />
          <input className="chat-box-send" type="submit" value="Send" />
        </form>
      </div>
    );
  }
}

/*Draggable sliding panel for console. Need to find out how to be implement*/
/*
export class Message extends Component {
    render() {
        return (
            
        );
    }
}*/

/**
 * Private Messages
 */
export class PrivateChatsScreen extends Component {
  render() {
    return (
      <div className="private-messages-screen">
        <p>Private messaging is a work in progress.</p>
      </div>
    );
  }
}

/**
 * History
 */
export class HistoryScreen extends Component {
  render() {
    return (
      <div className="history-screen">
        <p>History is a work in progress.</p>
      </div>
    );
  }
}

/**
 * Settings
 */
export class SettingsScreen extends Component {
  render() {
    return (
      <div className="settings-screen content">
        <p>Settings is a work in progress.</p>
      </div>
    );
  }
}

/**
 * Invitation Screen
 */
export class InvitationScreen extends Component {
  render() {
    return (
      <div className="content">

      </div>
    );
  }
}
/**
 * Console
 */
export class Console extends Component {
  render() {
    return (
      <div className="console">
        <div className="console-header">
          <p>Console</p>
        </div>
        <div className="console-content">
          Console content goes here.
        </div>
      </div>
    );
  }
}