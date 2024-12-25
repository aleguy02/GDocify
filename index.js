const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { google } = require("googleapis");

const { authorize } = require("./auth/auth.js");

const NOTE_PATH = path.join(process.cwd(), "NOTES", "test.txt");

/**
 * Get the folder ID of a GDrive folder. GDrive doesn't enforce unique
 * folder names, so if there are multiple folders with the same name,
 * gets the ID of the most recently modified by user folder by that name.
 * @param {drive_v3.Drive} drive The Google Drive API client object.
 * @param {string} name The name of the GDrive folder being searched for
 * @returns {Promise<string>} Folder ID
 */
async function getFolderID(drive, name) {
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

async function gdocify() {
  const data = await fs.readFile(NOTE_PATH, "utf-8");
  const authClient = await authorize();

  const drive = google.drive({ version: "v3", auth: authClient });

  const folderId = await getFolderID(drive, "Test");
  const fileMetadata = {
    name: "TestFile",
    mimeType: "application/vnd.google-apps.document",
    parents: [folderId],
  };
  const file = await drive.files.create({
    requestBody: fileMetadata,
    fields: "id",
  });
  console.log("File Id:", file.data.id);
}
gdocify();
