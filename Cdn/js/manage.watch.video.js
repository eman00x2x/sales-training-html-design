$(document).ready(function () {
    displayVideo();
});

function displayVideo(){
    const videoId = getParams('video_id');
    $.getJSON('../Cdn/js/data/videos.json', function (data) {
        let response = data.data;
    
        // Use Object.keys() to get an array of keys
        const keys = Object.keys(response);
    
        // Find the index of the object with the matching video_id
        const index = keys.find(key => response[key].video_id === videoId);
    
        // Check if the index is found
        if (index !== undefined) {
            console.log(videoId);
            console.log(response[index]);
        } else {
            console.log('Video not found');
        }
    });
}
