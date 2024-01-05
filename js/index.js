$(document).ready(function() {
    var tableRow = $('#posts-row');
    
    function showSelectedFruit() {
        var selectedCategory = $('#category').val();
        var url = 'https://oliver0502api.com/wp-json/wp/v2/posts';

        if (selectedCategory !== 'all') {
            url += '?categories=' + selectedCategory;
        }

        // 添加時間戳以禁用快取
        var timestamp = new Date().getTime();
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'timestamp=' + timestamp;

        fetch(url)
        .then(response => response.json())
        .then(posts => {
            tableRow.empty();
            var count = 0;

            posts.forEach(post => {
                var title = post.title.rendered;
                var featuredMediaId = post.featured_media;
                var money = post.x_metadata.amount;
                var postId = post.id;

                // 也在這裡添加時間戳
                var mediaUrl = 'https://oliver0502api.com/wp-json/wp/v2/media/' + featuredMediaId;
                mediaUrl += (mediaUrl.indexOf('?') === -1 ? '?' : '&') + 'timestamp=' + timestamp;


                fetch(mediaUrl)
                .then(response => response.json())
                .then(mediaResponse => {
                    var featuredImageUrl = mediaResponse.source_url;

                    var row = $('<td class="col-md-3">');
                    var imageCell = $('<div class="container">').html('<a href="post.html?id=' + postId + '"><img src="' + featuredImageUrl + '"></a>');
                    var titleCell = $('<p>').text(title);
                    var moneyCell = $('<p>').text('價格:' + money);

                    row.append(imageCell, titleCell, moneyCell);
                    tableRow.append(row);

                    count++;
                    if (count % 4 == 0) {
                        tableRow.append('</tr><tr id="posts-row" class="row">');
                    }
                })
                .catch(error => {
                    console.log('獲取特色圖片URL失敗：', error);
                });
            });
        })
        .catch(error => {
            console.log('請求失敗：', error);
        });
    }

    showSelectedFruit();

    $('#loadPosts').on('click', function () {
        showSelectedFruit();
    });
});
