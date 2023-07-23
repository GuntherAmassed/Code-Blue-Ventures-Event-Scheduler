let data;
let Table = document.getElementById('table-body');
GetDataFromApi();
async function GetDataFromApi() {
    let response = await fetch(`http://localhost:3000/UserInfo`);
    data = await response.text();
    console.log(data);
    Table.innerHTML=data;
}

