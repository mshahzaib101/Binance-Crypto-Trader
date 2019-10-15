import React, { Component } from "react";
import { Table, Card, CardHeader, CardTitle, CardBody ,Spinner} from "reactstrap";
import {BinanceWebSocket} from '../index';
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './style1.css';



export default class RecentTrades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradelist: [],
      loader: 'inline-block',          //for displaying loader
      table: 'none', //for displaying loader
    };
    this.ids = [];
    this.clean = null;
  }

  componentDidMount() {
    //it will run only once when component is Mounted
    // console.log(this.props.pair)

    this.clean = BinanceWebSocket.trades(this.props.pair, trade => {
     //console.log('trade', trade)
      if(this.state.tradelist.length < 22){
        this.setState({ 
          loader: 'none',
          tableDisplay: 'table-row-group',
        });
                //adding bgcolor
        trade = this.bgColorAdder(trade);
        let tradelist = this.state.tradelist;

        //for limmiting length
        trade.quantity = Number(trade.quantity);
        trade.price =  Number(trade.price);

        tradelist.unshift(trade);
        this.setState({ tradelist });
        //console.log('list',this.state.tradelist)
      }
      else{
        //adding bgcolor
        trade = this.bgColorAdder(trade);
        let tradelist = this.state.tradelist;
        tradelist.pop();  //Old ones are removed
         //for limmiting length
         trade.quantity = Number(trade.quantity);
         trade.price =  Number(trade.price);
        tradelist.unshift(trade); // new one is added
        this.setState({ tradelist });
       

      }
      
    });
  }

  componentDidUpdate(prevProp) {
        //it will run when App.js state is updated on click
    if(prevProp.pair){
      //if prop is avaliable
      if (this.props.pair !== prevProp.pair) {
        // stopping previous socket connection
        typeof this.clean === "function" && this.clean();
        //console.log(this.props.pair ,'componentdidupdate')
        this.setState({
          tradelist:[],
          loader: 'inline-block',
          tableDisplay: 'none',

        })
       

        this.clean = BinanceWebSocket.trades(this.props.pair, trade => {
        // console.log('update', trade)
          if(this.state.tradelist.length < 22){
            
            let tradelist = this.state.tradelist;
            //adding bgcolor
            trade = this.bgColorAdder(trade);
                //for limmiting length
            trade.quantity = Number(trade.quantity);
            trade.price =  Number(trade.price);
            tradelist.unshift(trade);
            this.setState({ 
              tradelist,
              loader: 'none',
              tableDisplay: 'table-row-group',
            });
          }
          else{
            let tradelist = this.state.tradelist;
            //adding bgcolor
            trade = this.bgColorAdder(trade);
            tradelist.pop(); //Old ones are removed
                //for limmiting length
            trade.quantity = Number(trade.quantity);
            trade.price =  Number(trade.price);
            tradelist.unshift(trade); // new one is added
            this.setState({ tradelist });
          }
          
        });
      }
  }}
  

  componentWillUnmount() {
    typeof this.clean === "function" && this.clean();
  }

  //this func will add a property bgColor to each trade data obj
  bgColorAdder = (tradeObj) => {
    if(tradeObj.maker) {
    tradeObj.bgColor = 'bg-success';
    return tradeObj
  }else{
    tradeObj.bgColor = 'bg-danger';
    return tradeObj
  }
  }


  render() {
    return (
      <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4" className="mb-0">
            Recent Trades {this.props.pair}
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <Table dark size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Price</th>
                <th>Sum</th>
              </tr>
            </thead>
            <tbody style={{'display': this.state.tableDisplay}} className='table-data-cell'>
              
              {
                this.state.tradelist.map((trade,index )=> {
                  // console.log('trade', trade)
                return (
                  //dynamic background color
                  <tr key={`${trade.tradeId}${index}`} className={trade.bgColor}>
                    <td>{trade.quantity}</td>
                    <td>{trade.price}</td>
                    <td>
                      {(trade.quantity*trade.price).toFixed(9)}
                    </td>
                  </tr>
                )}
                )
              }
            </tbody>
          </Table>
        </CardBody>
        {/* //React Strap Spinner */}
        <Spinner color="secondary" style={{ 'display': this.state.loader,'width': '6rem', 'height': '6rem', 'margin': '80px auto' }} />

      </Card>
      </div>
    );
  }
}
