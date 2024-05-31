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
                </tr>
            `;
            cartTableBody.append(itemRow);
            totalPrice += parseFloat(item.price);
        });
        
        $('#total-price').text(totalPrice.toFixed(2));
    }

    updateCartDisplay();

    $('#checkout-form').submit(function (event) {
        event.preventDefault();

        $('#successModal').modal('show');

        sessionStorage.removeItem('cart');
        
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 1500); 
    });
});
