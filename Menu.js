var logOut = document.getElementById("log-out");
var MyProfile = document.getElementById("My-Profile");
var home = document.getElementById("home");
var user = document.getElementById("user");
logOut.addEventListener('click', () => {
    window.location.href = "index.html"
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