import React, { Component } from 'react'
import Chart from 'chart.js'

/**
 * Console
 */
export class ConsoleScreen extends Component {
    constructor(props) {
        super(props);
        this.currentState = this.props.currentState;
        this.activateSection = this.activateSection.bind(this);
        this.state = {activeSection: "Log"};
    }

    activateSection(section) {
        this.setState({ activeSection: section});
        console.log("clicked a console nav button");
    }

    render() {
        let classes;
        if (this.props.consoleActive) {
            classes = `console console-active`;
        } else {
            classes = `console console-inactive`;
        }

        return (
            <div className={classes}>
                <ConsoleNav 
                    activeSection={this.state.activeSection}
                    activateSection={this.activateSection}
                />
                <ConsoleContent 
                    currentState={this.currentState}
                    activateSection={this.activateSection}
                    activeSection={this.state.activeSection}
                />
            </div>
        );
    }
}

/*
 * Nav menu for console sections (properties, network, log)
 */
export class ConsoleNav extends Component {
    constructor(props) {
        super(props);
        this.activateSection = this.activateSection.bind(this);
    }
    activateSection(sectionName) {
        this.props.activateSection(sectionName);
    }
    render() {

        return (
            <div className="console-nav">
                <ConsoleNavButton 
                    sectionName="Log" 
                    activateSection={this.props.activateSection}
                    activeSection={this.props.activeSection}
                />
                <ConsoleNavButton 
                    sectionName="Properties"
                    activateSection={this.props.activateSection}
                    activeSection={this.props.activeSection}
                />
                <ConsoleNavButton 
                    sectionName="Network"
                    activateSection={this.props.activateSection}
                    activeSection={this.props.activeSection}
                />
            </div>
        )
    }
}

class ConsoleNavButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.activateSection(this.props.sectionName);
    }

    render() {
        let classes;
        if (this.props.activeSection === this.props.sectionName) {
            classes = `unselected-button`;
        } else {
            classes = `selected-button`;
        }

        return (
            <div className={classes} onClick={(e) => this.handleClick(e)}>
                {this.props.sectionName}
            </div>
        );
    }
}

class ConsoleContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        switch (this.props.activeSection) {
            case "Log":
                return (
                    <ConsoleLog />
                );

            case "Properties":
                return(
                    <Properties
                    currentState={this.currentState}
                />
                );

            case "Network":
                return (
                    <MessageGraph />
                );
            default:
                return(
                    <div>Something went wrong!</div>
                );
        }
    }


}
    

export class Properties extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.currentState;
    }

    /*
    render() {
        return (
            <div className="properties">
                <div className="properties-title">
                    <h4> Properties </h4>
                </div>
                <div className="properties-content">
                <p>account address: {this.state.accounts[this.state.selectedAccountIndex]}</p>
                    <p>local ipfs hash: {this.state.ipfsHash}}</p>
                    <p>claimableTokens: {this.state.claimableTokens}</p>
                    <p>latestBlockNo: {this.state.latestBlockNo}</p>
                    <p>tokensPerMessage: {this.state.tokensPermessage}</p>
                    <p>dailyTokensNo: {this.state.dailyTokensNo}</p>
                    <p>blocksPerClaim: {this.state.blocksPerClaim}</p>
                </div>
            </div>
        );
    }
    */

   render() {
    return (
        <div className="properties">
            <div className="properties-content">
            <p>account address: </p>
                <p>local ipfs hash: </p>
                <p>claimableTokens: </p>
                <p>latestBlockNo: </p>
                <p>tokensPerMessage: </p>
                <p>dailyTokensNo: </p>
                <p>blocksPerClaim: </p>
            </div>
        </div>
    );
}
}

export class MessageGraph extends Component {
    constructor(props) {
        super(props);
        Chart.defaults.global.responsive = true;
        Chart.defaults.global.scaleStartValue = 0;
        this.state = {
            LineChart: require("react-chartjs").Line,
            data: {
                labels: ["2am", "4am", "6am", "8am", "10am",
                    "12pm", "2pm"],
                datasets: [
                    {
                        label: "Messages",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        //Create random data to fill graph
                        data: this.rand(100, 300, 7),
                    },
                ]
            },
            options: {
                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: true,
                //String - Colour of the grid lines
                scaleGridLineColor: "rgba(255,0,0,0.5)",
                //Number - Width of the grid lines
                scaleGridLineWidth: 1,
            }
        }

    }

    //Placeholder to create random data
    rand(min, max, num) {
        var rtn = [];
        while (rtn.length < num) {
            rtn.push(Math.round((Math.random() * (max - min)) + min));
        }
        return rtn;
    }

    render() {
        return (
            <div className = "graphbox">
                <div className="graph-title">
                    <h2> #No. of Messages sent in last 12 Hours </h2>
                </div>
                <this.state.LineChart
                    className="linegraph"
                    data={this.state.data}
                    options={this.state.options}
                />
            </div>
        );
    }
}

export class ConsoleLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="consolelog">
                <div className="consolelog-content">
                    <p>>Loading Components...</p>
                    <p>>Using address >> 0x6c568c66b75259fa8b47853cD56aF396b728FBE5</p>
                    <p>>Metamask acount loaded...</p>
                    <p>>Connection to Rinkeby Test Network established</p>
                    <p>>IPFS initialized >> Using IPFS local hash QmT4owZoqCLUMyai8qGtAKFYbEjg1su3KfvzqoE8vkDy9U</p>
                    <p>>Updating Blockchain... Receiving latest messages</p>
                    <p>>Block #3021383, Block #3021384 downladed</p>
                    <p>>Blockchain verified...</p>
                    <p>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>></p>
                    <p>>Block #3021384 has been verified by ethereum network</p>
                    <p>>Client transmitting message to block #3021385</p>
                    <p>>Block #3021385 currently 50% full</p>
                    <p>>Expected wait time till message is sent ~2 minutes</p>
                    <p>></p>
                    <p>></p>
                    <p>></p>
                    <p>></p>
                    <p>></p>
                    <p>></p>
                </div>
            </div>
        );
    }
}