import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  actionBtnText?: string;
  alertTitle?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  actionBtnText,
  alertTitle,
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ${
        !isOpen ? "hidden" : ""
      }`}
    >
      <div className="bg-white p-5 rounded shadow-lg max-w-md mx-6 md:mx-auto">
        <h3 className="text-lg font-semibold">
          {alertTitle ? alertTitle : "Confirm Delete"}
        </h3>
        <p className="mt-2">{message}</p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="ml-2">
            {actionBtnText ? actionBtnText : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
