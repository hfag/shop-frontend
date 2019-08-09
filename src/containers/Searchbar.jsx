import React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import debounce from "lodash/debounce";
import { withRouter } from "react-router";
import { defineMessages, injectIntl } from "react-intl";

import Flexbar from "../components/Flexbar";
import Link from "../components/Link";
import { colors, shadows } from "../utilities/style";
import { search, reset } from "../actions/product-search";
import {
  getProductSearchSections,
  getLastProductSearchQuery,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import Price from "../components/Price";
import { pathnamesByLanguage } from "../utilities/urls";
import product from "../i18n/product";

const messages = defineMessages({
  placeholder: {
    id: "Searchbar.placeholder",
    defaultMessage: "Suche nach einem Produkt"
  },
  showMore: {
    id: "Searchbar.showMore",
    defaultMessage: "Zeige mehr..."
  }
});

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

const Detail = styled.small`
  font-size: 0.6rem;
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

  z-index: 50;

  &:empty {
    display: none;
  }
`;

const Suggestion = styled.div`
  margin: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover .name {
    text-decoration: underline;
  }

  .price {
    margin-left: auto;
    white-space: nowrap;
  }
`;

const SuggestionTitle = styled.div`
  margin: 0 0.5rem;
  font-size: 1rem;
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
  onSuggestionsFetchRequested = debounce(
    ({ value }) =>
      value.trim() !== "" &&
      value.trim() !== this.props.lastQuery.trim() &&
      this.props.dispatch(search(this.props.languageFetchString, true, value)),
    300
  );
  /**
   * Called when all suggestions should be cleared
   * @returns {void}
   */
  onSuggestionsClearRequested = () => {}; /*this.props.dispatch(reset());*/

  /**
   * Called when a suggestion is selected
   * @param {Event} event The selection event
   * @param {Object} props react-autosuggest props
   * @returns {void}
   */
  onSuggestionSelected = (event, { suggestion }) => {
    const { language } = this.props;
    this.setState({ value: "" });

    switch (suggestion.type) {
      case "product":
        return this.props.dispatch(
          push(
            `/${language}/${pathnamesByLanguage[language].product}/${suggestion.slug}`
          )
        );
      case "product_variation":
        return this.props.dispatch(
          push(
            `/${language}/${pathnamesByLanguage[language].product}/${suggestion.parent_slug}?variationId=${suggestion.id}`
          )
        );
      case "taxonomy":
        return this.props.dispatch(
          push(
            `/${language}/${pathnamesByLanguage[language].productCategory}/${suggestion.slug}/1`
          )
        );
      case "show-more":
        this.props.dispatch(
          push(
            `/${language}/${pathnamesByLanguage[language].search}?query=${this.state.value}`
          )
        );
        return this.setState({ value: "" });
      default:
        return;
    }
  };
  /**
   * Determines whether suggestions should be rendered
   * @returns {boolean} Whether the suggestions should be rendered
   */
  shouldRenderSuggestions = () => this.state.value.length > 2;

  /**
   * Retrieves the suggestions per section
   * @param {Object} section The section object
   * @returns {Array<Object>} The callback function
   */
  getSectionSuggestions = section => [
    ...section.suggestions,
    {
      title: this.props.intl.formatMessage(messages.showMore),
      type: "show-more"
    }
  ];

  /**
   * Renders a suggestion
   * @param {Object} suggestion The suggestion
   * @returns {Component} The component
   */
  renderSuggestion = suggestion => {
    const { intl } = this.props;

    switch (suggestion.type) {
      case "product":
        return (
          <Suggestion>
            <Flexbar>
              <div className="name">{`${suggestion.title} (${
                suggestion.variations
              } ${intl.formatMessage(product.variation)}${
                suggestion.variations > 1 ? "n" : ""
              })`}</div>
              <div className="price">
                {intl.formatMessage(product.from)}{" "}
                <Price>{parseFloat(suggestion.price)}</Price>
              </div>
            </Flexbar>
            <Detail>{suggestion.sku}</Detail>
          </Suggestion>
        );
      case "product_variation":
        return (
          <Suggestion>
            <Flexbar>
              <div className="name">{suggestion.title}</div>
              <div className="price">
                <Price>{parseFloat(suggestion.price)}</Price>
              </div>
            </Flexbar>
            <Detail>{suggestion.sku}</Detail>
          </Suggestion>
        );
      case "taxonomy":
        return (
          <Suggestion>
            <Flexbar>
              <div className="name">{`${suggestion.title} (${
                suggestion.count
              } ${intl.formatMessage(product.product)}${
                suggestion.count > 1 ? "e" : ""
              })`}</div>
              <div className="price" />
            </Flexbar>
          </Suggestion>
        );
      case "show-more":
        return (
          <Suggestion>
            <div className="name">{suggestion.title}</div>
          </Suggestion>
        );
      default:
        return null;
    }
  };

  render = () => {
    const { value } = this.state;
    const { dispatch, sections, lastQuery, intl } = this.props;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: intl.formatMessage(messages.placeholder),
      value,
      onChange: this.onChange,
      onKeyDown: e => {
        if (e.keyCode === 13) {
          if (this.state.value.trim() !== lastQuery.trim()) {
            this.onSuggestionsFetchRequested({ value: this.state.value });
          }
        }
      }
    };

    return (
      <StyledSearch>
        <Autosuggest
          suggestions={sections.filter(
            section => section.suggestions.length > 0
          )}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          renderSuggestionsContainer={renderSuggestionContainer}
          renderInputComponent={renderInputComponent}
          focusInputOnSuggestionClick={false}
          inputProps={inputProps}
          multiSection={true}
          renderSectionTitle={renderSectionTitle}
          getSectionSuggestions={this.getSectionSuggestions}
        />
      </StyledSearch>
    );
  };
}

const mapStateToProps = state => ({
  language: getLanguage(state),
  languageFetchString: getLanguageFetchString(state),
  sections: getProductSearchSections(state),
  lastQuery: getLastProductSearchQuery(state)
});

const TranslatedSearchbar = injectIntl(Searchbar);
const ConnectedSearchbar = connect(mapStateToProps)(TranslatedSearchbar);
export default withRouter(ConnectedSearchbar);
