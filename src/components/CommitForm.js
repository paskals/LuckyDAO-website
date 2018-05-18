import React, { Component } from 'react';
import { Input, Divider, Button } from 'antd';
import ReactCodeInput from 'react-code-input';
import api from '../api';

class CommitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: null,
      number: 1,
      secretError: true,
      numberError: false
    };
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleSecretChange = this.handleSecretChange.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
  }
  handleNumberChange(e) {
    e.target.value = parseInt(e.target.value, 10);
    const number = e.target.value;
    this.setState({ number, numberError: number <= 0 });
  }
  handleSecretChange(value) {
    const secret = (value.length > this.props.fields ? value.substr(0, this.props.fields) : value);
    this.setState({ secret, secretError: secret.length !== this.props.fields });
  }
  handleBuy(e) {
    e.preventDefault();
    if (!this.state.numberError && !this.state.secretError) {
      this.props.onCommit(this.props.ticketPrice * this.state.number, this.state.secret);
    }
  }

  render() {
    return (
      <div>
        <h5>{`Deposit: ${api.printWei((this.props.ticketPrice * this.state.number * this.props.depositFraction) / 100)}`}</h5>
        <Input
          size="large"
          addonBefore="Number of tickets:"
          addonAfter={api.printWei(this.props.ticketPrice * this.state.number)}
          type="number"
          min={1}
          defaultValue={this.state.number}
          onChange={this.handleNumberChange}
        />
        <small className="ticket-price">Ticket price: {api.printWei(this.props.ticketPrice)}</small>
        {this.state.numberError && <small className="require">Number of tickets must greater than 0</small>}
        <Divider />
        <h5>Commit secret</h5>
        <div style={{ textAlign: 'center' }} >
          <ReactCodeInput
            type="number"
            fields={this.props.fields}
            onChange={this.handleSecretChange}
          />
        </div>
        {this.state.secret && this.state.secretError && <small className="require">Secret must have length of 6</small>}
        <Divider />
        <Button
          onClick={this.handleBuy}
          disabled={this.state.secretError || this.state.numberError}
          className="big-button"
          type="primary"
          size="large"
        >
          BUY TICKETS
        </Button>
        <p>
          Note that you need to provide the secret numbers you commit here
          before the reveal deadline in order to get your deposit back
        </p>
      </div>
    );
  }
}

export default CommitForm;
