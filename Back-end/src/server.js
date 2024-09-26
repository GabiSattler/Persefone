import express from 'express';

//cria um servidor com express
const server = express();

//Para respostas da API vamos usar o JSON, isso é configurado abaixo
server.use(express.json());

//Configuração padrão do express para dados de requisição
server.use(express.urlencoded({extended:true}));

//rota de teste
server.get('/ping',(req, res) => {
    res.json('pong');
})

//Iniciando o servidor
server.listen(3000, () => {
    console.log("Servidor está rodando no link: http://localhost:3000/ping")
})

