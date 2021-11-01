let loaded = false;

const video = document.getElementById('video')

video.height = window.innerHeight;
video.width = window.innerWidth;

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
]).then(startVideo);

function toggleLoaded() {
    const load = document.getElementById('loading');
    load.innerHTML = 'loaded successfully!';        
    loaded = true;
}

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

let light_x = 300;
let light_y = 415;

function getFaceX(x, width) {
    return window.innerWidth - (x + (width / 2));
}

function getFaceY(y, height) {
    return y + (height / 4);
}

function getLightScaledX(face_x, holo_width) {
    return face_x * (holo_width / window.innerWidth)
}

function getLightScaledY(face_y, holo_height) {
    return face_y * (holo_height / window.innerHeight)
}

function getLightAmplifiedX(radial_x_scaled, holo_x, amp) {
    return radial_x_scaled + (amp * (light_x - holo_x));
}

function getLightAmplifiedY(radial_y_scaled, holo_y, amp) {
    return radial_y_scaled + (amp * (light_y - holo_y));
}

function getShadowScaledX(face_x, holo_width, amp) {
    return amp * (face_x * (holo_width / window.innerWidth) - (holo_width / 2));
}

function getShadowScaledY(face_y, holo_height, amp) {
    return amp * (face_y * (holo_height / window.innerHeight) - (holo_height / 2));
}

function getShadowAmplifiedX(shadow_x_scaled, holo_x, amp) {
    return shadow_x_scaled - (amp * (light_x - holo_x));
}

function getShadowAmplifiedY(shadow_y_scaled, holo_y, amp) {
    return shadow_y_scaled - (amp * (light_y - holo_y));
}

const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}    

video.addEventListener('play', () => {
    const displaySize = { width: video.width, height: video.height }
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        let face_x = getFaceX(resizedDetections[0].alignedRect.box.x, resizedDetections[0].alignedRect.box.width);
        let face_y = getFaceY(resizedDetections[0].alignedRect.box.y, resizedDetections[0].alignedRect.box.height);

        let holos = document.querySelectorAll('.holo');
        holos.forEach(function(holo) {
            let rect = holo.getBoundingClientRect();
            
            let holo_x = rect.left + (holo.offsetWidth / 2);
            let holo_y = rect.top + (holo.offsetHeight / 2);

            let light_x_scaled = getLightScaledX(face_x, holo.offsetWidth);
            let light_y_scaled = getLightScaledY(face_y, holo.offsetHeight);

            let light_x_amplified = getLightAmplifiedX(light_x_scaled, holo_x, .2);
            let light_y_amplified = getLightAmplifiedY(light_y_scaled, holo_y, .2);

            if (holo.dataset.background_color === undefined) {
                let background_color = window.getComputedStyle(holo).backgroundColor;
                let background_color_lightened = pSBC(.20, background_color, false, true);

                holo.dataset.background_color = background_color;
                holo.dataset.background_color_lightened = background_color_lightened;
            }

            holo.style.background = `radial-gradient(farthest-corner at ${light_x_amplified}px ${light_y_amplified}px, ${holo.dataset.background_color_lightened} 0%, ${holo.dataset.background_color} 100%)`;

            let shadow_x_scaled = getShadowScaledX(face_x, holo.offsetWidth, .07);
            let shadow_y_scaled = getShadowScaledY(face_y, holo.offsetHeight, .07);

            let shadow_x_amplified = getShadowAmplifiedX(shadow_x_scaled, holo_x, .002);
            let shadow_y_amplified = getShadowAmplifiedY(shadow_y_scaled, holo_y, .002);

            holo.style.boxShadow = `${shadow_x_amplified}px ${shadow_y_amplified}px 13px black`;
        });

        if (!loaded)
            toggleLoaded();

    }, 100)
});

