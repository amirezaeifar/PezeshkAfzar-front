from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tmp" / "image-recovery"
OUTPUT = ROOT / "public" / "images" / "life-in-motion"


def cover(image, size, focal=(0.5, 0.5)):
    width, height = size
    scale = max(width / image.width, height / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = round((resized.width - width) * focal[0])
    top = round((resized.height - height) * focal[1])
    left = min(max(left, 0), resized.width - width)
    top = min(max(top, 0), resized.height - height)
    return resized.crop((left, top, left + width, top + height))


def process(source_name, output_name, size, focal=(0.5, 0.5), quality=82):
    with Image.open(SOURCE / source_name) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image = cover(image, size, focal)
        image = ImageEnhance.Contrast(image).enhance(1.03)
        image = ImageEnhance.Color(image).enhance(0.98)
        image.save(
            OUTPUT / output_name,
            "WEBP",
            quality=quality,
            method=6,
        )

    print(f"{output_name}: {size[0]}x{size[1]}")


OUTPUT.mkdir(parents=True, exist_ok=True)

# Unsplash photo-1683727027478-5df5f0c89d27: natural glucose self-care.
process(
    "equip-photo-1683727027478-5df5f0c89d27.jpg",
    "glucose-self-care-640.webp",
    (640, 800),
    focal=(0.55, 0.48),
    quality=81,
)
process(
    "equip-photo-1683727027478-5df5f0c89d27.jpg",
    "glucose-self-care-960.webp",
    (960, 1200),
    focal=(0.55, 0.48),
    quality=82,
)

# Pexels 9951397: a dental professional demonstrating a care model.
process(
    "equip-pexels-9951397.jpg",
    "clinical-workflow-640.webp",
    (640, 720),
    focal=(0.41, 0.5),
    quality=81,
)
process(
    "equip-pexels-9951397.jpg",
    "clinical-workflow-960.webp",
    (960, 1080),
    focal=(0.41, 0.5),
    quality=82,
)

# Pexels 6627665: sterile packs inside a clinical autoclave.
process(
    "equip-pexels-6627665.jpg",
    "sterile-production-640.webp",
    (640, 800),
    focal=(0.5, 0.46),
    quality=81,
)
process(
    "equip-pexels-6627665.jpg",
    "sterile-production-960.webp",
    (960, 1200),
    focal=(0.5, 0.46),
    quality=82,
)

# Pexels 9259926: close detail of a calibrated technical process.
process(
    "equip-pexels-9259926.jpg",
    "precision-process-480.webp",
    (480, 600),
    focal=(0.52, 0.54),
    quality=80,
)
