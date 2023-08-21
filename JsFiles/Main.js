async function Excute() {
    await ClockStart();
    let data = await checkForCookies()
    console.log(data);
    await ZmanFetch(data);
    await addClickEventForLocation();
    //visibility not hidden for document
}
Excute();
