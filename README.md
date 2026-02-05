# Roblox GFX AI (Local Starter)

This repo provides a **local, offline starter app** that generates a **fresh, stylized Roblox GFX image** inspired by a reference photo and a prompt. It **does not reuse the input image**; it only samples colors and then renders a new scene with a blocky avatar, glow, and optional accessories.

> **Note:** This is a local, non-ML placeholder renderer. If you want a true AI model, connect a diffusion model or a hosted image API inside `generator.py` where indicated.

## Features
- Prompts the user for:
  - Example image (for color inspiration)
  - Description / accessories
  - Optional overlay text
- Generates a brand-new 1024x1024 image using a stylized Roblox-like avatar
- Saves a new PNG output

## Quick Start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

roblox-gfx-ai --input path/to/reference.png --prompt "ultra realistic roblox gfx with neon sword" --text "CALLCONFIRM" --output output.png
```

If you omit arguments, the CLI will prompt you interactively.

## Build an EXE (Windows)

```powershell
./scripts/build_exe.ps1
```

Or with the batch file:

```bat
scripts\build_exe.bat
```

Both scripts use `pyinstaller` to create an EXE at `dist/roblox-gfx-ai.exe`.

## Project Structure
- `src/roblox_gfx_ai/cli.py` - CLI entrypoint
- `src/roblox_gfx_ai/generator.py` - Image generation logic
- `scripts/` - EXE build helpers
