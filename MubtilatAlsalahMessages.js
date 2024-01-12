/*  
*   Link: https://shamela.ws/book/96454
*/
var mubtilatAlsalahMessages = [];
function initializeMubtilatAlsalahMessagesArray(title = "مبطلات الصلاة (8)", type = "MubtilatAlsalahMessages") {
    mubtilatAlsalahMessages.push(new ListMessage(title, "", type, ["الكلام العمد مع الذكر", "الضحك", "الأكل", "الشرب"]));
    mubtilatAlsalahMessages.push(new ListMessage(title, "", type, ["انكشاف العورة عمدا", "الانحراف الكثير عن جهة القبلة", "العبث الكثير المتوالي لغير ضرورة", "انتقاض الطهارة"], 5));
}