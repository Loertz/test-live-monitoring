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
    for i in range(1, 16)
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
            print(duration)
            if duration > interval:
                function(*args, **kwargs)
                redis.set('before', time.time())
                print('updated')
                redis.publish(REDIS_CHAN, redis.get('activity_data'))
            gevent.sleep(interval)

    def update(self):

        # urlbase = 'http://care.floorinmotion.com/api/' + 'monitoring/I4.A.'
        eventactif = ('BEDROOM', 'BATHROOM', 'FALL')
        evenement = ('BEDROOM', 'BATHROOM', 'FALL', 'ABSENCE', 'PRESENCE')
        # cookies = {
        #     'AWSELB':
# '8BCBC7510619CE27DBBB694C8CC7E2F7DBEB7FF9997C562F58EF73D4C9B622B6CAF89A6E1F6146C1DFBCA6F975C6A21363A378B900A183886E855F85B3F76B607892CC1D99100F3545F02F3166B37746BF29432B23',
        #     'JSESSIONID': '736FEE21BD03C31BCDDDAE9D9858D265',
        #     '_ga': "GA1.3.755786443.1493122168",
        #     '_gid': "GA1.3.903882648.1494921861",
        # }

        # # Genere les urls pour les pool des données
        # rs = (grequests.get(
        #     urlbase + str(key["n"]),
        #     cookies=cookies
        # )
        #     for key in redis.get('activity_data')
        # )

        # # Fais la requetes des données et les stocke sous
        # # answer = (reponse1,reponse2,...,response n)
        # answer = grequests.map(rs)
        data = json.loads(redis.get('activity_data'))
        # print(answer)

        # # pour chaque chambre de la liste
        for room in data:

            # print(answer[int(room["n"])].text)
            # ro_n = json.loads(answer[int(room["n"]) - 1].text)

            # Update last event for each room
            # room['lastEvent'] = ro_n['room']['lastEvent']

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
