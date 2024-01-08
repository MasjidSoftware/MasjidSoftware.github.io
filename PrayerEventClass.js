class PrayerEvent {
    athanTimeoutID;
    afterAthanTimeoutID;
    prayerEndTimeoutID;
    prayerPauseTimeoutID;
    backToNormalTimeoutID;

    athanNotificationTimeoutID;
    iqamaNotificationTimeoutID;

    athanTime;
    iqamaTime;
    prayerEndTime;
    afterPrayerAthkarEndTime;

    eventName;
    iqamaMinutesDelay;
    prayerMinutesDuration;
    afterPrayerAthkarMinutesDuration;
    #countdownSeconds = 5 * 60;


    constructor(entryDateTime, eventName, iqamaMinutesDelay = 20, prayerMinutesDuration = 10, afterPrayerAthkarMinutesDuration = 10) {
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
            this.setPrayerEndTimeout();
            this.setBackToNormalTimeout();
        }
    }
    updateTimes(entryDateTime) {
        this.athanTime = new Date(entryDateTime.getTime());
        if (this.eventName == "الجمعة") {
            this.athanTime.setMinutes(entryDateTime.getMinutes() - 60); // First Athan
        }
        this.iqamaTime = new Date(entryDateTime.getTime());
        this.iqamaTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay);
        this.prayerEndTime = new Date(entryDateTime.getTime());
        this.prayerEndTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay + this.prayerMinutesDuration);
        this.afterPrayerAthkarEndTime = new Date(entryDateTime.getTime());
        this.afterPrayerAthkarEndTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay + this.prayerMinutesDuration + this.afterPrayerAthkarMinutesDuration);
    }


    setAthanTimeout() {
        clearTimeout(this.athanTimeoutID);
        clearTimeout(this.athanNotificationTimeoutID);
        let now = new Date();
        let notificationTime = new Date(this.athanTime.getTime());

        if (now < this.athanTime) {
            notificationTime.setSeconds(notificationTime.getSeconds() - Math.min(this.#countdownSeconds, ((this.athanTime - now) / 1000)));

            if (logging) {
                console.log(this.eventName + " athan notification " + notificationTime);
                console.log(this.eventName + " athan " + this.athanTime);
            }
            this.afterAthanTimeoutID = setTimeout(() => {
                messageController.startArkanAlsalahMessages();
            }, this.athanTime - now);

            this.athanNotificationTimeoutID = setTimeout((time, eventName) => {
                messageController.displayNotification(time, eventName);
                messageController.startAthanMessages();
            }, notificationTime - now, this.athanTime, "أذان " + this.eventName);
        } else if (now < this.iqamaTime) {
            messageController.startArkanAlsalahMessages();
        }
    }

    setIqamaTimeout() {
        clearTimeout(this.iqamaNotificationTimeoutID);
        clearTimeout(this.prayerPauseTimeoutID);

        let now = new Date();
        let notificationTime = new Date(this.iqamaTime.getTime());
        notificationTime.setSeconds(notificationTime.getSeconds() - Math.min(this.#countdownSeconds, ((this.iqamaTime - now) / 1000)));

        if (now < this.iqamaTime) {

            if (logging) {
                console.log(this.eventName + " iqama notification " + notificationTime);
                console.log(this.eventName + " iqama " + this.iqamaTime);
            }


            this.prayerPauseTimeoutID = setTimeout(() => {
                messageController.prayerPause();
            }, this.iqamaTime - now);

            this.iqamaNotificationTimeoutID = setTimeout((time, eventName) => {
                messageController.displayNotification(time, eventName);
            }, notificationTime - now, this.iqamaTime, (this.eventName != "الجمعة" ? "إقامة " : "أذان ") + this.eventName);
        } else if (now < this.prayerEndTime) {
            messageController.prayerPause();
        }

    }
    setPrayerEndTimeout() {
        clearTimeout(this.prayerEndTimeoutID);
        let now = new Date();

        if (now < this.prayerEndTime) {

            if (logging)
                console.log(this.eventName + " prayer-end/Athkar " + this.prayerEndTime);

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

            if (logging)
                console.log(this.eventName + " backToNormal " + this.afterPrayerAthkarEndTime);

            this.backToNormalTimeoutID = setTimeout(() => {
                messageController.startDefaultMessages();
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