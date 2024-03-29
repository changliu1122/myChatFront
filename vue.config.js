
let proxyObj={};

proxyObj['/']={

  ws:false,
  // server url
  target:'http://localhost8888',

  changeOrigin:true,
  //do not rewrite request url
  pathRewrite:{
    '^/':'/'
  }
}

// //websocket proxy
// proxyObj['/ws']={
//   ws:true,
//   target:'ws://localhost8889'
// }


module.exports={
  devServer:{
    host:'localhost',
    // port of front
    port:8080,
    proxy: proxyObj
  }
}