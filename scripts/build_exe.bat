@echo off
python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt
pip install pyinstaller

pyinstaller --onefile --name roblox-gfx-ai --collect-all roblox_gfx_ai -F -m roblox_gfx_ai.cli
