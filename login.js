const login_button = document.querySelector("button")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const erreur = document.querySelector(".disable")
login_button.addEventListener('click',(e)=>{
    e.preventDefault()
    login_button.innerText = "..."
    setTimeout(() => {
        login_button.innerText= "Login"
            if(email.value == "ranto@gmail.com" && password.value == "ranto1234"){
                location.href = "./index.html"
            }
            else{
                erreur.classList.remove("disable")
            }        
            setTimeout(() => {
                erreur.classList.add('disable')
            }, 2000);
        },1000);
    });
