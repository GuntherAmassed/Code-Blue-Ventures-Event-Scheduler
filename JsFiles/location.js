
const getLocation =()=>{
    navigator.geolocation.getCurrentPosition(success,err)
}
function success(position){
    console.log(position);
}
function err(){
    console.log("hey error");
}
getLocation();