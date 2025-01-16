const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { google } = require("googleapis");

const { authorize } = require("./auth/auth.js");

const PATH = path.join(process.cwd(), "NOTES");

// Edit folder name
const FOLDER_ID = "1-SazHPtZWFSj-DXn1a4955vzF3c7WLrz";

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
    const media = {
      mimeType: "text/plain",
      body: data.content,
    };

    // create Google Doc with metadata and media
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    // const reqBody = {
    //   requests: [
    //     {
    //       insertText: {
    //         endOfSegmentLocation: {},
    //         text: data.content,
    //       },
    //     },
    //   ],
    // };

    // // write file content to Google Doc
    // await docs.documents.batchUpdate({
    //   documentId: file.data.id,
    //   requestBody: reqBody,
    // });
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

    // create Google Docs concurrently. Promise.all takes an iterable of promises as an input and returns a single Promise
    await Promise.all(
      data.map((item) => createGoogleDoc(FOLDER_ID, item, drive, docs))
    );

    console.log("Done");
  } catch (error) {
    console.error("Error in gdocify:", error);
  }
}

gdocify();
