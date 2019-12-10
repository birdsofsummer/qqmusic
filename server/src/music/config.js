const {
    download
} =require("../ajax")

const SONG_TYPES={
       "A000":"ape"
       ,"F000":"flac"
       ,"M800":"mp3"
       ,"M500":"mp3"
       ,"C400":".m4a"
}
const top_lists={
	"27": "巅峰榜·新歌",
	"28": "巅峰榜·网络歌曲",
	"29": "巅峰榜·影视金曲",
	"30": "巅峰榜·梦想的声音",
	"31": "巅峰榜·微信分享",
	"32": "巅峰榜·音乐人",
	"33": "全军出击·巅峰榜·歌手2018",
	"34": "巅峰榜·人气",
	"35": "QQ音乐巅峰分享榜",
	"36": "巅峰榜·K歌金曲",
	"50": "巅峰榜·中国有嘻哈",
	"51": "巅峰榜·明日之子",
	"52": "巅峰榜·腾讯音乐人原创榜",
	"53": "机车",
	"54": "勇闯天涯·巅峰榜·明日之子",
	"55": "江小白YOLO·巅峰榜·中国新说唱",
	"56": "巅峰榜·2018中国好声音",
	"57": "电音榜",
	"58": "说唱榜",
	"59": "香港地区榜",
	"60": "抖音排行榜",
	"61": "台湾地区榜",
}

const api={
    header : {
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'referer':'https://y.qq.com/portal/playlist.html'
    },
    search_song:{
         url:"https://c.y.qq.com/soso/fcgi-bin/client_search_cp",
         url1:"https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=1&n=3000&w=张信哲",
         params:{
          "aggr": "1",
          "cr": "1",
          "flag_qc": "0",
          "p": "1", //p = x.data.song.totalnum / 60 , 16
          "n": "30",
          "w": "简单爱",
         // "format":"json", //每页有限制
        },
        res:"callback(...)",
    },
    get_token:{
        url:"https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg",
        params:{
            "format": "json205361747",
            "platform": "yqq",
            "cid": "205361747",
            "songmid": "003lghpv0jfFXG",
            "filename": "C400003lghpv0jfFXG.m4a", // "C400"+songmid+".m4a"
            "guid": "126548448",
        },
        res:{
              "code": 0,
              "cid": 205361747,
              "userip": "58.60.1.28",
              "data": {
                "expiration": 80400,
                "items": [
                  {
                    "subcode": 0,
                    "songmid": "001SE3Nh3ZMQCD",
                    "filename": "C400001SE3Nh3ZMQCD.m4a",
                    "vkey": "F41DF6A5D080ADA599CFFD09B73BEE0B59B90F179AAA1F95941F1C2DE18BEB54AAC65290034CBFFD82EC3B4131D4B953D105D64CCE865A4D"
                  }
                ]
              }
            } ,
    },
     top_list:{
        url:"https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",
        params:{
              "g_tk": "5381",
              "uin": "0",
              "format": "json",
              "inCharset": "utf-8",
              "outCharset": "utf-8¬ice=0",
              "platform": "h5",
              "needNewCode": "1",
              "tpl": "3",
              "page": "detail",
              "type": "top",
              "topid": "27", // .....top_lists
              "_": "1519963122923"
        },
    },
    album:{
        url:"https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg",
        params:{
            albummid:"000QXjVc1r7NQO",
        },
    },
    playlist:{
        //https://www.jianshu.com/p/ce1180eac37b
        url:"https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg",
        url1:"",
        params:{
              uin: '0',
              format: 'json',
              inCharset: 'utf-8',
              outCharset: 'utf-8',
              notice: '0',
              platform: 'h5',
              needNewCode: '1',
              new_format: '1',
              pic: '500',
              disstid: '3719969047', //歌单id
              type: '1',
              json: '1',
              utf8: '1',
              onlysong: '0',
              picmid: '1',
              nosign: '1',
              song_begin: '0',
              song_num: '1000', //歌曲数量
              _: '1537276176570', //unix
        },
        download,
    }
 }

module.exports={
    top_lists,
    api,
    SONG_TYPES,
}


