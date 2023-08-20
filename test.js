const { formatInTimeZone } = require('date-fns-tz');


console.log(new Date(formatInTimeZone(new Date(), 'Asia/Kabul', 'yyyy-MM-dd hh:mm:ss aa')).getHours());
console.log(new Date(formatInTimeZone(new Date(), 'Asia/Kabul', 'yyyy-MM-dd hh:mm:ss aa')).getDay());
console.log(new Date(formatInTimeZone(new Date(), 'Asia/Kabul', 'yyyy-MM-dd hh:mm:ss aa')).getMinutes());
console.log(new Date(formatInTimeZone(new Date(), 'Asia/Kabul', 'yyyy-MM-dd hh:mm:ss aa')).getSeconds());
