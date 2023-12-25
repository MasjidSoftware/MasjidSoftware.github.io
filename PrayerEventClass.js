class PrayerEvent {
    athanTimeoutID;
    iqamaTimeoutID;
    prayerEndTimeoutID;
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

    constructor(entryDateTime, eventName, iqamaMinutesDelay = 20, prayerMinutesDuration = 10, afterPrayerAthkarMinutesDuration = 15) {
        this.prayerMinutesDuration = prayerMinutesDuration;
        this.iqamaMinutesDelay = iqamaMinutesDelay;
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
        this.iqamaTime = new Date(entryDateTime.getTime());
        this.iqamaTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay);
        this.prayerEndTime = new Date(entryDateTime.getTime());
        this.prayerEndTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay + this.prayerMinutesDuration);
        this.afterPrayerAthkarEndTime = new Date(entryDateTime.getTime());
        this.afterPrayerAthkarEndTime.setMinutes(entryDateTime.getMinutes() + this.iqamaMinutesDelay + this.prayerMinutesDuration + this.afterPrayerAthkarMinutesDuration);

    }
    setIqamaTimeout() {
        clearTimeout(this.iqamaTimeoutID);
        clearTimeout(this.iqamaNotificationTimeoutID);
        let now = new Date();
        if (now < this.iqamaTime) {
            let notificationTime = new Date(this.iqamaTime.getTime());
            notificationTime.setSeconds(notificationTime.getSeconds() - Math.min(this.#countdownSeconds, ((this.iqamaTime - now) / 1000)));

            console.log(this.eventName + " iqama " + this.iqamaTime)
            console.log(this.eventName + " iqama notification " + notificationTime);
            this.iqamaNotificationTimeoutID = setTimeout((time, eventName) => {
                messageController.displayNotification(time, eventName);
            }, notificationTime - now, this.iqamaTime, "إقامة " + this.eventName);
        }

    }
    setAthanTimeout() {
        clearTimeout(this.athanTimeoutID);
        clearTimeout(this.athanNotificationTimeoutID);
        let now = new Date();
        if (now < this.athanTime) {
            let notificationTime = new Date(this.athanTime.getTime());
            notificationTime.setSeconds(notificationTime.getSeconds() - Math.min(this.#countdownSeconds, ((this.athanTime - now) / 1000)));

            console.log(this.eventName + " athan " + this.athanTime)
            console.log(this.eventName + " athan notification " + notificationTime);
            this.athanNotificationTimeoutID = setTimeout((time, eventName) => {
                messageController.displayNotification(time, eventName);
                messageController.startAthanMessages();
            }, notificationTime - now, this.athanTime, "أذان " + this.eventName);
        }
    }
    setPrayerEndTimeout() {
        clearTimeout(this.prayerEndTimeoutID);
        let now = new Date();
        if (now < this.prayerEndTime) {

            console.log(this.eventName + " prayer-end " + this.prayerEndTime);
            this.prayerEndTimeoutID = setTimeout(() => {
                messageController.startAfterPrayerMessages();
            }, this.prayerEndTime - new Date());
        }

    }
    setBackToNormalTimeout() {
        clearTimeout(this.backToNormalTimeoutID);
        let now = new Date();
        if (now < this.afterPrayerAthkarEndTime) {

            console.log(this.eventName + " backToNormal " + this.afterPrayerAthkarEndTime);
            this.backToNormalTimeoutID = setTimeout(() => {
                messageController.startMorningEveningMessages();
            }, this.afterPrayerAthkarEndTime - new Date());
        }

    }
    isAthanTime(now) {
        return this.athanTime < now && now < new Date(this.athanTime.getTime()).setMinutes(this.athanTime.getMinutes() + 1);
    }
    isIqamaTime(now) {
        return this.iqamaTime < now && now < new Date(this.iqamaTime.getTime()).setMinutes(this.iqamaTime.getMinutes() + 1);
    }
    isPrayerTime(now) {
        return this.prayerEndTime < now && now < new Date(this.prayerEndTime.getTime()).setMinutes(this.prayerEndTime.getMinutes() + 1);
    }
    isActive(now) {
        return now >= this.athanTime && now <= this.prayerEndTime;
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