const id = getParams('id');
const transactId = getParams('transaction_id');

$(document).ready(function () {
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
                let $status = $('.status').text(data.status);
                $status.addClass(getStatusClass(data.status));
                $('.source').text(data.source);
                $('.payment-id').text(data.payment_transaction_id);
                $('.merchant-email').text(data.merchant_email);

            } else {
                console.log("Transaction not found with ID: " + data.transaction_id);
            }
        });
    }

    $(document).on("click", "#invoice", function () {
        $.when(
            $.getJSON("../Cdn/js/data/profiles.json"),
            $.getJSON("../Cdn/js/data/accounts.json"),
        ).done(function (data1, data2) {
            let response = data1[0].data.map((a) =>
                Object.assign(
                    a,
                    data2[0].data.find((b) => b.account_id == a.account_id)
                )
            );

            let f = response.keys(response).find((key) => response[key].account_id == id);
            let obj = { account: response[f].account_id, name: response[f].name, number: response[f].contact_number[0], address: response[f].address[0]};

            console.log(obj)
            const doc = new jspdf.jsPDF('p', 'mm', [210, 210]);
            var img = new Image();
            img.src = 'https://i.ibb.co/ZWSzHPp/logo.png';

            img.onload = function () {
                doc.addImage(img, 'JPEG', 20, 15, 15, 15);

                doc.setFont('helvetica', 'bold');
                doc.setTextColor('#131C39')
                doc.setFontSize(14);
                doc.text(20, 50, 'Billed to:');
                doc.text(20, 97, 'Transaction Info');
                doc.text(20, 170, 'Payment Info');
                doc.setFontSize(35);

                doc.text(140, 26, 'INVOICE ');
                doc.setFont('helvetica', 'normal');
                doc.setTextColor('#1c1c1c')
                doc.setFontSize(10);
                doc.text(20, 58, obj.name.firstname + ' ' + obj.name.lastname);
                doc.text(20, 63, obj.number);
                doc.text(20, 68, obj.address.permanent.region + ' ' + obj.address.permanent.province + ' ' + obj.address.permanent.municipality);
                doc.text(20, 72, obj.address.permanent.barangay);
                doc.text(55, 178, obj.account.toString());
                doc.text(55, 183, $('.source').text());
                doc.text(55, 188, $('.merchant-email').text());
                doc.text(55, 193, $('.payment-id').text());
                doc.text(175, 145, $('.price').text());
                doc.setFont('helvetica', 'bold');
                doc.text(143, 145, 'Total Amount: ');
                doc.text(20, 178, 'Account ID: ');
                doc.text(20, 183, 'Source: ');
                doc.text(20, 188, 'Merchant Email: ');
                doc.text(20, 193, 'Payment ID: ');
                doc.line(20, 84, 190, 84);
                let rows = [
                    ['ID', 'DETAILS', 'DURATION', 'DATE', 'PRICE'],
                    [$('.transaction-id').text(), $('.details').text(), $('.duration').text(), $('.transaction-date').text(), $('.price').text()],
                    [],
                    [],
                ];

                doc.autoTable({
                    headStyles :{fillColor : ['#131C39']},
                    startY: 105,
                    margin: { left: 20 },
                    tableWidth: 170,
                    theme: 'grid',
                    head: [rows[0]],
                    body: rows.slice(1),
                });

                window.open(doc.output('bloburl'), '_blank');
            };

        })
    });
});

function getStatusClass(status) {
    switch (status) {
        case 'Success':
            return 'text-success';
        case 'Processing':
            return 'text-warning';
        case 'Cancelled':
            return 'text-danger';
        default:
            return 'text-dark';
    }
}