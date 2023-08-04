
checkForCookies();
async function checkForCookies() {
    console.log('hi');
    let Token = getCookie('token');
    if (Token == null) {
        return console.log('no cookie');
    }
    let jsonToken = {
        token: Token
    }
    let response = await fetch('http://localhost:3000/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonToken)
    })
    let data = await response.json();
    if (data.status === 403) {
        return console.log('no data returned');
    }
    else {
        let responseHomePage = await fetch('http://localhost:3000/HomePage', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${data.accessToken}`
            }
        })
        let dataHomePage = await responseHomePage.json();
        if (dataHomePage == null) {
            console.log('no data returned');
        }
        else {
            localStorage.removeItem('User');
            console.log(dataHomePage);
            localStorage.setItem('User', JSON.stringify(dataHomePage.User));
            document.open();
            document.write(dataHomePage.HTMLContent);
            document.close();
        }
    }
}
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}