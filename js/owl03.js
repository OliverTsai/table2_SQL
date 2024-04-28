$(document).ready(function () {
    // 獲取API資料並動態生成HTML項目
    var url = 'https://oliver0502api.com/wp-json/wp/v2/posts?categories=5';
    var timestamp = new Date().getTime();
    url += (url.indexOf('?') === -1 ? '?' : '&') + 'timestamp=' + timestamp;

    fetch(url)
        .then(response => response.json())
        .then(posts => {
            var carouselContainer = $('#carousel03');
            carouselContainer.empty(); // 清空原有的項目

            posts.forEach(post => {
                var title = post.title.rendered;
                var featuredMediaId = post.featured_media;
                var postId = post.id;

                // 創建輪播項目
                var item = $('<div class="item">');
                var link = $('<a>').attr('href', 'post.html?id=' + postId);
                var image = $('<img class="img-fluid">').attr('src', 'https://oliver0502api.com/wp-json/wp/v2/media/' + featuredMediaId);

                link.append(image);
                item.append(link);
                carouselContainer.append(item);
            });

            // 初始化OWL輪播
            carouselContainer.owlCarousel({
                loop: true, // 循環播放
                margin: 10, // 外距 10px
                nav: false, // 顯示點點
                responsive: {
                    0: {
                        items: 1, // 螢幕大小為 0~600 顯示 1 個項目
                        autoplay: true   //自動輪播
                    },
                    600: {
                        items: 3, // 螢幕大小為 600~1000 顯示 3 個項目
                        autoplay: true
                    },
                    1000: {
                        items: 3, // 螢幕大小為 1000 以上 顯示 5 個項目
                        autoplay: true
                    }
                }
            });
        })
        .catch(error => {
            console.log('獲取資料失敗：', error);
        });
});

// $(".owl-carousel03").owlCarousel({
//     loop: true, // 循環播放
//     margin: 10, // 外距 10px
//     nav: false, // 顯示點點
//     responsive: {
//         0: {
//             items: 1, // 螢幕大小為 0~600 顯示 1 個項目
//             autoplay: true   //自動輪播
//         },
//         600: {
//             items: 3, // 螢幕大小為 600~1000 顯示 3 個項目
//             autoplay: true
//         },
//         1000: {
//             items: 3, // 螢幕大小為 1000 以上 顯示 5 個項目
//             autoplay: true
//         }
//     }
// });