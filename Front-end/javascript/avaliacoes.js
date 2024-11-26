document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star-rating span');
    let selectedRating = 0;

    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    // Evento para "marcar" as estrelas ao passar o mouse
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            highlightStars(star.getAttribute('data-value'));
        });

        // Remove o destaque ao sair do hover
        star.addEventListener('mouseout', () => {
            highlightStars(selectedRating);
        });

        // Evento para selecionar a avaliação ao clicar
        star.addEventListener('click', () => {
            selectedRating = star.getAttribute('data-value');
            highlightStars(selectedRating);
        });
    });

    // Função para destacar as estrelas com base na avaliação
    function highlightStars(rating) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    // Evento para enviar a avaliação ao clicar no botão
    document.getElementById('submitRating').addEventListener('click', async () => {
        if (selectedRating === 0) {
            alert('Por favor, selecione uma avaliação.');
            return;
        }

        const methodId = new URLSearchParams(window.location.search).get('id'); // Obtém o ID do método da URL
        const userId = localStorage.getItem('userId'); // Supondo que o ID do usuário esteja salvo no localStorage
        const comentario = document.querySelector('.comentarios textarea').value.trim();

        if (!comentario) {
            alert('Por favor, digite um comentário.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/avaliacoes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    methodId: methodId,
                    userId: userId,
                    rating: selectedRating,
                    comentario: comentario
                })
            });

            if (response.ok) {
                alert('Avaliação enviada com sucesso!');
                window.location.href = `metodo.html?id=${methodId}`;
            } else {
                alert('Erro ao enviar a avaliação. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar a avaliação:', error);
            alert('Erro ao conectar ao servidor.');
        }
    });
});
