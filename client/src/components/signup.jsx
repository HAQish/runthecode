import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import $ from 'jquery';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      data: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.demoLogin = this.demoLogin.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password, username } = this.state;
    let user = {
        username: email,
        password: password,
        nickname: username
      }
    $.post('/signup', user, (data) => {
      console.log(data); 
      this.props.handleLogin(data)
    });
  }
  
  handleChange(e, {name, value}) {
    this.setState({
      [name]: value
    });
  }

  demoLogin() {
    let user = {
      username: "demoUser@LevelUpCode.io",
      password: "demopassword",
      nickname: "Demo User"
    }
    $.post('/login', user, (data) => {
      console.log(data);
      this.props.handleLogin(data)
    });
  }

  render() {
    const { email, password, username } = this.state;
    return (
      <Segment inverted>
        <Form inverted>
          <Form.Group widths='equal'>
            <Form.Input fluid type='email' name='email' label='Email' placeholder='email@email.com' value={email} onChange={this.handleChange} />
            <Form.Input fluid type='password' name='password' label='Password' placeholder='Password' value={password} onChange={this.handleChange} />
          </Form.Group> 
          <Form.Input fluid label='Pick a Username' name='username' placeholder='Username' value={username} onChange={this.handleChange.bind(this)} />
          <Form.Group widths="equal">
            <Form.Button onClick={this.handleSubmit} type='submit'>Submit</Form.Button>
            <Button color="red" onClick={this.demoLogin} className="demoLogin">Demo Login</Button>
          </Form.Group>
        </Form>
      </Segment>
    )
  }
}
export default Signup;
