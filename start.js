module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        path: "app/backend",
        env: {
          // Required: tells the backend where to store models, outputs, settings
          LTX_APP_DATA_DIR: "{{path.resolve(cwd, 'cache')}}",
          // Auto-detect Wan2GP at the sibling pinokio install location
          WANGP_ROOT: "{{exists('../wan.git/app/wgp.py') ? path.resolve(cwd, '..', 'wan.git', 'app') : ''}}",
        },
        message: [
          "{{platform === 'win32' ? '.venv\\\\Scripts\\\\python' : '.venv/bin/python'}} ltx2_server.py",
        ],
        on: [{
          // The backend prints "Server running on http://127.0.0.1:<port>"
          event: "/(http:\\/\\/[0-9.:]+)/",
          done: true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    }
  ]
}
