/*  
*   Link: https://shamela.ws/book/96454
*/

var arkanAlsalahMessages = [];
function initializeArkanAlsalahMessagesArray(title = "أركان الصلاة (14)", type = "ArkanAlsalahMessages") {
    arkanAlsalahMessages.push(new ListMessage(title, "", type, ["القيام في الفرض مع القدرة", "تكبيرة الإحرام", "قراءة الفاتحة", "الركوع", "الرفع من الركوع"]));
    arkanAlsalahMessages.push(new ListMessage(title, "", type, ["السجود على الأعضاء السبعة", "الرفع من السجود", "الجلسة بين السجدتين", " الطمأنينة في جميع الأركان", "التشهد الأخير"], 6));
    arkanAlsalahMessages.push(new ListMessage(title, "", type, ["الجلوس للتشهد الأخير", "الصلاة على النبي صلى الله عليه وسلم", "الترتيب بين أركان الصلاة", "التسليمتان"], 11));
}