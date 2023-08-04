async function Excute() {
    await ClockStart(urlClockAmount);
    let LocationOfUser = JSON.parse(localStorage.getItem('User')).User;
    let LocationActive = LocationOfUser.Location_Id;
    await ZmanFetch(LocationActive);
    await addClickEventForLocation();
}
Excute();