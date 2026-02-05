
import os
import time
import requests
from duckduckgo_search import DDGS
import unicodedata

# Caminho base das músicas
BASE_DIR = os.path.join(os.path.dirname(__file__), 'uploads', 'musicas')

def normalize_name(name):
    # Remove caracteres especiais para busca melhor
    return name.replace('🎵', '').strip()

def download_image(url, save_path):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"      [DEBUG] Status {response.status_code} for {url}")
    except Exception as e:
        print(f"      [DEBUG] Error downloading {url}: {e}")
    return False

def main():
    if not os.path.exists(BASE_DIR):
        print(f"Diretório não encontrado: {BASE_DIR}")
        return

    artists = [d for d in os.listdir(BASE_DIR) if os.path.isdir(os.path.join(BASE_DIR, d))]
    
    print(f"Encontrados {len(artists)} artistas. Iniciando busca de capas...")
    
    ddgs = DDGS()

    for artist in artists:
        artist_path = os.path.join(BASE_DIR, artist)
        
        # Verifica se já tem capa
        existing_cover = next((f for f in os.listdir(artist_path) if f.lower().startswith('cover.') or f.lower().startswith('folder.')), None)
        
        if existing_cover:
            # print(f"Skipping {artist}...") 
            continue

        print(f"\nProcessing: {artist}")
        
        # Termos de busca (Tenta o primeiro, se falhar tenta o segundo)
        queries = [
            f"{artist} cantor catolico",
            f"{artist} album cover",
            f"{artist} musica catolica"
        ]
        
        if "PACOTE" in artist.upper():
            queries = ["Jesus Cristo arte", "igreja catolica wallpaper"]

        success = False
        
        for query in queries:
            if success: break
            
            print(f"   Searching for: '{query}'...")
            try:
                # Add delay before request to be safe
                time.sleep(5)
                results = ddgs.images(query, max_results=4)
                
                for res in results:
                    image_url = res['image']
                    save_path = os.path.join(artist_path, 'cover.jpg')
                    
                    print(f"      Downloading: {image_url[:60]}...")
                    if download_image(image_url, save_path):
                        print(f"      [OK] Success!")
                        success = True
                        break
                
            except Exception as e:
                print(f"      [WARN] Error/RateLimit: {e}")
                print("      Waiting 25s cooldown...")
                time.sleep(25)
        
        if not success:
            print(f"   [FAIL] Could not find image for {artist}. Using default.")
            # Copiar imagem padrão se existir
            default_bg = os.path.join(os.path.dirname(__file__), 'uploads', 'img', 'background_catholic.png')
            if os.path.exists(default_bg):
                 import shutil
                 shutil.copy(default_bg, os.path.join(artist_path, 'cover.jpg'))
                 print("      [OK] Copied default background.")
        
        # Long delay between artists
        time.sleep(5)

    print("\nProcess finished!")

if __name__ == "__main__":
    main()
