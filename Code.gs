function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  
  // ส่งข้อมูลสำคัญไปให้หน้า HTML
  template.mode = e.parameter.mode || 'master';
  template.appUrl = ScriptApp.getService().getUrl(); // ดึง URL จริงของเว็บมาให้เลย
  
  return template.evaluate()
      .setTitle('Badminton Manager 🏸')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function syncSaveState(jsonState) {
  PropertiesService.getScriptProperties().setProperty('LIVE_STATE', jsonState);
}

function syncLoadState() {
  return PropertiesService.getScriptProperties().getProperty('LIVE_STATE');
}

// ==========================================
// 📊 DATABASE CONNECTION (Google Sheets)
// ==========================================
const SHEET_ID = '1arWxAfb6_MJjKmCDQBF5xjwyLOO2dMHRrHP65Oscs1M';

// 1. อัปเดตข้อมูลผู้เล่น (เช็คอัปเดตจาก "ชื่อ" เป็นหลัก)
function syncPlayersToDB(playersJson) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('DB_Players');
    const incomingPlayers = JSON.parse(playersJson);
    if (!incomingPlayers || incomingPlayers.length === 0) return true;

    const lastRow = sheet.getLastRow();
    let existingData = [];
    
    if (lastRow > 1) {
      existingData = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
    }

    // 👇 เปลี่ยนมาใช้ Name เป็น Key แทน ID
    let nameToIndex = {};
    existingData.forEach((row, index) => {
      if (row[1]) {
        // ทำให้เป็นตัวพิมพ์เล็กและตัดช่องว่าง จะได้เทียบเป๊ะๆ
        let cleanName = row[1].toString().trim().toLowerCase();
        nameToIndex[cleanName] = index;
      }
    });

    let newDataToAppend = [];

    incomingPlayers.forEach(p => {
      let incomingName = p.name.toString().trim().toLowerCase();
      const rowData = [
        p.id.toString(), // ID เก็บไว้เป็น Reference เฉยๆ
        p.name,
        p.gender || 'M',
        p.level || 'BG',
        p.mmr || 0,
        p.gamesPlayed || 0,
        p.wins || 0,
        p.checkInTime ? new Date(p.checkInTime) : new Date()
      ];

      // 👇 เช็คว่ามี "ชื่อ" นี้ในระบบหรือยัง
      if (nameToIndex.hasOwnProperty(incomingName)) {
        // คนเก่ามาตีซ้ำ -> อัปเดตข้อมูลทับของเดิม
        existingData[nameToIndex[incomingName]] = rowData;
      } else {
        // คนหน้าใหม่ -> เตรียมต่อท้ายชีท
        newDataToAppend.push(rowData);
        // แอดชื่อเข้า Index ด้วย เผื่อรอบถัดไปส่งชื่อเดิมมาเบิ้ลจะได้ไม่ซ้ำ
        nameToIndex[incomingName] = existingData.length + newDataToAppend.length - 1; 
      }
    });

    // 1. เขียนข้อมูลคนที่อัปเดตกลับลงไป
    if (existingData.length > 0) {
      sheet.getRange(2, 1, existingData.length, 8).setValues(existingData);
    }

    // 2. เติมคนหน้าใหม่ต่อท้ายตาราง
    if (newDataToAppend.length > 0) {
      const startRow = lastRow < 2 ? 2 : lastRow + 1;
      sheet.getRange(startRow, 1, newDataToAppend.length, 8).setValues(newDataToAppend);
    }

    return true;
  } catch (e) {
    console.error("Error in syncPlayersToDB: " + e.message);
    return false;
  }
}

// 2. บันทึกประวัติแมตช์ (เพิ่มแถวใหม่ลงไปเรื่อยๆ)
function appendMatchLogToDB(logJson) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('DB_MatchLogs');
    const log = JSON.parse(logJson);
    
    sheet.appendRow([
      log.logId,
      log.date,
      log.courtName,
      log.winners,
      log.losers,
      log.duration,
      log.rule
    ]);
    return true;
  } catch (e) {
    console.error("Error in appendMatchLogToDB: " + e.message);
    return false;
  }
}

// 3. บันทึกสรุปยอดตอนจบวัน (เพิ่มแถวใหม่)
function appendSessionToDB(sessionJson) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('DB_Session');
    const s = JSON.parse(sessionJson);
    
    sheet.appendRow([
      s.date,
      s.totalPlayers,
      s.totalMatches,
      s.shuttlesUsed,
      s.totalCost
    ]);
    return true;
  } catch (e) {
    console.error("Error in appendSessionToDB: " + e.message);
    return false;
  }
}