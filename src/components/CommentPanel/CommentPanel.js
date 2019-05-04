import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import AddCommentForm from "./CommentPanelComponents/AddCommentForm";
import CommentBox from "./CommentPanelComponents/CommentBox";
import shortid from "shortid";

export let panel;
class CommentPanel extends Component {
  state = {
    commenting: false,
    prevComment: {},
    expandedID: ""
  };

  componentDidMount() {
    panel = this;
  }

  render() {
    /* Filters and sorts comments to be seen */
    let visibleComments = [];
    if (this.state.sortFn && this.state.filterFn) {
      visibleComments = this.props.comments
        .sort(this.state.sortFn)
        .filter(this.state.filterFn)
        .map(comment => (
          <CommentBox
            comment={comment}
            scanDocument={this.props.scanDocument}
            expandComment={this.expandComment}
            isExpanded={this.state.expandedID === comment.uniqueKey}
            key={comment.uniqueKey}
            id={comment.uniqueKey}
          />
        ));
    }

    return (
      <div>
        <SortByDropdown setSortFn={this.setSortFn} />
        <FilterByTabs setFilterFn={this.setFilterFn} />
        {this.state.commenting ? (
          <AddCommentForm
            noneditable={this.finishCommenting}
            scanDocument={this.props.scanDocument}
            prevComment={this.state.prevComment}
          />
        ) : null}
        {visibleComments}
      </div>
    );
  }

  setSortFn = sortFn => {
    this.setState({
      sortFn: sortFn
    });
    this.props.scanDocument();
  };

  setFilterFn = filter => {
    const filterFn = comment => comment.tags.includes(filter);
    this.setState({
      filterFn: filterFn
    });
    this.props.scanDocument();
  };

  /* Called from the inline button handler handleCommentClick */
  beginCommenting = () => {
    this.setState({ commenting: true });
  };

  finishCommenting = () => {
    this.setState({
      commenting: false
    });
  };

  expandComment = id => {
    if (this.state.expandedID === id) {
      this.setState({ expandedID: "" });
    } else {
      this.setState({ expandedID: id });
    }
  };
}

export default CommentPanel;
