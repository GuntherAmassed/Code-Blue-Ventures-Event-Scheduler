var logOut = document.getElementById("log-out");
var MyProfile = document.getElementById("My-Profile");
var home = document.getElementById("home");
var user = document.getElementById("user-Desktop-Admin");
var logOutMobile = document.getElementById("log-out-Mobile");
var MyProfileMobile = document.getElementById("My-Profile-Mobile");
var homeMobile = document.getElementById("home-Mobile");
var userMobile = document.getElementById("user-Mobile");
let AllButtons = {
    Profile: [MyProfile, MyProfileMobile],
    Home: [home, homeMobile],
    User: [user, userMobile]
}
let AllButtonsComplete =
    [
        MyProfile, MyProfileMobile,
        home, homeMobile,
        user, userMobile,logOutMobile,logOut
    ]


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
let active=[]
switch (window.location.pathname.replace('.html', '')) {
    case '/My-Profile': AllButtons.Profile.forEach(e => { e.style.color = '#009AFE'; e.innerHTML += `<img id="CircleThing" src="Images/Circlething.svg" alt="">`}) ;active=AllButtons.Profile;
        break;
    case '/Home-Page': AllButtons.Home.forEach(e => { e.style.color = '#009AFE'; e.innerHTML += `<img id="CircleThing" src="Images/Circlething.svg" alt="">`});active=AllButtons.Home;
        break;
    case '/Admin-Profile-Users-Page': AllButtons.User.forEach(e => { e.style.color = '#009AFE'; e.innerHTML += `<img id="CircleThing" src="Images/Circlething.svg" alt="">` });active=AllButtons.User;
        break;
    default: break;
}

for (let i = 0; i < AllButtonsComplete.length; i++) {
    AllButtonsComplete[i].addEventListener('mouseover', function () {
        if (!active.find(e=> e===this) ) {
            this.style.color = '#009AFE';
            this.innerHTML += `<img id="CircleThing" class="tempCircle" src="Images/Circlething.svg" alt="">`
        }


    })
    AllButtonsComplete[i].addEventListener('mouseout', function () {
        if (!active.find(e=> e===this) ) {
            this.style.color = 'white';
            const CircleThing = document.querySelectorAll('.tempCircle');
            CircleThing.forEach(e=>e.remove());
        }

    })
}
