$(document).ready(function () {
    function updateCartDisplay() {
        let cart = sessionStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        
        const cartTableBody = $('#cart-items tbody');
        cartTableBody.empty();
        
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemRow = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.type}</td>
                    <td>${item.category}</td>
                    <td>₱${parseFloat(item.price).toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm remove-from-cart p-1" data-premium-id="${item.id}">Remove</button></td>
                </tr>
            `;
            cartTableBody.append(itemRow);
            totalPrice += parseFloat(item.price);
        });
        
        $('#total-price').text(totalPrice.toFixed(2));
    }

    updateCartDisplay();

    $(document).on('click', '.remove-from-cart', function () {
        const button = $(this);
        const premiumId = button.data('premium-id');
        
        let cart = sessionStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        
        const updatedCart = cart.filter(item => item.id !== premiumId);
        
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        
        updateCartDisplay();
        
        $(`.add-to-cart[data-premium-id="${premiumId}"]`).removeClass('btn-success').addClass('btn-outline-primary').text('Add to Cart');
    });

    $('#checkout-button').click(function () {
        window.location.href = 'manage.checkout.html';
    });
});
