var MobileFrame = document.getElementById("Menu-Mobile-Frame");
var MobileFrameExtended = document.getElementById("Menu-Mobile-Frame-Extended");
var OptionFrame = document.getElementById("Option-Frame");
var ExIcon = document.getElementById("ExIcon");
if (window.screen.width >= 1000) {
    MobileFrame.style.display = "none";
    MobileFrameExtended.style.display = "none";
}
if (window.screen.width < 999) {
    MobileFrame.style.display = "flex";
    MobileFrameExtended.style.display = "none";
}
OptionFrame.addEventListener('click', () => {
    MobileFrame.style.display = "none";
    MobileFrameExtended.style.display = "flex";

})
ExIcon.addEventListener('click', () => {
    MobileFrameExtended.style.display = "none";
    MobileFrame.style.display = "flex";


})
window.addEventListener('resize', () => {
    if (window.screen.width >= 1000) {
        MobileFrame.style.display = "none";
        MobileFrameExtended.style.display = "none";
    }
    if (window.screen.width < 999) {
        MobileFrame.style.display = "flex";
        MobileFrameExtended.style.display = "none";
    }
})


