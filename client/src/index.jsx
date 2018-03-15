import React from 'react';
import ReactDOM from 'react-dom';
import AceEditor from 'react-ace';
import brace from 'brace';
import {VM} from 'vm2';

import 'brace/theme/kuroir';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({code: e});
  }


  render () {
    return (
      <div>
          <AceEditor
            mode='javascript'
            theme="kuroir"
            onChange={this.onChange.bind(this)}
            value={this.state.code}
            editorProps={{$blockScrolling: true}}
            width='100%'
            height='95vh'
          />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));