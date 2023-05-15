const frontend_base_url = "http://127.0.0.1:9240"
const backend_base_url = "http://127.0.0.1:8000"
const API_USERS = "api/users"

async function handleSendMail() {
    const email = document.getElementById("email").value
    const response = await fetch(`${backend_base_url}/${API_USERS}/get-auth-code/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email
        })
    })
    if (response.status == 404) {
        alert(`가입된 이메일 정보가 없습니다.`)
    }
}

async function handleAuthEmail() {
    const email = document.getElementById("email").value
    const auth_code = document.getElementById("auth_code").value
    const response = await fetch(`${backend_base_url}/${API_USERS}/signup/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
            "email": email,
            "auth_code": auth_code
        })
    })
    if (response.status == 200) {
        alert(`인증이 완료되었습니다.`)
        window.location.replace(`${frontend_base_url}/html/signin.html`)
    } else {
        alert(`인증 코드 또는 이메일이 올바르지 않습니다.`)
    }

}