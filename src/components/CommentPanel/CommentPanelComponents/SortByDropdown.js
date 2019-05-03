import React, { Component } from "react";

export class SortByDropdown extends Component {
  state = {
    text: "Sort By: Position",
    active: "",
    newest: "dropdown-item",
    oldest: "dropdown-item",
    position: "dropdown-item"
  };

  onClickButton = (property, e) => {
    this.setState({
      text: "Sort By: " + property
    });

    this.props.sortBy(property);
    if (property === "Newest") {
      this.setState({
        newest: "dropdown-item active",
        oldest: "dropdown-item",
        position: "dropdown-item"
      });
    }
    if (property === "Oldest") {
      this.setState({
        newest: "dropdown-item",
        oldest: "dropdown-item active",
        position: "dropdown-item"
      });
    }
    if (property === "Position") {
      this.setState({
        newest: "dropdown-item",
        oldest: "dropdown-item",
        position: "dropdown-item active"
      });
    }
  };

  render() {
    return (
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.state.text}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a
            className={this.state.newest}
            href="#"
            onClick={this.onClickButton.bind(this, "Newest")}
          >
            Newest
          </a>
          <a
            className={this.state.oldest}
            href="#"
            onClick={this.onClickButton.bind(this, "Oldest")}
          >
            Oldest
          </a>
          <a
            className={this.state.position}
            href="#"
            onClick={this.onClickButton.bind(this, "Position")}
          >
            Position
          </a>
        </div>
      </div>
    );
  }
}

export default SortByDropdown;
