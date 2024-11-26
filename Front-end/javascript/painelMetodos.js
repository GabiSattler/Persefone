document.addEventListener('DOMContentLoaded', async function() {
    const methodsList = document.getElementById('methodsList');
    const searchInput = document.getElementById('searchInput');

    // Carrega todos os métodos do banco de dados
    async function loadMethods() {
        try {
            const response = await fetch('http://localhost:3000/api/metodos');
            const methods = await response.json();
            displayMethods(methods);
        } catch (error) {
            console.error('Erro ao carregar métodos:', error);
            methodsList.innerHTML = '<p>Erro ao carregar métodos. Tente novamente mais tarde.</p>';
        }
    }

    // Função para exibir os métodos no formato de cards
    function displayMethods(methods) {
        methodsList.innerHTML = '';
        methods.forEach(method => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="data:image/jpeg;base64,${method.avatar}" alt="${method.tipo}">
                <h3>${method.tipo}</h3>
            `;
            card.addEventListener('click', () => {
                window.location.href = `metodo.html?id=${method.id}`;
            });
            methodsList.appendChild(card);
        });
    }

    // Função de pesquisa
    searchInput.addEventListener('input', async function() {
        const searchTerm = searchInput.value.toLowerCase();
        const response = await fetch('http://localhost:3000/api/metodos');
        const methods = await response.json();
        const filteredMethods = methods.filter(method => 
            method.tipo.toLowerCase().includes(searchTerm)
        );
        displayMethods(filteredMethods);
    });

    loadMethods();
});
