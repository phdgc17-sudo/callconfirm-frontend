import random
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple

from PIL import Image, ImageDraw, ImageFilter, ImageFont


Color = Tuple[int, int, int]


@dataclass
class GenerationRequest:
    reference_path: Path
    prompt: str
    overlay_text: str | None
    output_path: Path
    seed: int | None = None


@dataclass
class GenerationResult:
    output_path: Path


def _clamp(value: int) -> int:
    return max(0, min(255, value))


def _adjust(color: Color, amount: int) -> Color:
    return tuple(_clamp(channel + amount) for channel in color)


def _get_palette(image: Image.Image, max_colors: int = 5) -> list[Color]:
    small = image.copy().convert("RGB")
    small.thumbnail((64, 64))
    colors = small.getcolors(64 * 64)
    if not colors:
        return [(40, 40, 60)]
    colors.sort(reverse=True, key=lambda item: item[0])
    palette = [color for _, color in colors[:max_colors]]
    return palette


def _gradient_background(size: int, top: Color, bottom: Color) -> Image.Image:
    base = Image.new("RGB", (size, size), top)
    draw = ImageDraw.Draw(base)
    for y in range(size):
        ratio = y / (size - 1)
        color = tuple(
            int(top[i] + (bottom[i] - top[i]) * ratio) for i in range(3)
        )
        draw.line([(0, y), (size, y)], fill=color)
    return base


def _draw_avatar(draw: ImageDraw.ImageDraw, center: Tuple[int, int], scale: int, colors: list[Color]) -> None:
    head_color = colors[0]
    torso_color = colors[1 % len(colors)]
    limb_color = colors[2 % len(colors)]

    cx, cy = center
    head_size = int(scale * 0.35)
    torso_width = int(scale * 0.55)
    torso_height = int(scale * 0.6)
    limb_width = int(scale * 0.18)
    limb_height = int(scale * 0.55)

    head_box = [
        cx - head_size // 2,
        cy - torso_height // 2 - head_size,
        cx + head_size // 2,
        cy - torso_height // 2,
    ]
    draw.rounded_rectangle(head_box, radius=12, fill=head_color)

    torso_box = [
        cx - torso_width // 2,
        cy - torso_height // 2,
        cx + torso_width // 2,
        cy + torso_height // 2,
    ]
    draw.rounded_rectangle(torso_box, radius=16, fill=torso_color)

    left_arm = [
        cx - torso_width // 2 - limb_width,
        cy - torso_height // 2 + 12,
        cx - torso_width // 2,
        cy - torso_height // 2 + limb_height,
    ]
    right_arm = [
        cx + torso_width // 2,
        cy - torso_height // 2 + 12,
        cx + torso_width // 2 + limb_width,
        cy - torso_height // 2 + limb_height,
    ]
    draw.rounded_rectangle(left_arm, radius=10, fill=limb_color)
    draw.rounded_rectangle(right_arm, radius=10, fill=limb_color)

    left_leg = [
        cx - limb_width - 10,
        cy + torso_height // 2 - 6,
        cx - 10,
        cy + torso_height // 2 + limb_height,
    ]
    right_leg = [
        cx + 10,
        cy + torso_height // 2 - 6,
        cx + limb_width + 10,
        cy + torso_height // 2 + limb_height,
    ]
    draw.rounded_rectangle(left_leg, radius=10, fill=limb_color)
    draw.rounded_rectangle(right_leg, radius=10, fill=limb_color)


def _draw_accessories(draw: ImageDraw.ImageDraw, center: Tuple[int, int], prompt: str, colors: list[Color]) -> None:
    prompt_lower = prompt.lower()
    cx, cy = center
    if "sword" in prompt_lower:
        blade = [(cx + 160, cy - 40), (cx + 340, cy - 10), (cx + 330, cy + 20), (cx + 150, cy - 10)]
        draw.polygon(blade, fill=_adjust(colors[0], 80))
        draw.rectangle([cx + 130, cy - 20, cx + 160, cy + 20], fill=_adjust(colors[2 % len(colors)], -30))
    if "hat" in prompt_lower or "crown" in prompt_lower:
        draw.rectangle([cx - 70, cy - 240, cx + 70, cy - 210], fill=_adjust(colors[1 % len(colors)], 40))
        draw.polygon(
            [(cx - 70, cy - 210), (cx - 20, cy - 260), (cx + 30, cy - 210), (cx + 70, cy - 250), (cx + 70, cy - 210)],
            fill=_adjust(colors[0], 60),
        )
    if "wings" in prompt_lower:
        left = [(cx - 200, cy - 20), (cx - 350, cy - 100), (cx - 320, cy + 60)]
        right = [(cx + 200, cy - 20), (cx + 350, cy - 100), (cx + 320, cy + 60)]
        draw.polygon(left, fill=_adjust(colors[3 % len(colors)], 30))
        draw.polygon(right, fill=_adjust(colors[3 % len(colors)], 30))


def _draw_text(base: Image.Image, text: str, colors: list[Color]) -> None:
    draw = ImageDraw.Draw(base)
    try:
        font = ImageFont.truetype("arial.ttf", 80)
    except OSError:
        font = ImageFont.load_default()
    width, height = base.size
    text_width, text_height = draw.textsize(text, font=font)
    position = ((width - text_width) // 2, height - text_height - 80)
    shadow_pos = (position[0] + 4, position[1] + 4)
    draw.text(shadow_pos, text, font=font, fill=_adjust(colors[0], -80))
    draw.text(position, text, font=font, fill=_adjust(colors[0], 80))


def generate_gfx(request: GenerationRequest) -> GenerationResult:
    if request.seed is not None:
        random.seed(request.seed)

    reference = Image.open(request.reference_path)
    palette = _get_palette(reference)

    canvas_size = 1024
    top = _adjust(palette[0], 30)
    bottom = _adjust(palette[-1], -40)
    base = _gradient_background(canvas_size, top, bottom)
    glow = base.copy().filter(ImageFilter.GaussianBlur(radius=18))
    base = Image.blend(base, glow, alpha=0.35)

    draw = ImageDraw.Draw(base)
    center = (canvas_size // 2, canvas_size // 2 - 40)
    _draw_avatar(draw, center=center, scale=420, colors=palette)
    _draw_accessories(draw, center=center, prompt=request.prompt, colors=palette)

    if request.overlay_text:
        _draw_text(base, request.overlay_text, palette)

    request.output_path.parent.mkdir(parents=True, exist_ok=True)
    base.save(request.output_path, format="PNG")
    return GenerationResult(output_path=request.output_path)
