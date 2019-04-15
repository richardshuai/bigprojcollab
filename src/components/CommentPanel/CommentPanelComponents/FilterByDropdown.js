import React, { Component } from "react";

class FilterByDowndown extends Component {
  render() {
    return (
      <div className="dropdown">
        <select
          value={this.props.filterValue}
          onChange={this.props.filterChange}
        >
          <option value="All"> All </option>
          <option value="Grammar">Grammar</option>
          <option value="Content">Content</option>
          <option value="hehexD">hehexD</option>
        </select>
      </div>
    );
  }
}

export default FilterByDowndown;
