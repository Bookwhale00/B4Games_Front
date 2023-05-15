const frontend_base_url = "http://127.0.0.1:5003"
const backend_base_url = "http://127.0.0.1:8000"
const API_USERS = "api/users"

window.onload = async () => {
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
    user_id = urlParams.get('user_id');
    user_id = user_id == null ? payload_parse.user_id : user_id

    const follower = document.getElementById("follower")
    const following = document.getElementById("following")
    const username = document.getElementById("username")
    const status_message = document.getElementById("status_message")
    const profile_image = document.getElementById("profile_image")
    const update_profile = document.getElementById("update_profile")
    const profile_user_id = document.getElementById("user_id")
    profile_user_id.value = user_id

    const response = await fetch(`${backend_base_url}/${API_USERS}/profile_view/${user_id}`)
    const response_json = await response.json()

    if (response_json.email != payload_parse.email) {
        update_profile.style.display = "none"
    }

    //  프로필 이미지 불러오기
    if (response_json.image != null) {
        profile_image.setAttribute("src", `${backend_base_url}${response_json.image}`)
    }

    //  사용자 정보 불러오기
    follower.innerText = response_json.followers.length
    following.innerText = response_json.followings.length
    post.innerText = response_json.post_count
    username.innerText = response_json.username
    status_message.innerText = response_json.status_message




    const owner_follow = document.getElementById("owner_follow")
    //  팔로우 정보 불러오기
    if (payload_parse == null || response_json.email == payload_parse.email) {
        const owner_follow = document.getElementById("owner_follow")
        owner_follow.style.display = "none"
    } else {
        // 로그인한 유저가 조회한 프로필의 owner를 팔로우 중이라면
        owner_follow.innerText = (response_json.followers.includes(payload_parse.email)) ? 'Unfollow' : "Follow"
    }

    // 로드되면 내 게시글 가져오기
    const myPosturlParams = new URLSearchParams(window.location.search);
    articleId = myPosturlParams.get('article_id');
    loadArticles(articleId)

}



async function followAPI() {
    const owner_follow = document.getElementById("owner_follow")
    user_id = document.getElementById("user_id")

    try {
        let access_token = localStorage.getItem("access")
        const response = await fetch(`${backend_base_url}/${API_USERS}/profile_view/${user_id.value}/`, {
            headers: {
                'content-type': 'application/json',
                "Authorization": `Bearer ${access_token}`
            },
            method: 'POST'
        })
        const response_json = await response.json()
        if (response.status == 200) {
            owner_follow.innerText = response_json == "unfollow" ? 'Unfollow' : "Follow"
            location.reload();
        } else if (response.status == 400) {
            alert(`나 자신을 팔로우 할 수 없습니다.`)
        } else if (response.status == 401) {
            alert(`로그인이 필요합니다.`)
            window.location.replace(`${frontend_base_url}/html/login.html`)
        }
    } catch (err) {
        // server error
        console.error(err)
    }
}

async function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.reload();
}

// 이하 MyPost관련

// 게시글 수정페이지로 이동
function updateMode(articleId) {
    window.location.href = `post_update.html?article_id=${articleId}`
}

// 게시글 삭제하기
async function removeArticle(articleId) {
    await deleteArticle(articleId)
    alert("삭제되었습니다.")
    window.location.replace(`${frontend_base_url}/html/profile.html`);
}

// 게시글 삭제 api
async function deleteArticle(articleId) {

    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/api/posts/${articleId}`,
        {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
    if (response.status == 204) {
    } else {
        alert(response.status)
    }
}

// 프로필페이지에서 게시글 클릭하면 상세페이지로 이동하는 함수
function articleDetail(article_id) {
    window.location.href = `${frontend_base_url}/html/post_detail.html?article_id=${article_id}`
}

// 프로필페이지에 게시글 가져오는 함수
async function loadArticles(articleId) {

    const response = await getArticles(articleId);

    const articleList = document.getElementById("article-list")
    articleList.innerHTML = ""

    response.forEach((article, index) => {

        const image_url = article.image ? `${backend_base_url}${article.image}` : "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbB5kLi%2Fbtse96eg3uA%2FvJleU9SMKYxEXTqEDzioBK%2Fimg.jpg";

        articleList.innerHTML += `
        <tr>
            <td style="color: white;">${index + 1}</td>
            <td><a href="#" onclick="articleDetail(${article.pk})"><img src="${image_url}" alt="게시글이미지" width="50" height="50">${article.title}</a></td>
            <td style="color: white;">${article.created_at.slice(0, 10)}</td>
            <td><button type="button" class="btn btn-primary" onclick="updateMode(${article.pk})">수정</button></td>
            <td><button type="button" class="btn btn-danger" onclick="removeArticle(${article.pk})">삭제</button></td>
        </tr>
        `
    })

}

// 프로필 페이지에 게시글리스트 가져오는 api
async function getArticles() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    const userId = payload_parse.user_id


    const response = await fetch(`${backend_base_url}/api/posts/${userId}/mypost/`, {
        // headers: {
        //     "Authorization" : "Bearer " + localStorage.getItem("access")
        // },
        // 로그인 없어도 되면 headers 없어도 됨
        // 프로필은 필요한가? 없어도 가져오기는 함..
        method: 'GET' // 디폴트 get이라서 없어도 ok
    })


    if (response.status == 200) {
        const response_json = await response.json()

        return response_json
    } else {
        alert("게시글 가져오기 실패")
    }
}

