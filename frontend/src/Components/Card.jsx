import React from "react";
import style from "./Card.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

const Card = () => {
  const [imagens, setImagens] = useState([]);
  const [file, setFile] = useState([]);
  const [alternativo, setAlternativo] = useState([]);


  const handleFileChange = (e) => {
    setImagens(e.target.files[0]); // Pega o arquivo
  };
  useEffect(() => {
    fetch("http://localhost:3010/foto", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setImagens(data);
        console.log(data);
      });
      
      
  }, []);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("alternativo", alternativo);

  return (
    <div className={style.bd}>
      <input
        type="file"
        placeholder="Search..."
        accept="image/*"
        value={imagens}
        onChange={handleFileChange}
      />

      <div className={style.card}>
        <div className={style.container}>
          <img src={imagens} alt="Avatar" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default Card;
