// usePermissions.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '@/config/BaseUrl';

export const usePermissions = () => {
  const [permission, setPermission] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-usercontrol`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermission(response.data.usercontrol);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permission, isLoading, isError };
};