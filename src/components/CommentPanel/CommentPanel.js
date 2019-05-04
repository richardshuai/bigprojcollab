import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import CommentForm from "./CommentPanelComponents/CommentForm";
import CommentBox from "./CommentPanelComponents/CommentBox";

export let panel;
class CommentPanel extends Component {
  state = {
    commenting: false,
    prevComment: {}
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

  makeEditable = prevComment => {
    this.setState({ commenting: true, prevComment: prevComment });
  };

  render() {
    let visibleComments = [];
    if (this.state.sortFn && this.state.filterFn) {
      visibleComments = this.props.comments
        .sort(this.state.sortFn)
        .filter(this.state.filterFn)
        .map(comment => (
          <CommentBox
            comment={comment}
            makeEditable={this.makeEditable}
            scanDocument={this.props.scanDocument}
          />
        ));
    }

    return (
      <div>
        <SortByDropdown setSortFn={this.setSortFn} />
        <FilterByTabs setFilterFn={this.setFilterFn} />
        {this.state.commenting ? (
          <CommentForm
            noneditable={this.noneditable}
            scanDocument={this.props.scanDocument}
            prevComment={this.state.prevComment}
          />
        ) : null}
        {visibleComments}
      </div>
    );
  }
}

export default CommentPanel;
