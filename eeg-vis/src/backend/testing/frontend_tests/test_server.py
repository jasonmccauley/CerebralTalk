from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/send_string", methods=["POST"])
def send_string():
    return jsonify({'message' : 'Hello from Flask!'})

if __name__ == '__main__':
    app.run(port=5001)
