from models.applicant import Applicant
from utils.email_sender import EmailSender
import re


class ApplicantController:

    @staticmethod
    def register_applicant(data):
        # Validation (same as before)
        errors = []

        if not data.get('full_name') or len(data['full_name']) < 3:
            errors.append("Full name is required (minimum 3 characters)")

        if not data.get('email') or not re.match(
            r'^[^@]+@[^@]+\.[^@]+$',
            data['email']
        ):
            errors.append("Valid email is required")

        if not data.get('phone') or len(data['phone']) < 9:
            errors.append("Valid phone number is required")

        if not data.get('church_origin'):
            errors.append("Church of origin is required")

        if not data.get('district'):
            errors.append("District is required")

        valid_voices = ['Soprano', 'Alto', 'Tenor', 'Bass']

        if (
            not data.get('voice_type')
            or data['voice_type'] not in valid_voices
        ):
            errors.append(
                f"Voice type must be one of: {', '.join(valid_voices)}"
            )

        try:
            age = int(data.get('age', 0))

            if age < 18:
                errors.append("Must be 18 years or older")

        except Exception:
            errors.append("Valid age is required")

        if errors:
            return {
                'success': False,
                'errors': errors
            }

        try:
            # Save to database
            applicant_id = Applicant.create(data)

            # Send confirmation email
            email_data = data.copy()
            email_data['id'] = applicant_id

            email_sent = EmailSender.send_confirmation_email(email_data)

            if email_sent:
                return {
                    'success': True,
                    'message': (
                        'Registration successful! '
                        'A confirmation email has been sent to your inbox.'
                    ),
                    'id': applicant_id
                }

            else:
                return {
                    'success': True,
                    'message': (
                        'Registration successful! '
                        '(Email could not be sent, but your registration '
                        'is recorded. Please contact us.)'
                    ),
                    'id': applicant_id
                }

        except Exception as e:

            if 'duplicate key' in str(e).lower():
                return {
                    'success': False,
                    'errors': ['Email already registered']
                }

            return {
                'success': False,
                'errors': ['Registration failed. Please try again.']
            }

    @staticmethod
    def get_all_applicants():
        applicants = Applicant.get_all()
        return [dict(app) for app in applicants]

    @staticmethod
    def get_stats():
        stats = Applicant.get_stats()
        return dict(stats) if stats else {}

    @staticmethod
    def update_status(applicant_id, status):

        if status not in ['pending', 'approved', 'rejected']:
            return {
                'success': False,
                'message': 'Invalid status'
            }

        Applicant.update_status(applicant_id, status)

        return {
            'success': True,
            'message': 'Status updated'
        }