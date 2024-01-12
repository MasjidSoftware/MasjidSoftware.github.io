//English to Arabic digits.
function EntoAr(s) {
    return s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
}
var messageTitleElement;
var messageBodyElement;
class Message {
    text;
    title;
    elements;
    footnotes;
    footnotesTitle;
    messageCharacters = 0;
    type;
    constructor(title = "بدون عنوان", text = "الدعاء", footnotes = [], footnotesTitle = "", basmallah = false, taooth = false) {
        this.messageCharacters += title.trim().length + text.trim().length;
        //this.messageCharacters += footnotesTitle.trim().length;
        for (let i = 0; i < footnotes.length; i++) {
            footnotes[i] = EntoAr(footnotes[i].trim()).replaceAll("/", "/&rlm;");
            //this.messageCharacters += footnotes[i].length;
        }
        this.title = title;
        this.text = EntoAr(text).replaceAll("(", "<sup>").replaceAll(")", "</sup>");
        this.footnotesTitle = footnotesTitle;
        this.footnotes = footnotes;

        if (basmallah || taooth) {
            this.text = "<span class='braces'>﴿</span>" + this.text + "<span class='braces'>﴾</span>";
            let startTag = "<div class='quranOpeningContainer'>";
            let endTag = "</div>"
            if (basmallah)
                this.text = startTag + "بسم الله الرحمن الرحيم" + endTag + this.text;
            else if (taooth)
                this.text = startTag + "أعوذ بالله من الشيطان الرجيم" + endTag + this.text;
        }

    }
    createElements(repeat) {
        //let titleStart = "<div class='messageTitleContainer'> <div class='date' id='date'></div><p class='messageTitle'>";
        //let titleEnd = "<span id='messageIndex'> </span></p> <div class='clock' id='clock'></div></div> ";
        //let title = titleStart + this.title + titleEnd;
        let textStart = "<div class='messageText'>";
        let textEnd = "</div>";
        let text = textStart + this.text + textEnd;
        if (repeat != undefined)
            return text + repeat + this.#getFootnoteElements();
        else
            return text + this.#getFootnoteElements();
    }
    #getFootnoteElements() {
        let elements = "";
        if (this.footnotes.length > 0) {
            let startTag = "<div class='messageFootnotesContainer'>";
            if (this.footnotesTitle !== "")
                startTag += "<div class='messageFootnotesTitle'>" + this.footnotesTitle + "</div>";
            startTag += "<ol>";
            let endTag = "</ol></div>";
            let list = "";
            for (let i = 0; i < this.footnotes.length; i++) {
                list += "<li>" + this.footnotes[i] + "</li>";
            }
            elements = startTag + list + endTag;
        }
        return elements;
    }
    getMessageCharacters() {
        return this.messageCharacters;
    }
}

