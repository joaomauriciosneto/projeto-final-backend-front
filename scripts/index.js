const api = axios.create({
    baseURL: 'http://localhost:3333'
})

const formCreateUser = document.getElementById('form_register');
const btnCreateUser = document.getElementById('btn-create-user');
const inputPassword = document.getElementById('input_password_register');
const inputConfPassword = document.getElementById('input_conf_password_register');
const inputLoginPassword = document.getElementById('password')

const btnLogin = document.getElementById('btn-login');
const formLogin = document.getElementById('form_login');

/**
 * mostra/oculta o password
 */
function showHidePassword() {
    const inputPassword = document.getElementById('input_password_register')

    if(inputPassword.type == 'password') {
        inputPassword.type = 'text'
    }else {
        inputPassword.type = 'password'
    }
}

/**
 * mostra/oculta o password
 */
function showHideConfPassword() {
    const inputConfPassword = document.getElementById('input_conf_password_register')

    if(inputConfPassword.type == 'password') {
        inputConfPassword.type = 'text'
    }else {
        inputConfPassword.type = 'password'
    }
}

/**
 * mostra/oculta o password
 */
function showHidePasswordLogin() {
    const inputLoginPassword = document.getElementById('password')

    if(inputLoginPassword.type == 'password') {
        inputLoginPassword.type = 'text'
    }else {
        inputLoginPassword.type = 'password'
    }
}

/**
 * cria um novo usuário
 */
async function createUser(e) {

    e.preventDefault();    

    try {

        if(!formCreateUser) {
            console.log('Dont have a form!');
            return
        }
    
        if(inputPassword.value !== inputConfPassword.value) {
            alert('The passwords are different!');
            return;
        }
    
        const user = {
            email: formCreateUser.input_email_register.value,
            password: formCreateUser.input_password_register.value
        }

        const result = await api.post('/notes/users', user)      

        alert('User registered successfully!')
        
        location.href = 'login.html'
        
    } catch (error) {
        alert(error.response.data.message)
        console.log(error)
    }

}

/**
 * faz o login do usuário
 */
async function login() {

    try {       

        const user = {
            email: formLogin.login_name.value,
            password: formLogin.password_name.value
        }

        if(user.email == '') {
            alert('Fill in the EMAIL field!');
            return;
        }

        if(user.password == '') {
            alert('Fill in the PASSWORD field!')
        }

        const result = await api.post('/notes/login', user)
        console.log(result)

        localStorage.setItem('user-notes', JSON.stringify(result.data.data))

        location.href = 'home.html'
        
    } catch (error) {
        alert(error.response.data.message)
        console.log(error)
    }

}

window.addEventListener('load', () => {

    console.log('Carregando...')

    const user = JSON.parse(localStorage.getItem('user-notes') ?? "{}");

    if(user.id) {
        location.href = "home.html"
    }

    if(formCreateUser) {
        formCreateUser.addEventListener('submit', createUser)
    }

    if(btnCreateUser) {
        btnCreateUser.addEventListener('click', createUser)
    }

    if(btnLogin) {
        btnLogin.addEventListener('click', login)
    }

})