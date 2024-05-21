import { create } from 'zustand';

export enum ModalElement {
    addUser,
    createGroup,
    profile,
    groupManager,
}
interface useModalStoreProps {
    isOpen: boolean;
    currentModal?: ModalElement
    closeModal: () => void;
    openModal: () => void;
    setCurrentModal: (currentModal: ModalElement | undefined) => void;
}

const useModalStore = create<useModalStoreProps>()((set) => ({
    isOpen: false,
   
    closeModal: () => set({isOpen: false}),
    openModal: () => set({isOpen: true}),
    setCurrentModal: (currentModal) => set({currentModal})
}));

export const useIsModalOpen= () => useModalStore((state) => state.isOpen);
export const useCurrentModal= () => useModalStore((state) => state.currentModal);
export const useAppModalActions= () => useModalStore((state) => {
    const {isOpen, currentModal, ...rest} = state;
    return rest;
});
