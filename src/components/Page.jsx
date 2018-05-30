import styled from "styled-components";
import PropTypes from "prop-types";
import Container from "components/Container";
import { colors, shadows } from "utilities/style";

const Page = styled(Container)`
  background-color: ${colors.backgroundOverlay};
  margin-top: 1rem;
  padding: 1rem;
  box-shadow: ${shadows.y};
`;

Page.propTypes = {
  children: PropTypes.node
};

export default Page;
