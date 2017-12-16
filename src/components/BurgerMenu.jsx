import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { elastic as Menu } from "react-burger-menu";
import { decorator as reduxBurgerMenu } from "redux-burger-menu";

import Link from "components/Link";

import HomeIcon from "react-icons/lib/fa/home";
import SearchIcon from "react-icons/lib/fa/search";
import CartIcon from "react-icons/lib/fa/shopping-cart";
import CheckoutIcon from "react-icons/lib/fa/money";
import AccountIcon from "react-icons/lib/fa/user";
import SignInIcon from "react-icons/lib/fa/sign-in";

import { getLoggedIn } from "reducers";
import { colors } from "utilities/style";

const BurgerLogo = styled.img`
	width: 100%;
	height: auto;

	margin-bottom: 2rem;
`;
const BurgerList = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;
`;
const BurgerItem = styled.li`
	margin: 0 0 0.5rem 0;
	padding: 0 0 0.5rem 0;
	${({ seperator }) =>
		seperator ? `border-bottom: ${colors.primaryContrast} 1px solid;` : ""};

	svg {
		margin-right: 0.5rem;
	}
`;

const ReduxBurgerMenu = reduxBurgerMenu(Menu);

class BurgerMenu extends React.PureComponent {
	render = () => {
		const { loggedIn } = this.props;

		return (
			<ReduxBurgerMenu right>
				<BurgerLogo src="/img/logo/name_slogan_negative.svg" />
				<BurgerList>
					<BurgerItem seperator>
						<Link to="https://feuerschutz.ch" negative flex>
							<HomeIcon />Zu unserer Homepage
						</Link>
					</BurgerItem>
					<BurgerItem seperator>
						<Link to="/search" negative flex>
							<SearchIcon />Suche
						</Link>
					</BurgerItem>
					<BurgerItem>
						<Link to="/cart" negative flex>
							<CartIcon />Warenkorb
						</Link>
					</BurgerItem>
					<BurgerItem seperator>
						<Link to="/checkout" negative flex>
							<CheckoutIcon />Zur Kasse
						</Link>
					</BurgerItem>
					<BurgerItem>
						<Link to="/account" negative flex>
							{loggedIn ? (
								<span>
									<AccountIcon />Mein Konto
								</span>
							) : (
								<span>
									<SignInIcon />Login
								</span>
							)}
						</Link>
					</BurgerItem>
				</BurgerList>
			</ReduxBurgerMenu>
		);
	};
}

const mapStateToProps = state => ({
	loggedIn: getLoggedIn(state)
});

export default connect(mapStateToProps)(BurgerMenu);
