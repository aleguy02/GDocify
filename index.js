const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const { authorize } = require("./auth/auth.js");

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
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
 * Creates a Google Docs file in MyDrive
 * @param {OAuth2Client} authClient An authorized OAuth2 Client
 */
async function createFile(authClient) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const fileMetadata = {
    name: "HelloWorld",
    mimeType: "application/vnd.google-apps.document",
  };
  const file = await drive.files.create({ requestBody: fileMetadata });
}

/**
 * Creates a Google Docs file in target folder
 * @param {OAuth2Client} authClient An authorized OAuth2 Client
 */
async function createFile(authClient) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const fileMetadata = {
    name: "HelloWorld",
    mimeType: "application/vnd.google-apps.document",
  };
  const file = await drive.files.create({ requestBody: fileMetadata });
}

authorize().then(listFiles).catch(console.error);
