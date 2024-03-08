function SearchOptionfn() {
    let input = document.getElementById('Search-Input-Input');
    let table = document.querySelector('#table-body');
    let rows = table.querySelectorAll('tr:not(.header-row)');
    $('#Search-Input-Ex').click(() => {
        input.value = ''
        Sort();
    })
    input.addEventListener("input",()=>{
      Sort()
    } );

    function Sort() { 

        
        let filter = input.value.toUpperCase();
        let rowsWithScores = [];

        rows.forEach((row, index) => {
            let tds = row.querySelectorAll('td');
            let totalScore = 0;

            tds.forEach((td, index) => {
                if (index !== tds.length - 1) {
                    let cellText = td.textContent;
                    let score = calculateMatchingScore(cellText, filter);
                    totalScore += score
                    if (score > 0) {
                        highlight(td, filter)
                    }
                    else {
                        Unmark(td)
                    }
                }
            });
            rowsWithScores.push({ row, score: totalScore, originalIndex: index });
        });

        rowsWithScores.sort((a, b) => b.score - a.score);
        table.innerHTML = ''
        rowsWithScores.forEach((item) => {
            table.appendChild(item.row);
        });
    }
    function calculateMatchingScore(cellText, filter) {
        let regex = new RegExp(filter, 'gi');
        let score = (cellText.match(regex) || []).length;
        return score;
    }
    function highlight(td, param) {
        const ob = new Mark(td);
        ob.unmark();
        ob.mark(param);
    }
    function Unmark(td) {
        const ob = new Mark(td);
        ob.unmark();
    }
}
