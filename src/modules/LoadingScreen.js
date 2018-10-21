import React, { Component } from 'react'

/**
 * LoginScreen
 */
export class LoadingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedLogin: "anon" };
    }

    render() {
        return (
            <LoginScreen 
                handleLogin={this.props.handleLogin}
            />
        );
    }
}

export class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedLogin: "anon" }; 
        this.onLoginOptionClick = this.onLoginOptionClick.bind(this);
    }

    onLoginOptionClick(id) {
        this.setState({ selectedLogin: id });

    }

    render() {
        return (
            <div className="login-screen popup">
                <div className="login-top">
                    <div>
                        <h1 className="title text-unselectable hover-cursor">BLOCK NET >></h1>
                    </div>
                    <div className="login-option-selection">
                        <LoginOption 
                            text={"Log in as anonymous"}
                            id={"anon"}
                            selectedOption={this.state.selectedLogin}
                            onLoginOptionClick={this.onLoginOptionClick}
                        />
                        <LoginOption 
                            text={"Log in using MetaMask"}
                            id={"metamask"}
                            selectedOption={this.state.selectedLogin}
                            onLoginOptionClick={this.onLoginOptionClick}
                        />
                        <LoginOption 
                            text={"Log in with mnemonic"}
                            id={"mnemonic"}
                            selectedOption={this.state.selectedLogin}
                            onLoginOptionClick={this.onLoginOptionClick}
                        />
                    </div>
                </div>
                <div className="login-help-container">
                    <LoginOptionHelp 
                        selectedOption={this.state.selectedLogin}
                    />
                </div>
                <div className="login-input-container">
                    <LoginUserInput 
                        selectedOption={this.state.selectedLogin}
                        handleLogin={this.props.handleLogin}
                    />
                </div>
            </div>
        );
    }
}

//props: text, id, function, selected-status
export class LoginOption extends Component {
    handleClick() {
        this.props.onLoginOptionClick(this.props.id);
    }

    render() {
        let selectedStatus = "";
        if (this.props.id === this.props.selectedOption) {
            selectedStatus = "selected-login-option ";
        }
        let classes = `${selectedStatus + "login-option cursor-invert"}`
        return (            
            <div className={classes} onClick={(e) => this.handleClick(e)}>
                {this.props.text}
            </div>
        );
    }
}

export class LoginOptionHelp extends Component {
    anonHelp() {
        return (
            <div className="login-explanation">
                <p>Logging in as anonymous: </p>
                <ul>
                    <li>Allows you to interact with the community as "anon"</li>
                    <li>Doesn't allow you to save your settings and favourite rooms</li>
                    <li>Is a great way to get started with the Block Net community</li>
                </ul>
            </div>
        );
    }

    metamaskHelp() {
        return (
            <div className="login-explanation">
                <p>Logging in with MetaMask: </p>
                <ul>
                    <li>Allows you to save personal settings and favourite rooms</li>
                    <li>Requires a MetaMask account and browser extension</li>
                    <li>Visit <a href="https://metamask.io/" target="_blank">MetaMask</a> for how to get started with MetaMask</li>
                </ul>
            </div>
        );
    }

    mnemonicHelp() {
        return (
            <div className="login-explanation">
                <p>Logging in with mnemonic: </p>
                <ul>
                    <li>Allows you to save personal settings and favourite rooms</li>
                    <li>Requires an existing cryptocurrency wallet and associated twelve word mnemonic</li>
                    <li><a href="https://medium.com/swlh/ico-help-how-to-create-your-ethereum-wallet-4a78c1ef9022" target="_blank">How to get started</a> with your own wallet</li>
                </ul>
            </div>
        );
    }

    render() {
        switch (this.props.selectedOption) {
            case "anon":
                return (this.anonHelp());
            case "metamask":
                return (this.metamaskHelp());
            case "mnemonic":
                return (this.mnemonicHelp());
        }
    }
}

export class LoginUserInput extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        switch (this.props.selectedOption) {
            case "anon":
                this.props.handleLogin("default");
                break;
            case "metamask":
                this.props.handleLogin("metamask");
                break
            case "mnemonic":
                //console.log(this.state.mnemonic);
                if(this.state.mnemonic === undefined) {

                    break;
                }
                this.props.handleLogin("mnemonic", this.state.mnemonic);
                break;
        }
    }

    updateInput(event) {
        event.preventDefault();
        this.setState({mnemonic : event.target.value});
    }

    anonInput() {
        return(
            <input type="submit" value="Enter" name="submit"></input>
        );
    }

    metamaskInput() {
        return(
            <input type="submit" value="Check for MetaMask" name="submit"></input>
        );
    }

    mnemonicInput() {
        return(
            <div>
                <textarea
                    rows="3"
                    cols="40"
                    placeholder="Enter your twelve word mnemonic..."
                    onChange={this.updateInput}
                /><br/>
                <input type="submit" value="Log in" name="submit"></input>
            </div>
        );
    }

    render() {
        switch (this.props.selectedOption) {
            case "anon":
                return (
                    <form className="login-form" onSubmit={this.handleSubmit}>
                        {this.anonInput()}
                    </form>  
                );
            case "metamask":
                return (
                    <form className="login-form" onSubmit={this.handleSubmit}>
                        {this.metamaskInput()}
                    </form>
                );
            case "mnemonic":
                return (
                    <form className="login-form" onSubmit={this.handleSubmit}>
                        {this.mnemonicInput()}
                    </form>
                );
        }
    }
}