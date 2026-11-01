import psycopg2
import psycopg2.extras
from config import Config

class Database:
    _instance = None
    
    @classmethod
    def get_connection(cls):
        if cls._instance is None:
            cls._instance = psycopg2.connect(
                host=Config.DB_HOST,
                port=Config.DB_PORT,
                database=Config.DB_NAME,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                cursor_factory=psycopg2.extras.DictCursor
            )
        return cls._instance
    
    @classmethod
    def execute_query(cls, query, params=None, fetch_one=False, fetch_all=False):
        conn = cls.get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, params or ())
                if fetch_one:
                    result = cursor.fetchone()
                elif fetch_all:
                    result = cursor.fetchall()
                else:
                    result = None
                conn.commit()
                return result
        except Exception as e:
            conn.rollback()
            raise e