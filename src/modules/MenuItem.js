import React, { Component } from 'react'

/**
 * Add a link to the menu invitation
 */

class MenuItem extends Component {
    constructor(props){
	super(props);}
    render() {
      return (
        <div className="category">
        <li>
            <a href="#settings-screen"> {this.props.name}</a>

        </li>
          
        </div>
      );
    }
  }
  
  export default MenuItem;
  
