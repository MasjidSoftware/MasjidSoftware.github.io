class PrayerEvent {
    athanTimeoutID;
    prayerEndTimeoutID;
    prayerPauseTimeoutID;
    backToNormalTimeoutID;

    athanNotificationTimeoutID;
    iqamaNotificationTimeoutID;

    athanTime;
    iqamaTime;
    prayerEndTime;
    afterPrayerAthkarEndTime;
    prayerPauseTime;

    eventName;
    iqamaMinutesDelay;
    prayerMinutesDuration;
    afterPrayerAthkarMinutesDuration;
    #countdownSeconds = 5 * 60;


    constructor(entryDateTime, eventName, iqamaMinutesDelay = 20, prayerMinutesDuration = 10, afterPrayerAthkarMinutesDuration = 15) {
        if (eventName == "الجمعة") {
            this.iqamaMinutesDelay = 0;//Second athan
            this.prayerMinutesDuration = 27; //Second Athan + Khutbah + Prayer
        } else {
            this.iqamaMinutesDelay = iqamaMinutesDelay;
            this.prayerMinutesDuration = prayerMinutesDuration;
        }

        this.afterPrayerAthkarMinutesDuration = afterPrayerAthkarMinutesDuration;
        this.eventName = eventName;
        this.updateTimes(entryDateTime);
        if (eventName != "الشروق") {
            this.setAthanTimeout();
            this.setIqamaTimeout();
            this.setPrayerPauseTimeout();
            this.setPrayerEndTimeout();
            this.setBackToNormalTimeout();
        }
    }
    updateTimes(entryDateTime) {
        this.athanTime = new Date(entryDateTime.getTime());
        this.iqamaTime = new Date(entryDateTime.getTime());
        this.iqamaTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay);
        this.prayerEndTime = new Date(entryDateTime.getTime());
        this.prayerEndTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay + this.prayerMinutesDuration);
        this.afterPrayerAthkarEndTime = new Date(entryDateTime.getTime());
        this.afterPrayerAthkarEndTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay + this.prayerMinutesDuration + this.afterPrayerAthkarMinutesDuration);
        this.prayerPauseTime = new Date(entryDateTime.getTime());
        this.prayerPauseTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay);
        this.prayerPauseTime.setSeconds(this.prayerPauseTime.getSeconds() + 30);
    }
    setIqamaTimeout() {
        clearTimeout(this.iqamaNotificationTimeoutID);
        let now = new Date();
        let notificationTime = new Date(this.iqamaTime.getTime());

        if (now < this.iqamaTime) {
            notificationTime.setSeconds(notificationTime.getSeconds() - Math.min(this.#countdownSeconds, ((this.iqamaTime - now) / 1000)));

            //console.log(this.eventName + " iqama " + this.iqamaTime)
            //console.log(this.eventName + " iqama notification " + notificationTime);
            this.iqamaNotificationTimeoutID = setTimeout((time, eventName) => {
                messageController.displayNotification(time, eventName);
            }, notificationTime - now, this.iqamaTime, (this.eventName != "الجمعة" ? "إقامة " : "أذان ") + this.eventName);
        }

    }
    setPrayerPauseTimeout() {
        clearTimeout(this.prayerPauseTimeoutID);
        let now = new Date();
        if (now < this.prayerPauseTime) {
            this.prayerPauseTimeoutID = setTimeout(() => {
                messageController.prayerPause();
            }, this.prayerPauseTime - new Date());
        } else if (now < this.prayerEndTime) {
            messageController.prayerPause();
        }
    }
    setAthanTimeout() {
        clearTimeout(this.athanTimeoutID);
        clearTimeout(this.athanNotificationTimeoutID);
        let now = new Date();
        let athanTime = new Date(this.athanTime.getTime());
        let notificationTime = new Date(this.athanTime.getTime());
        if (this.eventName == "الجمعة") {
            athanTime.setMinutes(this.athanTime.getMinutes() - 60); // First Athan
        }
        if (now < athanTime) {
            notificationTime.setSeconds(notificationTime.getSeconds() - Math.min(this.#countdownSeconds, ((athanTime - now) / 1000)));

            //console.log(this.eventName + " athan " + this.athanTime)
            //console.log(this.eventName + " athan notification " + notificationTime);
            this.athanNotificationTimeoutID = setTimeout((time, eventName) => {
                messageController.displayNotification(time, eventName);
                messageController.startAthanMessages();
            }, notificationTime - now, athanTime, "أذان " + this.eventName);
        } else if (now < this.iqamaTime) {
            messageController.startAthanMessages();
        }

    }
    setPrayerEndTimeout() {
        clearTimeout(this.prayerEndTimeoutID);
        let now = new Date();
        if (now < this.prayerEndTime) {

            //console.log(this.eventName + " prayer-end " + this.prayerEndTime);
            this.prayerEndTimeoutID = setTimeout(() => {
                messageController.prayerUnpause();
                messageController.startAfterPrayerMessages();
            }, this.prayerEndTime - new Date());
        } else if (now < this.afterPrayerAthkarEndTime) {
            messageController.prayerUnpause();
            messageController.startAfterPrayerMessages();
        }

    }
    setBackToNormalTimeout() {
        clearTimeout(this.backToNormalTimeoutID);
        let now = new Date();
        if (now < this.afterPrayerAthkarEndTime) {

            //console.log(this.eventName + " backToNormal " + this.afterPrayerAthkarEndTime);
            this.backToNormalTimeoutID = setTimeout(() => {
                messageController.startMorningEveningMessages();
            }, this.afterPrayerAthkarEndTime - new Date());
        }

    }
    isActive(now) {
        return now >= this.athanTime && now <= this.afterPrayerAthkarEndTime;
    }
    getAthanTime() {
        return this.athanTime.toLocaleString(arabicLocale, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).replace(/\s/g, '');
    }
    getIqamaTime() {
        return this.iqamaTime.toLocaleString(arabicLocale, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    }
}