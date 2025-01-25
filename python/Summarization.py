from flask import Blueprint, request, jsonify
from transformers import pipeline
import torch

summarization_bp = Blueprint('summarization', __name__)

# Check if GPU is available and set device accordingly
device = 0 if torch.cuda.is_available() else -1

# Load the summarization model once during startup
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", device=device)

@summarization_bp.route('/summarize', methods=['POST'])
def summarize_text():
    try:
        data = request.json
        text = data.get("text", "")
        
        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Limit the length of the text
        if len(text) > 1024:
            text = text[:1024]

        min_length = max(len(text) // 4, 50)
        max_length = len(text) // 2

        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        summarized_text = summary[0]['summary_text']

        return jsonify({"summary": summarized_text})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
