const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"
const API_USERS = "api/users"
async function handelLogin() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    // console.log(nickname, password)

    // const response = await fetch("http://127.0.0.1:8000/api/users/token/", {
    try {
        const response = await fetch(`${backend_base_url}/${API_USERS}/token/`, {
            // fetch post 통신이 완료될때까지 기다리고, api에서는 세션의 토큰을 반환한다.
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                "email": email,
                "password": password,
            })
        })
        if (response.status == 200) {
            const response_json = await response.json()

            // 토큰 저장
            localStorage.setItem("access", response_json.access)
            localStorage.setItem("refresh", response_json.refresh)

            // payload 저장
            const base64Url = response_json.access.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            localStorage.setItem("payload", jsonPayload)
            window.location.replace(`${frontend_base_url}/html/home.html`)
        } else {
            alert("회원정보가 일치하지 않습니다.")
        }
    } catch (err) {
        console.error(err)
    }

}