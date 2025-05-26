import Cookies from "js-cookie";
import { toast } from "react-toastify";


const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const fetchAPI = ({url, callback, method = "GET", params = {}, body = {}, headers = {}}) => {
  const accessToken = localStorage.getItem("accessToken");
  const csrfToken = Cookies.get("csrftoken");

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${accessToken}`,
      "X-CSRFTOKEN": csrfToken,
      ...headers,
    },
    body: method === "POST" || method === "PUT" ? JSON.stringify(body) : null,
  };

  let queryString = new URLSearchParams(params).toString();
  let fullUrl = `${backendUrl}${url}`;
  if (queryString) {
    fullUrl += `?${queryString}`;
  }

  fetch(fullUrl, options)
    .then(async (response) => {
      if (response.status > 299) {
        toast.error("Có lỗi xảy ra trong quá trình xử lý yêu cầu");
        return;
      }
      const data = await response.json();
      callback(data);
    })
    .catch((error) => {
      console.error("Error: ", error);
      toast.error("Có lỗi xảy ra trong quá trình xử lý yêu cầu");
    });
}


export const getData = ({url, callback, params = {}}) => {
  fetchAPI({url, callback, params: params});
}


export const postData = ({url, callback, body = {}}) => {
  fetchAPI({url, callback, method: "POST", body: body});
}


export const putData = ({url, callback, body = {}}) => {
  fetchAPI({url, callback, method: "PUT", body: body});
}


export const deleteData = ({url, callback, params = {}}) => {
  fetchAPI({url, callback, method: "DELETE", params: params});
}