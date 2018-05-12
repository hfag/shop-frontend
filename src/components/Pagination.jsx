import React from "react";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { colors, shadows } from "utilities/style";

const StyledPagination = styled.div`
	ul {
		list-style: none;
		margin: 1rem auto;
		text-align: center;

		background-color: #fff;
		padding: 0.25rem;
		box-shadow: ${shadows.y};
	}
	li {
		display: inline-block;
		margin-right: 0.5rem;
		cursor: pointer;
	}

	.disabled {
		color: ${colors.disabled};
		cursor: not-allowed;
	}

	.selected {
		border-bottom: ${colors.primary} 1px solid;
		cursor: not-allowed;
	}
`;

/**
 * A pagination component
 * @returns {Component} The component
 */
class Pagination extends React.PureComponent {
	render = () => {
		return (
			<StyledPagination>
				<ReactPaginate {...this.props} />
			</StyledPagination>
		);
	};
}

export default Pagination;
