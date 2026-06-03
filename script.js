document.addEventListener('DOMContentLoaded', () => {

    const categories = document.querySelectorAll('.category-item');
    const products = document.querySelectorAll('.product-card');

    // ===== INICIALIZAR CONTEOS =====
    function updateCounts() {
        categories.forEach(cat => {
            const filter = cat.getAttribute('data-filter');
            const countEl = cat.querySelector('.count');
            if (!countEl) return;

            if (filter === 'todos') {
                countEl.textContent = `(${products.length})`;
            } else {
                const count = document.querySelectorAll(`.product-card[data-category="${filter}"]`).length;
                countEl.textContent = `(${count})`;
            }
        });
    }

    updateCounts();

    // ===== FILTRADO POR CATEGORÍA =====
    categories.forEach(cat => {
        cat.addEventListener('click', function () {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            products.forEach(product => {
                if (filter === 'todos') {
                    product.style.display = 'flex';
                } else {
                    product.style.display =
                        product.getAttribute('data-category') === filter ? 'flex' : 'none';
                }
            });
        });
    });

    // ===== VIBRACIÓN TÁCTIL =====
    products.forEach(card => {
        card.addEventListener('click', () => {
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(30);
            }
        });
    });

    // ===== WHATSAPP =====
    const CONFIG = { WHATSAPP_NUMBER: "59175180321" };
    const encodedMessage = encodeURIComponent("Hola, quisiera hacer un pedi do");

    const barraBtn = document.querySelector('.barra-btn');
    if (barraBtn) {
        barraBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    }
});