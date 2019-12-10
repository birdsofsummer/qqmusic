const R=require("ramda")
const {
    to_json,
    to_qs,
    isArray,
    parse_jsonp,
}=require("../fp")

const {
    get_jsonp,
    get_blob2json,
    gets,
}=require("../ajax")

const {
    top_lists,
    api,
    SONG_TYPES,
}=require("./config")


const SONG=require("./jeff")



const search_song=async (w="张信哲",page=16)=>{
    let {url,params}=api.search_song
    let ps=R.range(0,page).map(p=>([url,{...params,p,w}]))
    let r=await gets(ps)
    let t=r
        .map(x=>x.body.toString())
        .map(parse_jsonp)
        .filter(x=>x.code==0)
        .map(x=>x.data.song.list)
        //.flat()
    return R.flatten(t)
}


const songid2name1=(
    songmid,
    oo={vkey:"","guid":"","uin":"",fromtag:53,},
)=>r.mapObjIndexed((v,k,o)=>"http://dl.stream.qqmusic.qq.com/" + k +songmid+"." +v +"?" +new URLSearchParams(oo) )(SONG_TYPES)

const songid2name=(songmid)=>"C400"+songmid+".m4a"
const id2url=(songmids=[])=> {
      let {url,params}=api.get_token
      let ps={...params,songmid:songmids,filename:songmids.map(songid2name)}
      uu=url+"?"+to_qs(ps)
      return uu
}

const song_list_format=(r)=>{
      let r1=r
          .filter(x=>x.code==0)
          .map(x=>x.data.items)
          //.flat()
      let r2= R.flatten(r1)
      return R.indexBy(x=>x.songmid,r2)
}

const get_song=async (songmids=[])=>{
        if (songmids.length>100){
            uu=R.splitEvery(100,songmids)
            r=await Promise.all(uu.map(id2url).map(get_blob2json))
           return song_list_format(r)
       }else{
          let uu=id2url(songmids)
          return song_list_format([await get_blob2json(uu)])
    }
}
const get_song_real_url=({subcode,songmid,filename,vkey}={subcode:"",songmid:"",filename:"",vkey:""})=>{
    if (!vkey) return ""
    let d={
        url:"http://ws.stream.qqmusic.qq.com/",
        params:{
              "fromtag": "0",
              "guid": "126548448",
              vkey
        },
    }
    return d.url +filename + "?" + to_qs(d.params)
}

const save_music=async (r=[],)=>{
        const {upload_s,upload_s1}=require("../cos")
        let k="/music/"
        upload_s(r,k+"jeff1.json")
        let r1=R.map(R.pick(['songname','interval','url']))(r)
        upload_s(r1,k+"jeff.json")
        upload_s1(r.map(x=>x.url).join('\n'),k+"jeff1.txt")
}

const get_song1=async (songs=SONG)=>{
        let ids=songs
                .map(x=>x.songmid)
                .filter(x=>x)
        let r=await get_song(ids)
        return songs
        .map(x=>({
            ...x,
            urls:r[x.songmid],
            url:get_song_real_url(r[x.songmid])
        }))
        .filter(x=>x.url)
}

const get_song2=async ()=>{
    let r=await get_song1()
    console.log(r)
    if (r.length) {
        await save_music(r)
    }
    return r
}

// 小爱同学
const get_song3=async ()=>{
    let r=await get_song1()
    if (r.length) {
        await save_music(r)
    }
    return r.map(x=>x.url)
}

module.exports={
    search_song,
    get_song1,
    get_song2,
    get_song3,
    save_music,
}


