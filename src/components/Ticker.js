import React, { Component } from "react";

export default class Ticker extends Component {
  render() {
    return <h2 style={{'transition': 'background 0.5s',}} className={this.props.blinkColor}>{this.props.price}</h2>;
  }
}
