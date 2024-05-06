import SVGToImage from './dist/lib/es6/index.js'

//Example for custom single file path without download.
// SVGToImage.toBlob(
//     'png',
//     ['assets/sample_1.svg'],
//     512,512
// ).then((data)=>{
//     const blobUrl = SVGToImage.toBlobUrl(data,data.type);
//     console.log(blobUrl);
//     document.getElementById("preview").src = blobUrl;
// }).catch(console.warn)

// Example for custom single file path with button click download.
// SVGToImage.toBlob(
//     'png',
//     ['assets/sample_1.svg'],
//     512,512
// ).then((data)=>{
//     document.getElementById("download").onclick = ()=>{
//         SVGToImage.forceDownload(data,undefined,{
//             confirmation:true,
//             conformationType:"native"
//         })
//     }
// }).catch(console.warn)

//Example for input file without download
// document.getElementById("svgFileInput").onchange = (evt)=>{
//     SVGToImage.toBlob("png",evt.target.files).then((data)=>{
//         for (let i = 0; i < data.length; i++) {
//             const file = data[i];
//             const img = document.createElement("img");
//             Object.assign(img.style,{width:"300px",height:"auto"});
//             img.src = URL.createObjectURL(file)
//             document.getElementById("previewContainer").appendChild(img) 
//         }
//     }).catch(console.warn)
// }

//Example for single input file with button click download
document.getElementById("svgFileInput").onchange = (evt)=>{
    SVGToImage.toBlob('png',[evt.target.files[0]],1024,1024).then((data)=>{
        document.getElementById("download").onclick = ()=>{
            SVGToImage.forceDownload(data);
        }
    }).catch(console.error);
}