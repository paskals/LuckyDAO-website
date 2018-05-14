import React from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Row, Col, Spin, Modal, Layout, Button } from 'antd';
import Countdown from 'react-countdown-now';
import CommitForm from './components/CommitForm';
import RevealForm from './components/RevealForm';
import HowToPlay from './components/HowToPlay';
import MetamaskStatus from './components/MetamaskStatus';
import logo from './assets/images/logo.png';
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
      openDialog: false,
      dialogTitle: '',
      dialog: null
    };
    this.showCommit = this.showCommit.bind(this);
    this.showReveal = this.showReveal.bind(this);
    this.showHowTo = this.showHowTo.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onCountdownEnd = this.onCountdownEnd.bind(this);
  }
  componentDidMount() {
    this.props.onQuery('', '');
  }
  onCountdownEnd(v) {
    console.log(v);
  }
  closeDialog() {
    this.setState({ openDialog: false });
  }
  showDialog(dialogTitle, dialog) {
    this.setState({ dialogTitle, dialog, openDialog: true });
  }
  showCommit() {
    this.showDialog('Lucky Draw 1: Buy Ticket', (<CommitForm fields={6} />));
  }
  showReveal() {
    this.showDialog('You have 0.02 ETH deposit', (<RevealForm fields={6} />));
  }
  showHowTo() {
    this.showDialog('How to play', (<HowToPlay />));
  }

  render() {

    return (
      <Layout>
        <Header>
          <img src={logo} alt="logo" />
          <Button>Admin</Button>
          <Button onClick={this.showHowTo}>How to play</Button>
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
                  <MetamaskStatus {...this.props} />
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
          <Modal
            title={this.state.dialogTitle}
            visible={this.state.openDialog}
            onCancel={this.closeDialog}
            footer={null}
          >
            {this.state.dialog}
          </Modal>
        </Content>
        <Footer>© 2018 Bakaoh</Footer>
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
