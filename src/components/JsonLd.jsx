import React from "react";

/**
 * Renders the passed json as json-ld
 * @returns {Component} The component
 */
class JsonLd extends React.PureComponent {
  render = () => {
    return (
      <script type="application/ld+json">
        {JSON.stringify(this.props.children)}
      </script>
    );
  };
}

export default JsonLd;
