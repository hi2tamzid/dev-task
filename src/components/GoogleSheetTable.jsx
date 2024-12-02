import { useEffect, useRef, useState } from "react";
import useFetchData from "../hooks/useFetchData";
import useSheetLink from "../hooks/useSheetLink";
import {
  extractSheetId,
  generateDefaultHeaders,
  generateFormattedData,
  generateHeaders,
  generateRowFromColumn,
} from "../lib/utils";
import { getRows } from "../services/actions";
import AddColModal from "./modal/AddColModal";
import AddRowModal from "./modal/AddRowModal";
import DeleteModal from "./modal/DeleteModal";
import UpdateColModal from "./modal/UpdateColModal";
import UpdateModal from "./modal/UpdateModal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import TableSkeleton from "./ui/TableSkeleton";

export default function GoogleSheetTable({ setHasClientId, setToken, token }) {
  const [clientId, setClientId] = useState("");
  const { data, setData, isFetching, setIsFetching } = useFetchData(null);
  const { setSheetLink, sheetLink } = useSheetLink();
  const [sheetLinkValue, setSheetLinkValue] = useState(sheetLink);
  const [setDisableGetBtn] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const intervalIdRef = useRef(null);

  useEffect(() => {
    setSheetLinkValue(sheetLink);
  }, [sheetLink]);

  const actionCol = { name: "", value: "#" };
  const tableHeaders =
    data && data.values && data?.values.length > 0
      ? [...generateHeaders(data?.values[0]), { ...actionCol }]
      : [...generateDefaultHeaders()];
  const tableRows =
    data && data.values && data?.values.length > 0
      ? generateFormattedData(data?.values.slice(1))
      : null;

  useEffect(() => {
    intervalIdRef.current = setInterval(async () => {
      if (token && sheetLinkValue && !isFetching) {
        try {
          const id = extractSheetId(sheetLinkValue);
          const response = await getRows(id);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalIdRef.current);
  }, [token, sheetLinkValue, isFetching]);

  const handleGetData = async () => {
    if (sheetLinkValue) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setSheetLink(sheetLinkValue);
      localStorage.setItem("sheet-link", sheetLinkValue);
      setIsFetching(true);
      try {
        const id = extractSheetId(sheetLinkValue);
        const response = await getRows(id);
        setData(response.data);
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
      }
    }
  };

  const checkIfSheetLinkIsValid = (value) => {
    const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return true;
    } else false;
  };
  const handleOnchange = (e) => {
    const { value } = e.target;
    setSheetLinkValue(value);
    if (
      checkIfSheetLinkIsValid(value) ||
      checkIfSheetLinkIsValid(sheetLinkValue)
    ) {
      setDisableGetBtn(false);
      setErrorMessage("");
    } else {
      setErrorMessage("Please provide a valid link");
    }
  };
  const getLastRow = (index = 1, updateRow) => {
    // taking the columns without last element
    const obj = generateRowFromColumn(tableHeaders.slice(0, -1));
    const updatedObj = {};

    if (obj) {
      Object.keys(obj).forEach((key) => {
        const match = key.split("");
        if (match) {
          const column = match[0];
          const row = index;
          const objKey = `${column}${row}`;
          const updateRowValue = updateRow ? updateRow[objKey] ?? "" : null;
          updatedObj[objKey] = updateRow ? updateRowValue : obj[key];
        }
      });
    } else {
      [...tableHeaders]?.forEach((item) => {
        if (item.name) {
          // Dynamically replace the last digit '1' with '2'
          const newKey = item.name.replace(/1$/, "2");
          updatedObj[newKey] = "";
        }
      });
    }

    return updatedObj;
  };

  const rowsLastIndex = tableRows ? tableRows?.length + 2 : 2;
  const lastRow = tableRows ? getLastRow(rowsLastIndex) : getLastRow();

  const handleClientId = () => {
    localStorage.setItem("client-id", clientId);
    localStorage.removeItem("token");
    setHasClientId(true);
    localStorage.removeItem("sheet-id");
    setToken("");
  };

  return (
    <div className="mt-20">
      <div className="container ">
        <div className="flex gap-2 items-end lg:flex-row flex-col">
          <div className="lg:w-2/5 w-full shrink-0">
            <Label>Client Id</Label>
            <Input
              value={clientId ?? ""}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <Button disabled={clientId.length < 1} onClick={handleClientId}>
            Update Client Id
          </Button>
        </div>
        <small>You&apos;ll be logged out if you update the client id</small>

        <h1 className="font-semibold text-xl mt-4">Update your google sheet</h1>
        <p className="mt-1 mb-4 text-gray-500 max-w-lg text-sm leading-relaxed">
          Just open your Google Sheet, copy the URL, and pop it into this input
          box to fetch your data easy and quick!
        </p>
        <div className="mt-2">
          <div className="flex gap-2 items-end lg:flex-row flex-col">
            <div className="lg:w-2/5 w-full  shrink-0">
              <Label>Sheet Url</Label>
              <Input value={sheetLinkValue} onChange={handleOnchange} />
            </div>

            <div className="flex justify-start w-full">
              <Button onClick={handleGetData}>Get Data</Button>
            </div>
          </div>
          {errorMessage.length > 0 && (
            <p className="text-sm mt-1 text-red-500">{errorMessage}</p>
          )}

          {data && data.values && data?.values.length > 0 ? (
            <div className="flex justify-end items-center mb-4 gap-4">
              <AddRowModal
                row={lastRow}
                setData={setData}
                tableHeaders={tableHeaders}
              />
              <UpdateColModal
                setData={setData}
                tableHeaders={tableHeaders.slice(0, -1)}
              />
              {/* <AddColModal setData={setData} tableHeaders={tableHeaders} /> */}
            </div>
          ) : null}
        </div>
      </div>
      {data && !data?.values ? (
        <div className="border rounded grid place-items-center h-[50vh] mt-20">
          <div>
            <p>
              Looks like your Google Sheet is empty. Try adding columns to get
              started!
            </p>
            <div className="flex py-4 justify-center items-center mb-4">
              <AddColModal setData={setData} tableHeaders={tableHeaders} />
            </div>
          </div>
        </div>
      ) : null}
      {isFetching ? (
        <div className="container mt-6">
          <TableSkeleton />
        </div>
      ) : data && data.values && data?.values.length > 0 ? (
        <div className="container border pt-10 pb-4 max-w-[500px]  rounded ">
          <Table className="">
            <TableHeader>
              <TableRow>
                {tableHeaders?.map((header, i) => {
                  if (i === tableHeaders.length - 1) {
                    return (
                      <TableHead
                        className="text-center  w-[30px]"
                        key={`${header.name}-${i + 1}`}
                      >
                        Action
                      </TableHead>
                    );
                  }
                  return (
                    <TableHead className=" text-nowrap" key={`header-${i + 1}`}>
                      {header.value}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows?.map((row, rowIndex) => (
                <TableRow key={`tRow-${rowIndex + 1}`}>
                  {tableHeaders?.map((header, colIndex) => {
                    const head = header.name.split("")[0];
                    const rowKey = Object.keys(row).find((itm) =>
                      itm.includes(head)
                    );
                    const updatedRow = getLastRow(rowIndex + 2, row);
                    if (colIndex == tableHeaders.length - 1) {
                      return (
                        <TableCell
                          key={colIndex}
                          className="flex items-center justify-center  "
                        >
                          <div className="flex gap-3  ">
                            <UpdateModal
                              row={updatedRow}
                              setData={setData}
                              tableHeaders={tableHeaders}
                            />

                            <DeleteModal row={updatedRow} setData={setData} />
                          </div>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={`td-${colIndex}`} className="text-nowrap">
                        {row[rowKey]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
      <div className="h-20"></div>
    </div>
  );
}
