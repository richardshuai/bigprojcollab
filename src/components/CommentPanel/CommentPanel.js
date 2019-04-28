import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import CommentForm from "./CommentPanelComponents/CommentForm";

export let panel;
class CommentPanel extends Component {
  state = {
    commenting: false,
    sorting: "default"
  };

  componentDidMount() {
    panel = this;
  }

  noneditable = () => {
    this.setState({
      commenting: false
    });
  };

  sortBy = sort => {
    this.setState({
      sorting: sort
    });
  };
  render() {
    return (
      <div>
        {<SortByDropdown sortBy={this.sortBy} />}
        {this.state.commenting ? (
          <CommentForm
            noneditable={this.noneditable}
            scanDocument={this.props.scanDocument}
          />
        ) : null}
        <FilterByTabs
          comments={this.props.comments}
          sorting={this.state.sorting}
        />
      </div>
    );
  }
}

export default CommentPanel;
