<!-- TODO: review this and rewrite for accessibility if needed -->
![Socialify image](https://socialify.git.ci/aleguy02/GDocify/image?description=1&language=1&logo=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRNt8D27z6TIINfXpS5f7-_1wp_UVyfmCptTA%26s&name=1&owner=1&stargazers=1&theme=Light)

# GDocify

GDocify integrates with the **Google Docs API** and **Google Drive API**, allowing you to convert .txt files into Google Docs and upload them to a folder. The project is designed to be forked and configured by users via the Google Cloud Platform.

---

## Prerequisites

Ensure you have a stable version of Node.js and Git installed on your system (tested with npm version 10.8.2). Free Google Cloud Platform Account. Required for API setup and credential configuration.
<!-- TODO: break this step down so I don't scare people away -->

---

## Setup Instructions

### 1. Fork the Repository

1. Fork this repository to your GitHub account.
2. Clone the forked repository to your local machine:
   ```bash
   git clone https://github.com/your-username/GDocify.git
   cd GDocify
   ```

---

### 2. Set Up Google Cloud Project

#### a) Create a Google Cloud Project

1. Visit the [Google Cloud Console](https://developers.google.com/workspace/guides/create-project#google-cloud-console).
2. Create a new project.

#### b) Enable APIs

1. Navigate to:
   <!-- TODO: insert screenshot here -->
   **Hamburger Menu** → **All Products** → **Management** → **APIs and Services** → **+Enable APIs and Services**.
2. Search for and enable:
   - **Google Drive API**
   - **Google Docs API**

---

### 3. Configure OAuth Consent Screen

1. Go to:
   <!-- TODO: insert screenshot here -->
   **Hamburger Menu** → **All Products** → **Management** → **APIs and Services** → **OAuth Consent Screen**.
2. Select **User Type**: **External**, then **Create**.
3. Fill out the following:
   - **App Name**: [GDocify]
   - **Support Email**: [Your Email]
   - **Developer Contact Info**: [Your Contact Email]
4. Click **Save and Continue**.
5. Add the following **Scopes**:
   - `https://www.googleapis.com/auth/documents`
   - `https://www.googleapis.com/auth/drive`
6. Click **Save and Continue**.
7. Under **Test Users**, add your email address.

---

### 4. Configure OAuth Credentials

1. Navigate to:
   <!-- TODO: insert screenshot here -->
   **Hamburger Menu** → **All Products** → **Management** → **APIs and Services** → **Credentials**.
2. Click **+Create Credentials** → **OAuth Client ID**.
3. Select **Application Type**: **Desktop app**.
4. Name it `[Your App Name] Desktop App` (e.g. `aleguy02 Desktop App`), then **Create**.
5. Download the JSON file:
   - Rename it to `credentials.json`.
   - Move `credentials.json` into the `config` directory.

---

## Usage Instructions

### Step 1: Update Folder Name

1. Open the `index.js` file.
2. Locate the `FOLDER_NAME` variable and set it to the name of the folder you want to create your files in:

   ```javascript
   const FOLDER_NAME = "YourFolderName";
   ```

   **Note**: Google Drive doesn't enforce unique folder names. If multiple folders share the same name, the script retrieves the folder ID of the most recently modified folder by the user.

---

### Step 2: Set Up NOTES folder

1. Open your `NOTES` folder. Delete `Oh, the Places You'll Go!.txt`.
2. Move or paste all the .txt files you want to upload into the `NOTES` folder

---

### Step 3: Run the Project

1. Open your terminal and navigate to the project's root directory.
2. Run the following command:
   ```bash
   npm run gdocify
   ```

This command executes the script, interacting with the Google Docs and Drive APIs as configured.

---

## Notes

- If the folder name specified in `index.js` does not exist in your Google Drive the script will throw an error.
- Be cautious of quota limits for Google Drive and Docs API usage.

---

## Resources

- [Google Docs API Documentation](https://developers.google.com/docs)
- [Google Drive API Documentation](https://developers.google.com/drive)
- [Node.js Documentation](https://nodejs.org/en/docs)

---
