from models.database import Database

class Applicant:
    @staticmethod
    def create(data):
        query = """
            INSERT INTO applicants (full_name, email, phone, church_origin, district, 
                                    voice_type, age, song_choice_1, song_choice_2, inkhosi_song)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        params = (
            data['full_name'], data['email'], data['phone'],
            data['church_origin'], data['district'], data['voice_type'],
            data['age'], data['song_choice_1'], data['song_choice_2'],
            data['inkhosi_song']
        )
        result = Database.execute_query(query, params, fetch_one=True)
        return result[0] if result else None
    
    @staticmethod
    def get_all():
        query = "SELECT * FROM applicants ORDER BY registration_date DESC"
        return Database.execute_query(query, fetch_all=True)
    
    @staticmethod
    def get_by_id(applicant_id):
        query = "SELECT * FROM applicants WHERE id = %s"
        return Database.execute_query(query, (applicant_id,), fetch_one=True)
    
    @staticmethod
    def update_status(applicant_id, status):
        query = "UPDATE applicants SET status = %s WHERE id = %s"
        Database.execute_query(query, (status, applicant_id))
    
    @staticmethod
    def get_stats():
        query = """
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
                COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN voice_type = 'Soprano' THEN 1 END) as soprano,
                COUNT(CASE WHEN voice_type = 'Alto' THEN 1 END) as alto,
                COUNT(CASE WHEN voice_type = 'Tenor' THEN 1 END) as tenor,
                COUNT(CASE WHEN voice_type = 'Bass' THEN 1 END) as bass
            FROM applicants
        """
        return Database.execute_query(query, fetch_one=True)