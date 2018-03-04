import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";

import { fetchAttachment } from "actions/attachments";

import { getAttachmentById } from "reducers";

import Placeholder from "components/Placeholder";

const StyledThumbail = styled.div`
	img {
		width: 100%;
		height: auto;
	}
`;

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
	onImageLoad = event => {
		this.setState({ fetched: true });
	};

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
			<StyledThumbail>
				{thumbnail &&
					thumbnailUrl && (
						<img
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
	fetchThumbnail() {
		return dispatch(fetchAttachment(id));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);
