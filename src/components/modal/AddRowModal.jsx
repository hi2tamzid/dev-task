import { useEffect, useState } from "react";
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

export default function AddRowModal({ row, setData, tableHeaders }) {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedVal, setUpdatedVal] = useState(row);
  useEffect(() => {
    setUpdatedVal(row);
  }, [openModal]);
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
  const handleAdd = async () => {
    setIsLoading(true);
    const url = `/${sheetId}/values/${range}:append?valueInputOption=RAW`;

    const body = {
      values: [values],
    };
    try {
      const response = await baseAxios.post(url, body);
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
        className="mt-4 "
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Button variant="outline">Add Row</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Row</DialogTitle>
          <DialogDescription>Add row with new data</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 ">
          {Object.keys(updatedVal).map((key, i) => {
            const keyInt = key.split("")[0];
            const label = tableHeaders.find((th) => th.name.includes(keyInt));
            return (
              <div
                key={`row-${i + 10}`}
                className="grid grid-cols-6 items-center"
              >
                <Label className="col-span-2">{label.value}:</Label>
                <Input
                  value={updatedVal[key]}
                  onChange={(e) => handleOnChange(key, e.target?.value)}
                  className="col-span-4"
                />
              </div>
            );
          })}
          <div className="flex justify-end">
            <Button disabled={isLoading} onClick={handleAdd}>
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
