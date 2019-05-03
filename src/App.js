import React, { Component } from "react";
import "./App.css";
import { Value } from "slate";

import Toolbar from "./components/Toolbar/Toolbar";
import { Editor } from "slate-react";
import CommentPanel from "./components/CommentPanel/CommentPanel.js";
import Video from "./components/Video/Video.js";

/* Handlers */
import { renderMark } from "./components/Editor/RenderMark";
import { renderNode } from "./components/Editor/RenderNode";
import { onKeyDown } from "./components/Editor/OnKeyDown";
import { onChange } from "./components/Editor/OnChange";
import { onPaste } from "./components/Editor/OnPaste";

/* Initial value */
import initialValue from "./initialValue.json";

/* Plugins */
import CollapseOnEscape from "slate-collapse-on-escape";
import socketIOClient from "socket.io-client";

/* Export app for use by handlers */
export let app;

const plugins = [CollapseOnEscape()];

class App extends Component {
  state = {
    value: Value.fromJSON(initialValue),
    socket: "uninitialized",
    response: false,
    comments: []
  };

  componentDidMount() {
    app = this;
    const socket = socketIOClient();
    socket.on("newUser", existingContent => {
      const updateValue = JSON.parse(existingContent);
      this.setState({ value: Value.fromJSON(updateValue) });
    });
    socket.on("receiveEdit", newContent => {
      this.setState({ value: Value.fromJSON(JSON.parse(newContent)) });
    });
    this.setState({ socket: socket, response: true });

    const scanner = setInterval(() => this.scanDocument(), 2000);
  }

  render() {
    if (!this.state.response) {
      return "Loading sockets...";
    }
    return (
      <html lang="en">
        <head />
        <body>
          <div className="app-container">
            <div className="toolbar-container">
              {/* Change this so it uses app instead of this.state? */}
              <Toolbar state={this.state} editor={this.editor} />
            </div>
            <div className="editor-container">
              <Editor
                spellCheck
                autoFocus
                placeholder="Enter some text..."
                value={this.state.value}
                ref={this.ref}
                onPaste={onPaste}
                onChange={onChange}
                onKeyDown={onKeyDown}
                renderMark={renderMark}
                renderNode={renderNode}
                plugins={plugins}
              />
            </div>
            <div className="comment-panel-container">
              <CommentPanel
                comments={this.state.comments}
                scanDocument={this.scanDocument}
              />
            </div>
            <div className="video-container">
              <Video />
            </div>
          </div>
        </body>
      </html>
    );
  }

  /* Editor props */
  ref = editor => (this.editor = editor);

  // Pasting comments is broken for some reason. Figure that out later.
  scanDocument = async () => {
    const commentNodes = this.state.value.document.getInlinesByType("comment");

    // Updates comments array, create map for duplicates
    const updatedComments = [];
    const keyToSameCommentsMap = new Map();

    for (const node of commentNodes) {
      const data = this.generateData(node);

      // If a duplicate node is created (such as by line breaks), store in a map.
      // Push unique comments to commentsArray, and for now, just ignore the duplicate.
      const currKey = data.uniqueKey;
      if (!keyToSameCommentsMap.has(currKey)) {
        keyToSameCommentsMap.set(currKey, [data]);
        updatedComments.push(data);
      } else {
        keyToSameCommentsMap.get(currKey).push(data);
      }
    }

    this.setState({ comments: updatedComments });
  };

  generateData = node => {
    // Update start of comments for sorting
    // Dynamic text rendering
    const data = {};
    data.uniqueKey = node.data.get("uniqueKey");
    data.start = node.data.get("start").moveToStartOfNode(node);
    data.end = node.data.get("end").moveToEndOfNode(node);
    data.quoted = node.text;
    data.tags = node.data.get("tags");
    data.timeStamp = node.data.get("timeStamp");
    data.suggestion = node.data.get("suggestion");
    return data;
  };
}

export default App;
