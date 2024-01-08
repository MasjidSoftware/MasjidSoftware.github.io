class MessageController {
    //Arrays of different Messages
    #afterPrayerMessages;
    #morningEveningMessages;
    #athanMessages;
    #arkanAlsalahMessages;
    #currentMessages;
    #currentMessagesIndex = 0;
    timeoutID;
    notificationTimeoutID;
    notificationEndTimeDate;
    notificationRegisteredTimeDate;
    #delayPerCharacter = 80; //milliseconds
    constructor(afterPrayerMessages = [], morningEveningMessages = [], athanMessages = [], arkanAlsalahMessages = []) {
        this.#afterPrayerMessages = afterPrayerMessages;
        this.#morningEveningMessages = morningEveningMessages;
        this.#athanMessages = athanMessages;
        this.#arkanAlsalahMessages = arkanAlsalahMessages;
        this.startDefaultMessages();
    }
    startAfterPrayerMessages() {
        if (this.#currentMessages === undefined || this.#currentMessages[0].type !== this.#afterPrayerMessages[0].type) {
            clearTimeout(this.timeoutID);
            this.#currentMessages = this.#afterPrayerMessages;
            this.#currentMessagesIndex = 0;
            this.#displayMessage();
        }
    }
    startMorningEveningMessages() {
        if (this.#currentMessages === undefined || this.#currentMessages[0].type !== this.#morningEveningMessages[0].type) {
            clearTimeout(this.timeoutID);
            this.#currentMessages = this.#morningEveningMessages;
            this.#currentMessagesIndex = 0;
            this.#displayMessage();
        }

    }
    startAthanMessages() {
        if (this.#currentMessages === undefined || this.#currentMessages[0].type !== this.#athanMessages[0].type) {
            clearTimeout(this.timeoutID);
            this.#currentMessages = this.#athanMessages;
            this.#currentMessagesIndex = 0;
            this.#displayMessage();
        }

    }
    startArkanAlsalahMessages() {
        if (this.#currentMessages === undefined || this.#currentMessages[0].type !== this.#arkanAlsalahMessages[0].type) {
            clearTimeout(this.timeoutID);
            this.#currentMessages = this.#arkanAlsalahMessages;
            this.#currentMessagesIndex = 0;
            this.#displayMessage();
        }
    }
    startDefaultMessages() {
        this.startMorningEveningMessages();
    }
    #displayMessage() {
        mainElement.classList.remove("fadeIn");
        mainElement.classList.add("fadeOut");
        //wait for fadout

        this.timeoutID = setTimeout(() => {
            clearTimeout(messageController.timeoutID);
            messageBodyElement.innerHTML = messageController.#currentMessages[messageController.#currentMessagesIndex].elements;

            mainElement.classList.remove("fadeOut");
            mainElement.classList.add("fadeIn");
            //---------------------------- CHECK

            messageTitleElement.innerHTML = messageController.#currentMessages[messageController.#currentMessagesIndex].title;

            messageIndexElement.innerHTML = EntoAr((messageController.#currentMessagesIndex + 1) + " من " + (messageController.#currentMessages.length));
            //________________________________
            let delay = messageController.#currentMessages[messageController.#currentMessagesIndex].messageCharacters * messageController.#delayPerCharacter;
            delay = Math.max(delay, 10000);
            messageController.#currentMessagesIndex++;
            if (messageController.#currentMessagesIndex > messageController.#currentMessages.length - 1)
                messageController.#currentMessagesIndex = 0;
            messageController.timeoutID = setTimeout(messageController.#displayMessage, delay);
        }, 1500);
    }
    displayNotification(endDateTime, text = "NO TEXT") {
        clearInterval(messageController.notificationTimeoutID);
        messageController.notificationEndTimeDate = endDateTime;
        messageController.notificationRegisteredTimeDate = new Date();
        notificationElement.innerHTML = text;
        notificationsElement.style.display = "flex";
        prayersElement.style.display = "none";
        messageController.notificationTimeoutID = setInterval(function () {

            // Get today's date and time
            let now = new Date().getTime();

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
                notificationsElement.style.display = "none";
                prayersElement.style.display = "";
            }
        }, 1000);
    }
    prayerPause() {
        clearTimeout(this.timeoutID);
        mainElement.classList.remove("fadeIn");
        //footerElement.classList.remove("fadeIn");
        mainElement.classList.add("fadeOut");
        //footerElement.classList.add("fadeOut");
    }
    prayerUnpause() {
        mainElement.classList.remove("fadeOut");
        //footerElement.classList.remove("fadeOut");
        mainElement.classList.add("fadeIn");
        //footerElement.classList.add("fadeIn");
    }


}