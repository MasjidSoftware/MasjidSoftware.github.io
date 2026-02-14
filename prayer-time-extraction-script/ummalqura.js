/*
To get prayer time data go to :
    https://www.ummulqura.org.sa/
    Click on English
    Click on calendar
    Choose country and city;
    Choose 24 hour if possible in the future and set flag to true!!!! 
    Click "Display of prayer Times"
    Click on "Type a year for a city *nameOfCity*"
    right click and click on "inspect" from the menu
    insert this script
    copy results it appropriate file
    Delete past dates and keep today's Georgian date
    From the site: do it again for the next hijri year
    from the date in the end of the file until todays date complete the days using the newer Hijri year
    merge the two outputs based on dates manually.
*/

let timeFormat24 = false;
let trs = document.querySelectorAll(".payerTB>tbody>tr");
let monthName = "Unknown-Month";
let data = [];
trs.forEach((tr) => {
    let tds = tr.querySelectorAll("td");
    if (tds.length == 8) {
        /* Month and Day*/
        let monthDaySplit = tds[1].innerHTML.trim().split(' '); //comes in the format "July 19" or "19"
        let day = "Unknown-Day";
        if (monthDaySplit.length == 2) { //Month name and day number available
            monthName = monthDaySplit[1];
            day = monthDaySplit[0];
        } else if (monthDaySplit.length == 1) {//Only day number is available
            day = monthDaySplit[0];
        } else {//Unexpected exit
            console.log("Error: Unexpected month-day parse");
            console.log(tds);
        }
        if (Number(day) < 10) {
            day = "0" + day;
        }
        let monthNumber = convertMonthName(monthName);


        /* create prayer records */
        if (timeFormat24)
            data.push(monthNumber + "-" + day + "~~~~~" + tds[2].innerHTML + "|" + tds[3].innerHTML + "|" + tds[4].innerHTML + "|" + tds[5].innerHTML + "|" + tds[6].innerHTML + "|" + tds[7].innerHTML);
        else
            data.push(monthNumber + "-" + day + "~~~~~" + tds[2].innerHTML + "|" + tds[3].innerHTML + "|" + convertDhuhrTo24(tds[4].innerHTML) + "|" + convertToPMEquivalent(tds[5].innerHTML) + "|" + convertToPMEquivalent(tds[6].innerHTML) + "|" + convertToPMEquivalent(tds[7].innerHTML));

    }
});
function convertMonthName(monthName) {
    monthName = monthName.toLowerCase();
    switch (monthName) {
        case "january":
            return "01";
        case "february":
            return "02";
        case "march":
            return "03";
        case "april":
            return "04";
        case "may":
            return "05";
        case "june":
            return "06";
        case "july":
            return "07";
        case "august":
            return "08";
        case "september":
            return "09";
        case "october":
            return "10";
        case "november":
            return "11";
        case "december":
            return "12";
        default:
            console.log("Error: could not convert the month [" + monthName + "] to a number");
            return "Unkown-Month-Number";
    }
}
function convertDhuhrTo24(time) {
    let s = time.split(":");
    let h = Number(s[0]);
    if (h > 12 || h < 0)
        console.log("Error: hours are expected to be in between 0 and 12")
    if (h >= 1 && h <= 9)
        return (h + 12) + ":" + s[1];
    return time;
}
function convertToPMEquivalent(time) {
    let s = time.split(":");
    let h = Number(s[0]);
    if (h > 12 || h < 0)
        console.log("Error: hours are expected to be in between 0 and 12");
    if (h == 12) {
        return "00:" + s[1];
    } else if (h >= 1 && h < 12) {
        return (h + 12) + ":" + s[1];
    }
    return time;
}
var output = JSON.stringify(data);
console.log(output);