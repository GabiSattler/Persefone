document.addEventListener('DOMContentLoaded', async function() {
    // Supõe que o ID do usuário esteja armazenado no Local Storage
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const backButton = document.getElementById('backButton');

    // Define o destino do link de "Voltar" com base no role do usuário
    if (userRole === 'admin') {
        backButton.href = 'homeadmin.html'; // Página de administrador
    } else {
        backButton.href = 'home.html'; // Página de usuário comum
    }

    // Busca informações do usuário na API
    const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`);
    const userData = await response.json();

    // Preenche os campos do perfil com os dados do usuário
    document.getElementById('nome').value = userData.nome || '';
    document.getElementById('biografia').value = userData.biografia || '';
    document.getElementById('idade').value = userData.idade || '';
    document.getElementById('senha').value = userData.senha || ''; // Limpa o campo de senha

    // Exibe a imagem de avatar, se houver
    if (userData.avatar) {
        document.getElementById('avatar').src = userData.avatar;
    }

    // Evento para salvar alterações do perfil
    document.getElementById('profileForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Captura os dados atualizados
        const updatedData = {
            nome: document.getElementById('nome').value,
            biografia: document.getElementById('biografia').value,
            idade: document.getElementById('idade').value,
            role: userRole || userData.role 
        };
        /// Adiciona a senha apenas se o campo não estiver vazio
        const senha = document.getElementById('senha').value;
        if (senha) {
            updatedData.senha = senha;
        }

        const avatar = document.getElementById('file-upload').files[0];
        const formData = new FormData();

        for (const key in updatedData) {
            formData.append(key, updatedData[key]);
        }

        if (avatar) {
            formData.append('avatar', avatar);
        }

        const updateResponse = await fetch(`http://localhost:3000/api/usuario/editar/${userId}`, {
            method: 'PUT',
            body: formData
        });

        if (updateResponse.ok) {
            alert('Perfil atualizado com sucesso!');
        } else {
            alert('Erro ao atualizar o perfil. Tente novamente.');
        }
    });
});