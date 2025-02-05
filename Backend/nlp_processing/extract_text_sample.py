import json
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar

def extract_text_by_fontsize(pdf_path, heading_size, subheading_size, content_size, tolerance=0.5):
    structured_data = {}
    current_heading = None
    current_subheading = None

    def is_close(size1, size2, tol):
        return abs(size1 - size2) <= tol

    for page_layout in extract_pages(pdf_path):
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                for text_line in element:
                    if isinstance(text_line, LTTextContainer):
                        line_text = text_line.get_text().strip()
                        if not line_text:
                            continue

                        # Extract average font size
                        font_sizes = [char.size for char in text_line if isinstance(char, LTChar)]
                        if not font_sizes:
                            continue  # Skip if font size isn't detected
                        avg_font_size = sum(font_sizes) / len(font_sizes)

                        # Debug: Print detected text with font size
                        print(f"Detected Text: '{line_text}' | Font Size: {avg_font_size}")

                        # Classify text based on font size with tolerance
                        if is_close(avg_font_size, heading_size, tolerance):
                            current_heading = line_text
                            structured_data[current_heading] = {}
                            current_subheading = None

                        elif is_close(avg_font_size, subheading_size, tolerance):
                            if current_heading is None:
                                current_heading = "Uncategorized"
                                structured_data[current_heading] = {}
                            current_subheading = line_text
                            structured_data[current_heading][current_subheading] = []

                        elif is_close(avg_font_size, content_size, tolerance):
                            if current_heading is None:
                                current_heading = "Uncategorized"
                                structured_data[current_heading] = {}
                            if current_subheading:
                                structured_data[current_heading][current_subheading].append(line_text)
                            else:
                                structured_data[current_heading].setdefault("Content", []).append(line_text)

                        else:
                            # Handle unmatched font sizes
                            if current_heading is None:
                                current_heading = "Uncategorized"
                                structured_data[current_heading] = {}
                            structured_data[current_heading].setdefault("Other", []).append(line_text)

    return structured_data

def save_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# Sample execution
if __name__ == "__main__":
    pdf_path = "C:/Users/tejas/Downloads/TextMate_sample_1 (1).pdf"  # Replace with your PDF file
    heading_size = 16  # Adjust based on printed font sizes
    subheading_size = 14
    content_size = 12
    tolerance = 1  # Allows ±1 point difference

    result = extract_text_by_fontsize(pdf_path, heading_size, subheading_size, content_size, tolerance)
    save_json(result, "structured_content.json")

    print("Structured content saved to structured_content.json")



