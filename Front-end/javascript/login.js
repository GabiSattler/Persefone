document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        console.log(data)
        if (response.ok) {
            // Salva informações do usuário no Local Storage
            localStorage.setItem('nomeUsuario', data.user.nome);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userRole', data.user.role); // Salva o papel do usuário (admin ou usuário comum)
            // Redireciona para a página apropriada com base no papel do usuário
            if (data.user.role === 'admin') {
                window.location.href = 'homeadmin.html'; // Redireciona para a home do administrador
            } else {
                window.location.href = 'home.html'; // Redireciona para a home do usuário comum
            }
        }  else {
            // Exibe mensagem de erro
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.message || 'Erro ao fazer login. Verifique suas credenciais.';
        }
    } catch (error) {
        console.error('Erro:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
    }
});