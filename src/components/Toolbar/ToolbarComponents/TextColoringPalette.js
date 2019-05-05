import React, { Component } from "react";
import { CompactPicker } from "react-color";

class TextColoringPalette extends Component {
  onChange = color => {
    for (const textColorMark of this.getFontColorArray()) {
      this.props.editor.removeMark({
        type: "textColor",
        data: { color: textColorMark.data.get("color") }
      });
    }

    this.props.editor.addMark({
      type: "textColor",
      data: { color: color.hex }
    });
    this.props.editor.focus();
  };

  getFontColorArray = () => {
    const { value } = this.props.state;
    return value.marks.filter(mark => mark.type === "textColor");
  };

  getTextColor = () => {
    const currentTextColors = this.getFontColorArray();
    if (this.props.editor && currentTextColors.size === 0) {
      return "000000";
    } else if (currentTextColors.size > 1) {
      return "None";
    } else if (currentTextColors.size === 1) {
      return currentTextColors.first().data.get("color");
    }
  };

  render() {
    return (
      <CompactPicker
        color={this.getTextColor()}
        onChangeComplete={this.onChange}
      />
    );
  }
}

export default TextColoringPalette;
