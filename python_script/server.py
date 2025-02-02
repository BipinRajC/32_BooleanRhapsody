import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import re
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Gemini AI Configuration
GEMINI_API_KEY = "AIzaSyBRoCvxtievRdMa7CPcfA0nAHQuY1OJvWw"
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini Model
model = genai.GenerativeModel("gemini-1.5-flash")


class DocumentRetrievalUtil:
    @staticmethod
    def delimit_content(content: str) -> list:
        """
        Delimit content using 'Filename' and return an array of content blocks
        """
        # Split content by 'Filename:'
        content_blocks = re.split(r"Filename:", content)[
            1:
        ]  # Skip the first empty element

        # Reconstruct each block with 'Filename:' prefix
        delimited_content = [f"Filename:{block.strip()}" for block in content_blocks]

        print("Delimited Content Blocks:")
        for block in delimited_content:
            print(block)
            print("---")

        return delimited_content

    @staticmethod
    def summarize_content_block(model, content_block: str) -> str:
        """
        Generate summary for a single content block
        """
        try:
            prompt = f"Provide a concise and comprehensive summary of the following content:\n{content_block}"
            result = model.generate_content(prompt).text
            return result
        except Exception as error:
            print(f"Error generating summary: {error}")
            return f"Error generating summary: {str(error)}"

    @staticmethod
    def process_content(model, content: str) -> str:
        """
        Main method to process content
        """
        # 1. Delimit content
        delimited_blocks = DocumentRetrievalUtil.delimit_content(content)

        # 2. Summarize each block with 3-second gap
        summary_array = []
        for block in delimited_blocks:
            summary = DocumentRetrievalUtil.summarize_content_block(model, block)
            summary_array.append(summary)
            time.sleep(3)  # 3-second gap between API requests

        # 3. Concatenate summaries
        summary_concat = "\n\n".join(summary_array)

        # 4. Get final summary of all summaries
        final_summary_prompt = f"Provide a comprehensive and concise overview of these summaries:\n{summary_concat}"
        final_summary = model.generate_content(final_summary_prompt).text

        return final_summary


@app.route("/api/summarize", methods=["POST"])
def summarize_content():
    """
    API endpoint to receive content and return a summary
    """
    try:
        # Get JSON data from the request
        data = request.json

        # Validate input
        if not data or "content" not in data:
            return jsonify({"error": "No content provided", "status": "failed"}), 400

        # Extract content
        content = data["content"]

        # Validate content length
        if len(content) < 10:
            return jsonify({"error": "Content is too short", "status": "failed"}), 400

        # Generate summary
        summary = DocumentRetrievalUtil.process_content(model, content)

        # Return successful response
        return jsonify({"summary": summary, "status": "success"}), 200

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({"error": str(e), "status": "failed"}), 500


# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500


# Configuration and Run
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
