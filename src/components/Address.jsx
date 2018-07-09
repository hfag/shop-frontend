import React from "react";

/**
 * Represents one line in an address
 * @returns {Component} The component
 */
class Line extends React.PureComponent {
  render = () => {
    return this.props.children ? <div>{this.props.children}</div> : null;
  };
}

/**
 * Formats an address
 * @returns {Component} The component
 */
class Address extends React.PureComponent {
  render = () => {
    const { address } = this.props;

    return (
      <div>
        <Line>{address.additional_line_above}</Line>
        <Line>{address.company}</Line>
        <Line>
          {address.first_name} {address.last_name}
        </Line>
        <Line>{address.description}</Line>
        <Line>{address.address_1}</Line>
        <Line>{address.address_2}</Line>
        <Line>{address.post_office_box}</Line>
        <Line>
          {address.country}-{address.postcode}, {address.city}, {address.state}
        </Line>
      </div>
    );
  };
}

export default Address;
