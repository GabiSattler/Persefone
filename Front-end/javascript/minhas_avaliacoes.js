document.addEventListener('DOMContentLoaded', async function() {
    const userReviewsList = document.getElementById('userReviewsList');
    const editModal = document.getElementById('editModal');
    const editComment = document.getElementById('editComment');
    const starRating = document.getElementById('starRating');
    let selectedRating = 0;
    let currentReviewId;

    async function loadUserReviews() {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:3000/api/avaliacoes/usuario/${userId}`);
            const reviews = await response.json();

            if (reviews.length === 0) {
                userReviewsList.innerHTML = '<p>Você ainda não avaliou nenhum método.</p>';
                return;
            }
            userReviewsList.innerHTML = '';
            reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.classList.add('review-card');
                reviewCard.innerHTML = `
                    <h4>${review.nomeMetodo}</h4>
                    <div class="stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div>
                    <p>${review.comentario}</p>
                    <div class="actions">
                        <img src="../imagens/editar.png" alt="Editar" class="edit-icon" onclick="openEditModal(${review.id_avaliacao}, '${review.comentario}', ${review.stars})">
                        <img src="../imagens/excluir.png" alt="Excluir" class="delete-icon" onclick="deleteReview(${review.id_avaliacao})">
                    </div>
                `;
                userReviewsList.appendChild(reviewCard);
            });
        } catch (error) {
            console.error('Erro ao carregar avaliações:', error);
            userReviewsList.innerHTML = '<p>Erro ao carregar suas avaliações.</p>';
        }
    }

    window.openEditModal = function(reviewId, comment, stars) {
        currentReviewId = reviewId;
        editComment.value = comment;
        highlightStars(stars);
        selectedRating = stars;
        editModal.style.display = 'block';
        console.log(currentReviewId)
    };

    function closeEditModal() {
        editModal.style.display = 'none';
        editComment.value = '';
        highlightStars(0);
        currentReviewId = null;
    }

    function highlightStars(rating) {
        [...starRating.children].forEach((star, index) => {
            star.textContent = index < rating ? '★' : '☆';
            star.classList.toggle('selected', index < rating);
        });
    }

    starRating.addEventListener('click', event => {
        if (event.target.tagName === 'SPAN') {
            selectedRating = Number(event.target.getAttribute('data-value'));
            highlightStars(selectedRating);
        }
    });

    document.getElementById('closeModal').onclick = closeEditModal;

    document.getElementById('saveEdit').addEventListener('click', async function() {
        try {
            const response = await fetch(`http://localhost:3000/api/avaliacoes/${currentReviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    stars: selectedRating,
                    comentario: editComment.value
                })
            });

            if (response.ok) {
                alert('Avaliação atualizada com sucesso!');
                closeEditModal();
                loadUserReviews();
            } else {
                alert('Erro ao atualizar avaliação.');
            }
        } catch (error) {
            console.error('Erro ao atualizar avaliação:', error);
        }
    });

    window.deleteReview = async function(reviewId) {
        if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/avaliacoes/${reviewId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Avaliação excluída com sucesso.');
                    loadUserReviews();
                } else {
                    alert('Erro ao excluir avaliação.');
                }
            } catch (error) {
                console.error('Erro ao excluir avaliação:', error);
            }
        }
    }

    loadUserReviews();
});
