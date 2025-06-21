import axios from "axios";
import { useState } from "react";
import { config } from "../constants/config";

const BASE_URL = config.API_URL;

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}${url}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const post = async (url: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${BASE_URL}${url}`, data, {
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { get, post, loading, error };
};
