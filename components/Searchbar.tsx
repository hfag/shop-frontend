import React, { FunctionComponent, useState, useCallback } from "react";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import debounce from "lodash/debounce";
import { defineMessages, injectIntl, useIntl } from "react-intl";
import { Router, useRouter } from "next/router";

import Flexbar from "./layout/Flexbar";
import { colors, shadows } from "../utilities/style";
import Price from "./Price";
import { pathnamesByLanguage } from "../utilities/urls";
import product from "../i18n/product";

const messages = defineMessages({
  placeholder: {
    id: "Searchbar.placeholder",
    defaultMessage: "Suchen Sie nach einem Produkt",
  },
  showMore: {
    id: "Searchbar.showMore",
    defaultMessage: "Zeige mehr...",
  },
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
const getSuggestionValue = (suggestion) => suggestion.title;

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
const renderInputComponent = (inputProps) => {
  return <SearchInput {...inputProps} />;
};

/**
 * Renders the section title
 * @param {Object} section The section object
 * @returns {Component} The component
 */
const renderSectionTitle = (section) => {
  return <SuggestionTitle>{section.title}</SuggestionTitle>;
};

const Searchbar: FunctionComponent<{}> = ({}) => {
  const [value, setValue] = useState("");
  const [sections, setSections] = useState([]);
  const intl = useIntl();
  const router = useRouter();

  const onChange = useCallback((event, { newValue }) => {
    setValue(newValue);
  }, []);

  const onSuggestionsFetchRequested = useCallback(
    debounce(
      ({ value }: { value: string }) =>
        value.trim() !== "" &&
        //value.trim() !== this.props.lastQuery.trim() &&
        alert("searching for " + value),
      /*this.props.dispatch(
          search(this.props.languageFetchString, true, value)
        ),*/
      300
    ),
    []
  );

  const onSuggestionsClearRequested = useCallback(() => {}, []);

  const onSuggestionSelected = useCallback(
    (
      event: Event,
      {
        suggestion,
      }: {
        suggestion: {
          type: string;
          slug: string;
          id: string;
          parent_slug: string;
        };
      }
    ) => {
      setValue("");

      switch (suggestion.type) {
        case "product":
          return router.push(
            `/${intl.locale}/${
              pathnamesByLanguage.product.languages[intl.locale]
            }/${suggestion.slug}`
          );
        case "product_variation":
          return router.push(
            `/${intl.locale}/${
              pathnamesByLanguage.product.languages[intl.locale]
            }/${suggestion.parent_slug}?variationId=${suggestion.id}`
          );
        case "taxonomy":
          return router.push(
            `/${intl.locale}/${
              pathnamesByLanguage.productCategory.languages[intl.locale]
            }/${suggestion.slug}`
          );
        case "show-more":
          router.push(
            `/${intl.locale}/${
              pathnamesByLanguage.search.languages[intl.locale]
            }?query=${this.state.value}`
          );
          setValue("");
          return;
        default:
          return;
      }
    },
    []
  );

  const shouldRenderSuggestions = useCallback(() => value.length > 2, []);

  const getSectionSuggestions = useCallback(
    (section: { suggestions: { title: string; type: string }[] }) => [
      ...section.suggestions,
      {
        title: intl.formatMessage(messages.showMore),
        type: "show-more",
      },
    ],
    []
  );

  const renderSuggestion = useCallback((suggestion) => {
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
  }, []);

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: intl.formatMessage(messages.placeholder),
    value,
    onChange,
    onKeyDown: (e) => {
      if (e.keyCode === 13) {
        if (false /*this.state.value.trim() !== lastQuery.trim()*/) {
          onSuggestionsFetchRequested({ value: this.state.value });
        }
      }
    },
  };

  return (
    <StyledSearch>
      <Autosuggest
        suggestions={sections.filter(
          (section) => section.suggestions.length > 0
        )}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        shouldRenderSuggestions={shouldRenderSuggestions}
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
export default Searchbar;
