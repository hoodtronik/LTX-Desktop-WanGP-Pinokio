module.exports = {
  daemon: true,
  run: [
    // Step 0: Clear any stale url from previous runs
    {
      method: "local.set",
      params: {
        url: null
      }
    },
    // Step 1: Load saved config (Wan2GP path)
    {
      method: "json.get",
      params: {
        config: "config.json"
      }
    },
    // Step 2: Launch the Python FastAPI backend server
    {
      method: "shell.run",
      params: {
        path: "app/backend",
        env: {
          // Required: tells the backend where to store models, outputs, settings
          LTX_APP_DATA_DIR: "{{path.resolve(cwd, 'cache')}}",
          // Read WANGP_ROOT from saved config
          WANGP_ROOT: "{{local.config && local.config.wangp_root ? local.config.wangp_root : ''}}",
        },
        message: [
          "{{platform === 'win32' ? '.venv\\\\Scripts\\\\python' : '.venv/bin/python'}} ltx2_server.py",
        ],
        on: [{
          // The backend prints "Server running on http://127.0.0.1:<port>"
          event: "/http:\\/\\/[0-9.:]+/",
          done: true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input && input.event ? input.event[0] : null}}"
      }
    }
  ]
}
