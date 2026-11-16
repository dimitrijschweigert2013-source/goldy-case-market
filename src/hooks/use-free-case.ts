import { useCallback, useEffect, useState } from "react";
const KEY = "mysterydrop-free-case-used-v1";
/** The free case can be opened exactly once per browser. */
export function useFreeCase() {
  const [used, setUsed] = useState(false);
  useEffect(() => setUsed(localStorage.getItem(KEY) === "1"), []);
  const markUsed = useCallback(() => {
    localStorage.setItem(KEY, "1");
    setUsed(true);
  }, []);
  return { used, markUsed };
}
