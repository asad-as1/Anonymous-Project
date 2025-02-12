from flask import Flask
from flask_cors import CORS
from TakeATest import take_a_test_bp
from Summarization import summarization_bp

app = Flask(__name__)

# Allow requests from your frontend domain
CORS(app, resources={r"/*": {"origins": "https://eduaccess-as2.netlify.app"}})

# Register Blueprints
app.register_blueprint(take_a_test_bp)
app.register_blueprint(summarization_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
