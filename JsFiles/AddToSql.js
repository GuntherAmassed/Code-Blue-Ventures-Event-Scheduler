const ct = require('countries-and-timezones');
const fs = require('fs');
require('dotenv').config()
const jwt = require('jsonwebtoken');

let files = fs.readdirSync('C:/Users/Moshe Stern/Desktop/Figma Api/ZuntaTimes/Images/Flags');
const { createPool } = require('mysql2');
let FinalCountryIntialArray = [];
let fileNames = [];
const crytpo = require('crypto');
const InsertLocations = 'INSERT INTO locationtable (location,timezones) VALUES (?, ?)';
const createUserQuery = 'INSERT INTO userinfo (Email, First_Name, Last_Name, Skype, timeZone, Password, Role) VALUES (?, ?, ?, ?, ?, ? ,?)';
const updateUserRefreshToken = `UPDATE userinfo SET userinfo.Refresh_Token=? WHERE userinfo.Email=?;`;
const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loginforzunta'
});
const Cities = {

}

class RandomNameGenerator {
    constructor() {
        this.firstName = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"];
        this.lastName = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"];
    }
    GenerateName() {
        let rFirst = this.firstName[Math.floor(Math.random() * this.firstName.length)];
        let rLast = this.lastName[Math.floor(Math.random() * this.lastName.length)];
        return [rFirst, rLast];
    }
}
const nameGenerator = new RandomNameGenerator();
// getFlagNames();
// addRefreshTokensToDatabase()
//addCitiesToDatabase()
function getCountries(lines) {

    let countryIntials = [];
    for (let i = 0; i < files.length; i++) {
        let filesSplit = files[i].split(/ |-/);
        countryIntials.push(filesSplit[0]);
    }
    for (let i = 0; i < countryIntials.length; i++) {
        let country = ct.getCountry(countryIntials[i].toUpperCase());
        if (country !== null) {
                console.log(country);
            // FinalCountryIntialArray.push(country);
        }
    }
}
function addUsersToDataBase() {
    for (let i = 0; i < 1000; i++) {
        let Name = nameGenerator.GenerateName();
        let values = [`${Name[0]}${i}@gmail.com`, Name[0], Name[1], 1234, FinalCountryIntialArray[Math.floor(Math.random() * FinalCountryIntialArray.length)].timezones[0], '1234', 'test'];
        pool.query(createUserQuery, [`${Name[0]}${i}@gmail.com`, Name[0], Name[1], 1234, FinalCountryIntialArray[Math.floor(Math.random() * FinalCountryIntialArray.length)].timezones[0], '1234', 'test'], (error) => {
            if (error) {
                console.error(error);
                console.log(values);
            } else {
                console.log(Name[0] + ' ' + Name[1] + ' ' + 'Inserted');
            }
        })
    }
}
function addTimezonesToDataBase() {

    for (let i = 0; i < FinalCountryIntialArray.length; i++) {

        for (let j = 0; j < FinalCountryIntialArray[i].timezones.length; j++) {

            pool.query(InsertLocations, [FinalCountryIntialArray[i].name, FinalCountryIntialArray[i].timezones[j]], (error) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(FinalCountryIntialArray[i].timezones[j] + 'Inserted');
                }
            })

        }
    }
}
function getFlagNames() {
    for (let i = 0; i < FinalCountryIntialArray.length; i++) {
        for (let j = 0; j < files.length; j++) {
            if (files[j].includes(FinalCountryIntialArray[i].name)) {
                fileNames.push(files[j])
            }
        }

    }
}
function addRefreshTokensToDatabase() {
    pool.query('SELECT * FROM userinfo', (err, results) => {
        if (err) {
            console.log(err.message);
        }
        for (let i = 0; i < results.length; i++) {
            let token = jwt.sign(results[i], process.env.REFRESH_TOKEN_SECRET, { expiresIn: '90d' })
            pool.query(updateUserRefreshToken, [token, results[i].Email], (err) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log('inserted Refresh token');
                }
            })
        }
    })
}

