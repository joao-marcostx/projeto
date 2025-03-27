import React, { useState } from "react";
import style from "./Card.module.css";
import axios from "axios";

const Card = () => {
  const [file, setFile] = useState(null);
  const [alternativo, setAlternativo] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Captura o arquivo e gera uma prévia
  const handleFileChange = (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      alert("Nenhum arquivo selecionado");
      return;
    }

    const selectedFile = files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file || !alternativo) {
      alert("Todos os campos precisam ser preenchidos");
      return;
    }

    console.log("Arquivo selecionado:", file);
    console.log("Descrição:", alternativo);

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("alternativo", alternativo);

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3010/foto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Resposta do servidor:", response.data);
      alert("Imagem enviada com sucesso!");

      setFile(null);
      setAlternativo("");
      setPreview(null);
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
      alert("Erro ao enviar a imagem, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className={style.container}>
      <div className={style.card}>
        <h2 className={style.title}>Envio de Arquivos</h2>

        <input
          type="file"
          accept="image/*"
          className={style.inputFile}
          onChange={handleFileChange}
        />

        <input
          type="text"
          placeholder="Digite uma descrição"
          value={alternativo}
          className={style.inputText}
          onChange={(e) => setAlternativo(e.target.value)}
        />

        {preview && (
          <div className={style.previewContainer}>
            <img src={preview} alt="Preview" className={style.previewImage} />
          </div>
        )}

        <button
          type="submit"
          className={style.btn}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>

        
      </div>
    </div>
  );
};

export default Card;
