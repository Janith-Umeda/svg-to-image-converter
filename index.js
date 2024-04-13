SVGToImage.toBlob(
    'jpg',
    ['assets/sample_1.svg'],
    512,512
).then((data)=>{
    const blobUrl = SVGToImage.toBlobUrl(data,data.type)
    document.querySelector("img").src = blobUrl
}).catch(console.warn)