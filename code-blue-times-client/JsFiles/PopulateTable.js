async function GetDataFromApi(SortBy) {
    let data;
    let Table = document.getElementById('table-body');
    let response = await fetch(`https://codebluetimes.com/app/UserInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(SortBy)
    });
    data = await response.text();
    Table.innerHTML = data;
}