class AfterPrayerMessage extends Message {
    fajr;
    shrooq;
    dhuhr;
    asr;
    maghrib;
    esha;
    constructor(title = "بدون عنوان", text = "الدعاء", fajr = 0, shrooq = 0, dhuhr = 0, asr = 0, maghrib = 0, esha = 0, footnotes = [], footnotesTitle = "", basmallah = false, taooth = false) {
        super(title, text, footnotes, footnotesTitle, basmallah = false, taooth = false);
        this.fajr = fajr;
        this.shrooq = shrooq;
        this.dhuhr = dhuhr;
        this.asr = asr;
        this.maghrib = maghrib;
        this.esha = esha;
        this.createElements();
        this.type = "AfterPrayer";
    }
    createElements() {
        this.elements = super.createElements(this.#getWhenToRepeatElements());

    }
    #getWhenToRepeatElements() {
        let prayerContainer = "";
        let prayerStartTag = "<span class='messageCount'>";
        let prayerEndTag = "</span>";
        if (this.fajr > 0 && this.fajr == this.dhuhr && this.fajr == this.asr && this.fajr === this.maghrib && this.fajr === this.esha) {
            prayerContainer += prayerStartTag + EntoAr("" + this.fajr) + " مرات" + prayerEndTag;
        } else {
            if (this.fajr > 0)
                prayerContainer += prayerStartTag + "الفجر" + ": " + EntoAr("" + this.fajr) + prayerEndTag;
            if (this.shrooq > 0)
                prayerContainer += prayerStartTag + "الشروق" + ": " + EntoAr("" + this.shrooq) + prayerEndTag;
            if (this.dhuhr > 0)
                prayerContainer += prayerStartTag + "الظهر" + ": " + EntoAr("" + this.dhuhr) + prayerEndTag;
            if (this.asr > 0)
                prayerContainer += prayerStartTag + "العصر" + ": " + EntoAr("" + this.asr) + prayerEndTag;
            if (this.maghrib > 0)
                prayerContainer += prayerStartTag + "المغرب" + ": " + EntoAr("" + this.maghrib) + prayerEndTag;
            if (this.esha > 0)
                prayerContainer += prayerStartTag + "العشاء" + ": " + EntoAr("" + this.esha) + prayerEndTag;
        }
        if (prayerContainer !== "")
            prayerContainer = "<div class='messageCountContainer lang='ar'>" + "يكرر " + prayerContainer + "</div>";
        return prayerContainer;
    }

}
class MorningEveningMessage extends Message {
    morning;
    evening;
    day;
    constructor(title = "بدون عنوان", text = "الدعاء", morning = 0, evening = 0, day = 0, footnotes = [], footnotesTitle = "", basmallah = false, taooth = false) {
        super(title, text, footnotes, footnotesTitle, basmallah, taooth);
        this.morning = morning;
        this.evening = evening;
        this.day = day;
        this.createElements();
        this.type = "MorningEvening";
    }
    createElements() {
        this.elements = super.createElements(this.#getWhenToRepeatElements());
    }
    #getWhenToRepeatElements() {
        let prayerContainer = "";
        let prayerStartTag = "<span class='messageCount'>";
        let prayerEndTag = "</span>";
        if (this.day > 0) {
            prayerContainer += prayerStartTag + "اليوم" + ": " + EntoAr("" + this.day) + prayerEndTag;
        } else {
            if (this.morning > 0)
                prayerContainer += prayerStartTag + "الصباح" + ": " + EntoAr("" + this.morning) + prayerEndTag;
            if (this.evening > 0)
                prayerContainer += prayerStartTag + "المساء" + ": " + EntoAr("" + this.evening) + prayerEndTag;
        }
        if (prayerContainer !== "")
            prayerContainer = "<div class='messageCountContainer lang='ar'>" + "يكرر " + prayerContainer + "</div>";
        return prayerContainer;
    }
}
class BasicMessage extends Message {

    constructor(title = "بدون عنوان", text = "الدعاء", type, footnotes = [], footnotesTitle = "", basmallah = false, taooth = false) {
        super(title, text, footnotes, footnotesTitle, basmallah, taooth);
        this.type = type;
        this.createElements();
    }
    createElements() {
        this.elements = super.createElements();
    }

}
class ListMessage extends Message {
    messageList;
    listStartingNum;
    constructor(title = "بدون عنوان", text = "الدعاء", type, messageList = [], listStartingNum = 1, footnotes = [], footnotesTitle = "", basmallah = false, taooth = false) {
        title = EntoAr(title)
        super(title, text, footnotes, footnotesTitle, basmallah, taooth);
        this.type = type;
        this.messageList = messageList;
        this.listStartingNum = listStartingNum;
        this.#setMessageCharacters();
        this.createElements();
    }
    createElements() {
        this.elements = super.createElements(this.#getListElements());
    }
    #getListElements() {
        let elements = "";
        if (this.messageList.length > 0) {
            let startTag = "<ol class='messageOL' start=" + this.listStartingNum + ">";
            let endTag = "</ol>";
            let list = "";
            for (let i = 0; i < this.messageList.length; i++) {
                list += "<li class='messageListItem'>" + this.messageList[i] + "</li>";
            }
            elements = startTag + list + endTag;
        }
        return elements;
    }
    #setMessageCharacters() {
        for (let i = 0; i < this.messageList.length; i++) {
            this.messageCharacters += this.messageList[i].trim().length * 1.7;
        }
    }
}