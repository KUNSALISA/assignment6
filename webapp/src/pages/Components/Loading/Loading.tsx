import React from "react";
import "./Loading.css"; // ไฟล์ CSS ที่มีสไตล์

const Loading: React.FC = () => {
  return (
    <div className="loader">
      <div className="pencil">
        <p>Loading...</p>
        <div className="top"></div>
      </div>
      <div className="stroke"></div>
    </div>
  );
};

export default Loading;