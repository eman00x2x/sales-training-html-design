const id = getParams('id');
const transactId = getParams('transaction_id');

$(document).ready(function() {
    $('.breadcrumb-item a').attr('href', './manage.transaction.list.html?id=' + id);

    getTransactionsData()

    function getTransactionsData() {

        $.getJSON('../Cdn/js/data/transactions.json', function (response) {
            let data = response.data.find(function (item) {
                return item.transaction_id == transactId;
            });
            if (data) {
                $('.transaction-id').text(data.transaction_id);
                $('.duration').text(data.duration.toString());
                $('.price').text(data.price);
                $('.transaction-date').text(convertDate(data.created_at));
                $('.details').text(data.details);
                $('.status').text(data.status);
                $('.source').text(data.source);
                $('.payment-id').text(data.payment_transaction_id);
                $('.merchant-email').text(data.merchant_email);
    
            } else {
                console.log("Transaction not found with ID: " + data.transaction_id);
            }
        });
    }

    $(document).on("click", "#invoice", function(){
        const doc = new jspdf.jsPDF();
    
        var img = new Image();
        img.src = 'https://yt3.googleusercontent.com/H6A1xBfl3_ykU3ThcuvSFVAi7ezdgW73zokuU0beZixcZe1_pZ9mTayF2w-RCsrblcIUkU43BA=s900-c-k-c0x00ffffff-no-rj';
    
        img.onload = function() {
            doc.addImage(img, 'JPEG', 140, 0, 50, 50);
    
            doc.addFont('https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf', 'Montserrat', 'normal');

            doc.setFont('Montserrat');
    
            doc.setFontSize(20);
            doc.text(20, 55, 'TRANSACTION DETAILS');
            doc.line(20, 60, 190, 60);
            doc.setFontSize(12);
            doc.text(20, 70, 'Transaction ID: ' + $('.transaction-id').text());
            doc.text(20, 76, 'Duration: ' + $('.duration').text());
            doc.text(20, 82, 'Price: ₱ ' + $('.price').text());
            doc.text(20, 88, 'Transaction Date: ' + $('.transaction-date').text());
            doc.text(20, 94, 'Details: ' + $('.details').text())
    
            doc.save('invoice.pdf');
        };
    });
    

    
});