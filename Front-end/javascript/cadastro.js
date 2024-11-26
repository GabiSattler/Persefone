document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('senha', document.getElementById('senha').value);
    formData.append('foto', document.getElementById('foto').files[0]); // Adiciona o arquivo de foto
    formData.append('idade', document.getElementById('idade').value);
    formData.append('biografia', document.getElementById('biografia').value);

    // Define o papel do usuário como "user"
    formData.append('role', 'user');

    try {
        const response = await fetch('http://localhost:3000/api/usuario/cadastrar', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            document.getElementById('errorMessage').textContent = data.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.';
            document.getElementById('errorMessage').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('errorMessage').textContent = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
        document.getElementById('errorMessage').style.display = 'block';
    }
});