import React, { Component } from "react";
import "./App.css";
import Toolbar from "./components/Toolbar";
import { Icon, Button } from "./components/Buttons";
import { findMarkHotkey } from "./components/Hotkeys";
import { Editor, getEventTransfer } from "slate-react";
import { Value } from "slate";
import isUrl from "is-url";

/* Plugins */
import CollapseOnEscape from "slate-collapse-on-escape";

import socketIOClient from "socket.io-client";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: ""
              }
            ]
          }
        ]
      }
    ]
  }
});
const DEFAULT_NODE = "paragraph";
const plugins = [CollapseOnEscape()];

class App extends Component {
  state = {
    value: initialValue,
    socket: "uninitialized",
    response: false
  };

  componentDidMount() {
    const socket = socketIOClient();
    socket.on("newUser", existingContent => {
      const updateValue = JSON.parse(existingContent);
      this.setState({ value: Value.fromJSON(updateValue) });
    });
    socket.on("receiveEdit", newContent => {
      this.setState({ value: Value.fromJSON(JSON.parse(newContent)) });
    });
    this.setState({ socket: socket, response: true });
  }

  render() {
    if (!this.state.response) {
      return "Loading sockets...";
    }
    return (
      <div className="App">
        <h3>Hello! Slate Text Editor</h3>
        <Toolbar
          renderMarkButton={this.renderMarkButton}
          renderBlockButton={this.renderBlockButton}
          renderInlineButton={this.renderInlineButton}
          state={this.state}
          editor={this.editor}
        />
        <div className="Editor">
          <Editor
            spellCheck
            autoFocus
            placeholder="Enter some rich text..."
            value={this.state.value}
            ref={this.ref}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onPaste={this.onPaste}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderMark={this.renderMark}
            renderNode={this.renderNode}
            plugins={plugins}
          />
        </div>
      </div>
    );
  }

  /* Editor props */
  ref = editor => (this.editor = editor);

  onBlur = (event, editor, next) => {
    console.log("on Blur called");
    event.preventDefault();
  };

  onFocus = (event, editor, next) => {
    console.log("on Focus called");
  };

  onPaste = (event, editor, next) => {
    if (editor.value.selection.isCollapsed) return next();

    const transfer = getEventTransfer(event);
    const { type, text } = transfer;
    if (type !== "text" && type !== "html") return next();
    if (!isUrl(text)) return next();

    if (this.hasInline("link")) {
      editor.unwrapInline("link");
    }

    editor.command(this.wrapLink, text);
  };

  onChange = ({ value }) => {
    this.setState({ value: value }, () => {
      this.state.socket.emit("userEdit", JSON.stringify(value.toJSON()));
    });
  };

  onKeyDown = (event, editor, next) => {
    let mark;

    const hotkeyProps = findMarkHotkey(event);
    if (hotkeyProps.containsKey) {
      mark = hotkeyProps.mark;
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  renderMark = (props, editor, next) => {
    const { attributes, children, mark } = props;

    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      case "fontFamily":
        console.log("Font family should be " + mark.data.get("font"));
        return (
          <font face={mark.data.get("font")} {...attributes}>
            {children}
          </font>
        );
      case "fontSize":
        console.log("Font size should be " + mark.data.get("size"));
        return (
          <font size={mark.data.get("size")} {...attributes}>
            {children}
          </font>
        );

      default:
        return next();
    }
  };

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "link": {
        return (
          <a
            {...attributes}
            href={node.data.get("href")}
            onClick={this.onClickLink.bind(this, node.data.get("href"))}
          >
            {children}
          </a>
        );
      }
      default:
        return next();
    }
  };

  /* Helper functions */

  /* Marks */
  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  /* Inlines */
  renderInlineButton = (type, icon) => {
    const isActive = this.hasInline(type);
    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickInline(event, type)}
      >
        <Icon>{icon}</Icon>{" "}
      </Button>
    );
  };

  hasInline = type => {
    return this.state.value.inlines.some(inline => inline.type === type);
  };

  onClickInline = (event, type) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;

    if (type === "link") {
      if (this.hasInline("link")) {
        editor.unwrapInline("link");
      } else if (value.selection.isExpanded) {
        const href = window.prompt("Enter the URL of the link:");

        if (href == null) {
          return;
        }

        editor.command(this.wrapLink, href);
      } else {
        const href = window.prompt("Enter the URL of the link:");

        if (href == null) {
          return;
        }

        const text = window.prompt("Enter the text for the link:");

        if (text == null) {
          return;
        }

        editor
          .insertText(text)
          .moveFocusBackward(text.length)
          .command(this.wrapLink, href);
      }
    }
  };

  wrapLink = (editor, href) => {
    editor.wrapInline({
      type: "link",
      data: { href }
    });

    editor.moveToEnd();
  };

  onClickLink = (href, event) => {
    window.open(href, "_blank");
  };

  /* Blocks */
  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(blockNode => blockNode.type === type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };
}

export default App;
