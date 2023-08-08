const MobileUser = document.getElementById('user-Mobile-Frame');
const DesktopUser = document.getElementById('user-Desktop-Admin');

async function admincheck(){
    let admin = await checkForCookies();
    console.log(admin.user);
    if(admin.user.Role==='Admin'){
        MobileUser.style.display='flex';
        DesktopUser.style.display='flex';
    }
}
admincheck();

