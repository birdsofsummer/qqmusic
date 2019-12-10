// https://blog.csdn.neta/qq_41979349/article/details/102458551

const superagent=require("superagent")
const {
    qs,
    qs1,
    to_s,
    to_json,
}=require("../fp")

const {
    get,
    get1,
}=require("../ajax")

const SONGMID="003afM9p0qS7Lg"


const find=async (p=1,w="张信哲",n=30)=>{
     let u="https://c.y.qq.com/soso/fcgi-bin/client_search_cp"
     let q= {
            //"aggr": "1",
            //"cr": "1",
            //"flag_qc": "0",
            "p": p,
            "n": n,
            "w": w,
            format:"json"
     }
     return get(u,q)
}

//.data.album.list[0]
const get_album=async (w="直觉")=>{
    let u= "https://c.y.qq.com/soso/fcgi-bin/client_search_cp"
    let q={
        "p": "1",
        "n": "30",
        "w": w,
        format:"json",
        t:8,
    }
    return get(u,q)
}

const get_lyric=(songmid=SONGMID)=>{
    u="https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg"
    d={
        songmid,
        format:"json",
        nobase64:1,
    }
    return get(u,d)
}

const get_song_url= async (songmid=[SONGMID])=>{
    let u="https://u.y.qq.com/cgi-bin/musicu.fcg"
    let d1={
        "req_0": {
            "module": "vkey.GetVkeyServer",
            "method": "CgiGetVkey",
            "param": {
                "guid": "358840384",
                "songmid": songmid,
                "songtype": [
                    0
                ],
                "uin": "1443481947",
                "loginflag": 1,
                "platform": "20"
            }
        },
        "comm": {
            "uin": "18585073516",
            "format": "json",
            "ct": 24,
            "cv": 0
        }
    }
    let d2={
        "format": "json",
        "data": to_s(d1)
    }
    let r=await superagent.get(u,d2)
    let song=to_json(r.text)
    let {expiration,login_key,midurlinfo,msg,retcode,servercheck,sip,testfile2g,testfilewifi,thirdip,uin,verify_type}=song.req_0.data
    let songs=song
        .req_0.data
        .midurlinfo
        .map(({
                purl,
              //  common_downfromtag,
              //  errtype,
              //  filename,
              //  flowfromtag,
              //  flowurl,
              //  hisbuy,
              //  hisdown,
              //  isbuy,
              //  isonly,
              //  onecan,
              //  opi128kurl,
              //  opi192koggurl,
              //  opi192kurl,
              //  opi30surl,
              //  opi48kurl,
              //  opi96kurl,
              //  opiflackurl,
              //  p2pfromtag,
              //  pdl,
              //  pneed,
              //  pneedbuy,
              //  premain,
              //  qmdlfromtag,
              //  result,
              //  songmid,
              //  tips,
              //  uiAlert,
              //  vip_downfromtag,
              //  vkey,
              //  wififromtag,
              //  wifiurl
    })=> sip[0] + purl)
    return songs
}

const get_songs=async (p=1,w="张信哲")=>{
    let s=await find(p,w)
    let m=s.data.song.list.map(x=>x.songmid)
    return get_song_url(m)
}


// --------------------------------------------------------------------------------
const id2file=(songmid=SONGMID)=>"C400"+songmid+".m4a"
const vid2url=({vkey,filename,})=>{
    let u1="http://ws.stream.qqmusic.qq.com/" + filename
    let q={
        fromtag:"0",
        guid:"126548448",
        vkey,
    }
    return u1+"?"+qs(q)
}

// 有些songmid不行
const get_vid=async (songmid=SONGMID)=>{
    let u="https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg"
    let d={
        "format": "json205361747",
        "platform": "yqq",
        "cid": "205361747",
        "guid": "126548448",
        "songmid": songmid,
        "filename": id2file(songmid),
    }
    return get1(u,d)
}

const get_vid1=async(songmid=SONGMID)=>{
    let r=await get_vid(songmid)
    return r.data.items.map(vid2url)
}

module.exports={
    find,
    get_album,
    get_lyric,
    get_songs,
    get_vid,
    get_vid1,
    id2file,
    vid2url,
}
