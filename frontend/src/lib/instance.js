import axios from "axios"
import { HOST } from "../utils/constant"
export const Instance = axios.create({
    baseURL: HOST
})