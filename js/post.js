$(document).ready(function () {

    var title = "";
    var money = "";

    // 在按下按钮时调用 sendMoneyData 函数
    $('#sendMoneyButton').click(function () {
        sendMoneyData(title, money);
        var modal = $('#cart');
        modal.modal('show');
    });

    $('#sendCarButton').click(function () {
        sendCarData(title, money);
    });

    $('#paymentButton').click(function () {
        const token = localStorage.getItem('token');
        if (token) {
            alert('目前沒有開通金流功能');
        } else {
            alert('請先註冊會員');
        }
    });

    // 获取文章内容并显示的函数
    function displayPostContent() {
        const postId = getQueryParam('id');

        // 发送 AJAX 请求以获取文章数据
        $.ajax({
            url: 'https://oliver0502api.com/wp-json/wp/v2/posts/' + postId,
            method: 'GET',
            success: function (response) {
                title = response.title.rendered;
                const content = response.content.rendered;
                const featuredMediaId = response.featured_media;
                money = response.x_metadata.amount;

                // 发送 AJAX 请求以获取特色图像 URL
                $.ajax({
                    url: 'https://oliver0502api.com/wp-json/wp/v2/media/' + featuredMediaId,
                    method: 'GET',
                    success: function (mediaResponse) {
                        const featuredImageUrl = mediaResponse.source_url;

                        // 显示文章标题、内容和特色图像
                        document.getElementById('post-title').textContent = title;
                        document.getElementById('post-image').setAttribute('src', featuredImageUrl);
                        document.getElementById('post-content').innerHTML = "介紹：" + content;
                        document.getElementById('post-money').innerHTML = "金額：" + money;

                        // 在这里将金額数据存储在按钮上
                        $('#sendMoneyButton').data('money', money);
                        $('#sendCarButton').data('money', money);
                    },
                    error: function (xhr, status, error) {
                        console.log('Failed to get featured image URL: ' + error);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.log('Request failed: ' + error);
            }
        });
    }

    // 获取查询参数的函数
    function getQueryParam(param) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param);
    }

    // 发送金額数据的函数
    function sendMoneyData(title, money) {
        shoppingCart.addItemToCart(title, money, 1);
        displayCart();
    }

    function sendCarData(title, money) {
        // 在这里执行发送金額数据的操作
        shoppingCart.addItemToCart(title, money, 1);
        displayCart();
    }

    function displayCart() {
        var cartArray = shoppingCart.listCart();
        var output = "";
        for (var i in cartArray) {
            output += "<tr>"
                + "<td>" + cartArray[i].name + "</td>"
                + "<td>(" + cartArray[i].price + ")</td>"
                + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
                + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
                + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
                + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
                + " = "
                + "<td>" + cartArray[i].total + "</td>"
                + "</tr>";
        }
        $('.show-cart').html(output);
        $('.total-cart').html(shoppingCart.totalCart());
        $('.total-count').html(shoppingCart.totalCount());
    }

    // Delete item button

    $('.show-cart').on("click", ".delete-item", function (event) {
        var name = $(this).data('name')
        shoppingCart.removeItemFromCartAll(name);
        displayCart();
    })


    // -1
    $('.show-cart').on("click", ".minus-item", function (event) {
        var name = $(this).data('name')
        shoppingCart.removeItemFromCart(name);
        displayCart();
    })
    // +1
    $('.show-cart').on("click", ".plus-item", function (event) {
        var name = $(this).data('name')
        shoppingCart.addItemToCart(name);
        displayCart();
    })

    // Item count input
    $('.show-cart').on("change", ".item-count", function (event) {
        var name = $(this).data('name');
        var count = Number($(this).val());
        shoppingCart.setCountForItem(name, count);
        displayCart();
    });

    //購物車
    var shoppingCart = (function () {
        // =============================
        // Private methods and propeties
        // =============================
        cart = [];

        // Constructor
        function Item(name, price, count) {
            this.name = name;
            this.price = price;
            this.count = count;
        }

        // Save cart
        function saveCart() {
            sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
        }

        // Load cart
        function loadCart() {
            cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
        }
        if (sessionStorage.getItem("shoppingCart") != null) {
            loadCart();
        }


        // =============================
        // Public methods and propeties
        // =============================
        var obj = {};

        // Add to cart
        obj.addItemToCart = function (name, price, count) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart[item].count++;
                    saveCart();
                    return;
                }
            }
            var item = new Item(name, price, count);
            cart.push(item);
            saveCart();
        }
        // Set count from item
        obj.setCountForItem = function (name, count) {
            for (var i in cart) {
                if (cart[i].name === name) {
                    cart[i].count = count;
                    break;
                }
            }
        };
        // Remove item from cart
        obj.removeItemFromCart = function (name) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart[item].count--;
                    if (cart[item].count === 0) {
                        cart.splice(item, 1);
                    }
                    break;
                }
            }
            saveCart();
        }

        // Remove all items from cart
        obj.removeItemFromCartAll = function (name) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart.splice(item, 1);
                    break;
                }
            }
            saveCart();
        }

        // Clear cart
        obj.clearCart = function () {
            cart = [];
            saveCart();
        }

        // Count cart 
        obj.totalCount = function () {
            var totalCount = 0;
            for (var item in cart) {
                totalCount += cart[item].count;
            }
            return totalCount;
        }

        // Total cart
        obj.totalCart = function () {
            var totalCart = 0;
            for (var item in cart) {
                totalCart += cart[item].price * cart[item].count;
            }
            return Number(totalCart.toFixed(2));
        }

        // List cart
        obj.listCart = function () {
            var cartCopy = [];
            for (i in cart) {
                item = cart[i];
                itemCopy = {};
                for (p in item) {
                    itemCopy[p] = item[p];

                }
                itemCopy.total = Number(item.price * item.count).toFixed(2);
                cartCopy.push(itemCopy)
            }
            return cartCopy;
        }

        // cart : Array
        // Item : Object/Class
        // addItemToCart : Function
        // removeItemFromCart : Function
        // removeItemFromCartAll : Function
        // clearCart : Function
        // countCart : Function
        // totalCart : Function
        // listCart : Function
        // saveCart : Function
        // loadCart : Function
        return obj;
    })();

    // 在页面加载时显示文章内容
    displayPostContent();
    displayCart();
});