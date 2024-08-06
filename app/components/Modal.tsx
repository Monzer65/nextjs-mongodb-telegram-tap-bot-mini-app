"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  header: string;
  body: {
    image: string;
    name: string;
    cost: number;
  };
}

const Modal = ({ isOpen, onClose, onConfirm, header, body }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div
        ref={modalRef}
        className={`w-full max-w-md mx-auto overflow-hidden rounded-lg bg-white shadow-xl modal ${
          isOpen ? "modal-open" : "modal-close"
        }`}
      >
        <div className='bg-gray-100 px-6 py-4 border-b'>
          <h3 className='text-lg font-bold text-gray-900'>{header}</h3>
        </div>
        <div className='p-6'>
          <div className='grid place-items-center'>
            <Image
              src={body.image}
              alt={body.name}
              width={50}
              height={50}
              className='rounded-md object-fill'
            />
            <p>You want to upgrade the {body.name} booster</p>
            <p>
              Cost to upgrade:{" "}
              <span className='text-yellow-500 font-bold'>{body.cost}</span>
            </p>
          </div>
        </div>
        <div className='flex justify-end p-6 border-t border-gray-200'>
          <button
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded'
            onClick={handleClose}
          >
            Cancel
          </button>{" "}
          <button
            className='ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
