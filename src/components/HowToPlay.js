import React, { Component } from 'react';

class HowToPlay extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 0 };
  }
  render() {
    return (
      <div>
        <h5>Commit Phase</h5>
        <p>
          During this phase, people are able to buy tickets, so all major stats must be displayed, and buying tickets must be enabled when pressing the central 'PLAY' or 'BUY TICKETS' button.
        </p>
        <h5>Reveal Phase</h5>
        <p>
          During this phase, tickets are not sold. Players who’ve previously bought tickets should have the option to 'reveal' the secret number they provided in the previous phase when buying their tickets. The central 'PLAY' button must be replaced by a 'REVEAL' button.
        </p>
        <h5>Inactive Phase</h5>
        <p>
          During this state there’s no active lottery campaign, so there should be some message displayed instead of the current campaign stats and play button.
        </p>
      </div >
    );
  }
}

export default HowToPlay;
