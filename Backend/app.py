from flask import Flask, jsonify
from real_analyzer import analyze_latest_event, get_recent_events

app = Flask(__name__)

@app.route("/")
def home():
    return "AI-SOC Backend Running!"

@app.route("/analyze")
def analyze():

    result = analyze_latest_event()

    return jsonify({
        "status": "success",
        "analysis": result
    })

@app.route("/events")
def events():

    return jsonify({
        "status": "success",
        "events": get_recent_events()
    })

if __name__ == "__main__":
    app.run(debug=True)