$(".owl-carousel").owlCarousel({
    loop: true, // 循環播放
    margin: 10, // 外距 10px
    nav: false, // 顯示點點
    responsive: {
        0: {
            items: 1, // 螢幕大小為 0~600 顯示 1 個項目
            autoplay: true   //自動輪播
        },
        600: {
            items: 1, // 螢幕大小為 600~1000 顯示 3 個項目
            autoplay: true
        },
        1000: {
            items: 1, // 螢幕大小為 1000 以上 顯示 5 個項目
            autoplay: true
        }
    }
});
