import React from 'react';
import { Alert } from 'antd';
import metamaskIcon from '../assets/images/metamask.svg';

const MetamaskStatus = (props) => {
  if (props.fetching) {
    return null;
  }
  if (props.data) {
    return (
      <Alert
        message={<span><img className="metamasklogo" src={metamaskIcon} alt="metamasklogo" />{props.data}</span>}
        type="info"
      />
    );
  }
  return (
    <Alert
      message={<img className="metamasklogo disconnect" src={metamaskIcon} alt="metamasklogo" />}
      type="error"
    />
  );
};

export default MetamaskStatus;
