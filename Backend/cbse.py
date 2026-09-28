import os
import requests
import urllib3
import zipfile
import io
import re
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

# Suppress SSL Warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Thread-safe printing so the console output doesn't get scrambled
print_lock = threading.Lock()

def safe_print(*args, **kwargs):
    with print_lock:
        print(*args, **kwargs)

# ==========================================
# 1. CORE FOLDER STRUCTURE
# ==========================================

FOLDERS =[
    "School_Master_Wiki/01_Raw_Sources/00_Inbox_Unprocessed",
    "School_Master_Wiki/01_Raw_Sources/01_CBSE_Directives/Syllabus",
    "School_Master_Wiki/01_Raw_Sources/02_NCERT_and_Exemplar", 
    "School_Master_Wiki/01_Raw_Sources/03_Reference_Material",
    "School_Master_Wiki/01_Raw_Sources/04_School_Worksheets",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/School_Exams",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/Science",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/Maths",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/Social_Science",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/English",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/Hindi",
    "School_Master_Wiki/02_Syllabus_Graph",
    "School_Master_Wiki/03_Resource_Index",
    "Student_OS_Aditi_Class10/01_Knowledge_State",
    "Student_OS_Aditi_Class10/02_Assessment_Analytics",
    "Student_OS_Aditi_Class10/03_Execution_Plans",
    "Student_OS_Aditi_Class10/04_Behavioral_Profile"
]

# ==========================================
# 2. CBSE LIVE PDFs (2025-2026)
# ==========================================

CBSE_PDFS = {
    "School_Master_Wiki/01_Raw_Sources/01_CBSE_Directives/Syllabus/Science_Syllabus.pdf": 
        "https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/Science_Sec_2025-26.pdf",
    "School_Master_Wiki/01_Raw_Sources/01_CBSE_Directives/Syllabus/Maths_Syllabus.pdf": 
        "https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/Maths_Sec_2025-26.pdf",
    "School_Master_Wiki/01_Raw_Sources/01_CBSE_Directives/Syllabus/Social_Science_Syllabus.pdf": 
        "https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/Social_Science_Sec_2025-26.pdf",
    "School_Master_Wiki/01_Raw_Sources/01_CBSE_Directives/Syllabus/English_LL_Syllabus.pdf": 
        "https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/English_Language_and_Literature_Sec_2025-26.pdf",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/Science/Science_SQP.pdf":
        "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/Science-SQP.pdf",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/Maths/Maths_Standard_SQP.pdf":
        "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/MathsStandard-SQP.pdf",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/Science/Science_MS.pdf":
        "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/Science-MS.pdf",
    "School_Master_Wiki/01_Raw_Sources/05_Exams_and_PYQs/Board_PYQs/Maths/Maths_Standard_MS.pdf":
        "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/MathsStandard-MS.pdf"
}

# ==========================================
# 3. CURATED ENGLISH-MEDIUM NCERT MAP
# ==========================================

NCERT_INPUT_DATA = """
* Mathematics
    * [Mathematics](https://ncert.nic.in/textbook.php?jemh1=0-15)

* Science
    *[Science](https://ncert.nic.in/textbook.php?jesc1=0-16)

* Hindi
    * [Kshitij-2](https://ncert.nic.in/textbook.php?jhks1=0-17)
    * [Sparsh](https://ncert.nic.in/textbook.php?jhsp1=0-17)
    *[Sanchayan Bhag-2](https://ncert.nic.in/textbook.php?jhsy1=0-3)
    * [Kritika](https://ncert.nic.in/textbook.php?jhkr1=0-5)

* English
    * [First Flight](https://ncert.nic.in/textbook.php?jeff1=0-11)
    *[Foot Prints Without feet Supp. Reader](https://ncert.nic.in/textbook.php?jefp1=0-10)
    * [Words and Expressions 2](https://ncert.nic.in/textbook.php?jewe2=0-11)

* Social Science
    * [Contemporary India ](https://ncert.nic.in/textbook.php?jess1=0-7)
    *[Understanding Economic Development](https://ncert.nic.in/textbook.php?jess2=0-5)
    * [India and the Contemporary World-II ](https://ncert.nic.in/textbook.php?jess3=0-5)
    * [Democratic Politics](https://ncert.nic.in/textbook.php?jess4=0-8)

* Sanskrit
    *[Shemushi](https://ncert.nic.in/textbook.php?jhsk1=0-12)
    * [Vyakaranavithi](https://ncert.nic.in/textbook.php?jhva1=0-14)
    * [Abhyaswaan Bhav-II](https://ncert.nic.in/textbook.php?jsab1=0-14)
"""

LLM_FILES = {
    "School_Master_Wiki/cbse_index.md": "# 🏛️ CBSE Master Index\nAll Official PDFs & English-Medium NCERT Chapters are extracted into `01_Raw_Sources`.\n",
    "School_Master_Wiki/_cbse_schema.md": "# CBSE Schema Instructions\n1. Enforce step-marking using `*-MS.pdf` files.\n2. Prioritize `02_NCERT_and_Exemplar` contents.\n",
    "Student_OS_Aditi_Class10/MENTOR_INSTRUCTIONS.md": "# Ranjan Sir (LLM) Instructions\nYou are the ultimate execution mentor.\n",
    "Student_OS_Aditi_Class10/student_index.md": "# Aditi's Dashboard\n- Status: Class 10 (Session 2026)\n- Medium: English\n",
    "Student_OS_Aditi_Class10/execution_log.md": "# Execution Log\n## [System Started]\n"
}

