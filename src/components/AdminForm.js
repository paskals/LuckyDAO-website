import React from 'react';

import { Form, Slider, Button, DatePicker, Input } from 'antd';

const FormItem = Form.Item;

class AdminForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }
  handleCreate(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onCreate(values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    return (
      <Form onSubmit={this.handleCreate}>
        <FormItem
          {...formItemLayout}
          label="Ticket Price"
        >
          {getFieldDecorator('ticketPrice', {
            rules: [{ required: false, message: 'Please set ticket price!' }]
          })(<Input size="large" type="number" placeholder="Ticket price in Eth" />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Deposit Fraction"
        >
          {getFieldDecorator('depositFraction', {
            rules: [{ required: false, message: 'Please set deposit fraction!' }]
          })(<Slider size="large" marks={{ 0: '0%', 100: '100%' }} />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Commit Start"
        >
          {getFieldDecorator('commitStart', {
            rules: [{ type: 'object', required: false, message: 'Please select commit start time!' }]
          })(<DatePicker size="large" />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Commit Deadline"
        >
          {getFieldDecorator('commitDeadline', {
            rules: [{ type: 'object', required: false, message: 'Please select commit deadline time!' }]
          })(<DatePicker size="large" />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Reveal Deadline"
        >
          {getFieldDecorator('revealDeadline', {
            rules: [{ type: 'object', required: false, message: 'Please select reveal deadline time!' }]
          })(<DatePicker size="large" />)}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 24 }}
        >
          <Button
            className="big-button"
            type="primary"
            size="large"
            htmlType="submit"
          >
            CREATE CAMPAIGN
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedAdminForm = Form.create()(AdminForm);

export default WrappedAdminForm;
