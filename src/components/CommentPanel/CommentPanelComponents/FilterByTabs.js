import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

class FilterByTabs extends Component {
  state = {
    filterOptions: ["All", "Content", "Theme", "Grammar"],
    value: 0
  };

  /* Bootstrap nav-tabs class that has tabs that filters comments*/
  componentDidMount() {
    this.props.setFilterFn("All");
  }

  render() {
    const options = [];
    for (const option of this.state.filterOptions) {
      options.push(
        <div label={option} onClick={this.props.setFilterFn.bind(this, option)}>
          {option}
        </div>
      );
    }

    return (
      <div>
        <Tabs
          style={this.tabsStyles}
          value={this.state.value}
          onChange={this.onChangeTab}
          variant="fullWidth"
        >
          {options.map((option, index) => {
            return (
              <Tab
                label={option.props.label}
                style={this.tabStyles}
                key={index}
              />
            );
          })}
        </Tabs>
        <div style={{ height: "50px" }} />
      </div>
    );
  }

  onChangeTab = (event, value) => {
    this.setState({ value: value });
    this.props.setFilterFn(this.state.filterOptions[value]);
  };

  //Styling
  tabsStyles = {
    position: "fixed"
  };
  tabStyles = {
    minWidth: 100 / this.state.filterOptions.length + "%"
  };
}

export default FilterByTabs;
