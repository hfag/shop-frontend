import { Address as AddressType, Mutation } from "../../schema";
import { AppContext } from "../AppContext";
import { DELETE_CUSTOMER_ADDRESS, GET_CURRENT_CUSTOMER } from "../../gql/user";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Unavailable } from "../administrator/Unavailable";
import { defineMessages, useIntl } from "react-intl";
import { mutate } from "swr";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useRouter } from "next/router";
import ActionButton from "../ActionButton";
import Button from "../elements/Button";
import Placeholder from "../elements/Placeholder";
import React, { FunctionComponent, useCallback, useContext } from "react";
import StyledLink from "../elements/StyledLink";
import Table from "../elements/Table";
import address from "../../i18n/address";
import request from "../../utilities/request";
import styled from "@emotion/styled";

const messages = defineMessages({
  address: {
    id: "AccountAddresses.address",
    defaultMessage: "Adresse",
  },
  addresses: {
    id: "AccountAddresses.addresses",
    defaultMessage: "Adressen",
  },
  noAddresses: {
    id: "AccountAddresses.noAddresses",
    defaultMessage: "Es wurden bisher keine Adressen hinterlegt.",
  },
  newAddress: {
    id: "AccountAddresses.newAddress",
    defaultMessage: "Neue Adresse erstellen",
  },
});

const AddressWrapper = styled.div`
  h2 {
    margin-top: 0;
  }
`;

const AccountAddresses: FunctionComponent<{
  addresses?: AddressType[] | null;
}> = React.memo(({ addresses }) => {
  const intl = useIntl();
  const router = useRouter();
  const { user, customer, token } = useContext(AppContext);

  const deleteAddress = useCallback(
    (id: string) => async () => {
      //if it doesn't work the UI won't update and the user knows it wasn't deleted.
      await request<Mutation["deleteCustomerAddress"]>(
        intl.locale,
        DELETE_CUSTOMER_ADDRESS,
        { id }
      );
      mutate([GET_CURRENT_CUSTOMER, token]);
    },
    [token]
  );

  if (!customer && user) {
    return <Unavailable />;
  }

  return (
    <AddressWrapper>
      <h2>{intl.formatMessage(messages.addresses)}</h2>
      {addresses && addresses.length === 0 && (
        <div>{intl.formatMessage(messages.noAddresses)}</div>
      )}
      <Table>
        <thead>
          <tr>
            <th>{intl.formatMessage(messages.address)}</th>
            <th>{intl.formatMessage(address.defaultShippingAddress)}</th>
            <th>{intl.formatMessage(address.defaultBillingAddress)}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {addresses
            ? addresses.map((address) => (
                <tr key={address.id}>
                  <td>
                    <StyledLink
                      href={`/${intl.locale}/${
                        pathnamesByLanguage.account.languages[intl.locale]
                      }/${
                        pathnamesByLanguage.account.pathnames.address.languages[
                          intl.locale
                        ]
                      }/${address.id}`}
                      underlined
                    >
                      {[
                        address.company,
                        address.fullName,
                        address.streetLine1,
                        address.streetLine2,
                        address.postalCode + " " + address.city,
                      ]
                        .filter((e) => e)
                        .join(", ")}
                    </StyledLink>
                  </td>
                  <td>
                    {address.defaultShippingAddress ? <FaCheckCircle /> : "-"}
                  </td>
                  <td>
                    {address.defaultBillingAddress ? <FaCheckCircle /> : "-"}
                  </td>
                  <td>
                    <ActionButton>
                      <MdDelete onClick={deleteAddress(address.id)} />
                    </ActionButton>
                  </td>
                </tr>
              ))
            : new Array(3).fill(undefined).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Placeholder height={1} text />
                  </td>
                  <td>
                    <Placeholder height={1} text />
                  </td>
                  <td>
                    <Placeholder height={1} text />
                  </td>
                  <td></td>
                </tr>
              ))}
        </tbody>
      </Table>
      <br />
      <Button
        onClick={() =>
          router.push(
            `/${intl.locale}/${
              pathnamesByLanguage.account.languages[intl.locale]
            }/${
              pathnamesByLanguage.account.pathnames.address.languages[
                intl.locale
              ]
            }/new`
          )
        }
      >
        {intl.formatMessage(messages.newAddress)}
      </Button>
    </AddressWrapper>
  );
});

export default AccountAddresses;
