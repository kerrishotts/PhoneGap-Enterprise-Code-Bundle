#!/usr/bin/python
#Copyright (c) 2014 ProcessOne

from hashlib import sha1
from urlparse import urlparse
from urllib import urlencode
from time import time
import hmac
import urllib2
import json
from APIKeys import ACCESS_KEY, SECRET_KEY

ENDPOINT =  "https://boxcar-api.io"

# Push to send.  See documentation for full list of options
push = { "taskId": "21" ,
	"foreground": "1",
	"f": "0",
	"i": "17327",
	"badge": "auto",
	"sound": "1.caf",
	"priority": "normal",
        "aps" : {
            "alert" : "Hello World!"
            },
        "expires" : str(int(time() + 30)),
        "tags" : ["_general"]
        }
payload = json.dumps(push)

# Calculate signature.
str_to_sign = "%s\n%s\n%s\n%s" % ("POST", urlparse(ENDPOINT).hostname, "/api/push", payload)
h = hmac.new(SECRET_KEY, str_to_sign, sha1)
signature = h.hexdigest()

# Perform request
params = urlencode({"publishkey": ACCESS_KEY , "signature" : signature})
req = urllib2.Request("%s/api/push?%s" % (ENDPOINT, params))
req.add_header("Content-Type", "application/json")
response = urllib2.urlopen(req, payload)
"Got: \n %s" % response.read()