function addCitiesToDatabase() {
    pool.query('SELECT DISTINCT userinfo.timeZone FROM userinfo', (error, results) => {

        if (error) {
            console.error(error)
        }
        if (results.length > 0) {
            pool.query()
        }
    })

}
let cities =
    `AD-Andorra La Vella|3041563
AE-Abu Dhabi|292968
AE-Dubai|292223
AF-Kabul|1138958
AI-The Valley|3573374
AL-Tirana|3183875
AM-Yerevan|616052
AO-Luanda|2240449
AR-Buenos Aires|3435910
AR-Cordoba|3860259
AR-Rosario|3838583
AS-Pago Pago|5881576
AT-Vienna|2761369
AU-Adelaide|2078025
AU-Brisbane|2174003
AU-Canberra|2172517
AU-Gold Coast|2165087
AU-Hobart|2163355
AU-Melbourne|2158177
AU-Perth|2063523
AU-Sydney|2147714
AW-Oranjestad|3577154
AZ-Baku|587084
BA-Sarajevo|3191281
BB-Bridgetown|3374036
BD-Chittagong|1205733
BD-Dhaka|1185241
BD-Khulna|1336135
BE-Brussels|2800866
BF-Ouagadougou|2357048
BG-Sofia|727011
BH-Manama|290340
BI-Bujumbura|425378
BJ-Porto-novo|2392087
BM-Hamilton|3573197
BN-Bandar Seri Begawan|1820906
BO-La Paz|3911925
BO-Santa Cruz de la Sierra|3904906
BR-Belo Horizonte|3470127
BR-Brasilia|3469058
BR-Fortaleza|3399415
BR-Rio de Janeiro|3451190
BR-Salvador|3450554
BR-Sao Paulo|3448439
BS-Nassau|3571824
BT-Thimphu|1252416
BW-Gaborone|933773
BY-Minsk|625144
BZ-Belmopan|3582672
CA-Calgary|5913490
CA-Edmonton|5946768
CA-Halifax|6324729
CA-Mississauga|6075357
CA-Montreal|6077243
CA-Ottawa|6094817
CA-Quebec City|6325494
CA-Regina|6119109
CA-Saskatoon|6141256
CA-St. John's-05|6324733
CA-Toronto|6167865
CA-Vancouver|6173331
CA-Victoria|6174041
CA-Winnipeg|6183235
CD-Kinshasa|2314302
CD-Lubumbashi|922704
CF-Bangui|2389853
CG-Brazzaville|2260535
CH-Bern|2661552
CH-Geneva|2660646
CH-Zurich|2657896
CI-Abidjan|2293538
CI-Yamoussoukro|2279755
CK-Avarua|4035715
CL-Santiago|3871336
CM-Douala|2232593
CM-Yaounde|2220957
CN-Beijing|1816670
CN-Chengdu|1815286
CN-Chongqing|1814906
CN-Guangzhou|1809858
CN-Harbin|2037013
CN-Kaifeng|1804879
CN-Lanzhou|1804430
CN-Nanchong|1800146
CN-Nanjing|1799962
CN-Puyang|1798422
CN-Shanghai|1796236
CN-Shenyang|2034937
CN-Shenzhen|1795565
CN-Shiyan|1794903
CN-Tai'an|1793724
CN-Tianjin|1792947
CN-Wuhan|1791247
CN-Xi'an|1790630
CN-Yueyang|1927639
CN-Zhumadian|1783873
CO-Barranquilla|3689147
CO-Bogota|3688689
CO-Cali|3687925
CO-Medellin|3674962
CR-San José|3621849
CU-Havana|3553478
CV-Praia|3374333
CW-Willemstad|3513090
CY-Nicosia|146268
CZ-Prague|3067696
DE-Berlin|2950159
DE-Hamburg|2911298
DE-Munich|2867714
DK-Copenhagen|2618425
DM-Roseau|3575635
DO-Santiago de los Caballeros|3492914
DO-Santo Domingo|3492908
DZ-Algiers|2507480
EC-Guayaquil|3657509
EC-Quito|3652462
EE-Tallinn|588409
EG-Al Jizah|360995
EG-Alexandria|361058
EG-Cairo|360630
ER-Asmara|343300
ES-Barcelona|3128760
ES-Madrid|3117735
ET-Addis Ababa|344979
FI-Helsinki|658225
FJ-Suva|2198148
FK-Stanley|3426691
FO-Tórshavn|2611396
FR-Marseilles|2995469
FR-Paris|2988507
GA-Libreville|2399697
GB-Belfast|2655984
GB-Birmingham|2655603
GB-Bristol|2654675
GB-Cardiff|2653822
GB-Edinburgh|2650225
GB-Glasgow|2648579
GB-Leeds|2644688
GB-Liverpool|2644210
GB-London|2643743
GB-Manchester|2643123
GB-Sheffield|2638077
GE-Tbilisi|611717
GH-Accra|2306104
GH-Kumasi|2298890
GI-Gibraltar|2411585
GL-Nuuk|3421319
GM-Banjul|2413876
GN-Camayenne|2422488
GN-Conakry|2422465
GQ-Malabo|2309527
GR-Athens|264371
GT-Guatemala City|3598132
GW-Bissau|2374775
GY-Georgetown|3378644
HK-Hong Kong|1819729
HN-Tegucigalpa|3600949
HR-Zagreb|3186886
HT-Port-au-Prince|3718426
HU-Budapest|3054643
ID-Bandung|1650357
ID-Bekasi|1649378
ID-Depok|1645518
ID-Jakarta|1642911
ID-Makassar|1622786
ID-Medan|1214520
ID-Palembang|1633070
ID-Semarang|1627896
ID-South Tangerang|8581443
ID-Surabaya|1625822
ID-Tangerang|1625084
IE-Dublin|2964574
IL-Ashdod|295629
IL-Ashkelon|295620
IL-Bat Yam|295548
IL-Be'er Sheva|295530
IL-Beit Shemesh|295432
IL-Bnei Brak|295514
IL-Eilat|295277
IL-Hadera|294946
IL-Haifa|294801
IL-Herzliya|294778
IL-Holon|294751
IL-Jerusalem|281184
IL-Kfar Saba|294514
IL-Lod|294421
IL-Modiin|282926
IL-Nazareth|294098
IL-Netanya|294071
IL-Petach Tikvah|293918
IL-Ra'anana|293807
IL-Ramat Gan|293788
IL-Ramla|293768
IL-Rishon LeZion|293703
IL-Tel Aviv|293397
IL-Tiberias|293322
IM-Douglas|3042237
IN-Ahmadabad|1279233
IN-Bangalore|1277333
IN-Bombay|1275339
IN-Calcutta|1275004
IN-Chennai|1264527
IN-Cochin|1273874
IN-Hyderabad|1269843
IN-Jaipur|1269515
IN-Kanpur|1267995
IN-New Delhi|1261481
IN-Pune|1259229
IN-Surat|1255364
IQ-Baghdad|98182
IR-Tehran|112931
IS-Reykjavík|3413829
IT-Milano|3173435
IT-Rome|3169070
JM-Kingston|3489854
JO-Amman|250441
JP-Kobe-shi|1859171
JP-Kyoto|1857910
JP-Nagoya-shi|1856057
JP-Osaka-shi|1853909
JP-Sapporo|2128295
JP-Tokyo|1850147
KE-Nairobi|184745
KG-Bishkek|1528675
KH-Phnom Penh|1821306
KM-Moroni|921772
KN-Basseterre|3575551
KP-Pyongyang|1871859
KR-Busan|1838524
KR-Seoul|1835848
KW-Kuwait|285787
KY-George Town|3580661
KZ-Almaty|1526384
KZ-Astana|1526273
LA-Vientiane|1651944
LB-Beirut|276781
LC-Castries|3576812
LI-Vaduz|3042030
LR-Monrovia|2274895
LS-Maseru|932505
LT-Vilnius|593116
LU-Luxemburg|2960316
LV-Riga|456172
LY-Tripoli|2210247
MA-Casablanca|2553604
MA-Rabat|2538475
MD-Chisinau|618426
ME-Podgorica|3193044
MG-Antananarivo|1070940
MK-Skopje|785842
ML-Bamako|2460596
MM-Mandalay|1311874
MM-Rangoon|1298824
MN-Ulaanbaatar|2028462
MP-Saipan|7828758
MR-Nouakchott|2377450
MS-Plymouth|3578069
MT-Valletta|2562305
MU-Port Louis|934154
MW-Lilongwe|927967
MX-Cancun|3531673
MX-Guadalajara|4005539
MX-Iztapalapa|3526683
MX-Mazatlan|3996322
MX-Mexico City|3530597
MX-Monterrey|3995465
MX-Puerto Vallarta|3991328
MX-Tijuana|3981609
MY-Kota Bharu|1736376
MY-Kuala Lumpur|1735161
MZ-Maputo|1040652
NA-Windhoek|3352136
NC-Nouméa|2139521
NE-Niamey|2440485
NG-Abuja|2352778
NG-Lagos|2332459
NI-Managua|3617763
NL-Amsterdam|2759794
NO-Oslo|3143244
NP-Kathmandu|1283240
NU-Alofi|4036284
NZ-Auckland|2193733
NZ-Christchurch|2192362
NZ-Wellington|2179537
OM-Muscat|287286
PA-Panama City|3703443
PE-Lima|3936456
PF-Papeete|4033936
PG-Port Moresby|2088122
PH-Manila|1701668
PK-Islamabad|1176615
PK-Karachi|1174872
PL-Warsaw|756135
PR-San Juan|4568127
PT-Lisbon|2267057
PY-Asuncion|3439389
QA-Doha|290030
RO-Bucharest|683506
RS-Belgrade|792680
RU-Moscow|524901
RU-Novosibirsk|1496747
RU-Saint Petersburg|498817
RU-Yekaterinburg|1486209
RW-Kigali|202061
SA-Jeddah|105343
SA-Mecca|104515
SA-Medina|109223
SA-Riyadh|108410
SB-Honiara|2108502
SC-Victoria|241131
SD-Khartoum|379252
SD-Omdurman|365137
SE-Stockholm|2673730
SG-Singapore|1880252
SH-Jamestown|3370903
SI-Ljubljana|3196359
SK-Bratislava|3060972
SL-Freetown|2408770
SN-Dakar|2253354
SO-Mogadishu|53654
SR-Paramaribo|3383330
ST-São Tomé|2410763
SV-San Salvador|3583361
SY-Aleppo|170063
SY-Damascus|170654
SZ-Mbabane|934985
TC-Cockburn Town|3576994
TD-Ndjamena|2427123
TG-Lomé|2365267
TH-Bangkok|1609350
TJ-Dushanbe|1221874
TM-Ashgabat|162183
TN-Tunis|2464470
TR-Adana|325363
TR-Ankara|323786
TR-Bursa|750269
TR-Istanbul|745044
TR-Izmir|311046
TV-Funafuti|2110394
TW-Kaohsiung|1673820
TW-Taipei|1668341
TZ-Dar es Salaam|160263
TZ-Dodoma|160196
UA-Kharkiv|706483
UA-Kiev|703448
UG-Kampala|232422
US-Atlanta-GA|4180439
US-Austin-TX|4671654
US-Baltimore-MD|4347778
US-Boston-MA|4930956
US-Buffalo-NY|5110629
US-Chicago-IL|4887398
US-Cincinnati-OH|4508722
US-Cleveland-OH|5150529
US-Columbus-OH|4509177
US-Dallas-TX|4684888
US-Denver-CO|5419384
US-Detroit-MI|4990729
US-Hartford-CT|4835797
US-Honolulu-HI|5856195
US-Houston-TX|4699066
US-Lakewood-NJ|5100280
US-Las Vegas-NV|5506956
US-Livingston-NY|5100572
US-Los Angeles-CA|5368361
US-Memphis-TN|4641239
US-Miami-FL|4164138
US-Milwaukee-WI|5263045
US-Monsey-NY|5127315
US-New Haven-CT|4839366
US-New York-NY|5128581
US-Omaha-NE|5074472
US-Orlando-FL|4167147
US-Passaic-NJ|5102443
US-Philadelphia-PA|4560349
US-Phoenix-AZ|5308655
US-Pittsburgh-PA|5206379
US-Portland-OR|5746545
US-Providence-RI|5224151
US-Richmond-VA|4781708
US-Rochester-NY|5134086
US-Saint Louis-MO|4407066
US-Saint Paul-MN|5045360
US-San Diego-CA|5391811
US-San Francisco-CA|5391959
US-Seattle-WA|5809844
US-Silver Spring-MD|4369596
US-Teaneck-NJ|5105262
US-Washington-DC|4140963
US-White Plains-NY|5144336
UY-Montevideo|3441575
UZ-Tashkent|1512569
VC-Kingstown|3577887
VE-Caracas|3646738
VE-Maracaibo|3633009
VE-Maracay|3632998
VE-Valencia|3625549
VG-Road Town|3577430
VN-Hanoi|1581130
VN-Ho Chi Minh City|1566083
WS-Apia|4035413
YE-Sanaa|71137
YT-Mamoudzou|921815
ZA-Cape Town|3369157
ZA-Durban|1007311
ZA-Johannesburg|993800
ZA-Pretoria|964137
ZM-Lusaka|909137 
ZW-Harare|890299`;
const lines = cities.split('\n');

console.log(lines);
