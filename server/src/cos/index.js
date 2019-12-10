const R=require("ramda")
const cos_cfg= R.pickAll(["SecretId", "SecretKey", "Bucket", "Region", "Prefix",])(process.env)

var COS = require('cos-nodejs-sdk-v5');

const {promisify_all}=require("../fp")
var cos =promisify_all( new COS(cos_cfg))

const upload=(Key="./cos.md",fn)=>cos.multipartUpload({ ...cos_cfg, Key, },fn)
const upload1=(Key="./cos.md")=>cos._multipartUpload({ ...cos_cfg, Key, })
const upload_s=( Body={}, Key="/music/list.json", )=>cos._putObject({
    ...cos_cfg,
    Key,
    Body:JSON.stringify(Body),
})

const upload_s1=( Body="", Key="/music/list.json", )=>cos._putObject({
    ...cos_cfg,
    Key,
    Body,
})


const list=()=>cos._getBucket(cos_cfg)
module.exports={
    cos,
    upload_s,
    upload1,
    list,
    upload_s1,
}
