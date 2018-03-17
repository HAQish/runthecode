import React from 'react';
import { Form, Menu, Button, Input } from 'semantic-ui-react';
import $ from 'jquery';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    //console.log('eeeeeeee', name, value);
    this.setState({
      [name]: value
    });
    console.log('sssssss', this.state);
  }

  handleSubmit(e) {
    e.preventDefault();
    const {handleLogin} = this.props;
    const user = {
        username: this.state.email,
        password: this.state.password
    };
    console.log('Inside the login component', user);

    $.ajax({
      type: 'POST',
      url: '/login',
      data: user,
      success: (data) => {
        console.log('😎', data);
        handleLogin(data);
      },
      error: (data) => {
        console.log('😈', data);
      }
    });
  }

  render() {
    return(
      <Menu.Item style={{padding: '0px'}}>
        <Form size='mini'>
          <Form.Group inline widths='equal' style={{margin: '0px'}}>
            <Button type='button' size='small' type='submit' onClick={this.handleSubmit}>Login</Button>
            <Form.Field control='input' type='email' name='email' placeholder='Email' onChange={this.handleInputChange} />
            <Form.Field control='input' type='password' name='password' placeholder='Password' onChange={this.handleInputChange} />
          </Form.Group>
        </Form>
      </Menu.Item>
    )
  }
}

export default Login;