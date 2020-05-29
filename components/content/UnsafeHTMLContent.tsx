import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  FunctionComponent,
} from "react";

import { decodeHTMLEntities } from "../../utilities/text";

const UnsafeHTMLContent: FunctionComponent<{ content: string }> = React.memo(
  ({ content }) => {
    const decodedContent = useMemo(() => decodeHTMLEntities(content), [
      content,
    ]);

    return <div dangerouslySetInnerHTML={{ __html: decodedContent }}></div>;
  }
);

export default UnsafeHTMLContent;
