async function Excute() {
    await ClockStart(urlClockAmount);
    let data = await checkForCookies()
    await ZmanFetch(data);
    await addClickEventForLocation();
}
Excute();