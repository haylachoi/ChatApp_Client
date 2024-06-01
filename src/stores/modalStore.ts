import { create } from 'zustand';

export enum ModalElement {
  addUser,
  addRoomMember,
  createGroup,
  profile,
  groupManager,
}
interface useModalStoreProps {
  isOpen: boolean;
  currentModal?: ModalElement;
  closeModal: () => void;
  openModal: () => void;
  setCurrentModal: (currentModal: ModalElement | undefined) => void;

  openAddUserModal: () => void;
  openCreateGroupModal: () => void;
  openAddRoomMemberModal: () => void;
}

export const useModalStore = create<useModalStoreProps>()((set, get) => ({
  isOpen: false,

  closeModal: () => set({ isOpen: false }),
  openModal: () => set({ isOpen: true }),
  setCurrentModal: (currentModal) => set({ currentModal }),

  openAddUserModal: () => {
    set({
      currentModal: ModalElement.addUser,
    });
    get().openModal();
  },
  openCreateGroupModal: () => {
    set({
      currentModal: ModalElement.createGroup,
    });
    get().openModal();
  },
  openAddRoomMemberModal: () => {
    set({
      currentModal: ModalElement.addRoomMember,
    });
    get().openModal();
  },
}));

export const useIsModalOpen = () => useModalStore((state) => state.isOpen);
export const useCurrentModal = () =>
  useModalStore((state) => state.currentModal);
export const useAppModalActions = () =>
  useModalStore((state) => {
    const { isOpen, currentModal, ...rest } = state;
    return rest;
  });
