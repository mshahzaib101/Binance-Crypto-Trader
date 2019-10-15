import React, { Component } from "react";
import {
  Table,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button
} from "reactstrap";
import {BinanceWebSocket} from '../index';
import { BigNumber } from "bignumber.js";
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './style1.css';


export default class PairSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      pairs: []
    };
 
  }

  pairSelect = (e, value) => {
    //console.log(value, this.state.pairs);
    this.props.pairValueHandler(value.name)  // this will send pair to App.js
   
  }

  componentDidMount() {
    this.clean = BinanceWebSocket.allTickers(tickers => {
      let pairs = {};
      tickers.some((ticker, idx) => {
        if (idx > 20) return true;
        pairs[ticker.symbol] = {
          change: new BigNumber(ticker.priceChangePercent),
          ticker: new BigNumber(ticker.bestAsk)
            .plus(ticker.bestBid)
            .dividedBy(2),
          volume: new BigNumber(ticker.volume)
        };
        return false;
      });

      //for sorting I push data in array
      //sending data to array
  
      let pairArray = [];
      for (var key in pairs) {
        pairs[key].name = key; // an addition property name to acess trade pair name
        //for dynamic color
        // color is saved in each array and showed dynamiclly
        if(pairs[key].change.toNumber() > 0 || pairs[key].change.toNumber() === 0 ) {
          pairs[key].bgcolor = 'bg-success';
        }else{
          pairs[key].bgcolor = 'bg-danger';
        }
    
        pairArray.push(pairs[key])
    }
         //console.log('pairs',pairArray)
      this.setState({ pairs: pairArray});
    });

  }

  componentWillUnmount() {
    typeof this.clean === "function" && this.clean();
  }


  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h4" className="mb-0">
            Trading pairs
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          {this.state.message}
          <Table dark size="sm" className="mb-0 ">
            <thead>
              <tr>
                <th>idx</th>
                <th>Pair</th>
                <th>Price</th>
                <th>Vol</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody className='table-data-cell'>
              {
                this.state.pairs
                //a simple sorting algoritheme
              .sort(
                (a, b) => {
                 return( b.volume.toNumber() - a.volume.toNumber() )
                }
                )
              .map((value, idx) => {
                return (
                  // dynamic bootstrap color value
                  <tr key={`tradepairs-${idx}`} className={value.bgcolor}> 
                    <td>{idx}</td>
                    <td>
                      <Button
                        className="p-0 table-btn"
                        color="link"
                        onClick={e => {
                          this.pairSelect(e, value);
                        }}
                      >
                        {value.name}
                      </Button>
                    </td>
                    <td>{value.ticker.toNumber()}</td>
                    <td>{value.volume.toNumber()}</td>
                    <td>{value.change.toNumber()}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}
