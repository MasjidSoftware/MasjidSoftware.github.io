//-----Start of Settings-----
var englishLocale = "en-SA";
var arabicLocale = "ar-SA";

//-----End of Settings-------
var mainElement;
var messageElement;
var footerElement;
var clockElment;
var dateElement;
var dhuhrNameElement;
var fajrTimeElement;
var shroogTimeElement;
var dhuhrTimeElement;
var asrTimeElement;
var magribTimeElement;
var eshaTimeElement;
var fullScreenElement;
var currentMessageID = 0;
var messageController;
var previousDateReading;
var fajrEvent;
var shrooqEvent;
var dhuhrEvent
var asrEvent;
var maghribEvent;
var eshaEvent;
var timeEvents = [];
var notificationsElement;
var prayersElement;
var notificationElement;
var notificationTimerElement;
var messageIndexElement;
var primaryColor;
var secondaryColor;
var messageBgColor;



function main() {

    setupGlobalElements();
    setInterval(startTime, 1000);
    messageController = new MessageController(afterPrayerMessages, morningEveningMessages);

}
function setupGlobalElements() {
    //get default CSS colors
    var bodyStyles = window.getComputedStyle(document.body);
    primaryColor = bodyStyles.getPropertyValue('--primary');
    secondaryColor = bodyStyles.getPropertyValue('--secondary');
    messageBgColor = bodyStyles.getPropertyValue('--message-bg-color');

    mainElement = document.getElementById("main");
    messageElement = document.getElementById("message");
    footerElement = document.getElementById("footer");

    clockElment = document.getElementById("clock");
    dateElement = document.getElementById("date");
    dhuhrNameElement = document.getElementById("dhuhr");
    fajrTimeElement = document.getElementById("fajrTime");
    shroogTimeElement = document.getElementById("shroogTime");
    dhuhrTimeElement = document.getElementById("dhuhrTime");
    asrTimeElement = document.getElementById("asrTime");
    magribTimeElement = document.getElementById("magribTime");
    eshaTimeElement = document.getElementById("eshaTime");
    fullScreenElement = document.getElementById("fullScreen");
    prayersElement = document.getElementById("prayers");
    notificationsElement = document.getElementById("notifications");
    notificationElement = document.getElementById("notification");
    notificationTimerElement = document.getElementById("notificationTimer");
    messageIndexElement = document.getElementById("messageIndex");
}
function startTime() {

    const now = new Date();
    const dateOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };
    const timeOptions = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };
    if (now.toLocaleDateString(arabicLocale, { weekday: "long" }) == "الجمعة") {
        dhuhrNameElement.innerHTML = "الجمعة";
    } else {
        dhuhrNameElement.innerHTML = "الظهر";
    }
    clockElment.innerHTML = now.toLocaleTimeString(arabicLocale, timeOptions);
    //h + ":" + m + ":" + s + " " + AMorPM;
    dateElement.innerHTML = now.toLocaleDateString(arabicLocale, dateOptions);



    hasSystemTimeChanged(now);
}
function updatePrayerTimes(now) {

    //to create a date object for each prayer
    let day = now.toLocaleDateString(englishLocale, { day: "numeric" });
    let month = now.toLocaleDateString(englishLocale, { month: "numeric" });
    let year = now.toLocaleDateString(englishLocale, { year: "numeric" });
    let i;
    let missingDay = false;
    //Go back up to 3 days ago to find missing prayer times
    for (let numberOfDaysAgo = 0; numberOfDaysAgo < 3; numberOfDaysAgo++) {
        now.setDate(now.getDate() - numberOfDaysAgo);
        let monthDay = getMonthDay(now);
        i = JS_TIMES.findIndex((el) => el.includes(monthDay));
        if (numberOfDaysAgo > 0)
            missingDay = true;
        if (i >= 0)
            break;
    }

    if (i >= 0 && JS_TIMES[i].includes("~")) {
        let dayPrayerTimes = JS_TIMES[i].split("~~~~~")[1].split("|");
        /*
        for (let x = 0; x < dayPrayerTimes.length; x++) {
            if (dayPrayerTimes[x].charAt(0) === "0")
                dayPrayerTimes[x] = dayPrayerTimes[x].slice(1);
        }
        */


        //Manage fajr
        let hoursMinutes = dayPrayerTimes[0].split(":");
        let fajrTime = new Date(now.getTime());
        fajrTime.setHours(hoursMinutes[0]);
        fajrTime.setMinutes(hoursMinutes[1]);
        fajrTime.setSeconds(0);
        fajrEvent = new PrayerEvent(fajrTime, "الفجر", 25);
        fajrTimeElement.innerHTML = fajrEvent.getAthanTime();//getInArabicAMPM(dayPrayerTimes[0]);


        //Manage shrooq
        hoursMinutes = dayPrayerTimes[1].split(":");
        let shrooqTime = new Date(now.getTime());
        shrooqTime.setHours(hoursMinutes[0]);
        shrooqTime.setMinutes(hoursMinutes[1]);
        shrooqTime.setSeconds(0);
        shrooqEvent = new PrayerEvent(shrooqTime, "الشروق", 0);
        shroogTimeElement.innerHTML = shrooqEvent.getAthanTime(); //getInArabicAMPM(dayPrayerTimes[1]);


        //Manage dhuhr
        hoursMinutes = dayPrayerTimes[2].split(":");
        let dhurTime = new Date(now.getTime());
        dhurTime.setHours(hoursMinutes[0]);
        dhurTime.setMinutes(hoursMinutes[1]);
        dhurTime.setSeconds(0);
        dhuhrEvent = new PrayerEvent(dhurTime, "الظهر");
        dhuhrTimeElement.innerHTML = dhuhrEvent.getAthanTime();//getInArabicAMPM(dayPrayerTimes[2]);


        //Manage asr
        hoursMinutes = dayPrayerTimes[3].split(":");
        let asrTime = new Date(now.getTime());
        asrTime.setHours(hoursMinutes[0]);
        asrTime.setMinutes(hoursMinutes[1]);
        asrTime.setSeconds(0);
        asrEvent = new PrayerEvent(asrTime, "العصر");
        asrTimeElement.innerHTML = asrEvent.getAthanTime();//getInArabicAMPM(dayPrayerTimes[3]);


        //Manage maghrib
        hoursMinutes = dayPrayerTimes[4].split(":");
        let maghribTime = new Date(now.getTime());
        maghribTime.setHours(hoursMinutes[0]);
        maghribTime.setMinutes(hoursMinutes[1]);
        maghribTime.setSeconds(0);
        maghribEvent = new PrayerEvent(maghribTime, "المغرب", 10);
        magribTimeElement.innerHTML = maghribEvent.getAthanTime();//getInArabicAMPM(dayPrayerTimes[4]);


        //Manage esha
        hoursMinutes = dayPrayerTimes[5].split(":");
        let eshaTime = new Date(now.getTime());
        eshaTime.setHours(hoursMinutes[0]);
        eshaTime.setMinutes(hoursMinutes[1]);
        eshaTime.setSeconds(0);
        eshaEvent = new PrayerEvent(eshaTime, "العشاء");
        eshaTimeElement.innerHTML = eshaEvent.getAthanTime();//getInArabicAMPM(dayPrayerTimes[5]);


        //Default messages
        if (!eshaEvent.isActive(now) && !maghribEvent.isActive(now) && !asrEvent.isActive(now) && !dhuhrEvent.isActive(now) && !fajrEvent.isActive(now))
            messageController.startMorningEveningMessages();
    }
    if (missingDay) {
        //Missing day in timing table...
        fajrTimeElement.style.borderBottomColor = "red";
        shroogTimeElement.style.borderBottomColor = "red";
        dhuhrTimeElement.style.borderBottomColor = "red";
        asrTimeElement.style.borderBottomColor = "red";
        magribTimeElement.style.borderBottomColor = "red";
        eshaTimeElement.style.borderBottomColor = "red";
    } else {
        //Reset notification for missing day in timing table...
        fajrTimeElement.style.borderBottomColor = "";
        shroogTimeElement.style.borderBottomColor = "";
        dhuhrTimeElement.style.borderBottomColor = "";
        asrTimeElement.style.borderBottomColor = "";
        magribTimeElement.style.borderBottomColor = "";
        eshaTimeElement.style.borderBottomColor = "";
    }
}
function createPrayerTimeouts(now) {

}
function getInArabicAMPM(dayPrayerTime) {
    let hm = dayPrayerTime.split(":");
    let hour = Number(hm[0]);
    if (hour > 12) hour = hour - 12;
    else if (hour === 0) hour = 12;
    dayPrayerTime = hour + ":" + hm[1];
    return EntoAr(dayPrayerTime);
}
function getMonthDay(now) {
    let day = now.toLocaleDateString(englishLocale, { day: "numeric" });
    let month = now.toLocaleDateString(englishLocale, { month: "numeric" });
    if (day.length === 1) day = "0" + day;
    if (month.length === 1) month = "0" + month;
    let monthDay = month + "-" + day;
    return monthDay
}
function createTimeEvents() {

    let day = now.toLocaleDateString(englishLocale, { day: "numeric" });
    let month = now.toLocaleDateString(englishLocale, { month: "numeric" });
    let year = now.toLocaleDateString(englishLocale, { year: "numeric" });

}
function updateTimeEvents(now) {
    updatePrayerTimes(now);
}
function hasSystemTimeChanged(now) {
    if (previousDateReading === undefined) {
        previousDateReading = now;
        //console.log("Update Time Events - new timestamp");
        updateTimeEvents(now);
    }
    else {
        let timeDifference = now - previousDateReading;

        if (Math.abs(timeDifference) >= 60000) { // Fiftry second leniency
            updateTimeEvents(now);
            //console.log("Prev: " + previousDateReading);
            //console.log("Now: " + now)
            //console.log("Update Time Events - Time Diff " + (timeDifference / 1000));
        }
        previousDateReading = now;
        isNewDay(now);
    }
}
function isNewDay(now) {
    if (previousDateReading.toLocaleDateString(englishLocale, { day: "numeric" }) != now.toLocaleDateString(englishLocale, { day: "numeric" }) ||
        previousDateReading.toLocaleDateString(englishLocale, { month: "numeric" }) != now.toLocaleDateString(englishLocale, { month: "numeric" })) {
        updateTimeEvents(now);
        //console.log("Update Time Events - new day");

    }
}
function setProgress(percentage) {
    percentage = Math.ceil(percentage);
    percentage = (percentage > 100) ? 100 : percentage;
    percentage = (percentage < 0) ? 0 : percentage;
    console.log(percentage);
    let percentageRemaining = 100 - percentage;
    console.log(percentageRemaining);
    notificationsElement.style.background = "linear-gradient(-90deg, " + secondaryColor + " " + percentage + "%, " + messageBgColor + " " + percentage + "%)";
}
function prefixZero(n) {
    return n < 10 ? '0' + n : '' + n;
}






