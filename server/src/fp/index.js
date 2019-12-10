const R=require("ramda")

const {
    Url,
    parse,
    resolve,
    resolveObject,
    format,
    URL,
    URLSearchParams,
    domainToASCII,
    domainToUnicode,
    pathToFileURL,
    fileURLToPath,
    protocol,
    slashes,
    auth,
    host,
    port,
    hostname,
    hash,
    search,
    query,
    pathname,
    path,
    href
}=require("url")



const promisify_all=(c)=>{
    const {promisify}=require('util')
    R.mapObjIndexed((v,k,o)=>o.__proto__["_"+k]=promisify(v.bind(c)))(c.__proto__)
    return c
}


const to_json=(d='{}',d0={})=>{
    try {
        return JSON.parse(d)
    }catch(e){
        console.error("<<<",d)
        return d0
    }
}

const to_s=JSON.stringify

const to_qs=R.pipe(R.map((k,v)=> isArray(k)?  k.join(','):k),R.toPairs,R.map(x=>x.join('=')),x=>x.join('&'))


const qs=(d={})=>new URLSearchParams(d)
const qs1=(u,d={})=>u+"?"+qs(d)


const parse_jsonp=(t="callback({})")=>{
    let j=t.match(/callback\((.*)\)/)
    if (j && j.length>0){
        return to_json(j[1])
    }else {
        console.log(t)
        return {}
    }
}


const {isArray} =Array

const write=(t,name="data/jeff.json")=>{
    const fs=require("fs")
    let j=fs.createWriteStream(name)
    j.write(JSON.stringify(t,null,'\t'))
}

const cors_headers={
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
    'access-control-allow-headers': 'accept,accept-encoding,cf-connecting-ip,cf-ipcountry,cf-ray,cf-visitor,connection,content-length,content-type,host,user-agent,x-forwarded-proto,x-real-ip,accept-charset,accept-language,accept-datetime,authorization,cache-control,date,if-match,if-modified-since,if-none-match,if-range,if-unmodified-since,max-forwards,pragma,range,te,upgrade,upgrade-insecure-requests,x-requested-with,chrome-proxy,purpose,accept,accept-language,content-language,content-type,dpr,downlink,save-data,viewport-width,width',
    'access-control-max-age': '1728000',
}

//const whiteHeader=['content-type','content-length','client-ip','age','x-via','last-modified']
const whiteHeader=['content-type']
const headers_filter=(h=whiteHeader)=>(headers={})=>R.pickBy((v,k)=>h.includes(k),headers)
const headers_filter1=headers_filter()

const res_html=(name="./index.html")=> ({
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: fs.readFileSync(path.resolve(__dirname, name), { encoding: 'utf-8' }),
})

const res_json=(d={})=>({
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {"Content-Type":"application/json; charset=utf-8",...cors_headers},
    "body": JSON.stringify(d,null,"\t")
})


const echo=(...e)=>({
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {"Content-Type":"application/json; charset=utf-8",...cors_headers},
    "body": JSON.stringify(e,null,"\t")
})


const it=x=>x
function bufferToHex (buffer) {
    return Array
        .from (new Uint8Array (buffer))
        .map (b => b.toString (16).padStart (2, "0"))
        .join ("");
}
const body2hex=(body)=>{
    var arrayBuffer = new TextEncoder().encode (body)
    var hexString = bufferToHex (arrayBuffer);
}


const get_bin=async (u)=>{
    const fetch = require ("node-fetch");
    const r1=await fetch(u)
    const r2=await r1.arrayBuffer()
    const hexString = bufferToHex (r2)
    return hexString
}
const save_bin=(body)=>{
    fs.writeFileSync('cc.acc', body.toString('binary'), { encoding: 'binary'});
}
const isBase64Encoded =(headers)=>/image/.test(headers['content-type'])  //|audio|video
const parse_body1=({body,headers})=>{
    let m=[
        [/image/,x=>x.toString("base64")],
        [/audio/,x=>x.toString('binary')],
        [/text|script/,x=>x.toString("utf-8")],
    ]
    let c=headers['content-type'];
    let m1=m.filter(([k])=>k.test(c))
    let f=m1.length ? m1[0][1] : it
    return f(body)
}
const parse_body=({headers,statusCode,text,body})=>{
    b=isBase64Encoded(headers)
    return {
        isBase64Encoded:b,
        headers: {...headers_filter1(headers),...cors_headers},
        statusCode: statusCode,
        body: parse_body1({body,headers}),
    }
}

const res_proxy=({
_events,_eventsCount,_maxListeners,res,request,req,text,body,files,buffered,headers,header,statusCode,status,statusType,info,ok,redirect,clientError,serverError,error,created,accepted,noContent,badRequest,unauthorized,notAcceptable,forbidden,notFound,unprocessableEntity,type,links,setEncoding,redirects,pipe,
})=> parse_body({headers,text,body,statusCode})


function stringToUint(string) {
    var string = btoa(unescape(encodeURIComponent(string))),
        charList = string.split(''),
        uintArray = [];
    for (var i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
}

function uintToString(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(atob(encodedString)));
    return decodedString;
}

function uintToString1(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
}


//{"errorCode":0,"errorMessage":"",ok:true,data:d}
module.exports={
    promisify_all,
    to_json,
    to_s,
    to_qs,
    qs,
    qs1,
    parse_jsonp,
    isArray,
    write,
    echo,
    res_json,
    res_proxy,
}
