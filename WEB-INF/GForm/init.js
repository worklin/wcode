const urls = [
    '/spa/workflow/static4form/index.html#/main/workflow/req',
    '/spa/cube/index.html#/main/cube/card'
]
urls.every(url => {
    const bool = ecodeSDK.checkLPath(url)
    bool && ecodeSDK.load({
        id: '${appId}',
        noCss: true,
        cb: function() {}
    })
    return !bool
})