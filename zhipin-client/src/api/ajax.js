import axios from "axios";

export default function ajax(url, data, type = "GET") {
    if (type.toLowerCase() === "get") {
        let paramStr = "";
        if (data) {
            Object.keys(data).forEach(key => {
                paramStr = key + "=" + data[key] + "&";
            })
        }

        if (paramStr) {
            paramStr = paramStr.substring(0, paramStr.length - 1);
        }
        return axios.get(url + '?' + paramStr)
    } else {
        return axios.post(url, data);
    }
}