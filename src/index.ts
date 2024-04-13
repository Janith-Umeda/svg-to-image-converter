
class SVGToImage {
    static async toBlob(type, selectedQrCodes, width = 1024, height = 1024) {
    
        const data = [];
    
        function convert() {
            return new Promise(resolve => {
                let i = 0;
                selectedQrCodes.forEach((link) => {
                    const filename = `${link.split('.')[0]}.${type === 'print'? 'png' : type }`;
                    SVGToImage.#reCorrectSvg(link).then((res) => {
                        const image = new Image();
                        image.crossOrigin = 'anonymous';
    
                        image.onload = function() {
                            setTimeout(function() {  
    
                                const canvas = document.createElement('canvas');                                    
                                const iWidth = width;
                                const iHeight = height * (image.naturalHeight / image.naturalWidth);
    
                                canvas.width = width;
                                canvas.height = iHeight;
    
                                const context = canvas.getContext('2d');
    
                                if (type == "jpeg" || type == "jpg") {
                                    context.beginPath();
                                    context.rect(0, 0, width, iHeight);
                                    context.fillStyle = "white";
                                    context.fill();
                                }
    
                                context.drawImage(image,
                                    10, 10, iWidth - 20, iHeight - 20
                                );
    
                                if (type === 'pdf') {
                                    data.push({
                                        imgLink: canvas.toDataURL(SVGToImage.#getMimeType(type), 1),
                                        size: null,
                                        width: Math.floor((iWidth * 25.4) / Math.round((image.naturalHeight / image.naturalWidth) * 130)), //px to mm
                                        height: Math.floor((iHeight * 25.4) / Math.round((image.naturalHeight / image.naturalWidth) * 130))
                                    });
                                } else {
                                    data.push(SVGToImage.#dataURLtoFile(canvas.toDataURL(SVGToImage.#getMimeType(type), 1), filename));
                                }
    
                                image.remove();
                                canvas.remove();
    
                                if (selectedQrCodes.length === i + 1) {
                                    resolve(data);
                                }
    
                                i++;
                            }, 500);
    
                        }
                        image.style.backgroundColor = "red";
                        image.src = URL.createObjectURL(new Blob([res], {
                            type: "image/svg+xml"
                        }));
                    });
                })
            })
        }
    
        await convert().catch((e) => {
            console.error(e)
        })
    
        return data
    }

    static #reCorrectSvg(svgPath){
        return new Promise(resolve => {
            const fr = new FileReader();
            this.#fetchSvg(svgPath).then((res) => {
                fr.readAsText(res);
                fr.onload = () => {
                    const svgRes = String(fr.result);
                    const doc = new DOMParser().parseFromString(svgRes, "image/svg+xml");
                    const svgElm = doc.documentElement
                    if (!svgElm.hasAttribute('width') && !svgElm.hasAttribute('height')) {
                        const dimensions = svgElm.getAttribute('viewBox').split(' ');
                        svgElm.setAttribute('width', dimensions[2])
                        svgElm.setAttribute('height', dimensions[3])
                        resolve(svgElm.outerHTML)
                    } else {
                        resolve(svgRes);
                    }
                }
            })
        })
    }
    
    static #dataURLtoFile(dataUrl, filename) {
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
    
    static async #fetchSvg(path) {
        const response = await fetch(path);
        const blob = await response.blob();
        return blob;
    }
    
    static #getMimeType(type) {
        let fileType;
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
}