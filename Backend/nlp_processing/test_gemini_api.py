#sample_test_code
import google.generativeai as genai
import pdfplumber

# Configure the Gemini API with your API key
genai.configure(api_key="AIzaSyDL41z2GfaqwPytnSAXL4bkerWzUplpl2M")

# Define task prompts
task_prompts = {
    "summarize": "Generate a summary of the given text while maintaining and covering all the important concepts and points covered in the text.",
    "keywords": "Generate a list of important keywords that covers the concepts and theories covered in the given text.",
    "analogy": "Generate a simple and understandable analogy for the concept in the given text."
}

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    return text

# Function to generate content based on task type
def generate_content(task_type, text):
    prompt = task_prompts.get(task_type)  # Fetch the appropriate prompt based on task type
    if not prompt:
        print(f"Invalid task type: {task_type}")
        return
    
    try:
        print(f"Sending {task_type} request to Gemini API...")
        # Generate content using the Gemini API
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt + "\n" + text)
        
        # Output the result
        print(f"{task_type.capitalize()} Response received from Gemini API:")
        print(response.text)

    except Exception as e:
        print(f"An error occurred while communicating with the Gemini API for {task_type}:")
        print(e)

# Path to the PDF file
pdf_path = "C:/Users/tejas/Downloads/Business Analytics word (1).pdf"

# Extract text from the PDF
pdf_text = extract_text_from_pdf(pdf_path)

# Call the function for each task type (summary, keywords, analogy)
generate_content("summarize", pdf_text)
generate_content("keywords", pdf_text)
generate_content("analogy", pdf_text)
