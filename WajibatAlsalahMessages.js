/*  
*   Link: https://shamela.ws/book/96454
*/

var wajibatAlsalahMessages = [];
function initializeWajibatAlsalahMessagesArray(title = "واجبات الصلاة (8)", type = "WajibatAlsalahMessages") {
    wajibatAlsalahMessages.push(new ListMessage(title, "", type, ["جميع التكبيرات غير تكبيرة الإحرام", "قول: سبحان ربي العظيم في الركوع", "قول سمع الله لمن حمده للإمام والمنفرد", "قول ربنا ولك الحمد للكل"]));
    wajibatAlsalahMessages.push(new ListMessage(title, "", type, ["قول: سبحان ربي الأعلى في السجود", "قول رب اغفر لي بين السجدتين", "التشهد الأول", "الجلوس للتشهد الأول"], 5));
}