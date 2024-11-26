document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    const excluirContaBtn = document.getElementById('excluirContaBtn');
    const confirmModal = document.getElementById('confirmModal');
    const confirmarExcluir = document.getElementById('confirmarExcluir');
    const cancelarExcluir = document.getElementById('cancelarExcluir');

    // Exibe o modal de confirmação
    excluirContaBtn.addEventListener('click', function(event) {
        event.preventDefault();
        confirmModal.style.display = 'block';
    });

    // Cancela a exclusão e fecha o modal
    cancelarExcluir.addEventListener('click', function() {
        confirmModal.style.display = 'none';
    });

    // Confirma a exclusão da conta
    confirmarExcluir.addEventListener('click', async function() {
        try {
            const response = await fetch(`http://localhost:3000/api/usuario/excluir/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Conta excluída com sucesso!');
                localStorage.clear(); // Limpa o Local Storage
                window.location.href = '../index.html'; // Redireciona para a página inicial
            } else {
                alert('Erro ao excluir a conta. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar ao servidor.');
        }
    });
});