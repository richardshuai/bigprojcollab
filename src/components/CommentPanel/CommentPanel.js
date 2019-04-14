import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import CommentBox from "./CommentPanelComponents/CommentBox";

export class CommentPanel extends Component {
  render() {
    return (
      <div>
        <SortByDropdown />
        <CommentBox />
      </div>
    );
  }
}

export default CommentPanel;
