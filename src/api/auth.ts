import axios, { AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface RegisterData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    gender: "MALE" | "FEMALE" | "NOT_SPECIFIED";
}

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}

export const register = async (data: RegisterData): Promise<AxiosResponse> => {
    return axios.post(`${API_URL}/register`, data);
};

export const login = async (data: LoginData): Promise<AxiosResponse<LoginResponse>> => {
    return axios.post(`${API_URL}/login`, data);
};
