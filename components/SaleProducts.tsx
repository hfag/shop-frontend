import { IntlShape, defineMessages, useIntl } from "react-intl";
import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { PostPreview } from "../utilities/wordpress";
import { borders, shadows } from "../utilities/style";
import { pathnamesByLanguage } from "../utilities/urls";
import Box from "./layout/Box";
import Flex from "./layout/Flex";
import StyledImage from "./elements/StyledImage";
import StyledLink from "./elements/StyledLink";

const messages = defineMessages({
  newsAndDiscounts: {
    id: "SaleProducts.newsAndDiscounts",
    defaultMessage: "News und Aktionen",
  },
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

const PostComponent: FunctionComponent<{ intl: IntlShape; post: PostPreview }> =
  ({ intl, post }) => (
    <Box widths={[1, 1 / 2, 1 / 2, 1 / 3, 1 / 3]} paddingX={0.5} marginTop={1}>
      <SaleWrapper>
        <StyledLink
          href={`/${intl.locale}/${
            pathnamesByLanguage.post.languages[intl.locale]
          }/${post.slug}`}
          noHover
        >
          <Flex>
            <Box widths={[1, 1, 1, 1 / 2, 1 / 3]} paddingRight={0.5}>
              <StyledImage
                src={post.thumbnail.url}
                width={post.thumbnail.width}
                height={post.thumbnail.height}
                alt={post.thumbnail.alt || post.title}
              />
            </Box>
            <Box widths={[1, 1, 1, 1 / 2, 2 / 3]} paddingLeft={0.5}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
              <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
            </Box>
          </Flex>
        </StyledLink>
      </SaleWrapper>
    </Box>
  );

//TODO translation

/*const ProductComponent: FunctionComponent<{
  intl: IntlShape;
  productSlug: string;
  variant: ProductVariant;
  promotion: Promotion;
}> = ({ intl, productSlug, variant, promotion }) => {
  return (
    <Box widths={[1, 1, 1, 1 / 3, 1 / 3]} paddingX={2} marginTop={3}>
      <SaleWrapper>
        <StyledLink
          href={`/${intl.locale}/${
            pathnamesByLanguage.product.languages[intl.locale]
          }/${productSlug}?sku=${variant.sku}`}
          noHover
        >
          <DiscountLogo>
            <FaPercent />
          </DiscountLogo>

          <Flex>
            <Box widths={[1, 1, 1, 1 / 2, 1 / 2]} paddingRight={2}>
              <Asset asset={variant.featuredAsset} />
            </Box>
            <Box widths={[1, 1, 1, 1 / 2, 1 / 2]} paddingLeft={2}>
              <h3
                dangerouslySetInnerHTML={{
                  __html: product.name,
                }}
              />
              <p>
                Statt <s>{variant.price}</s>{" "}
                <strong>
                  <Price>{variant.price}</Price>
                </strong>
              </p>
              <p>
                Nur{" "}
                {promotion.endsAt ? (
                  <span>
                    bis am{" "}
                    <strong>
                      {new Date(promotion.endsAt).toLocaleDateString()}
                    </strong>
                    !
                  </span>
                ) : (
                  "für kurze Zeit!"
                )}
              </p>
            </Box>
          </Flex>
        </StyledLink>
      </SaleWrapper>
    </Box>
  );
};*/

const SaleProducts: FunctionComponent<{ posts: PostPreview[] }> = React.memo(
  ({ posts = [] }) => {
    const intl = useIntl();

    return (
      <div>
        <h2 style={{ marginBottom: 0 }}>
          {intl.formatMessage(messages.newsAndDiscounts)}
        </h2>
        <Flex flexWrap="wrap" marginX>
          {posts.map((post) => (
            <PostComponent intl={intl} post={post} key={post.slug} />
          ))}
          {/*saleProducts.map((product) => (
            <ProductComponent
              language={language}
              product={product}
              key={product.id}
            />
          ))*/}
        </Flex>
      </div>
    );
  }
);

export default SaleProducts;
