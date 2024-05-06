type type = "png" | "jpg" | "jpeg";
type conformationTypes = "native" | "custom";

interface DownloadOptions {
    confirmation:boolean,
    conformationType:conformationTypes,
    nativeConformationText:string
}

export default class SVGToImage{
    public static async toBlob(type:type,svgUrls:Array<string|File>,width:number = 1024,height:number = 1024) : Promise<Array<Blob>> {
        const data:Array<Blob> = [];
        function convert(){
            return new Promise((resolve=>{
                for (let i:number = 0; i < svgUrls.length; i++) {
                    const link = svgUrls[i];
                    const fileName : string = typeof link == 'string' ? link : link.name;
                    SVGToImage.reCorrectSvg(link).then((res)=>{
                        const image:HTMLImageElement = new Image();
                        image.crossOrigin = 'anonymous';
                        image.onload = ()=>{
                            setTimeout(()=>{
                                const canvas:HTMLCanvasElement = document.createElement("canvas");
                                const iWidth:number = width;
                                const iHeight:number = height*(image.naturalHeight/image.naturalWidth);
                                canvas.width = iWidth;
                                canvas.height = iHeight;
                                const context = canvas.getContext("2d");

                                if(type == "jpeg" || type == "jpg"){
                                    context.beginPath();
                                    context.rect(0,0,iWidth,iHeight);
                                    context.fillStyle = "white";
                                    context.fill();
                                }

                                context.drawImage(image,10,10,iWidth-20,iHeight-20);
                                data.push(SVGToImage.dataURLtoFile(canvas.toDataURL(SVGToImage.getMimeType(type),1),fileName));

                                image.remove();
                                canvas.remove();
                                
                                if(svgUrls.length === i + 1){
                                    resolve(data);
                                }
                                i++
                            },500);
                        }
                        image.style.background = "red";
                        image.src = SVGToImage.toBlobUrl([res],"svg");                  
                    })
                }
            }));
        }

        await convert();
        return data;
    }

    private static reCorrectSvg(svgPath:string|File) : Promise<BlobPart> {
        const setWidthHeight = (fr:FileReader,res:Blob,resolve:Function) : void =>{
            fr.readAsText(res);
                fr.onload = ()=>{
                    const svgRes:string = fr.result.toString();
                    const doc = new DOMParser().parseFromString(svgRes,"image/svg+xml");
                    const svgElm = doc.documentElement;
                    if(!svgElm.hasAttribute("width") && !svgElm.hasAttribute("height")){
                        const dimensions = svgElm.getAttribute("viewBox").split(" ");
                        svgElm.setAttribute("width",dimensions[2]);
                        svgElm.setAttribute("height",dimensions[3]);
                        resolve(svgElm.outerHTML);
                    }else{
                        resolve(svgRes);
                    }
                }
        }

        return new Promise(resolve=>{
            const fr = new FileReader();
            if(typeof svgPath === "string"){
                this.fetchSvg(svgPath).then((res)=>{
                    setWidthHeight(fr,res,resolve);
                });
            }else{
                setWidthHeight(fr,svgPath,resolve);
            }
        });
    }

    private static async fetchSvg(path:string) : Promise<Blob> {
        const response = await fetch(path);
        return await response.blob();
    }

    public static toBlobUrl(blobRes:BlobPart[],type:string) : string {
        return URL.createObjectURL(new Blob(blobRes,{
            type:this.getMimeType(type)
        }));
    }

    private static getMimeType(type:string) : string {
        let fileType:string;
        switch (type) {
            case 'png':
                fileType = 'image/png';
                break;
            case 'jpeg':
                fileType = 'image/jpeg';
                break;
            case 'print':
                fileType = 'image/png';
                break;
            case 'eps':
                fileType = 'application/eps';
                break;
            case 'pdf':
                fileType = 'application/pdf';
                break;
            case 'svg':
                fileType = 'image/svg+xml';
                break;
            default:
                fileType = 'image/png';
                break;
        }
    
        return fileType;
    }

    private static dataURLtoFile(dataUrl:string,filename:string) : File {
        var arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {
            type: mime
        });
    }

    public static forceDownload(file:string|any,fileName:string=new Date().getTime().toString(),options?:DownloadOptions){
        if(file){
            let fileUrl = '';
            if(typeof file === "object" ){
                fileUrl = this.toBlobUrl(file,file.type);
            }else{
                fileUrl = file;
            }

            const a = document.createElement('a');
            a.hidden=true;
            a.download = fileName;
            a.href = fileUrl;
            a.textContent = 'dl';
            document.body.appendChild(a);
            a.focus();
            if(options?.confirmation){
                if(options.conformationType == 'native'){
                    if(!window.confirm(options.nativeConformationText ?? "Are you sure to Download?")) {a.remove(); return} ;
                }
            }
            a.click();
            a.remove();
        }
    }
}