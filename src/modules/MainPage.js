import React, { Component } from 'react'
import { RoomScreen } from './RoomScreen'
import { PrivateMessagesScreen } from './PrivateMessagesScreen'
import { SettingsScreen } from './SettingsScreen'
import { ConsoleScreen } from './ConsoleScreen'
import InactiveLogo from '../console_inactive.png'
import ActiveLogo from '../console_active.png'


/********** Main Screen and Panels ************/
/*Header navigation bar*/
export class Header extends Component {
    constructor(props) {
        super(props);
        this.claimTokens = this.claimTokens.bind(this);
        this.consoleClick = this.consoleClick.bind(this);
    }

    consoleClick() {
        this.props.consoleClick();
    }

    claimTokens() {
        this.props.claimTokens();
    }

    render() {
        return (
            <div className="header">
                <h1 className="title text-unselectable hover-cursor">BLOCK NET >></h1>
                <ConsoleHeaderButton 
                    active={this.props.consoleActive}
                    consoleClick={this.props.consoleClick}
                />
            </div>
        );
    }
}

/**
 * Console header button
 */
export class ConsoleHeaderButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.consoleClick.bind(this);
        this.state = { active: this.props.active };
    }

    consoleClick() {
        this.props.consoleClick();
    }

    render() {
        let classes;
        let logo;
        if (this.props.active) {
            classes = `console-header-button-active`;
            logo = ActiveLogo;
        } else {
            classes = `console-header-button-inactive`;
            logo = InactiveLogo;
        }

        return (
            <div className={classes} onClick={(e) => this.consoleClick(e)}>
                <img src={logo} height="45" width="45" />
            </div>
        );
    }
}

/**
 * Token balance
 */
export class TokenManager extends Component {
    constructor(props) {
        super(props);
        this.claimTokens = this.claimTokens.bind(this);
    }

    claimTokens() {
        this.props.claimTokens();
    }

    refreshBalance(e) {
        e.preventDefault();
        this.forceUpdate();
    }

    render() {
        return (
            <div className="token-manager">
                <p className="token-balance">Balance: {this.props.state.balance}</p>
                <button onClick={this.claimTokens}>Claim Tokens</button>
                <button onClick={(e) => { this.refreshBalance(e) }}>Refresh</button>
            </div>
        );
    }
}

/**
 * Page body High level elements of the page body, i.e. the left and right panels and selected content.
 */
export class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = { activeSection: "Rooms" };
        this.activateSection = this.activateSection.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.currentState = this.props.currentState;
    }

    activateSection(sectionName) {
        this.setState({ activeSection: sectionName });
    }

    sendMessage(message) {
        this.props.sendMessage(message);
    }
    dequeueMessage() {
        this.props.dequeueMessage();
    }

    render() {
        return (
            <div className="main-page">
                <div className="main-screen">
                    <LeftPanel onSectionClick={this.activateSection} activeSection={this.state.activeSection} />
                    <Content
                        rooms={this.props.rooms}
                        section={this.state.activeSection}
                        sendMessage={this.sendMessage}
                        setRoom={this.props.setRoom}
                        messageHistory={this.props.messageHistory}
                        currentState={this.currentState}
                        addRoom={this.props.addRoom}
                    />
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
                <div className="sections">
                    <SectionButton sectionName="Rooms"
                        onSectionClick={this.activateSection}
                        activeSection={this.props.activeSection} />
                    <SectionButton sectionName="Messages"
                        onSectionClick={this.activateSection}
                        activeSection={this.props.activeSection} />
                    <SectionButton sectionName="Settings"
                        onSectionClick={this.activateSection}
                        activeSection={this.props.activeSection} />
                </div>
            </div>
        )
    }
}

/**
 * Button in side panel that routes to the main sections of the site
 */
export class SectionButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log(this.props.sectionName + " was clicked.")
        this.props.onSectionClick(this.props.sectionName);
    }
    render() {
        let selectedStatus = "unselected-section";
        //console.log("active: {" + this.props.activeSection + "}| this: {" + this.props.sectionName + "}");
        if (this.props.activeSection === this.props.sectionName) {
            selectedStatus = "selected-section";
        }
        var classes = `${selectedStatus} section-button text-unselectable`;

        return (
            <div className={classes} onClick={(e) => this.handleClick(e)}>
                {this.props.sectionName}
            </div>
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
        this.sendMessage = this.sendMessage.bind(this);
        this.currentState = this.props.currentState;
    }

    sendMessage(message) {
        this.props.sendMessage(message);
    }

    render() {
        switch (this.props.section) {
            case "Rooms":
                return (
                    <RoomScreen
                        rooms={this.props.rooms}
                        sendMessage={this.sendMessage}
                        messageHistory={this.props.messageHistory}
                        setRoom={this.props.setRoom}
                        addRoom={this.props.addRoom}
                    />
                );
            case "Messages":
                return (
                    <PrivateMessagesScreen />
                );
            case "Settings":
                return (
                    <SettingsScreen />
                );
            case "Console":
                return (
                    <div className="content">
                        <ConsoleScreen 
                            currentState={this.currentState}
                        />
                    </div>
                );
        }
    }
}