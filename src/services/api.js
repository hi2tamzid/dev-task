import axios from "axios";
export const API_BASE = `https://sheets.googleapis.com/v4/spreadsheets`;

// Axios instance
const baseAxios = axios.create( {
  baseURL: API_BASE, 
  timeout: 10000, 
} );

// Request interceptor
baseAxios.interceptors.request.use(
  ( config ) => {
    const token = localStorage.getItem( "token" ); 
    if ( token ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  ( error ) => {
    console.error( "Request error:", error );
    return Promise.reject( error );
  }
);

// Response interceptor
baseAxios.interceptors.response.use(
  ( response ) => {
    return response;
  },
  ( error ) => {
    if ( error.response ) {
      // Server responded with a status code outside the 2xx range
      const { status, data } = error.response;
      console.error( `Error ${status}:`, data.message || data );

      // Custom error handling based on status codes
      switch ( status ) {
        case 401:
          alert( "Session expired. Please log in again." );
          localStorage.removeItem( "token" ); 
          window.location.href = "/";
          break;
        case 403:
          alert( "You don't have permission to perform this action." );
          break;
        case 404:
          alert( "Resource not found." );
          break;
        case 500:
          alert( "Server error. Please try again later." );
          break;
        default:
          alert( data.message || "An error occurred. Please try again." );
      }
    } else if ( error.request ) {
      // No response from server
      console.error( "No response received:", error.request );
      alert( "Network error. Please check your internet connection." );
    } else {
      console.error( "Error:", error.message );
    }
    return Promise.reject( error );
  }
);

export default baseAxios;
