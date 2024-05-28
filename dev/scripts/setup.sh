#!/bin/bash

########################
# Script purpose: Streamline local DNS setup to enable a production-like environment for Dogebox and associated 'pups' development and testing.
# Context: In production, dPanel requires pups to operate under distinct subdomains.
# Importance: This distinction is critical for testing cross-site behaviors such as localStorage access, DOM manipulation, and style adjustments, which differ when iframing sites from the same domain versus different domains.
#########################

# Install dev dependencies
echo "# -----------"
echo "# Installing dev dependencies (npm install)"
echo "# -----------"
npm install

# Add required host file entries

## Host entries to add
entries=(
    "127.0.0.1 dogebox.local"
    "127.0.0.1 basic.pup.dogebox.local"
    "127.0.0.1 spa.pup.dogebox.local"
    "127.0.0.1 map.pup.dogebox.local"
    "127.0.0.1 identity.pup.dogebox.local"
)

## Path to the hosts file
hosts_file="/etc/hosts"
development_comment="# DOGEBOX DEVELOPMENT"

## Function to add an entry if it does not exist
add_host_entry() {
    local entry=$1
    # Check if the development comment is already in the file
    if ! grep -qF -- "$development_comment" "$hosts_file"; then
        # Comment not found, add it followed by a newline
        echo "$development_comment" | sudo tee -a "$hosts_file" > /dev/null
    fi
    # Check if the entry is already in the file
    if ! grep -qF -- "$entry" "$hosts_file"; then
        # Entry not found, add it
        echo "$entry" | sudo tee -a "$hosts_file" > /dev/null
        echo "Added entry: $entry"
    else
        echo "Entry already exists: $entry"
    fi
}

## Add the development comment before the loop that adds entries
## This ensures the comment is only added once
if ! grep -qF -- "$development_comment" "$hosts_file"; then
    echo "" | sudo tee -a "$hosts_file" > /dev/null
    echo "$development_comment" | sudo tee -a "$hosts_file" > /dev/null
fi

## Loop through each entry and add it if necessary

echo ""
echo "# -----------"
echo "# Adding host entries (/etc/hosts)"
echo "# -----------"
for entry in "${entries[@]}"; do
    add_host_entry "$entry"
done

echo ""
echo "# Setup complete.  Run \"npm start\""
echo "# -----------"
echo ""