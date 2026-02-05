
import os
import shutil
import sys
import types
import pathlib

# ---------------------------------------------------------
# MOCK imghdr (Missing in Python 3.14)
# ---------------------------------------------------------
if 'imghdr' not in sys.modules:
    mock_imghdr = types.ModuleType('imghdr')
    def mock_what(file, h=None):
        return 'jpeg' 
    mock_imghdr.what = mock_what
    sys.modules['imghdr'] = mock_imghdr

# ---------------------------------------------------------
# MOCK pathlib.Path.isdir (Bug in bing-image-downloader?)
# ---------------------------------------------------------
if not hasattr(pathlib.Path, 'isdir'):
    pathlib.Path.isdir = pathlib.Path.is_dir
# ---------------------------------------------------------

from bing_image_downloader import downloader

BASE_DIR = os.path.join(os.path.dirname(__file__), 'uploads', 'musicas')

def main():
    if not os.path.exists(BASE_DIR):
        print(f"Directory not found: {BASE_DIR}")
        return

    artists = [d for d in os.listdir(BASE_DIR) if os.path.isdir(os.path.join(BASE_DIR, d))]
    
    print(f"Found {len(artists)} artist folders. Targeting specific corrections...")
    
    # Specific corrections
    targets = {
        "Fátima Sousa": "Fatima Souza cantante catolica oficial",
        "Em Louvor a São José": "Sao Jose com menino jesus pintura classica"
    }

    for artist in artists:
        if artist not in targets:
            continue

        print(f"\n[FIX] Fetching correct image for: {artist}")
        
        artist_path = os.path.join(BASE_DIR, artist)
        cover_path = os.path.join(artist_path, 'cover.jpg')
        search_query = targets[artist]
        
        try:
            # Download to a temporary folder
            output_dir = os.path.join(artist_path, 'temp_bing_fix')
            
            # Remove old cover if exists to force update
            if os.path.exists(cover_path):
                try:
                    os.remove(cover_path)
                    print("   [INFO] Removed old incorrect cover.")
                except:
                    pass

            downloader.download(search_query, limit=1,  output_dir=output_dir, 
                                adult_filter_off=True, force_replace=True, timeout=10, verbose=False)
            
            # Find the downloaded file
            # Library creates subdir based on query
            query_dir = os.path.join(output_dir, search_query)
            
            if os.path.exists(query_dir):
                files = os.listdir(query_dir)
                if files:
                    downloaded_file = os.path.join(query_dir, files[0])
                    shutil.move(downloaded_file, cover_path)
                    print(f"   [OK] Hygeine fix applied for {artist}")
                else:
                    print("   [FAIL] No files downloaded.")
            
            # Cleanup
            try:
                 shutil.rmtree(output_dir)
            except:
                 pass

        except Exception as e:
            print(f"   [ERROR] Failed to download for {artist}: {e}")

    print("\nCorrection process finished!")

if __name__ == "__main__":
    main()
