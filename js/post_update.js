const frontend_base_url = "http://127.0.0.1:5003"
const backend_base_url = "http://127.0.0.1:8000"
const API_USERS = "api/users"


window.onload = async function () {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    const dropdown_options_1 = document.querySelectorAll(".dropdown_option_1");
    if (payload_parse != null) {
        dropdown_options_1.forEach((option) => {
            option.style.display = "none";
        });

        const nav_response = await fetch(`${backend_base_url}/${API_USERS}/profile_view/${payload_parse.user_id}`)
        const nav_response_json = await nav_response.json()

        dropdown_menu = document.getElementById("dropdown_toggle")
        dropdown_menu.innerText = nav_response_json.username


        nav_profile_image = document.getElementById("nav_profile_image")

        if (nav_response_json.image != null) {
            nav_profile_image.setAttribute("src", `${backend_base_url}${nav_response_json.image}`)
        }

    } else {
        const dropdown_options_2 = document.querySelectorAll(".dropdown_option_2");
        dropdown_options_2.forEach((option) => {
            option.style.display = "none";
        });
        nav_profile_image = document.getElementById("nav_profile_image")
        nav_profile_image.style.display = "none"
    }

    // 판매회원 아니면 글작성 아예 안보이게

    const isSeller = JSON.parse(payload ?? '{}').is_seller;

    if (isSeller === false) {
        dropdown_item_5 = document.getElementById("dropdown_item_5")
        dropdown_item_5.style.display = "none"
    }

    const urlParams = new URLSearchParams(window.location.search);
    articleId = urlParams.get('article_id');

    beforeArticle(articleId);
}

async function beforeArticle(articleId) {
    let response_json = null;
    const response = await fetch(`${backend_base_url}/api/posts/${articleId}/`,
    )

    if (response.status == 200) {
        response_json = await response.json()

    } else {
        alert(response.status)
    }

    document.getElementById("title").value = response_json.title;
    document.getElementById("content").value = response_json.content;
    document.getElementById("image").files[0] = response_json.image;
    document.getElementById("price").value = response_json.price;

    return response_json;
}

function backhHistory() {
    window.history.back();
}

function showFileName() {
    const input = document.getElementById("image");
    const fileName = document.getElementById("file-name");
    fileName.textContent = input.files[0].name;
}

async function updateArticle() {
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value
    const image = document.getElementById("image").files[0]
    const price = document.getElementById("price").value

    const formdata = new FormData();

    formdata.append('title', title)
    formdata.append('content', content)
    formdata.append('price', price)

    if (image) {
        formdata.append('image', image)
    } else {
        formdata.append('image', '')
    }

    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/api/posts/${articleId}/`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formdata
    }
    )
    if (response.status == 200) {
        alert("수정되었습니다")
        window.history.back();
    } else {
        alert(response.status)
    }
}


function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.reload();
}