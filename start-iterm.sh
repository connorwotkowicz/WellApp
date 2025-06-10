#!/bin/bash
osascript <<EOF
tell application "iTerm"
  activate
  try
    set w to (create window with default profile)
  on error
    set w to current window
  end try
  tell w
    tell current session to write text "cd $(pwd)/server && npm run dev"
    delay 1
    create tab with default profile
    tell current tab to tell current session to write text "cd $(pwd)/client && npm run dev"
  end tell
end tell
EOF
