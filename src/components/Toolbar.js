import React, { Component } from "react";
import PropTypes from "prop-types";
import FontDropdown from "./FontDropdown";
import SizeDropdown from "./SizeDropdown";
import "../css/Toolbar.css";

class Toolbar extends Component {
  render() {
    return (
      <div className="Toolbar">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <FontDropdown
          className="dropdown"
          state={this.props.state}
          editor={this.props.editor}
        />
        <SizeDropdown
          className="dropdown"
          state={this.props.state}
          editor={this.props.editor}
        />
        {this.props.renderMarkButton("bold", "format_bold")}
        {this.props.renderMarkButton("italic", "format_italic")}
        {this.props.renderMarkButton("underlined", "format_underlined")}
        {this.props.renderBlockButton("heading-one", "looks_one")}
        {this.props.renderBlockButton("heading-two", "looks_two")}
        {this.props.renderBlockButton("block-quote", "format_quote")}
        {this.props.renderBlockButton("numbered-list", "format_list_numbered")}
        {this.props.renderBlockButton("bulleted-list", "format_list_bulleted")}
        {this.props.renderInlineButton("link", "link")}
        {this.props.renderInlineButton("comment", "comment")}
      </div>
    );
  }
}

Toolbar.propTypes = {
  renderMarkButton: PropTypes.func.isRequired,
  renderBlockButton: PropTypes.func.isRequired,
  renderInlineButton: PropTypes.func.isRequired
  //app.state
};

export default Toolbar;
