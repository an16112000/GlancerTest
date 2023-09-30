import React from "react";

export const IconUpDown = ({ isUp = false }: { isUp?: boolean }) => {
  if (isUp) return <span style={{ fontSize: "0.6em" }}>&#9650;</span>;

  return <span style={{ fontSize: "0.6em" }}>&#9660;</span>;
};
