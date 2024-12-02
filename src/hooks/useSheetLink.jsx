import { useEffect, useState } from "react";

export default function useSheetLink() {
  const cacheSheetLink = localStorage.getItem("sheet-link") ?? "";
  const [sheetLink, setSheetLink] = useState(cacheSheetLink);
  const [sheetId, setSheetId] = useState("");
  const extractSheetId = (sheetUrl) => {
    try {
      const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        localStorage.setItem("sheet-id", match[1]);

        return match[1];
      }
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  useEffect(() => {
    const id = extractSheetId(sheetLink);
    setSheetId(id);
  }, [sheetLink]);

  return { sheetLink, setSheetLink, sheetId };
}
