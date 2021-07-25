import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const UnsafeHTMLContent: FunctionComponent<{ content: string }> = React.memo(
  ({ content }) => {
    return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
  }
);

export default UnsafeHTMLContent;
