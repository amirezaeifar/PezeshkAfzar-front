# Local image inventory

All photography used by the website is stored in `public/images/`. The application does not load remote images at runtime. Final JPEGs are resized, optimized, and saved as progressive images; original working downloads remain in `tmp/image-recovery/`.

## Restored original company photography

These six files reproduce the source photographs used by the original committed home page. They were downloaded locally from the exact original Unsplash sources.

- `company/hero-sunrise.jpg` — Unsplash source ID `photo-1508672019048-805c876b67e2`
- `company/life-walk.jpg` — Unsplash source ID `photo-1476480862126-209bfaa8edc8`
- `company/friends-laughing.jpg` — Unsplash source ID `photo-1529156069898-49953e39b3ac`
- `company/sunset-movement.jpg` — Unsplash source ID `photo-1544367567-0f2fcb009e0b`
- `company/family-sunlight.jpg` — Unsplash source ID `photo-1531538606174-0f90ff5dce83`
- `company/care-partner.jpg` — Unsplash source ID `photo-1506126613408-eca07ce68773`

## Testimonial photography

The five testimonial images are curated real lifestyle photographs from the project's downloaded source archive. They show authentic care, family, friendship, and recovery moments in warm light.

- `testimonials/nurse-patient.jpg`
- `testimonials/diverse-friends.jpg`
- `testimonials/mother-baby.jpg`
- `testimonials/mother-baby-mobile.jpg`
- `testimonials/family-sunset.jpg`
- `testimonials/family-sunset-mobile.jpg`
- `testimonials/friends-sunset.jpg`

Only the bottom-left responsive pair was changed in the latest refinement. `family-sunset.jpg` and `family-sunset-mobile.jpg` are cropped from [Happy family enjoys time together in a field](https://commons.wikimedia.org/wiki/File:Happy_family_enjoys_time_together_in_a_field.jpg), a real golden-hour photograph by Shixart1985 licensed CC BY 2.0. The reproducible crops are recorded in `tmp/replace_bottom_left_testimonial.py`: 1440 × 1200 for the desktop card and 1800 × 1200 for the mobile card.

## Medical equipment photography

The active equipment galleries use real Pexels/Unsplash product and care photography. Source downloads are retained locally and the reproducible output mapping is recorded in `tmp/process_selected_images.py`.

- `equipment/desktop-autoclave-hero.jpg` — Pexels photo `8413159`
- `equipment/desktop-autoclave-chamber.jpg` — Pexels photo `9951400`
- `equipment/desktop-autoclave-clinic.jpg` — Pexels photo `6627664`
- `equipment/hospital-autoclave-hero.jpg` — Pexels photo `8940466`
- `equipment/industrial-hospital-autoclave-hero.jpg` — [Celitron Azteca A large steam sterilizer](https://celitron.com/en/autoclave-machine-steam-sterilizer-hospital), reference photo `148`
- `equipment/industrial-autoclave-room.jpg` — [Celitron Azteca A large steam sterilizer](https://celitron.com/en/autoclave-machine-steam-sterilizer-hospital), reference photo `142`
- `equipment/industrial-autoclave-controls.jpg` — [Celitron Azteca A large steam sterilizer](https://celitron.com/en/autoclave-machine-steam-sterilizer-hospital), reference photo `97`
- `equipment/hospital-autoclave-room.jpg` — Pexels photo `9951393`
- `equipment/hospital-autoclave-loading.jpg` — Pexels photo `8940466`
- `equipment/glucose-meter-hero.jpg` — Pexels photo `17043389`
- `equipment/glucose-meter-use.jpg` — Unsplash source ID `photo-1684156486280-ff59f07fc5bb`
- `equipment/glucose-meter-kit.jpg` — Pexels photo `17043389`
- `equipment/glucose-strips-hero.jpg` — Pexels photo `17071587`
- `equipment/glucose-strips-pack.jpg` — Pexels photo `17071590`
- `equipment/glucose-strips-meter.jpg` — Pexels photo `33200678`

## Life in Motion photography

The Life in Motion page uses dedicated responsive WebP derivatives in `life-in-motion/`. The selected originals are retained in `tmp/image-recovery/`, and `tmp/process_life_in_motion_images.py` records every crop, output dimension, and compression setting.

- `life-in-motion/glucose-self-care-640.webp` and `life-in-motion/glucose-self-care-960.webp` — Unsplash source ID `photo-1683727027478-5df5f0c89d27`
- `life-in-motion/clinical-workflow-640.webp` and `life-in-motion/clinical-workflow-960.webp` — Pexels photo `9951397`
- `life-in-motion/sterile-production-640.webp` and `life-in-motion/sterile-production-960.webp` — Pexels photo `6627665`
- `life-in-motion/precision-process-480.webp` — Pexels photo `9259926`

The Unsplash source is used under the [Unsplash License](https://unsplash.com/license). The Pexels sources are used under the [Pexels License](https://www.pexels.com/license/). All files are served locally; these links document provenance and are not runtime dependencies.

## Software product photography

All 18 active software-gallery images are unique real landscape photographs sourced from Wikimedia Commons. The six calm hero images shared by Home and What We Make are processed through `tmp/process_minimal_software_heroes.py`; the supporting gallery images remain reproducible through `tmp/process_nature_photography.py`. No software image contains people or medical equipment. The source-to-output mapping is:

- `todays-mom-hero.jpg` — `Sunrise over lake, misty morning.jpg` by PuellaMarina (CC BY-SA 4.0)
- `todays-mom-family.jpg` — `Mount Fuji at sunset, March 2025.jpg`
- `todays-mom-care.jpg` — `Malta Gozo, Azure Window (10264176345).jpg`
- `skinapp-hero.jpg` — `A Calm Water Body.jpg` by Ibrahim Achiri (CC BY-SA 4.0)
- `skinapp-scan.jpg` — `Lake Tahoe at morning - 7-2023.jpg`
- `skinapp-review.jpg` — `Aletschgletscher mit Pinus cembra2.jpg`
- `ibd-care-hero.jpg` — `Misty Forest (127490629).jpeg` by Alberto Restifo (CC BY 3.0)
- `ibd-care-lifestyle.jpg` — `Lac de Veret (4).jpg`
- `ibd-care-clinic.jpg` — `Lac de Vernant (15).jpg`
- `agingdrug-hero.jpg` — `Mountain Fog (12348241575).jpg` by Shenandoah National Park (CC BY 2.0 / US NPS public domain)
- `agingdrug-pharmacy.jpg` — `Fronalpstock_big.jpg`
- `agingdrug-review.jpg` — `Langkofel - Puez - Sella - 02.jpg`
- `chemotherapy-care-hero.jpg` — `Lake Sylvester during the sunrise, Kahurangi, New Zealand.jpg` by Michal Klajban (CC BY-SA 4.0)
- `chemotherapy-care-oncology.jpg` — `Mosi-oa-Tunya, Livingstone (20260519-P1075700).jpg`
- `chemotherapy-care-planning.jpg` — `Mountain landscape (6036144711).jpg`
- `gib-hero.jpg` — `Rolling green hills.jpg` by Jon “ShakataGaNai” Davis (CC BY-SA 3.0)
- `gib-telecare.jpg` — `A waterfall in forest.jpg`
- `gib-nursing.jpg` — `Llano de Ucanca panorama.jpg`

## Refinement outputs

`tmp/refine_product_photography.py` records the earlier equipment output mapping. The current equipment files remain untouched. Home and What We Make now both read the same `product.image` value, so every product has one consistent visual identity.
