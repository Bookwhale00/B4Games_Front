const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"
const API_USERS = "api/users"

// 페이지 로딩되면 기존 게시글 내용 가져오기

window.onload = async function () {
    // 상단바 (from homa.js)
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    console.log(payload_parse)
    if (payload_parse != null) {
        dropdown_item_1 = document.getElementById("dropdown_item_1")
        dropdown_item_2 = document.getElementById("dropdown_item_2")
        dropdown_item_7 = document.getElementById("dropdown_item_7")
        dropdown_item_1.style.display = "none"
        dropdown_item_2.style.display = "none"
        dropdown_item_7.style.display = "none"

        const nav_response = await fetch(`${backend_base_url}/${API_USERS}/profile_view/${payload_parse.user_id}`)
        const nav_response_json = await nav_response.json()

        dropdown_menu = document.getElementById("dropdown_toggle")
        dropdown_menu.innerText = nav_response_json.username
        console.log(nav_response_json.is_seller)

        nav_profile_image = document.getElementById("nav_profile_image")
        if (nav_response_json.image != null) {
            nav_profile_image.setAttribute("src", `${backend_base_url}${nav_response_json.image}`)
        }

    } else {
        dropdown_item_3 = document.getElementById("dropdown_item_3")
        dropdown_item_4 = document.getElementById("dropdown_item_4")
        dropdown_item_5 = document.getElementById("dropdown_item_5")
        dropdown_item_8 = document.getElementById("dropdown_item_8")
        dropdown_item_3.style.display = "none"
        dropdown_item_4.style.display = "none"
        dropdown_item_5.style.display = "none"
        dropdown_item_8.style.display = "none"
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
    document.getElementById("image").value = response_json.image;

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

    const formdata = new FormData();

    formdata.append('title', title)
    formdata.append('content', content)

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