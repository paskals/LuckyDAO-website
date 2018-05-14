import React from 'react';
import Countdown from 'react-countdown-now';

const Countdowntimer = (props) => {
  const countdownRenderer = ({
    days, hours, minutes, completed
  }) => {
    if (completed) {
      return <p className="countdown">{props.phase} is ended</p>;
    }
    return (
      <p className="countdown">{props.phase} phase end in
        <br />
        <span>{days}</span> days <span>{hours}</span> hours <span>{minutes}</span> minutes
      </p>
    );
  };
  return (
    <Countdown
      date={props.date}
      renderer={countdownRenderer}
      onComplete={props.onCountdownEnd}
    />
  );
};

export default Countdowntimer;
