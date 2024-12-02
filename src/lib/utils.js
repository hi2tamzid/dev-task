import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn( ...inputs ) {
  return twMerge( clsx( inputs ) );
}

export const generateHeaders = ( headers ) => {
  const headersArr = headers?.map( ( header, index ) => {
    const columnLetter = String.fromCharCode( 65 + index ); // Convert index to A, B, C...
    return {
      name: `${columnLetter}1`, // Google Sheets reference (e.g., A1)
      value: header,           // The actual header name
    };
  } );

  return headersArr
};
export const generateRowFromColumn = ( tableHeaders ) => {
  const obj = {};
  tableHeaders?.forEach( ( header ) => {
    obj[header.name] = "";
  } );
  return obj;
};
export const generateRowFromColumnForUpdate = ( arr ) => {

  const result = [...arr];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  arr.forEach( item => {
    const currentName = item.name;
    const letterPart = currentName[0];
    const numberPart = parseInt( currentName.slice( 1 ), 10 ); // Extract the number

    // Find the starting index in the alphabet array
    let startIndex = alphabet.indexOf( letterPart );

    // Add objects with dynamic names until reaching 'z1'
    while ( startIndex < alphabet.length - 1 ) {
      startIndex++;
      const newName = alphabet[startIndex] + numberPart; // Generate the next name

      // Check if the name already exists in the array
      if ( !result.some( obj => obj.name === newName ) ) {
        result.push( { name: newName, value: '' } ); // Add new object with default value
      }
    }
  } );

  const obj = {};
  result?.forEach( ( header ) => {
    obj[header.name] = header.value;
  } );
  return obj;

};
export const generateDefaultHeaders = () => {
  const headers = []
  for ( let i = 0; i <= 25; i++ ) {
    const columnLetter = String.fromCharCode( 65 + i );
    headers.push( {
      name: `${columnLetter}1`, // Google Sheets reference (e.g., A1)
      value: '',           // The actual header name
    } )
  }
  return headers;
}

export const generateFormattedData = ( sheetData ) => {

  const formattedData = sheetData?.map( ( row, rowIndex ) => {
    const rowNumber = rowIndex + 2; // Start from row 2, assuming row 1 is headers
    const obj = {};

    row.forEach( ( value, colIndex ) => {
      const columnLetter = String.fromCharCode( 65 + colIndex ); // Convert index to A, B, C, etc.
      const cellReference = `${columnLetter}${rowNumber}`;    // Create cell reference (e.g., A2)
      obj[cellReference] = value || null;                     // Assign value to the cell reference
    } );

    return obj;
  } );
  return formattedData
}

export const extractSheetId = ( sheetUrl ) => {
  try {
    const match = sheetUrl.match( /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/ );
    if ( match && match[1] ) {
      localStorage.setItem( "sheet-id", match[1] );

      return match[1];
    } else {
      throw new Error( "Invalid Google Sheets URL" );
    }
  } catch ( error ) {
    console.error( error.message );
    return null;
  }
};
