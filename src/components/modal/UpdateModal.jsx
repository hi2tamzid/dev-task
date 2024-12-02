import { Edit } from "lucide-react";
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

export default function UpdateModal({ row, setData, tableHeaders }) {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedVal, setUpdatedVal] = useState(row);
  const rangeArr = Object.keys(row);
  const rangeKeys = [rangeArr[0], rangeArr[rangeArr.length - 1]].join(":");
  const range = `Sheet1!${rangeKeys}`;
  const sheetId = localStorage.getItem("sheet-id");

  useEffect(() => {
    setUpdatedVal(row);
  }, [openModal]);

  const values = Object.values(updatedVal);
  const handleOnChange = (key, value) => {
    setUpdatedVal((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const url = `/${sheetId}/values/${range}?valueInputOption=RAW`;

      const body = {
        values: [values],
      };
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
        className="text-sm  w-full  "
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Button size="sm" variant="outline">
          {" "}
          <Edit size={14} color="green" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Row</DialogTitle>
          <DialogDescription>Update row with new data</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 ">
          {Object.keys(updatedVal).map((key) => {
            const keyInt = key.split("")[0];
            const label = tableHeaders.find((th) => th.name.includes(keyInt));

            return (
              <div key={key} className="grid grid-cols-6 items-center">
                <Label className="col-span-2">{label.value}:</Label>
                <Input
                  value={updatedVal[key]}
                  onChange={(e) => handleOnChange(key, e.target.value)}
                  className="col-span-4"
                />
              </div>
            );
          })}
          <div className="flex justify-end">
            <Button disabled={isLoading} onClick={handleUpdate}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
