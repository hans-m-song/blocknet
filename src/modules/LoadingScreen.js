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
            <LoginScreen />
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
                        text={"Log in using Meta Mask"}
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
                <div className="login-input-container">
                    <LoginUserInput 
                        selectedOption={this.state.selectedLogin}
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

export class LoginUserInput extends Component {
    constructor(props) {
        super(props);
    }

    anonInput() {
        return(
            <div>
                <div className="login-explanation"></div>
                <form className="login-form">
                    <input type="submit" value="Enter" name="submit"></input>
                </form>
            </div>
        );
    }

    metamaskInput() {
        return(
            <div>
                <div className="login-explanation">yo</div>
                <form>
                    <input type="submit" value="Check for Meta Mask" name="submit"></input>
                </form>
            </div>
        );
    }

    mnemonicInput() {
        return(
            <form className="login-form">
                <textarea
                    rows="3"
                    cols="40"
                    placeholder="Enter your twelve word mnemonic..."
                /><br/>
                <input type="submit" value="Log in" name="submit"></input>
            </form>
        );
    }

    render() {
        switch (this.props.selectedOption) {
            case "anon":
                return (this.anonInput());
            case "metamask":
                return (this.metamaskInput());
            case "mnemonic":
                return (this.mnemonicInput());
        }
    }
}