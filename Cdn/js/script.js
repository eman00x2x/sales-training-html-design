const getModel = (url) => {
    $.getJSON(url, function(response) {
      return response.data;
    });
};