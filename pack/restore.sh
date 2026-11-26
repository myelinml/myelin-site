#!/bin/sh
# Restore official logo PNGs and the download zip from the checked-in pack.
set -eu
cd "$(dirname "$0")/.."
base64 -d pack/myelin-logos.zip.b64 > logos/myelin-logos.zip
python3 - <<'PY'
import zipfile
z = zipfile.ZipFile("logos/myelin-logos.zip")
for info in z.infolist():
    if info.is_dir():
        continue
    if info.filename.startswith("png/") and info.filename.endswith(".png"):
        dest = "logos/" + info.filename.split("/")[-1]
        with z.open(info) as src, open(dest, "wb") as out:
            out.write(src.read())
        print("restored", dest)
print("zip ok logos/myelin-logos.zip")
PY
