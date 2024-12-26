const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { google } = require("googleapis");

const { authorize } = require("./auth/auth.js");

const PATH = path.join(process.cwd(), "NOTES");
const FOLDER_NAME = "Test";

/**
 * Get filenames and content of all .txt files in the specified directory.
 * @returns {Promise<Array<{name: string, content: string}>>} A promise that resolves to an array of objects, each containing the name and content of a .txt file.
 */
async function extractFileData() {
  try {
    const res = new Array(0);
    const files = await fs.readdir(PATH);

    // create an array of filenames of all .txt files in NOTES folder
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    // create an { name: str, content: str } object for each filename and push to res
    for (const filename of txtFiles) {
      const name = filename.slice(0, -4);

      // extract file content
      const filepath = path.join(PATH, filename);
      const content = await fs.readFile(filepath, "utf-8");

      res.push({ name: name, content: content });
    }

    return res;
  } catch (err) {
    console.error("Error extracting file data:", error);
    throw error;
  }
}

/**
 * Get the folder ID of a GDrive folder. GDrive doesn't enforce unique
 * folder names, so if there are multiple folders with the same name,
 * gets the ID of the most recently modified by user folder by that name.
 * @param {object} drive The Google Drive API client object.
 * @param {string} name The name of the GDrive folder being searched for
 * @returns {Promise<string>} A promise that resolves to a string containing the folder ID of the folder by that name
 */
async function getFolderId(drive, name) {
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
 * @param {Array<{name: string, content: string}>} data An array of objects, each containing the name and content of a .txt file.
 * @param {object} drive The Google Drive API client object.
 * @param {object} docs The Google Docs API client object.
 * @returns {Promise<void>}
 */
async function createGoogleDoc(folderId, data, drive, docs) {
  try {
    const fileMetadata = {
      name: data.name,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    };

    // create Google Doc with metadata only
    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });

    const reqBody = {
      requests: [
        {
          insertText: {
            endOfSegmentLocation: {},
            text: data.content,
          },
        },
      ],
    };

    // write file content to Google Doc
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
    // extract file data
    const data = await extractFileData();

    // authorize the client
    const authClient = await authorize();

    // initialize Google Drive and Docs API clients
    const drive = google.drive({ version: "v3", auth: authClient });
    const docs = google.docs({ version: "v1", auth: authClient });

    // get the folder ID where the documents will be stored
    const folderId = await getFolderId(drive, FOLDER_NAME);

    // create Google Docs concurrently. Promise.all takes an iterable of promises as an input and returns a single Promise
    await Promise.all(
      data.map((item) => createGoogleDoc(folderId, item, drive, docs))
    );

    console.log("Done");
  } catch (error) {
    console.error("Error in gdocify:", error);
  }
}

gdocify();
