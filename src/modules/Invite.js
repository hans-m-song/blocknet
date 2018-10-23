import React, { Component } from 'react';
import MenuItem from './MenuItem.js';
import './Invite.css';

class Invite extends Component{
    constructor(props){
        super(props);
            this.state ={
                visible:false
            }
    }
    handleClick(event){
        /*
        event.preventDefault();
        this.setState({
            visible:!this.state.visible
        })
        */
    }

    render() {
      return (
        <div className="invite">
        <li>
            <h3 className="hover-cursor" onClick={this.handleClick.bind(this)}>{this.props.name}</h3>
            <ul className={this.state.visible?'visible':'no-visible'} >
                {this.props.items.map((item)=>{
                    return <MenuItem className="section-button" name={item} key={item}/>
                })}
            </ul>
        </li>
          
        </div>
      );
    }
  }
  
  export default Invite;
  
