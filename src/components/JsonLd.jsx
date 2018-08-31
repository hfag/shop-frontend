import React from "react";

/**
 * Renders the passed json as json-ld
 * @returns {Component} The component
 */
class JsonLd extends React.PureComponent {
  render = () => {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(this.props.children)
        }}
      />
    );
  };
}

export default JsonLd;
