import React, { Component } from 'react';
import { Divider, Button } from 'antd';
import ReactCodeInput from 'react-code-input';

class RevealForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: null,
      secretError: true
    };
    this.handleSecretChange = this.handleSecretChange.bind(this);
    this.handleReveal = this.handleReveal.bind(this);
  }
  handleSecretChange(value) {
    const secret = (value.length > this.props.fields ? value.substr(0, this.props.fields) : value);
    this.setState({ secret, secretError: secret.length !== this.props.fields });
  }
  handleReveal(e) {
    e.preventDefault();
    if (!this.state.numberError && !this.state.secretError) {
      this.props.onBuy(this.state.number, this.state.secret);
    }
  }

  render() {
    return (
      <div>
        <h5>Reveal secret</h5>
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
          REVEAL
        </Button>
        <p>
          Note that you need to provide the secret numbers you commit here
          before the reveal deadline in order to get your deposit back
        </p>
      </div>
    );
  }
}

export default RevealForm;
