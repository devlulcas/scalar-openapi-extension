# Scalar OpenAPI Viewer

A Chrome extension that automatically detects OpenAPI specifications at `/swagger.json` endpoints and renders them using [Scalar's](https://scalar.com) beautiful API reference UI.



## Features

- **Auto-detection**: Automatically checks if you are in a `/swagger.json` or has a `/swagger.json` link in the current website.
- **Beautiful UI**: Uses Scalar's modern API reference interface
- **Minimal dependencies**: Only essential packages included

## Installation

### Via github releases

- Download the latest release from the releases page and extract the zip file.
- Open Chrome and navigate to chrome://extensions/.
- Enable Developer Mode.
- Click on Load unpacked and select the extracted folder.

### Development

1. Install dependencies:

```bash
npm install
```

2. Build the extension:

```bash
npm run build
```

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder


4. For development with auto-rebuild:

```bash
npm run dev
```

## Usage

1. Navigate to any website that has an OpenAPI spec at `/swagger.json` or `/swagger.html`
2. The extension icon will show a green checkmark (✓) if detected or a button "Open in Scalar"
3. Click the extension icon to see the status
4. Click "Open API Reference" to view the full API documentation

## Tech Stack

Typescript, React and CSS Modules (the good and old combo).
For more information check the package.json file.

## Project Structure (the relevant parts)

```
├── public/
│   ├── manifest.json     # Chrome extension manifest
│   └── icons/            # Extension icons
├── src/
│   ├── background.ts     # Service worker
│   ├── content.ts        # Content script
│   ├── popup/            # Popup UI components
│   └── viewer/           # Full-page API reference viewer
├── popup.html            # Popup entry point
└──  viewer.html           # Viewer entry point
```

## License

MIT

> Do whatever you want with it, but contribute back if possible
