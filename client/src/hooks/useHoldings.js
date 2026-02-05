import { useEffect, useState, useCallback } from "react";
import { getHoldings } from "../api/holdings";

const useHoldings = (userId) => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoldings = useCallback(async () => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getHoldings(userId);
      setHoldings(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  return {
    holdings,
    setHoldings,
    loading,
    error,
    refresh: fetchHoldings,
  };
};

export default useHoldings;
