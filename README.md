<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1MhLspVYQcfXbWKW5dgHrmEpZDksebFCF

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env` file and set the `GEMINI_API_KEY` to your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   (You can use `.env.example` as a template)
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Steps:

1. **Configure GitHub Pages:**
   - Go to your repository's Settings → Pages
   - Under "Build and deployment", select **"GitHub Actions"** as the source

2. **Add API Key Secret:**
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key from https://aistudio.google.com/app/apikey

3. **Deploy:**
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy your site
   - Your site will be available at: `https://[username].github.io/Yuzuki-s-Portfolio/`

### Manual Build:

To build locally:
```bash
npm run build
npm run preview
```
