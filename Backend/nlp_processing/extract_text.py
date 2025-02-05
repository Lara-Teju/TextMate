#extract_text.py
import json
from flask import Flask, request, jsonify
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar

app = Flask(__name__)

def is_close(size1, size2, tol):
    return abs(size1 - size2) <= tol

def extract_pdf_structure(pdf_path, heading_size, subheading_size, content_size, tolerance=0.5):
    structured_data = {}
    current_heading = None
    current_subheading = None

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
                            continue
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
                            if current_heading is None:
                                current_heading = "Uncategorized"
                                structured_data[current_heading] = {}
                            structured_data[current_heading].setdefault("Other", []).append(line_text)
    return structured_data
