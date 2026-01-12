import React from 'react';

const CharAvatar = ({ fullName, width = "w-20", height = "h-20", style = "text-xl" }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`${width} ${height} bg-slate-400 rounded-full flex items-center justify-center`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p className={`font-bold text-white ${style}`}>{getInitials(fullName)}</p>
    </div>
  );
};

export default CharAvatar;
