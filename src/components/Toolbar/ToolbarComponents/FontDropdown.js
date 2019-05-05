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
    this.props.editor.focus();
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
      <div className="dropdown">
        <select value={this.getFontFamily()} onChange={this.onChange}>
          <option disabled hidden value="None" />
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
          <option value="Webdings">Webdings</option>
        </select>
      </div>
    );
  }
}

export default FontDropdown;
