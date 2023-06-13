const logoutLink = document.querySelector('#logout')
const loginLink = document.querySelector('#log-in')

console.log(logoutLink)
console.log(loginLink)
export const loginCheck = user =>{
    if(user){
        logoutLink.style.display = 'block'
        loginLink.style.display = 'none'
        console.log('con usuario')
    }else{
        logoutLink.style.display = 'none'
        loginLink.style.display = 'block'
        console.log('sin usuario')
    }
}

