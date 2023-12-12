import axios from "axios";
import { toast } from 'react-toastify';

export const axiosInstance: any = axios.create({
    // baseURL: `${process.env.API_URL}/`,
    baseURL: `/api/`,
    headers: {
        "Accept": "application/json"
    },
});

const showError = (error: any) => {
    if (error?.response?.data?.message) {
        return toast.error(error?.response?.data?.message);
    }
    let messages = error?.response?.data?._server_messages ? JSON.parse(JSON.parse(error?.response?.data?._server_messages)[0]) : null
    if (messages) {
        return toast.error(messages?.message);
    }
    if (error?.code == "ERR_NETWORK" || error?.code == "ERR_BAD_RESPONSE") {
        // window.location.href = "/login";
    }
};

const SiteApis = {
    login: async (body: any) => {
        return axiosInstance
            .post("auth/login", body, { withCredentials: false })
            .then((response: any) => {
                if (response?.status == 200 || response?.status == 201 || response?.status == 202) {
                    return response?.data?.data
                } else {
                    throw new Error(response)
                }
            })
            .catch((error: any) => {
                showError(error);
                return { error: true, message: error?.message }
            });
    },
    getDataApi: async (url: any, query: any, token: any) => {
        axiosInstance.defaults.headers['Authorization'] = token
        let URL = url + "?"
        for (let key in query) {
            URL += `${key}=${query[key]}&`
        }
        return axiosInstance
            .get(URL, query, { withCredentials: false })
            .then((response: any) => {
                if (response?.status == 200 || response?.status == 201 || response?.status == 202) {
                    return response?.data
                } else {
                    throw new Error(response)
                }
            })
            .catch((error: any) => {
                showError(error);
                return { error: true, message: error?.message }
            });
    },
    addDataApi: async (url: any, body: any, token: any) => {
        axiosInstance.defaults.headers['Authorization'] = token
        return axiosInstance
            .post(url, body, { withCredentials: false })
            .then((response: any) => {
                if (response?.status == 200 || response?.status == 201 || response?.status == 202) {
                    return response.data
                } else {
                    throw new Error(response)
                }
            })
            .catch((error: any) => {
                showError(error);
                return { error: true, message: error?.message }
            });
    },
    editDataApi: async (url: any, body: any, token: any) => {
        axiosInstance.defaults.headers['Authorization'] = token
        return axiosInstance
            .patch(url, body, { withCredentials: false })
            .then((response: any) => {
                if (response?.status == 200 || response?.status == 201 || response?.status == 202) {
                    return response.data
                } else {
                    throw new Error(response)
                }
            })
            .catch((error: any) => {
                showError(error);
                return { error: true, message: error?.message }
            });
    },
    deleteDataApi: async (url: any, body: any, token: any) => {
        axiosInstance.defaults.headers['Authorization'] = token
        const URL = `${url}?id=${body.id}`
        return axiosInstance
            .delete(URL, { withCredentials: false })
            .then((response: any) => {
                if (response?.status == 200 || response?.status == 201 || response?.status == 202) {
                    return response.data
                } else {
                    throw new Error(response)
                }
            })
            .catch((error: any) => {
                showError(error);
                return { error: true, message: error?.message }
            });
    },
    fileUploadApi: async (url: any, file: any) => {
        let body = new FormData();
        body.append("file", file, file.name);
        return axiosInstance
            .post(url, body, { withCredentials: false })
            .then((response: any) => {
                if (response?.status == 200 || response?.status == 201 || response?.status == 202) {
                    return response?.data?.data
                } else {
                    throw new Error(response)
                }
            })
            .catch((error: any) => {
                showError(error);
                return { error: true, message: error?.message }
            });
    },
};

export default SiteApis;