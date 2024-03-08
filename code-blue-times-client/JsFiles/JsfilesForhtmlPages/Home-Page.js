

doExcute()

async function doExcute() {
    const plusIcon = document.getElementsByClassName('Plus-Icon');
    const contentDiv = document.getElementsByClassName('Content');
    const dropdowndivpara = document.getElementsByClassName('drop-Down-Paragraph')
    document.body.style.display = 'none';
    setTimeout(() => { document.body.style.display = 'grid'; }, 3000)
    await Excute();
    document.body.style.display = 'grid'
    const clickedTypes = new Array(plusIcon.length).fill(false);
    SeeIfLocationsIsOverflowed()

    for (let i = 0; i < dropdowndivpara.length; i++) {
        dropdowndivpara[i].addEventListener('click', function () {
            let clickedType = clickedTypes[i];

            contentDiv[i].classList.toggle('hidden');
            dropdowndivpara[i].classList.toggle('blueborder')
            if (!clickedType) {
                plusIcon[i].src = 'Images/MinusSign.svg'
            }
            else {
                plusIcon[i].src = 'Images/PlusSign.svg'
            }
            clickedTypes[i] = !clickedType;
        });
    }

    document.querySelector("#calendarIcon").addEventListener("click", (e) => {
        e.stopPropagation()
        document.querySelector("#iframe-Frame").classList.toggle("hidden")
    })
    document.querySelector('body').addEventListener('click', () => {
        document.querySelector("#iframe-Frame").classList.add("hidden")
    })


    document.querySelector("#Today-Date").innerText = `${new Date().toLocaleString('en-US', { weekday: "short", month: "short", day: "numeric", year: "numeric" }).replace(/,/g, "")}`;

    const scrollButtonforward = document.getElementById("scrollButtonforward");
    const scrollButtonback = document.getElementById("scrollButtonback");
    let i = 0;
    scrollButtonforward.addEventListener('click', () => {
        ++i
        if (i < 0) {
            i = 0
        }
        if (i > document.querySelectorAll('.location-borders').length) {
            i = document.querySelectorAll('.location-borders').length - 1
        }

        if (i < document.querySelectorAll('.location-borders').length) {
            document.querySelectorAll('.location-borders')[i].scrollIntoView({ inline: 'end', block: 'nearest', behavior: "smooth" });
        }
    })
    scrollButtonback.addEventListener('click', () => {
        if (i > document.querySelectorAll('.location-borders').length) {
            i = document.querySelectorAll('.location-borders').length - 1
        }
        --i
        if (i < 0) {
            i = 0
        }
        if (i === 0) {
            document.querySelectorAll('.location-borders')[i].scrollIntoView({ inline: 'start', block: 'nearest', behavior: "smooth" });
            return
        }
        document.querySelectorAll('.location-borders')[i].scrollIntoView({ inline: 'end', block: 'nearest', behavior: "smooth" });

    })
    window.addEventListener('message', async function (event) {
        if (event.data.type === "TdClick") {
            console.log(event.data.tdDate);
            let date = {
                year: event.data.tdDate.split('-')[0],
                month: parseInt(event.data.tdDate.split('-')[1]) - 1,
                day: event.data.tdDate.split('-')[2]
            }
            let data = await checkForCookies()
            await ZmanFetch(data, new Date(date.year, date.month, date.day));
            document.querySelector("#Today-Date").innerText = `${new Date(date.year, date.month, date.day).toLocaleString('en-US', { weekday: "short", month: "short", day: "numeric", year: "numeric" }).replace(/,/g, "")}`;
        }
    });


    ///functions
    function SeeIfLocationsIsOverflowed() {
        if (check(document.querySelector('#row-location-frame'))) {
            document.querySelector('#scroll-container').style.display = 'flex'
        }
        else {
            document.querySelector('#scroll-container').style.display = 'none'
        }
        window.addEventListener('resize', checkChecker)
        function checkChecker() {
            if (check(document.querySelector('#row-location-frame'))) {
                document.querySelector('#scroll-container').style.display = 'flex'
            }
            else {
                document.querySelector('#scroll-container').style.display = 'none'
            }
        }

        function check(el) {
            var curOverf = el.style.overflow;

            if (!curOverf || curOverf === "visible")
                el.style.overflow = "hidden";

            var isOverflowing = el.clientWidth < el.scrollWidth
                || el.clientHeight < el.scrollHeight;

            el.style.overflow = curOverf;

            return isOverflowing;
        }
    }
}
