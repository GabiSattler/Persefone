document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const methodId = params.get('id');
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'admin';

    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    async function loadMethodDetails() {
        try {
            const response = await fetch(`http://localhost:3000/api/metodo/${methodId}`);
            const method = await response.json();

            // Exibir informações do método
            document.getElementById('methodType').textContent = method.tipo;
            document.getElementById('methodDescription').textContent = method.descricao;
            document.getElementById('methodImage').src = `data:image/jpeg;base64,${method.avatar}`;

             // Exibir "Fornecido pelo SUS" se o método for fornecido pelo SUS
            if (method.sus) {
                document.getElementById('sus').style.display = 'block';
            } else {
                document.getElementById('sus').style.display = 'none';
            }

            // Carrega a média de estrelas
            loadAverageStars(methodId);

            // Exibir diferentes botões para admin e usuário
            if (isAdmin) {
                document.getElementById('reviewMethod').style.display = 'none'; // Oculta o botão de avaliação
            } else {
                document.getElementById('reviewMethod').style.display = 'block';
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes do método:', error);
        }
    }

    async function loadAverageStars() {
        try {
            const response = await fetch(`http://localhost:3000/api/avaliacoes/media/${methodId}`);
            const { media_estrelas } = await response.json();
    
            // Arredonda a média de estrelas
            const roundedStars = Math.round(media_estrelas);
            
            // Cria o elemento de exibição das estrelas
            const starContainer = document.createElement('div');
            starContainer.classList.add('avaliacao-stars', 'static-stars'); // Classe para estrelas estáticas
            
            // Define as estrelas cheias e vazias com base na média
            starContainer.innerHTML = `${'★'.repeat(roundedStars)}${'☆'.repeat(5 - roundedStars)}`;
    
            document.getElementById('left').appendChild(starContainer);
        } catch (error) {
            console.error('Erro ao carregar média de avaliações:', error);
        }
    }

    // Chama a função para carregar os detalhes do método
    loadMethodDetails();

    // Evento para avaliar o método
    document.getElementById('reviewMethod').addEventListener('click', () => {
        window.location.href = `avaliar.html?id=${methodId}`; // Abre página de avaliação
    });

    // Evento para ver avaliações
    document.getElementById('seeReviews').addEventListener('click', () => {
        window.location.href = `avaliacoes.html?id=${methodId}`; // Abre página com avaliações
    });
    
});