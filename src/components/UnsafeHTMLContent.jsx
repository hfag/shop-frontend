import React, { useMemo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import { decodeHTMLEntities } from "../utilities/text";
import LightboxGallery from "./LightboxGallery";
import Keyer from "../containers/breadcrumbs/Keyer";
import { fetchAllAttachments } from "../actions/attachments";
import { getLanguageFetchString } from "../reducers";

const UnsafeHTMLContent = React.memo(
  injectIntl(({ locale, content, dispatch }) => {
    if (!content) {
      return "";
    }

    const [fetchedImages, setFetchedImages] = useState(false);
    const imagesToFetch = useRef([]);

    const decodedContent = useMemo(() => decodeHTMLEntities(content), [
      content
    ]);

    const shortcodeSplit = useMemo(
      () =>
        decodedContent
          .split(/(\[.*\])/g)
          .filter(s => s)
          .map((s, index) => {
            if (s.startsWith("[gallery")) {
              const regex = /ids=.([0-9,]*)./g;
              const matches = regex.exec(s);
              const ids = matches[1].split(",").map(id => parseInt(id));
              imagesToFetch.current.push(...ids);

              return (
                <LightboxGallery key={index} galleryImageIds={ids} passive />
              );
            }

            return (
              <div key={index} dangerouslySetInnerHTML={{ __html: s }}></div>
            );
          }),
      [decodedContent]
    );

    useEffect(() => {
      if (imagesToFetch.current.length === 0) {
        setFetchedImages(true);
      } else {
        //we got more, yikes
        dispatch(fetchAllAttachments(50, locale, true, imagesToFetch.current));
      }
    }, [imagesToFetch.current.length]);

    return shortcodeSplit;
  })
);

UnsafeHTMLContent.propTypes = {
  content: PropTypes.string
};

const mapStateToProps = state => ({
  locale: getLanguageFetchString(state)
});

export default connect(mapStateToProps)(UnsafeHTMLContent);
