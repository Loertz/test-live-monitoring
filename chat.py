# -*- coding: utf-8 -*-

"""
Chat Server
===========
This simple application uses WebSockets to run a primitive chat server.
"""

import os
import logging
import redis
import gevent
from flask import Flask, render_template
from flask_sockets import Sockets

import json
import grequests
import time
import random


REDIS_URL = os.environ['REDIS_URL']
REDIS_CHAN = 'chat'

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ

sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)
redis.set('before', time.time())
redis.set('activity_data', json.dumps([
    {
        "name": "Johnny",
        "n": i,
        "lastEvent": "BEDROOM",
        "tmc": 0,
        "acti": ""
    }
    for i in range(111, 116)
]))


class LiveMonitoringBackend(object):
    """Interface for registering and updating WebSocket clients."""

    def __init__(self):
        self.clients = list()
        self.pubsub = redis.pubsub()
        self.pubsub.subscribe(REDIS_CHAN)

    def __iter_data(self):
        for message in self.pubsub.listen():
            data = message.get('data')
            if message['type'] == 'message':
                # app.logger.info(u'Sending message: {}'.format(data))
                yield data

    def register(self, client):
        """Register a WebSocket connection for Redis updates."""
        self.clients.append(client)
        # app.logger.info(u'Inserting message: {}'.format(message))
        # gevent.spawn(self.send, client, redis.get('activity_data'))

    def send(self, client, data):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        try:
            client.send(data)
            print('essay :')
            print(client)
        except Exception:
            print('echec : ')
            print(client)
            self.clients.remove(client)

    def run(self):
        """Listens for new messages in Redis, and sends them to clients."""
        for data in self.__iter_data():
            for client in self.clients:
                gevent.spawn(self.send, client, data)

    def run_time(self, function, interval, *args, **kwargs):
        while True:
            duration = time.time() - float(redis.get('before'))

            if duration > interval:
                print(duration)
                function(*args, **kwargs)
                redis.set('before', time.time())
                print('updated')
                redis.publish(REDIS_CHAN, redis.get('activity_data'))
            gevent.sleep(interval / 10)

    def update(self):

        # urlbase = 'http://care.floorinmotion.com/api/' + 'monitoring/I4.A.'
        urlbase = 'http://front.recipe.fim-team.net/api/monitoring/room/FMDEV.'

        eventactif = ('BEDROOM', 'BATHROOM', 'FALL')
        evenement = ('BEDROOM', 'BATHROOM', 'FALL', 'ABSENCE', 'PRESENCE')

        cookies = {
        'JSESSIONID': '484886F867C4463491FDD873208123DC',
        'AWSELB': '9913C50D10591FEE0CB0FFE69B89039701A79A2DE3E111BBCD0B4DFBAD1D8FCBE394CBFC2A759087B985EF5DAA1553D995017A7A1171AF03E432638AB9F7D019635067608A737F9545C2E17DE5B43AEAF0B54BC5FD',
        '_gat': '1 ',
        '_ga': 'GA1.4.1335402241.1496105804',
         '_gid': 'GA1.4.730554077.1496142416'
        }

        # Genere les urls pour les pool des données
        rs = (grequests.get(
            urlbase + str(key["n"]),
            cookies=cookies
        )
            for key in json.loads(redis.get('activity_data'))
        )

        # Fais la requetes des données et les stocke sous
        # answer = (reponse1,reponse2,...,response n)
        answer = grequests.map(rs)

        data = json.loads(redis.get('activity_data'))
        # print(answer)
        i = 0
        # # pour chaque chambre de la liste
        for room in data:

            ro_n = json.loads(answer[i].text)
            i += 1
            # Update last event for each room
            print(ro_n)

            # Random last event for each room
            room['lastEvent'] = random.choice(evenement)

            if room['lastEvent'] in eventactif:
                room['acti'] += '1'
            else:
                room['acti'] += '0'

            if '00000' in room['acti'] or '1' not in room['acti']:
                room['tmc'] = 0
                room['acti'] = ''
            else:
                room['tmc'] = int(len(room['acti']) / 5) * 5
            # update data

        # print(data)

        # Trie les chambres par actvités
        data = sorted(data, key=lambda room: room['tmc'])[::-1]

        redis.set('activity_data', json.dumps(data))
        # app.logger.info(u'Inserting message: {}'.format(message))
        # redis.publish(REDIS_CHAN, message)

        return True

    def start(self):
        """Maintains Redis subscription in the background."""
        gevent.spawn(self.run)
        gevent.spawn(self.run_time, self.update, 60)


livemonitoring = LiveMonitoringBackend()
livemonitoring.start()


@app.route('/')
def hello():
    return render_template('index.html')
    redis.publish(REDIS_CHAN, redis.get('activity_data'))
# @sockets.route('/submit')
# def inbox(ws):
#     """Receives incoming chat messages, inserts them into Redis."""
#     while not ws.closed:
#         # Sleep to prevent *contstant* context-switches.
#         gevent.sleep(0.1)
#         message = ws.receive()

#         if message:
#             app.logger.info(u'Inserting message: {}'.format(message))
#             redis.publish(REDIS_CHAN, message)


@sockets.route('/receive')
def outbox(ws):
    """Sends outgoing chat messages, via `LiveMonitoringBackend`."""
    livemonitoring.register(ws)

    while not ws.closed:

        # Context switch while `LiveMonitoringBackend.start'
        # is running in the background.
        gevent.sleep(0.1)
