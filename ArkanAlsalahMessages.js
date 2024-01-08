/*  
*   Link: https://shamela.ws/book/96454
*/
type = "ArkanAlsalahMessages";
let title = "أركان الصلاة (14)";
var arkanAlsalahMessages = [];
function initializeArkanAlsalahMessagesArray() {
    arkanAlsalahMessages.push(new ListMessage(title, "", type, ["القيام في الفرض مع القدرة", "تكبيرة الإحرام", "قراءة الفاتحة", "الركوع", "الرفع من الركوع"]));
    arkanAlsalahMessages.push(new ListMessage(title, "", type, ["السجود على الأعضاء السبعة", "الرفع من السجود", "الجلسة بين السجدتين", " الطمأنينة في جميع الأركان", "التشهد الأخير"], 6));
    arkanAlsalahMessages.push(new ListMessage(title, "", type, ["الصلاة على النبي صلى الله عليه وسلم", "الترتيب بين أركان الصلاة", "التسليمتان"], 11));
}