import React, { useEffect, useState } from "react";
import style from "./Home.module.css";
import Card from "../Components/Card"; // Ajuste o caminho conforme necessário
import axios from "axios";

const Home = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:3010/foto");
      setImages(response.data);
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
    }
  };

  // Função para deletar a foto
  const handleDelete = async (id_foto) => {
    try {
      const response = await axios.delete(`http://localhost:3010/foto/${id_foto}`);
      console.log("Imagem deletada com sucesso:", response.data);
      alert("Imagem deletada com sucesso!");
      // Atualizar a lista de imagens após a exclusão
      fetchImages();
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
      alert("Erro ao deletar a imagem, tente novamente.");
    }
  };

  return (
    <div>
      <Card />
      <h2>Imagens enviadas</h2>
      <div className={style.container}>
        {images.map((foto) => (
          <div key={foto.id} className={style.imageCard}>
            <img
              src={`http://localhost:3010/public/img/${foto.caminho}`}
              alt={foto.alternativo}
              className={style.image}
            />
            <p>{foto.alternativo}</p>
            <button 
              onClick={() => handleDelete(foto.id)} // Usando o id para deletar
              className={style.deleteBtn}
            >
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
