import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../css/Toolbar.css";

//Buttons
import FontDropdown from "./ToolbarComponents/FontDropdown";
import SizeDropdown from "./ToolbarComponents/SizeDropdown";
import TextColoringPalette from "./ToolbarComponents/TextColoringPalette";
import { renderMarkButton } from "./ToolbarComponents/MarkButton";
import { renderInlineButton } from "./ToolbarComponents/InlineButton";
import { renderBlockButton } from "./ToolbarComponents/BlockButton";

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
        <TextColoringPalette
          state={this.props.state}
          editor={this.props.editor}
        />
        {renderMarkButton("bold", "format_bold")}
        {renderMarkButton("italic", "format_italic")}
        {renderMarkButton("underlined", "format_underlined")}
        {renderBlockButton("heading-one", "looks_one")}
        {renderBlockButton("heading-two", "looks_two")}
        {renderBlockButton("block-quote", "format_quote")}
        {renderBlockButton("numbered-list", "format_list_numbered")}
        {renderBlockButton("bulleted-list", "format_list_bulleted")}
        {renderBlockButton("align-left", "format_align_left")}
        {renderBlockButton("align-center", "format_align_center")}
        {renderBlockButton("align-right", "format_align_right")}
        {renderBlockButton("justify", "format_align_justify")}
        {renderInlineButton("link", "link")}
        {renderInlineButton("comment", "comment")}
      </div>
    );
  }
}

Toolbar.propTypes = {
  state: PropTypes.object,
  editor: PropTypes.object
};

export default Toolbar;
