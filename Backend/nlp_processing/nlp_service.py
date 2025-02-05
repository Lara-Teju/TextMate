# nlp_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from extract_text import extract_pdf_structure
from generate_notes import generate_notes  # Ensure this supports async if needed
import os
import json
import asyncio  # For async support if generate_notes is async
import requests

app = Flask(__name__)
CORS(app)

NODE_API_URL = "http://localhost:5000/api/save_notes"  # Correct Node.js endpoint
 # Node.js endpoint to save notes
#UPLOAD_FOLDER = "uploads"  # Define upload folder
#app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/process_pdf", methods=["POST"])
def process_pdf():
    try:
        # Check if PDF file is included
        if "pdf" not in request.files:
            return jsonify({"error": "No PDF file uploaded."}), 400

        pdf_file = request.files["pdf"]
        file_name = pdf_file.filename  # Get filename
        heading_size = request.form.get("heading_size")
        subheading_size = request.form.get("subheading_size")
        content_size = request.form.get("content_size")

        # Validate inputs
        if not heading_size or not subheading_size or not content_size:
            return jsonify({"error": "Font sizes are required."}), 400

        # Convert sizes to float
        try:
            heading_size = float(heading_size)
            subheading_size = float(subheading_size)
            content_size = float(content_size)
        except ValueError:
            return jsonify({"error": "Font sizes must be numeric."}), 400

        # Save file
        os.makedirs("uploads", exist_ok=True)
        pdf_path = os.path.join("uploads", pdf_file.filename)
        pdf_file.save(pdf_path)
        print(f"PDF saved to {pdf_path}")

        # Extract structured content
        print("Extracting structured content...")
        structured_content = extract_pdf_structure(pdf_path, heading_size, subheading_size, content_size)
        print("Structured content extracted:", structured_content)

        # Validate the structure of `structured_content`
        if not isinstance(structured_content, dict):
            raise ValueError("Invalid structured content format. Expected a dictionary.")

        # Generate notes (async if required)
        print("Generating notes...")
        if asyncio.iscoroutinefunction(generate_notes):
            notes = asyncio.run(generate_notes(structured_content))
        else:
            notes = generate_notes(structured_content)

        # Log the raw output
        print("Raw notes output:", notes)

        # Handle notes returned as a string
        if isinstance(notes, str):
            try:
                notes = json.loads(notes)  # Convert JSON string to Python object
                print("Parsed notes:", notes)
            except json.JSONDecodeError as e:
                print("JSON parsing error:", str(e))
                raise ValueError("Generated notes is not valid JSON.")
        
        # Fix: Convert dict to list if necessary
        if isinstance(notes, dict):
            unique_headings = set()
            formatted_notes = []
            for heading, content in notes.items():
                if isinstance(content, dict):
                    heading_title = heading
                    if heading_title in unique_headings:
                        continue  
                    unique_headings.add(heading_title)

                    formatted_subheadings = []
                    for subheading, sub_content in content.items():
                        if isinstance(sub_content, dict) and {"summary", "keywords", "analogy"}.issubset(sub_content.keys()):
                            formatted_subheadings.append({
                                "subheading": subheading,
                                "content": {
                                    "summary": sub_content.get("summary", ""),
                                    "keywords": sub_content.get("keywords", []),
                                    "analogy": sub_content.get("analogy", "")
                                }
                            })

                    formatted_notes.append({
                        "heading": heading_title,
                        "subheadings": formatted_subheadings
                    })

            notes = formatted_notes  # Ensure notes is now a list

        # Ensure notes is a list and not a string
        if not isinstance(notes, list):
            raise ValueError("Generated notes should be a list of dictionaries.")

        print("Notes generated:", json.dumps(notes, indent=4))

        # Format notes for sending to Node.js
        formatted_notes = []
        for heading in notes:
            if not isinstance(heading, dict):
                continue  # Skip invalid headings

            formatted_subheadings = []
            for sub in heading.get("subheadings", []):
                if not isinstance(sub, dict):
                    continue  # Skip invalid subheadings
                formatted_subheadings.append({
                    "subheading": sub.get("subheading", ""),
                    "content": {
                        "summary": sub.get("content", {}).get("summary", ""),
                        "keywords": sub.get("content", {}).get("keywords", []),
                        "analogy": sub.get("content", {}).get("analogy", "")
                    }
                })

            formatted_notes.append({
                "heading": heading.get("heading", ""),
                "subheadings": formatted_subheadings
            })

        # Clean up uploaded PDF
        os.remove(pdf_path)

         # **DEBUG: Log the notes before sending to Node.js**
        print("Formatted Notes being sent to Node.js:", json.dumps(notes, indent=4))

        # Send the generated notes to Node.js to store in MongoDB
        response = requests.post(NODE_API_URL, json={
            "fileName": file_name,
            "notes": formatted_notes
        })
        print("Response from Node.js:", response.text) 

        # Check response from Node.js
        if response.status_code == 201:
            saved_data = response.json()  # Parse the response
            return jsonify({"message": "Notes generated and saved successfully.", "notes": formatted_notes, "_id": saved_data.get("_id")})
        else:
            print("Error saving notes:", response.text)  # Log exact error response
            return jsonify({"error": f"Failed to save notes to database. Response: {response.text}"}), 500

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)

