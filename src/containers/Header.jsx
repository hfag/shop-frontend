import React from "react";
import { connect } from "react-redux";

import { CSSTransitionGroup } from "react-transition-group";
import styled from "styled-components";

import { action as toggleBurgerMenuAction } from "redux-burger-menu";
import { colors } from "style-utilities";

import { getBurgerMenuOpen } from "reducers";

import Container from "components/Container";
import Flexbar from "components/Flexbar";
import Push from "components/Push";
import Circle from "components/Circle";
import Link from "components/Link";
import MediaQuery from "components/MediaQuery";
import BurgerMenu from "components/BurgerMenu";
import NavItem from "components/NavItem";
import Navbar from "components/Navbar";

import Searchbar from "containers/Searchbar";

import MenuIcon from "react-icons/lib/md/menu";
import SearchIcon from "react-icons/lib/fa/search";
import CartIcon from "react-icons/lib/fa/shopping-cart";
import CheckoutIcon from "react-icons/lib/fa/money";
import AccountIcon from "react-icons/lib/fa/user";
import SignInIcon from "react-icons/lib/fa/sign-in";

const Counter = styled.div`
	margin-left: 0.5rem;
	font-size: 1.25rem;
`;

const StyledSearch = styled.div`
	width: 100%;
	margin-right: 1rem;

	input {
		padding: 0.5rem 0.75rem;
		font-size: 1rem;

		border: none;
		border-radius: 0.2rem;
		height: 100%;
		width: 100%;
	}

	.searchbar-enter {
		opacity: 0.01;
		width: 0;

		margin-left: auto;
	}

	.searchbar-enter.searchbar-enter-active {
		opacity: 1;
		width: 100%;
		transition: all 500ms linear;
	}

	.searchbar-leave {
		opacity: 1;
		width: 100%;

		margin-left: auto;
	}

	.searchbar-leave.searchbar-leave-active {
		opacity: 0.01;
		width: 0;
		transition: all 300ms linear;
	}
`;

const AnimatedSlogan = styled.div`
	height: 100%;

	.slogan-enter {
		opacity: 0.01;
		width: 0;
	}

	.slogan-enter.slogan-enter-active {
		opacity: 1;
		transition: all 500ms linear;
	}

	.slogan-leave {
		opacity: 1;
		width: 0;
	}

	.slogan-leave.slogan-leave-active {
		opacity: 0.01;
		transition: all 300ms linear;
	}
`;

class Header extends React.PureComponent {
	constructor() {
		super();
		this.state = { searchVisible: false };
	}
	render = () => {
		const { toggleBurgerMenu } = this.props;

		return (
			<div>
				<BurgerMenu />
				<header>
					<Navbar>
						<Container>
							<Flexbar>
								<Link to="/">
									<Flexbar>
										<NavItem>
											<img src="/img/logo/logo_negative.svg" />
										</NavItem>
										<CSSTransitionGroup
											component={AnimatedSlogan}
											transitionName="slogan"
											transitionEnterTimeout={500}
											transitionLeaveTimeout={300}
										>
											{!this.state.searchVisible && (
												<NavItem>
													<img src="/img/logo/name_slogan_negative.svg" />
												</NavItem>
											)}
										</CSSTransitionGroup>
									</Flexbar>
								</Link>
								<CSSTransitionGroup
									component={StyledSearch}
									transitionName="searchbar"
									transitionEnterTimeout={500}
									transitionLeaveTimeout={300}
								>
									{this.state.searchVisible && <Searchbar />}
								</CSSTransitionGroup>
								<Push left>
									<MediaQuery md down>
										<NavItem>
											<Link onClick={toggleBurgerMenu} negative>
												<MenuIcon size="40" />
											</Link>
										</NavItem>
									</MediaQuery>
									<MediaQuery md up>
										<Flexbar>
											<NavItem seperator>
												<Link
													onClick={() => {
														this.setState({
															searchVisible: !this.state.searchVisible
														});
													}}
													negative
												>
													<SearchIcon size="30" />
												</Link>
											</NavItem>
											<NavItem seperator>
												<Link onClick={() => {}} negative unstyled flex>
													<CartIcon size="35" />
													<Counter>
														<Circle
															negative
															filled
															width="1.75rem"
															height="1.75rem"
															padding="0"
															inline
														>
															0
														</Circle>
													</Counter>
												</Link>
											</NavItem>
											<NavItem>
												<Link to="/account" negative>
													<Circle negative padding="0.35rem">
														<SignInIcon size="30" />
													</Circle>
												</Link>
											</NavItem>
										</Flexbar>
									</MediaQuery>
								</Push>
							</Flexbar>
						</Container>
					</Navbar>
				</header>
			</div>
		);
	};
}

const mapStateToProps = state => ({
	isBurgerMenuOpen: getBurgerMenuOpen(state)
});

const mapDispatchToProps = dispatch => ({
	setBurgerMenu(open) {
		dispatch(toggleBurgerMenuAction(open));
	}
});

const mergeProps = ({ isBurgerMenuOpen }, { setBurgerMenu }, ownProps) => ({
	toggleBurgerMenu() {
		setBurgerMenu(!isBurgerMenuOpen);
	},
	...ownProps
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Header);
