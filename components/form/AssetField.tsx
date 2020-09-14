import { Field } from "formik";
import { get } from "lodash";
import { FunctionComponent, useState } from "react";
import { FaFile } from "react-icons/fa";
import { defineMessages, useIntl } from "react-intl";
import styled from "styled-components";
import { borders, colors } from "../../utilities/style";
import ClientOnlyPortal from "../ClientOnlyPortal";
import Flexbar from "../layout/Flexbar";
import Modal from "../Modal";
import { InputFieldWrapper } from "./InputFieldWrapper";

const messages = defineMessages({
  fileSelection: {
    id: "AssetField.fileSelection",
    defaultMessage: "Dateiauswahl",
  },
});

const ValidationErrors = styled.div`
  color: ${colors.danger};
`;

const FileChooser = styled.div`
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
        <Field
          name={name}
          render={({
            field: { value, onChange, onBlur },
            form: { values, errors, touched, validateForm },
          }) => (
            <div>
              <FileChooser onClick={() => setModalOpen(true)}>
                <Flexbar>
                  <FaFile />
                  hi.pdf
                </Flexbar>
              </FileChooser>
              <ValidationErrors>{get(errors, name)}</ValidationErrors>
            </div>
          )}
        />
      </InputFieldWrapper>
      {modalOpen && (
        <ClientOnlyPortal selector="#modal">
          <Modal
            title={intl.formatMessage(messages.fileSelection)}
            onClose={() => setModalOpen(false)}
          >
            hi
          </Modal>
        </ClientOnlyPortal>
      )}
    </>
  );
};

export default AssetField;
