from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def test_homepage(self):
        with app.test_client() as client:
            res = client.get('/')

            self.assertEqual(res.status_code, 200)
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('timesPlayed'))

    def test_valid_words(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['board'] = [["C", "A", "T", "T", "T"], 
                ["C", "A", "T", "T", "T"], 
                ["C", "A", "T", "T", "T"], 
                ["C", "A", "T", "T", "T"], 
                ["C", "A", "T", "T", "T"]]

    def test_end_game(self):
        with app.test_client() as client:
            res = client.get('/post-score')

            self.assertLess('timesPlayed', 'timesPlayed + 1')

            