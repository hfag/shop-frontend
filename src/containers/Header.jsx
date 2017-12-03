import React from "react";
import { connect } from "react-redux";

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

import MenuIcon from "react-icons/lib/md/menu";
import SearchIcon from "react-icons/lib/fa/search";
import CartIcon from "react-icons/lib/fa/shopping-cart";
import CheckoutIcon from "react-icons/lib/fa/money";
import AccountIcon from "react-icons/lib/fa/user";
import SignInIcon from "react-icons/lib/fa/sign-in";

class Header extends React.PureComponent {
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
										<NavItem>
											<img src="/img/logo/name_slogan_negative.svg" />
										</NavItem>
									</Flexbar>
								</Link>
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
												<Link onClick={() => {}} negative>
													<SearchIcon size="35" />
												</Link>
											</NavItem>
											<NavItem seperator>
												<Link onClick={() => {}} negative>
													<CartIcon size="35" />
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
