import React from "react";

export const renderMark = (props, editor, next) => {
  const { attributes, children, mark } = props;

  switch (mark.type) {
    case "bold":
      // return <strong {...attributes}>{children}</strong>;
      return (
        <span style={{ backgroundColor: "#FFFF33" }} {...attributes}>
          {children}
        </span>
      );
    case "italic":
      return <em {...attributes}>{children}</em>;
    case "underlined":
      return <u {...attributes}>{children}</u>;
    case "fontFamily":
      return (
        <font face={mark.data.get("font")} {...attributes}>
          {children}
        </font>
      );
    case "fontSize":
      return (
        <font size={mark.data.get("size")} {...attributes}>
          {children}
        </font>
      );
    case "textColor":
      return (
        <font color={mark.data.get("color")} {...attributes}>
          {children}
        </font>
      );
    case "filterAllDecor":
      return (
        <span style={{ backgroundColor: "#000000" }} {...attributes}>
          {children}
        </span>
      );

    default:
      return next();
  }
};
