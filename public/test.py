import PyPDF2

def read_pdf_pages(pdf_file):
    pdf_pages = []
    
    with open(pdf_file, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            pdf_pages.append(page.extract_text())
            
    return pdf_pages

if __name__ == "__main__":
    # Replace 'your_file.pdf' with the actual path to your PDF document
    pdf_file_path = r'C:\Users\yasee.STUDY-COMPUTER\OneDrive\Documents\VS Code\website projects\aischool\public\document.pdf'
    pages_array = read_pdf_pages(pdf_file_path)
    
    # Printing the contents of each page
    for page_num, page_content in enumerate(pages_array, 1):
        print(f"Page {page_num}:")
        print(page_content)
        print("\n---\n")
