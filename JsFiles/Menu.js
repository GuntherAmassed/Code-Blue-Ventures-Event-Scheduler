var logOut = document.getElementById("log-out");
var MyProfile = document.getElementById("My-Profile");
var home = document.getElementById("home");
var user = document.getElementById("user");
var logOutMobile = document.getElementById("log-out-Mobile");
var MyProfileMobile = document.getElementById("My-Profile-Mobile");
var homeMobile = document.getElementById("home-Mobile");
var userMobile = document.getElementById("user-Mobile");
let UserWithId = JSON.parse(localStorage.getItem('User')).User;
let UserId = UserWithId.id;

logOut.addEventListener('click', () => {
    window.location.href = "index"
})
MyProfile.addEventListener('click', async () => {
    console.log(UserId);
    window.location.href='My-Profile.html'
    let response = await fetch('http://localhost:3000/MyProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id: UserId })
    });
    let responseData = await response.json();
    console.log(responseData);
})
home.addEventListener('click', () => {
    window.location.href = "Home-Page.html"

})
user.addEventListener('click', () => {
    window.location.href = "Admin-Profile-Users-Page.html"

})
logOutMobile.addEventListener('click', () => {
    window.location.href = "index.html"
})
MyProfileMobile.addEventListener('click', () => {
    window.location.href = "My-Profile.html"

})
homeMobile.addEventListener('click', () => {
    window.location.href = "Home-Page.html"

})
userMobile.addEventListener('click', () => {
    window.location.href = "Admin-Profile-Users-Page.html"

})