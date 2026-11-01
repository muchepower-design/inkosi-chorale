from docx import Document
from docx.shared import Pt, Inches
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import re

# Final data exactly as provided
raw_lines = [
    "1. Kabulonga Church (3) Mg (2) Syl => total(5)",
    "2. Ibex mission district (11) Mg => total(11)",
    "3. Chilenje mission district - (19) Mg (4) Syl => total(23)",
    "4. Kafue main church- (8) Mg (16) Syl => total(24)",
    "5. Libala church - (3) Mg (5) Syl => total(8)",
    "6. Golfview mission district - Mg (20) Syl (1) => total(21)",
    "7. Kafue mission district- (32) Mg (11) Syl => total(43)",
    "8. Njanji church- (6) Mg (1) Syl => total(7)",
    "9. Avondale Church - (2) Mg (2) Syl => total(4)",
    "10. Chilumbulu mission district- Mg (5) => total()",
    "11. Chipapa mission district- Mg (6) Syl (2) => total()",
    "12. Horizon church- Mg (1) => total()",
    "13. Shantumbu mission district- Mg (5) Syl (3) => total()",
    "14. Woodlands central church- Mg (12) Syl (2) => total()",
    "15. Chongwe mission district- Mg (1) Syl (1) => total()",
    "16. Luyando mission district - Mg (2) => total()",
    "17. Lilayi mission district- Mg (16) Syl (5) => total()",
    "18. Bedrock mission district - Mg (1) => total()",
    "19. Statelodge mission district - Mg (8) Syl (5) => total()",
    "20. Rufunsa mission district Mg (6) => total()",
    "21. Parkview Church - Mg (12) Syl (5) => total()",
    "22. Chalimbana mission district Mg (12) => total()",
    "23. Chinyunyu mission district Mg (2) Syl (1) => total()",
    "24. PCM Mg(53) SYL(21) => total: (74)"
]

def extract_mg_syl(line):
    """Extract Mg and Syl values from a line, handling various formats."""
    # Clean up the line for consistent matching
    line_clean = line.replace(':', '')
    
    # Extract Mg value - handles "Mg (5)", "Mg(53)", "Mg (20)" etc.
    mg_match = re.search(r'Mg\s*\((\d+)\)', line_clean, re.IGNORECASE)
    mg = int(mg_match.group(1)) if mg_match else 0
    
    # Extract Syl value - handles "Syl (2)", "SYL(21)", "Syl (1)" etc.
    syl_match = re.search(r'Syl\s*\((\d+)\)', line_clean, re.IGNORECASE)
    syl = int(syl_match.group(1)) if syl_match else 0
    
    return mg, syl

def extract_portfolio_name(line):
    """Extract clean portfolio name without numbers and special chars."""
    # Remove the number at start
    name = re.sub(r'^\d+\.\s*', '', line)
    # Remove everything after => (the total part)
    name = re.split(r'=>', name)[0].strip()
    # Clean up trailing dashes and spaces
    name = re.sub(r'[–\-]\s*$', '', name).strip()
    return name

def parse_portfolio_data(raw_lines):
    """Parse all portfolio data and calculate totals."""
    data = []
    
    for line in raw_lines:
        if not line.strip():
            continue
            
        portfolio_name = extract_portfolio_name(line)
        mg, syl = extract_mg_syl(line)
        total = mg + syl
        
        data.append({
            'portfolio': portfolio_name,
            'mg': mg,
            'syl': syl,
            'total': total
        })
    
    return data

def set_cell_background(cell, color):
    """Set background color for a table cell."""
    shading = OxmlElement('w:shd')
    shading.set(qn('w:fill'), color)
    cell._tc.get_or_add_tcPr().append(shading)

