$(document).ready(function() {
    var tableRow = $('#posts-row');
    
    function showSelectedFruit() {
        var selectedCategory = $('#category').val();
        var url = 'https://oliver0502api.com/wp-json/wp/v2/posts';

        if (selectedCategory !== 'all') {
            url += '?categories=' + selectedCategory;
        }

        var timestamp = new Date().getTime();
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'timestamp=' + timestamp;

        fetch(url)
        .then(response => response.json())
        .then(posts => {
            tableRow.empty();

            var row = $('<div class="row">');  // 創建新的Bootstrap行

            posts.forEach(post => {
                var title = post.title.rendered;
                var featuredMediaId = post.featured_media;
                var money = post.x_metadata.amount;
                var postId = post.id;

                var mediaUrl = 'https://oliver0502api.com/wp-json/wp/v2/media/' + featuredMediaId+ '?size=medium';
                mediaUrl += (mediaUrl.indexOf('?') === -1 ? '?' : '&') + 'timestamp=' + timestamp;

                fetch(mediaUrl)
                .then(response => response.json())
                .then(mediaResponse => {
                    var featuredImageUrl = mediaResponse.source_url;

                    var col = $('<div class="col">');  // 使用col

                    var card = $('<div class="card shadow-sm">');
                    var imageCell = $('<div class="img" text-align: center>').html('<a href="post.html?id=' + postId + '"><img class="img-fluid" src="' + featuredImageUrl + '"></a>');
                    var card_body = $('<div class="card-body">');

                    var titleCell = $('<p class="card-text">').text(title);
                    var moneyCell = $('<p class="card-text">').text('價格:' + money);

                    card_body.append(titleCell, moneyCell);
                    card.append(imageCell, card_body);
                    col.append(card);

                    row.append(col);  // 將每個col添加到行中

                    // 如果已經有3個col在行中，創建新的行
                    if (row.children().length === 3) {
                        tableRow.append(row);
                        row = $('<div class="row">');  // 重新創建新的Bootstrap行
                    }
                })
                .catch(error => {
                    console.log('獲取特色圖片URL失敗：', error);
                });
            });

            // 如果最後一行沒有填滿3個col，則添加該行
            if (row.children().length > 0) {
                tableRow.append(row);
            }
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
