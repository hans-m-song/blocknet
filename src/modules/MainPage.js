import React, { Component } from 'react'
import { RoomScreen } from './RoomScreen'
import { PrivateMessagesScreen } from './PrivateMessagesScreen'
import { SettingsScreen } from './SettingsScreen'
import { ConsoleScreen } from './ConsoleScreen'
import * as THREE from 'three'

/********** Main Screen and Panels ************/
/*Header navigation bar*/
export class Header extends Component {
    constructor(props) {
        super(props);
        this.claimTokens = this.claimTokens.bind(this);
    }

    claimTokens() {
        this.props.claimTokens();
    }
    render() {
        return (
            <div className="header">
                <h1 className="title text-unselectable hover-cursor">BLOCK NET >></h1>
                <ThreeScene/>
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

    /*
    render() {
        return (
            <div className="header">
                <h1 className="title text-unselectable hover-cursor">BLOCK NET >></h1>
                <TokenManager claimTokens={this.claimTokens} state={this.props.state} />
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
    */
}

export class ThreeScene extends Component{
    componentDidMount(){
      const width = 50
      const height = 50
  
      //ADD SCENE
      this.scene = new THREE.Scene()
  
      //ADD CAMERA
      this.camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      )
      this.camera.position.z = 1.7
  
      //ADD RENDERER
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setClearColor('#000000')
      this.renderer.setSize(width, height)
      this.mount.appendChild(this.renderer.domElement)
  
      //ADD CUBE
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: '#ffffff'     })
      this.cube = new THREE.Mesh(geometry, material)
      this.scene.add(this.cube)
  
  this.start()
    }
  
  componentWillUnmount(){
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }
  
  start = () => {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate)
      }
    }
  
  stop = () => {
      cancelAnimationFrame(this.frameId)
    }
  
  animate = () => {
     this.cube.rotation.x += 0.01
     this.cube.rotation.y += 0.01
  
     this.renderScene()
     this.frameId = window.requestAnimationFrame(this.animate)
   }
  
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  
  render(){
      return(
        <div
          style={{ width: '50px', height: '50px' }}
          ref={(mount) => { this.mount = mount }}
        />
      )
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
                        section={this.state.activeSection}
                        sendMessage={this.sendMessage}
                        messageHistory={this.props.messageHistory}
                        currentState={this.currentState}
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
                    <SectionButton sectionName="Console"
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
                        sendMessage={this.sendMessage}
                        messageHistory={this.props.messageHistory}
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
                    <div class="content">
                        <ConsoleScreen 
                            currentState={this.currentState}
                        />
                    </div>
                );
        }
    }
}