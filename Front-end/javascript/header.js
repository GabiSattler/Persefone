document.addEventListener('DOMContentLoaded', function() {
    const logoLink = document.querySelector('.logo-link');
    const userMenu = document.getElementById('userMenu');
    const userRole = localStorage.getItem('userRole');

    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    if (userRole === 'admin') {
        logoLink.href = 'homeadmin.html'; // Redireciona para a home do administrador
        userMenu.style.display = 'none'; // Oculta o menu para administradores
    } else {
        logoLink.href = 'home.html'; // Redireciona para a home do usuário comum
        userMenu.style.display = 'block'; // Exibe o menu para usuários comuns
    }
});