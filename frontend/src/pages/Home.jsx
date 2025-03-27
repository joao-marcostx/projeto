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
  const handleDelete = async (id_fotos) => {
    try {
      console.log("Tentando deletar imagem com ID:", id_fotos);
      const response = await axios.delete(`http://localhost:3010/foto/${id_fotos}`);
      console.log("Imagem deletada com sucesso:", response.data);
      alert("Imagem deletada com sucesso!");
  
      // Atualizar estado sem precisar chamar a API novamente
      setImages(images.filter((foto) => foto.id !== id_fotos));
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
      alert("Erro ao deletar a imagem, tente novamente.");
    }
  };
  

  // Função para atualizar a descrição da imagem
  const handleUpdate = async (id_fotos, novoAlternativo) => {
    try {
      console.log("Atualizando imagem com ID:", id_fotos);
      
      const response = await axios.put(`http://localhost:3010/foto/${id_fotos}`, {
        alternativo: novoAlternativo, // Envia os novos dados
      });

      console.log("Imagem atualizada com sucesso:", response.data);
      alert("Imagem atualizada com sucesso!");

      // Atualizar estado sem precisar chamar a API novamente
      setImages((prevImages) =>
        prevImages.map((foto) =>
          foto.id_fotos === id_fotos ? { ...foto, alternativo: novoAlternativo } : foto
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar a imagem:", error);
      alert("Erro ao atualizar a imagem, tente novamente.");
    }
  };

  return (
    <div>
      <Card />
      <h2>Imagens enviadas</h2>
      <div className={style.container}>
        {images.map((foto) => (
          <div key={foto.id_fotos} className={style.imageCard}>
            <img
              src={`http://localhost:3010/public/img/${foto.caminho}`}
              alt={foto.alternativo}
              className={style.image}
            />
            <p>{foto.alternativo}</p>
            <button 
              onClick={() => handleDelete(foto.id_fotos)} // Usando id_fotos para deletar
              className={style.deleteBtn}
            >
              Deletar
            </button>
            <button
              onClick={() => {
                const novoAlternativo = prompt("Digite a nova descrição:", foto.alternativo);
                if (novoAlternativo) {
                  handleUpdate(foto.id_fotos, novoAlternativo);
                }
              }}
              className={style.updateBtn}
            >
              Atualizar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
