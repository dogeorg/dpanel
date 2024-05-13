#!/bin/bash

echo "Checking.."

ITALICS="\e[3m"
PINK="\e[38;5;206m"
RESET="\e[0m"

# Host entries we expect to find
expected_entries=(
    "127.0.0.1 dogebox.local"
    "127.0.0.1 basic.pup.dogebox.local"
    "127.0.0.1 spa.pup.dogebox.local"
    "127.0.0.1 map.pup.dogebox.local"
)

# Path to the hosts file
hosts_file="/etc/hosts"

# Initialize a flag to indicate if all entries are found
all_entries_found=true

# Check each expected entry
for entry in "${expected_entries[@]}"; do
    if ! grep -qF -- "$entry" "$hosts_file"; then
        # If an entry is not found, print the message and change the flag
        echo "[Problem] Host entry not found: $expected_entries"
        echo "[Solution] Have you run the setup script? \"npm run setup\""
        all_entries_found=false
        exit 1
    fi
done

# If all entries were found, print the success message
if [ "$all_entries_found" = true ]; then
    echo "(✔) Required host entries found"
fi