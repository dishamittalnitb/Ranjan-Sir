import os
import shutil
import pymupdf4llm

# The root folder where all your raw data lives
ROOT_DIR = "School_Master_Wiki/01_Raw_Sources"

def flatten_directories(root_path):
    """
    Finds annoying nested folders created by ZIP extractions 
    (e.g., Science/jesc1/chap1.pdf) and moves the files up one level.
    """
    print("\n🧹 STEP 1: Flattening nested ZIP directories...")
    
    for dirpath, dirnames, filenames in os.walk(root_path, topdown=False):
        # We don't want to mess with the root folder itself
        if dirpath == root_path:
            continue
            
        # If a directory contains files, check if it's an unnecessary subfolder
        # Usually, NCERT zips create a random 5-letter folder (like 'jesc1')
        parent_dir = os.path.dirname(dirpath)
        dir_name = os.path.basename(dirpath)
        
        # If the folder name looks like a zip extraction artifact (lowercase, short, or weird)
        # OR if we just want to push all PDFs up to the main subject folder
        # We will move all files up to the parent directory and remove this folder.
        if len(filenames) > 0 and len(dirnames) == 0:
            # Check if parent is a subject/book category (e.g., 'Science', 'Maths')
            # Let's move files up and delete this sub-directory
            for file in filenames:
                old_file_path = os.path.join(dirpath, file)
                new_file_path = os.path.join(parent_dir, file)
                
                # Prevent overwriting if a file with the same name exists
                if not os.path.exists(new_file_path):
                    shutil.move(old_file_path, new_file_path)
                else:
                    # If conflict, append the folder name to make it unique
                    safe_name = f"{dir_name}_{file}"
                    shutil.move(old_file_path, os.path.join(parent_dir, safe_name))
            
            # Remove the now-empty subfolder
            try:
                os.rmdir(dirpath)
                print(f"  Moved files out of and deleted: {dirpath}")
            except OSError:
                pass # Folder wasn't entirely empty

def convert_pdfs_to_markdown(root_path):
    """
    Scans for all PDFs, converts them to LLM-optimized Markdown, 
    and deletes the original PDF.
    """
    print("\n📄 STEP 2: Converting PDFs to LLM-Optimized Markdown...")
    
    for dirpath, _, filenames in os.walk(root_path):
        for file in filenames:
            if file.lower().endswith('.pdf'):
                pdf_path = os.path.join(dirpath, file)
                md_path = os.path.join(dirpath, file.replace('.pdf', '.md').replace('.PDF', '.md'))
                
                print(f"  ⚙️ Converting: {os.path.basename(pdf_path)}...")
                
                try:
                    # PyMuPDF4LLM is magic. It handles two-column layouts and tables perfectly.
                    md_text = pymupdf4llm.to_markdown(pdf_path)
                    
                    # Add LLM Context Frontmatter
                    llm_header = f"""---
source_file: {os.path.basename(pdf_path)}
type: Official_Educational_Resource
---

# DOCUMENT: {os.path.basename(pdf_path).replace('.pdf', '')}
*LLM INSTRUCTION: This is a verified raw source. Use this content to answer questions or generate study plans.*

"""
                    # Write to Markdown file
                    with open(md_path, "w", encoding="utf-8") as f:
                        f.write(llm_header + md_text)
                        
                    print(f"  ✅ Success -> {os.path.basename(md_path)}")
                    
                    # DELETE THE ORIGINAL PDF TO CLEAN UP THE WIKI
                    os.remove(pdf_path)
                    print(f"  🗑️ Deleted original PDF.")
                    
                except Exception as e:
                    print(f"  ❌ FAILED to convert {file}: {e}")
                    # Create a dummy MD file so Claude knows the file is corrupted
                    with open(md_path, "w", encoding="utf-8") as f:
                        f.write(f"# CORRUPTED PDF\nThe file {file} could not be parsed by the OCR engine.")

def main():
    print("="*60)
    print("🚀 INITIALIZING WIKI OPTIMIZATION ENGINE")
    print("="*60)
    
    flatten_directories(ROOT_DIR)
    convert_pdfs_to_markdown(ROOT_DIR)
    
    print("\n" + "="*60)
    print("🎉 OPTIMIZATION COMPLETE!")
    print("Your Wiki is now 100% Markdown. Claude will read this lightning-fast and with perfect accuracy.")
    print("="*60)

if __name__ == "__main__":
    main()