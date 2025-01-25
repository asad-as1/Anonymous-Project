from flask import Flask
from flask_cors import CORS
from TakeATest import take_a_test_bp
from Summarization import summarization_bp

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Register Blueprints
app.register_blueprint(take_a_test_bp)
app.register_blueprint(summarization_bp)

if __name__ == "__main__":
    app.run(debug=True , use_reloader=False)
