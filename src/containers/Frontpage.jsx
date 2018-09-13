import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Flex, Box } from "grid-styled";
import ProductCategories from "containers/ProductCategories";
import FaPercent from "react-icons/lib/fa/percent";

import Link from "../components/Link";
import { getSales, getProducts, getStickyPosts } from "../reducers";
import Thumbnail from "./Thumbnail";
import Price from "../components/Price";
import { colors, shadows, borders } from "../utilities/style";

const SalesFlex = styled(Flex)`
  margin: 0 -0.5rem;
`;

const SaleWrapper = styled.div`
  position: relative;
  padding: 0.5rem;
  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};
  word-break: break-word;
  hyphens: auto;

  h3 {
    margin-top: 0;
  }

  p {
    margin: 0;
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

/**
 * The front page
 * @returns {Component} The component
 */
class Frontpage extends React.PureComponent {
  render = () => {
    const { saleProducts, posts } = this.props;
    return (
      <div>
        {(saleProducts.length > 0 || posts.length > 0) && (
          <div>
            <h2 style={{ marginBottom: 0 }}>News und Aktionen</h2>
            <SalesFlex flexWrap="wrap">
              {posts.map(post => (
                <Box width={[1, 1, 1 / 3, 1 / 3]} px={2} mt={3} key={post.slug}>
                  <SaleWrapper>
                    <Link to={`/beitrag/${post.slug}`}>
                      <Flex>
                        <Box width={[1, 1, 1 / 2, 1 / 2]} pr={2}>
                          <Thumbnail id={post.thumbnailId} />
                        </Box>
                        <Box width={[1, 1, 1 / 2, 1 / 2]} pl={2}>
                          <h3
                            dangerouslySetInnerHTML={{ __html: post.title }}
                          />
                          <div
                            dangerouslySetInnerHTML={{
                              __html: post.description
                            }}
                          />
                        </Box>
                      </Flex>
                    </Link>
                  </SaleWrapper>
                </Box>
              ))}
              {saleProducts.map(product => (
                <Box
                  width={[1, 1, 1 / 3, 1 / 3]}
                  px={2}
                  mt={3}
                  key={product.id}
                >
                  <SaleWrapper>
                    <Link
                      to={`/produkt/${product.slug}?variationId=${
                        product.variationId
                      }`}
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
                                  {new Date(
                                    product.saleEnd * 1000
                                  ).toLocaleDateString()}
                                </strong>!
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
              ))}
            </SalesFlex>
          </div>
        )}
        <h2>Kategorien</h2>
        <ProductCategories />
      </div>
    );
  };
}

const mapStateToProps = state => {
  const sales = getSales(state),
    saleProductIds = sales.map(sale => sale.productId);
  const products = getProducts(state);

  return {
    saleProducts: products
      .filter(product => saleProductIds.includes(product.id))
      .map(product => ({
        ...sales.find(s => s.productId == product.id),
        ...product
      })),
    posts: getStickyPosts(state)
  };
};

export default connect(mapStateToProps)(Frontpage);
