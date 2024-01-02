$(document).ready(function() {
    var tableRow = $('#posts-row');
    
    // 發送 AJAX 請求獲取文章數據
    function showSelectedFruit() {
        var selectedCategory = $('#category').val();
        var url = 'https://oliver0502api.com/wp-json/wp/v2/posts';

        if (selectedCategory !== 'all') {
            url += '?categories=' + selectedCategory;
        }

        $.ajax({
            url: url,
            method: 'GET',
            success: function(response) {
                // 清空表格內容
                tableRow.empty();
                
                var count = 0;

                // 遍歷文章數據並在表格中顯示標題、特色圖片和金額
                $.each(response, function(index, post) {
                    var title = post.title.rendered;
                    var featuredMediaId = post.featured_media;
                    var money = post.x_metadata.amount;
                    var postId = post.id;

                    // 發送 AJAX 請求獲取特色圖片的URL
                    $.ajax({
                        url: 'https://oliver0502api.com/wp-json/wp/v2/media/' + featuredMediaId,
                        method: 'GET',
                        success: function(mediaResponse) {
                            var featuredImageUrl = mediaResponse.source_url;

                            // 創建表格的行並將標題、特色圖片和金額插入
                            var row = $('<td class="col-md-3">');
                            var imageCell = $('<div class="container">').html('<a href="post.html?id=' + postId + '"><img src="' + featuredImageUrl + '"></a>');
                            var titleCell = $('<p>').text(title);
                            var moneyCell = $('<p>').text('價格:' + money);

                            row.append(imageCell, titleCell, moneyCell);
                            tableRow.append(row);

                            count = count + 1;
                            if (count % 4 == 0) {
                                tableRow.append('</tr><tr id="posts-row" class="row">');
                            }
                        },
                        error: function(xhr, status, error) {
                            console.log('獲取特色圖片URL失敗：' + error);
                        }
                    });
                });
            },
            error: function(xhr, status, error) {
                console.log('請求失敗：' + error);
            }
        });
    }

    // 頁面加載时顯示全部文章
    showSelectedFruit();

    // 当下拉列表值发生变化时重新加载文章
    $('#loadPosts').on('click', function () {
        showSelectedFruit();
    });
});
