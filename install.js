module.exports = {
  run: [
    // Step 1: Clone the repo if not already cloned
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/deepbeepmeep/LTX-Desktop-WanGP.git app",
        ]
      },
      when: "{{!exists('app')}}"
    },
    // Step 2: Install Python backend dependencies using uv sync
    // This creates/uses a .venv inside app/backend with all required packages
    // (torch cu128, fastapi, diffusers, ltx-core, ltx-pipelines, etc.)
    {
      method: "shell.run",
      params: {
        path: "app/backend",
        message: [
          "uv sync",
        ]
      }
    },
    // Step 3: Install Wan2GP requirements into the backend venv (if Wan2GP exists)
    {
      when: "{{exists('../wan.git/app/wgp.py')}}",
      method: "shell.run",
      params: {
        path: "app/backend",
        message: [
          "uv pip install --python .venv/Scripts/python.exe -r {{path.resolve(cwd, '..', 'wan.git', 'app', 'requirements.txt')}}"
        ]
      }
    },
    // Step 4: Create the app data / cache directory
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
        description: "Click 'Start' in the left menu to launch the LTX Desktop backend server."
      }
    },
  ]
}
