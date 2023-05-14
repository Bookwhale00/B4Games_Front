const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"
const API_USERS = "api/users"

window.onload = async () => {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)

    const username = document.getElementById("username")
    const status_message = document.getElementById("status_message")
    const profile_image = document.getElementById("profile_image")
    const user_id = document.getElementById("user_id")

    const response = await fetch(`${backend_base_url}/${API_USERS}/profile_view/${payload_parse.user_id}`)
    const response_json = await response.json()



    //  프로필 이미지 불러오기
    if (response_json.image != null) {
        profile_image.setAttribute("src", `${backend_base_url}${response_json.image}`)
    }

    //  사용자 정보 불러오기
    username.value = response_json.username
    status_message.value = response_json.status_message
    user_id.value = payload_parse.user_id

}


async function updateProfile() {
    const image = document.getElementById("image").files[0]
    const username = document.getElementById("username").value
    const status_message = document.getElementById("status_message").value
    const user_id = document.getElementById("user_id").value
    console.log(image, username, status_message, user_id)

    const formdata = new FormData();

    formdata.append('username', username)
    formdata.append('status_message', status_message)

    if (image) {
        formdata.append('image', image)
    } else {
        formdata.append('image', '')
    }


    try {
        const access_token = localStorage.getItem("access")

        const response = await fetch(`${backend_base_url}/${API_USERS}/profile_view/${user_id}/`, {
            headers: {
                'content-type': 'application/json',
                "Authorization": `Bearer ${access_token}`
            },
            method: 'PUT',
            body: JSON.stringify({
                // "image": image,
                "username": username,
                "status_message": status_message
            })
        })
        const response_json = await response.json()
        if (response.status == 200) {
            alert(`회원 정보를 수정 했습니다.`)
            window.location.replace(`${frontend_base_url}/html/profile.html`)
        } else if (response.status == 400) {
            alert(response_json.message)
            console.log(response_json)
        }
    } catch (err) {
        // server error
        console.error(err)
    }


}