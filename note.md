页面之间传参数可以用 router.push({
                path:'',
                query:{
                }
                })

接收注意是route！   {{ this.$route.query.username }}

div tag can do text-align

el row + el col can make elements on the same line


HTML5规范中给出了原生的Websocket API，但是并不是所有浏览器都完美支持，而当浏览器不支持Websocket时，应该自动切换成Ajax长轮询，SSE等备用解决方案。
所以在实际开发中我们通常采用封装了Websocket及其备用方案的库----SockJS或Socket.IO。
如果你使用Java做服务端，同时又恰好使用Spring Framework作为框架，那么推荐使用SockJS，因为Spring Framework本身就是SockJS推荐的Java Server实现，同时也提供了Java 的client实现。
如果你使用Node.js做服务端，那么毫无疑问你该选择Socket.IO，它本省就是从Node.js开始的，当然服务端也提供了engine.io-server-java实现。甚至你可以使用
netty-socketio

websocket can only be used in one page, cannot be shared, solution is put websocket instance in vuex, use action and mutations to do socket operation

stomp protocol seems better, but is difficult to be integrated into netty, learn later

all value in vuex.state will be gone when the page refresh, store chat info both in vuex and localstorage
when chatting, the receiverid should be assigned when the send method was called, otherwise(in data assigned) the receiverid will not be update when change friend to chat

window local storage can only store string, when you store a object, should stringfy and parse 