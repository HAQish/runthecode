import React from 'react';
import ReactDOM from 'react-dom';
import AceEditor from 'react-ace';
import brace from 'brace';
import $ from 'jquery';

import 'brace/theme/kuroir';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserSolutionCode: '',
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({currentUserSolutionCode: e});
  }

  onClick(e) {
    $.ajax({
      type: "POST",
      url: "/challengeSolution",
      data: {
        currentUserSolutionCode: this.state.currentUserSolutionCode
      }
    })
  }

  render () {
    return (
      <div>
          <AceEditor
            mode='javascript'
            theme="kuroir"
            onChange={this.onChange.bind(this)}
            value={this.state.currentUserSolutionCode}
            editorProps={{$blockScrolling: true}}
            width='100%'
            height='95vh'
          />
          <button onClick={this.onClick.bind(this)}>Send to server</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));