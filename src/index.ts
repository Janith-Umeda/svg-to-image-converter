type type = "png" | "jpg" | "jpeg";

export default class SVGToImage{
    public static async toBlob(type:type,svgUrls:Array<string>,width:number = 1024,height:number = 1024) : Promise<Array<Blob>> {
        const data:Array<Blob> = [];
        function convert(){
            return new Promise((resolve=>{
                let i:number = 0;
                svgUrls.forEach((link)=>{
                    const fileName = link;
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
                    
                })
            }));
        }

        await convert();
        return data;
    }

    protected static reCorrectSvg(svgPath:string) : Promise<BlobPart> {
        return new Promise(resolve=>{
            const fr = new FileReader();
            this.fetchSvg(svgPath).then((res)=>{
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
            })
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
}