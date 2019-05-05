export default function ForceRefresh() {
  let forceRefresh = false;
  return {
    // Cleared after the editor renders once
    componentDidUpdate() {
      forceRefresh = false;
    },
    // This code always returns true (forcing the refresh) until the
    // entire Editor is redrawn at which point `componentDidUpdate` gets
    // called and then this returns null which reverts to normal refresh
    // rules.
    shouldNodeComponentUpdate(props, nextProps) {
      return forceRefresh ? true : null;
    },
    commands: {
      refresh() {
        forceRefresh = true;
      }
    }
  };
}
