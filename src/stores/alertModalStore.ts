import { create } from "zustand";

interface useAlertModalProps {
 isOpen: boolean;
 title: string;
 onOk: () => void;

 setTitle: (title: string) => void;
 setOnOk: (onOk: () => void) => void;
 onOpen: () => void;
 onClose: () => void;
}

export const useAlertModal = create<useAlertModalProps>()((set) => ({
  isOpen: false,
  title: '',
  onOk: () => {},

  setTitle: (title) => set({title}),
  setOnOk: (onOk) => set({onOk}),
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false}),
}))

export const useAlertModalActions = () => useAlertModal((state) => {
  const {isOpen, title, onOk, ...rest} = state;
  return {...rest};
})