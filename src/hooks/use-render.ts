import { useEffect, useState } from "react";

export const useRender = () => {
  const [isRendered, setIsRendered] = useState(false);

  /**
   * @param duration ms
   */
  const reRender = (duration = 100) => {
    setIsRendered(false);

    setTimeout(() => {
      setIsRendered(true);
    }, duration);
  };

  useEffect(() => {
    setIsRendered(true);
  }, []);

  return { isRendered, reRender };
};
