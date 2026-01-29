function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  template.mode = e.parameter.mode || 'master';
  return template.evaluate()
      .setTitle('Badminton Manager 🏸')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ✨ ต้องมีฟังก์ชันนี้ครับ ไม่งั้นหน้าเว็บขาวจั๊วะ!
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function syncSaveState(jsonState) {
  PropertiesService.getScriptProperties().setProperty('LIVE_STATE', jsonState);
}

function syncLoadState() {
  return PropertiesService.getScriptProperties().getProperty('LIVE_STATE');
}