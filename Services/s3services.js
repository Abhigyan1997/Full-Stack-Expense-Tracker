const AWS=require('aws-sdk');
const { response } = require('express');
AWS.config.update({
  accessKeyId: 'AKIAQX7QQN2KFSD7Z3RX',
  secretAccessKey: '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',
  logging: true
});

const uploadtoS3=(data,filename)=>{
  const BUCKET_NAME='expensebucket123'
  const IAM_USER_KEY='AKIAQX7QQN2KFSD7Z3RX'
  const IAM_USER_SECRET='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'

let S3bucket=new AWS.S3({
  accessKeyId:IAM_USER_KEY,
  secretAcesskey:IAM_USER_SECRET
})

var params={
  Bucket:BUCKET_NAME,
  Key:filename,
  Body:data,
  ACL:'public-read'
}

return new Promise((resolve,reject)=>{
  S3bucket.upload(params, (err, s3response)=>{
    if(err){
      console.log('something went wrong',err)
      reject(err)
    }else{
      console.log('success',s3response)
      resolve(s3response.Location);
       }
    })
  })
}
module.exports={
    uploadtoS3
} 