function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var body = JSON.parse(e.postData.contents || "{}");

    var row = [
      body.booking_id || "",
      body.created_at || "",
      body.branch || "",
      body.client_name || "",
      body.client_phone || "",
      body.date || "",
      body.time || "",
      JSON.stringify(body.services || []),
      JSON.stringify(body.products || []),
      body.total || "",
      body.status || "",
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
