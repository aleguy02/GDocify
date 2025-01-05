Here's a README file based on your setup instructions:

---

# GDocify

GDocify integrates with the **Google Docs API** and **Google Drive API**, allowing you to convert .txt files into Google Docs and upload them to a folder. The project is designed to be forked and configured by users via the Google Cloud Platform.

---

## Prerequisites

- **Node.js**: Ensure Node.js is installed (tested with npm version 10.8.2).
- **Free Google Cloud Platform Account**: Required for API setup and credential configuration.
<!-- TODO: break this step down so I don't scare people away -->

---

## Setup Instructions

### 1. Fork and Clone the Repository

1. Fork this repository to your GitHub account.
2. Clone the forked repository to your local machine:
   ```bash
   git clone https://github.com/your-username/Gdocify.git
   cd your-forked-repo
   ```

### 2. Install Node.js and npm

Ensure Node.js and npm are installed on your system. To check, run:

```bash
node -v
npm -v
```

If not installed, download and install from [Node.js Official Website](https://nodejs.org).

---

### 3. Set Up Google Cloud Project

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

### 4. Configure OAuth Consent Screen

1. Go to:
   <!-- TODO: insert screenshot here -->
   **Hamburger Menu** → **All Products** → **Management** → **APIs and Services** → **OAuth Consent Screen**.
2. Select **User Type**: **External** → **Create**.
3. Fill out the following:
   - **App Name**: [Your App Name]
   - **Support Email**: [Your Email]
   - **Developer Contact Info**: [Your Contact Email]
4. Click **Save and Continue**.
5. Add the following **Scopes**:
   - `https://www.googleapis.com/auth/documents`
   - `https://www.googleapis.com/auth/drive`
6. Click **Save and Continue**.
7. Under **Test Users**, add your email address.

---

### 5. Configure OAuth Credentials

1. Navigate to:
   <!-- TODO: insert screenshot here -->
   **Hamburger Menu** → **All Products** → **Management** → **APIs and Services** → **Credentials**.
2. Click **+Create Credentials** → **OAuth Client ID**.
3. Select **Application Type**: **Desktop app**.
4. Provide a name (e.g., `[Your App Name] Desktop App`) → **Create**.
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
