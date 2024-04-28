$(document).ready(function () {
    var tableRow = $('#posts-row');

    const menuButton = document.getElementById('menuButton');
    const menu = document.getElementById('menu');

    var category = $('#category a.active').attr('value');
    var category01 = $('#category01');
    var category02 = $('#category02');

    function showSelectedFruit(selectedCategory) {

        var url = 'https://oliver0502api.com/wp-json/wp/v2/posts';

        if (selectedCategory === undefined) {
            url += '?categories=5';
        } else {
            url += '?categories=' + selectedCategory;
            console.log(selectedCategory)
        }

        var timestamp = new Date().getTime();
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'timestamp=' + timestamp;

        fetch(url)
            .then(response => response.json())
            .then(posts => {
                console.log(posts)
                tableRow.empty();

                var row = $('<div class="row">');  // 創建新的Bootstrap行

                // 將帖子按照時間排序
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));

                posts.forEach(post => {
                    var title = post.title.rendered;
                    var featuredMediaId = post.featured_media;
                    var money = post.x_metadata.amount;
                    var postId = post.id;

                    var mediaUrl = 'https://oliver0502api.com/wp-json/wp/v2/media/' + featuredMediaId;
                    mediaUrl += (mediaUrl.indexOf('?') === -1 ? '?' : '&') + 'timestamp=' + timestamp;

                    fetch(mediaUrl)
                        .then(response => response.json())
                        .then(mediaResponse => {
                            var featuredImageUrl = mediaResponse.source_url;

                            var col;

                            // 使用Bootstrap的斷點來判斷螢幕大小
                            if ($(window).width() >= 1000) {  // 大於或等於992px的大屏幕
                                col = $('<div class="col-lg-4 grid-item">');
                            } else {  // 小於992px的較小螢幕
                                col = $('<div class="col-12 grid-item">');
                            }

                            var card = $('<div class="card list">');
                            var imageCell = $('<div class="img" text-align: center>').html('<a href="post.html?id=' + postId + '"><img class="img-fluid" src="' + featuredImageUrl + '"></a>');
                            var card_body = $('<div class="card-body">');

                            var titleCell = $('<p class="card-text">').text(title);
                            var moneyCell = $('<p class="card-text">').text('價格:' + money);

                            card_body.append(titleCell, moneyCell);
                            card.append(imageCell, card_body);
                            col.append(card);

                            row.append(col);  // 將每個col添加到行中
                            tableRow.append(row);

                            // 如果已經有3個col在行中，創建新的行
                            // if (row.children().length === 3) {
                            //     tableRow.append(row);
                            //     row = $('<div class="row">');  // 重新創建新的Bootstrap行
                            // }
                        })
                        .catch(error => {
                            console.log('獲取特色圖片URL失敗：', error);
                        });
                });

                // 如果最後一行沒有填滿3個col，則添加該行
                // if (row.children().length > 0) {
                //     tableRow.append(row);
                // }
            })
            .catch(error => {
                console.log('請求失敗：', error);
            });
    }

    showSelectedFruit("5");

    // 監聽下拉選單的變化，當選擇改變時觸發 showSelectedFruit() 函數
    $('#category a').on('click', function () {
        $('#category a').removeClass('active');
        $(this).addClass('active');
        showSelectedFruit(category);
    });

    category01.click(function () {
        showSelectedFruit(category01.attr('value'));
    });

    category02.click(function () {
        showSelectedFruit(category02.attr('value'));
    });

    menuButton.addEventListener('click', function () {
        menu.classList.toggle('active');
    });
});
