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


REDIS_URL = os.environ['REDIS_URL']
REDIS_CHAN = 'chat'

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ

sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)


class ChatBackend(object):
    """Interface for registering and updating WebSocket clients."""

    def __init__(self):
        self.clients = list()
        self.pubsub = redis.pubsub()
        self.pubsub.subscribe(REDIS_CHAN)
        self.activity_data = json.dumps(
            {
                str(i): {
                    'name': 'Johnny',
                    'n': i,
                    'lastEvent': 'ABSENCE',
                    'tempsdemarche': 0,
                    'acti': ''
                }
                for i in range(1, 16)
            })

    def __iter_data(self):
        for message in self.pubsub.listen():
            data = message.get('data')
            if message['type'] == 'message':
                # app.logger.info(u'Sending message: {}'.format(data))
                yield data

    def register(self, client):
        """Register a WebSocket connection for Redis updates."""
        self.clients.append(client)
        message = self.update()
        # app.logger.info(u'Inserting message: {}'.format(message))
        redis.publish(REDIS_CHAN, message)

    def send(self, client, data):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        try:
            client.send(data)
        except Exception:
            self.clients.remove(client)

    def run(self):
        """Listens for new messages in Redis, and sends them to clients."""
        for data in self.__iter_data():
            for client in self.clients:
                gevent.spawn(self.send, client, data)

    def run_regularly(self, function, interval, *args, **kwargs):
        while True:
            before = time.time()
            function(*args, **kwargs)

            for client in self.clients:
                gevent.spawn(self.send, client, self.activity_data)

            duration = time.time() - before
            if duration < interval:
                gevent.sleep(interval - duration)

    def update(self):

        activity_data = {
            string(i): {
                "name": "Johnny",
                "n": i,
                "lastEvent": "ABSENCE",
                "tempsdemarche": 0,
                "acti": ""
            }
            for i in range(1, 16)
        }

        urlbase = 'http://care.floorinmotion.com/api/' + 'monitoring/I4.A.'
        eventactif = ('BEDROOM', 'BATHROOM', 'FALL')

        cookies = {
            'AWSELB': '8BCBC7510619CE27DBBB694C8CC7E2F7DBEB7FF9997C562F58EF73D4C9B622B6CAF89A6E1F6146C1DFBCA6F975C6A21363A378B900A183886E855F85B3F76B607892CC1D99100F3545F02F3166B37746BF29432B23',
            'JSESSIONID': '736FEE21BD03C31BCDDDAE9D9858D265',
            '_ga': "GA1.3.755786443.1493122168",
            '_gid': "GA1.3.903882648.1494921861",
        }

        rs = (grequests.get(
            urlbase + str(value["n"]),
            cookies=cookies
        )
            for value in activity_data
        )

        answer = grequests.map(rs)
        data = activity_data

        for i, room in enumerate(data):
            ro_n = json.loads(answer[int(i)].text)
            room["lastEvent"] = ro_n["room"]["lastEvent"]
            if room["lastEvent"] in eventactif:
                room["acti"] += "1"
            else:
                room["acti"] += "0"

            if "00000" in room["acti"] or "1" not in room["acti"]:
                room["tempsdemarche"] = 0
                room["acti"] = ""
            else:
                room["tempsdemarche"] = int(len(room["acti"]) / 5) * 5
            # update data

        message = json.dumps(data)
        # app.logger.info(u'Inserting message: {}'.format(message))
        redis.publish(REDIS_CHAN, message)

        return data

    def start(self):
        """Maintains Redis subscription in the background."""
        gevent.spawn(self.run)


chats = ChatBackend()
chats.start()


@app.route('/')
def hello():
    return render_template('index.html')


@sockets.route('/receive')
def outbox(ws):
    """Sends outgoing chat messages, via `ChatBackend`."""
    chats.register(ws)

    while not ws.closed:

        # Context switch while `ChatBackend.start'
        # is running in the background.
        gevent.sleep(0.1)
