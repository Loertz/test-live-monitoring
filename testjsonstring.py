import json

activity_data = {
    str(i): {
        "name": "Johnny",
        "n": i,
        "lastEvent": "ABSENCE",
        "tempsdemarche": 0,
        "acti": ""
    }
    for i in range(1, 16)
}
print(activity_data)
for value,val in activity_data :
    print( value)

