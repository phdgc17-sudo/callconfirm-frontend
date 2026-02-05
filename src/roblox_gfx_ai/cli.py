import argparse
from pathlib import Path

from roblox_gfx_ai.generator import GenerationRequest, generate_gfx


def _prompt_if_missing(value: str | None, message: str) -> str:
    if value:
        return value
    return input(message).strip()


def _prompt_path(path: str | None, message: str) -> Path:
    while True:
        raw = _prompt_if_missing(path, message)
        candidate = Path(raw).expanduser()
        if candidate.exists():
            return candidate
        print("Path does not exist. Please try again.")
        path = None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a stylized Roblox GFX image.")
    parser.add_argument("--input", help="Path to a reference image.")
    parser.add_argument("--prompt", help="Description of the desired GFX.")
    parser.add_argument("--text", help="Optional overlay text.")
    parser.add_argument("--output", help="Output PNG path.")
    parser.add_argument("--seed", type=int, help="Optional random seed.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    reference_path = _prompt_path(args.input, "Reference image path: ")
    prompt = _prompt_if_missing(args.prompt, "Describe the Roblox GFX you want: ")
    overlay_text = args.text or input("Optional overlay text (press enter to skip): ").strip()
    if overlay_text == "":
        overlay_text = None

    output_path = Path(args.output or "output/roblox_gfx.png")

    request = GenerationRequest(
        reference_path=reference_path,
        prompt=prompt,
        overlay_text=overlay_text,
        output_path=output_path,
        seed=args.seed,
    )
    result = generate_gfx(request)

    print(f"Saved new Roblox GFX to {result.output_path}")


if __name__ == "__main__":
    main()
