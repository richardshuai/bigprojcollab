import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import CommentForm from "./CommentPanelComponents/CommentForm";

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

  render() {
    return (
      <div>
        {/* <SortByDropdown /> */}
        {this.state.commenting ? (
          <CommentForm
            noneditable={this.noneditable}
            scanDocument={this.props.scanDocument}
          />
        ) : null}
        <FilterByTabs comments={this.props.comments} />
      </div>
    );
  }
}

export default CommentPanel;
