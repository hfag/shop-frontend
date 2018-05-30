import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { fetchAttachment } from "actions/attachments";
import { getAttachmentById } from "reducers";
import Placeholder from "components/Placeholder";

const StyledThumbail = styled.div`
  img {
    ${({ longerSide }) =>
      longerSide === "width"
        ? "width: 100%; height: auto;"
        : "height: 100%; width: auto;"};

    /*max-height: 100%;
		max-width: 100%;*/
  }
`;

/**
 * Renders a thumbnail
 * @returns {Component} The component
 */
class Thumbnail extends React.PureComponent {
  constructor() {
    super();

    this.state = { fetched: false, error: false };
  }

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

  /**
   * Called when the image has loaded
   * @param {Event} event The load event
   * @returns {void}
   */
  onImageLoad = event => this.setState({ fetched: true });
  /**
   * Called when the image fetching resulted in an error
   * @param {Event} event The load event
   * @returns {void}
   */
  onImageError = event => {
    this.setState({ error: true });
  };

  render = () => {
    const { id, thumbnail, size = "feuerschutz_fix_width" } = this.props;
    const { fetched, error } = this.state;

    const thumbnailUrl =
      thumbnail && thumbnail.mimeType && thumbnail.mimeType.startsWith("image/")
        ? thumbnail.sizes
          ? thumbnail.sizes[size]
            ? thumbnail.sizes[size].source_url
            : thumbnail.url
          : thumbnail.url
        : "";

    const show = fetched && !error && thumbnail && thumbnailUrl;

    return (
      <StyledThumbail
        longerSide={
          thumbnail && thumbnail.width < thumbnail.height ? "height" : "width"
        }
      >
        {thumbnail &&
          thumbnailUrl && (
            <img
              className={
                thumbnail.width < thumbnail.height ? "b-height" : "b-width"
              }
              onLoad={this.onImageLoad}
              onError={this.onImageError}
              width={thumbnail.width}
              height={thumbnail.height}
              src={thumbnailUrl}
              style={
                show
                  ? {}
                  : { position: "absolute", width: 1, height: 1, zIndex: -1 }
              }
            />
          )}

        {!show && <Placeholder block error={error} />}
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
   * @param {boolean} visualize Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  fetchThumbnail(visualize = true) {
    return dispatch(fetchAttachment(id, visualize));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thumbnail);
