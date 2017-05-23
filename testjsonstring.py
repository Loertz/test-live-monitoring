import json
import grequests


def update():

    activity_data = [
        {
            "name": "Johnny",
            "n": i,
            "lastEvent": "ABSENCE",
            "tmc": 0,
            "acti": ""
        }
        for i in range(1, 16)
    ]

    urlbase = 'http://care.floorinmotion.com/api/' + 'monitoring/I4.A.'
    eventactif = ('BEDROOM', 'BATHROOM', 'FALL')

    cookies = {
        'AWSELB': '8BCBC7510619CE27DBBB694C8CC7E2F7DBEB7FF9997C562F58EF73D4C9B622B6CAF89A6E1F6146C1DFBCA6F975C6A21363A378B900A183886E855F85B3F76B607892CC1D99100F3545F02F3166B37746BF29432B23',
        'JSESSIONID': '736FEE21BD03C31BCDDDAE9D9858D265',
        '_ga': "GA1.3.755786443.1493122168",
        '_gid': "GA1.3.903882648.1494921861",
    }

     # Genere les urls pour les pool des données
    rs = (grequests.get(
        urlbase + str(key["n"]),
        cookies=cookies
    )
        for key in activity_data
    )

    # Fais la requetes des données et les stocke sous
    # answer = (reponse1,reponse2,...,response n)
    answer = grequests.map(rs)
    data = activity_data
    # print(answer)
    # pour chaque chambre de la liste
    for room in data:

        # print(answer[int(room["n"])].text)
        ro_n = json.loads(answer[int(room["n"])-1].text)
        room['lastEvent'] = ro_n['room']['lastEvent']
        if room['lastEvent'] in eventactif:
            room['acti'] += '1'
        else:
            room['acti'] += '0'

        if '00000' in room['acti'] or '1' not in room['acti']:
            room['tempsdemarche'] = 0
            room['acti'] = ''
        else:
            room['tempsdemarche'] = int(len(room['acti']) / 5) * 5
        # update data
    print(data)

    message = json.dumps(data)
    print(message)
# a = {"isDay":true,"room":{"department":"A","room":2,"roomId":"I4.A.2","fallCount":0,"exitCount":0,"intrusionCount":0,"getUpCount":null,"bathroomCount":null,"nightActivity":"1970-01-01T00:03:00.000Z","nightActivityInBedroom":"1970-01-01T00:01:00.000Z","lastTimeFall":null,"lastTimeExit":null,"lastTimeIntrusion":null,"latestAlert":null,"deviceIsDisabled":false,"intrusionAlarmActivated":true,"lastEvent":"ABSENCE"}}

# print(type(json.loads(a)))
# print(null)
update()
