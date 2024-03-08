var MobileFrame = document.getElementById("Menu-Mobile-Frame");
var MobileFrameExtended = document.getElementById("Menu-Mobile-Frame-Extended");
var OptionFrame = document.getElementById("Option-Frame");
var ExIcon = document.getElementById("ExIcon");
const Mains = document.querySelectorAll('.Mains');
const GridItems = document.querySelectorAll('.GridItem');
OptionFrame.addEventListener('click', () => {
    MobileFrame.style.display = "none";
    MobileFrameExtended.style.display = "flex";
    doMobileforPage(window.location.pathname.replace('.html', ''))
})
ExIcon.addEventListener('click', () => {
    MobileFrameExtended.style.display = "none";
    MobileFrame.style.display = "flex";
    doMobileCancelforPage(window.location.pathname.replace('.html', ''))
})

function doMobileforPage(pathname) {
    switch (pathname.replace('.html', '')) {
        case '/My-Profile': Mains.forEach(e => e.style.display = 'none');
        GridItems.forEach(e => e.style.gridTemplateRows = '100vh');
            break;
        case '/Home-Page': Mains.forEach(e => e.style.display = 'none');
            GridItems.forEach(e => e.style.gridTemplateRows = '100vh');
            break;
        case '/Admin-Profile-Users-Page': Mains.forEach(e => e.style.display = 'none');
        GridItems.forEach(e => e.style.gridTemplateRows = '100vh');
            break;
        default: break;
    }

}
function doMobileCancelforPage(pathname) {
    switch (pathname.replace('.html', '')) {
        case '/My-Profile': GridItems.forEach(e => e.style.gridTemplateRows = 'minmax(100px, max-content) max-content 1fr'); Mains.forEach(e => e.style.display = 'flex');
            break;
        case '/Home-Page': GridItems.forEach(e => e.style.gridTemplateRows = '.5fr 9fr'); Mains.forEach(e => e.style.display = 'inline-flex');
            break;
        case '/Admin-Profile-Users-Page': GridItems.forEach(e => e.style.gridTemplateRows = '100px max-content 4fr'); Mains.forEach(e => e.style.display = 'block');
            break;
        default: break;
    }

}

