import React, { Component } from "react";
import { Table, Card, CardHeader, CardTitle, CardBody ,Spinner} from "reactstrap";
import Binance from "binance-api-node";
import { BigNumber } from "bignumber.js";
import Ticker from "./Ticker";
import {BinanceWebSocket} from '../index';
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './style1.css';



export default class OrderBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      ticker: new BigNumber(0),
      bidsArray: [],
      asksArray: [],
      tickerbgColor: 'bg-dark text-white',  //for blinking background color
      loaderOrder: 'inline-block',          //for displaying loader
      tableOrder: 'none', //for displaying loader
      tickerOrder: 'none', //for displaying loader
    };
  }

  componentDidMount() {
    this.clean = BinanceWebSocket.partialDepth(
      { symbol: this.props.pair, level: 20 },
      depth => {
        //showing table and hiding loader
        this.setState({ 
          loaderOrder: 'none',
          tableOrder: 'table-row-group',
          tickerOrder: 'block',
        });
        //depth contains orderbook
        //simple acending sort algoritheme for asks
          depth.asks.sort(
            (a, b) => {
            return( a.price - b.price )
            })
        //simple decending sort algoritheme for bids
        depth.bids.sort(
          (a, b) => {
          return( b.price - a.price )
          })
        //saving only first 10 elements
        let asksData = depth.asks.slice(0,10)
        let bidsData = depth.bids.slice(0,10)

        this.setState({
          asksArray: asksData,
          bidsArray: bidsData,
        })

      }
    );
    this.clean2 = BinanceWebSocket.ticker(this.props.pair, ticker => {
      var ticker= new BigNumber(ticker.bestAsk)
          .plus(new BigNumber(ticker.bestBid))
          .multipliedBy(0.5)
      
      // console.log(ticker.toPrecision(10))
      // console.log(this.state.ticker.toPrecision(10))
      //changing blinking color when condition gets satisfied
      if(this.state.ticker.toPrecision(10) < ticker.toPrecision(10) || this.state.ticker.toPrecision(10) === ticker.toPrecision(10)){
        this.setState({tickerbgColor:'bg-success text-white', ticker})
        setTimeout(()=>{this.setState({tickerbgColor: 'bg-dark text-white'}) }, 600)
      }else{
        this.setState({tickerbgColor: 'bg-danger text-white', ticker})
        setTimeout(()=>{this.setState({tickerbgColor: 'bg-dark text-white'}) }, 600)
      }
    });
  }


  componentDidUpdate(prevProp) {
    //it will run when App.js state is updated on click
    if(prevProp.pair){
     //if prop is avaliable
    if (this.props.pair !== prevProp.pair) {

    //showing loader
    this.setState({
      loaderOrder: 'inline-block',
      tableOrder: 'none',
      tickerOrder: 'none',
    })
    
    // stopping previous socket connection
    typeof this.clean === "function" && this.clean();
    typeof this.clean2 === "function" && this.clean2();

    //componentDidMount logic here
    this.clean = BinanceWebSocket.partialDepth(
      { symbol: this.props.pair, level: 20 },
      depth => {    
        //showing table and hiding loader
        this.setState({ 
          loaderOrder: 'none',
          tableOrder: 'table-row-group',
          tickerOrder: 'block',
        });
        //depth contains orderbook
        //simple decending sort algoritheme for asks
          depth.asks.sort(
            (a, b) => {
            return( a.price - b.price )
            })
        //simple acending sort algoritheme for bids
        depth.bids.sort(
          (a, b) => {
          return( b.price - a.price )
          })
        //saving only first 10 elements
        let asksData = depth.asks.slice(0,10)
        let bidsData = depth.bids.slice(0,10)
        this.setState({
          asksArray: asksData,
          bidsArray: bidsData,
        })

      }
    );
    this.clean2 = BinanceWebSocket.ticker(this.props.pair, ticker => {
      var ticker= new BigNumber(ticker.bestAsk)
          .plus(new BigNumber(ticker.bestBid))
          .multipliedBy(0.5)
      
      // console.log(ticker.toPrecision(10))
      // console.log(this.state.ticker.toPrecision(10))
      //changing blinking color when condition gets satisfied
      if(this.state.ticker.toPrecision(10) < ticker.toPrecision(10) || this.state.ticker.toPrecision(10) === ticker.toPrecision(10)){
        this.setState({tickerbgColor:'bg-success text-white', ticker})
        setTimeout(()=>{this.setState({tickerbgColor: 'bg-dark text-white'}) }, 600)
      }else{
        this.setState({tickerbgColor: 'bg-danger text-white', ticker})
        setTimeout(()=>{this.setState({tickerbgColor: 'bg-dark text-white'}) }, 600)
      }
    });

    }
  }
}
  componentWillUnmount() {
    typeof this.clean === "function" && this.clean();
    typeof this.clean2 === "function" && this.clean2();
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h4" className="mb-0">
            Orderbook
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          {this.state.message}
          <Table dark size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody style={{'display': this.state.tableOrder}} className='table-data-cell'>
              {
                //maping asks(sell orders)
                this.state.asksArray.map((value, indx)=>{
                  return(
                    <tr key={`asks-oder${indx}`} className='bg-danger'>
                    <td >{Number(value.price)}</td>
                    <td >{value.quantity}</td>
                  </tr>
                  )
                })
              }
          
            </tbody>
          </Table>
        <div style={{ 'display': this.state.tickerOrder}} >
          <Ticker
            blinkColor={this.state.tickerbgColor} //passing blink color
            price={this.state.ticker.toPrecision(10)}
            
          />
        </div>
          <Table dark size="sm" className="mb-0" style={{'marginTop':'-8px'}}>
            <tbody style={{'display': this.state.tableOrder}} className='table-data-cell'>
            {
                //maping bids(buy orders)
                this.state.bidsArray.map((value, indx)=>{
                  return(
                    <tr key={`bids-oder${indx}`} className='bg-success'>
                    <td >{Number(value.price)}</td>
                    <td >{value.quantity}</td>
                  </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </CardBody>
          {/* //React Strap Spinner */}
          <Spinner color="secondary" style={{ 'display': this.state.loaderOrder,'width': '6rem', 'height': '6rem', 'margin': '80px auto' }} />
      </Card>
    );
  }
}
