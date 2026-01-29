function doGet(e) {
  // รับค่าพารามิเตอร์ ?mode=viewer จาก URL
  var template = HtmlService.createTemplateFromFile('index');
  template.mode = e.parameter.mode || 'master'; // ถ้าไม่มีให้เป็น master
  return template.evaluate()
      .setTitle('Badminton Manager 🏸')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ฟังก์ชันฝากข้อมูล (iPad เรียกใช้)
function syncSaveState(jsonState) {
  PropertiesService.getScriptProperties().setProperty('LIVE_STATE', jsonState);
}

// ฟังก์ชันดึงข้อมูล (มือถือเพื่อนเรียกใช้)
function syncLoadState() {
  return PropertiesService.getScriptProperties().getProperty('LIVE_STATE');
}