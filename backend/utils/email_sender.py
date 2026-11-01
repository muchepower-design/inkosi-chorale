import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config

class EmailSender:
    @staticmethod
    def send_confirmation_email(applicant_data):
        """Send audition confirmation email to applicant"""
        subject = "Inkosi Chorale Audition Registration Confirmation"
        
        # HTML email body
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #1B2A4A; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
                .footer {{ text-align: center; padding: 10px; font-size: 12px; color: #777; }}
                .details {{ background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }}
                .label {{ font-weight: bold; color: #1B2A4A; }}
                .gold {{ color: #C5A028; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Inkosi Chorale</h2>
                    <p>Seventh-Day Adventist Church</p>
                </div>
                <div class="content">
                    <h3>Dear {applicant_data['full_name']},</h3>
                    <p>Thank you for registering for the <strong>Inkosi Chorale Auditions 2026</strong>!</p>
                    <p>We have received your application. Below are your registration details:</p>
                    
                    <div class="details">
                        <p><span class="label">📅 Audition Date:</span> <strong>14th June 2026</strong></p>
                        <p><span class="label">📍 Venue:</span> <strong>To Be Announced (TBA)</strong> - Check your email for updates</p>
                        <p><span class="label">🎵 Voice Part:</span> <strong>{applicant_data['voice_type']}</strong></p>
                        <p><span class="label">🏫 Church of Origin:</span> {applicant_data['church_origin']}</p>
                        <p><span class="label">📍 District:</span> {applicant_data['district']}</p>
                    </div>
                    
                    <h4>🎤 Audition Requirements:</h4>
                    <ul>
                        <li>✓ Learn and sing <strong>1 song from Inkhosi Chorale</strong> repertoire: <em>"{applicant_data['inkhosi_song']}"</em></li>
                        <li>✓ Prepare <strong>2 songs of your choice</strong>: 
                            <ul><li>"{applicant_data['song_choice_1']}"</li><li>"{applicant_data['song_choice_2']}"</li></ul>
                        </li>
                        <li>✓ Be committed, quick to learn, and active in your local church music ministry</li>
                        <li>✓ Age 18 years and above (you are {applicant_data['age']})</li>
                    </ul>
                    
                    <p>Your registration ID is <strong>#{applicant_data.get('id', 'pending')}</strong>. Please keep this for reference.</p>
                    <p>We will notify you of the exact venue and time via email and SMS. Make sure to check your inbox regularly.</p>
                    
                    <p style="margin-top: 20px;">May God bless your musical journey!</p>
                    <p><strong>Inkosi Chorale Team</strong><br>
                    Seventh-Day Adventist Church - Chupata District of EZF</p>
                </div>
                <div class="footer">
                    <p>© 2026 Inkosi Chorale | Serving through music</p>
                    <p>If you did not register for these auditions, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_text = f"""
        Inkosi Chorale - Audition Registration Confirmation
        
        Dear {applicant_data['full_name']},
        
        Thank you for registering for the Inkosi Chorale Auditions 2026!
        
        Registration Details:
        - Audition Date: 14th June 2026
        - Venue: TBA (check email for updates)
        - Voice Part: {applicant_data['voice_type']}
        - Church: {applicant_data['church_origin']}
        - District: {applicant_data['district']}
        
        Requirements:
        - Learn 1 Inkhosi Chorale song: "{applicant_data['inkhosi_song']}"
        - Prepare 2 songs of your choice: "{applicant_data['song_choice_1']}" and "{applicant_data['song_choice_2']}"
        - Age: {applicant_data['age']} (must be 18+)
        
        Your registration ID: #{applicant_data.get('id', 'pending')}
        
        We will notify you of the venue soon.
        
        Inkosi Chorale Team
        SDA Church - Chupata District
        """
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = Config.MAIL_DEFAULT_SENDER
        msg['To'] = applicant_data['email']
        
        # Attach plain text and HTML versions
        part1 = MIMEText(plain_text, 'plain')
        part2 = MIMEText(html_content, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        try:
            with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as server:
                if Config.MAIL_USE_TLS:
                    server.starttls()
                if Config.MAIL_USERNAME and Config.MAIL_PASSWORD:
                    server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
                server.send_message(msg)
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False