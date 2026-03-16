module.exports = {
  run: [
    // Step 1: Remove broken app/ dir (if exists without package.json) and clone
    {
      method: "shell.run",
      params: {
        message: [
          "{{platform === 'win32' ? 'if exist app rmdir /s /q app' : 'rm -rf app'}}",
          "git clone https://github.com/deepbeepmeep/LTX-Desktop-WanGP.git app",
        ]
      },
      when: "{{!exists('app/package.json')}}"
    },
    // Step 2: Ask user for their Wan2GP location
    {
      method: "input",
      params: {
        title: "Wan2GP Location",
        description: "Select the folder containing your Wan2GP installation (the folder with wgp.py). Leave empty to skip if you don't have Wan2GP installed.",
        form: [{
          key: "wangp_root",
          title: "Wan2GP folder path",
          description: "Example: F:\\pinokio\\api\\wan.git\\app  or  C:\\Wan2GP",
          placeholder: "Paste path to folder containing wgp.py (or leave empty)",
          default: ""
        }]
      }
    },
    // Step 3: Save the Wan2GP path to config.json
    {
      method: "json.set",
      params: {
        "config.json": {
          "wangp_root": "{{input.wangp_root || ''}}"
        }
      }
    },
    // Step 4: Install Python backend dependencies using uv sync
    {
      method: "shell.run",
      params: {
        path: "app/backend",
        message: [
          "uv sync",
        ]
      }
    },
    // Step 5: Install Node.js dependencies for Electron desktop app
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "npm install -g pnpm",
          "pnpm install --ignore-scripts",
          "npx electron-rebuild || echo Electron rebuild skipped",
          "node node_modules/electron/install.js || echo Electron binary already installed",
        ]
      }
    },
    // Step 6: Install Wan2GP requirements into the backend venv (if path was provided)
    {
      when: "{{local.config && local.config.wangp_root}}",
      method: "shell.run",
      params: {
        path: "app/backend",
        message: [
          "uv pip install --python .venv/Scripts/python.exe -r {{local.config.wangp_root}}/requirements.txt"
        ]
      }
    },
    // Step 7: Create the cache directory for standalone backend mode
    {
      method: "shell.run",
      params: {
        message: [
          "{{platform === 'win32' ? 'if not exist cache mkdir cache' : 'mkdir -p cache'}}"
        ]
      }
    },
    {
      method: "input",
      params: {
        title: "Installation completed",
        description: "Click 'Launch Desktop' in the left menu to open the full LTX Desktop app, or 'Start Backend' to run just the API server."
      }
    },
  ]
}
