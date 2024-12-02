import { Trash } from "lucide-react";
import { useState } from "react";
import { getRows } from "../../services/actions";
import baseAxios from "../../services/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function DeleteModal({ row, setData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const rangeArr = Object.keys(row);
  const rangeKeys = [rangeArr[0], rangeArr[rangeArr.length - 1]].join(":");
  const range = `Sheet1!${rangeKeys}`;
  const sheetId = localStorage.getItem("sheet-id");

  const handleDelete = async () => {
    setIsLoading(true);
    const url = `/${sheetId}/values/${range}:clear`;
    try {
      const response = await baseAxios.post(url, {});
      if (response?.status === 200) {
        const allRowsResponse = await getRows(sheetId);
        if (allRowsResponse.status === 200) {
          setData(allRowsResponse.data);
          setIsLoading(false);
          setOpenModal(false);
        }
      }
      return response.data;
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger
        asChild
        className="text-sm w-full "
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Button size="sm" variant="outline">
          <Trash size={14} color="red" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Row</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this row?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
