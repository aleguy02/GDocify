const { google } = require("googleapis");

const { authorize } = require("./auth/auth.js");

/**
 * Lists the names and IDs of up to 10 folders
 * @param {OAuth2Client} authClient An authorized OAuth2 Client
 */
async function listFolders(authClient) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder'",
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log("No files found.");
    return;
  }

  console.log("Files:");
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
}

authorize().then(listFolders).catch(console.error);
