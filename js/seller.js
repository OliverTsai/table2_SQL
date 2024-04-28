const sellerUrl = 'https://oliver0502api.com/';
const userID = localStorage.getItem('user_ID');
const tableRow = $('#members-articles');

$(document).ready(() => {
    fetchUserArticles();
});

async function fetchUserArticles() {
    try {
        const timestamp = new Date().getTime(); // 取得當前的 timestamp
        const response = await fetch(`${sellerUrl}wp-json/wp/v2/posts?author=${userID}&timestamp=${timestamp}`);
        const posts = await response.json();

        if (posts.length > 0) {
            renderUserArticles(posts);
        } else {
            displayNoArticlesMessage();
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// 商品列表
function renderUserArticles(posts) {
    const container = $('<div class="d-flex justify-content-center flex-wrap">');

    posts.forEach(async (post) => {
        const { title: { rendered: title }, featured_media: featuredMediaId, x_metadata: { amount: money }, id: postId } = post;
        const timestamp = new Date().getTime();
        const mediaUrl = `${sellerUrl}wp-json/wp/v2/media/${featuredMediaId}?timestamp=${timestamp}`;

        try {
            const mediaResponse = await fetch(mediaUrl).then(response => response.json());
            const featuredImageUrl = mediaResponse.source_url;

            const colSizeClass = window.innerWidth >= 1000 ? 'col-lg-4' : 'col-6';

            const col = $(`<div class="col ${colSizeClass} grid-item text-center mb-4">`);
            const card = $('<div class="card">');
            const imageCell = $(`<div class="img"><a href="post.html?id=${postId}"><img class="img-fluid" src="${featuredImageUrl}"></a></div>`);
            const cardBody = $('<div class="card-body">');
            const titleCell = $('<p class="card-text">').text(title);
            const moneyCell = $('<p class="card-text">').text(`價格: ${money}`);

            const deleteButton = $(`<button class="btn btn-danger btn-sm delete-btn" data-postid="${postId}">刪除產品</button>`);
            deleteButton.on('click', () => deleteProduct(postId, mediaResponse.id));

            cardBody.append(titleCell, moneyCell, deleteButton);
            card.append(imageCell, cardBody);
            col.append(card);
            container.append(col);
        } catch (error) {
            console.log('獲取特色圖片URL失敗：', error);
        }
    });

    tableRow.html(container);
}

function displayNoArticlesMessage() {
    $('#members-articles').html('<p>你還沒有新增商品。</p>');
}

// 新增產品
const uploadButton = document.getElementById('save_text');
uploadButton.addEventListener('click', uploadFile);

async function uploadFile() {
    uploadButton.disabled = true;

    const fileName = document.getElementById('file').files[0];
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const category = document.getElementById('add-category').value;
    const money = document.getElementById('money').value;

    try {
        // 取得裁切後的圖片
        const newImgSrc = $('.result img').attr('src');
        const file = await urltoFile(newImgSrc, fileName.name);

        const imageData = await uploadImage(file);
        localStorage.setItem('imageID', imageData.data.id);

        if (imageData.success) {
            const postData = new FormData();
            postData.append('title', title);
            postData.append('content', text);
            postData.append('user_id', userID);
            postData.append('featured_image', localStorage.getItem('imageID'));
            postData.append('money', money);
            // 將分類 ID 存在陣列中
            const categories = ['5', category];
            // 將陣列轉換為 JSON 字串
            postData.append('categories', JSON.stringify(categories));

            const response = await fetch(`${sellerUrl}wp-json/wp/v2/rae/post/create`, {
                method: 'POST',
                body: postData,
            });

            const data = await response.json();

            if (data.status == 200) {
                alert('新增成功！');
                window.location.reload();
            } else {
                console.log('文章判定失敗');
            }
        } else {
            console.log('沒有圖片成功提示');
            console.log(imageData);
        }
    } catch (error) {
        console.error('Upload error:', error);
    } finally {
        uploadButton.disabled = false;
    }
}

// 新增圖片
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${sellerUrl}wp-json/custom-file-upload/v1/upload`, {
            method: 'POST',
            body: formData,
        });

        return await response.json();
    } catch (error) {
        alert('沒有裁切後的圖片!');
        console.log('圖片新增失敗');
        console.error(error);
    }
}

async function deleteProduct(postId, mediaId) {
    try {
        await deletePost(postId);
        await deleteMedia(mediaId);
        alert('已成功刪除');
        window.location.reload();
    } catch (error) {
        console.error('Delete product error:', error);
    }
}

// 刪除產品
async function deletePost(postId) {
    const postToken = localStorage.getItem('token');
    const response = await fetch(`${sellerUrl}wp-json/wp/v2/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${postToken}` },
    });

    if (!response.ok) {
        throw new Error(`Delete post failed: ${response.statusText}`);
    }
}

// 刪除圖片
async function deleteMedia(mediaId) {
    const mediaToken = localStorage.getItem('token');
    const response = await fetch(`${sellerUrl}wp-json/wp/v2/media/${mediaId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${mediaToken}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: '_method=DELETE',
    });

    if (!response.ok) {
        throw new Error(`Delete media failed: ${response.statusText}`);
    }
}

// 將base64轉換為File物件
function urltoFile(url, filename, mimeType) {
    return (fetch(url)
        .then(function (res) { return res.arrayBuffer(); })
        .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
}

var imgNewWidth = 800;  // px
var imgNewHeight;
var imgNewSize = 150;  // k
var $t = $('#tailoringImg');

$('#file').change(function () {
    let file = this.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (evt) {
            let imgSrc = evt.target.result;
            $t.cropper('replace', imgSrc, false);
        }
        reader.readAsDataURL(file);
    }
});

// cropper圖片裁剪
$t.cropper({
    aspectRatio: 800 / 600,  // 預設比例
    preview: '#previewImg',  // 預覽檢視
    guides: false,   // 裁剪框的虛線(九宮格)
    autoCropArea: 0.5, // 0-1之間的數值，定義自動剪裁區域的大小，預設0.8
    dragMode: 'crop', // 拖曳模式 crop(Default,新增裁剪框) / move(移動裁剪框&圖片) / none(無動作)
    cropBoxResizable: true, // 是否有裁剪框調整四邊八點
    movable: true, // 是否允許移動圖片
    zoomable: true, // 是否允許縮放圖片大小
    rotatable: false,   // 是否允許旋轉圖片
    zoomOnWheel: true, // 是否允許通過滑鼠滾輪來縮放圖片
    zoomOnTouch: true, // 是否允許通過觸控移動來縮放圖片
    ready: function (e) {
        console.log('ready!');
    }
});

$('#sureCut').click(function () {
    if (!$t.attr("src")) {
        return false;
    } else {
        var cropImg = $('#tailoringImg').cropper('getData');
        console.log('cropImg', cropImg);
        imgNewHeight = Math.round(imgNewWidth * cropImg.height / cropImg.width);
        var cvs = $t.cropper('getCroppedCanvas');// 獲取被裁剪後的canvas
        console.log('cvs', cvs);
        var context = cvs.getContext('2d');
        console.log('context', context);
        var base64 = cvs.toDataURL('image/jpeg'); // 轉換為base64
        var compressRatio = 102;

        var img = new Image();
        img.src = base64;
        img.onload = function () {
            var newImg;
            // 使用 canvas 調整圖片寬高
            cvs.width = imgNewWidth;
            cvs.height = imgNewHeight;
            context.clearRect(0, 0, imgNewWidth, imgNewHeight);
            // 調整圖片尺寸
            context.drawImage(img, 0, 0, imgNewWidth, imgNewHeight);
            // 顯示新圖片
            $('.result').show();
            do {
                compressRatio -= 2;
                console.log('compressRatio', compressRatio);
                newImg = cvs.toDataURL("image/jpeg", compressRatio / 100);
            } while (Math.round(0.75 * newImg.length / 1000) > imgNewSize);
            console.log('compressRatio', compressRatio / 100);

            $('.result p').text('新圖片尺寸 ' + imgNewWidth + 'x' + imgNewHeight);
            $('.result span').text('檔案大小約 ' + Math.round(0.75 * newImg.length / 1000) + 'k / ' + Math.round(0.75 * base64.length / 1000) + 'k');
            $('.result img').attr("src", newImg);
            $('.result input').val(newImg);
        };
    }
});
