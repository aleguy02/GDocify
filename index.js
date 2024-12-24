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

/**
 * Get the folder ID of a GDrive folder. GDrive doesn't enforce unique
 * folder names, so if there are multiple folders with the same name,
 * gets the ID of the most recently modified by user folder by that name.
 * @param {OAuth2Client} authClient An authorized OAuth2 Client
 * @param {string} name The name of the GDrive folder being searched for
 * @returns {Promise<string>} Folder ID
 */
async function getFolderID(authClient, name) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const query = `
    name='${name}' and 
    mimeType='application/vnd.google-apps.folder' and 
    trashed=false
    `;
  const res = await drive.files.list({
    q: query,
    fields: "nextPageToken, files(id, name, modifiedTime)",
    spaces: "drive",
    orderBy: "modifiedByMeTime desc",
  });
  if (!res.data || !res.data.files.length) {
    throw `No such folder: Could not locate '${name}' folder`;
  }

  return res.data.files[0].id;
}

authorize()
  .then((authClient) => getFolderID(authClient, "College Apps"))
  .then((id) => console.log(id))
  .catch(console.error);
