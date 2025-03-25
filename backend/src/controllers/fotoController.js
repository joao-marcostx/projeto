import { apagarFoto, atualizarFotos, criandoFotos, mostrarUmaFoto } from "../models/FotosModel.js";
import path from "path";
import url from "url";
import {promises as fs} from 'fs'
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createFoto = async (req, res) => {
  console.log("fotoController :: createFoto");
  // const caminho = req.body.caminho;
  const { foto } = req.files || {};
  const { alternativo } = req.body;
  const extensoesPermitidas = [".jpg", ".jpeg", ".png"];
  if(!extensoesPermitidas.includes(extesao)){
    return res.status(400).json({mensagem: "Extensão do arquivo não permitida"})
  }

  if (!alternativo || !foto) {
    return res
      .status(400)
      .json({ mensagem: "imagem e descrição  são obrigatórios" });
  }
  const nomeFoto = foto.name;
  const extesao = path.extname(nomeFoto).toLowerCase();
  const caminho = `${Date.now()}${extesao}`;
  try {
    await foto.mv(path.join(__dirname, "..", "..", "public", "img", caminho));
    const [status, resposta] = await criandoFotos(caminho, alternativo);
    res.status(status).json(resposta);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao criar foto", code: error.code });
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
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao atualizar foto" });
  }
};
export const deleteFoto = async (req, res) => {
  console.log("fotoController :: deleteFoto");
  const { id_foto } = req.params;
  console.log(req.params);

  try {
    const [statusFoto, respostaFoto] = await mostrarCaminho(req, res);
    if (statusFoto === 404) {
      return res.status(statusFoto).json(respostaFoto);
      
    }
    const caminhoImagem = path.join(__dirname, "..", "..", "public", "img", respostaFoto.caminho);
    await fs.unlink(caminhoImagem);
    const [status, resposta] = await apagarFoto(id_foto);
    return res.status(status).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao deletar foto" });
  }  
};

export const showOneFoto = async (req, res) => {
  console.log("fotoController :: showOneFoto");
  const [status, resposta] = await mostrarCaminho(req, res);
  return res.status(status).json(resposta);
};



export const mostrarCaminho = async (req, res) => {
  console.log("fotoController :: showOneFoto");
  const { id_foto } = req.params;
  try {
    const [status, resposta] = await mostrarUmaFoto(id_foto);
    return [status, resposta];
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao buscar foto" });
  }
};
