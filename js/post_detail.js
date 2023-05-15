const frontend_base_url = "http://127.0.0.1:5003"
const backend_base_url = "http://127.0.0.1:8000"
const API_USERS = "api/users"


// 상단바 로그아웃
function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.replace(`${frontend_base_url}/html/home.html`);
}

// 댓글 작성할 때 DB로 댓글 내용과 게시글 id를 같이 보내주기 위한 정의
let articleId

function userProfile(user_id) {
    window.location.href = `${frontend_base_url}/html/profile.html?user_id=${user_id}`
}

// 댓글 가져오기
async function loadComments(articleId) {
    const response = await getComments(articleId);

    const commentsList = document.getElementById("comment-list")
    commentsList.innerHTML = ""

    response.forEach(comment => {
        commentsList.innerHTML += `
        <li class="media d-flex mb-3">
            <img class="mr-3" src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FrDdA1%2FbtsffuyYjwr%2FwmKwmMYWGRU7Ng5EcT7Zkk%2Fimg.png" alt="프로필 이미지" width="50" height="50">
            <div class="media-body">
            <h5 class="mt-0 mb-1">${comment.owner}</h5>
            ${comment.content}
            </div>
        </li>
        `
    })
}

// 댓글 작성하기
async function submitComment() {
    const commentElement = document.getElementById("new-comment")
    const newComment = commentElement.value
    const response = await postComment(articleId, newComment)
    commentElement.value = ""

    // location.reload()
    // 새로고침 없이 하려면
    loadComments(articleId)
}

// 게시글 상세보기 
async function loadArticles(articleId) {
    const response = await getArticle(articleId);

    const articleTitle = document.getElementById("article-title")
    const articleImage = document.getElementById("article-image")
    const articleContent = document.getElementById("article-content")
    const articleOwner = document.getElementById("article-owner")


    articleTitle.innerText = response.title
    articleContent.innerText = response.content
    articleOwner.innerText = "작성한 사람: " + response.owner
    articleOwner.setAttribute("onclick", `userProfile(${response.pk})`)


    const newImage = document.createElement("img")
    if (response.image) {
        newImage.setAttribute("src", `${backend_base_url}${response.image}`)
    } else {
        newImage.setAttribute("src", "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbB5kLi%2Fbtse96eg3uA%2FvJleU9SMKYxEXTqEDzioBK%2Fimg.jpg")
    }

    newImage.setAttribute("class", "img-fluid")

    articleImage.appendChild(newImage)

    // 게시글 작성자와 현재 로그인한 사람이 일치하면 수정삭제 보여주고 아니면 안보이도록
    const authorId = response.owner
    const payload = localStorage.getItem("payload");
    const currentUser = payload ? JSON.parse(payload).username : undefined;

    // currentUser !=undefined 그리고 authorId = currentUser 
    if (currentUser && authorId === currentUser) {
        document.getElementById("update_button").style.display = "block";
        document.getElementById("delete_button").style.display = "block";
    } else {
        document.getElementById("update_button").style.display = "none";
        document.getElementById("delete_button").style.display = "none";
    }
}

// 게시글 수정페이지로 이동
function updateMode() {
    window.location.href = `post_update.html?article_id=${articleId}`
}

// 게시글 삭제하기
async function removeArticle() {
    await deleteArticle(articleId)
    alert("삭제되었습니다.")
    window.location.replace(`${frontend_base_url}/html/home.html`);
}

// 게시글 삭제 api
async function deleteArticle() {

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


// 페이지 로딩되면 게시글이랑 댓글 가져오기
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
    loadArticles(articleId);
    loadComments(articleId);
}

// 게시글 상세보기 api
async function getArticle(articleId) {
    const response = await fetch(`${backend_base_url}/api/posts/${articleId}`,
    )

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}

// 댓글 보기 api
async function getComments(articleId) {
    const response = await fetch(`${backend_base_url}/api/comments/${articleId}/comment`,
    )

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}

// 댓글 작성 api (json)
async function postComment(articleId, newComment) {

    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/api/comments/${articleId}/comment`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            "content": newComment,
        })
    }
    )
    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


// 더보기란 수정,삭제 
function toggleOptions() {
    var optionsDiv = document.getElementById("options");
    if (optionsDiv.style.display === "none") {
        optionsDiv.style.display = "block";
    } else {
        optionsDiv.style.display = "none";
    }
}







