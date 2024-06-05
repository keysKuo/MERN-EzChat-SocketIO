import axios from "axios";
import { useEffect, useState } from "react";

export default function useAPI(options) {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         await axios
            .request(options)
            .then((response) => {
               const result = response.data;
               if (result.success) {
                  setData(result.metadata);
               }
            })
            .catch((err) => {
               const message = err?.response?.msg || "Error occured!";
               setError(message);
            })
            .finally(() => {
               setLoading(false);
            });
      };

      fetchData();

      return () => {};
   }, [options]);

   return { data, loading, error };
}
