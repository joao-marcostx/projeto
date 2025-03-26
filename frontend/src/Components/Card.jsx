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
    setPreview(URL.createObjectURL(selectedFile)); // Pré-visualização da imagem
  };

  // Envia a imagem para o backend
  const handleUpload = async () => {
    if (!file || !alternativo) {
      alert("Todos os campos precisam ser preenchidos");
      return;
    }

    // Debug: Verificar se os valores estão corretos
    console.log("Arquivo selecionado:", file);
    console.log("Descrição:", alternativo);

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("alternativo", alternativo);

    // Debug: Verificar o conteúdo do FormData
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      setLoading(true);

      const response = await axios.post('http://localhost:3010/foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Resposta do servidor:", response.data);
      alert("Imagem enviada com sucesso!");

      // Limpar campos após o envio
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
    <div className={style.bd}>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <input
        type="text"
        placeholder="Digite uma descrição"
        value={alternativo}
        onChange={(e) => setAlternativo(e.target.value)}
      />

      {preview && (
        <div className={style.card}>
          <img src={preview} alt="Preview" style={{ width: "100%" }} />
        </div>
      )}

      <button type="submit" className={style.btn} onClick={handleUpload} disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
};

export default Card;
