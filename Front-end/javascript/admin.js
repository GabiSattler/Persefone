document.addEventListener('DOMContentLoaded', async function() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    const addMethodButton = document.getElementById('addMethodButton');
    const methodModal = document.getElementById('methodModal');
    const closeModal = document.getElementById('closeModal');
    const methodsList = document.getElementById('methodsList');

    // Função para exibir a lista de métodos
    async function loadMethods() {
        const response = await fetch('http://localhost:3000/api/metodos');
        const methods = await response.json();

        methodsList.innerHTML = ''; // Reinicia o conteúdo da lista de métodos para evitar duplicações

        if (methods.length > 0) {
            methods.forEach(method => {
                const methodItem = document.createElement('div');
                methodItem.classList.add('method-item');

                methodItem.innerHTML = `
                    <img src="data:image/jpeg;base64,${method.avatar}" alt="Avatar do Método" class="method-avatar">
                    <h3>${method.tipo}</h3>
                    <div class="method-actions">
                        <img src="../imagens/editar.png" alt="Editar" class="edit-icon" data-id="${method.id}">
                        <img src="../imagens/excluir.png" alt="Excluir" class="delete-icon" data-id="${method.id}">
                    </div>
                `;

                // Evento para abrir a modal de edição ao clicar no ícone de edição
                const editIcon = methodItem.querySelector('.edit-icon');
                editIcon.addEventListener('click', (event) => {
                    event.stopPropagation(); // Impede que o clique no ícone acione o evento do card
                    openModalForEdit(method);
                });

                // Evento para excluir o método ao clicar no ícone de exclusão
                const deleteIcon = methodItem.querySelector('.delete-icon');
                deleteIcon.addEventListener('click', (event) => {
                    event.stopPropagation(); // Impede que o clique no ícone acione o evento do card
                    deleteMethod(method.id);
                });

                methodItem.addEventListener('click', () => {
                    window.location.href = `metodo.html?id=${method.id}`;
                });

                methodsList.appendChild(methodItem);
            });
        } else {
            methodsList.innerHTML = '<p class="semMetodos">Ainda não há métodos cadastrados.</p>';
        }
    }

    // Carregar métodos ao abrir a página
    loadMethods();

    // Função para abrir a modal em modo de criação
    function openModalForCreate() {
        clearModalFields(); // Limpa os campos da modal
        delete document.getElementById('methodForm').dataset.methodId; // Remove o ID do método para modo de criação
        methodModal.style.display = 'block'; // Exibe a modal
    }

    // Função para abrir a modal em modo de edição
    function openModalForEdit(method) {
        clearModalFields(); // Limpa os campos da modal
        // Confirme o valor de 'sus' que está sendo passado
        console.log("Valor de method.sus:", method.sus);
        document.getElementById('tipo').value = method.tipo;
        document.getElementById('descricao').value = method.descricao;
         // Marca o checkbox se o método for fornecido pelo SUS (verificação robusta)
        document.getElementById('fornecidoSus').checked = method.sus === 1 || method.sus === '1' || method.sus === true;
        document.getElementById('methodForm').dataset.methodId = method.id; // Define o ID do método para modo de edição
        methodModal.style.display = 'block'; // Exibe a modal
    }

    // Função para limpar os campos da modal
    function clearModalFields() {
        document.getElementById('methodForm').reset(); // Limpa o formulário
        document.getElementById('fornecidoSus').checked = false; // Desmarca o checkbox
    }

    // Evento para abrir a modal em modo de criação ao clicar no botão "Adicionar Novo Método"
    addMethodButton.addEventListener('click', openModalForCreate);

    // Fecha a modal
    closeModal.addEventListener('click', () => {
        methodModal.style.display = 'none';
    });

    // Envia o formulário de cadastro ou edição de método
    document.getElementById('methodForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const methodId = document.getElementById('methodForm').dataset.methodId; // Pega o ID do método em modo de edição
        const formData = new FormData();
        formData.append('tipo', document.getElementById('tipo').value);
        formData.append('descricao', document.getElementById('descricao').value);
        formData.append('avatar', document.getElementById('avatar').files[0]);
    
        // Adiciona "fornecidoSus" como "true" ou "false" (string) para garantir que o backend recebe uma string
        formData.append('sus', document.getElementById('fornecidoSus').checked ? "true" : "false");
        formData.append('fornecidoSus', fornecidoSus);

        let response;
        if (methodId) {
            // Se houver um ID, executa uma atualização
            response = await fetch(`http://localhost:3000/api/metodos/${methodId}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            // Caso contrário, cria um novo método
            response = await fetch('http://localhost:3000/api/metodos', {
                method: 'POST',
                body: formData
            });
        }

        if (response.ok) {
            alert(methodId ? 'Método atualizado com sucesso!' : 'Método cadastrado com sucesso!');
            methodModal.style.display = 'none'; // Fecha a modal
            loadMethods(); // Recarrega a lista de métodos para exibir o novo
        } else {
            alert('Erro ao processar a requisição. Tente novamente.');
        }
    });

    // Fecha a modal ao clicar fora dela
    window.onclick = function(event) {
        if (event.target === methodModal) {
            methodModal.style.display = 'none';
        }
    };

    async function deleteMethod(methodId) {
        if (confirm('Tem certeza de que deseja excluir este método?')) {
            const response = await fetch(`http://localhost:3000/api/metodos/${methodId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Método excluído com sucesso!');
                loadMethods(); // Atualiza a lista de métodos
            } else {
                alert('Erro ao excluir o método. Tente novamente.');
            }
        }
    }
});
