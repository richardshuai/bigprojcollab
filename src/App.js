import React, { Component } from 'react';
import './App.css';
import { Editor } from 'slate-react'
import { Value } from 'slate'
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3000');
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
})

class App extends Component {
  constructor(props) {
    super(props);
    socket.on('newUser', function (currentState) {
  
    });
    };

  state = {
    value: initialValue,
  }



  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    this.setState({ value })
    socket.emit()
  }

  // Render the editor.
  render() {
    return (
      <div className="App">
        <h3>Hello! Slate Text Editor</h3>
        <div className="Editor">
          <Editor value={this.state.value} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default App;
