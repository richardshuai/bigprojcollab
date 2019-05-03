import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import CommentForm from "./CommentPanelComponents/CommentForm";
import CommentBox from "./CommentPanelComponents/CommentBox";

export let panel;
class CommentPanel extends Component {
  state = {
    commenting: false
  };

  componentDidMount() {
    panel = this;
  }

  noneditable = () => {
    this.setState({
      commenting: false
    });
  };

  setSortFn = sortFn => {
    this.setState({
      sortFn: sortFn
    });
  };

  setFilterFn = filter => {
    const filterFn = comment => comment.tags.includes(filter);
    this.setState({
      filterFn: filterFn
    });
  };

  render() {
    return (
      <div>
        <SortByDropdown setSortFn={this.setSortFn} />
        {/* {this.props.comments
          .sort(this.state.sortFn)
          .filter(this.state.filterFn)
          .map(comment => (
            <CommentBox comment={comment} />
          ))} */}
        {this.state.commenting ? (
          <CommentForm
            noneditable={this.noneditable}
            scanDocument={this.props.scanDocument}
          />
        ) : null}

        <FilterByTabs setFilterFn={this.setFilterFn} />
      </div>
    );
  }
}

export default CommentPanel;
