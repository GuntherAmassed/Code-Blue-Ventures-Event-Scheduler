var logOut = document.getElementById("log-out");
var MyProfile = document.getElementById("My-Profile");
var home = document.getElementById("home");
var user = document.getElementById("user-Desktop-Admin");
var logOutMobile = document.getElementById("log-out-Mobile");
var MyProfileMobile = document.getElementById("My-Profile-Mobile");
var homeMobile = document.getElementById("home-Mobile");
var userMobile = document.getElementById("user-Mobile");

logOut.addEventListener('click', async () => {
    await LogOutToken()
})
MyProfile.addEventListener('click', () => {
    window.location.href = "My-Profile.html"
})
home.addEventListener('click', () => {
    window.location.href = "Home-Page.html"

})
user.addEventListener('click', () => {
    window.location.href = "Admin-Profile-Users-Page.html"

})
userMobile.addEventListener('click', () => {
    window.location.href = "Admin-Profile-Users-Page.html"

})

logOutMobile.addEventListener('click', async () => {
    await LogOutToken()
})
MyProfileMobile.addEventListener('click', () => {
    window.location.href = "My-Profile.html"

})
homeMobile.addEventListener('click', () => {
    window.location.href = "Home-Page.html"

})
