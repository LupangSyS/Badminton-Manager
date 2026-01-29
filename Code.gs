function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  template.mode = e.parameter.mode || 'master';
  return template.evaluate()
      .setTitle('Badminton Manager 🏸')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ✨👇 ฟังก์ชันนี้แหละที่หายไป! ต้องมีนะ ไม่งั้นหน้าขาว! 👇✨
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function syncSaveState(jsonState) {
  PropertiesService.getScriptProperties().setProperty('LIVE_STATE', jsonState);
}

function syncLoadState() {
  return PropertiesService.getScriptProperties().getProperty('LIVE_STATE');
}