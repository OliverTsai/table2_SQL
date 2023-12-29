function getQueryParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

// Function to display post content
function displayPostContent() {
    const postId = getQueryParam('id');

    // Send AJAX request to get post data
    $.ajax({
        url: 'http://oliver.hopto.org/wordpress/wp-json/wp/v2/posts/' + postId,
        method: 'GET',
        success: function(response) {
            const title = response.title.rendered;
            const content = response.content.rendered;
            const featuredMediaId = response.featured_media;

            // Send AJAX request to get featured image URL
            $.ajax({
                url: 'http://oliver.hopto.org/wordpress/wp-json/wp/v2/media/' + featuredMediaId,
                method: 'GET',
                success: function(mediaResponse) {
                    const featuredImageUrl = mediaResponse.source_url;

                    // Display post title, content, and featured image
                    document.getElementById('post-title').textContent = title;
                    document.getElementById('post-image').setAttribute('src', featuredImageUrl);
                    document.getElementById('post-content').innerHTML = content;
                },
                error: function(xhr, status, error) {
                    console.log('Failed to get featured image URL: ' + error);
                }
            });
        },
        error: function(xhr, status, error) {
            console.log('Request failed: ' + error);
        }
    });
}

// Call the function to display post content when the page loads
displayPostContent();