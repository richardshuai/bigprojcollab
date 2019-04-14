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
    case "comment": {
      return (
        <span
          style={{ backgroundColor: "#09fe69" }}
          onClick={onClickComment.bind(this, node.data)}
          {...attributes}
        >
          {children}
        </span>
      );
    }

    default:
      return next();
  }
};

/* Helper functions */

const onClickLink = function(href, event) {
  window.open(href, "_blank");
};

const onClickComment = function(commentData, event) {
  const suggestion = commentData.get("suggestion");
  alert("Comment: " + suggestion);
};
