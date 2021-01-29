import React, { useMemo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { decodeHTMLEntities } from "../utilities/text";
import LightboxGallery from "./LightboxGallery";
import Keyer from "../containers/breadcrumbs/Keyer";
import { fetchAllAttachments } from "../actions/attachments";
import { getLanguageFetchString } from "../reducers";

const UnsafeHTMLContent = React.memo(({ locale, content, dispatch }) => {
  if (!content) {
    return "";
  }

  const [fetchedImages, setFetchedImages] = useState(false);
  const imagesToFetch = useRef([]);

  const decodedContent = useMemo(() => {
    const decoded = decodeHTMLEntities(content);

    //parse html and replace generated gallery with shortcode for compatibility reasons
    //this is not the final solution but rather a workaround for the transition
    const el = document.createElement("div");
    el.innerHTML = decoded;
    el.querySelectorAll(".wp-block-gallery").forEach(gallery => {
      const images = gallery.querySelectorAll("img[data-id]");
      const ids = [];
      images.forEach(image => {
        ids.push(image.getAttribute("data-id"));
      });

      gallery.innerHTML = `[gallery ids="${ids.join(",")}"]`;
    });

    return el.innerHTML;
  }, [content]);

  const shortcodeSplit = useMemo(
    () =>
      decodedContent
        .split(/(\[.*\])/g)
        .filter(s => s)
        .map((s, index) => {
          if (s.startsWith("[gallery")) {
            const regex = /ids=\s*.([0-9,]*)./g;
            const matches = regex.exec(s);
            const ids = matches[1]
              .split(",")
              .map(id => parseInt(id))
              .filter(i => !imagesToFetch.current.includes(i));
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
      const toFetch = imagesToFetch.current;
      dispatch(fetchAllAttachments(50, locale, true, toFetch)).then(() => {
        imagesToFetch.current = imagesToFetch.current.filter(
          e => !toFetch.includes(e)
        );

        setFetchedImages(imagesToFetch.current.length === 0);
      });
    }
  }, [imagesToFetch.current.length]);

  return shortcodeSplit;
});

UnsafeHTMLContent.propTypes = {
  content: PropTypes.string
};

const mapStateToProps = state => ({
  locale: getLanguageFetchString(state)
});

export default connect(mapStateToProps)(UnsafeHTMLContent);
