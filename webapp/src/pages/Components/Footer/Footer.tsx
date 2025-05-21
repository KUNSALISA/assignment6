import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        ระบบเช็คชื่อออนไลน์ - สำนักวิศวกรรมศาสตร์ สาขาวิชาวิศวกรรคอมพิวเตอร์ มหาวิทยาลัยเทคโนโลยีสุรนารี © {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
