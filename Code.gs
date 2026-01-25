function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Badminton Manager V7.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ฟังก์ชันสำหรับดึงไฟล์อื่นมาแปะ
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}