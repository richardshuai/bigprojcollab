import React, { Component } from "react";

export class SortByDropdown extends Component {
  state = {
    text: "Sort By: Default",
    active: "",
    time: "dropdown-item",
    grammar: "dropdown-item",
    content: "dropdown-item"
  };
  onClickButton = (property, e) => {
    this.setState({
      text: "Sort By: " + property
    });
    if (property === "Time") {
      this.setState({
        time: "dropdown-item active",
        grammar: "dropdown-item",
        content: "dropdown-item"
      });
    }
    if (property === "Grammar") {
      this.setState({
        time: "dropdown-item",
        grammar: "dropdown-item active",
        content: "dropdown-item"
      });
    }
    if (property === "Content") {
      this.setState({
        time: "dropdown-item",
        grammar: "dropdown-item",
        content: "dropdown-item active"
      });
    }
  };
  render() {
    return (
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.state.text}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a
            class={this.state.time}
            href="#"
            onClick={this.onClickButton.bind(this, "Time")}
          >
            Time
          </a>
          <a
            class={this.state.grammar}
            href="#"
            onClick={this.onClickButton.bind(this, "Grammar")}
          >
            Grammar
          </a>
          <a
            class={this.state.content}
            href="#"
            onClick={this.onClickButton.bind(this, "Content")}
          >
            Content
          </a>
        </div>
      </div>
    );
  }
}

export default SortByDropdown;
