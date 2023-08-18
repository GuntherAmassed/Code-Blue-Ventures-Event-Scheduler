let data;
let Table = document.getElementById('table-body');
GetDataFromApi();
async function GetDataFromApi() {
    let response = await fetch(`https://codebluetimes.com/app/UserInfo`);
    data = await response.text();
    Table.innerHTML = data;
    const EditUser = document.getElementsByClassName('Edit-User');
    const DeleteUser = document.getElementsByClassName('Delete-User')
    const IdOfUser = document.getElementsByClassName('Id-Of-User');
    for (let i = 0; i < EditUser.length; i++) {
        EditUser[i].addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            AddEditUserPage.classList.remove('hidden');
            editOrAdd[0].textContent = 'Edit User';
            editOrAdd[1].textContent = 'Save Changes';


            edit = true;
            populateLocation(IdOfUser[i].textContent)
            editOrAdd[1].removeEventListener("click", async (e) => {
                e.preventDefault()
                await AddUserToDatabase()
            });
            editOrAdd[1].addEventListener('click', async (e) => {
                e.preventDefault()

                await SaveChanges();
            });
        })
        DeleteUser[i].addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            deleteUserFromDatabase(IdOfUser[i].textContent)
        })
    }

}
