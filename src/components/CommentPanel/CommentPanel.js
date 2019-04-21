import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import CommentForm from "./CommentPanelComponents/CommentForm";
export let panel;
class CommentPanel extends Component {
  constructor(props) {
    super(props);
    panel = this;
    this.state = {
      commenting: false
    };
    this.noneditable = this.noneditable.bind(this);
  }

  noneditable() {
    this.setState({
      commenting: false
    });
  }
  render() {
    return (
      <div>
        {/* <SortByDropdown /> */}
        {this.state.commenting ? (
          <CommentForm panel={this.noneditable} />
        ) : null}
        <FilterByTabs comments={this.props.comments} />
      </div>
    );
  }
}

export default CommentPanel;
