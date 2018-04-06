import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import PairingEditor from "./pairingEditor.jsx";

import 'brace/theme/kuroir';
import 'brace/theme/ambiance';
import 'brace/theme/chaos';
import 'brace/theme/chrome';
import 'brace/theme/clouds';
import 'brace/theme/cobalt';
import 'brace/theme/dawn';
import 'brace/theme/dracula';
import 'brace/theme/dreamweaver';
import 'brace/theme/eclipse';
import 'brace/theme/gob';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import { Dropdown, Menu } from 'semantic-ui-react'
import { Grid, Button } from 'semantic-ui-react';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      masterUserSolutionCode: this.props.starterCode,
      challengeResults: [],
      destinationUrl: props.destinationUrl,
      theme: "kuroir"
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dropDownChange = this.dropDownChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      masterUserSolutionCode: this.props.starterCode
    });
  }
  
  onChange(e) {
    this.setState({ masterUserSolutionCode: e });//|| this.props.starterCode });
  }

  handleSubmit(e) {
    e.preventDefault();
    const {masterTests, displayTestResults, difficulty, challengeName} = this.props;
    const {masterUserSolutionCode} = this.state;
    $.ajax({
      type: "POST",
      url: this.state.destinationUrl,
      data: {
        masterUserSolutionCode: masterUserSolutionCode,
        masterTests: masterTests,
        challengeLevel: this.props.challengeLevel,
        challengeName: challengeName
      },
      success: data => {
        displayTestResults(data, masterUserSolutionCode);
        this.setState({masterUserSolutionCode: ''})
      },
      error: err => console.log(err)
    });
  }  

  dropDownChange(e, data) {
    console.log("dropDownChange", e, data);
    this.setState({ theme: data.value });
  }

  render() {
    const options = [
      { key: 1, text: 'ambiance', value: "ambiance" },
      { key: 2, text: 'chaos', value: "chaos" },
      { key: 3, text: 'chrome', value: "chrome" },
      { key: 4, text: 'clouds', value: "clouds" },
      { key: 5, text: 'cobalt', value: "cobalt" },
      { key: 6, text: 'dawn', value: "dawn" },
      { key: 7, text: 'dracula', value: "dracula" },
      { key: 8, text: 'dreamweaver', value: "dreamweaver" },
      { key: 9, text: 'eclipse', value: "eclipse" },
      { key: 10, text: 'gob', value: "gob" }
    ];
    let pair = (window.location.href.split("/")[3] === "course") ? <br /> : <Button as={Link} to={`/pairing/${this.props.challengeName}/${this.props.socket.id}`} content="Try Pair Programming" />;
    return (
      <div style={{height: "80vh", marginTop: "30px"}}>
        <Menu compact>
          <Dropdown text='Editor Theme' options={options} simple item onChange={this.dropDownChange} />
        </Menu> 
        <AceEditor 
        mode="javascript" 
        theme={this.state.theme || "kuroir"}
        onChange={this.onChange} 
        value={this.state.masterUserSolutionCode || this.props.starterCode} 
        editorProps={{ $blockScrolling: true }} 
        width="100%" height="60vh" 
        />
        <br />
        <Button onClick={this.handleSubmit} content="Send to server" primary />
        {pair}
        {/* <Button as={Link} to={`/pairing/${this.props.challengeName}/${this.props.socket.id}`} content="Try Pair Programming" /> */}
        {/* <Button onClick={this.props.switch} content="Switch to pair programming" /> */}
      </div>
    );
  }
}

export default Editor;