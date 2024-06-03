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

    // Function to show the success modal
    function showSuccessModal() {
        $('#successModal').modal('show');
        setTimeout(function () {
            $('#successModal').modal('hide');
            window.location.href = 'index.html';
        }, 1500);
    }

    // PayPal Buttons
    paypal.Buttons({
        createOrder: function(data, actions) {
            let totalPrice = $('#total-price').text();
            totalPrice = parseFloat(totalPrice.replace('₱', ''));
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalPrice.toFixed(2) // Can also reference a variable or function
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            // Show the modal before capturing the order
            showSuccessModal();
            return actions.order.capture().then(function(details) {
                sessionStorage.removeItem('cart');
            });
        }
    }).render('#paypal-button-container'); // Renders the PayPal button
});
