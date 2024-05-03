$(document).ready(function () {
    $(".header").load("header.html");
    $(".sidebar").load("sidebar.html");
    $(".footer").load("footer.html");

    let urlParams = new URLSearchParams(window.location.search);
    let bookId = urlParams.get('id');

    $.getJSON('../Cdn/js/data/ebooks.json', function (response) {
      let book = response.data.find(function (item) {
        return item.ebook_id == bookId;
      });
      if (book) {
        $('#title').val(book.title);
        $('#subtitle').val(book.sub_title);
        $('#author').val(book.author);
        $('#category').val(book.category);
        $('#description').val(book.description);
        $('#group').val(book.ebook_group_id);
        $('#code').val(book.code);

        $(".thumbnail_image").attr("src", book.thumbnail_image);
      } else {
        console.log("Book not found with ID: " + bookId);
      }
    });
  });

  $(document).on("click", "#back", function (e) {
    window.location.href = "admin.ebooks.list.html"
  });