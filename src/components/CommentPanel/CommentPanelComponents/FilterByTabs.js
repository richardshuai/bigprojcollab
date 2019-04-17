import React, { Component } from "react";
import CommentBox from "./CommentBox";

class FilterByTabs extends Component {
  /* Bootstrap nav-tabs class that has tabs that filters comments*/
  render() {
    return (
      <div class="tagtabs">
        <ul class="nav nav-tabs" id="filterTabs" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link active"
              id="all-tab"
              data-toggle="tab"
              href="#all"
              role="tab"
              aria-controls="all"
              aria-selected="true"
            >
              All
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="grammar-tab"
              data-toggle="tab"
              href="#grammar"
              role="tab"
              aria-controls="grammar"
              aria-selected="false"
            >
              Grammar
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="theme-tab"
              data-toggle="tab"
              href="#theme"
              role="tab"
              aria-controls="theme"
              aria-selected="false"
            >
              Theme
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="content-tab"
              data-toggle="tab"
              href="#content"
              role="tab"
              aria-controls="content"
              aria-selected="false"
            >
              Content
            </a>
          </li>
        </ul>

        <div class="tab-content">
          <div
            class="tab-pane active"
            id="all"
            role="tabpanel"
            aria-labelledby="all-tab"
          >
            {this.props.comments.map(comment => (
              <CommentBox
                suggestion={comment.suggestion}
                uniqueKey={comment.uniqueKey}
              />
            ))}
          </div>
          <div
            class="tab-pane"
            id="grammar"
            role="tabpanel"
            aria-labelledby="grammar-tab"
          >
            {this.props.comments
              .filter(comment => comment.tag.includes("Grammar"))
              .map(comment => (
                <CommentBox
                  suggestion={comment.suggestion}
                  uniqueKey={comment.uniqueKey}
                />
              ))}
          </div>
          <div
            class="tab-pane"
            id="theme"
            role="tabpanel"
            aria-labelledby="theme-tab"
          >
            {this.props.comments
              .filter(comment => comment.tag.includes("Theme"))
              .map(comment => (
                <CommentBox
                  suggestion={comment.suggestion}
                  uniqueKey={comment.uniqueKey}
                />
              ))}
          </div>
          <div
            class="tab-pane"
            id="content"
            role="tabpanel"
            aria-labelledby="content-tab"
          >
            {this.props.comments
              .filter(comment => comment.tag.includes("Content"))
              .map(comment => (
                <CommentBox
                  suggestion={comment.suggestion}
                  uniqueKey={comment.uniqueKey}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default FilterByTabs;