def create_word_table(data, filename="Portfolios_2026_Final.docx"):
    """Create Word document with portfolio data and totals."""
    doc = Document()
    
    # Add title
    title = doc.add_heading('PORTFOLIOS 2026', level=1)
    title.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Add subtitle
    doc.add_paragraph('Portfolio Summary Report', style='Normal')
    doc.add_paragraph('')
    
    # Create table with 4 columns
    table = doc.add_table(rows=1, cols=4)
    table.style = 'Light Grid Accent 1'
    table.autofit = False
    table.width = Inches(6.5)
    
    # Set column widths
    col_widths = [Inches(3.0), Inches(1.0), Inches(1.0), Inches(1.0)]
    for i, width in enumerate(col_widths):
        table.columns[i].width = width
    
    # Add header row
    hdr_cells = table.rows[0].cells
    headers = ['Portfolio Name', 'Mg', 'Syl', 'Total']
    for i, header in enumerate(headers):
        hdr_cells[i].text = header
        hdr_cells[i].paragraphs[0].runs[0].font.bold = True
        hdr_cells[i].paragraphs[0].runs[0].font.size = Pt(11)
        set_cell_background(hdr_cells[i], 'D9E1F2')  # Light blue background
    
    # Add data rows
    for item in data:
        row_cells = table.add_row().cells
        row_cells[0].text = item['portfolio']
        row_cells[1].text = str(item['mg'])
        row_cells[2].text = str(item['syl'])
        row_cells[3].text = str(item['total'])
        
        # Right-align numeric columns
        for i in range(1, 4):
            row_cells[i].paragraphs[0].alignment = WD_TABLE_ALIGNMENT.RIGHT
    
    # Calculate totals
    total_mg = sum(item['mg'] for item in data)
    total_syl = sum(item['syl'] for item in data)
    grand_total = total_mg + total_syl
    
    # Add grand total row
    row_cells = table.add_row().cells
    
    # Merge first cell for label
    row_cells[0].text = 'GRAND TOTAL'
    row_cells[0].paragraphs[0].runs[0].font.bold = True
    row_cells[0].paragraphs[0].runs[0].font.size = Pt(12)
    set_cell_background(row_cells[0], 'E7E6E6')
    
    row_cells[1].text = str(total_mg)
    row_cells[2].text = str(total_syl)
    row_cells[3].text = str(grand_total)
    
    # Bold and right-align grand total numbers
    for i in range(1, 4):
        row_cells[i].paragraphs[0].runs[0].font.bold = True
        row_cells[i].paragraphs[0].alignment = WD_TABLE_ALIGNMENT.RIGHT
        set_cell_background(row_cells[i], 'E7E6E6')
    
    # Add a summary paragraph after table
    doc.add_paragraph('')
    summary_para = doc.add_paragraph()
    summary_para.add_run('Summary: ').bold = True
    summary_para.add_run(f'Total Mg = {total_mg}  |  ')
    summary_para.add_run(f'Total Syl = {total_syl}  |  ')
    summary_para.add_run(f'Grand Total = {grand_total}').bold = True
    
    # Save document
    doc.save(filename)
    print(f"✓ Word document '{filename}' created successfully!\n")
    print("=" * 50)
    print("FINAL SUMMARY")
    print("=" * 50)
    print(f"Total Mg:  {total_mg}")
    print(f"Total Syl: {total_syl}")
    print(f"Grand Total: {grand_total}")
    print("=" * 50)
    print(f"\nTotal portfolios processed: {len(data)}")
    
    return total_mg, total_syl, grand_total

# Run the script
if __name__ == "__main__":
    # Parse the data
    portfolio_data = parse_portfolio_data(raw_lines)
    
    # Display individual portfolio results
    print("\nPortfolio Details:")
    print("-" * 60)
    for i, item in enumerate(portfolio_data, 1):
        print(f"{i:2}. {item['portfolio'][:35]:35} Mg:{item['mg']:2}  Syl:{item['syl']:2}  Total:{item['total']:2}")
    
    # Create Word document
    total_mg, total_syl, grand_total = create_word_table(portfolio_data)