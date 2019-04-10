import React from "react";
import { Button } from "../../Utils/Buttons";
import Icon from "@material-ui/core/Icon";
import { app } from "../../../App";

const DEFAULT_NODE = "paragraph";

/* Blocks */
export const renderBlockButton = function(type, icon) {
  let isActive = hasBlock(type);

  if (["numbered-list", "bulleted-list"].includes(type)) {
    const {
      value: { document, blocks }
    } = app.state;

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key);
      isActive = hasBlock("list-item") && parent && parent.type === type;
    }
  }

  return (
    <Button
      className="button"
      active={isActive}
      onClick={event => onClickBlock(event, type)}
      id={type}
    >
      <Icon className="button-icon">{icon}</Icon>
    </Button>
  );
};

export const hasBlock = function(type) {
  const { value } = app.state;
  return value.blocks.some(blockNode => blockNode.type === type);
};

export const onClickBlock = function(event, type) {
  event.preventDefault();

  const { editor } = app;
  const { value } = editor;
  const { document } = value;

  // Handle everything but list buttons.
  if (type !== "bulleted-list" && type !== "numbered-list") {
    const isActive = hasBlock(type);
    const isList = hasBlock("list-item");

    if (isList) {
      editor
        .setBlocks(isActive ? DEFAULT_NODE : type)
        .unwrapBlock("bulleted-list")
        .unwrapBlock("numbered-list");
    } else {
      editor.setBlocks(isActive ? DEFAULT_NODE : type);
    }
  } else {
    // Handle the extra wrapping required for list buttons.
    const isList = hasBlock("list-item");
    const isType = value.blocks.some(block => {
      return !!document.getClosest(block.key, parent => parent.type === type);
    });

    if (isList && isType) {
      editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock("bulleted-list")
        .unwrapBlock("numbered-list");
    } else if (isList) {
      editor
        .unwrapBlock(
          type === "bulleted-list" ? "numbered-list" : "bulleted-list"
        )
        .wrapBlock(type);
    } else {
      editor.setBlocks("list-item").wrapBlock(type);
    }
  }
};
