import { pkgController } from "/controllers/package/index.js";

const updateMessages = [
  "Checking for system updates...",
  "Downloading package lists...",
  "Calculating upgrade requirements...",
  "Installing security patches...",
  "Updating system packages...",
  "Upgrading core components...",
  "Configuring new packages...",
  "Cleaning up temporary files...",
  "Verifying system integrity...",
  "Updating system services...",
  "Rebuilding package cache...",
  "Running post-install scripts..."
];

export function emitSyntheticSystemProgress() {

  const randomMsg = updateMessages[Math.floor(Math.random() * updateMessages.length)];

  const data = {
    "id": "26db9ffa272e796826d156e593f1f930",
    "error": "",
    "type": "progress",
    "update": {
      "actionID": "26db9ffa272e796826d156e593f1f930",
      "progress": 0,
      "step": "enable",
      "msg": randomMsg,
      "error": false,
      "step_taken": 8015165
    }
  }

  pkgController.ingestProgressUpdate(data);
}