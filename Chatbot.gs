const CHANNEL_ACCESS_TOKEN = '';


function doPost(e) {
  try {
    const json = JSON.parse(e.postData.contents);
    const replyToken = json.events[0].replyToken;
    const userMessage = json.events[0].message.text;

    const answer = findAnswer(userMessage);
    replyToUser(replyToken, answer);
  } catch (err) {
    Logger.log("ERROR: " + err);
  }

  return ContentService.createTextOutput(answer);
}

function findAnswer(msg) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ชีต1");
  const data = sheet.getDataRange().getValues();
  Logger.log(JSON.stringify(data)); // ตรวจสอบว่าอ่านข้อมูลมาได้

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toLowerCase().trim() === msg.toLowerCase().trim()) {
      return data[i][1];
    }
  }
  return "ขออภัย ไม่พบข้อมูลใน FAQ ค่ะ"; // ตอบแบบชัดๆ
}



function replyToUser(replyToken, text) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const payload = JSON.stringify({
    replyToken: replyToken,
    messages: [{ type: 'text', text: text }]
  });

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: payload
  };

  UrlFetchApp.fetch(url, options);
}
