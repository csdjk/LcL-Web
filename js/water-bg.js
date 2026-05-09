/* water-bg.js — Multi-background: Star Nest + Protean Clouds + Cloud Sea
   Star Nest:      Pablo Roman Andrioli, MIT         https://www.shadertoy.com/view/XlfGRj
   Kali composite: @Kali                             https://www.shadertoy.com/user/Kali
   Protean Clouds: nimitz (CC BY-NC-SA 3.0)          https://www.shadertoy.com/view/3l23Rh
   Cloud Sea:      mdb                               https://www.shadertoy.com/view/XXdGRB
*/
(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene  = new THREE.Scene();
  const vertexShader = 'void main(){gl_Position=vec4(position.xy,0.,1.);}';

  // ── Star Nest ──────────────────────────────────────────────────────────────
  const SN_DEFAULTS = {
    speed:0.010, zoom:2.000, formuparam:0.530, brightness:0.0015,
    darkmatter:0.300, distfading:0.730, saturation:0.850, tonemap:30.0,
  };
  const snParams = Object.assign({}, SN_DEFAULTS);
  const snU = {
    uTime:       {value:0.0},
    uResolution: {value:new THREE.Vector2(innerWidth,innerHeight)},
    uMouse:      {value:new THREE.Vector2(0.5,0.5)},
    uSpeed:      {value:snParams.speed},
    uZoom:       {value:snParams.zoom},
    uFormuparam: {value:snParams.formuparam},
    uBrightness: {value:snParams.brightness},
    uDarkmatter: {value:snParams.darkmatter},
    uDistfading: {value:snParams.distfading},
    uSaturation: {value:snParams.saturation},
    uTonemap:    {value:snParams.tonemap},
  };
  const SN_GUI = [
    {key:'speed',      label:'飞行速度', min:0.001, max:0.05,  step:0.001,  u:'uSpeed'},
    {key:'zoom',       label:'缩放',     min:0.3,   max:3.0,   step:0.01,   u:'uZoom'},
    {key:'formuparam', label:'分形参数', min:0.1,   max:0.9,   step:0.01,   u:'uFormuparam'},
    {key:'brightness', label:'亮度',     min:0.0005,max:0.005, step:0.0001, u:'uBrightness'},
    {key:'darkmatter', label:'暗物质',   min:0.0,   max:1.0,   step:0.01,   u:'uDarkmatter'},
    {key:'distfading', label:'距离衰减', min:0.3,   max:1.0,   step:0.01,   u:'uDistfading'},
    {key:'saturation', label:'饱和度',   min:0.0,   max:1.0,   step:0.01,   u:'uSaturation'},
    {key:'tonemap',    label:'色调映射', min:1.0,   max:150.0, step:1.0,    u:'uTonemap'},
  ];

  const snFrag = /* glsl */`
    precision highp float;
    uniform float uTime,uSpeed,uZoom,uFormuparam,uBrightness,uDarkmatter,uDistfading,uSaturation,uTonemap;
    uniform vec2 uResolution,uMouse;
    vec3 starNest(vec2 fc,vec2 res){
      vec2 uv=fc/res-0.5; uv.y*=res.y/res.x;
      vec3 dir=vec3(uv*uZoom,1.0);
      float t=uTime*uSpeed+0.25;
      float a1=0.5+uMouse.x*0.15, a2=0.8+uMouse.y*0.15;
      mat2 r1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
      mat2 r2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
      dir.xz*=r1; dir.xy*=r2;
      vec3 from=vec3(1.0,0.5,0.5)+vec3(t*2.,t,-2.);
      from.xz*=r1; from.xy*=r2;
      float s=0.1,fade=1.0; vec3 v=vec3(0.);
      for(int r=0;r<20;r++){
        vec3 p=from+s*dir*0.5;
        p=abs(vec3(0.850)-mod(p,vec3(1.700)));
        float pa,a=pa=0.;
        for(int i=0;i<17;i++){p=abs(p)/dot(p,p)-uFormuparam;a+=abs(length(p)-pa);pa=length(p);}
        float dm=max(0.,uDarkmatter-a*a*0.001); a*=a*a;
        if(r>6)fade*=1.-dm;
        v+=fade; v+=vec3(s,s*s,s*s*s*s)*a*uBrightness*fade;
        fade*=uDistfading; s+=0.1;
      }
      v=mix(vec3(length(v)),v,uSaturation);
      return v*0.01;
    }
    void main(){
      vec2 U=gl_FragCoord.xy/uResolution;
      vec2 u=(gl_FragCoord.xy*2.-uResolution)/uResolution.y;
      vec3 c=starNest(U*uResolution,uResolution)*0.3;
      c=mix(c,c.yzx,smoothstep(2.0,0.1,length(u)));
      gl_FragColor=vec4(tanh(c*c*uTonemap),1.0);
    }
  `;
  const snMat = new THREE.ShaderMaterial({vertexShader,fragmentShader:snFrag,uniforms:snU});

  // ── Protean Clouds ─────────────────────────────────────────────────────────
  const PC_DEFAULTS = { speed:3.0, mouseInfluence:1.0 };
  const pcParams = Object.assign({}, PC_DEFAULTS);
  const pcU = {
    uTime:          {value:0.0},
    uResolution:    {value:new THREE.Vector2(innerWidth,innerHeight)},
    uMouse:         {value:new THREE.Vector2(0.5,0.5)},
    uSpeed:         {value:pcParams.speed},
    uMouseInfluence:{value:pcParams.mouseInfluence},
  };
  const PC_GUI = [
    {key:'speed',          label:'飞行速度',   min:0.5, max:8.0, step:0.1, u:'uSpeed'},
    {key:'mouseInfluence', label:'鼠标影响力', min:0.0, max:3.0, step:0.1, u:'uMouseInfluence'},
  ];

  const pcFrag = /* glsl */`
    precision highp float;
    uniform float uTime,uSpeed,uMouseInfluence;
    uniform vec2 uResolution,uMouse;

    mat2 rot(in float a){float c=cos(a),s=sin(a);return mat2(c,s,-s,c);}
    const mat3 m3=mat3(0.33338,0.56034,-0.71817,-0.87887,0.32651,-0.15323,0.15162,0.69596,0.61339)*1.93;
    float mag2(vec2 p){return dot(p,p);}
    float linstep(in float mn,in float mx,in float x){return clamp((x-mn)/(mx-mn),0.,1.);}

    float prm1_g;
    vec2  bsMo_g;

    vec2 disp(float t){return vec2(sin(t*0.22),cos(t*0.175))*2.;}

    vec2 mapScene(vec3 p){
      vec3 p2=p;
      p2.xy-=disp(p.z).xy;
      p.xy*=rot(sin(p.z+uTime)*(0.1+prm1_g*0.05)+uTime*0.09);
      float cl=mag2(p2.xy),d=0.;
      p*=.61;
      float z=1.,trk=1.,dspAmp=0.1+prm1_g*0.2;
      for(int i=0;i<5;i++){
        p+=sin(p.zxy*0.75*trk+uTime*trk*.8)*dspAmp;
        d-=abs(dot(cos(p),sin(p.yzx))*z);
        z*=0.57; trk*=1.4; p=p*m3;
      }
      d=abs(d+prm1_g*3.)+prm1_g*.3-2.5+bsMo_g.y;
      return vec2(d+cl*.2+0.25,cl);
    }

    vec4 render(in vec3 ro,in vec3 rd,float time){
      vec4 rez=vec4(0);
      float t=1.5,fogT=0.;
      for(int i=0;i<130;i++){
        if(rez.a>0.99)break;
        vec3 pos=ro+t*rd;
        vec2 mpv=mapScene(pos);
        float den=clamp(mpv.x-0.3,0.,1.)*1.12;
        float dn=clamp((mpv.x+2.),0.,3.);
        vec4 col=vec4(0);
        if(mpv.x>0.6){
          col=vec4(sin(vec3(5.,0.4,0.2)+mpv.y*0.1+sin(pos.z*0.4)*0.5+1.8)*0.5+0.5,0.08);
          col*=den*den*den;
          col.rgb*=linstep(4.,-2.5,mpv.x)*2.3;
          float dif=clamp((den-mapScene(pos+.8).x)/9.,0.001,1.);
          dif+=clamp((den-mapScene(pos+.35).x)/2.5,0.001,1.);
          col.xyz*=den*(vec3(0.005,.045,.075)+1.5*vec3(0.033,0.07,0.03)*dif);
        }
        float fogC=exp(t*0.2-2.2);
        col.rgba+=vec4(0.06,0.11,0.11,0.1)*clamp(fogC-fogT,0.,1.);
        fogT=fogC;
        rez=rez+col*(1.-rez.a);
        t+=clamp(0.5-dn*dn*.05,0.09,0.3);
      }
      return clamp(rez,0.,1.);
    }

    float getsat(vec3 c){float mi=min(min(c.x,c.y),c.z),ma=max(max(c.x,c.y),c.z);return(ma-mi)/(ma+1e-7);}
    vec3 iLerp(in vec3 a,in vec3 b,in float x){
      vec3 ic=mix(a,b,x)+vec3(1e-6,0.,0.);
      float sd=abs(getsat(ic)-mix(getsat(a),getsat(b),x));
      vec3 dir=normalize(vec3(2.*ic.x-ic.y-ic.z,2.*ic.y-ic.x-ic.z,2.*ic.z-ic.y-ic.x));
      float lgt=dot(vec3(1.),ic),ff=dot(dir,normalize(ic));
      ic+=1.5*dir*sd*ff*lgt;
      return clamp(ic,0.,1.);
    }

    void main(){
      vec2 q=gl_FragCoord.xy/uResolution;
      vec2 p=(gl_FragCoord.xy-0.5*uResolution)/uResolution.y;
      bsMo_g=(uMouse-0.5)*vec2(uResolution.x/uResolution.y,1.0)*uMouseInfluence;
      prm1_g=smoothstep(-0.4,0.4,sin(uTime*0.3));
      float time=uTime*uSpeed;
      vec3 ro=vec3(0.,0.,time);
      ro+=vec3(sin(uTime)*0.5,sin(uTime)*0.,0.);
      float dspAmp=.85;
      ro.xy+=disp(ro.z)*dspAmp;
      float tgtDst=3.5;
      vec3 target=normalize(ro-vec3(disp(time+tgtDst)*dspAmp,time+tgtDst));
      ro.x-=bsMo_g.x*2.;
      vec3 rightdir=normalize(cross(target,vec3(0.,1.,0.)));
      vec3 updir=normalize(cross(rightdir,target));
      rightdir=normalize(cross(updir,target));
      vec3 rd=normalize((p.x*rightdir+p.y*updir)*1.-target);
      rd.xy*=rot(-disp(time+3.5).x*0.2+bsMo_g.x);
      vec4 scn=render(ro,rd,time);
      vec3 col=scn.rgb;
      col=iLerp(col.bgr,col.rgb,clamp(1.-prm1_g,0.05,1.));
      col=pow(col,vec3(.55,0.65,0.6))*vec3(1.,.97,.9);
      col*=pow(16.*q.x*q.y*(1.-q.x)*(1.-q.y),0.12)*0.7+0.3;
      gl_FragColor=vec4(col,1.0);
    }
  `;
  const pcMat = new THREE.ShaderMaterial({vertexShader,fragmentShader:pcFrag,uniforms:pcU});

  // ── Hyperspace ──────────────────────────────────────────────────────────────
  const HS_DEFAULTS = { speed:0.40, streak:1.0, glow:1.0, colorSpread:1.0 };
  const hsParams = Object.assign({}, HS_DEFAULTS);
  const hsU = {
    uTime:        {value:0.0},
    uResolution:  {value:new THREE.Vector2(innerWidth,innerHeight)},
    uMouse:       {value:new THREE.Vector2(0.5,0.5)},
    uSpeed:       {value:hsParams.speed},
    uStreak:      {value:hsParams.streak},
    uGlow:        {value:hsParams.glow},
    uColorSpread: {value:hsParams.colorSpread},
  };
  const HS_GUI = [
    {key:'speed',       label:'飞行速度', min:0.1, max:2.0,  step:0.05, u:'uSpeed'},
    {key:'streak',      label:'拖尾长度', min:0.0, max:3.0,  step:0.05, u:'uStreak'},
    {key:'glow',        label:'发光强度', min:0.2, max:3.0,  step:0.05, u:'uGlow'},
    {key:'colorSpread', label:'色彩范围', min:0.0, max:2.0,  step:0.05, u:'uColorSpread'},
  ];

  const hsFrag = /* glsl */`
    precision highp float;
    uniform float uTime,uSpeed,uStreak,uGlow,uColorSpread;
    uniform vec2  uResolution,uMouse;

    float h1(float p){return fract(sin(p*127.1)*43758.5453);}
    float h2(float p){return fract(sin(p*311.7)*43758.5453);}

    vec3 hue2rgb(float h){
      float h6=fract(h)*6.;
      return clamp(vec3(abs(h6-3.)-1.,2.-abs(h6-2.),2.-abs(h6-4.)),0.,1.);
    }

    void main(){
      vec2 uv=(gl_FragCoord.xy*2.-uResolution)/uResolution.y;
      vec2 vp=(uMouse-.5)*.5;
      vec2 pos=uv-vp;
      float t=uTime*uSpeed*0.18;
      vec3 col=vec3(0.);

      for(int i=0;i<200;i++){
        float fi=float(i);
        float ang=h1(fi)*6.28318;
        float r0=h2(fi);
        float sr=.04+r0*r0*1.1;
        vec2 dir=vec2(cos(ang),sin(ang));
        float lt=fract(t+h1(fi+50.));
        float z=1.-lt;
        float iz=1./max(z,.003);
        vec2 curr=dir*sr*iz*.22;
        float tl=uStreak*.1*(1.-z*.4);
        float pz=z+tl;
        float ipz=1./max(pz,.003);
        vec2 prev=dir*sr*ipz*.22;
        if(length(curr)>2.3&&length(prev)>2.3)continue;
        vec2 seg=prev-curr;
        float sl=length(seg);
        if(sl<.00001)continue;
        vec2 sn=seg/sl;
        float along=clamp(dot(pos-curr,sn),0.,sl);
        float perp=length(pos-curr-sn*along);
        float w=.0007+(1.-z)*.0028;
        float bri=(1.-z)*2.2;
        float glow=exp(-perp*perp/(w*w))*bri*uGlow;
        float hue=.15+h1(fi+200.)*uColorSpread*.38;
        vec3 sc=mix(vec3(.95),hue2rgb(hue),.82)+vec3(.1,.05,0.);
        col+=sc*glow;
      }

      float d=length(pos);
      col+=vec3(.04,.07,.14)/(d*4.+.7);
      col*=smoothstep(1.9,.3,length(uv));
      gl_FragColor=vec4(col,1.);
    }
  `;
  const hsMat = new THREE.ShaderMaterial({vertexShader,fragmentShader:hsFrag,uniforms:hsU});

  // ── Cloud Sea ──────────────────────────────────────────────────────────────
  const CS_DEFAULTS = {
    speed:         1.0,
    bgHeight:      0.0,
    bgDisp:        0.2,
    fgHeight:      0.09,
    fgDisp:        0.55,
    fgTopY:        1.0,
    brightness:    1.0,
    vignette:      1.0,
    smokeSpeed:    6.0,
    smokeRise:     0.33,
    smokeTurb:     0.15,
    smokeSpread:   0.8,
  };
  const csParams = Object.assign({}, CS_DEFAULTS);
  const csU = {
    uTime:         { value: 0.0 },
    uResolution:   { value: new THREE.Vector2(innerWidth, innerHeight) },
    uSpeed:        { value: csParams.speed },
    uBgHeight:     { value: csParams.bgHeight },
    uBgDisp:       { value: csParams.bgDisp },
    uFgHeight:     { value: csParams.fgHeight },
    uFgDisp:       { value: csParams.fgDisp },
    uFgTopY:       { value: csParams.fgTopY },
    uBrightness:   { value: csParams.brightness },
    uVignette:     { value: csParams.vignette },
    uSmokeSpeed:   { value: csParams.smokeSpeed },
    uSmokeRise:    { value: csParams.smokeRise },
    uSmokeTurb:    { value: csParams.smokeTurb },
    uSmokeSpread:  { value: csParams.smokeSpread },
    uNoiseTex:     { value: null },
    uNoiseSize:    { value: new THREE.Vector2(256, 256) },
  };
  const CS_GUI = [
    { key:'speed',      label:'动画速度',     min:0.1, max:3.0,  step:0.05, u:'uSpeed' },
    { key:'bgHeight',   label:'背景云高度',   min:-0.5,max:0.5,  step:0.01, u:'uBgHeight' },
    { key:'bgDisp',     label:'背景云振幅',   min:0.2, max:2.5,  step:0.05, u:'uBgDisp' },
    { key:'fgHeight',   label:'前景云高度',   min:-0.5,max:0.5,  step:0.01, u:'uFgHeight' },
    { key:'fgDisp',     label:'前景云振幅',   min:0.2, max:2.5,  step:0.05, u:'uFgDisp' },
    { key:'fgTopY',     label:'前景云上边界', min:0.3, max:1.0,  step:0.01, u:'uFgTopY' },
    { key:'brightness', label:'亮度',         min:0.3, max:2.0,  step:0.05, u:'uBrightness' },
    { key:'vignette',   label:'暗角强度',     min:0.0, max:1.0,  step:0.05, u:'uVignette' },
    { key:'smokeSpeed', label:'烟雾速度',     min:1.0, max:20.0, step:0.5,  u:'uSmokeSpeed' },
    { key:'smokeRise',  label:'烟雾上升高度', min:0.0, max:0.5,  step:0.01, u:'uSmokeRise' },
    { key:'smokeTurb',  label:'烟雾湍流',     min:0.0, max:1.5,  step:0.05, u:'uSmokeTurb' },
    { key:'smokeSpread',label:'烟雾扩散',     min:0.0, max:2.0,  step:0.05, u:'uSmokeSpread' },
  ];

  const csFrag = /* glsl */`
    precision highp float;
    uniform float uTime, uSpeed;
    uniform float uBgHeight, uBgDisp, uFgHeight, uFgDisp, uFgTopY, uBrightness, uVignette;
    uniform float uSmokeSpeed, uSmokeRise, uSmokeTurb, uSmokeSpread;
    uniform vec2  uResolution;
    uniform sampler2D uNoiseTex;
    uniform vec2  uNoiseSize;

    float noise(vec2 x) {
      vec2 f = fract(x);
      vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
      vec2 p = floor(x);
      // sample texel centers: (p + 0.5) / size avoids bilinear bleed
      float a = texture2D(uNoiseTex,(p+vec2(0.5,0.5))/uNoiseSize).x;
      float b = texture2D(uNoiseTex,(p+vec2(1.5,0.5))/uNoiseSize).x;
      float c = texture2D(uNoiseTex,(p+vec2(0.5,1.5))/uNoiseSize).x;
      float d = texture2D(uNoiseTex,(p+vec2(1.5,1.5))/uNoiseSize).x;
      return a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y;
    }
    float fbm(vec2 x) {
      float a=0.0,b=1.0,t=0.0;
      for(int i=0;i<8;i++){float n=noise(x);a+=b*n;t+=b;b*=0.7;x*=2.0;}
      return a/t;
    }
    float fbm2(vec2 x) {
      float a=0.0,b=1.0,t=0.0;
      for(int i=0;i<8;i++){float n=noise(x);a+=b*n;t+=b;b*=0.9;x*=2.0;}
      return a/t;
    }
    float boxR(vec2 uv,float x1,float x2,float y1,float y2){
      return (uv.x>x1&&uv.x<x2&&uv.y>y1&&uv.y<y2)?1.0:0.0;
    }
    #define dot2(v) dot(v,v)
    #define layer(dh,v) if(uv.y<h+midlevel-(dh))return vec4(v,1.0);

    vec4 foreground(vec2 uv, float t, float dispScale) {
      float midlevel,h,disp,dist; vec2 uv2;
      uv.y -= 0.2;
      midlevel=-0.1;disp=1.7*dispScale;dist=1.0;
      uv2=uv+vec2(t/dist+40.0,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.12,vec3(0.43,0.32,0.31));layer(0.08,vec3(0.55,0.42,0.41));
      layer(0.04,vec3(0.66,0.42,0.40));layer(0.0, vec3(0.77,0.48,0.46));
      midlevel=0.05;disp=1.7*dispScale;dist=2.0;
      uv2=uv+vec2(t/dist+38.0,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.1, vec3(0.95,0.66,0.48));layer(0.04,vec3(0.98,0.76,0.64));
      layer(0.0, vec3(0.95,0.80,0.77));
      return vec4(0.95,0.80,0.77,0.0);
    }

    vec4 background(vec2 uv, float t, float dispScale) {
      float midlevel,h,disp,dist; vec2 uv2;
      midlevel=0.3;disp=0.9*dispScale;dist=10.0;
      uv2=uv+vec2(t/dist+32.5,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.14,vec3(0.48,0.19,0.20));layer(0.1, vec3(0.68,0.28,0.19));
      layer(0.07,vec3(0.88,0.38,0.24));layer(0.0, vec3(0.95,0.45,0.30));
      midlevel=0.35;disp=1.0*dispScale;dist=15.0;
      uv2=uv+vec2(t/dist+30.0,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.04,vec3(0.98,0.76,0.64));layer(0.0, vec3(0.95,0.80,0.77));
      midlevel=0.35;disp=3.5*dispScale;dist=20.0;
      uv2=uv+vec2(t/dist+27.5,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.12,vec3(0.43,0.32,0.31));layer(0.08,vec3(0.55,0.42,0.41));
      layer(0.04,vec3(0.66,0.42,0.40));layer(0.0, vec3(0.77,0.48,0.46));
      midlevel=0.45;disp=2.0*dispScale;dist=25.0;
      uv2=uv+vec2(t/dist+23.0,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.04,vec3(0.98,0.57,0.36));layer(0.0, vec3(1.0,0.62,0.44));
      midlevel=0.5;disp=2.3*dispScale;dist=30.0;
      uv2=uv+vec2(t/dist+20.5,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.12,vec3(0.41,0.27,0.27));layer(0.08,vec3(0.53,0.35,0.32));
      layer(0.04,vec3(0.80,0.24,0.17));layer(0.0, vec3(0.99,0.29,0.20));
      midlevel=0.5;disp=2.5*dispScale;dist=35.0;
      uv2=uv+vec2(t/dist+18.0,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.1, vec3(0.88,0.38,0.24));layer(0.05,vec3(0.98,0.42,0.28));
      layer(0.0, vec3(1.0,0.48,0.35));
      midlevel=0.6;disp=2.0*dispScale;dist=40.0;
      uv2=uv+vec2(t/dist+18.0,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.1, vec3(0.95,0.66,0.48));layer(0.0, vec3(1.0,0.76,0.60));
      midlevel=0.75;disp=3.5*dispScale;dist=45.0;
      uv2=uv+vec2(t/dist+15.5,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.2, vec3(1.0,0.55,0.33)); layer(0.15,vec3(0.98,0.50,0.24));
      layer(0.1, vec3(0.90,0.55,0.40));layer(0.0, vec3(1.0,0.62,0.44));
      midlevel=0.7;disp=2.7*dispScale;dist=50.0;
      uv2=uv+vec2(t/dist+12.0,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.04,vec3(0.73,0.36,0.30));layer(0.0, vec3(0.80,0.40,0.34));
      midlevel=0.8;disp=2.7*dispScale;dist=60.0;
      uv2=uv+vec2(t/dist+9.5,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.1, vec3(0.93,0.58,0.35));layer(0.0, vec3(1.0,0.76,0.60));
      midlevel=0.9;disp=3.0*dispScale;dist=70.0;
      uv2=uv+vec2(t/dist+7.0,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.1, vec3(0.56,0.25,0.22));layer(0.05,vec3(0.60,0.30,0.27));
      layer(0.0, vec3(0.74,0.35,0.30));
      midlevel=1.0;disp=5.0*dispScale;dist=100.0;
      uv2=uv+vec2(t/dist+3.5,0.0);h=(fbm(uv2)-0.5)*disp;
      layer(0.1, vec3(0.92,0.85,0.82));layer(0.0, vec3(1.0,0.94,0.91));
      return vec4(0.58,0.7,1.0,1.0);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.y;
      float t = uTime * 4.0 * uSpeed;

      vec4 bg = background(uv + vec2(0.0, uBgHeight), t, uBgDisp);
      vec4 fg = vec4(0.0);
      if ((uv.y + uFgHeight) < uFgTopY) {
        for (int i = 0; i < 5; i++) {
          fg += foreground(uv + vec2(0.0, uFgHeight), t + 4.0*float(i)/5.0/60.0, uFgDisp) / 5.0;
        }
      }

      vec3 col = bg.rgb;
      float k, midlevel, h, disp, dist;
      vec2 uv2;
      uv.y -= 0.2;  // fixed offset for train/bridge position

      uv2 = fract(uv*9.0);
      float wagon = 1.0;
      wagon *= 1.0 - step(0.45, uv.x);
      wagon *= 1.0 - step(0.115, uv.y);
      wagon *= step(0.103, uv.y);
      wagon *= step(0.05, 1.0 - abs(uv2.x*2.0 - 1.0));
      float join = 1.0;
      join *= 1.0 - step(0.45, uv.x);
      join *= 1.0 - step(0.11, uv.y);
      join *= step(0.107, uv.y);
      float roof = 1.0;
      roof *= 1.0 - step(0.45, uv.x);
      roof *= 1.0 - step(0.117, uv.y);
      roof *= step(0.11, uv.y);
      roof *= step(0.15, 1.0 - abs(uv2.x*2.0 - 1.0));
      float loco    = boxR(uv, 0.45,  0.5,   0.103, 0.112);
      float chem1   = boxR(uv, 0.49,  0.495, 0.103, 0.12);
      float chem2   = boxR(uv, 0.488, 0.496, 0.12,  0.123);
      float locoRoof= boxR(uv, 0.443, 0.47,  0.11,  0.117);
      float wheel = 1.0 - step(0.00004, dot2(uv - vec2(0.457, 0.106)));
      wheel += 1.0 - step(0.00002, dot2(uv - vec2(0.487, 0.105)));
      wheel += 1.0 - step(0.00002, dot2(uv - vec2(0.497, 0.105)));
      if (uv.x < 0.45 && uv.y > 0.025 && uv.y < 0.2) {
        wheel += 1.0 - step(0.002, dot2(uv2 - vec2(0.2, 0.95)));
        wheel += 1.0 - step(0.002, dot2(uv2 - vec2(0.8, 0.95)));
      }
      col = mix(col, vec3(0.18,0.12,0.15), join);
      col = mix(col, vec3(0.48,0.19,0.20), wagon);
      col = mix(col, vec3(0.18,0.12,0.15), roof);
      col = mix(col, vec3(0.38,0.19,0.20), loco);
      col = mix(col, vec3(0.38,0.19,0.20), chem1);
      col = mix(col, vec3(0.18,0.12,0.15), locoRoof);
      col = mix(col, vec3(0.18,0.12,0.15), clamp(chem2 + wheel, 0.0, 1.0));

      // smoke
      dist = uSmokeSpeed;
      uv2 = uv + vec2(t/dist + 3.5, 0.0);
      uv2.x -= t/dist*0.2;
      h = fbm2(uv2) - 0.55;
      if (uv.x < 0.49) {
        float sx = -uv.x + 0.49;
        float sy = abs(uv.y + h*uSmokeTurb - uSmokeRise*sqrt(sx) - 0.12) - uSmokeSpread*sx*exp(-sx*10.0);
        if (sy < 0.0)   col = vec3(1.0,0.94,0.91);
        if (sy < -0.02) col = vec3(0.92,0.85,0.82);
      }

      // bridge
      dist = 5.0;
      uv2 = uv + vec2(t/dist + 32.5, 0.0);
      uv2.x = fract(uv2.x*3.0);
      k = 1.0;
      k *= smoothstep(0.001, 0.003, abs(uv2.y - pow(uv2.x-0.5,2.0)*0.15 - 0.12));
      k *= min(step(0.05, 1.0-abs(uv2.x*2.0-1.0)) + step(0.17, uv2.y), 1.0);
      k *= min(smoothstep(0.02,0.05,1.0-abs(uv2.x*2.0-1.0)) + step(0.177,uv2.y), 1.0);
      k *= min(step(0.1,uv2.y) + smoothstep(-0.09,-0.085,-uv2.y-0.001/max(1.0-abs(uv2.x*2.0-1.0),0.001)),1.0);
      k *= min(smoothstep(0.05,0.2,1.0-abs(fract(uv2.x*16.0)*2.0-1.0))
             + step(0.12,uv2.y-pow(uv2.x-0.5,2.0)*0.15) + step(-0.1,-uv2.y), 1.0);
      col = mix(vec3(0.29,0.09,0.08)*smoothstep(-0.08,0.08,uv.y), col, k);

      col = mix(col, fg.rgb, fg.a);

      // vignette
      vec2 uvv = gl_FragCoord.xy / uResolution.xy;
      float vig = pow(16.0*uvv.x*uvv.y*(1.0-uvv.x)*(1.0-uvv.y), 0.2);
      col *= mix(1.0, 0.5 + 0.5*vig, uVignette);

      // brightness
      col *= uBrightness;

      gl_FragColor = vec4(col, 1.0);
    }
  `;
  const csMat = new THREE.ShaderMaterial({ vertexShader, fragmentShader: csFrag, uniforms: csU });

  // Generate procedural 256x256 white-noise texture (NearestFilter: shader does its own bilinear interp)
  (function() {
    const SZ = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SZ;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(SZ, SZ);
    // Use a seeded LCG so noise looks the same on every page load
    let s = 1234567;
    function rng(){ s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }
    for (let i = 0; i < img.data.length; i += 4) {
      const v = rng() * 255 | 0;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const noiseTex = new THREE.CanvasTexture(canvas);
    noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping;
    noiseTex.minFilter = noiseTex.magFilter = THREE.NearestFilter;
    noiseTex.generateMipmaps = false;
    csU.uNoiseTex.value = noiseTex;
    csU.uNoiseSize.value.set(SZ, SZ);
  })();

  // ── Scene mesh ─────────────────────────────────────────────────────────────
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), csMat);
  scene.add(mesh);

  // ── Background registry ────────────────────────────────────────────────────
  const BG_LIST = [
    {id:'starNest',   label:'✦ 星巢',   mat:snMat, uniforms:snU, params:snParams, defaults:SN_DEFAULTS, guiDefs:SN_GUI,
     accent:'#00d4ff', accentRgb:'0,212,255',   clickOnly:true},
    {id:'clouds',     label:'☁ 云彩',   mat:pcMat, uniforms:pcU, params:pcParams, defaults:PC_DEFAULTS, guiDefs:PC_GUI,
     accent:'#ffb347', accentRgb:'255,179,71',  clickOnly:false},
    {id:'hyperspace', label:'⚡ 超空间', mat:hsMat, uniforms:hsU, params:hsParams, defaults:HS_DEFAULTS, guiDefs:HS_GUI,
     accent:'#ff9944', accentRgb:'255,153,68',  clickOnly:false},
    {id:'cloudSea',   label:'🌅 云海',  mat:csMat, uniforms:csU, params:csParams, defaults:CS_DEFAULTS, guiDefs:CS_GUI,
     accent:'#e87340', accentRgb:'232,115,64',  clickOnly:false},
  ];
  let activeBgIdx = 3; // default: cloudSea

  // ── Section overlay vars (declared before load so saved values override defaults) ──
  let sectionOpacity = 0.88;
  let sectionBlur    = 16;

  // ── Load saved default background & params ─────────────────────────────────
  try {
    const bgCfg = JSON.parse(localStorage.getItem('lcl_bg_config') || 'null');
    if (bgCfg && bgCfg.bgId) {
      const si = BG_LIST.findIndex(b => b.id === bgCfg.bgId);
      if (si >= 0) { activeBgIdx = si; if (BG_LIST[si].mat) mesh.material = BG_LIST[si].mat; }
    }
    if (bgCfg && bgCfg.params) {
      BG_LIST.forEach(bg => {
        const saved = bgCfg.params[bg.id];
        if (!saved) return;
        bg.guiDefs.forEach(def => {
          if (saved[def.key] != null) {
            bg.params[def.key] = saved[def.key];
            if (def.u) bg.uniforms[def.u].value = saved[def.key];
          }
        });
      });
    }
    if (bgCfg && bgCfg.sectionOpacity != null) sectionOpacity = bgCfg.sectionOpacity;
    if (bgCfg && bgCfg.sectionBlur    != null) sectionBlur    = bgCfg.sectionBlur;
  } catch(e) {}

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  const targetMouse = new THREE.Vector2(0.5, 0.5);
  let mouseDown = false;
  let mouseInertia = 0.30;

  // ── Section overlay ────────────────────────────────────────────────────────
  function applySectionOpacity(){
    const panel = document.getElementById('content-panel');
    const bf = `blur(${sectionBlur}px) saturate(1.3)`;
    if (panel) {
      const isCS = BG_LIST[activeBgIdx] && BG_LIST[activeBgIdx].id === 'cloudSea';
      panel.style.background           = `rgba(${isCS ? '20,10,6' : '8,8,18'},${sectionOpacity})`;
      panel.style.backdropFilter       = bf;
      panel.style.webkitBackdropFilter = bf;
    }
  }

  function applyBgTheme(idx) {
    if (BG_LIST[idx] && BG_LIST[idx].id === 'cloudSea') {
      document.body.setAttribute('data-bg', 'cloudSea');
    } else {
      document.body.removeAttribute('data-bg');
    }
    applySectionOpacity();
  }
  // apply saved theme after DOM ready
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => applyBgTheme(activeBgIdx));
  } else {
    applyBgTheme(activeBgIdx);
  }

  window.addEventListener('mousedown',  () => { mouseDown = true; });
  window.addEventListener('mouseup',    () => { mouseDown = false; });
  window.addEventListener('mouseleave', () => { mouseDown = false; });
  window.addEventListener('mousemove',  e => {
    // clouds: always track; star nest: only when held
    if (BG_LIST[activeBgIdx].clickOnly && !mouseDown) return;
    targetMouse.x = e.clientX / innerWidth;
    targetMouse.y = 1.0 - e.clientY / innerHeight;
  });
  window.addEventListener('resize', () => {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h);
    BG_LIST.forEach(bg => bg.uniforms.uResolution.value.set(w, h));
  });

  // ── Admin preview postMessage bridge ───────────────────────────────
  window.addEventListener('message', e => {
    if (!e.data || e.data.type !== 'lcl-bg-preview') return;
    const cfg = e.data.cfg;
    if (!cfg) return;
    if (cfg.bgId) {
      const si = BG_LIST.findIndex(b => b.id === cfg.bgId);
      if (si >= 0) { activeBgIdx = si; if (BG_LIST[si].mat) mesh.material = BG_LIST[si].mat; applyBgTheme(si); }
    }
    if (cfg.params) {
      BG_LIST.forEach(bg => {
        const saved = cfg.params[bg.id];
        if (!saved) return;
        bg.guiDefs.forEach(def => {
          if (saved[def.key] != null) {
            bg.params[def.key] = saved[def.key];
            if (def.u) bg.uniforms[def.u].value = saved[def.key];
          }
        });
      });
    }
    if (cfg.sectionOpacity != null) { sectionOpacity = cfg.sectionOpacity; applySectionOpacity(); }
    if (cfg.sectionBlur    != null) { sectionBlur    = cfg.sectionBlur;    applySectionOpacity(); }
  });

  // ── GUI ────────────────────────────────────────────────────────────────────
  function fmt(v, step){ return v.toFixed(step < 0.01 ? 4 : step < 0.1 ? 2 : 1); }

  // Inject shared CSS once
  if (!document.getElementById('sn-gui-style')) {
    const s = document.createElement('style');
    s.id = 'sn-gui-style';
    s.textContent = `
      #sn-panel { transition: opacity .25s, transform .25s; transform-origin: top right; }
      #sn-panel.hidden { opacity:0; pointer-events:none; transform:scale(.96) translateY(-6px); }
      #sn-panel input[type=range] { height:3px; border-radius:2px; }
      #sn-toggle { transition: background .2s, box-shadow .2s, transform .15s; }
      #sn-toggle:hover { transform: rotate(30deg) scale(1.1); }
    `;
    document.head.appendChild(s);
  }

  function buildPanel(){
    const old = document.getElementById('sn-panel');
    const wasVisible = old ? !old.classList.contains('hidden') : false;
    if (old) old.remove();
    const bg = BG_LIST[activeBgIdx];
    const acc = bg.accent;
    const accR = bg.accentRgb;

    const panel = document.createElement('div');
    panel.id = 'sn-panel';
    Object.assign(panel.style, {
      position:'fixed', top:'58px', right:'16px', zIndex:'9999',
      background:'rgba(8,8,16,0.78)', backdropFilter:'blur(12px) saturate(1.4)',
      border:`1px solid rgba(${accR},0.3)`,
      borderRadius:'14px', padding:'16px 18px', width:'256px',
      fontFamily:`'Segoe UI',system-ui,sans-serif`,
      fontSize:'12px', color:'rgba(255,255,255,0.82)', userSelect:'none',
      boxShadow:`0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(${accR},0.08) inset`,
    });
    if (!wasVisible) panel.classList.add('hidden');

    // Header row
    const header = document.createElement('div');
    Object.assign(header.style, {
      display:'flex', alignItems:'center', justifyContent:'space-between',
      marginBottom:'14px', paddingBottom:'10px',
      borderBottom:`1px solid rgba(${accR},0.18)`,
    });
    const htitle = document.createElement('span');
    Object.assign(htitle.style, {fontWeight:'700', fontSize:'13px', letterSpacing:'.06em', color:acc});
    htitle.textContent = bg.label + ' 参数';
    header.appendChild(htitle);
    panel.appendChild(header);

    // Tab switcher
    const tabs = document.createElement('div');
    Object.assign(tabs.style, {
      display:'grid', gridTemplateColumns:`repeat(${BG_LIST.length},1fr)`, gap:'6px', marginBottom:'14px',
    });
    BG_LIST.forEach((b, i) => {
      const tab = document.createElement('button');
      tab.textContent = b.label;
      const isActive = i === activeBgIdx;
      Object.assign(tab.style, {
        padding:'6px 0', borderRadius:'8px', cursor:'pointer', fontSize:'12px',
        border: isActive ? `1px solid ${b.accent}` : `1px solid rgba(255,255,255,0.12)`,
        background: isActive ? `rgba(${b.accentRgb},0.2)` : 'rgba(255,255,255,0.05)',
        color: isActive ? b.accent : 'rgba(255,255,255,0.55)',
        fontWeight: isActive ? '600' : '400',
        transition:'all 0.18s',
      });
      tab.addEventListener('click', () => {
        activeBgIdx = i;
        if (BG_LIST[i].mat) mesh.material = BG_LIST[i].mat;
        applyBgTheme(i);
        buildPanel();
        document.getElementById('sn-panel').classList.remove('hidden');
      });
      tabs.appendChild(tab);
    });
    panel.appendChild(tabs);

    // Divider
    const div0 = document.createElement('div');
    Object.assign(div0.style, {height:'1px', background:`rgba(${accR},0.12)`, margin:'0 0 12px'});
    panel.appendChild(div0);

    // Shader params
    bg.guiDefs.forEach(def => {
      addRow(panel, def.label, bg.params[def.key], def, acc, v => {
        bg.params[def.key] = v;
        if (def.u) bg.uniforms[def.u].value = v;
      });
    });

    // Shared: mouse inertia
    const inertiaDef = {min:0.01, max:0.5, step:0.01};
    addRow(panel, bg.clickOnly ? '鼠标惯性 (按住)' : '鼠标惯性', mouseInertia, inertiaDef, acc,
      v => { mouseInertia = v; }
    );

    // Section opacity divider
    const divSec = document.createElement('div');
    Object.assign(divSec.style, {height:'1px', background:`rgba(${accR},0.12)`, margin:'12px 0 10px'});
    panel.appendChild(divSec);
    const secLabel = document.createElement('div');
    Object.assign(secLabel.style, {fontSize:'10px', letterSpacing:'.12em', textTransform:'uppercase',
      color:`rgba(${accR},0.55)`, marginBottom:'8px'});
    secLabel.textContent = '页面遮罩';
    panel.appendChild(secLabel);

    const opacityDef = {min:0.0, max:1.0, step:0.01};
    addRow(panel, '内容区透明度', sectionOpacity, opacityDef, acc, v => {
      sectionOpacity = v; applySectionOpacity();
    });
    const blurDef = {min:0, max:40, step:1};
    addRow(panel, '内容区模糊度', sectionBlur, blurDef, acc, v => {
      sectionBlur = v; applySectionOpacity();
    });

    // Reset
    const btn = document.createElement('button');
    btn.textContent = '↺  重置默认值';
    Object.assign(btn.style, {
      marginTop:'10px', width:'100%', padding:'7px 0',
      background:`rgba(${accR},0.10)`,
      border:`1px solid rgba(${accR},0.35)`,
      borderRadius:'8px', color:acc, cursor:'pointer',
      fontSize:'12px', fontWeight:'600', letterSpacing:'.04em',
      transition:'background .18s',
    });
    btn.addEventListener('mouseover', () => btn.style.background = `rgba(${accR},0.22)`);
    btn.addEventListener('mouseout',  () => btn.style.background = `rgba(${accR},0.10)`);
    btn.addEventListener('click', () => {
      mouseInertia = 0.30;
      sectionOpacity = 0.88;
      sectionBlur = 16;
      applySectionOpacity();
      Object.assign(bg.params, bg.defaults);
      bg.guiDefs.forEach(d => { if (d.u) bg.uniforms[d.u].value = bg.defaults[d.key]; });
      buildPanel();
      document.getElementById('sn-panel').classList.remove('hidden');
    });
    panel.appendChild(btn);
    document.body.appendChild(panel);
    return panel;
  }

  function addRow(parent, label, initVal, def, acc, onChange){
    const row = document.createElement('div');
    Object.assign(row.style, {marginBottom:'10px'});
    const top = document.createElement('div');
    Object.assign(top.style, {display:'flex', justifyContent:'space-between', marginBottom:'4px'});
    const lbl = document.createElement('span');
    Object.assign(lbl.style, {color:'rgba(255,255,255,0.65)', fontSize:'11px'});
    lbl.textContent = label;
    const val = document.createElement('span');
    Object.assign(val.style, {color:acc, fontSize:'11px', fontWeight:'600', fontVariantNumeric:'tabular-nums'});
    val.textContent = fmt(initVal, def.step);
    top.appendChild(lbl); top.appendChild(val);
    const slider = document.createElement('input');
    slider.type='range'; slider.min=def.min; slider.max=def.max;
    slider.step=def.step; slider.value=initVal;
    Object.assign(slider.style, {width:'100%', accentColor:acc, cursor:'pointer', display:'block'});
    slider.addEventListener('input', () => {
      const v = parseFloat(slider.value);
      val.textContent = fmt(v, def.step);
      onChange(v);
    });
    row.appendChild(top); row.appendChild(slider);
    parent.appendChild(row);
  }

  // Toggle button — uses active bg accent color
  function updateToggleStyle(){
    const bg = BG_LIST[activeBgIdx];
    toggleBtn.textContent = bg.label[0]; // ✦ or ☁
    toggleBtn.style.border = `1px solid rgba(${bg.accentRgb},0.45)`;
    toggleBtn.style.color  = bg.accent;
    toggleBtn.style.boxShadow = `0 0 12px rgba(${bg.accentRgb},0.25)`;
  }

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'sn-toggle';
  Object.assign(toggleBtn.style, {
    position:'fixed', top:'16px', right:'16px', zIndex:'10000',
    background:'rgba(8,8,16,0.72)', borderRadius:'50%',
    width:'38px', height:'38px', fontSize:'17px',
    cursor:'pointer', lineHeight:'36px', textAlign:'center',
    backdropFilter:'blur(8px)',
  });
  updateToggleStyle();
  toggleBtn.addEventListener('click', () => {
    let p = document.getElementById('sn-panel');
    if (!p) p = buildPanel();
    const hidden = p.classList.toggle('hidden');
    const bg = BG_LIST[activeBgIdx];
    toggleBtn.style.background = hidden
      ? 'rgba(8,8,16,0.72)'
      : `rgba(${bg.accentRgb},0.22)`;
  });
  document.body.appendChild(toggleBtn);

  // ── Render loop ────────────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    BG_LIST.forEach(bg => {
      bg.uniforms.uTime.value = t;
      if (bg.uniforms.uMouse) {
        const m = bg.uniforms.uMouse.value;
        m.x += (targetMouse.x - m.x) * mouseInertia;
        m.y += (targetMouse.y - m.y) * mouseInertia;
      }
    });
    renderer.render(scene, camera);
  }
  animate();
})();
