async function checkifAdmin() {
    let admin = await checkForCookies()
    if (admin.user[0].Role !== 'Admin') {
        history.back();
    }
}
checkifAdmin();