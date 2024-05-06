
# SVG-to-image-converter

A simple javascript library for convert SVG images to png or jpeg on client side.


## Usage/Examples

```javascript
import SVGToImage from "svg-to-image-converter";

SVGToImage.toBlob('jpg',['/your-svg-image.svg'])
    .then((res)=>{
        const blobUrl = SVGToImage.toBlobUrl(res,res.type);
    }
)
```


## Contributing

Contributions are always welcome!

Please adhere to this project's `code of conduct`.


## License

[MIT](https://choosealicense.com/licenses/mit/)

