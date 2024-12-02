import axios from 'axios';
import baseAxios from './api';

const SHEET_ID = '1rWSZDHbINnCV0rS6G5aAbMnPLHd0_HoN9rIsYh33MCQ';
export const API_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;

export const addRow = async (token, values) => {
  const url = `${API_BASE}/values/Sheet1!A1:append?valueInputOption=RAW`;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const body = {
    values: [values],
  };
  const response = await axios.post(url, body, config);
  return response.data;
};

export const getRows = async (sheetId) => {
  const url = `${sheetId}/values/Sheet1`;
  const response = await baseAxios.get(url);
  return response;
};

export const updateRow = async (token, range, values) => {
  const url = `${API_BASE}/values/${range}?valueInputOption=RAW`;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const body = {
    values: [values],
  };
  const response = await axios.put(url, body, config);
  return response.data;
};

export const deleteRow = async (token, range) => {
  const url = `${API_BASE}/values/${range}:clear`;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(url, {}, config);
  return response.data;
};
