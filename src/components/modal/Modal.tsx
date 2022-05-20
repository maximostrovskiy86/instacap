import React, {useState, useEffect} from "react";
// import {createPortal} from "react-dom";
import style from "./Modal.module.scss";
import CloseBtn from "@/components/icon/CloseBtn";


interface Props {
  children: React.ComponentProps<any>;
  toggleModal: () => void;
}

// const modalRoot = document.querySelector('#modal-root');

const Modal = ({children,  toggleModal}: Props) => {

  useEffect(() => {
    window.addEventListener("keydown", onHandleEscape);
    // @ts-ignore
    const body: HTMLBodyElement  = document.querySelector("body");
    body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onHandleEscape);
      // @ts-ignore
      const body: HTMLBodyElement = document.querySelector("body");
      body.style.overflow = "auto";
    };
  });

  // @ts-ignore
  const onHandleEscape = (e) => e.code === "Escape" && toggleModal();
  // @ts-ignore
  const onOverlayClose = (e) => e.target === e.currentTarget && toggleModal();


  // return createPortal(
  return (
    <div className={style.overlay} onClick={onOverlayClose}>
      <div className="flex flex-col w-2/5 h-96 min-h-min p-7 bg-white">
      {/*<div className={`${style.modal} w-480 p-30 bg-white`}>*/}
        <div className="close-button" onClick={toggleModal}>
          <CloseBtn />
        </div>
        {children}
        <div className="cursor-pointer mt-auto mx-auto w-inline-block">
          <button onClick={toggleModal}>Close</button>
        </div>
      </div>

    </div>
    // // @ts-ignore
    // modalRoot,
  );
}

export default Modal;
