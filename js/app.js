const url = 'http://oliver.hopto.org/wordpress/'

// 檢查是否有使用者資料
var userID = localStorage.getItem('user_ID');
var userName = localStorage.getItem('user_Name');
if (userID && userName) {
    console.log("成功連線")
    console.log(userName)
    updateUI(userName)
}else{
    updateUI(null);
}

// 登入
const loginButton = document.getElementById('save_login');

loginButton.addEventListener('click', async () => {
    const loginName = document.getElementById('login_name').value;
    const loginPassword = document.getElementById('login_password').value;

    try{
        const response = await fetch(url+'wp-json/wp/v2/rae/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            'username': loginName,
            'password': loginPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('user_ID', data.user.ID);
            localStorage.setItem('user_Name', data.user.data.user_nicename);
            localStorage.setItem('user_Mail', data.user.data.user_email);

            // 登录成功后跳转到新增文章页面
            console.log(data.user)
            alert('登入成功！');
            window.location.href = 'index.html';
            
        })
        .catch(error => {
            console.error('登入請求失敗：', error);
            alert('登入請求失敗。請稍後再試。');
        });
        

        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }else{
        //     alert('註冊成功！');
        //     window.location.href = 'index.html';
        // }  
    }catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = "Error: Registration Failed";
    }
});

// 註冊
const registerButton = document.getElementById('save_register');

registerButton.addEventListener('click', async () => {
    const registerName = document.getElementById('register_username').value;
    const registerEmail = document.getElementById('register_email').value;
    const registerPassword = document.getElementById('register_password').value;

    const formData = new FormData();
    formData.append('username', registerName);
    formData.append('email', registerEmail);
    formData.append('password', registerPassword);

    try {
        const response = await fetch(url+'wp-json/register-apis/finalrope/register-call', {
            method: 'POST',
            body: formData
        });
        console.log(response)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }else{
            alert('註冊成功！');
            window.location.href = 'index.html';
        }

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = "Error: Registration Failed";
    }
});

// 登出
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', async () => {
    localStorage.removeItem('user_ID');
    localStorage.removeItem('user_Name');
    window.location.href = 'index.html';
});

// 新增產品
const uploadButton = document.getElementById('save_text');
uploadButton.addEventListener('click', uploadFile);
async function uploadFile() {
    const file = document.getElementById('file').files[0];
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const category = document.getElementById('add-category').value;
    const money = document.getElementById('money').value;

    const formData = new FormData();
    formData.append('file', file);

    // 新增圖片
    fetch(url+'wp-json/custom-file-upload/v1/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
      
        // 圖片ID存入本地端
        localStorage.setItem('imageID', data.data.id);
        console.log(data)
      
        if (data.success) {
            // 新增標題和文章
            const formData2 = new FormData();
            formData2.append('title', title);
            formData2.append('content', text);
            formData2.append('user_id', userID);
            formData2.append('featured_image', localStorage.getItem('imageID'));
            formData2.append('money', money);
            formData2.append('category', category);

            return fetch(url+'wp-json/wp/v2/rae/post/create', {
                method: 'POST',
                body: formData2
              })
              .then(response => response.json())
              .then(data => {
              
                if (data.status == 200) {
                    alert('新增成功！');
                    window.location.href = 'index.html';
                } else {
                    console.log('文章判定失敗');
                }
              })
              .catch(error => {
                console.log('文章新增失敗');
                console.log(response);
              });
        } else {
            console.log('沒有圖片成功提示');
            console.log(data);
        }
      })
      .catch(error => {
        console.log('圖片新增失敗')
        console.log(data)
      });

    
}

function updateUI(user) {
  if (user) {
    var userEmail = document.createElement('text')
        userEmail.textContent = 'Hi, ' + user;
        document.getElementById('user_name').appendChild(userEmail);
    var createTXT = document.createElement('button');
        createTXT.textContent = '新增產品';
        createTXT.classList.add('btn', 'btn-outline-light', 'me-2', 'd-md-block');
        createTXT.setAttribute('data-bs-toggle', 'modal');
        createTXT.setAttribute('data-bs-target', '#txt_set');
        document.getElementById('create_txt').appendChild(createTXT);
    var outButton = document.createElement('button');
        outButton.textContent = '登出';
        outButton.classList.add('btn', 'btn-outline-light', 'me-2', 'd-md-block');
        document.getElementById('logout').appendChild(outButton);
  }else{
    var loginButton = document.createElement('button');
        loginButton.textContent = '登入';
        loginButton.classList.add('btn', 'btn-outline-light', 'me-2', 'd-md-block');
        loginButton.setAttribute('data-bs-toggle', 'modal');
        loginButton.setAttribute('data-bs-target', '#login_set');

        // 添加点击事件监听器
        loginButton.addEventListener('click', function () {
            // 在这里添加按钮点击后的操作
        });

        // 将按钮添加到页面中的某个元素，这里假设添加到body中
        document.getElementById('login').appendChild(loginButton);

    var registerButton = document.createElement('button');
        registerButton.textContent = '註冊';
        registerButton.classList.add('btn', 'btn-outline-light', 'me-2', 'd-md-block');
        registerButton.setAttribute('data-bs-toggle', 'modal');
        registerButton.setAttribute('data-bs-target', '#register_set');

        // 添加点击事件监听器
        registerButton.addEventListener('click', function () {
            // 在这里添加按钮点击后的操作
        });

        // 将按钮添加到页面中的某个元素，这里假设添加到body中
        document.getElementById('register').appendChild(registerButton);
  }}
