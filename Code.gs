function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Badminton Manager by Lupang')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ฟังก์ชันสำหรับดึงไฟล์อื่นมาแปะ
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}