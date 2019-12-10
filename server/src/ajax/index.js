const R=require("ramda")
const {URL}=require('url')
const superagent=require("superagent")
const {createWriteStream}=require('fs')

const {
    to_json,
    to_qs,
    parse_jsonp,
}=require("../fp")


const get_jsonp=async (url,params)=>{
    let r=await superagent.get(url,params)
    let r1=r.body.toString()
    return parse_jsonp(r1)
}

const get_blob2json=async (url)=>{
      let r=await superagent.get(url)
      .set("User-Agent","Mozilla/5.0 (X11; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0")
      .set('Accept', 'application/json')
      .responseType('blob')
      let s=r.body.toString()
      return to_json(s)
}
//'https://y.qq.com/portal/playlist.html'
const download=(u,file_name)=>
        superagent
        .get(u,file_name)
        .set('user-agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',)
        .set("referrer",new URL(u).origin)
        .pipe(createWriteStream(file_name))

const gets=(ps=[])=>Promise.all(ps.map(([u,d])=>superagent.get(u,d)))

const posts=(req)=>Promise.all(req.map(({url,data})=>superagent
    .post(url,data)
    .set("User-Agent","Mozilla/5.0 (Linux; Android 6.0; 1503-M02 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile MQQBrowser/6.2 TBS/036558 Safari/537.36 MicroMessenger/6.3.25.861 NetType/WIFI Language/zh_CN")
    .set("referrer",new URL(url).origin)
))

const post_form=async ({url,data})=>{
      let token={}
      try{
         let tk=await superagent.post(url).type('form').send(data)
         token=JSON.parse(tk.text);
      }catch(e){
         console.log(e)
      }finally{
         return token
      }
}

const proxy=async({url})=>await superagent.get(url)
    .set("User-Agent","Mozilla/5.0 (Linux; Android 6.0; 1503-M02 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile MQQBrowser/6.2 TBS/036558 Safari/537.36 MicroMessenger/6.3.25.861 NetType/WIFI Language/zh_CN")
    .set("referrer",url)
    .responseType('blob')


const VID_ERROR= {
            "code":104001,
            "cid":205361747,
            "errinfo":"mid decrypt error",
            "data":{
                "items": []
            }
}

const get=async (u,d={})=>{
    let r=await  superagent
        .get(u)
        .query(d)
        .set({
            "Referer":u,
            "User-Agent":"Dalvik/2.1.0 (Linux; U; Android 8.1.0; Mi MIX 2 Build/OPM7.181105.004)",
        })
       // .type('json')
    let r1=r.body.toString()
    return to_json(r.text||r1)
}

const get1=async (u,d={})=>{
    let z=await superagent
        .get(u)
        .query(d)
        .responseType('blob')
        .buffer(true)
    let b=z.body.toString()
 //   console.log(b)
    return to_json(b,VID_ERROR)
}


module.exports={
    posts,
    post_form,
    get_jsonp,
    gets,
    get_blob2json,
    proxy,
    download,
    get,
    get1,
}






