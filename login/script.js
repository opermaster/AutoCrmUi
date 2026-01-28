document.getElementById("login-form")
    .addEventListener("submit",login);
const localhost = "https://localhost:7026/api/";
const popup = document.getElementById("pop-up");
const popupText = document.getElementById("pop-up-text");

function showPopup(text, type = "neg", timeout = 3000) {
    popupText.textContent = text;

    popup.classList.remove("pos", "neg", "active");
    popup.classList.add(type);
    requestAnimationFrame(() => {
        popup.classList.add("active");
    });
    setTimeout(() => {
        popup.classList.remove("active");
    }, timeout);
}
async function login(e){
    e.preventDefault();
    const formData = new FormData(e.target);

    let _login = formData.get("login");
    let _password = formData.get("password");
    let role ="";

    const url = localhost+"auth/login";
    try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "Login":_login,
                "Password":_password,
            })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            localStorage.setItem("jwt", result.token);
            role = result.role;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
    if(role == "Admin") {
        window.location.href = "../admin/index.html";
    }
    else if (role=="Master") {
        window.location.href = "../master/index.html";
    }
    else if (role=="Manager") {
        window.location.href = "../manager/index.html";
    }
}