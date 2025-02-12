from flask import Blueprint, request, jsonify
from transformers import pipeline, BartTokenizer
import torch
import spacy
from collections import Counter
import re

summarization_bp = Blueprint('summarization', __name__)

# Check if GPU is available and set device accordingly
device = 0 if torch.cuda.is_available() else -1

# Load the summarization model once during startup
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=device)

# Load spaCy's English model for NLP tasks
nlp = spacy.load("en_core_web_sm")

# Helper function to preprocess text using spaCy
def preprocess_text(text):
    # Remove extra spaces, newlines, and special characters
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with a single space
    text = re.sub(r'\n', ' ', text)   # Replace newlines with spaces
    text = text.strip()               # Remove leading/trailing spaces
    return text

# Helper function to extract key sentences using NLP
def extract_key_sentences(text, max_sentences=5):
    # Use spaCy to process the text
    doc = nlp(text)
    
    # Score sentences based on word frequency
    word_frequencies = Counter()
    for token in doc:
        if not token.is_stop and not token.is_punct and not token.is_space:
            word_frequencies[token.lemma_] += 1

    # Score sentences based on the sum of word frequencies
    sentence_scores = {}
    for sent in doc.sents:
        for token in sent:
            if token.lemma_ in word_frequencies:
                if sent not in sentence_scores:
                    sentence_scores[sent] = word_frequencies[token.lemma_]
                else:
                    sentence_scores[sent] += word_frequencies[token.lemma_]

    # Sort sentences by score and select the top N sentences
    sorted_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)
    key_sentences = [str(sent).strip() for sent in sorted_sentences[:max_sentences]]
    
    return " ".join(key_sentences)

# Helper function to postprocess the summary
def postprocess_summary(summary):
    # Remove repetitive phrases or incoherent sentences
    sentences = summary.split('. ')
    unique_sentences = []
    for sentence in sentences:
        if sentence not in unique_sentences:  # Avoid duplicates
            unique_sentences.append(sentence)
    return '. '.join(unique_sentences).strip()

# Helper function to process the text for token length
def get_token_length(text, tokenizer):
    # Tokenize text and return the number of tokens
    inputs = tokenizer.encode(text, truncation=True, padding=True)
    return len(inputs)

@summarization_bp.route('/summarize', methods=['POST'])
def summarize_text():
    try:
        data = request.json
        text = data.get("text", "")
        
        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Preprocess the input text
        processed_text = preprocess_text(text)

        # Initialize the tokenizer for BART model
        tokenizer = summarizer.tokenizer

        # Ensure the tokenized text doesn't exceed the model's limit (1024 tokens)
        token_length = get_token_length(processed_text, tokenizer)
        if token_length > 1024:
            # Tokenize and truncate if necessary
            processed_text = tokenizer.decode(tokenizer.encode(processed_text)[:1024])

        # Extract key sentences using NLP
        key_sentences = extract_key_sentences(processed_text)

        # Calculate min_length to be at least 1/2 of the original text length
        original_text_length = len(processed_text.split())  # Split by whitespace to get word count
        min_length = max(original_text_length // 2, 30)  # Minimum 1/2 of original text, but at least 30 tokens
        max_length = original_text_length  # Max length is the full original text length (or slightly less)

        # Generate the summary
        summary = summarizer(key_sentences, max_length=max_length, min_length=min_length, do_sample=False)
        summarized_text = summary[0]['summary_text']

        # Postprocess the summary to remove useless text
        final_summary = postprocess_summary(summarized_text)

        return jsonify({"summary": final_summary})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
