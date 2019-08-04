import React from "react";

export const InfoMark = ({ dark }: { dark?: boolean }) => (
  <span
    style={{
      backgroundColor: dark ? "#ccc" : "#eee",
      color: "#aaa",
      borderRadius: 50,
      width: 16,
      height: 16,
      fontSize: 14,
      display: "inline-block",
      textAlign: "center",
      lineHeight: "16px",
      cursor: "pointer"
    }}
  >
    ?
  </span>
);
