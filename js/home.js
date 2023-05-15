const frontend_base_url = "http://127.0.0.1:9240"
const backend_base_url = "http://127.0.0.1:8000"
const API_USERS = "api/users"


//  로그아웃
function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.reload();
}

// 메인페이지에서 게시글 클릭하면 상세페이지로 이동하는 함수
function articleDetail(article_id) {
    window.location.href = `${frontend_base_url}/html/post_detail.html?article_id=${article_id}`
}

// 메인페이지에 게시글 가져오기
window.onload = async function loadArticles() {
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

    const articles = await getArticles()

    const article_list = document.getElementById("article-list")

    articles.forEach(article => {
        const newCol = document.createElement("div");
        newCol.setAttribute("class", "col")
        newCol.setAttribute("onclick", `articleDetail(${article.pk})`)

        const newCard = document.createElement("div")
        newCard.setAttribute("class", "card")
        newCard.setAttribute("id", article.pk)

        newCol.appendChild(newCard)

        const articleImage = document.createElement("img")
        articleImage.setAttribute("class", "card-img-top")
        articleImage.setAttribute("width", "350")
        articleImage.setAttribute("height", "400")

        if (article.image) {
            articleImage.setAttribute("src", `${backend_base_url}${article.image}`)
        } else {
            articleImage.setAttribute("src", "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbB5kLi%2Fbtse96eg3uA%2FvJleU9SMKYxEXTqEDzioBK%2Fimg.jpg")
        }

        newCard.appendChild(articleImage)

        const newCardBody = document.createElement("div")
        newCardBody.setAttribute("class", "card-body")
        newCard.appendChild(newCardBody)

        const newCardTitle = document.createElement("h5")
        newCardTitle.setAttribute("class", "card-title")
        if (article.title.length > 10) {
            newCardTitle.innerText = article.title.substring(0, 10) + "..."
        } else {
            newCardTitle.innerText = article.title
        }

        newCardBody.appendChild(newCardTitle)

        const newCardText = document.createElement("p")
        newCardText.setAttribute("class", "card-text")
        if (article.content.length > 10) {
            newCardText.innerText = article.content.substring(0, 10) + "..."
        } else {
            newCardText.innerText = article.content
        }
        newCardBody.appendChild(newCardText)
        article_list.appendChild(newCol)
    })
}

async function getArticles() {
    const response = await fetch(`${backend_base_url}/api/posts/`, {
        // headers: {
        //     "Authorization" : "Bearer " + localStorage.getItem("access")
        // },
        // 로그인 없어도 되면 headers 없어도 됨
        method: 'GET' // 디폴트 get이라서 없어도 ok
    })

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("게시글 가져오기 실패")
    }
}