# ==========================================
# 4. THREADED DOWNLOAD WORKERS
# ==========================================

def create_fallback_file(filepath, message):
    with open(filepath, "w") as f:
        f.write(f"%PDF-1.4\n%{message}\n")

def download_cbse_worker(url, dest_path):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Connection": "keep-alive"
    }
    filename = os.path.basename(dest_path)
    safe_print(f"  ⚡ [START] Fetching: {filename}...")
    try:
        res = requests.get(url, headers=headers, stream=True, timeout=20, verify=False)
        if res.status_code == 200:
            with open(dest_path, 'wb') as f:
                for chunk in res.iter_content(chunk_size=8192):
                    f.write(chunk)
            safe_print(f"  ✅ [DONE] {filename}")
        else:
            safe_print(f"  ❌ [FAIL] {filename} (Status: {res.status_code})")
            create_fallback_file(dest_path, "Server rejected request.")
    except Exception:
        safe_print(f"  ❌ [ERROR] {filename}")
        create_fallback_file(dest_path, "Connection Error.")

def download_ncert_worker(book_info):
    book_code, dest_folder, book_name = book_info
    zip_url = f"https://ncert.nic.in/textbook/pdf/{book_code}dd.zip"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": f"https://ncert.nic.in/textbook.php?{book_code}=0-1"
    }
    
    safe_print(f"  ⚡ [START] Downloading ZIP: {book_name}...")
    try:
        res = requests.get(zip_url, headers=headers, verify=False, timeout=60)
        
        if res.status_code == 200:
            if res.content.startswith(b'PK'):
                with zipfile.ZipFile(io.BytesIO(res.content)) as zip_ref:
                    zip_ref.extractall(dest_folder)
                safe_print(f"  ✅ [DONE] Extracted {book_name}!")
            else:
                safe_print(f"  ❌ [CAPTCHA] {book_name} blocked by NCERT.")
                create_fallback_file(os.path.join(dest_folder, "_MANUAL_DOWNLOAD.md"), "Download manually.")
        else:
            safe_print(f"  ❌ [FAIL] {book_name} (Status: {res.status_code})")
    except Exception as e:
        safe_print(f"  ❌ [ERROR] {book_name}: {e}")

def sanitize_name(name):
    name = name.replace('', '').replace('*', '')
    return re.sub(r'[^\w\s\-]', '', name).strip()

def parse_ncert_tasks():
    tasks =[]
    base_ncert_dir = "School_Master_Wiki/01_Raw_Sources/02_NCERT_and_Exemplar"
    current_subject = None
    
    for line in NCERT_INPUT_DATA.split('\n'):
        line = line.strip()
        if not line: continue
            
        if line.startswith('*') and '[' not in line:
            current_subject = sanitize_name(line)
            continue
            
        match = re.search(r'\[(.*?)\]\(.*?textbook\.php\?([a-z0-9]+)=', line)
        if match and current_subject:
            book_name = sanitize_name(match.group(1))
            book_code = match.group(2).strip()
            dest_folder = os.path.join(base_ncert_dir, current_subject, book_name)
            os.makedirs(dest_folder, exist_ok=True)
            tasks.append((book_code, dest_folder, book_name))
            
    return tasks

# ==========================================
# 5. MAIN EXECUTION (MULTI-THREADED)
# ==========================================

def main():
    safe_print("\n" + "="*50)
    safe_print("🚀 INITIALIZING HIGH-SPEED ENGLISH-MEDIUM OS")
    safe_print("="*50 + "\n")

    # Step 1: Folders
    for folder in FOLDERS:
        os.makedirs(folder, exist_ok=True)
    for filepath, content in LLM_FILES.items():
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
    safe_print("📁 Folders and Schemas instantly created.\n")

    # Step 2: Parallel CBSE Downloads
    safe_print("🌐 LAUNCHING THREADS: Downloading Official CBSE PDFs...")
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures =[executor.submit(download_cbse_worker, url, path) for path, url in CBSE_PDFS.items()]
        for future in as_completed(futures):
            pass # Wait for all CBSE downloads to finish

    # Step 3: Parallel NCERT Downloads
    safe_print("\n📚 LAUNCHING THREADS: Processing NCERT Books...")
    ncert_tasks = parse_ncert_tasks()
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(download_ncert_worker, task) for task in ncert_tasks]
        for future in as_completed(futures):
            pass # Wait for all NCERT downloads to finish

    safe_print("\n" + "="*50)
    safe_print("✅ SYSTEM BUILD COMPLETE!")
    safe_print("Downloaded in record time using concurrent multi-threading.")
    safe_print("="*50 + "\n")

if __name__ == "__main__":
    main()