import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'
import styles from './alert-modal.module.css'
import { useAlertModal } from '@/stores/alertModalStore'

const AlertModal = () => {
  const {title, isOpen, onClose,  onOk} = useAlertModal();
  const modalRef = useRef<HTMLDialogElement | null>(null)

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
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal()
    }
  }

  useEffect(() => {
    const modalElement = modalRef.current
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal()
      } else {
        modalElement.close()
      }
    }
  }, [isOpen])
  return (
    <dialog className={`${styles["alert-modal"]} ${styles["center-center"]}`} ref={modalRef} onKeyDown={handleKeyDown} onClick={handleClickOverlay}>   
      <p className={styles.title}>{title}</p>
      <div className={styles["btn-group"]}>
      <button className={styles["btn-ok"]} onClick={() => {onOk(); onClose()}}>Đồng ý</button>
      <button className={styles["btn-cancel"]} onClick={() => onClose()}>Hủy</button>
      </div>
    </dialog>
  )
}

export default AlertModal
