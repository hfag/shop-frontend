import { FunctionComponent } from "react";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import { borders } from "../utilities/style";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;
const ModalWrapper = styled.div`
  position: absolute;
  top: 2rem;
  width: 40rem;
  height: 25rem;
  left: 50%;
  transform: translateX(-50%);

  background-color: #fff;
  padding: 2rem;
  border-radius: ${borders.radius};

  z-index: 101;

  overflow-y: scroll;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
`;

const CloseModal = styled.div`
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const Modal: FunctionComponent<{ title: string; onClose: () => void }> = ({
  title,
  children,
  onClose,
}) => {
  return (
    <Backdrop>
      <ModalWrapper>
        <ModalTitle>{title}</ModalTitle>
        {children}
        <CloseModal onClick={onClose}>
          <MdClose size={20} />
        </CloseModal>
      </ModalWrapper>
    </Backdrop>
  );
};

export default Modal;
