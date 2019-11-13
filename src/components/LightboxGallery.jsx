import React, { useState, useReducer } from "react";
import styled from "styled-components";
import Lightbox from "react-images";
import { Flex, Box } from "reflexbox";
import { injectIntl, defineMessages } from "react-intl";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Thumbnail from "../containers/Thumbnail";
import { getAttachmentById } from "../reducers";

const messages = defineMessages({
  imageXOfY: {
    id: "LightboxGallery.imageXOfY",
    defaultMessage: "von"
  },
  previousImage: {
    id: "LightboxGallery.previousImage",
    defaultMessage: "Vorheriges Bild (linke Pfeiltaste)"
  },
  nextImage: {
    id: "LightboxGallery.nextImage",
    defaultMessage: "Nächstes Bild (rechte Pfeiltaste)"
  },
  closeLightbox: {
    id: "LightboxGallery.closeLightBox",
    defaultMessage: "Schliessen (Esc)"
  }
});

const LightboxBox = styled(Box)`
  cursor: zoom-in;
`;

const GalleryFlex = styled(Flex)`
  margin: 0 -0.5rem !important;
`;

/**
 * State reducer for the lightbox component
 * @param {Object} state The current state
 * @param {Object} action The reducer action
 * @returns {Object} The new state
 */
const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_LIGHTBOX":
      return { currentImage: action.index, isOpen: true };
    case "NEXT_IMAGE":
      return {
        currentImage: Math.min(state.currentImage + 1, action.maxIndex),
        isOpen: true
      };
    case "PREVIOUS_IMAGE":
      return {
        currentImage: Math.max(state.currentImage - 1, 0),
        isOpen: true
      };
    case "GOTO_IMAGE":
      return {
        currentImage: action.index,
        isOpen: true
      };
    case "CLOSE_LIGHTBOX":
      return { currentImage: state.currentImage, isOpen: false };
    default:
      throw new Error("Undefined action");
  }
};

const LightboxGallery = React.memo(
  injectIntl(
    ({ intl, galleryImageIds, galleryAttachments, passive = false }) => {
      const [{ isOpen, currentImage }, dispatch] = useReducer(reducer, {
        currentImage: 0,
        isOpen: false
      });

      return (
        <React.Fragment>
          <GalleryFlex flexWrap="wrap">
            {galleryImageIds.map((imageId, index) => (
              <LightboxBox
                key={imageId}
                width={[1 / 2, 1 / 2, 1 / 4, 1 / 6]}
                px={2}
                mb={2}
                onClick={() => dispatch({ type: "OPEN_LIGHTBOX", index })}
              >
                <Thumbnail id={imageId} size="thumbnail" passive={passive} />
              </LightboxBox>
            ))}
          </GalleryFlex>
          <Lightbox
            images={galleryAttachments
              .filter(e => e)
              .map(attachment => ({
                src: attachment.url || "",
                /*caption: attachment.caption,*/
                /*srcSet: Object.values(attachment.sizes)
          .sort((a, b) => a.width - b.width)
          .map(size => `${size.source_url} ${size.width}w`),*/
                thumbnail:
                  attachment.sizes &&
                  attachment.sizes.thumbnail &&
                  attachment.sizes.thumbnail.source_url
              }))}
            isOpen={isOpen}
            currentImage={currentImage}
            onClickPrev={() => dispatch({ type: "PREVIOUS_IMAGE" })}
            onClickNext={() =>
              dispatch({
                type: "NEXT_IMAGE",
                maxIndex: galleryImageIds.length - 1
              })
            }
            onClose={() => dispatch({ type: "CLOSE_LIGHTBOX" })}
            imageCountSeparator={` ${intl.formatMessage(messages.imageXOfY)} `}
            leftArrowTitle={intl.formatMessage(messages.previousImage)}
            rightArrowTitle={intl.formatMessage(messages.nextImage)}
            closeButtonTitle={intl.formatMessage(messages.closeLightbox)}
            backdropClosesModal={true}
            preventScroll={false}
            showThumbnails={true}
            onClickThumbnail={index => dispatch({ type: "GOTO_IMAGE", index })}
            theme={{}}
          />
        </React.Fragment>
      );
    }
  )
);

LightboxGallery.propTypes = {
  galleryImageIds: PropTypes.arrayOf(PropTypes.number),
  passive: PropTypes.bool
};

const mapStateToProps = (state, { galleryImageIds }) => ({
  galleryAttachments: galleryImageIds.map(imageId =>
    getAttachmentById(state, imageId)
  )
});

export default connect(mapStateToProps)(LightboxGallery);
