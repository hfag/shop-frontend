import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Flex, Box } from "grid-styled";

import Container from "components/Container";
import Thumbnail from "containers/Thumbnail";

const Category = styled.div``;

class Categories extends React.PureComponent {
	render = () => {
		const { categories } = this.props;

		return (
			<Container>
				<Flex wrap>
					{categories.map(category => (
						<Box key={category.id} width={[1, 1 / 2, 1 / 3, 1 / 4]} p={2}>
							<Category>
								<Thumbnail id={category.thumbnailId} />
							</Category>
						</Box>
					))}
				</Flex>
			</Container>
		);
	};
}

Categories.propTypes = {
	categories: PropTypes.arrayOf(PropTypes.object)
};

export default Categories;
