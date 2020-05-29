import React, { FunctionComponent, ReactNode } from "react";
import { Address as AddressType } from "../../schema";

/**
 * Represents one line in an address
 */
const Line: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return children ? <div>{children}</div> : null;
};

/**
 * Formats an address
 */
const Address: FunctionComponent<{ address: AddressType }> = ({ address }) => {
  return (
    <div>
      {/*<Line>{address.additional_line_above}</Line>*/}
      <Line>{address.company}</Line>
      <Line>{address.fullName}</Line>
      {/*<Line>{address.description}</Line>*/}
      <Line>{address.streetLine1}</Line>
      <Line>{address.streetLine2}</Line>
      {/*<Line>{address.post_office_box}</Line>*/}
      <Line>
        {address.country ? address.country + "-" : ""}
        {[address.postalCode, address.city, address.province]
          .filter((x) => x)
          .join(",")}
      </Line>
    </div>
  );
};

export default Address;
