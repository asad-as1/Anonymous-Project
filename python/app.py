from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://eduaccess-as2.netlify.app"}})

# Configure Google Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyDUYC19umF7AZYUEHdMTCeTS0qQ5Lcd_eY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def log_request(endpoint, input_data):
    """Utility function to log API requests"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] Request to {endpoint}")
    print(f"Input data: {input_data}")

def log_response(endpoint, response):
    """Utility function to log API responses"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] Response from {endpoint}")
    print(f"Response: {response}")

@app.route('/', methods=['GET'])
def home():
    """Health check route"""
    return jsonify({"message": "API is running!", "status": "success"}), 200

@app.route('/summarize', methods=['POST'])
def summarize_text():
    try:
        data = request.get_json()
        if not data or 'text' not in data or 'prompt' not in data:
            return jsonify({
                'error': 'Missing required fields. Please provide both text and prompt.'
            }), 400

        text = data['text']
        custom_prompt = data['prompt']

        log_request('/summarize', {'text_length': len(text), 'prompt': custom_prompt})

        full_prompt = f"""
        {custom_prompt}
        
        Text to summarize:
        {text}
        """

        response = model.generate_content(full_prompt)
        summary = response.text

        result = {
            'summary': summary,
            'original_length': len(text),
            'summary_length': len(summary)
        }

        log_response('/summarize', result)
        return jsonify(result)

    except Exception as e:
        error_message = f"Error in summarization: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500

@app.route('/compare', methods=['POST'])
def compare_texts():
    try:
        data = request.get_json()
        if not data or 'reference_text' not in data or 'comparison_text' not in data:
            return jsonify({
                'error': 'Missing required fields. Please provide both reference_text and comparison_text.'
            }), 400

        reference_text = data['reference_text']
        comparison_text = data['comparison_text']

        log_request('/compare', {
            'reference_length': len(reference_text),
            'comparison_length': len(comparison_text)
        })

        comparison_prompt = f"""
        Task: Compare the following two texts and provide:
        1. A similarity score between 0 and 100
        2. A detailed analysis of the comparison
        3. Specific reasons for the score

        Reference Text:
        {reference_text}

        Text to Compare:
        {comparison_text}

        Please format your response as follows:
        Score: [number]
        Analysis: [detailed analysis]
        Reasons: [bullet points of specific reasons]
        """

        response = model.generate_content(comparison_prompt)
        comparison_result = response.text

        lines = comparison_result.split('\n')
        score = None
        analysis = ""
        reasons = []

        current_section = None
        for line in lines:
            if line.startswith('Score:'):
                score = float(line.replace('Score:', '').strip())
            elif line.startswith('Analysis:'):
                current_section = 'analysis'
            elif line.startswith('Reasons:'):
                current_section = 'reasons'
            elif line.strip() and current_section:
                if current_section == 'analysis':
                    analysis += line + "\n"
                elif current_section == 'reasons':
                    reasons.append(line.strip())

        result = {
            'similarity_score': score,
            'analysis': analysis.strip(),
            'reasons': reasons,
            'reference_length': len(reference_text),
            'comparison_length': len(comparison_text)
        }

        log_response('/compare', result)
        return jsonify(result)

    except Exception as e:
        error_message = f"Error in comparison: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500

if __name__ == '__main__':
    if not GOOGLE_API_KEY:
        raise ValueError("Please set the GOOGLE_API_KEY environment variable")

    port = int(os.environ.get("PORT", 10000))  # Use Render's provided port or default to 10000
    print("Starting Flask API server...")
    print("Available endpoints:")
    print("1. GET / - Health check")
    print("2. POST /summarize - Text summarization")
    print("3. POST /compare - Text comparison")
    
    app.run(host="0.0.0.0", port=port, debug=True)
