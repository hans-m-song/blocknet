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
                    backendLog={this.props.backendLog}
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
                    <ConsoleLog 
                        backendLog={this.props.backendLog}
                    />
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

   render() {
    return (
        <div className="properties console-content-section">
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
            <div className = "graphbox console-content-section">
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

/**
 * Log is the log of actions that the application has performed
 *      -props.backendLog is an array that contains a log object describing the time the log was made (log.time) in 24hr time and the message to be rendered (log.message)
 */
export class ConsoleLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    renderLog() {
        let consoleParagraphs = this.props.backendLog.map((log) =>
            <LogParagraph
                time={log.time}
                message={log.message}
                waiting={log.waiting}
            />
        );
        return (
            consoleParagraphs
        );
    }

    render() {
        return (
            <div className="consolelog console-content-section">
                <div className="consolelog-content">
                    {this.renderLog()}
                </div>
            </div>
        );
    }
}


export class LogParagraph extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.message + " | " + this.props.waiting);
    }

    render() {
        return (
            <div>
                <p>
                    <span className="log-time"> {this.props.time}</span>
                    <span className="log-divider"> </span>
                    <span className="log-message">{this.props.message}</span>
                    {this.props.waiting && 
                        <WaitingAnimation />
                    }
                </p>
            </div>
        )
    }
}

export class WaitingAnimation extends Component {
    constructor(props) {
        super(props)
        this.frames = ['|', '/', '-', '\\'];
        this.state = {currentFrame: ''}
        this.index = 0;
    }

    componentDidMount() {
       this.animateID = setInterval(
           () => this.animate(),
           100
       );
    }

    animate() {
        this.setState({ currentFrame: this.frames[this.index] });
        (this.index === this.frames.length-1) ? this.index=0 : this.index++;
    }

    componentWillUnmount() {
        clearInterval(this.animationID);
    }

    render() {
        return (
            <span>
                {this.state.currentFrame}
            </span>
        );
    }
}
