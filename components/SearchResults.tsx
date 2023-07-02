import { Query, SearchResult } from "../schema";
import { SEARCH } from "../gql/search";
import { useIntl } from "react-intl";
import Card from "./layout/Card";
import CollectionItem from "./collection/CollectionItem";
import Flex from "./layout/Flex";
import InfiniteScroll from "react-infinite-scroller";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import SearchItem from "./product/SearchItem";
import request from "../utilities/request";
import search from "../i18n/search";

const ITEMS_PER_PAGE = 10;

const searchRequest = (
  locale: string,
  term: string,
  groupByProduct: boolean,
  skip: number,
  take: number
) => {
  return request<{ search: Query["search"] }>(locale, SEARCH, {
    input: { term, groupByProduct, skip, take },
  }).then((data) => {
    data.search.items.sort((a, b) => b.score - a.score);
    return data.search;
  });
};

const SearchResults: FunctionComponent<{ term: string }> = ({ term }) => {
  const intl = useIntl();

  const [groupByProduct, setGroupByProduct] = useState(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  //use mutable object here to allow async loading. insert by search index
  const items = useRef<{ [key: number]: SearchResult } | null>(null);
  //workaround for infinite scroll page issues
  const nextPage = useRef<number>(1);
  //then update nextItem to trigger re-render
  const [nextItem, setNextItem] = useState<number>(0);
  const [isFetching, setFetching] = useState<boolean>(false);

  //if one of these changes, refetch
  useEffect(() => {
    setFetching(true);
    searchRequest(intl.locale, term, groupByProduct, 0, ITEMS_PER_PAGE).then(
      (results) => {
        setTotalItems(results.totalItems);
        items.current = results.items.reduce((obj, element, index) => {
          obj[index] = element;
          return obj;
        }, {});
        setNextItem(ITEMS_PER_PAGE);
        nextPage.current = 1;

        setFetching(false);
      }
    );
  }, [term, groupByProduct]);

  /*useEffect(() => {
    //if the items change, verify whether the latest item is still in the array
    if(!items.current[nextItem]){
      //if not, our current state is invalid and should be nuked
      setN
    }
  }, [items.current]);*/

  const loadMore = useCallback(() => {
    //use the current one
    const page = nextPage.current;
    //and update it s.t. the next loadMore call loads the next page
    nextPage.current++;

    if (isFetching || !items || (page - 1) * ITEMS_PER_PAGE >= totalItems) {
      return;
    }
    const base = page * ITEMS_PER_PAGE;

    return searchRequest(
      intl.locale,
      term,
      groupByProduct,
      base,
      ITEMS_PER_PAGE
    ).then((newResults) => {
      const results = items.current;

      if (results) {
        newResults.items.forEach((item, index) => {
          results[base + index] = item;
        });

        setNextItem(Math.max(nextItem, base + newResults.items.length));
      }
    });
  }, [isFetching, term, groupByProduct]);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={!isFetching && items.current && nextItem < totalItems}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {items.current ? (
          totalItems === 0 ? (
            <>{intl.formatMessage(search.noResults)}</>
          ) : (
            <>
              <Card>
                {intl.formatMessage(search.groupByProducts)}:{" "}
                <input
                  type="checkbox"
                  checked={groupByProduct}
                  onChange={() => setGroupByProduct(!groupByProduct)}
                />
                <br />
                {totalItems} {intl.formatMessage(search.productsFound)}
              </Card>

              <Flex
                flexWrap="wrap"
                style={{
                  overflowX: "hidden",
                  paddingTop: "3rem",
                  marginTop: "-3rem",
                }}
                marginX
              >
                {Object.values(items.current).map((item) => (
                  <SearchItem
                    key={"product-" + item.sku}
                    result={item}
                    groupByProduct={groupByProduct}
                  />
                ))}
              </Flex>
            </>
          )
        ) : (
          <>
            <Flex
              flexWrap="wrap"
              style={{
                overflowX: "hidden",
                paddingTop: "3rem",
                marginTop: "-3rem",
              }}
              marginX
            >
              {new Array(12).fill(0).map((el, index) => (
                <CollectionItem key={index} />
              ))}
            </Flex>
          </>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default SearchResults;
