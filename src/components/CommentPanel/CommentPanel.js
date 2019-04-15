import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import CommentBox from "./CommentPanelComponents/CommentBox";
import FilterByDropdown from "./CommentPanelComponents/FilterByDropdown";

class CommentPanel extends Component {
  state = {
    filterValue: "All"
  };

  render() {
    return (
      <div>
        {/* <SortByDropdown /> */}
        <FilterByDropdown
          filterValue={this.state.filterValue}
          filterChange={this.filterChange}
        />
        <div>
          {this.props.comments
            .filter(
              comment =>
                comment.tag.includes(this.state.filterValue) ||
                this.state.filterValue === "All"
            )
            .map(comment => (
              <CommentBox
                suggestion={comment.suggestion}
                uniqueKey={comment.uniqueKey}
              />
            ))}
        </div>
      </div>
    );
  }

  filterChange = e => {
    this.setState({ filterValue: e.target.value });
  };
}

export default CommentPanel;
