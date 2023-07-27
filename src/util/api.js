import axios from "axios";
import { TOKEN_JWT } from "./const";

class API {
  request = (config) => {
    const {
      method = "get",
      url,
      params,
      data,
      baseUrl = process.env.REACT_APP_API,
      header,
    } = config;

    const token = localStorage.getItem(TOKEN_JWT);
    let request = { method, url, baseURL: baseUrl };
    request.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (header) {
      request.headers = {
        ...request.headers,
        ...header,
      };
    }
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      request.data = data;
    }
    if (params) {
      request.params = params;
    }

    return axios(request)
      .then((res) => {
        if (!res.data.status) {
          throw new Error(res.data.message);
        }
        return res.data.data;
      })
      .catch((error) => {
        error.statusCode = 404;
        throw error.message;
      });
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new API();
