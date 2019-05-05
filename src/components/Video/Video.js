import React, { Component } from "react";
import Webcam from "react-webcam";

export class Video extends Component {
  render() {
    return <Webcam width="150" height="200" />;
  }
}

export default Video;
