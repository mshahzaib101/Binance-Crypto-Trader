import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import PairSelector from "./components/PairSelector";
import RecentTrades from "./components/RecentTrades";
import OrderBook from "./components/OrderBook";
import "./App.css";


/**
 * This is your main content file. Try to handle as much logic as possible here.
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pair: "BTCUSDT"
    };
  }

  pairHandler = (pairVal) => {
    // console.log(pairVal)
    this.setState({pair: pairVal})
  }

  render() {
    return (
      <Container
        fluid
        className="App d-flex flex-column justify-content-center"
      >
        <Header />
        <Container className="d-flex flex-column bg-light flex-grow-1">
          <Row>
            <Col>
              <h2>
                <small>Current Pair:</small> {this.state.pair}
              </h2>
            </Col>
          </Row>
          <Row>
            <Col>
            {/* pairValueHandler calls this.pairHandler to pass pair data */}
              <PairSelector pair={this.state.pair} pairValueHandler={this.pairHandler} />
            </Col>
            <Col>
              <RecentTrades pair={this.state.pair} />
            </Col>
            <Col>
              <OrderBook pair={this.state.pair} />
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default App;
