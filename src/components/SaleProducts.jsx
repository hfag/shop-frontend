import React from "react";
import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import { FaPercent } from "react-icons/fa";
import { defineMessages, injectIntl } from "react-intl";

import Link from "./Link";
import Price from "./Price";
import Thumbnail from "../containers/Thumbnail";
import { colors, shadows, borders } from "../utilities/style";
import { pathnamesByLanguage } from "../utilities/urls";
import SalesFlex from "./Flex";
import UnsafeHTMLContent from "./UnsafeHTMLContent";

const messages = defineMessages({
  newsAndDiscounts: {
    id: "SaleProducts.newsAndDiscounts",
    defaultMessage: "News und Aktionen"
  }
});

const SaleWrapper = styled.div`
  position: relative;
  padding: 0.5rem;
  background-color: #fff;

  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};
  word-break: break-word;
  hyphens: auto;
  height: 100%;

  h3 {
    margin-top: 0;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    font-weight: 300;
  }
`;

const DiscountLogo = styled.span`
  position: absolute;
  top: -1rem;
  right: -1rem;

  padding: 0.25rem;
  color: #fff;
  width: 2rem;
  height: 2rem;
  font-size: 1.15rem;
  display: inline-block;

  background-color: ${colors.danger};
  border-radius: 50%;

  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Post = React.memo(({ language, post }) => {
  return (
    <Box width={[1, 1, 1 / 2, 1 / 3]} px={2} mt={3}>
      <SaleWrapper>
        <Link
          to={`/${language}/${pathnamesByLanguage[language].post}/${post.slug}`}
        >
          <Flex>
            <Box width={[1, 1, 1 / 2, 1 / 3]} pr={2}>
              <Thumbnail id={post.thumbnailId} />
            </Box>
            <Box width={[1, 1, 1 / 2, 2 / 3]} pl={2}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
              <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
            </Box>
          </Flex>
        </Link>
      </SaleWrapper>
    </Box>
  );
});

const Product = React.memo(({ language, product }) => {
  return (
    <Box width={[1, 1, 1 / 3, 1 / 3]} px={2} mt={3}>
      <SaleWrapper>
        <Link
          to={`/${language}/${pathnamesByLanguage[language].product}/${product.slug}?variationId=${product.variationId}`}
        >
          <DiscountLogo>
            <FaPercent />
          </DiscountLogo>

          <Flex>
            <Box width={[1, 1, 1 / 2, 1 / 2]} pr={2}>
              <Thumbnail id={product.thumbnailId} />
            </Box>
            <Box width={[1, 1, 1 / 2, 1 / 2]} pl={2}>
              <h3
                dangerouslySetInnerHTML={{
                  __html: product.title
                }}
              />
              <p>
                Statt <s>{product.price}</s>{" "}
                <strong>
                  <Price>{parseFloat(product.salePrice)}</Price>
                </strong>
              </p>
              <p>
                Nur{" "}
                {product.saleEnd ? (
                  <span>
                    bis am{" "}
                    <strong>
                      {new Date(product.saleEnd * 1000).toLocaleDateString()}
                    </strong>
                    !
                  </span>
                ) : (
                  "für kurze Zeit!"
                )}
              </p>
            </Box>
          </Flex>
        </Link>
      </SaleWrapper>
    </Box>
  );
});

const SaleProducts = React.memo(
  injectIntl(({ language, posts = [], saleProducts = [], intl }) => {
    return (
      <div>
        <h2 style={{ marginBottom: 0 }}>
          {intl.formatMessage(messages.newsAndDiscounts)}
        </h2>
        <SalesFlex flexWrap="wrap">
          {posts.map(post => (
            <Post language={language} post={post} key={post.slug} />
          ))}
          {saleProducts.map(product => (
            <Product language={language} product={product} key={product.id} />
          ))}
        </SalesFlex>
      </div>
    );
  })
);

export default SaleProducts;
