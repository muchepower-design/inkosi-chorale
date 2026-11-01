from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from controllers.applicant_controller import ApplicantController
from controllers.auth_controller import AuthController

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=Config.CORS_ORIGINS)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Inkosi Chorale API is running'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    result = ApplicantController.register_applicant(data)
    status_code = 201 if result['success'] else 400
    return jsonify(result), status_code

@app.route('/api/applicants', methods=['GET'])
def get_applicants():
    applicants = ApplicantController.get_all_applicants()
    return jsonify({'success': True, 'applicants': applicants})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    stats = ApplicantController.get_stats()
    return jsonify({'success': True, 'stats': stats})

@app.route('/api/applicants/<int:applicant_id>/status', methods=['PUT'])
def update_status(applicant_id):
    data = request.json
    result = ApplicantController.update_status(applicant_id, data.get('status'))
    return jsonify(result)

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    result = AuthController.login(data.get('username'), data.get('password'))
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)