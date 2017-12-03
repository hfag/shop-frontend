import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

const Push = styled.div`
	${props => (props.left ? "margin-left: auto;" : "")} ${props =>
			props.right ? "margin-right: auto;" : ""};
`;

Push.propTypes = {
	children: PropTypes.node,
	left: PropTypes.bool,
	right: PropTypes.bool
};

export default Push;
