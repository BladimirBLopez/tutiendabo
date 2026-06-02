// Script para la tarjeta de presentación
document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidad de categorías
    const categories = document.querySelectorAll('.category-item');
    
    categories.forEach(cat => {
        cat.addEventListener('click', function() {
            // Remover clase activa de todos
            categories.forEach(c => c.classList.remove('active'));
            // Activar el seleccionado
            this.classList.add('active');
            
            const categoryName = this.querySelector('span:first-child').innerText;
            
            // Filtrar productos según categoría
            const products = document.querySelectorAll('.product-card');
            
            if (categoryName === 'Todos') {
                products.forEach(product => {
                    product.style.display = 'block';
                });
            } else if (categoryName === 'Otros') {
                // Para "Otros" puedes ocultar algunos productos
                products.forEach((product, index) => {
                    if (index === 0) {
                        product.style.display = 'none';
                    } else {
                        product.style.display = 'block';
                    }
                });
            }
        });
    });
    
    // Efecto táctil en productos (vibración en móvil)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(30);
            }
        });
    });
});

// Configuración - CAMBIA AQUÍ TU NÚMERO DE WHATSAPP
const CONFIG = {
    WHATSAPP_NUMBER: "59170000000"  // Tu número sin el + (ej: 59171234567)
};

// Actualizar el número de WhatsApp en todos los botones
document.addEventListener('DOMContentLoaded', () => {
    const message = "Hola Guli, quisiera hacer un pedido";
    const encodedMessage = encodeURIComponent(message);
    
    // Botón normal
    const whatsappBtn = document.querySelector('.whatsapp-button');
    if (whatsappBtn && CONFIG.WHATSAPP_NUMBER) {
        whatsappBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    }
    
    // Botón flotante
    const floatingBtn = document.querySelector('.btn-flotante-whatsapp');
    if (floatingBtn && CONFIG.WHATSAPP_NUMBER) {
        floatingBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    }
});