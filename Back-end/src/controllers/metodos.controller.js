import pool from '../db/mysql.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('avatar');

export const cadastrarMetodo = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer upload do avatar' });
        }

        const { tipo, descricao } = req.body;
        const fornecidoSus = req.body.fornecidoSus === 'true'; // Converte para booleano
        const avatar = req.file ? req.file.buffer : null;

        try {
            const query = 'INSERT INTO metodos_contraceptivo (tipo, descricao, avatar, sus) VALUES (?, ?, ?, ?)';
            const values = [tipo, descricao, avatar, fornecidoSus];
            await pool.query(query, values);

            res.status(201).json({ message: 'Método cadastrado com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao cadastrar método.' });
        }
    });
};


  
export const editarMetodo = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer upload do avatar' });
        }
  
        const { id } = req.params;
        const { tipo, descricao, sus } = req.body; // Adiciona o campo "sus" enviado do frontend
        const avatar = req.file ? req.file.buffer : null;
  
        try {
            let query, values;
            const susBoolean = sus === 'true';
  
            if (avatar) {
                // Atualiza todos os campos, incluindo o avatar
                query = 'UPDATE metodos_contraceptivo SET tipo = ?, descricao = ?, avatar = ?, sus = ? WHERE id = ?';
                values = [tipo, descricao, avatar, susBoolean, id]; // "sus === 'true'" para converter o valor em booleano
            } else {
                // Atualiza todos os campos sem o avatar
                query = 'UPDATE metodos_contraceptivo SET tipo = ?, descricao = ?, sus = ? WHERE id = ?';
                values = [tipo, descricao, susBoolean, id]; // "sus === 'true'" para converter o valor em booleano
            }
  
            const [result] = await pool.query(query, values);
  
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Método contraceptivo não encontrado!' });
            }
  
            res.status(200).json({ message: 'Método contraceptivo atualizado com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao atualizar método contraceptivo!' });
        }
    });
};
  


export const excluirMetodo = async (req, res) => {
  const { id } = req.params;

  try {
      const query = 'DELETE FROM metodos_contraceptivo WHERE id = ?';
      const [result] = await pool.query(query, [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Método contraceptivo não encontrado!' });
      }

      res.status(200).json({ message: 'Método contraceptivo excluído com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir método contraceptivo!' });
  }
};


// Atualiza o método listarMetodos para incluir o campo "sus"
export const listarMetodos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, tipo, descricao, avatar, sus FROM metodos_contraceptivo');

        // Converte cada método para incluir a imagem em base64 e interpreta o valor de "sus" como booleano
        const methods = rows.map(method => ({
            ...method,
            avatar: method.avatar ? method.avatar.toString('base64') : null,
            sus: Boolean(method.sus) // Converte "sus" para booleano
        }));

        res.status(200).json(methods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar métodos.' });
    }
};

// Já está correto no método metodoPorId; apenas verifique se o valor retornado de "sus" está em booleano
export const metodoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT id, tipo, descricao, avatar, sus FROM metodos_contraceptivo WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Método contraceptivo não encontrado!' });
        }

        // Converte o avatar para base64 se existir e interpreta "sus" como booleano
        const method = rows[0];
        method.avatar = method.avatar ? method.avatar.toString('base64') : null;
        method.sus = Boolean(method.sus);

        res.status(200).json(method);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar método contraceptivo!' });
    }
};

