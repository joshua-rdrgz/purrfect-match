# this is my den
import os
from twilio.rest import Client
var = []

try:
    with open('varTransfer.txt') as doc:
        for i in range(14):
            var.append(doc.readline().strip("\n"))

except:
    print("No File Found.")

else:
    print(var)


    name = var[2]
    breed = var[3]
    gender = var[4]
    color = var[5]
    coat = var[6]
    status = var[7]
    size = var[8]
    age = var[9]
    location = var[10]
    distance = var[11]
    organization = var[12]



    account_sid = var[0]
    auth_token = var[1]
    client = Client(account_sid, auth_token)
    message = client.messages \
                    .create(
                         body=f"{name} is a {size}, {age}, {gender} {breed} with a {color}, {coat} coat. They are {status}, and can be found at {organization} {location}",
                         from_='+18337760303',
                         to=var[13]
                     )

    print(message.sid)
    os.remove("varTransfer.txt")