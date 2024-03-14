class MessageController {
    //Arrays of different Messages
    afterPrayerMessages;
    morningEveningMessages;
    athanMessages;
    arkanAlsalahMessages;
    wajibatAlsalahMessages;
    mubtilatAlsalahMessages;
    currentMessages;
    currentMessagesIndex = 0;
    timeoutID;
    notificationTimeoutID;
    notificationEndTimeDate;
    notificationRegisteredTimeDate;
    NotificationFadeInTimeoutID;
    NotificationFadeOutTimeoutID;
    delayPerCharacter = 80; //milliseconds
    constructor(afterPrayerMessages = [], morningEveningMessages = [], athanMessages = [], arkanAlsalahMessages = [], wajibatAlsalahMessages = [], mubtilatAlsalahMessages = []) {
        this.afterPrayerMessages = afterPrayerMessages;
        this.morningEveningMessages = morningEveningMessages;
        this.athanMessages = athanMessages;
        this.arkanAlsalahMessages = arkanAlsalahMessages;
        this.wajibatAlsalahMessages = wajibatAlsalahMessages;
        this.mubtilatAlsalahMessages = mubtilatAlsalahMessages;
    }
    startAfterPrayerMessages() {
        if (messageController.currentMessages === undefined || messageController.currentMessages[0].type !== messageController.afterPrayerMessages[0].type) {
            clearTimeout(messageController.timeoutID);
            messageController.currentMessages = messageController.afterPrayerMessages;
            messageController.currentMessagesIndex = 0;
            messageController.displayMessage();
        }
    }
    startMorningEveningMessages() {
        if (messageController.currentMessages === undefined || messageController.currentMessages[0].type !== messageController.morningEveningMessages[0].type) {
            clearTimeout(messageController.timeoutID);
            messageController.currentMessages = messageController.morningEveningMessages;
            messageController.currentMessagesIndex = 0;
            messageController.displayMessage();
        }

    }
    startAthanMessages() {
        if (messageController.currentMessages === undefined || messageController.currentMessages[0].type !== messageController.athanMessages[0].type) {
            clearTimeout(messageController.timeoutID);
            messageController.currentMessages = messageController.athanMessages;
            messageController.currentMessagesIndex = 0;
            messageController.displayMessage();
        }
    }
    startArkanAlsalahMessages() {
        if (messageController.currentMessages === undefined || messageController.currentMessages[0].type !== messageController.arkanAlsalahMessages[0].type) {
            clearTimeout(messageController.timeoutID);
            messageController.currentMessages = messageController.arkanAlsalahMessages;
            messageController.currentMessagesIndex = 0;
            messageController.displayMessage();
        }
    }
    startWajibatAlsalahMessages() {
        if (messageController.currentMessages === undefined || messageController.currentMessages[0].type !== messageController.wajibatAlsalahMessages[0].type) {
            clearTimeout(messageController.timeoutID);
            messageController.currentMessages = messageController.wajibatAlsalahMessages;
            messageController.currentMessagesIndex = 0;
            messageController.displayMessage();
        }
    }
    startMubtilatAlsalahMessages() {
        if (messageController.currentMessages === undefined || messageController.currentMessages[0].type !== messageController.mubtilatAlsalahMessages[0].type) {
            clearTimeout(messageController.timeoutID);
            messageController.currentMessages = messageController.mubtilatAlsalahMessages;
            messageController.currentMessagesIndex = 0;
            messageController.displayMessage();
        }
    }
    startDefaultMessages() {
        messageController.startMorningEveningMessages();
    }
    displayMessage() {
        mainElement.classList.remove("fadeIn");
        mainElement.classList.add("fadeOut");
        //wait for fadout

        clearTimeout(messageController.timeoutID);
        messageBodyElement.innerHTML = messageController.currentMessages[messageController.currentMessagesIndex].elements;

        mainElement.classList.remove("fadeOut");
        mainElement.classList.add("fadeIn");
        //---------------------------- CHECK

        messageTitleElement.innerHTML = messageController.currentMessages[messageController.currentMessagesIndex].title;

        messageIndexElement.innerHTML = EntoAr((messageController.currentMessagesIndex + 1) + " من " + (messageController.currentMessages.length));
        //________________________________

        messageController.nextMessage();
    }
    nextMessage() {
        let delay = messageController.currentMessages[messageController.currentMessagesIndex].messageCharacters * messageController.delayPerCharacter;
        delay = Math.max(delay, 10000);
        messageController.currentMessagesIndex++;
        if (messageController.currentMessagesIndex > messageController.currentMessages.length - 1) {
            if (messageController.currentMessages[0].type === messageController.arkanAlsalahMessages[0].type)
                messageController.timeoutID = setTimeout(messageController.startWajibatAlsalahMessages, delay);
            else if (messageController.currentMessages[0].type === messageController.wajibatAlsalahMessages[0].type)
                messageController.timeoutID = setTimeout(messageController.startMubtilatAlsalahMessages, delay);
            else if (messageController.currentMessages[0].type === messageController.mubtilatAlsalahMessages[0].type)
                messageController.timeoutID = setTimeout(messageController.startArkanAlsalahMessages, delay);
            else {
                messageController.currentMessagesIndex = 0;
                messageController.timeoutID = setTimeout(messageController.displayMessage, delay);
            }
        }
        else {
            messageController.timeoutID = setTimeout(messageController.displayMessage, delay);
        }
    }
    displayNotification(endDateTime, text = "NO TEXT") {
        clearInterval(messageController.notificationTimeoutID);
        messageController.notificationEndTimeDate = endDateTime;
        messageController.notificationRegisteredTimeDate = testDate == undefined ? new Date() : new Date(testDate.getTime());
        notificationElement.innerHTML = text;
        //notificationsElement.style.display = "flex";
        //prayersElement.style.display = "none";
        messageController.notificationTimeoutID = setInterval(function () {

            // Get today's date and time
            let now = new Date().getTime();
            if (testDate != undefined) {
                now = new Date(testDate.getTime());
            }
            // Find the distance between now and the count down date
            let distance = messageController.notificationEndTimeDate - now;
            let totalDistance = messageController.notificationEndTimeDate - messageController.notificationRegisteredTimeDate;
            setProgress(100 - ((distance / totalDistance) * 100));

            // Time calculations for days, hours, minutes and seconds
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            notificationTimerElement.innerHTML = EntoAr((prefixZero(minutes) + ":" + prefixZero(seconds)));

            // If the count down is finished, write some text
            if (distance < 0) {
                notificationTimerElement.innerHTML = "الآن";
            }
            if (distance < -30000) {
                clearInterval(messageController.notificationTimeoutID);

                notificationsElement.classList.remove("fadeIn");
                notificationsElement.classList.add("fadeOut");
                //wait for fadout
                notificationsElement.style.display = "none";
                prayersElement.style.display = "flex";
                clearTimeout(messageController.NotificationFadeInTimeoutID);
                prayersElement.classList.remove("fadeOut");
                prayersElement.classList.add("fadeIn");


            }
        }, 1000);
    }
    displayNotificationAfterFadeout(endDateTime, text = "NO TEXT") {
        clearTimeout(messageController.NotificationFadeInTimeoutID);
        clearTimeout(messageController.NotificationFadeOutTimeoutID);
        prayersElement.classList.remove("fadeIn");
        prayersElement.classList.add("fadeOut");
        //wait for fadout
        prayersElement.style.display = "none";
        notificationsElement.classList.remove("fadeOut");
        notificationsElement.classList.add("fadeIn");
        notificationsElement.style.display = "flex";
        clearTimeout(messageController.NotificationFadeOutTimeoutID);

        messageController.displayNotification(endDateTime, text);
    }
    prayerPause() {
        clearTimeout(messageController.timeoutID);
        mainElement.classList.remove("fadeIn");
        document.body.style.backgroundImage = "url('qr-code.png')"
        //footerElement.classList.remove("fadeIn");
        mainElement.classList.add("fadeOut");
        //footerElement.classList.add("fadeOut");
    }
    prayerUnpause() {
        mainElement.classList.remove("fadeOut");
        document.body.style.backgroundImage = ""
        //footerElement.classList.remove("fadeOut");
        mainElement.classList.add("fadeIn");
        //footerElement.classList.add("fadeIn");
    }


}