
# SVG-to-image-converter

A simple javascript library for convert SVG images to png or jpeg on client side.


## Usage/Examples
Example usage on Javascript.

```javascript
import SVGToImage from "svg-to-image-converter";

SVGToImage.toBlob('jpg',['/your-svg-image.svg'])
    .then((res)=>{
        const blobUrl = SVGToImage.toBlobUrl(res,res.type);
    }
)
```

Example for custom single file path with button click download.

```javascript
import SVGToImage from "svg-to-image-converter";

SVGToImage.toBlob(
    'png',
    ['assets/sample_1.svg'],
    512,512
).then((data)=>{
    document.getElementById("download").onclick = ()=>{
        SVGToImage.forceDownload(data,undefined,{
            confirmation:true,
            conformationType:"native"
        })
    }
}).catch(console.warn)
```

Example for multiple input files without download

```javascript
import SVGToImage from "svg-to-image-converter";

document.getElementById("svgFileInput").onchange = (evt)=>{
    SVGToImage.toBlob("png",evt.target.files).then((data)=>{
        for (let i = 0; i < data.length; i++) {
            const file = data[i];
            const img = document.createElement("img");
            Object.assign(img.style,{width:"300px",height:"auto"});
            img.src = URL.createObjectURL(file)
            document.getElementById("previewContainer").appendChild(img) 
        }
    }).catch(console.warn)
}
```

Example for single input file with button click download

```javascript
import SVGToImage from "svg-to-image-converter";

document.getElementById("svgFileInput").onchange = (evt)=>{
    SVGToImage.toBlob('png',[evt.target.files[0]],1024,1024).then((data)=>{
        document.getElementById("download").onclick = ()=>{
            SVGToImage.forceDownload(data);
        }
    }).catch(console.error);
}
```

Example for multiple input files without download on Next.js

```jsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react"
import SVGToImage from "svg-to-image-converter";

export default function Convert(){
    const [blobUrls,setBlobUrls] = useState([]);
    const [files,setFiles] = useState([]);

    useEffect(()=>{
        if(files.length){
            SVGToImage.toBlob('png',files).then((res)=>{
                const urls = [];
                for(let i=0;i<files.length;i++){
                    urls.push(URL.createObjectURL(files[i]));
                }
                setBlobUrls(urls);
            })
        }
    },[files])

    return <div>
        <input type="file" accept=".svg" multiple onChange={(evt)=>{setFiles(evt.target.files)}} />
        {blobUrls.map((img,i)=>(
            <Image src={img} width={512} height={512} unoptimized alt="" key={i}/>
        ))}
    </div>
}
```

## Contributing

Contributions are always welcome!

Please adhere to this project's `code of conduct`.


## License

[MIT](https://choosealicense.com/licenses/mit/)

