let data;

const getModel = (url) => {
  $.getJSON(url, function(response) {
    data = response.data;
  });
};