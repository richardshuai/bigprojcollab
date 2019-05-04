import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import AddCommentForm from "./CommentPanelComponents/AddCommentForm";
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

  /* Called from the inline button handler handleCommentClick */
  beginCommenting = () => {
    this.setState({ commenting: true });
  };

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
          />
        ));
    }

    return (
      <div>
        <SortByDropdown setSortFn={this.setSortFn} />
        <FilterByTabs setFilterFn={this.setFilterFn} />
        {this.state.commenting ? (
          <AddCommentForm
            noneditable={this.noneditable}
            scanDocument={this.props.scanDocument}
            prevComment={this.state.prevComment}
          />
        ) : null}
        {visibleComments}
      </div>
    );
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
    this.props.scanDocument();
  };

  setFilterFn = filter => {
    const filterFn = comment => comment.tags.includes(filter);
    this.setState({
      filterFn: filterFn
    });
    this.props.scanDocument();
  };
}

export default CommentPanel;
