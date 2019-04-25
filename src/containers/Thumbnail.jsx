import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { LazyImage } from "react-lazy-images";

import { fetchAttachment } from "../actions/attachments";
import { getAttachmentById } from "../reducers";
import Placeholder from "../components/Placeholder";
import { borders } from "../utilities/style";

const StyledThumbail = styled.div`
  img {
    width: 100%;
    height: auto;

    border-radius: ${borders.radius};
  }
`;

/**
 * Renders a thumbnail
 * @returns {Component} The component
 */
class Thumbnail extends React.PureComponent {
  componentWillMount = () => {
    const { id, fetchThumbnail, thumbnail } = this.props;

    if (id > 0 && !thumbnail) {
      fetchThumbnail();
    }
  };

  componentDidUpdate() {
    const { id, fetchThumbnail, thumbnail } = this.props;

    if (id > 0 && !thumbnail) {
      fetchThumbnail();
    }
  }

  render = () => {
    const { id, thumbnail, size = "thumbnail" } = this.props;

    const thumbnailUrl =
      thumbnail && thumbnail.mimeType && thumbnail.mimeType.startsWith("image/")
        ? thumbnail.sizes
          ? thumbnail.sizes[size]
            ? thumbnail.sizes[size].source_url
            : thumbnail.url
          : thumbnail.url
        : "";

    return (
      <StyledThumbail>
        {thumbnail && thumbnailUrl ? (
          <LazyImage
            src={thumbnailUrl}
            alt={thumbnail.caption}
            placeholder={({ imageProps, ref }) => (
              <div ref={ref}>
                <Placeholder block />
              </div>
            )}
            actual={({ imageProps }) => (
              <img
                {...imageProps}
                className={
                  thumbnail.width < thumbnail.height ? "b-height" : "b-width"
                }
                width={thumbnail.width}
                height={thumbnail.height}
                /*srcSet={Object.values(thumbnail.sizes)
                  .sort((a, b) => a.width - b.width)
                  .map(size => `${size.source_url} ${size.width}w`)}*/
              />
            )}
          />
        ) : (
          <Placeholder block />
        )}
      </StyledThumbail>
    );
  };
}

Thumbnail.propTypes = {
  id: PropTypes.number,
  size: PropTypes.string
};

const mapStateToProps = (state, { id }) => ({
  thumbnail: getAttachmentById(state, id)
});
const mapDispatchToProps = (dispatch, { id }) => ({
  /**
   * Fetches a thumbnail
   * @param {string} language The language string
   * @param {boolean} visualize Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  fetchThumbnail(language, visualize = true) {
    return dispatch(fetchAttachment(id, language, visualize));
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches a thumbnail
   * @param {boolean} visualize Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  fetchThumbnail(visualize = true) {
    return mapDispatchToProps.fetchAttachment(
      id,
      mapStateToProps.languageFetchString,
      visualize
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Thumbnail);
