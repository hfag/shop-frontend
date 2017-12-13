import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";

import { fetch as fetchThumbnail } from "actions/attachments";

import { getAttachment } from "reducers";

const StyledThumbail = styled.div`
	img {
		width: 100%;
		height: auto;
	}
`;

class Thumbnail extends React.PureComponent {
	componentWillMount = () => {
		const { fetchThumbnail } = this.props;
		fetchThumbnail();
	};
	render = () => {
		const { id, thumbnail, size = "feuerschutz_fix_width" } = this.props;

		if (!thumbnail || !thumbnail.mimeType) {
			return null;
		}

		const thumbnailUrl = thumbnail.mimeType.startsWith("image/")
			? thumbnail.sizes
				? thumbnail.sizes[size]
					? thumbnail.sizes[size].source_url
					: thumbnail.url
				: thumbnail.url
			: "";

		return (
			<StyledThumbail>
				<img
					width={thumbnail.width}
					height={thumbnail.height}
					src={thumbnailUrl}
				/>
			</StyledThumbail>
		);
	};
}

Thumbnail.propTypes = {
	id: PropTypes.number,
	size: PropTypes.string
};

const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => ({
	fetchThumbnail(id) {
		return id ? dispatch(fetchThumbnail(id)) : undefined;
	}
});

const mergeProps = ({ state }, { fetchThumbnail }, { id }) => ({
	fetchThumbnail() {
		return id ? fetchThumbnail(id) : undefined;
	},
	thumbnail: getAttachment(state, id),
	id
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
	Thumbnail
);
