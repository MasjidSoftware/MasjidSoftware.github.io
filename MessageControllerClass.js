class MessageController {
    //Arrays of different Messages
    #afterPrayerMessages;
    #morningEveningMessages;
    #athanMessages;
    #currentMessages;
    #currentMessagesIndex = 0;
    #timeoutID;
    #notificationTimeoutID;
    #notificationEndTimeDate;
    #delayPerCharacter = 100; //milliseconds
    constructor(afterPrayerMessages = [], morningEveningMessages = []) {
        this.#afterPrayerMessages = afterPrayerMessages;
        this.#morningEveningMessages = morningEveningMessages;
        this.#athanMessages = athanMessages;
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
        if (this.#currentMessages === undefined || this.#currentMessages[0].type !== this.#morningEveningMessages[0]) {
            clearTimeout(this.timeoutID);
            this.#currentMessages = this.#morningEveningMessages;
            this.#currentMessagesIndex = 0;
            this.#displayMessage();
        }

    }
    startAthanMessages() {
        if (this.#currentMessages === undefined || this.#currentMessages[0].type !== this.#athanMessages[0]) {
            clearTimeout(this.timeoutID);
            this.#currentMessages = this.#athanMessages;
            this.#currentMessagesIndex = 0;
            this.#displayMessage();
        }

    }
    #displayMessage() {
        messageElement.style.animation = "fadeIn 1.6s";
        //wait for fadout

        setTimeout(() => {

            messageElement.innerHTML = messageController.#currentMessages[messageController.#currentMessagesIndex].elements;

            messageElement.style.animation = "fadeIn 1.6s";
            //---------------------------- CHECK

            messageIndexElement = document.getElementById("messageIndex");

            messageIndexElement.innerHTML = EntoAr((messageController.#currentMessagesIndex + 1) + "/" + (messageController.#currentMessages.length));
            //________________________________
            let delay = messageController.#currentMessages[messageController.#currentMessagesIndex].messageCharacters * messageController.#delayPerCharacter;
            messageController.#currentMessagesIndex++;
            if (messageController.#currentMessagesIndex > messageController.#currentMessages.length - 1)
                messageController.#currentMessagesIndex = 0;
            messageController.#timeoutID = setTimeout(messageController.#displayMessage, delay);
        }, 1000);
    }
    displayNotification(endDateTime, text = "NO TEXT") {
        clearInterval(messageController.#notificationTimeoutID);
        messageController.#notificationEndTimeDate = endDateTime;
        notificationElement.innerHTML = text;
        notificationsElement.style.display = "flex";
        prayersElement.style.display = "none";
        messageController.#notificationTimeoutID = setInterval(function () {

            // Get today's date and time
            let now = new Date().getTime();

            // Find the distance between now and the count down date
            let distance = messageController.#notificationEndTimeDate - now;

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
                clearInterval(messageController.#notificationTimeoutID);
                notificationsElement.style.display = "none";
                prayersElement.style.display = "";
            }
        }, 1000);
    }


}