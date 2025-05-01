import { type ReactNode, createContext, useContext, useEffect } from 'react';
import UniversalModal from '@/components/UniversalModal';
import { useModalStore } from '@/zustand/modal';

type ModalContextType = {
  showModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalOpen: boolean;
};
export type ModalProps = {
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const { modalOpen, modalContent, showModal, closeModal } = useModalStore();

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'initial';
  }, [modalOpen]);

  const contextValue: ModalContextType = {
    showModal,
    closeModal,
    modalOpen,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalOpen && modalContent && <UniversalModal>{modalContent}</UniversalModal>}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const currentContext = useContext(ModalContext);

  if (!currentContext) {
    throw new Error('useModal must be used within ModalProvider');
  }

  return currentContext;
};
