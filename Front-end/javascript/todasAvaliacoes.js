document.addEventListener('DOMContentLoaded', async function() {
    const methodId = new URLSearchParams(window.location.search).get('id'); // Obtém o ID do método da URL
    const avaliacoesContainer = document.getElementById('avaliacoesContainer');

    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    // Função para carregar e exibir as avaliações
    async function loadAvaliacoes() {
        try {
            const response = await fetch(`http://localhost:3000/api/avaliacoes/${methodId}`);
             
            if (!response.ok) {
                if (response.status === 404) {
                    avaliacoesContainer.innerHTML = '<p class="semAvaliacao">Ainda não há avaliações para este método.</p>';
                } else {
                    throw new Error('Erro ao buscar avaliações');
                }
                return; // Finaliza a função para evitar tentar exibir avaliações inexistentes
            }

            const data = await response.json();
            const { nomeMetodo, avaliacoes } = data;

            // Exibe o nome do método
            document.getElementById('methodType').textContent = nomeMetodo;

            // Verifica se há avaliações
            if (!Array.isArray(avaliacoes) || avaliacoes.length === 0) {
                avaliacoesContainer.innerHTML = '<p>Ainda não há avaliações para este método.</p>';
                return;
            }

            // Exibe cada avaliação
            avaliacoesContainer.innerHTML = ''; // Limpa o container
            avaliacoes.forEach(avaliacao => {
                const avaliacaoElement = document.createElement('div');
                avaliacaoElement.classList.add('avaliacao-item');
                avaliacaoElement.innerHTML = `
                    <p><strong>${avaliacao.nomeUsuario}</strong></p>
                    <div class="avaliacao-stars">${'★'.repeat(avaliacao.stars)}${'☆'.repeat(5 - avaliacao.stars)}</div>
                    <p>${avaliacao.comentario}</p>
                `;
                avaliacoesContainer.appendChild(avaliacaoElement);
            });
        } catch (error) {
            console.error('Erro ao carregar avaliações:', error);
            avaliacoesContainer.innerHTML = '<p>Erro ao carregar avaliações. Tente novamente mais tarde.</p>';
        }
    }

    loadAvaliacoes();
});
