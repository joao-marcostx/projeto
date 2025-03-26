import { apagarFoto, atualizarFotos, criandoFotos, mostrarUmaFoto } from "../models/FotosModel.js";
import path from "path";
import url from "url";
import { promises as fs } from "fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createFoto = async (req, res) => {
  console.log("fotoController :: createFoto");

  if (!req.files || !req.files.foto) {
    return res.status(400).json({ mensagem: "Nenhum arquivo enviado." });
  }

  const { foto } = req.files;
  const { alternativo } = req.body;
  const extensoesPermitidas = [".jpg", ".jpeg", ".png"];

  // Obtenha a extensão do arquivo e a verifique antes de usá-la
  const extesao = path.extname(foto.name).toLowerCase();
  
  if (!extensoesPermitidas.includes(extesao)) {
    return res.status(400).json({ mensagem: "Extensão do arquivo não permitida." });
  }

  if (!alternativo) {
    return res.status(400).json({ mensagem: "A descrição da imagem é obrigatória." });
  }

  // Criando nome do arquivo para evitar sobreposição
  const caminho = `${Date.now()}${extesao}`;

  try {
    // Salvando a imagem no servidor
    await foto.mv(path.join(__dirname, "..", "..", "public", "img", caminho));

    // Criando entrada no banco de dados
    const [status, resposta] = await criandoFotos(caminho, alternativo);
    res.status(status).json(resposta);
  } catch (error) {
    console.error("Erro ao criar foto:", error);
    res.status(500).json({ mensagem: "Erro ao criar foto", erro: error.message });
  }
};

export const updateFoto = async (req, res) => {
  console.log("fotoController :: updateFoto");

  const { id_foto } = req.params;
  const { alternativo } = req.body;

  try {
    const [status, resposta] = await atualizarFotos(alternativo, id_foto);
    return res.status(status).json(resposta);
  } catch (error) {
    console.error("Erro ao atualizar foto:", error);
    return res.status(500).json({ mensagem: "Erro ao atualizar foto", erro: error.message });
  }
};

export const deleteFoto = async (req, res) => {
  console.log("fotoController :: deleteFoto");

  const { id_foto } = req.params;

  try {
    const [statusFoto, respostaFoto] = await mostrarCaminho(req, res);
    if (statusFoto === 404) {
      return res.status(statusFoto).json(respostaFoto);
    }

    const caminhoImagem = path.join(__dirname, "..", "..", "public", "img", respostaFoto.caminho);
    
    // Exclui a imagem do servidor
    await fs.unlink(caminhoImagem);
    
    // Remove a entrada do banco de dados
    const [status, resposta] = await apagarFoto(id_foto);
    return res.status(status).json(resposta);
  } catch (error) {
    console.error("Erro ao deletar foto:", error);
    return res.status(500).json({ mensagem: "Erro ao deletar foto", erro: error.message });
  }
};

export const showOneFoto = async (req, res) => {
  console.log("fotoController :: showOneFoto");

  const [status, resposta] = await mostrarCaminho(req, res);
  return res.status(status).json(resposta);
};

export const mostrarCaminho = async (req, res) => {
  console.log("fotoController :: mostrarCaminho");

  const { id_foto } = req.params;

  try {
    const [status, resposta] = await mostrarUmaFoto(id_foto);
    return [status, resposta];
  } catch (error) {
    console.error("Erro ao buscar foto:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar foto", erro: error.message });
  }
};
