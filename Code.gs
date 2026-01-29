function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  template.mode = e.parameter.mode || 'master'; 
  return template.evaluate()
      .setTitle('Badminton Manager 🏸')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ✨ จำเลยที่ 1: ต้องมีฟังก์ชันนี้ ไม่งั้นหน้าเว็บพัง!
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function syncSaveState(jsonState) {
  // Save ลง Property (รับได้ประมาณ 9KB - 100KB ถ้าข้อมูลเยอะอาจต้องตัด Log ออก)
  PropertiesService.getScriptProperties().setProperty('LIVE_STATE', jsonState);
}

function syncLoadState() {
  return PropertiesService.getScriptProperties().getProperty('LIVE_STATE');
}