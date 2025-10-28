import ConfirmIllustration from "@/assets/illustration/confirm-illustration";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: (reason?: string) => void;
  hasTextArea?: boolean;
  textPlaceHolder?: string;
};

export default function RejectPODialog({
  open,
  onOpenChange,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  actionLabel = "Xác nhận",
  onAction,
  hasTextArea = false,
  textPlaceHolder = "",
}: Props) {
  const [textInput, setTextInput] = useState("");

  const handleConfirm = () => {
    // Execute the action if provided
    if (onAction) {
      onAction(textInput);
    }
    // Close the dialog
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose asChild>
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none text-3xl"
        >
          &times;
        </button>
      </DialogClose>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[735px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <ConfirmIllustration className="size-60" />
        </div>
        {hasTextArea && (
          <div>
            <Textarea
              placeholder={textPlaceHolder}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button className="px-12 py-6 text-base" variant="outline">
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="px-12 py-6 text-base"
            disabled={textInput.trim().length <= 0 && hasTextArea}
            onClick={handleConfirm}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
