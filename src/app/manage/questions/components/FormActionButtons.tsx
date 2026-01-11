import React, { MouseEventHandler } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";

type FormActionButtonsProps = {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  isUpdating: boolean;
};

export const FormActionButtons = ({ onCancel, isUpdating }: FormActionButtonsProps) => {
  return (
    <div className="flex gap-3 pt-4 border-t">
      <Button type="submit" variant="secondary" onClick={onCancel} className="flex-1">
        Cancel
      </Button>

      <Button
        type="submit"
        className="flex-1 bg-[#3380fc] hover:bg-[#2970eb] transition flex items-center justify-center gap-2"
      >
        {isUpdating ? (
          "Updating..."
        ) : (
          <>
            Save <Save size={20} />
          </>
        )}
      </Button>
    </div>
  );
};
