import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";

export class CommentPanel extends Component {
  render() {
    return (
      <div>
        <SortByDropdown />
      </div>
    );
  }
}

export default CommentPanel;
