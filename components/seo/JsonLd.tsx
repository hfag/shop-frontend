import React, { FunctionComponent } from "react";

/**
 * Renders the passed json as json-ld
 */
const JsonLd: FunctionComponent = ({ children }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(children),
      }}
    />
  );
};

export default JsonLd;
