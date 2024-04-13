export default function getRandom(){
    return Array(10).fill(new Date().getTime());
}