import React from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Row, Col, Spin, Modal, Layout, Button, Divider } from 'antd';
import CountdownTimer from './components/CountdownTimer';
import CommitForm from './components/CommitForm';
import RevealForm from './components/RevealForm';
import HowToPlay from './components/HowToPlay';
import MetamaskStatus from './components/MetamaskStatus';
import logo from './assets/images/logo.png';
import './App.css';
import api from './api';

const { Header, Footer, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      dialogTitle: '',
      dialog: null
    };
    this.showAdmin = this.showAdmin.bind(this);
    this.showCommit = this.showCommit.bind(this);
    this.showReveal = this.showReveal.bind(this);
    this.showHowTo = this.showHowTo.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onCountdownEnd = this.onCountdownEnd.bind(this);
  }
  componentDidMount() {
    this.props.getInfo();
    this.props.getAccount();
  }
  onCountdownEnd() {
    this.closeDialog();
  }
  closeDialog() {
    this.setState({ openDialog: false });
  }
  showDialog(dialogTitle, dialog) {
    this.setState({ dialogTitle, dialog, openDialog: true });
  }
  showAdmin() {
    this.showDialog(
      'Admin', (
        <CommitForm
          fields={6}
          ticketPrice={this.props.info.ticketPrice}
          depositFraction={this.props.info.depositFraction}
          onCommit={this.props.postCommit}
        />
      )
    );
  }
  showCommit() {
    this.showDialog(
      'Lucky Draw: Buy Ticket', (
        <CommitForm
          fields={6}
          ticketPrice={this.props.info.ticketPrice}
          depositFraction={this.props.info.depositFraction}
          onCommit={this.props.postCommit}
        />
      )
    );
  }
  showReveal() {
    this.showDialog('You have 0.02 ETH deposit', (<RevealForm fields={6} />));
  }
  showHowTo() {
    this.showDialog('How to play', (<HowToPlay />));
  }
  currentPhase() {
    const now = Date.now();
    if (now >= this.props.info.commitStart && now < this.props.info.commitEnd) {
      return 'commit';
    } else if (now < this.props.info.revealEnd && now >= this.props.info.commitEnd) {
      return 'reveal';
    }
    return 'inactive';
  }

  render() {
    return (
      <Layout>
        <Header>
          <img src={logo} alt="logo" />
          <Button onClick={this.showHowTo}>How to play</Button>
        </Header>
        <Content>
          <Row type="flex" justify="center">
            <Col xl={8} xs={24}>
              <Spin spinning={this.props.fetching}>
                {this.props.info &&
                  <div style={{ padding: '24px 12px' }}>
                    <h1>Jackpot: {api.printWei(this.props.info.jackpot)}</h1>

                    {this.currentPhase() === 'commit' &&
                      (
                        <div>
                          <CountdownTimer
                            phase="Commit"
                            date={this.props.info.commitEnd}
                            onCountdownEnd={this.onCountdownEnd}
                          />
                          {this.props.account.address
                            ? <Button className="big-button" type="primary" size="large" onClick={this.showCommit}>PLAY</Button>
                            : <MetamaskStatus {...this.props} />
                          }
                        </div>
                      )
                    }
                    {this.currentPhase() === 'reveal' &&
                      (
                        <div>
                          <CountdownTimer
                            phase="Reveal"
                            date={this.props.info.revealEnd}
                            onCountdownEnd={this.onCountdownEnd}
                          />
                          {this.props.account.address
                            ? <Button className="big-button" type="primary" size="large" onClick={this.showReveal}>REVEAL</Button>
                            : <MetamaskStatus {...this.props} />
                          }
                        </div>
                      )
                    }
                    {this.currentPhase() === 'inactive' &&
                      <div>
                        <p className="countdown">NO campaign active</p>
                        {this.props.account.isAdmin &&
                          <Button className="big-button" type="primary" size="large" onClick={this.showAdmin}>ADMIN</Button>
                        }
                      </div>
                    }

                    <div className="stats">
                      <Row>
                        <Col xs={18}>Raised for charity</Col>
                        <Col xs={6}>{api.printWei(this.props.info.raisedCharity)}</Col>
                      </Row>
                      <Row>
                        <Col xs={18}>Total tickets sold</Col>
                        <Col xs={6}>{this.props.info.ticketsSold}</Col>
                      </Row>
                      {this.props.account.address &&
                        <div>
                          <Row>
                            <Col xs={18}>Your tickets</Col>
                            <Col xs={6}>{this.props.account.tickets}</Col>
                          </Row>
                          <Row>
                            <Col xs={18}>Your chance of winning</Col>
                            <Col xs={6}>{Math.round((10000 * this.props.account.tickets) / this.props.info.ticketsSold) / 100}%</Col>
                          </Row>
                        </div>
                      }
                      <Divider />
                      <Row className="lighter">
                        <Col xs={18}>Total won</Col>
                        <Col xs={6}>{this.props.info.totalWon}</Col>
                      </Row>
                      <Row className="lighter">
                        <Col xs={18}>Total raised for charity</Col>
                        <Col xs={6}>{api.printWei(this.props.info.totalRaisedCharity)}</Col>
                      </Row>
                    </div>
                  </div>
                }
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
        <Footer><Divider />© 2018 Bakaoh</Footer>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.fetching,
  account: state.account,
  info: state.info,
  error: state.error
});

const mapDispatchToProps = dispatch => ({
  getInfo: () => dispatch({ type: 'INFO_REQUEST' }),
  getAccount: () => dispatch({ type: 'ACCOUNT_REQUEST' }),
  postCommit: (weiValue, secret) => dispatch({ type: 'COMMIT_REQUEST', weiValue, secret })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
