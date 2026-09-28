import os
import requests
import urllib3
import zipfile
import io
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

# Suppress SSL Warnings for Indian Govt websites
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

print_lock = threading.Lock()
def safe_print(*args, **kwargs):
    with print_lock:
        print(*args, **kwargs)

# ==========================================
# 1. THE EXACT CBSE URL MAP (Extracted from HTML)
# ==========================================
BASE_DOMAIN = "https://www.cbse.gov.in/cbsenew/"
BASE_PYQ_DIR = "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs"

# This dictionary maps the Exact Path found in your HTML snippet
EXACT_PYQ_LINKS = {
    "Science": {
        "2025": "question-paper/2025/X/086_Science.zip",
        "2024": "question-paper/2024/X/SCIENCE.zip",
        "2023": "question-paper/2023/X/SCIENCE.zip",
        "2022": "question-paper/2022/X/Scince.zip" # The famous typo from 2022
    },
    "Maths/Standard": {
        "2025": "question-paper/2025/X/041_Mathematics_Standard.zip",
        "2024": "question-paper/2024/X/MATHEMATICS_STANDARD.zip",
        "2023": "question-paper/2023/X/MATHEMATICS_STANDARD.zip",
        "2022": "question-paper/2022/X/Math_S.zip"
    },
    "Maths/Basic": {
        "2025": "question-paper/2025/X/241_Mathematics_Basic.zip",
        "2024": "question-paper/2024/X/MATHEMATICS_BASIC.zip",
        "2023": "question-paper/2023/X/MATHEMATICS_BASIC.zip",
        "2022": "question-paper/2022/X/Math_B.zip"
    },
    "Social_Science": {
        "2025": "question-paper/2025/X/087_Social_Science.zip",
        "2024": "question-paper/2024/X/SOCIAL_SCIENCE.zip",
        "2023": "question-paper/2023/X/SOCIAL_SCIENCE.zip",
        "2022": "question-paper/2022/X/SST.zip"
    },
    "English": {
        "2025": "question-paper/2025/X/184_English_Language_and_Literature.zip",
        "2024": "question-paper/2024/X/ENGLISH_L&L.zip",
        "2023": "question-paper/2023/X/English_Language_Literature.zip",
        "2022": "question-paper/2022/X/English_&_Lit.zip"
    },
    "Hindi/Course_A": {
        "2025": "question-paper/2025/X/002_Hindi_Course_A.zip",
        "2024": "question-paper/2024/X/HINDI_A.zip",
        "2023": "question-paper/2023/X/HINDI_A.zip",
        "2022": "question-paper/2022/X/Hindi_A.zip"
    },
    "Hindi/Course_B": {
        "2025": "question-paper/2025/X/085_Hindi_Course_B.zip",
        "2024": "question-paper/2024/X/HINDI_B.zip",
        "2023": "question-paper/2023/X/HINDI_B.zip",
        "2022": "question-paper/2022/X/Hindi_B.zip"
    }
}

# ==========================================
# 2. WORKER FUNCTION
# ==========================================
def download_exact_pyq(subject_folder, year, raw_path):
    """Fetches the exact ZIP file from the mapped paths."""
    
    # Clean up the path (browsers automatically encode spaces and ampersands, Python needs us to do it)
    clean_path = raw_path.replace(" ", "%20").replace("&", "%26")
    full_url = BASE_DOMAIN + clean_path
    
    # Destination local folder (e.g., Board_PYQs/Maths/Standard/PYQ_2024)
    dest_folder = os.path.join(BASE_PYQ_DIR, subject_folder, f"PYQ_{year}")
    os.makedirs(dest_folder, exist_ok=True)
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://www.cbse.gov.in/cbsenew/question-paper.html"
    }

    display_name = f"{year} {subject_folder.replace('/', ' ')}"
    safe_print(f"  ⚡ [FETCHING] {display_name}...")
    
    try:
        res = requests.get(full_url, headers=headers, verify=False, timeout=20)
        
        if res.status_code == 200 and res.content.startswith(b'PK'):
            with zipfile.ZipFile(io.BytesIO(res.content)) as zip_ref:
                zip_ref.extractall(dest_folder)
            safe_print(f"  ✅ [SUCCESS] Unzipped {display_name}!")
        else:
            safe_print(f"  ❌ [FAIL] {display_name} - HTTP {res.status_code}")
            
    except Exception as e:
        safe_print(f"  ❌ [ERROR] {display_name}: Connection failed.")

# ==========================================
# 3. MAIN EXECUTION
# ==========================================
def main():
    safe_print("\n" + "="*65)
    safe_print("🚀 INITIALIZING EXACT CBSE PYQ DOWNLOADER")
    safe_print("Using hardcoded paths extracted directly from CBSE Source Code.")
    safe_print("="*65 + "\n")
    
    tasks =[]
    
    for subject_folder, year_map in EXACT_PYQ_LINKS.items():
        for year, raw_path in year_map.items():
            tasks.append((subject_folder, year, raw_path))

    # Using 5 workers to download multiple files simultaneously without getting blocked
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures =[
            executor.submit(download_exact_pyq, task[0], task[1], task[2])
            for task in tasks
        ]
        for future in as_completed(futures):
            pass

    safe_print("\n" + "="*65)
    safe_print("✅ FETCH COMPLETE!")
    safe_print("All PYQs have been beautifully organized into your directory.")
    safe_print("="*65 + "\n")

if __name__ == "__main__":
    main()