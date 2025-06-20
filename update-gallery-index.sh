#!/bin/bash

# Script to update gallery index.json with all .jpg files in the gallery directory
# Usage: ./update-gallery-index.sh

cd "$(dirname "$0")"

echo "Updating gallery index..."

# Generate JSON array of all .jpg files
files=(i/gallery/*.jpg)
printf '[\n' > i/gallery/index.json
for i in "${!files[@]}"; do
  if [ -f "${files[$i]}" ]; then
    filename=$(basename "${files[$i]}")
    if [ $i -eq 0 ]; then
      printf '  "%s"' "$filename" >> i/gallery/index.json
    else
      printf ',\n  "%s"' "$filename" >> i/gallery/index.json
    fi
  fi
done
printf '\n]\n' >> i/gallery/index.json

echo "Gallery index updated with $(grep -c '\.jpg' i/gallery/index.json) images"
cat i/gallery/index.json
