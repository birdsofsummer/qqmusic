import time
import subprocess
import json
import os

COS_URL="https://ttt-1252957949.cos.ap-hongkong.myqcloud.com/music/jeff.json"
MUSIC_PATH="/tmp/log/jeff.json"

def read_json(path=MUSIC_PATH):
    with open(path) as f:
        z=f.read()
        s=json.loads(z)
        return s

def write_json(path=MUSIC_PATH,d=""):
    with open(path,"w") as f:
        f.write(d)

def update_music_url(u=COS_URL):
    import requests
    a=requests.get(u)
    if a.ok:
        return a.json()
    else:
        return []

def update_music_url1(u=COS_URL):
    subprocess.call(["curl",u,"-o",MUSIC_PATH])

def loop(songs=[]):
    i=0
    for s in songs:
        print i
        print s
        play(s)
        interval=s["interval"]
        time.sleep(interval)
        i=i+1

def shuffle(arr=[]):
    import random
    random.shuffle(arr)
    loop(arr)

def play(song={}):
    url=song['url']
    u=json.dumps({"url":url,"type":1})
    #interval=song["interval"]
    #subprocess.call(["ls","/tmp"])
    subprocess.call(["ubus"] + "-t 1 call mediaplayer player_play_url".split(' ') + [u])

def start(rand=True):
    if os.path.exists(MUSIC_PATH):
        pass
    else:
        update_music_url1()
    s=read_json(MUSIC_PATH)
    if rand :
        shuffle(s)
    else:
        loop(s)

start()
