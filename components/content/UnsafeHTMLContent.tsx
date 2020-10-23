import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  FunctionComponent,
} from "react";

const UnsafeHTMLContent: FunctionComponent<{ content: string }> = React.memo(
  ({ content }) => {
    return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
  }
);

export default UnsafeHTMLContent;
