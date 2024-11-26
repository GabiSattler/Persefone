import pool from '../db/mysql.js'
import multer from 'multer';

// Configuração do multer para armazenamento na memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('foto');
const uploadEditar = multer({ storage: storage }).single('avatar');

export const cadastrarUsuario = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
        }

        const { nome, email, senha, idade, biografia, role } = req.body;
        const avatar  = req.file ? req.file.buffer : null; // Armazena a imagem como buffer

        try {
            // Verificar se o email já existe
            const [rows] = await pool.query('SELECT email FROM usuario WHERE email = ?', [email]);

            if (rows.length > 0) {
                return res.status(400).json({ message: 'Email já cadastrado!' });
            }

            // Adicionar o novo usuário com a imagem
            const query = 'INSERT INTO usuario (email, senha, biografia, nome, avatar, idade, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const values = [email, senha, biografia, nome, avatar, idade, role];
            await pool.query(query, values);

            res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao cadastrar usuário!' });
        }
    });
};

export const editarUsuario = async (req, res) => {
  uploadEditar(req, res, async (err) => {
      if (err) {
          return res.status(500).json({ message: 'Erro ao fazer upload do avatar' });
      }

      const { id } = req.params;
      const { nome, biografia, idade, senha, role } = req.body;
      const avatar = req.file ? req.file.buffer : null; // Obtem o avatar se houver

      try {
          let query, values;

          if (avatar) {
              // Atualiza todos os campos incluindo o avatar
              query = 'UPDATE usuario SET nome = ?, biografia = ?, senha = ?, avatar = ?, idade = ?, role = ? WHERE id = ?';
              values = [nome, biografia, senha, avatar, idade, role, id];
          } else {
              // Atualiza sem o avatar
              query = 'UPDATE usuario SET nome = ?, biografia = ?, senha = ?, idade = ?, role = ? WHERE id = ?';
              values = [nome, biografia, senha, idade, role, id];
          }

          const [result] = await pool.query(query, values);

          if (result.affectedRows === 0) {
              return res.status(404).json({ message: 'Usuário não encontrado!' });
          }

          res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erro ao atualizar usuário!' });
      }
  });
};

export const listarUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nome, email, biografia, avatar, idade FROM usuario WHERE role = "user" ');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar usuários!' });
  }
};

export const listarUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT nome, biografia, idade, senha, avatar FROM usuario WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    const user = rows[0];

    // Converte o avatar para base64 se ele existir
    if (user.avatar) {
        user.avatar = `data:image/jpeg;base64,${user.avatar.toString('base64')}`;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuário!' });
  }
};
export const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o usuário é administrador antes de excluir
    const [user] = await pool.query('SELECT role FROM usuario WHERE id = ?', [id]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    if (user[0].role === 'admin') {
      return res.status(403).json({ message: 'Não é permitido excluir um usuário administrador!' });
    }

    // Se o usuário não for admin, prossegue com a exclusão
    const [result] = await pool.query('DELETE FROM usuario WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    res.status(200).json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir usuário!' });
  }
};

export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Consulta o usuário com base no email e senha fornecidos
    const query = 'SELECT id, email, biografia, nome, avatar, idade, role FROM usuario WHERE email = ? AND senha = ?';
    const [rows] = await pool.query(query, [email, senha]);

    // Verifica se o usuário foi encontrado
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email ou senha incorretos!' });
    }

    // Retorna os dados do usuário (exceto senha) em caso de sucesso
    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar login!' });
  }
};

