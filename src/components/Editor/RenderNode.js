import React from "react";
import { app } from "../../App";

export const renderNode = function(props, editor, next) {
  const { attributes, children, node } = props;

  switch (node.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "justify":
      return (
        <div align="justify" {...attributes}>
          {children}
        </div>
      );
    case "align-right":
      return (
        <div align="right" {...attributes}>
          {children}
        </div>
      );
    case "align-center":
      return (
        <div align="center" {...attributes}>
          {children}
        </div>
      );
    case "align-left":
      return (
        <div align="left" {...attributes}>
          {children}
        </div>
      );
    case "link": {
      return (
        <a
          {...attributes}
          href={node.data.get("href")}
          onClick={onClickLink.bind(this, node.data.get("href"))}
        >
          {children}
        </a>
      );
    }
    case "tempAddComment": {
      return (
        <span style={{ backgroundColor: "#FFFF33" }} {...attributes}>
          {children}
        </span>
      );
    }
    case "comment": {
      if (hasFilterTag(node)) {
        return displayTagProperties(props);
      }
      return next();
    }

    default:
      return next();
  }
};

/* Helper functions */

const hasFilterTag = node => {
  return node.data.get("tags").includes(app.state.activeFilter);
};

/* Allows separate handling for different comment tags, depending on the filter */
const displayTagProperties = props => {
  const { attributes, children, node } = props;

  const filter = app.state.activeFilter;
  if (node.data.get("isFocused")) {
    return (
      <span
        style={{ backgroundColor: "#BBC400" }}
        onClick={onClickComment.bind(this, node.data)}
        {...attributes}
      >
        {children}
      </span>
    );
  }
  if (filter === "All") {
    return (
      <span
        style={{ backgroundColor: "#FFD500" }}
        onClick={onClickComment.bind(this, node.data)}
        {...attributes}
      >
        {children}
      </span>
    );
  } else if (filter === "Content") {
    return (
      <span
        style={{ backgroundColor: "#FA84FA" }}
        onClick={onClickComment.bind(this, node.data)}
        {...attributes}
      >
        {children}
      </span>
    );
  } else if (filter === "Theme") {
    return (
      <span
        style={{ backgroundColor: "#84E3FA" }}
        onClick={onClickComment.bind(this, node.data)}
        {...attributes}
      >
        {children}
      </span>
    );
  } else if (filter === "Grammar") {
    return (
      <span
        style={{ backgroundColor: "#84FAA8" }}
        onClick={onClickComment.bind(this, node.data)}
        {...attributes}
      >
        {children}
      </span>
    );
  }
};

const onClickLink = function(href, event) {
  window.open(href, "_blank");
};

const onClickComment = function(commentData, event) {
  app.expandCommentFromInline(commentData.get("uniqueKey"));
  event.stopPropagation();
};
