#generate_notes.py
import google.generativeai as genai
import asyncio
import hashlib
import time
import re

# List of multiple API keys
API_KEYS = [
    "API-1",
    "API-2",
    "API-3"
]

api_key_index = 0

def rotate_api_key():
    global api_key_index
    api_key_index = (api_key_index + 1) % len(API_KEYS)
    genai.configure(api_key=API_KEYS[api_key_index])
    print(f"Switched to API Key {api_key_index + 1}")

# Configure the first API key
rotate_api_key()

model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def combined_prompt(heading, subheading, text):
    # Make sure the heading and subheading are clear in the prompt
    return f"""
Please analyze the following content from the heading '{heading}' and subheading '{subheading}', and provide the results in the exact format below:

### Summary:
Summarize the given text, covering all key concepts and important points.

### Keywords:
List up to 10 important keywords related to the concepts and theories in the text.

### Analogy:
Provide a simple and clear analogy for the concept in the text.

### Content:
Heading: {heading}
Subheading: {subheading}
{text}
"""

cache = {}

def hash_content(content):
    return hashlib.md5(content.encode()).hexdigest()

# Retry logic with API key rotation (does not restart tasks)
async def generate_content(prompt, retries=3, delay=5):
    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            if hasattr(response, 'text'):
                return response.text
            return "No content generated."
        except Exception as e:
            print(f"API call failed on attempt {attempt + 1}: {e}")
            if "Resource has been exhausted" in str(e):
                rotate_api_key()
            await asyncio.sleep(delay * (2 ** attempt))  # Exponential backoff
    return "Failed to generate content after retries."

def parse_combined_response(response_text):
    summary_match = re.search(r"### Summary:\s*(.*?)\s*### Keywords:", response_text, re.S)
    keywords_match = re.search(r"### Keywords:\s*(.*?)\s*### Analogy:", response_text, re.S)
    analogy_match = re.search(r"### Analogy:\s*(.*)", response_text, re.S)

    summary = summary_match.group(1).strip() if summary_match else "No summary generated."
    keywords_raw = keywords_match.group(1).strip() if keywords_match else "No keywords generated."
    keywords = [kw.strip() for kw in keywords_raw.split("\n") if kw.strip()]
    analogy = analogy_match.group(1).strip() if analogy_match else "No analogy generated."

    return {
        "summary": summary,
        "keywords": keywords,
        "analogy": analogy
    }

async def process_subheading(heading, subheading, text):
    combined_task_prompt = combined_prompt(heading, subheading, text)
    prompt_hash = hash_content(combined_task_prompt)

    # Check the cache for existing results
    if prompt_hash in cache:
        print(f"Cache hit for {heading} -> {subheading}")
        return {heading: {subheading: cache[prompt_hash]}}

    print(f"Cache miss for {heading} -> {subheading}")
    response = await generate_content(combined_task_prompt)
    result = parse_combined_response(response)
    cache[prompt_hash] = result  # Store the result in cache

    return {heading: {subheading: result}}

async def generate_notes_async(structured_content):
    notes = {}
    tasks = []

    # Prevent duplicate task creation by tracking processed subheadings based on prompt hash
    processed_subheadings = set()

    for heading, sections in structured_content.items():
        if heading not in notes:
            notes[heading] = {}

        for subheading, content in sections.items():
            if isinstance(content, list):
                text = " ".join(content)
            elif isinstance(content, dict):
                text = " ".join(
                    [item for sub_content in content.values() for item in (sub_content if isinstance(sub_content, list) else [sub_content])]
                )
            else:
                text = str(content)


            if not text.strip():
                print(f"Skipping empty content in {heading} - {subheading}")
                continue

            prompt_hash = hash_content(text)

            # Skip if already processed (based on unique prompt hash)
            if prompt_hash in processed_subheadings:
                print(f"Skipping already processed {heading} -> {subheading}")
                continue

            processed_subheadings.add(prompt_hash)  # Mark this prompt as processed

            # Create the task for processing the subheading
            tasks.append(asyncio.create_task(process_subheading(heading, subheading, text)))

            # Respect API rate limits (if necessary)
            if len(tasks) % 3 == 0:
                print("Waiting to respect API rate limits...")
                await asyncio.sleep(20)

    # Gather all the results asynchronously
    results = await asyncio.gather(*tasks)

    # Organize results into the notes dictionary, preserving the heading -> subheading hierarchy
    for result in results:
        for heading, subheadings in result.items():
            if heading not in notes:
                notes[heading] = {}
            notes[heading].update(subheadings)

    return notes

def generate_notes(structured_content):
    return asyncio.run(generate_notes_async(structured_content))

