import axios from "axios";
const url = "https://www.breakingbadapi.com/api/"
const api = axios.create({
    baseURL: `${url}`,
});
export { api };
