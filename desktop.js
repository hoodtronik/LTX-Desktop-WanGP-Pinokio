module.exports = {
  daemon: true,
  run: [
    // Step 1: Load saved config (Wan2GP path)
    {
      method: "json.get",
      params: {
        config: "config.json"
      }
    },
    // Step 2: Launch the full Electron desktop app via pnpm dev
    {
      method: "shell.run",
      params: {
        path: "app",
        env: {
          // Set WANGP_ROOT from saved config so Electron passes it to the Python backend
          WANGP_ROOT: "{{local.config && local.config.wangp_root ? local.config.wangp_root : ''}}",
        },
        message: [
          "pnpm dev",
        ],
        on: [{
          // Electron/Vite prints the local dev URL when ready
          event: "/http:\\/\\/[0-9.:]+/",
          done: true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
      }
    }
  ]
}
