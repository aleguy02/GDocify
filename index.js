const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { google } = require("googleapis");

const { authorize } = require("./auth/auth.js");

const NOTE_PATH = path.join(process.cwd(), "NOTES", "test.txt");
const FOLDER_NAME = "Test";

/**
 * Get the folder ID of a GDrive folder. GDrive doesn't enforce unique
 * folder names, so if there are multiple folders with the same name,
 * gets the ID of the most recently modified by user folder by that name.
 * @param {object} drive The Google Drive API client object.
 * @param {string} name The name of the GDrive folder being searched for
 * @returns {Promise<string>} Folder ID
 */
async function getFolderID(drive, name) {
  try {
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
      throw new Error(`No such folder: Could not locate '${name}' folder`);
    }

    return res.data.files[0].id;
  } catch (error) {
    console.error("Error getting folder ID:", error);
    throw error;
  }
}

/**
 * Create a new Google Doc with the specified content in the specified folder.
 * @param {string} folderId The ID of the folder where the new document will be created.
 * @param {string} content The content to be inserted into the new document.
 * @param {object} drive The Google Drive API client object.
 * @param {object} docs The Google Docs API client object.
 * @returns {Promise<void>}
 */
async function createGoogleDoc(folderId, content, drive, docs) {
  try {
    const fileMetadata = {
      name: "Ozymandias",
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    };
    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });
    const reqBody = {
      requests: [
        {
          insertText: {
            endOfSegmentLocation: {},
            text: content,
          },
        },
      ],
    };
    await docs.documents.batchUpdate({
      documentId: file.data.id,
      requestBody: reqBody,
    });
  } catch (error) {
    console.error("Error creating Google Doc:", error);
    throw error;
  }
}

/**
 * Gdocify
 */
async function gdocify() {
  try {
    const data = await fs.readFile(NOTE_PATH, "utf-8");
    const authClient = await authorize();

    const drive = google.drive({ version: "v3", auth: authClient });
    const docs = google.docs({ version: "v1", auth: authClient });

    const folderId = await getFolderID(drive, FOLDER_NAME);
    await createGoogleDoc(folderId, data, drive, docs);

    console.log("Done");
  } catch (error) {
    console.error("Error in gdocify:", error);
  }
}

gdocify();
