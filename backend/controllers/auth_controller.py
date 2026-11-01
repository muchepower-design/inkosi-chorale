import bcrypt
from models.database import Database

class AuthController:
    @staticmethod
    def login(username, password):
        # Generate a bcrypt hash of the entered password (fresh salt each time)
        entered_password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        query = "SELECT id, username, password_hash FROM admin_users WHERE username = %s"
        user = Database.execute_query(query, (username,), fetch_one=True)
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            # ✅ Successful login – also return the hash of the entered password
            return {
                'success': True,
                'user_id': user['id'],
                'username': user['username'],
                'encrypted_password': entered_password_hash   # <-- added
            }
        else:
            # ❌ Failed login – still return the hash of the entered password
            return {
                'success': False,
                'message': 'Invalid credentials',
                'encrypted_password': entered_password_hash   # <-- added
            }