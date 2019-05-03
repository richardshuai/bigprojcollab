import React, { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tab";

class FilterByTabs extends Component {
  state = {
    key: "home"
  };
  /* Bootstrap nav-tabs class that has tabs that filters comments*/
  componentDidMount() {
    this.props.setFilterFn("All");
  }

  render() {
    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={this.state.key}
        onSelect={key => this.setState({ key })}
      >
        <Tab eventKey="home" title="Home">
          hi
        </Tab>
        <Tab eventKey="profile" title="Profile" />
        <Tab eventKey="contact" title="Contact" disabled />
      </Tabs>
    );
  }
}

export default FilterByTabs;
