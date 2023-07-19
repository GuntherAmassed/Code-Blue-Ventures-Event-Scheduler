let data = [];
var Table = document.getElementById('table-body');


async function GetDataFromDataBase() {
    let response = await fetch('http://localhost:3000/UserInfo');
    data = await response.json();
    console.log(data);
    PopulateTable(data);
}
function PopulateTable(data){
    for (let i = 0; i < data[0].serverData.length; i++) {
        let flagPath = '';
        for (let j = 0; j < data[0].filePaths.length; j++) {
            if (data[0].filePaths[j].includes(data[0].serverData[i].Location)) {
                flagPath = data[0].filePaths[j];
            }
        }
        if (flagPath === '') {
            flagPath = 'xx Unknown.svg';
        }
        var row = ` <tr>
        <td>${data[0].serverData[i].First_Name} ${data[0].serverData[i].Last_Name}</td>
        <td>${data[0].serverData[i].Email}</td>
        <td>${data[0].serverData[i].Skype}</td>
        <td>
            <img src="Images/Flags/${flagPath}" alt=""> ${data[0].serverData[i].Location}
        </td>
        <td>${data[0].serverData[i].timeZone}</td>
        <td>${data[0].serverData[i].Role}</td>
        <td>
            <img src="Images/admin-profile-icon-edit.svg" alt="">
            <img src="Images/admin-profile-icon-card.svg" alt="">
        </td>
    </tr>
        `;
        Table.innerHTML += row;
    }
}

GetDataFromDataBase();
