import React from 'react';
import { Alert } from 'antd';
import metamaskIcon from '../assets/images/metamask.svg';

const MetamaskStatus = (props) => {
  if (props.fetching) {
    return null;
  }
  if (props.account.address) {
    return (
      <Alert
        message={<span><img className="metamasklogo" src={metamaskIcon} alt="metamasklogo" />Web3 connected</span>}
        type="info"
      />
    );
  }
  return (
    <Alert
      message={<span><img className="metamasklogo disconnect" src={metamaskIcon} alt="metamasklogo" />Please install Metamask and unlock account</span>}
      type="error"
    />
  );
};

export default MetamaskStatus;
