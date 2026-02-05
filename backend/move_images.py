
import shutil
import os

source_dir = r"C:/Users/pedro/.gemini/antigravity/brain/48a6379b-9338-48ef-888a-5abe0b86f8f5"
dest_dir = r"c:/Users/pedro/Downloads/App orações católicas/frontend/public/img/modules"

# Ensure dest dir exists
os.makedirs(dest_dir, exist_ok=True)

mapping = {
    "mod_1_1770144671816.png": "mod_1.png",
    "mod_2_1770144687794.png": "mod_2.png",
    "mod_3_1770144703864.png": "mod_3.png",
    "mod_4_1770144717691.png": "mod_4.png",
    "mod_5_1770144732219.png": "mod_5.png",
    "mod_6_1770144770485.png": "mod_6.png",
    "mod_7_1770144785952.png": "mod_7.png",
    "mod_8_1770144801190.png": "mod_8.png",
    "mod_9_1770144815467.png": "mod_9.png",
    "mod_10_1770144829363.png": "mod_10.png",
    "mod_11_1770144864700.png": "mod_11.png",
    "mod_12_1770144878321.png": "mod_12.png",
    "mod_13_1770144891699.png": "mod_13.png",
    "mod_14_1770144906361.png": "mod_14.png",
    "mod_15_1770144920959.png": "mod_15.png",
    "mod_16_1770144959576.png": "mod_16.png",
    "mod_17_1770144974825.png": "mod_17.png"
}

print("Moving generated files...")
for src_name, dest_name in mapping.items():
    src = os.path.join(source_dir, src_name)
    dst = os.path.join(dest_dir, dest_name)
    try:
        shutil.copy2(src, dst)
        print(f"Copied {src_name} to {dest_name}")
    except Exception as e:
        print(f"Error copying {src_name}: {e}")

# Handle duplicates for 18, 19, 20
duplicates = {
    "mod_18.png": "mod_8.png", # Protection/Battle -> Perseverance
    "mod_19.png": "mod_6.png", # Wedding -> Joy
    "mod_20.png": "mod_14.png" # Annunciation -> Surrender
}

print("Creating duplicates for quota limit...")
for new_name, existing_name in duplicates.items():
    src = os.path.join(dest_dir, existing_name)
    dst = os.path.join(dest_dir, new_name)
    try:
        shutil.copy2(src, dst)
        print(f"Created {new_name} from {existing_name}")
    except Exception as e:
        print(f"Error creating duplicate {new_name}: {e}")
