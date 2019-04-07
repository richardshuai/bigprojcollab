import React, { Component } from "react";

class FontDropdown extends Component {
  onChange = e => {
    for (const fontMark of this.getAllSelectedFontsArray()) {
      this.props.editor.removeMark({
        type: "fontFamily",
        data: { font: fontMark.data.get("font") }
      });
    }

    this.props.editor.addMark({
      type: "fontFamily",
      data: { font: e.target.value }
    });
  };

  hasFontMark = () => {
    const { value } = this.props.state;
    return value.marks.some(mark => mark.type === "fontFamily");
  };

  getAllSelectedFontsArray = () => {
    const { value } = this.props.state;
    return value.marks.filter(mark => mark.type === "fontFamily");
  };

  getFontFamily = () => {
    const currentFonts = this.getAllSelectedFontsArray();
    if (this.props.editor && currentFonts.size === 0) {
      return "Arial";
    } else if (currentFonts.size > 1) {
      return "None";
    } else if (currentFonts.size === 1) {
      return currentFonts.first().data.get("font");
    }
  };

  render() {
    return (
      <span style={FontDropdownStyle}>
        <select value={this.getFontFamily()} onChange={this.onChange}>
          <option disabled hidden value="None" />
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
          <option value="Webdings">Webdings</option>
        </select>
      </span>
    );
  }
}

const FontDropdownStyle = {
  paddingLeft: "20px",
  paddingRight: "10px",
  verticalAlign: "6px"
};

export default FontDropdown;
