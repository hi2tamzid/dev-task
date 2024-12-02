import { useEffect, useState } from "react";
import { generateRowFromColumnForUpdate } from "../../lib/utils";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function UpdateColModal({ setData, tableHeaders }) {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const row = generateRowFromColumnForUpdate(tableHeaders);
  const [updatedVal, setUpdatedVal] = useState(row);
  const rangeArr = Object.keys(row);
  const rangeKeys = [rangeArr[0], rangeArr[rangeArr.length - 1]].join(":");
  const range = `Sheet1!${rangeKeys}`;
  const sheetId = localStorage.getItem("sheet-id");

  const values = Object.values(updatedVal);
  const handleOnChange = (key, value) => {
    setUpdatedVal((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  useEffect(() => {
    setUpdatedVal(row);
  }, [openModal]);
  const handleAdd = async () => {
    setIsLoading(true);
    const url = `/${sheetId}/values/${range}?valueInputOption=RAW`;

    const body = {
      values: [values],
    };
    try {
      const response = await baseAxios.put(url, body);
      if (response?.status === 200) {
        const allRowsResponse = await getRows(sheetId);
        if (allRowsResponse.status === 200) {
          setData(allRowsResponse.data);
          setIsLoading(false);
          setOpenModal(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger
        asChild
        className=" mt-4"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Button variant="outline">Update Column</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] max-h-[70vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Update Column</DialogTitle>
          <DialogDescription>Update columns as you want</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 relative">
          {Object.keys(updatedVal).map((key, i) => {
            return (
              <div
                key={`${i + 1}-col`}
                className="grid grid-cols-6 items-center"
              >
                <Label className="col-span-2">{key}:</Label>
                <Input
                  value={updatedVal[key]}
                  onChange={(e) => handleOnChange(key, e.target.value)}
                  className="col-span-4"
                />
              </div>
            );
          })}
          <div className="flex justify-end sticky bottom-0 bg-white">
            <Button disabled={isLoading} onClick={handleAdd}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
