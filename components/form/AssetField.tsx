import { FaFile } from "react-icons/fa";
import { Field } from "formik";
import { InputFieldWrapper } from "./InputFieldWrapper";
import { borders, colors } from "../../utilities/style";
import { defineMessages, useIntl } from "react-intl";
import ClientOnlyPortal from "../ClientOnlyPortal";
import FileChooser from "../choosers/FileChooser";
import Flexbar from "../layout/Flexbar";
import Modal from "../Modal";
import React, { FunctionComponent, useState } from "react";
import get from "lodash/get";
import styled from "@emotion/styled";

const messages = defineMessages({
  fileSelection: {
    id: "AssetField.fileSelection",
    defaultMessage: "Dateiauswahl",
  },
  chooseFile: {
    id: "AssetField.chooseFile",
    defaultMessage: "Wähle Datei",
  },
});

const ValidationErrors = styled.div`
  color: ${colors.danger};
`;

const FileChooserInput = styled.div`
  cursor: pointer;
  border: ${colors.primary} 1px solid;
  border-radius: ${borders.inputRadius};
  padding: 0.25rem 0.5rem;
`;

const AssetField: FunctionComponent<{
  name: string;
  label?: string;
  required?: boolean;
  marginRight?: number;
  flexGrow?: number;
}> = ({ name, label, required, marginRight, flexGrow }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const intl = useIntl();

  return (
    <>
      <InputFieldWrapper marginRight={marginRight} flexGrow={flexGrow}>
        {label && (
          <label className="input-label" htmlFor={name}>
            {label}{" "}
            {required === true ? "*" : required === false ? "(optional)" : ""}
          </label>
        )}
        <Field name={name}>
          {({
            field: { value /*, onChange, onBlur*/ },
            form: { errors, /*touched, validateForm,*/ setFieldValue },
          }) => (
            <>
              <FileChooserInput onClick={() => setModalOpen(true)}>
                <Flexbar>
                  <FaFile />
                  {value ? value.name : intl.formatMessage(messages.chooseFile)}
                </Flexbar>
              </FileChooserInput>
              <ValidationErrors>{get(errors, name)}</ValidationErrors>
              {modalOpen && (
                <ClientOnlyPortal selector="#modal">
                  <Modal
                    title={intl.formatMessage(messages.fileSelection)}
                    onClose={() => setModalOpen(false)}
                  >
                    <FileChooser
                      onSelect={(asset) => {
                        setFieldValue(name, asset);
                        setModalOpen(false);
                      }}
                    />
                  </Modal>
                </ClientOnlyPortal>
              )}
            </>
          )}
        </Field>
      </InputFieldWrapper>
    </>
  );
};

export default AssetField;
