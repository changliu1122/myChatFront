页面之间传参数可以用 router.push({
                path:'',
                query:{
                }
                })

接收注意是route！   {{ this.$route.query.username }}