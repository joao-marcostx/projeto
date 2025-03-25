import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import url from "url";
import { createFoto, deleteFoto, showOneFoto, updateFoto } from "./controllers/fotoController.js";
import { readFotos } from "./models/FotosModel.js";
import cors from "cors";

const PORT = 3010;
const app = express();


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

//habilitando o uso do JSON importante pois permite o use do Json
app.use(express.json());

app.use(fileUpload());

app.use("/public/img", express.static(path.join(__dirname, '..', 'public', 'img')));


app.get("/", (req, res) => {
  res.status(200).json({ mensagem: "API funcionando" });
});

app.post("/foto", createFoto );
app.get ("/foto", readFotos);
app.put("/foto/:id_foto", updateFoto);
app.delete("/foto/:id_foto", deleteFoto);
app.get("/foto/:id_foto", showOneFoto);
app.listen(PORT, () => {
  console.log(`API rodando na porta http://localhost:${PORT}`);
});
