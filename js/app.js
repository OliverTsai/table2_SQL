const apiUrl = 'https://oliver0502api.com/';

async function init() {
    try {
        const token = localStorage.getItem('token');
        // console.log(token)
        fetchUserInfo(token);
        if (token) {
            displayUserInfo();
            setupUserButtons();
        } else {
            setupLoginRegisterButtons();
        }
    } catch (error) {
        handleInit();
    }
}

// 檢查憑證
function fetchUserInfo(token) {
    fetch(`${apiUrl}wp-json/jwt-auth/v1/token/validate`, {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => response.json())
    .then(tokenInfo => {
        console.log(tokenInfo);
        // 在這裡處理 Token 狀態的資訊
        if(!tokenInfo.data){
            alert('時間太久 重新登入');
            handleInit()
        }
    })
    .catch(error => console.error('Error:', error));
}

// 顯示個人資料
function displayUserInfo() {
    const userName = localStorage.getItem('user_Name');
    const userEmail = document.createElement('text');
    userEmail.textContent = 'Hi, ' + userName;
    document.getElementById('user_name').appendChild(userEmail);
}

function setupUserButtons() {
    // 有登入的介面
    const userRoles = localStorage.getItem('user_Roles')
    console.log(userRoles)
    // 設定非遊客才顯示按鈕
    if(userRoles != 'subscriber'){
        var createTXT = document.createElement('button');
        createTXT.textContent = '賣方中心';
        createTXT.classList.add('btn', 'btn-outline-light', 'me-2', 'd-md-block');
        createTXT.setAttribute('data-bs-toggle', 'modal');
        // 添加点击事件监听器
        createTXT.addEventListener('click', function () {
            // 在这里添加按钮点击后的操作
            window.location.href = 'seller.html';
        });
        document.getElementById('create_txt').appendChild(createTXT);
    }

    var outButton = document.createElement('button');
    outButton.textContent = '登出';
    outButton.classList.add('btn', 'btn-outline-light', 'me-2', 'd-md-block');
    document.getElementById('logout').appendChild(outButton);
}

function setupLoginRegisterButtons() {
    // 沒登入的介面
    var loginButton = document.createElement('button');
    loginButton.textContent = '登入';
    loginButton.classList.add('btn', 'btn-outline-light', 'me-2', 'd-md-block');
    loginButton.setAttribute('data-bs-toggle', 'modal');
    loginButton.setAttribute('data-bs-target', '#login_set');
    document.getElementById('login').appendChild(loginButton);

    var registerButton = document.createElement('button');
    registerButton.textContent = '註冊';
    registerButton.classList.add('btn', 'btn-outline-light', 'me-2', 'd-md-block');
    registerButton.setAttribute('data-bs-toggle', 'modal');
    registerButton.setAttribute('data-bs-target', '#register_set');
    document.getElementById('register').appendChild(registerButton);
}

function handleInit() {
    // 清除 token 和相關資訊
    localStorage.removeItem('token');
    localStorage.removeItem('user_ID');
    localStorage.removeItem('user_Name');
    localStorage.removeItem('user_Mail');
    localStorage.removeItem('user_Roles');

    // 重新導向到登入頁面
    window.location.href = 'index.html';
}

// 登入
const loginButton = document.getElementById('save_login');

loginButton.addEventListener('click', async () => {
    const loginName = document.getElementById('login_name').value;
    const loginPassword = document.getElementById('login_password').value;

    fetch(`${apiUrl}wp-json/jwt-auth/v1/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginName,
                    password: loginPassword,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if(data.token){
                    // console.log(data)
                    token = data.token;
                    localStorage.setItem('token', token);
                    fetch(`${apiUrl}wp-json/wp/v2/rae/user/login`,{
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
                        localStorage.setItem('user_Roles', data.user.roles);
                        alert('登入成功!');
                        window.location.reload();
                    })
                    .catch(error => {
                        console.error('抓取資料失敗：', error);
                        alert('抓取資料失敗。請稍後再試。');
                    });
                }else{
                    alert('帳密錯誤!');
                    window.location.reload();
                }
                
            })
            .catch(error => {
                console.error('Login error:', error)
                alert('沒有憑證!');
                window.location.reload();
            });
});

// 註冊
const registerButton = document.getElementById('save_register');

registerButton.addEventListener('click', async () => {
    const registerName = document.getElementById('register_username').value;
    const registerEmail = document.getElementById('register_email').value;
    const registerPassword = document.getElementById('register_password').value;
    const userRole = document.getElementById('user_role').value;

    const formData = new FormData();
    formData.append('username', registerName);
    formData.append('email', registerEmail);
    formData.append('password', registerPassword);
    formData.append('role', userRole);

    try {
        const response = await fetch(apiUrl+'wp-json/register-apis/finalrope/register-call', {
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
    handleInit()
});

init();
