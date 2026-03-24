import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from '../slices/messageSlice';

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  // const [loading, setLoading] = useState(true);
  const dispatch=useDispatch();

  useEffect(() => {
    async function fetchLocations() {
      try {
        // setLoading(true);
        const { data, error } = await supabase
          .from("locations")
          .select("id, city, district")
          .is("deleted_at", null);

        if (error) throw error;

        setLocations(data || []);

        // 產生唯一的縣市列表
        const cities = Array.from(
          new Set((data || []).map((item) => item.city))
        );
        const cityOptions = cities.map(city => ({ value: city, label: city }));
        setCityOptions(cityOptions);
      } catch (error) {
        dispatch(createAsyncMessage(error));
      } finally {
        // setLoading(false);
      }
    }

    fetchLocations();
  }, []);

  // 回傳你需要的資料與狀態
  return { locations, cityOptions };
}