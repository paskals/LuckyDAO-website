import React from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Row, Col, Alert, Spin, Card, Layout, Button } from 'antd';
import Countdown from 'react-countdown-now';
import CommitForm from './components/CommitForm';
import RevealForm from './components/RevealForm';
import logo from './assets/images/logo.png';
import metamaskIcon from './assets/images/metamask.svg';
import './App.css';

const { Header, Footer, Content } = Layout;

const countdownRenderer = ({
  days, hours, minutes, completed
}) => {
  if (completed) {
    return <p className="countdown">You are good to go!</p>;
  }
  return (
    <p className="countdown">Commit phase end in
      <br />
      <span>{days}</span> days <span>{hours}</span> hours <span>{minutes}</span> minutes
    </p>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openCommit: false,
      openReveal: false
    };
    this.showCommit = this.showCommit.bind(this);
    this.closeCommit = this.closeCommit.bind(this);
    this.showReveal = this.showReveal.bind(this);
    this.closeReveal = this.closeReveal.bind(this);
    this.onCountdownEnd = this.onCountdownEnd.bind(this);
  }
  componentDidMount() {
    this.props.onQuery('', '');
  }
  onCountdownEnd(v) {
    console.log(v);
  }
  showCommit() {
    this.setState({ openCommit: true });
  }
  closeCommit() {
    this.setState({ openCommit: false });
  }
  showReveal() {
    this.setState({ openReveal: true });
  }
  closeReveal() {
    this.setState({ openReveal: false });
  }

  render() {
    let status = <img className="metamasklogo disconnect" src={metamaskIcon} alt="metamasklogo" />;
    if (this.props.data) {
      status = <span><img className="metamasklogo" src={metamaskIcon} alt="metamasklogo" />{this.props.data}</span>;
    }
    return (
      <Layout>
        <Header style={{ background: 'none', padding: '0px 12px' }}>
          <img className="header-logo" src={logo} alt="logo" />
          <a src="">How to play</a>
          <a src="">Admin</a>
        </Header>
        <Content>
          <Row type="flex" justify="center">
            <Col xl={8}>
              <Spin spinning={false}>
                <div style={{ padding: '24px 12px' }}>
                  <h1>Jackpot: 192$</h1>
                  <Countdown
                    date={Date.now() + 5000}
                    renderer={countdownRenderer}
                    onComplete={this.onCountdownEnd}
                  />
                  <Button className="big-button" type="primary" size="large" onClick={this.showCommit}>Play</Button>
                  {!this.props.fetching && (!this.props.data
                    ? (<Alert
                      message={status
                      }
                      type="error"
                    />)
                    : (<Alert
                      message={status}
                      type="info"
                    />))}
                  <div className="stats">
                    <Row>
                      <Col xs={18}>Raised for charity</Col>
                      <Col xs={6}>123</Col>
                    </Row>
                    <Row>
                      <Col xs={18}>Total tickets sold</Col>
                      <Col xs={6}>123</Col>
                    </Row>
                    <Row>
                      <Col xs={18}>Your tickets</Col>
                      <Col xs={6}>123</Col>
                    </Row>
                    <Row>
                      <Col xs={18}>Your chance of winning</Col>
                      <Col xs={6}>123</Col>
                    </Row>
                    <Row>
                      <Col xs={18}>Total won</Col>
                      <Col xs={6}>123</Col>
                    </Row>
                    <Row>
                      <Col xs={18}>Total raised for charity</Col>
                      <Col xs={6}>123</Col>
                    </Row>
                  </div>
                </div>
              </Spin>
            </Col>
          </Row>
          <CommitForm
            open={this.state.openCommit}
            onClose={this.closeCommit}
            fields={6}
          />
          <RevealForm
            open={this.state.openReveal}
            onClose={this.closeReveal}
            fields={6}
          />
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.fetching,
  data: state.data,
  error: state.error
});

const mapDispatchToProps = dispatch => ({
  onQuery: (schema, range) => dispatch({ type: 'API_CALL_REQUEST', schema, range })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
