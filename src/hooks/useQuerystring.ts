import { useSearchParams } from 'react-router-dom';

export const useQuerystring = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const getQs = (qs: string) => {
    return searchParams.get(qs);
  };

  const setQs = (key: string, value: any) => {
    setSearchParams({ [key]: value });
  };

  const removeQs = (key: string) => {
    if (searchParams.has(key)) {
      const token = searchParams.get(key);
      if (token) {
        searchParams.delete(key);
        setSearchParams(searchParams);
      }
    }
  };

  return {
    getQs,
    setQs,
    removeQs,
  };
};
