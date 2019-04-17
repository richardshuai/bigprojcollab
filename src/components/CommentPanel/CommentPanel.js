import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";

class CommentPanel extends Component {
  render() {
    return (
      <div>
        {/* <SortByDropdown /> */}
        <FilterByTabs comments={this.props.comments} />
      </div>
    );
  }
}

export default CommentPanel;
