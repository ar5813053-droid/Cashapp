#!/usr/bin/env python3
from pathlib import Path

p = Path("android/app/build.gradle")
if not p.exists():
    p = Path("android/app/build.gradle.kts")
if not p.exists():
    raise SystemExit("android/app/build.gradle not found")

t = p.read_text()
if "signingConfig signingConfigs.debug" in t or 'signingConfigs.getByName("debug")' in t:
    print("already patched")
elif "release {" in t:
    t = t.replace("release {", "release {\n            signingConfig signingConfigs.debug", 1)
    p.write_text(t)
    print("patched groovy release signing")
elif 'create("release")' in t:
    t = t.replace(
        'create("release") {',
        'create("release") {\n            signingConfig = signingConfigs.getByName("debug")',
        1,
    )
    p.write_text(t)
    print("patched kts release signing")
else:
    print("WARNING: could not find release block")
