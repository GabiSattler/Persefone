import pool from '../db/mysql.js'

export const cadastrarAvaliacao = async (req, res) => {
  const { userId, methodId, comentario, rating } = req.body; // Alinha com os dados recebidos do frontend

  try {
      const query = 'INSERT INTO avaliacoes (id_usuario, id_metodo, comentario, stars) VALUES (?, ?, ?, ?)';
      const values = [userId, methodId, comentario, rating];
      await pool.query(query, values);

      res.status(201).json({ message: 'Avaliação cadastrada com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao cadastrar avaliação!' });
  }
};


export const editarAvaliacao = async (req, res) => {
    const { id } = req.params;
    const { comentario, stars } = req.body;
  
    try {
      const query = 'UPDATE avaliacoes SET comentario = ?, stars = ? WHERE id_avaliacao = ?';
      const values = [comentario, stars, id];
      const [result] = await pool.query(query, values);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Avaliação não encontrada!' });
      }
  
      res.status(200).json({ message: 'Avaliação atualizada com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar avaliação!' });
    }
};
  
export const excluirAvaliacao = async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = 'DELETE FROM avaliacoes WHERE id_avaliacao = ?';
      const [result] = await pool.query(query, [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Avaliação não encontrada!' });
      }
  
      res.status(200).json({ message: 'Avaliação excluída com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir avaliação!' });
    }
};

export const listarAvaliacoesPorMetodo = async (req, res) => {
  const { id_metodo } = req.params;

  try {
      // Consulta para obter o nome do método e as avaliações com o nome do usuário
      const [rows] = await pool.query(
          `
          SELECT 
              m.tipo AS nomeMetodo,
              u.nome AS nomeUsuario,
              a.comentario,
              a.stars
          FROM avaliacoes a
          JOIN metodos_contraceptivo m ON m.id = a.id_metodo
          JOIN usuario u ON u.id = a.id_usuario
          WHERE a.id_metodo = ?
          `,
          [id_metodo]
      );

      if (rows.length === 0) {
          return res.status(404).json({ message: 'Método ou avaliações não encontradas!' });
      }

      // Estrutura da resposta JSON
      res.status(200).json({
          nomeMetodo: rows[0].nomeMetodo, // Nome do método (todas as avaliações são para o mesmo método)
          avaliacoes: rows.map(row => ({
              nomeUsuario: row.nomeUsuario,
              comentario: row.comentario,
              stars: row.stars
          }))
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar avaliações!' });
  }
};

export const listarAvaliacoesPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
      const [rows] = await pool.query(
          `
          SELECT 
              a.id_avaliacao, 
              a.id_metodo, 
              a.comentario, 
              a.stars, 
              m.tipo AS nomeMetodo
          FROM avaliacoes a
          JOIN metodos_contraceptivo m ON m.id = a.id_metodo
          WHERE a.id_usuario = ?
          `,
          [id_usuario]
      );

      res.status(200).json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar avaliações!' });
  }
};

export const mediaEstrelasMetodo = async (req, res) => {
  const { id_metodo } = req.params;

  try {
      const [rows] = await pool.query(
          'SELECT AVG(stars) AS media_estrelas FROM avaliacoes WHERE id_metodo = ?',
          [id_metodo]
      );

      const mediaEstrelas = rows[0].media_estrelas ? parseFloat(rows[0].media_estrelas) : 0;

      res.status(200).json({ media_estrelas: mediaEstrelas });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao calcular média de estrelas!' });
  }
};

