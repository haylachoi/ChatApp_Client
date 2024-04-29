import styles from "./modal.module.css"
import { X } from 'lucide-react'
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  hasCloseBtn?: boolean
  onClose: () => void
  children: React.ReactNode
}
const Modal: React.FC<ModalProps> = ({
  isOpen,
  hasCloseBtn,
  onClose,
  children,
}) => {
  const [isModalOpen, setModalOpen] = useState(isOpen)
  const modalRef = useRef<HTMLDialogElement | null>(null)
  // const [isOpen, setIsOpen] = useState(false);
  // const handleClose = () => dialogRef.current?.close();
  // const handleOpen = () => dialogRef.current?.showModal();

  const handleClickOverlay: MouseEventHandler<HTMLDialogElement | null> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientY < rect.top || e.clientY > rect.bottom ||
        e.clientX < rect.left || e.clientX > rect.right) {
        onClose();
    }
  } 
  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
    setModalOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal()
    }
  }

  useEffect(() => {
    setModalOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    const modalElement = modalRef.current
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal()
      } else {
        modalElement.close()
      }
    }
  }, [isModalOpen])
  return (
    <dialog className={`${styles.modal} ${styles["center-center"]}`} ref={modalRef} onKeyDown={handleKeyDown} onClick={handleClickOverlay}>
      {hasCloseBtn && (
        <button className={styles["modal-close-btn"]} onClick={handleCloseModal}>
          <X className={styles["modal-close-icon"]}/>
        </button>
      )}
      {children}
    </dialog>
  )
}

export default Modal
