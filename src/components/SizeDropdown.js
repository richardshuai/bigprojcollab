import React, { Component } from "react";

class SizeDropdown extends Component {
  onChange = e => {
    for (const sizeMark of this.getAllSelectedSizesArray()) {
      this.props.editor.removeMark({
        type: "fontSize",
        data: { size: sizeMark.data.get("size") }
      });
    }

    this.props.editor.addMark({
      type: "fontSize",
      data: { size: e.target.value }
    });
  };

  hasSizeMark = () => {
    const { value } = this.props.state;
    return value.marks.some(mark => mark.type === "fontSize");
  };

  getAllSelectedSizesArray = () => {
    const { value } = this.props.state;
    return value.marks.filter(mark => mark.type === "fontSize");
  };

  getFontSize = () => {
    const currentSizes = this.getAllSelectedSizesArray();
    if (currentSizes.size === 0) {
      return "1";
    } else if (currentSizes.size > 1) {
      return "None";
    } else {
      return currentSizes.first().data.get("size");
    }
  };

  render() {
    return (
      <span style={SizeDropdownStyle}>
        <select value={this.getFontSize()} onChange={this.onChange}>
          <option disabled hidden value="None" />
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
      </span>
    );
  }
}

const SizeDropdownStyle = {
  paddingLeft: "20px",
  paddingRight: "10px",
  verticalAlign: "6px"
};

export default SizeDropdown;
