import { stat } from "fs";
import db from "../conexao.js";
import mysql from "mysql2/promise";

// criando pool com database ient

const conexao = mysql.createPool(db);

export const criandoFotos = async (caminho, alternativo) => {
  console.log("fotosModel :: criandoFotos");
  const sql = `INSERT INTO fotos (caminho, alternativo) VALUES (?, ?)`;

  const params = [caminho, alternativo];
  try {
    const [resposta] = await conexao.query(sql, params);
    return [201, { mensagem: "Foto criada com sucesso" }];
  } catch (error) {
    console.error({
      mensagem: "Erro servidor",
      code: error.code,
      sql: error.sqlMessage,
    });
    return [
      500,
      {
        mensagem: "Erro ao criar foto",
        code: error.code,
        sql: error.sqlMessage,
      },
    ];
  }
};

export const mostrandoFotos = async () => {
  console.log("fotosModel :: mostrandoFotos");
  const sql = `SELECT * FROM fotos`;
  try {
    const [resposta] = await conexao.query(sql);
    return [200, resposta];
  } catch (error) {
    console.error({
      mensagem: "Erro servidor",
      code: error.code,
      sql: error.sqlMessage,
    });
    return [
      500,
      {
        mensagem: "Erro ao buscar fotos",
        code: error.code,
        sql: error.sqlMessage,
      },
    ];
  }
};

export const readFotos = async (req, res) => {
  console.log("fotosModel :: readFotos");
  try {
    const [status, resposta] = await mostrandoFotos();
    return res.status(status).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao buscar fotos" });
  }
};

export const atualizarFotos = async (alternativo, id_foto) => {
  console.log("fotosModel :: atualizarFotos");
  const sql = `UPDATE fotos SET alternativo = ? WHERE id_fotos = ?`;
  const params = [alternativo, id_foto];
  try {
    const [resposta] = await conexao.query(sql, params);
    if (resposta.affectedRows < 1) {
      return [400, { mensagem: "Imagem não encontrada" }];
    }
    return [200, { mensagem: "Foto atualizada com sucesso" }];
  } catch (error) {
    console.error({
      mensagem: "Erro servidor",
      code: error.code,
      sql: error.sqlMessage,
    });
    return [
      500,
      {
        mensagem: "Erro ao atualizar foto",
        code: error.code,
        sql: error.sqlMessage,
      },
    ];
  }
};


export const apagarFoto = async (id_foto) => {
  console.log("fotosModel :: apagrFoto");
  const sql = `DELETE FROM fotos WHERE id_fotos = ?`;
  const params = [id_foto];
  try {
    const [resposta] = await conexao.query(sql, params);    
    if (resposta.affectedRows < 1) {
      return [400, { mensagem: "Imagem nao encontrada" }];
    }
    return [200, { mensagem: "Foto deletada com sucesso" }];
  } catch (error) {
    console.error({
      mensagem: "Erro servidor",
      code: error.code,
      sql: error.sqlMessage,
    });
    return [
      500,
      {
        mensagem: "Erro ao deletar foto",
        code: error.code,
        sql: error.sqlMessage,
      },
    ];
    }
  };


  export const mostrarUmaFoto = async (id_foto) => {
    console.log("fotosModel :: mostrarFoto");
    const sql = `SELECT * FROM fotos WHERE id_fotos = ?`;
    const params = [id_foto];
    try {    
      const [resposta] = await conexao.query(sql, params);
      if (resposta.length < 1) {
        return [400, { mensagem: "Imagem nao encontrada" }];
      }
      return [200, resposta[0]];
    } catch (error) {
      console.error({
        mensagem: "Erro servidor",
        code: error.code,
        sql: error.sqlMessage,
      });
      return [
        500,
        {
          mensagem: "Erro ao buscar foto",
          code: error.code,
          sql: error.sqlMessage,
        },
      ];
    }
  };

