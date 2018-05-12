import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import debouce from "lodash/debounce";
import Flexbar from "components/Flexbar";
import Link from "components/Link";
import { colors, shadows } from "utilities/style";
import { search, reset } from "actions/product-search";
import { getProductSearchSections } from "reducers";

const StyledSearch = styled.div`
	position: relative;

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		padding: 0;
	}
`;

const SuggestionContainer = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;

	padding: 1rem;

	max-height: 80vh;
	overflow-y: scroll;

	color: ${colors.primary};
	background-color: ${colors.backgroundOverlay};
	box-shadow: ${shadows.y};

	border-bottom-left-radius: 0.2rem;
	border-bottom-right-radius: 0.2rem;

	z-index: 1000;

	&:empty {
		display: none;
	}
`;

const Suggestion = styled.div`
	margin: 0.5rem;
	cursor: pointer;

	&:hover .name {
		text-decoration: underline;
	}

	.price {
		margin-left: auto;
	}
`;

const SuggestionTitle = styled.div`
	margin: 0 0.5rem;
	font-size: 1.2rem;
	font-weight: 500;
	border-bottom: ${colors.primary} 1px solid;
`;

const SearchInput = styled.input`
	padding: 0.5rem 0.75rem;
	font-size: 1rem;

	border: none;
	border-radius: 0.2rem;
	height: 100%;
	width: 100%;

	&:focus {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
`;

/**
 * Gets the suggestions' value
 * @param {Object} suggestion The suggestion
 * @returns {any} The suggestion value
 */
const getSuggestionValue = suggestion => suggestion.title;

/**
 * Renders a suggestion
 * @param {Object} suggestion The suggestion
 * @returns {Component} The component
 */
const renderSuggestion = suggestion => 
	<Suggestion>
		<Flexbar>
			<div className="name">{`${suggestion.title} (${
				suggestion.variations
			} Variante${suggestion.variations > 1 ? "n" : ""})`}</div>
			<div className="price">ab {suggestion.price}</div>
		</Flexbar>
	</Suggestion>
;

/**
 * Renders the suggstion wrapper
 * @param {Object} props react-autosuggest props
 * @returns {Component} The component
 */
const renderSuggestionContainer = ({ containerProps, children, query }) => {
	return (
		<SuggestionContainer {...containerProps}>{children}</SuggestionContainer>
	);
};

/**
 * Renders the input field
 * @param {Object} inputProps The input props
 * @returns {Component} The component
 */
const renderInputComponent = inputProps => {
	return <SearchInput {...inputProps} />;
};

/**
 * Renders the section title
 * @param {Object} section The section object
 * @returns {Component} The component
 */
const renderSectionTitle = section => {
	return <SuggestionTitle>{section.title}</SuggestionTitle>;
};

/**
 * Retrieves the suggestions per section
 * @param {Object} section The section
 * @returns {Array<Object>} An array of suggestions
 */
const getSectionSuggestions = section => section.suggestions;

/**
 * The searchbar component
 * @returns {Component} The component
 */
class Searchbar extends React.PureComponent {
	constructor() {
		super();
		this.state = { value: "" };
	}

	/**
	 * Called when the value changes
	 * @param {Event} event The change event
	 * @param {Object} props react-autosuggest props
	 * @returns {void}
	 */
	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue
		});
	};

	/**
	 * Called when the suggestions should be fetched
	 * @returns {void}
	 */
	onSuggestionsFetchRequested = ({ value }) =>
		this.props.dispatch(search(value));
	/**
	 * Called when all suggestions should be cleared
	 * @returns {void}
	 */
	onSuggestionsClearRequested = () => this.props.dispatch(reset());

	/**
	 * Called when a suggestion is selected
	 * @param {Event} event The selection event
	 * @param {Object} props react-autosuggest props
	 * @returns {void}
	 */
	onSuggestionSelected = (event, { suggestion }) =>
		this.props.dispatch(push(suggestion.url));
	/**
	 * Determines whether suggestions should be rendered
	 * @returns {boolean} Whether the suggestions should be rendered
	 */
	shouldRenderSuggestions = () => this.state.value.length > 2;

	render = () => {
		const { value } = this.state;
		const { sections } = this.props;

		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			placeholder: "Suche nach einem Produkt",
			value,
			onChange: this.onChange
		};

		return (
			<StyledSearch>
				<Autosuggest
					suggestions={sections}
					onSuggestionsFetchRequested={debouce(
						this.onSuggestionsFetchRequested,
						300
					)}
					onSuggestionsClearRequested={this.onSuggestionsClearRequested}
					onSuggestionSelected={this.onSuggestionSelected}
					shouldRenderSuggestions={this.shouldRenderSuggestions}
					getSuggestionValue={getSuggestionValue}
					renderSuggestion={renderSuggestion}
					renderSuggestionsContainer={renderSuggestionContainer}
					renderInputComponent={renderInputComponent}
					focusInputOnSuggestionClick={false}
					inputProps={inputProps}
					multiSection={true}
					renderSectionTitle={renderSectionTitle}
					getSectionSuggestions={getSectionSuggestions}
				/>
			</StyledSearch>
		);
	};
}

const mapStateToProps = state => ({
	sections: getProductSearchSections(state)
});

export default connect(mapStateToProps)(Searchbar);
