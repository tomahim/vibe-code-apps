(()=>{var Yn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},si={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Du=0,zc=1,Uu=2;var kc=1,Va=2,gi=3,Ti=0,un=1,yn=2,Ii=0,ps=1,Hc=2,Vc=3,Gc=4,Nu=5,ji=100,Fu=101,Ou=102,Bu=103,zu=104,ku=200,Hu=201,Vu=202,Gu=203,ca=204,ha=205,Wu=206,Xu=207,qu=208,Yu=209,$u=210,Zu=211,Ju=212,Ku=213,ju=214,Ga=0,Wa=1,Xa=2,ms=3,qa=4,Ya=5,$a=6,Za=7,Wc=0,Qu=1,ed=2,Li=0,td=1,nd=2,id=3,sd=4,rd=5,od=6,Ja=7;var Xc=300,bs=301,Es=302,Ka=303,ja=304,xo=306,ua=1e3,Ki=1001,da=1002,Rn=1003,ad=1004;var yo=1005;var ni=1006,Qa=1007;var ts=1008;var ri=1009,qc=1010,Yc=1011,fr=1012,el=1013,ns=1014,oi=1015,pr=1016,tl=1017,nl=1018,mr=1020,$c=35902,Zc=35899,Jc=1021,Kc=1022,$n=1023,Js=1026,gr=1027,il=1028,sl=1029,jc=1030,rl=1031;var ol=1033,vo=33776,Mo=33777,So=33778,bo=33779,al=35840,ll=35841,cl=35842,hl=35843,ul=36196,dl=37492,fl=37496,pl=37808,ml=37809,gl=37810,_l=37811,xl=37812,yl=37813,vl=37814,Ml=37815,Sl=37816,bl=37817,El=37818,wl=37819,Tl=37820,Al=37821,Rl=36492,Cl=36494,Pl=36495,Il=36283,Ll=36284,Dl=36285,Ul=36286;var Wr=2300,fa=2301,la=2302,Tc=2400,Ac=2401,Rc=2402;var ld=3200,cd=3201;var Qc=0,hd=1,Di="",En="srgb",gs="srgb-linear",Xr="linear",xt="srgb";var fs=7680;var Cc=519,ud=512,dd=513,fd=514,eh=515,pd=516,md=517,gd=518,_d=519,Pc=35044;var th="300 es",ti=2e3,qr=2001;var hi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},gn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],jh=1234567,kr=Math.PI/180,Ks=180/Math.PI;function ws(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(gn[i&255]+gn[i>>8&255]+gn[i>>16&255]+gn[i>>24&255]+"-"+gn[e&255]+gn[e>>8&255]+"-"+gn[e>>16&15|64]+gn[e>>24&255]+"-"+gn[t&63|128]+gn[t>>8&255]+"-"+gn[t>>16&255]+gn[t>>24&255]+gn[n&255]+gn[n>>8&255]+gn[n>>16&255]+gn[n>>24&255]).toLowerCase()}function tt(i,e,t){return Math.max(e,Math.min(t,i))}function nh(i,e){return(i%e+e)%e}function Af(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Rf(i,e,t){return i!==e?(t-i)/(e-i):0}function Hr(i,e,t){return(1-t)*i+t*e}function Cf(i,e,t,n){return Hr(i,e,1-Math.exp(-t*n))}function Pf(i,e=1){return e-Math.abs(nh(i,e*2)-e)}function If(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Lf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Df(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Uf(i,e){return i+Math.random()*(e-i)}function Nf(i){return i*(.5-Math.random())}function Ff(i){i!==void 0&&(jh=i);let e=jh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Of(i){return i*kr}function Bf(i){return i*Ks}function zf(i){return(i&i-1)===0&&i!==0}function kf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Hf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Vf(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),d=o((e+n)/2),h=r((e-n)/2),f=o((e-n)/2),u=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*d,c*h,c*f,a*l);break;case"YZY":i.set(c*f,a*d,c*h,a*l);break;case"ZXZ":i.set(c*h,c*f,a*d,a*l);break;case"XZX":i.set(a*d,c*g,c*u,a*l);break;case"YXY":i.set(c*u,a*d,c*g,a*l);break;case"ZYZ":i.set(c*g,c*u,a*d,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ys(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function bn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var _r={DEG2RAD:kr,RAD2DEG:Ks,generateUUID:ws,clamp:tt,euclideanModulo:nh,mapLinear:Af,inverseLerp:Rf,lerp:Hr,damp:Cf,pingpong:Pf,smoothstep:If,smootherstep:Lf,randInt:Df,randFloat:Uf,randFloatSpread:Nf,seededRandom:Ff,degToRad:Of,radToDeg:Bf,isPowerOfTwo:zf,ceilPowerOfTwo:kf,floorPowerOfTwo:Hf,setQuaternionFromProperEuler:Vf,normalize:bn,denormalize:Ys},fe=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Cn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],d=n[s+2],h=n[s+3],f=r[o+0],u=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=u,e[t+2]=g,e[t+3]=_;return}if(h!==_||c!==f||l!==u||d!==g){let m=1-a,p=c*f+l*u+d*g+h*_,S=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){let A=Math.sqrt(w),R=Math.atan2(A,p*S);m=Math.sin(m*R)/A,a=Math.sin(a*R)/A}let x=a*S;if(c=c*m+f*x,l=l*m+u*x,d=d*m+g*x,h=h*m+_*x,m===1-a){let A=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=A,l*=A,d*=A,h*=A}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],d=n[s+3],h=r[o],f=r[o+1],u=r[o+2],g=r[o+3];return e[t]=a*g+d*h+c*u-l*f,e[t+1]=c*g+d*f+l*h-a*u,e[t+2]=l*g+d*u+a*f-c*h,e[t+3]=d*g-a*h-c*f-l*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),d=a(s/2),h=a(r/2),f=c(n/2),u=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*d*h+l*u*g,this._y=l*u*h-f*d*g,this._z=l*d*g+f*u*h,this._w=l*d*h-f*u*g;break;case"YXZ":this._x=f*d*h+l*u*g,this._y=l*u*h-f*d*g,this._z=l*d*g-f*u*h,this._w=l*d*h+f*u*g;break;case"ZXY":this._x=f*d*h-l*u*g,this._y=l*u*h+f*d*g,this._z=l*d*g+f*u*h,this._w=l*d*h-f*u*g;break;case"ZYX":this._x=f*d*h-l*u*g,this._y=l*u*h+f*d*g,this._z=l*d*g-f*u*h,this._w=l*d*h+f*u*g;break;case"YZX":this._x=f*d*h+l*u*g,this._y=l*u*h+f*d*g,this._z=l*d*g-f*u*h,this._w=l*d*h-f*u*g;break;case"XZY":this._x=f*d*h-l*u*g,this._y=l*u*h-f*d*g,this._z=l*d*g+f*u*h,this._w=l*d*h+f*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],d=t[6],h=t[10],f=n+a+h;if(f>0){let u=.5/Math.sqrt(f+1);this._w=.25/u,this._x=(d-c)*u,this._y=(r-l)*u,this._z=(o-s)*u}else if(n>a&&n>h){let u=2*Math.sqrt(1+n-a-h);this._w=(d-c)/u,this._x=.25*u,this._y=(s+o)/u,this._z=(r+l)/u}else if(a>h){let u=2*Math.sqrt(1+a-n-h);this._w=(r-l)/u,this._x=(s+o)/u,this._y=.25*u,this._z=(c+d)/u}else{let u=2*Math.sqrt(1+h-n-a);this._w=(o-s)/u,this._x=(r+l)/u,this._y=(c+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+o*a+s*l-r*c,this._y=s*d+o*c+r*a-n*l,this._z=r*d+o*l+n*c-s*a,this._w=o*d-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let u=1-t;return this._w=u*o+t*this._w,this._x=u*n+t*this._x,this._y=u*s+t*this._y,this._z=u*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),d=Math.atan2(l,a),h=Math.sin((1-t)*d)/l,f=Math.sin(t*d)/l;return this._w=o*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),d=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+c*l+o*h-a*d,this.y=n+c*d+a*l-r*h,this.z=s+c*h+r*d-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ec.copy(this).projectOnVector(e),this.sub(ec)}reflect(e){return this.sub(ec.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ec=new I,Qh=new Cn,et=class i{constructor(e,t,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let d=this.elements;return d[0]=e,d[1]=s,d[2]=a,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],d=n[4],h=n[7],f=n[2],u=n[5],g=n[8],_=s[0],m=s[3],p=s[6],S=s[1],w=s[4],x=s[7],A=s[2],R=s[5],L=s[8];return r[0]=o*_+a*S+c*A,r[3]=o*m+a*w+c*R,r[6]=o*p+a*x+c*L,r[1]=l*_+d*S+h*A,r[4]=l*m+d*w+h*R,r[7]=l*p+d*x+h*L,r[2]=f*_+u*S+g*A,r[5]=f*m+u*w+g*R,r[8]=f*p+u*x+g*L,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],d=e[8];return t*o*d-t*a*l-n*r*d+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],d=e[8],h=d*o-a*l,f=a*c-d*r,u=l*r-o*c,g=t*h+n*f+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=h*_,e[1]=(s*l-d*n)*_,e[2]=(a*n-s*o)*_,e[3]=f*_,e[4]=(d*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=u*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(tc.makeScale(e,t)),this}rotate(e){return this.premultiply(tc.makeRotation(-e)),this}translate(e,t){return this.premultiply(tc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},tc=new et;function ih(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Yr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function xd(){let i=Yr("canvas");return i.style.display="block",i}var eu={};function js(i){i in eu||(eu[i]=!0,console.warn(i))}function yd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var tu=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nu=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gf(){let i={enabled:!0,workingColorSpace:gs,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===xt&&(s.r=wi(s.r),s.g=wi(s.g),s.b=wi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===xt&&(s.r=$s(s.r),s.g=$s(s.g),s.b=$s(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Di?Xr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return js("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return js("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[gs]:{primaries:e,whitePoint:n,transfer:Xr,toXYZ:tu,fromXYZ:nu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:En},outputColorSpaceConfig:{drawingBufferColorSpace:En}},[En]:{primaries:e,whitePoint:n,transfer:xt,toXYZ:tu,fromXYZ:nu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:En}}}),i}var ht=Gf();function wi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $s(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Us,pa=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Us===void 0&&(Us=Yr("canvas")),Us.width=e.width,Us.height=e.height;let s=Us.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Us}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Yr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=wi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(wi(t[n]/255)*255):t[n]=wi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Wf=0,Qs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=ws(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(nc(s[o].image)):r.push(nc(s[o]))}else r=nc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function nc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?pa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Xf=0,ic=new I,wn=class i extends hi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Ki,s=Ki,r=ni,o=ts,a=$n,c=ri,l=i.DEFAULT_ANISOTROPY,d=Di){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=ws(),this.name="",this.source=new Qs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ic).x}get height(){return this.source.getSize(ic).y}get depth(){return this.source.getSize(ic).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ua:e.x=e.x-Math.floor(e.x);break;case Ki:e.x=e.x<0?0:1;break;case da:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ua:e.y=e.y-Math.floor(e.y);break;case Ki:e.y=e.y<0?0:1;break;case da:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};wn.DEFAULT_IMAGE=null;wn.DEFAULT_MAPPING=Xc;wn.DEFAULT_ANISOTROPY=1;var Ct=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],d=c[4],h=c[8],f=c[1],u=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(d-f)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let w=(l+1)/2,x=(u+1)/2,A=(p+1)/2,R=(d+f)/4,L=(h+_)/4,N=(g+m)/4;return w>x&&w>A?w<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(w),s=R/n,r=L/n):x>A?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=R/s,r=N/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=L/r,s=N/r),this.set(n,s,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(f-d)*(f-d));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(h-_)/S,this.z=(f-d)/S,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this.w=tt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this.w=tt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ma=class extends hi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ni,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new wn(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:ni,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Qs(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},On=class extends ma{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},$r=class extends wn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ga=class extends wn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ui=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(jn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(jn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=jn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,jn):jn.fromBufferAttribute(r,o),jn.applyMatrix4(e.matrixWorld),this.expandByPoint(jn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fo.copy(n.boundingBox)),Fo.applyMatrix4(e.matrixWorld),this.union(Fo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,jn),jn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Lr),Oo.subVectors(this.max,Lr),Ns.subVectors(e.a,Lr),Fs.subVectors(e.b,Lr),Os.subVectors(e.c,Lr),Wi.subVectors(Fs,Ns),Xi.subVectors(Os,Fs),cs.subVectors(Ns,Os);let t=[0,-Wi.z,Wi.y,0,-Xi.z,Xi.y,0,-cs.z,cs.y,Wi.z,0,-Wi.x,Xi.z,0,-Xi.x,cs.z,0,-cs.x,-Wi.y,Wi.x,0,-Xi.y,Xi.x,0,-cs.y,cs.x,0];return!sc(t,Ns,Fs,Os,Oo)||(t=[1,0,0,0,1,0,0,0,1],!sc(t,Ns,Fs,Os,Oo))?!1:(Bo.crossVectors(Wi,Xi),t=[Bo.x,Bo.y,Bo.z],sc(t,Ns,Fs,Os,Oo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,jn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(jn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},vi=[new I,new I,new I,new I,new I,new I,new I,new I],jn=new I,Fo=new ui,Ns=new I,Fs=new I,Os=new I,Wi=new I,Xi=new I,cs=new I,Lr=new I,Oo=new I,Bo=new I,hs=new I;function sc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){hs.fromArray(i,r);let a=s.x*Math.abs(hs.x)+s.y*Math.abs(hs.y)+s.z*Math.abs(hs.z),c=e.dot(hs),l=t.dot(hs),d=n.dot(hs);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>a)return!1}return!0}var qf=new ui,Dr=new I,rc=new I,di=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):qf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Dr.subVectors(e,this.center);let t=Dr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Dr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(rc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Dr.copy(e.center).add(rc)),this.expandByPoint(Dr.copy(e.center).sub(rc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Mi=new I,oc=new I,zo=new I,qi=new I,ac=new I,ko=new I,lc=new I,Ai=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mi.copy(this.origin).addScaledVector(this.direction,t),Mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){oc.copy(e).add(t).multiplyScalar(.5),zo.copy(t).sub(e).normalize(),qi.copy(this.origin).sub(oc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(zo),a=qi.dot(this.direction),c=-qi.dot(zo),l=qi.lengthSq(),d=Math.abs(1-o*o),h,f,u,g;if(d>0)if(h=o*c-a,f=o*a-c,g=r*d,h>=0)if(f>=-g)if(f<=g){let _=1/d;h*=_,f*=_,u=h*(h+o*f+2*a)+f*(o*h+f+2*c)+l}else f=r,h=Math.max(0,-(o*f+a)),u=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(o*f+a)),u=-h*h+f*(f+2*c)+l;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-c),r),u=-h*h+f*(f+2*c)+l):f<=g?(h=0,f=Math.min(Math.max(-r,-c),r),u=f*(f+2*c)+l):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-c),r),u=-h*h+f*(f+2*c)+l);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),u=-h*h+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(oc).addScaledVector(zo,f),u}intersectSphere(e,t){Mi.subVectors(e.center,this.origin);let n=Mi.dot(this.direction),s=Mi.dot(Mi)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),d>=0?(r=(e.min.y-f.y)*d,o=(e.max.y-f.y)*d):(r=(e.max.y-f.y)*d,o=(e.min.y-f.y)*d),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Mi)!==null}intersectTriangle(e,t,n,s,r){ac.subVectors(t,e),ko.subVectors(n,e),lc.crossVectors(ac,ko);let o=this.direction.dot(lc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;qi.subVectors(this.origin,e);let c=a*this.direction.dot(ko.crossVectors(qi,ko));if(c<0)return null;let l=a*this.direction.dot(ac.cross(qi));if(l<0||c+l>o)return null;let d=-a*qi.dot(lc);return d<0?null:this.at(d/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ut=class i{constructor(e,t,n,s,r,o,a,c,l,d,h,f,u,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,d,h,f,u,g,_,m)}set(e,t,n,s,r,o,a,c,l,d,h,f,u,g,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=d,p[10]=h,p[14]=f,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Bs.setFromMatrixColumn(e,0).length(),r=1/Bs.setFromMatrixColumn(e,1).length(),o=1/Bs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let f=o*d,u=o*h,g=a*d,_=a*h;t[0]=c*d,t[4]=-c*h,t[8]=l,t[1]=u+g*l,t[5]=f-_*l,t[9]=-a*c,t[2]=_-f*l,t[6]=g+u*l,t[10]=o*c}else if(e.order==="YXZ"){let f=c*d,u=c*h,g=l*d,_=l*h;t[0]=f+_*a,t[4]=g*a-u,t[8]=o*l,t[1]=o*h,t[5]=o*d,t[9]=-a,t[2]=u*a-g,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*d,u=c*h,g=l*d,_=l*h;t[0]=f-_*a,t[4]=-o*h,t[8]=g+u*a,t[1]=u+g*a,t[5]=o*d,t[9]=_-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*d,u=o*h,g=a*d,_=a*h;t[0]=c*d,t[4]=g*l-u,t[8]=f*l+_,t[1]=c*h,t[5]=_*l+f,t[9]=u*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,u=o*l,g=a*c,_=a*l;t[0]=c*d,t[4]=_-f*h,t[8]=g*h+u,t[1]=h,t[5]=o*d,t[9]=-a*d,t[2]=-l*d,t[6]=u*h+g,t[10]=f-_*h}else if(e.order==="XZY"){let f=o*c,u=o*l,g=a*c,_=a*l;t[0]=c*d,t[4]=-h,t[8]=l*d,t[1]=f*h+_,t[5]=o*d,t[9]=u*h-g,t[2]=g*h-u,t[6]=a*d,t[10]=_*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Yf,e,$f)}lookAt(e,t,n){let s=this.elements;return Nn.subVectors(e,t),Nn.lengthSq()===0&&(Nn.z=1),Nn.normalize(),Yi.crossVectors(n,Nn),Yi.lengthSq()===0&&(Math.abs(n.z)===1?Nn.x+=1e-4:Nn.z+=1e-4,Nn.normalize(),Yi.crossVectors(n,Nn)),Yi.normalize(),Ho.crossVectors(Nn,Yi),s[0]=Yi.x,s[4]=Ho.x,s[8]=Nn.x,s[1]=Yi.y,s[5]=Ho.y,s[9]=Nn.y,s[2]=Yi.z,s[6]=Ho.z,s[10]=Nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],d=n[1],h=n[5],f=n[9],u=n[13],g=n[2],_=n[6],m=n[10],p=n[14],S=n[3],w=n[7],x=n[11],A=n[15],R=s[0],L=s[4],N=s[8],b=s[12],y=s[1],C=s[5],B=s[9],F=s[13],V=s[2],$=s[6],q=s[10],ne=s[14],G=s[3],he=s[7],ge=s[11],ue=s[15];return r[0]=o*R+a*y+c*V+l*G,r[4]=o*L+a*C+c*$+l*he,r[8]=o*N+a*B+c*q+l*ge,r[12]=o*b+a*F+c*ne+l*ue,r[1]=d*R+h*y+f*V+u*G,r[5]=d*L+h*C+f*$+u*he,r[9]=d*N+h*B+f*q+u*ge,r[13]=d*b+h*F+f*ne+u*ue,r[2]=g*R+_*y+m*V+p*G,r[6]=g*L+_*C+m*$+p*he,r[10]=g*N+_*B+m*q+p*ge,r[14]=g*b+_*F+m*ne+p*ue,r[3]=S*R+w*y+x*V+A*G,r[7]=S*L+w*C+x*$+A*he,r[11]=S*N+w*B+x*q+A*ge,r[15]=S*b+w*F+x*ne+A*ue,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],d=e[2],h=e[6],f=e[10],u=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*c*h-s*l*h-r*a*f+n*l*f+s*a*u-n*c*u)+_*(+t*c*u-t*l*f+r*o*f-s*o*u+s*l*d-r*c*d)+m*(+t*l*h-t*a*u-r*o*h+n*o*u+r*a*d-n*l*d)+p*(-s*a*d-t*c*h+t*a*f+s*o*h-n*o*f+n*c*d)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],d=e[8],h=e[9],f=e[10],u=e[11],g=e[12],_=e[13],m=e[14],p=e[15],S=h*m*l-_*f*l+_*c*u-a*m*u-h*c*p+a*f*p,w=g*f*l-d*m*l-g*c*u+o*m*u+d*c*p-o*f*p,x=d*_*l-g*h*l+g*a*u-o*_*u-d*a*p+o*h*p,A=g*h*c-d*_*c-g*a*f+o*_*f+d*a*m-o*h*m,R=t*S+n*w+s*x+r*A;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let L=1/R;return e[0]=S*L,e[1]=(_*f*r-h*m*r-_*s*u+n*m*u+h*s*p-n*f*p)*L,e[2]=(a*m*r-_*c*r+_*s*l-n*m*l-a*s*p+n*c*p)*L,e[3]=(h*c*r-a*f*r-h*s*l+n*f*l+a*s*u-n*c*u)*L,e[4]=w*L,e[5]=(d*m*r-g*f*r+g*s*u-t*m*u-d*s*p+t*f*p)*L,e[6]=(g*c*r-o*m*r-g*s*l+t*m*l+o*s*p-t*c*p)*L,e[7]=(o*f*r-d*c*r+d*s*l-t*f*l-o*s*u+t*c*u)*L,e[8]=x*L,e[9]=(g*h*r-d*_*r-g*n*u+t*_*u+d*n*p-t*h*p)*L,e[10]=(o*_*r-g*a*r+g*n*l-t*_*l-o*n*p+t*a*p)*L,e[11]=(d*a*r-o*h*r-d*n*l+t*h*l+o*n*u-t*a*u)*L,e[12]=A*L,e[13]=(d*_*s-g*h*s+g*n*f-t*_*f-d*n*m+t*h*m)*L,e[14]=(g*a*s-o*_*s-g*n*c+t*_*c+o*n*m-t*a*m)*L,e[15]=(o*h*s-d*a*s+d*n*c-t*h*c-o*n*f+t*a*f)*L,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,d=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,d*a+n,d*c-s*o,0,l*c-s*a,d*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,d=o+o,h=a+a,f=r*l,u=r*d,g=r*h,_=o*d,m=o*h,p=a*h,S=c*l,w=c*d,x=c*h,A=n.x,R=n.y,L=n.z;return s[0]=(1-(_+p))*A,s[1]=(u+x)*A,s[2]=(g-w)*A,s[3]=0,s[4]=(u-x)*R,s[5]=(1-(f+p))*R,s[6]=(m+S)*R,s[7]=0,s[8]=(g+w)*L,s[9]=(m-S)*L,s[10]=(1-(f+_))*L,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Bs.set(s[0],s[1],s[2]).length(),o=Bs.set(s[4],s[5],s[6]).length(),a=Bs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Qn.copy(this);let l=1/r,d=1/o,h=1/a;return Qn.elements[0]*=l,Qn.elements[1]*=l,Qn.elements[2]*=l,Qn.elements[4]*=d,Qn.elements[5]*=d,Qn.elements[6]*=d,Qn.elements[8]*=h,Qn.elements[9]*=h,Qn.elements[10]*=h,t.setFromRotationMatrix(Qn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=ti,c=!1){let l=this.elements,d=2*r/(t-e),h=2*r/(n-s),f=(t+e)/(t-e),u=(n+s)/(n-s),g,_;if(c)g=r/(o-r),_=o*r/(o-r);else if(a===ti)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===qr)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=ti,c=!1){let l=this.elements,d=2/(t-e),h=2/(n-s),f=-(t+e)/(t-e),u=-(n+s)/(n-s),g,_;if(c)g=1/(o-r),_=o/(o-r);else if(a===ti)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===qr)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=u,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Bs=new I,Qn=new ut,Yf=new I(0,0,0),$f=new I(1,1,1),Yi=new I,Ho=new I,Nn=new I,iu=new ut,su=new Cn,Bn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],d=s[9],h=s[2],f=s[6],u=s[10];switch(t){case"XYZ":this._y=Math.asin(tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-tt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(tt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,u),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-tt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,u),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(tt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,u));break;case"XZY":this._z=Math.asin(-tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-d,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return iu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(iu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return su.setFromEuler(this),this.setFromQuaternion(su,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Bn.DEFAULT_ORDER="XYZ";var er=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Zf=0,ru=new I,zs=new Cn,Si=new ut,Vo=new I,Ur=new I,Jf=new I,Kf=new Cn,ou=new I(1,0,0),au=new I(0,1,0),lu=new I(0,0,1),cu={type:"added"},jf={type:"removed"},ks={type:"childadded",child:null},cc={type:"childremoved",child:null},Vt=class i extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=ws(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new I,t=new Bn,n=new Cn,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ut},normalMatrix:{value:new et}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new er,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zs.setFromAxisAngle(e,t),this.quaternion.multiply(zs),this}rotateOnWorldAxis(e,t){return zs.setFromAxisAngle(e,t),this.quaternion.premultiply(zs),this}rotateX(e){return this.rotateOnAxis(ou,e)}rotateY(e){return this.rotateOnAxis(au,e)}rotateZ(e){return this.rotateOnAxis(lu,e)}translateOnAxis(e,t){return ru.copy(e).applyQuaternion(this.quaternion),this.position.add(ru.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ou,e)}translateY(e){return this.translateOnAxis(au,e)}translateZ(e){return this.translateOnAxis(lu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Vo.copy(e):Vo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ur.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(Ur,Vo,this.up):Si.lookAt(Vo,Ur,this.up),this.quaternion.setFromRotationMatrix(Si),s&&(Si.extractRotation(s.matrixWorld),zs.setFromRotationMatrix(Si),this.quaternion.premultiply(zs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(cu),ks.child=e,this.dispatchEvent(ks),ks.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jf),cc.child=e,this.dispatchEvent(cc),cc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Si.multiply(e.parent.matrixWorld)),e.applyMatrix4(Si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(cu),ks.child=e,this.dispatchEvent(ks),ks.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ur,e,Jf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ur,Kf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){let h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),d=o(e.images),h=o(e.shapes),f=o(e.skeletons),u=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),u.length>0&&(n.animations=u),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let c=[];for(let l in a){let d=a[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Vt.DEFAULT_UP=new I(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ei=new I,bi=new I,hc=new I,Ei=new I,Hs=new I,Vs=new I,hu=new I,uc=new I,dc=new I,fc=new I,pc=new Ct,mc=new Ct,gc=new Ct,Ji=class i{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ei.subVectors(e,t),s.cross(ei);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ei.subVectors(s,t),bi.subVectors(n,t),hc.subVectors(e,t);let o=ei.dot(ei),a=ei.dot(bi),c=ei.dot(hc),l=bi.dot(bi),d=bi.dot(hc),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;let f=1/h,u=(l*c-a*d)*f,g=(o*d-a*c)*f;return r.set(1-u-g,g,u)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ei)===null?!1:Ei.x>=0&&Ei.y>=0&&Ei.x+Ei.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,Ei)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Ei.x),c.addScaledVector(o,Ei.y),c.addScaledVector(a,Ei.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return pc.setScalar(0),mc.setScalar(0),gc.setScalar(0),pc.fromBufferAttribute(e,t),mc.fromBufferAttribute(e,n),gc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(pc,r.x),o.addScaledVector(mc,r.y),o.addScaledVector(gc,r.z),o}static isFrontFacing(e,t,n,s){return ei.subVectors(n,t),bi.subVectors(e,t),ei.cross(bi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ei.subVectors(this.c,this.b),bi.subVectors(this.a,this.b),ei.cross(bi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Hs.subVectors(s,n),Vs.subVectors(r,n),uc.subVectors(e,n);let c=Hs.dot(uc),l=Vs.dot(uc);if(c<=0&&l<=0)return t.copy(n);dc.subVectors(e,s);let d=Hs.dot(dc),h=Vs.dot(dc);if(d>=0&&h<=d)return t.copy(s);let f=c*h-d*l;if(f<=0&&c>=0&&d<=0)return o=c/(c-d),t.copy(n).addScaledVector(Hs,o);fc.subVectors(e,r);let u=Hs.dot(fc),g=Vs.dot(fc);if(g>=0&&u<=g)return t.copy(r);let _=u*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(Vs,a);let m=d*g-u*h;if(m<=0&&h-d>=0&&u-g>=0)return hu.subVectors(r,s),a=(h-d)/(h-d+(u-g)),t.copy(s).addScaledVector(hu,a);let p=1/(m+_+f);return o=_*p,a=f*p,t.copy(n).addScaledVector(Hs,o).addScaledVector(Vs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},vd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},Go={h:0,s:0,l:0};function _c(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Me=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=En){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ht.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ht.workingColorSpace){return this.r=e,this.g=t,this.b=n,ht.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ht.workingColorSpace){if(e=nh(e,1),t=tt(t,0,1),n=tt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=_c(o,r,e+1/3),this.g=_c(o,r,e),this.b=_c(o,r,e-1/3)}return ht.colorSpaceToWorking(this,s),this}setStyle(e,t=En){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=En){let n=vd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wi(e.r),this.g=wi(e.g),this.b=wi(e.b),this}copyLinearToSRGB(e){return this.r=$s(e.r),this.g=$s(e.g),this.b=$s(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=En){return ht.workingToColorSpace(_n.copy(this),e),Math.round(tt(_n.r*255,0,255))*65536+Math.round(tt(_n.g*255,0,255))*256+Math.round(tt(_n.b*255,0,255))}getHexString(e=En){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ht.workingColorSpace){ht.workingToColorSpace(_n.copy(this),t);let n=_n.r,s=_n.g,r=_n.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,d=(a+o)/2;if(a===o)c=0,l=0;else{let h=o-a;switch(l=d<=.5?h/(o+a):h/(2-o-a),o){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=ht.workingColorSpace){return ht.workingToColorSpace(_n.copy(this),t),e.r=_n.r,e.g=_n.g,e.b=_n.b,e}getStyle(e=En){ht.workingToColorSpace(_n.copy(this),e);let t=_n.r,n=_n.g,s=_n.b;return e!==En?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL($i),this.setHSL($i.h+e,$i.s+t,$i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL($i),e.getHSL(Go);let n=Hr($i.h,Go.h,t),s=Hr($i.s,Go.s,t),r=Hr($i.l,Go.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},_n=new Me;Me.NAMES=vd;var Qf=0,fi=class extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=ws(),this.name="",this.type="Material",this.blending=ps,this.side=Ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ca,this.blendDst=ha,this.blendEquation=ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Cc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fs,this.stencilZFail=fs,this.stencilZPass=fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ps&&(n.blending=this.blending),this.side!==Ti&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ca&&(n.blendSrc=this.blendSrc),this.blendDst!==ha&&(n.blendDst=this.blendDst),this.blendEquation!==ji&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ms&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Cc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},zn=class extends fi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=Wc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var qt=new I,Wo=new fe,ep=0,on=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ep++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Pc,this.updateRanges=[],this.gpuType=oi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Wo.fromBufferAttribute(this,t),Wo.applyMatrix3(e),this.setXY(t,Wo.x,Wo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ys(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=bn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ys(t,this.array)),t}setX(e,t){return this.normalized&&(t=bn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ys(t,this.array)),t}setY(e,t){return this.normalized&&(t=bn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ys(t,this.array)),t}setZ(e,t){return this.normalized&&(t=bn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ys(t,this.array)),t}setW(e,t){return this.normalized&&(t=bn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=bn(t,this.array),n=bn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=bn(t,this.array),n=bn(n,this.array),s=bn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=bn(t,this.array),n=bn(n,this.array),s=bn(s,this.array),r=bn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Pc&&(e.usage=this.usage),e}};var Zr=class extends on{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Jr=class extends on{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var nt=class extends on{constructor(e,t,n){super(new Float32Array(e),t,n)}},tp=0,Gn=new ut,xc=new Vt,Gs=new I,Fn=new ui,Nr=new ui,rn=new I,vt=class i extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=ws(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ih(e)?Jr:Zr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new et().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Gn.makeRotationFromQuaternion(e),this.applyMatrix4(Gn),this}rotateX(e){return Gn.makeRotationX(e),this.applyMatrix4(Gn),this}rotateY(e){return Gn.makeRotationY(e),this.applyMatrix4(Gn),this}rotateZ(e){return Gn.makeRotationZ(e),this.applyMatrix4(Gn),this}translate(e,t,n){return Gn.makeTranslation(e,t,n),this.applyMatrix4(Gn),this}scale(e,t,n){return Gn.makeScale(e,t,n),this.applyMatrix4(Gn),this}lookAt(e){return xc.lookAt(e),xc.updateMatrix(),this.applyMatrix4(xc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gs).negate(),this.translate(Gs.x,Gs.y,Gs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new nt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ui);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Fn.setFromBufferAttribute(r),this.morphTargetsRelative?(rn.addVectors(this.boundingBox.min,Fn.min),this.boundingBox.expandByPoint(rn),rn.addVectors(this.boundingBox.max,Fn.max),this.boundingBox.expandByPoint(rn)):(this.boundingBox.expandByPoint(Fn.min),this.boundingBox.expandByPoint(Fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let n=this.boundingSphere.center;if(Fn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Nr.setFromBufferAttribute(a),this.morphTargetsRelative?(rn.addVectors(Fn.min,Nr.min),Fn.expandByPoint(rn),rn.addVectors(Fn.max,Nr.max),Fn.expandByPoint(rn)):(Fn.expandByPoint(Nr.min),Fn.expandByPoint(Nr.max))}Fn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)rn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(rn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,d=a.count;l<d;l++)rn.fromBufferAttribute(a,l),c&&(Gs.fromBufferAttribute(e,l),rn.add(Gs)),s=Math.max(s,n.distanceToSquared(rn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new on(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let N=0;N<n.count;N++)a[N]=new I,c[N]=new I;let l=new I,d=new I,h=new I,f=new fe,u=new fe,g=new fe,_=new I,m=new I;function p(N,b,y){l.fromBufferAttribute(n,N),d.fromBufferAttribute(n,b),h.fromBufferAttribute(n,y),f.fromBufferAttribute(r,N),u.fromBufferAttribute(r,b),g.fromBufferAttribute(r,y),d.sub(l),h.sub(l),u.sub(f),g.sub(f);let C=1/(u.x*g.y-g.x*u.y);isFinite(C)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(h,-u.y).multiplyScalar(C),m.copy(h).multiplyScalar(u.x).addScaledVector(d,-g.x).multiplyScalar(C),a[N].add(_),a[b].add(_),a[y].add(_),c[N].add(m),c[b].add(m),c[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let N=0,b=S.length;N<b;++N){let y=S[N],C=y.start,B=y.count;for(let F=C,V=C+B;F<V;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let w=new I,x=new I,A=new I,R=new I;function L(N){A.fromBufferAttribute(s,N),R.copy(A);let b=a[N];w.copy(b),w.sub(A.multiplyScalar(A.dot(b))).normalize(),x.crossVectors(R,b);let C=x.dot(c[N])<0?-1:1;o.setXYZW(N,w.x,w.y,w.z,C)}for(let N=0,b=S.length;N<b;++N){let y=S[N],C=y.start,B=y.count;for(let F=C,V=C+B;F<V;F+=3)L(e.getX(F+0)),L(e.getX(F+1)),L(e.getX(F+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new on(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,u=n.count;f<u;f++)n.setXYZ(f,0,0,0);let s=new I,r=new I,o=new I,a=new I,c=new I,l=new I,d=new I,h=new I;if(e)for(let f=0,u=e.count;f<u;f+=3){let g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),d.subVectors(o,r),h.subVectors(s,r),d.cross(h),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(d),c.add(d),l.add(d),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,u=t.count;f<u;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),d.subVectors(o,r),h.subVectors(s,r),d.cross(h),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)rn.fromBufferAttribute(e,t),rn.normalize(),e.setXYZ(t,rn.x,rn.y,rn.z)}toNonIndexed(){function e(a,c){let l=a.array,d=a.itemSize,h=a.normalized,f=new l.constructor(c.length*d),u=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?u=c[_]*a.data.stride+a.offset:u=c[_]*d;for(let p=0;p<d;p++)f[g++]=l[u++]}return new on(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let d=0,h=l.length;d<h;d++){let f=l[d],u=e(f,n);c.push(u)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],d=[];for(let h=0,f=l.length;h<f;h++){let u=l[h];d.push(u.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let d=s[l];this.setAttribute(l,d.clone(t))}let r=e.morphAttributes;for(let l in r){let d=[],h=r[l];for(let f=0,u=h.length;f<u;f++)d.push(h[f].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,d=o.length;l<d;l++){let h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},uu=new ut,us=new Ai,Xo=new di,du=new I,qo=new I,Yo=new I,$o=new I,yc=new I,Zo=new I,fu=new I,Jo=new I,Qe=class extends Vt{constructor(e=new vt,t=new zn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Zo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let d=a[c],h=r[c];d!==0&&(yc.fromBufferAttribute(h,e),o?Zo.addScaledVector(yc,d):Zo.addScaledVector(yc.sub(t),d))}t.add(Zo)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xo.copy(n.boundingSphere),Xo.applyMatrix4(r),us.copy(e.ray).recast(e.near),!(Xo.containsPoint(us.origin)===!1&&(us.intersectSphere(Xo,du)===null||us.origin.distanceToSquared(du)>(e.far-e.near)**2))&&(uu.copy(r).invert(),us.copy(e.ray).applyMatrix4(uu),!(n.boundingBox!==null&&us.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,us)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,f=r.groups,u=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],p=o[m.materialIndex],S=Math.max(m.start,u.start),w=Math.min(a.count,Math.min(m.start+m.count,u.start+u.count));for(let x=S,A=w;x<A;x+=3){let R=a.getX(x),L=a.getX(x+1),N=a.getX(x+2);s=Ko(this,p,e,n,l,d,h,R,L,N),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,u.start),_=Math.min(a.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){let S=a.getX(m),w=a.getX(m+1),x=a.getX(m+2);s=Ko(this,o,e,n,l,d,h,S,w,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],p=o[m.materialIndex],S=Math.max(m.start,u.start),w=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let x=S,A=w;x<A;x+=3){let R=x,L=x+1,N=x+2;s=Ko(this,p,e,n,l,d,h,R,L,N),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,u.start),_=Math.min(c.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){let S=m,w=m+1,x=m+2;s=Ko(this,o,e,n,l,d,h,S,w,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function np(i,e,t,n,s,r,o,a){let c;if(e.side===un?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===Ti,a),c===null)return null;Jo.copy(a),Jo.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Jo);return l<t.near||l>t.far?null:{distance:l,point:Jo.clone(),object:i}}function Ko(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,qo),i.getVertexPosition(c,Yo),i.getVertexPosition(l,$o);let d=np(i,e,t,n,qo,Yo,$o,fu);if(d){let h=new I;Ji.getBarycoord(fu,qo,Yo,$o,h),s&&(d.uv=Ji.getInterpolatedAttribute(s,a,c,l,h,new fe)),r&&(d.uv1=Ji.getInterpolatedAttribute(r,a,c,l,h,new fe)),o&&(d.normal=Ji.getInterpolatedAttribute(o,a,c,l,h,new I),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new I,materialIndex:0};Ji.getNormal(qo,Yo,$o,f.normal),d.face=f,d.barycoord=h}return d}var Xn=class i extends vt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],d=[],h=[],f=0,u=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new nt(l,3)),this.setAttribute("normal",new nt(d,3)),this.setAttribute("uv",new nt(h,2));function g(_,m,p,S,w,x,A,R,L,N,b){let y=x/L,C=A/N,B=x/2,F=A/2,V=R/2,$=L+1,q=N+1,ne=0,G=0,he=new I;for(let ge=0;ge<q;ge++){let ue=ge*C-F;for(let Xe=0;Xe<$;Xe++){let Ke=Xe*y-B;he[_]=Ke*S,he[m]=ue*w,he[p]=V,l.push(he.x,he.y,he.z),he[_]=0,he[m]=0,he[p]=R>0?1:-1,d.push(he.x,he.y,he.z),h.push(Xe/L),h.push(1-ge/N),ne+=1}}for(let ge=0;ge<N;ge++)for(let ue=0;ue<L;ue++){let Xe=f+ue+$*ge,Ke=f+ue+$*(ge+1),mt=f+(ue+1)+$*(ge+1),je=f+(ue+1)+$*ge;c.push(Xe,Ke,je),c.push(Ke,mt,je),G+=6}a.addGroup(u,G,b),u+=G,f+=ne}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ts(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function vn(i){let e={};for(let t=0;t<i.length;t++){let n=Ts(i[t]);for(let s in n)e[s]=n[s]}return e}function ip(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function sh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ht.workingColorSpace}var Md={clone:Ts,merge:vn},sp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Pn=class extends fi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sp,this.fragmentShader=rp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ts(e.uniforms),this.uniformsGroups=ip(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Kr=class extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=ti,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Zi=new I,pu=new fe,mu=new fe,xn=class extends Kr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ks*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(kr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ks*2*Math.atan(Math.tan(kr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z),Zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z)}getViewSize(e,t){return this.getViewBounds(e,pu,mu),t.subVectors(mu,pu)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(kr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ws=-90,Xs=1,_a=class extends Vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new xn(Ws,Xs,e,t);s.layers=this.layers,this.add(s);let r=new xn(Ws,Xs,e,t);r.layers=this.layers,this.add(r);let o=new xn(Ws,Xs,e,t);o.layers=this.layers,this.add(o);let a=new xn(Ws,Xs,e,t);a.layers=this.layers,this.add(a);let c=new xn(Ws,Xs,e,t);c.layers=this.layers,this.add(c);let l=new xn(Ws,Xs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===ti)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===qr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(h,f,u),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},jr=class extends wn{constructor(e=[],t=bs,n,s,r,o,a,c,l,d){super(e,t,n,s,r,o,a,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},xa=class extends On{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new jr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Xn(5,5,5),r=new Pn({name:"CubemapFromEquirect",uniforms:Ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:un,blending:Ii});r.uniforms.tEquirect.value=t;let o=new Qe(s,r),a=t.minFilter;return t.minFilter===ts&&(t.minFilter=ni),new _a(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},hn=class extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}},op={type:"move"},tr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new hn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new hn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new hn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=d.position.distanceTo(h.position),u=.02,g=.005;l.inputState.pinching&&f>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(op)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new hn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var Qr=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Me(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},nr=class extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bn,this.environmentIntensity=1,this.environmentRotation=new Bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var ya=class extends wn{constructor(e=null,t=1,n=1,s,r,o,a,c,l=Rn,d=Rn,h,f){super(null,o,a,c,l,d,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var _s=class extends on{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},qs=new ut,gu=new ut,jo=[],_u=new ui,ap=new ut,Fr=new Qe,Or=new di,ir=class extends Qe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new _s(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ap)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ui),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,qs),_u.copy(e.boundingBox).applyMatrix4(qs),this.boundingBox.union(_u)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new di),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,qs),Or.copy(e.boundingSphere).applyMatrix4(qs),this.boundingSphere.union(Or)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Fr.geometry=this.geometry,Fr.material=this.material,Fr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Or.copy(this.boundingSphere),Or.applyMatrix4(n),e.ray.intersectsSphere(Or)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,qs),gu.multiplyMatrices(n,qs),Fr.matrixWorld=gu,Fr.raycast(e,jo);for(let o=0,a=jo.length;o<a;o++){let c=jo[o];c.instanceId=r,c.object=this,t.push(c)}jo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new _s(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ya(new Float32Array(s*this.count),s,this.count,il,oi));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},vc=new I,lp=new I,cp=new et,Wn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=vc.subVectors(n,t).cross(lp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(vc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||cp.getNormalMatrix(e),s=this.coplanarPoint(vc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ds=new di,hp=new fe(.5,.5),Qo=new I,sr=class{constructor(e=new Wn,t=new Wn,n=new Wn,s=new Wn,r=new Wn,o=new Wn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ti,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],d=r[4],h=r[5],f=r[6],u=r[7],g=r[8],_=r[9],m=r[10],p=r[11],S=r[12],w=r[13],x=r[14],A=r[15];if(s[0].setComponents(l-o,u-d,p-g,A-S).normalize(),s[1].setComponents(l+o,u+d,p+g,A+S).normalize(),s[2].setComponents(l+a,u+h,p+_,A+w).normalize(),s[3].setComponents(l-a,u-h,p-_,A-w).normalize(),n)s[4].setComponents(c,f,m,x).normalize(),s[5].setComponents(l-c,u-f,p-m,A-x).normalize();else if(s[4].setComponents(l-c,u-f,p-m,A-x).normalize(),t===ti)s[5].setComponents(l+c,u+f,p+m,A+x).normalize();else if(t===qr)s[5].setComponents(c,f,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ds.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ds.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ds)}intersectsSprite(e){ds.center.set(0,0,0);let t=hp.distanceTo(e.center);return ds.radius=.7071067811865476+t,ds.applyMatrix4(e.matrixWorld),this.intersectsSphere(ds)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Qo.x=s.normal.x>0?e.max.x:e.min.x,Qo.y=s.normal.y>0?e.max.y:e.min.y,Qo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Qo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var rr=class extends fi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},va=new I,Ma=new I,xu=new ut,Br=new Ai,ea=new di,Mc=new I,yu=new I,Sa=class extends Vt{constructor(e=new vt,t=new rr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)va.fromBufferAttribute(t,s-1),Ma.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=va.distanceTo(Ma);e.setAttribute("lineDistance",new nt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ea.copy(n.boundingSphere),ea.applyMatrix4(s),ea.radius+=r,e.ray.intersectsSphere(ea)===!1)return;xu.copy(s).invert(),Br.copy(e.ray).applyMatrix4(xu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){let u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){let p=d.getX(_),S=d.getX(_+1),w=ta(this,e,Br,c,p,S,_);w&&t.push(w)}if(this.isLineLoop){let _=d.getX(g-1),m=d.getX(u),p=ta(this,e,Br,c,_,m,g-1);p&&t.push(p)}}else{let u=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){let p=ta(this,e,Br,c,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=ta(this,e,Br,c,g-1,u,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ta(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(va.fromBufferAttribute(a,s),Ma.fromBufferAttribute(a,r),t.distanceSqToSegment(va,Ma,Mc,yu)>n)return;Mc.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Mc);if(!(l<e.near||l>e.far))return{distance:l,point:yu.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var vu=new I,Mu=new I,eo=class extends Sa{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)vu.fromBufferAttribute(t,s),Mu.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+vu.distanceTo(Mu);e.setAttribute("lineDistance",new nt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var or=class extends fi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Su=new ut,Ic=new Ai,na=new di,ia=new I,to=class extends Vt{constructor(e=new vt,t=new or){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),na.copy(n.boundingSphere),na.applyMatrix4(s),na.radius+=r,e.ray.intersectsSphere(na)===!1)return;Su.copy(s).invert(),Ic.copy(e.ray).applyMatrix4(Su);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,h=n.attributes.position;if(l!==null){let f=Math.max(0,o.start),u=Math.min(l.count,o.start+o.count);for(let g=f,_=u;g<_;g++){let m=l.getX(g);ia.fromBufferAttribute(h,m),bu(ia,m,c,s,e,t,this)}}else{let f=Math.max(0,o.start),u=Math.min(h.count,o.start+o.count);for(let g=f,_=u;g<_;g++)ia.fromBufferAttribute(h,g),bu(ia,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function bu(i,e,t,n,s,r,o){let a=Ic.distanceSqToPoint(i);if(a<t){let c=new I;Ic.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var ar=class extends wn{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},xs=class extends wn{constructor(e,t,n=ns,s,r,o,a=Rn,c=Rn,l,d=Js,h=1){if(d!==Js&&d!==gr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:h};super(f,s,r,o,a,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Qs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},no=class extends wn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},pi=class i extends vt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],c=[],l=[],d=t/2,h=Math.PI/2*e,f=t,u=2*h+f,g=n*2+r,_=s+1,m=new I,p=new I;for(let S=0;S<=g;S++){let w=0,x=0,A=0,R=0;if(S<=n){let b=S/n,y=b*Math.PI/2;x=-d-e*Math.cos(y),A=e*Math.sin(y),R=-e*Math.cos(y),w=b*h}else if(S<=n+r){let b=(S-n)/r;x=-d+b*t,A=e,R=0,w=h+b*f}else{let b=(S-n-r)/n,y=b*Math.PI/2;x=d+e*Math.sin(y),A=e*Math.cos(y),R=e*Math.sin(y),w=h+f+b*h}let L=Math.max(0,Math.min(1,w/u)),N=0;S===0?N=.5/s:S===g&&(N=-.5/s);for(let b=0;b<=s;b++){let y=b/s,C=y*Math.PI*2,B=Math.sin(C),F=Math.cos(C);p.x=-A*F,p.y=x,p.z=A*B,a.push(p.x,p.y,p.z),m.set(-A*F,R,A*B),m.normalize(),c.push(m.x,m.y,m.z),l.push(y+N,L)}if(S>0){let b=(S-1)*_;for(let y=0;y<s;y++){let C=b+y,B=b+y+1,F=S*_+y,V=S*_+y+1;o.push(C,B,F),o.push(B,V,F)}}}this.setIndex(o),this.setAttribute("position",new nt(a,3)),this.setAttribute("normal",new nt(c,3)),this.setAttribute("uv",new nt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},mi=class i extends vt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],c=[],l=new I,d=new fe;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let h=0,f=3;h<=t;h++,f+=3){let u=n+h/t*s;l.x=e*Math.cos(u),l.y=e*Math.sin(u),o.push(l.x,l.y,l.z),a.push(0,0,1),d.x=(o[f]/e+1)/2,d.y=(o[f+1]/e+1)/2,c.push(d.x,d.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new nt(o,3)),this.setAttribute("normal",new nt(a,3)),this.setAttribute("uv",new nt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},qn=class i extends vt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let d=[],h=[],f=[],u=[],g=0,_=[],m=n/2,p=0;S(),o===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(d),this.setAttribute("position",new nt(h,3)),this.setAttribute("normal",new nt(f,3)),this.setAttribute("uv",new nt(u,2));function S(){let x=new I,A=new I,R=0,L=(t-e)/n;for(let N=0;N<=r;N++){let b=[],y=N/r,C=y*(t-e)+e;for(let B=0;B<=s;B++){let F=B/s,V=F*c+a,$=Math.sin(V),q=Math.cos(V);A.x=C*$,A.y=-y*n+m,A.z=C*q,h.push(A.x,A.y,A.z),x.set($,L,q).normalize(),f.push(x.x,x.y,x.z),u.push(F,1-y),b.push(g++)}_.push(b)}for(let N=0;N<s;N++)for(let b=0;b<r;b++){let y=_[b][N],C=_[b+1][N],B=_[b+1][N+1],F=_[b][N+1];(e>0||b!==0)&&(d.push(y,C,F),R+=3),(t>0||b!==r-1)&&(d.push(C,B,F),R+=3)}l.addGroup(p,R,0),p+=R}function w(x){let A=g,R=new fe,L=new I,N=0,b=x===!0?e:t,y=x===!0?1:-1;for(let B=1;B<=s;B++)h.push(0,m*y,0),f.push(0,y,0),u.push(.5,.5),g++;let C=g;for(let B=0;B<=s;B++){let V=B/s*c+a,$=Math.cos(V),q=Math.sin(V);L.x=b*q,L.y=m*y,L.z=b*$,h.push(L.x,L.y,L.z),f.push(0,y,0),R.x=$*.5+.5,R.y=q*.5*y+.5,u.push(R.x,R.y),g++}for(let B=0;B<s;B++){let F=A+B,V=C+B;x===!0?d.push(V,V+1,F):d.push(V+1,V,F),N+=3}l.addGroup(p,N,x===!0?1:2),p+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},io=class i extends qn{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ba=class i extends vt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),l(n),d(),this.setAttribute("position",new nt(r,3)),this.setAttribute("normal",new nt(r.slice(),3)),this.setAttribute("uv",new nt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(S){let w=new I,x=new I,A=new I;for(let R=0;R<t.length;R+=3)u(t[R+0],w),u(t[R+1],x),u(t[R+2],A),c(w,x,A,S)}function c(S,w,x,A){let R=A+1,L=[];for(let N=0;N<=R;N++){L[N]=[];let b=S.clone().lerp(x,N/R),y=w.clone().lerp(x,N/R),C=R-N;for(let B=0;B<=C;B++)B===0&&N===R?L[N][B]=b:L[N][B]=b.clone().lerp(y,B/C)}for(let N=0;N<R;N++)for(let b=0;b<2*(R-N)-1;b++){let y=Math.floor(b/2);b%2===0?(f(L[N][y+1]),f(L[N+1][y]),f(L[N][y])):(f(L[N][y+1]),f(L[N+1][y+1]),f(L[N+1][y]))}}function l(S){let w=new I;for(let x=0;x<r.length;x+=3)w.x=r[x+0],w.y=r[x+1],w.z=r[x+2],w.normalize().multiplyScalar(S),r[x+0]=w.x,r[x+1]=w.y,r[x+2]=w.z}function d(){let S=new I;for(let w=0;w<r.length;w+=3){S.x=r[w+0],S.y=r[w+1],S.z=r[w+2];let x=m(S)/2/Math.PI+.5,A=p(S)/Math.PI+.5;o.push(x,1-A)}g(),h()}function h(){for(let S=0;S<o.length;S+=6){let w=o[S+0],x=o[S+2],A=o[S+4],R=Math.max(w,x,A),L=Math.min(w,x,A);R>.9&&L<.1&&(w<.2&&(o[S+0]+=1),x<.2&&(o[S+2]+=1),A<.2&&(o[S+4]+=1))}}function f(S){r.push(S.x,S.y,S.z)}function u(S,w){let x=S*3;w.x=e[x+0],w.y=e[x+1],w.z=e[x+2]}function g(){let S=new I,w=new I,x=new I,A=new I,R=new fe,L=new fe,N=new fe;for(let b=0,y=0;b<r.length;b+=9,y+=6){S.set(r[b+0],r[b+1],r[b+2]),w.set(r[b+3],r[b+4],r[b+5]),x.set(r[b+6],r[b+7],r[b+8]),R.set(o[y+0],o[y+1]),L.set(o[y+2],o[y+3]),N.set(o[y+4],o[y+5]),A.copy(S).add(w).add(x).divideScalar(3);let C=m(A);_(R,y+0,S,C),_(L,y+2,w,C),_(N,y+4,x,C)}}function _(S,w,x,A){A<0&&S.x===1&&(o[w]=S.x-1),x.x===0&&x.z===0&&(o[w]=A/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function p(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var kn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let d=n[s],f=n[s+1]-d,u=(o-d)/f;return(s+u)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new fe:new I);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new I,s=[],r=[],o=[],a=new I,c=new ut;for(let u=0;u<=e;u++){let g=u/e;s[u]=this.getTangentAt(g,new I)}r[0]=new I,o[0]=new I;let l=Number.MAX_VALUE,d=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let u=1;u<=e;u++){if(r[u]=r[u-1].clone(),o[u]=o[u-1].clone(),a.crossVectors(s[u-1],s[u]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(tt(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(c.makeRotationAxis(a,g))}o[u].crossVectors(s[u],r[u])}if(t===!0){let u=Math.acos(tt(r[0].dot(r[e]),-1,1));u/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(u=-u);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],u*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},lr=class extends kn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new fe){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let d=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=c-this.aX,u=l-this.aY;c=f*d-u*h+this.aX,l=f*h+u*d+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ea=class extends lr{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function rh(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,d,h){let f=(o-r)/l-(a-r)/(l+d)+(a-o)/d,u=(a-o)/d-(c-o)/(d+h)+(c-a)/h;f*=d,u*=d,s(o,a,f,u)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var sa=new I,Sc=new rh,bc=new rh,Ec=new rh,wa=class extends kn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new I){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,d;this.closed||a>0?l=s[(a-1)%r]:(sa.subVectors(s[0],s[1]).add(s[0]),l=sa);let h=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?d=s[(a+2)%r]:(sa.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=sa),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(h),u),_=Math.pow(h.distanceToSquared(f),u),m=Math.pow(f.distanceToSquared(d),u);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Sc.initNonuniformCatmullRom(l.x,h.x,f.x,d.x,g,_,m),bc.initNonuniformCatmullRom(l.y,h.y,f.y,d.y,g,_,m),Ec.initNonuniformCatmullRom(l.z,h.z,f.z,d.z,g,_,m)}else this.curveType==="catmullrom"&&(Sc.initCatmullRom(l.x,h.x,f.x,d.x,this.tension),bc.initCatmullRom(l.y,h.y,f.y,d.y,this.tension),Ec.initCatmullRom(l.z,h.z,f.z,d.z,this.tension));return n.set(Sc.calc(c),bc.calc(c),Ec.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Eu(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function up(i,e){let t=1-i;return t*t*e}function dp(i,e){return 2*(1-i)*i*e}function fp(i,e){return i*i*e}function Vr(i,e,t,n){return up(i,e)+dp(i,t)+fp(i,n)}function pp(i,e){let t=1-i;return t*t*t*e}function mp(i,e){let t=1-i;return 3*t*t*i*e}function gp(i,e){return 3*(1-i)*i*i*e}function _p(i,e){return i*i*i*e}function Gr(i,e,t,n,s){return pp(i,e)+mp(i,t)+gp(i,n)+_p(i,s)}var so=class extends kn{constructor(e=new fe,t=new fe,n=new fe,s=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new fe){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Gr(e,s.x,r.x,o.x,a.x),Gr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ta=class extends kn{constructor(e=new I,t=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new I){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Gr(e,s.x,r.x,o.x,a.x),Gr(e,s.y,r.y,o.y,a.y),Gr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ro=class extends kn{constructor(e=new fe,t=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new fe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Aa=class extends kn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},oo=class extends kn{constructor(e=new fe,t=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new fe){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Vr(e,s.x,r.x,o.x),Vr(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ra=class extends kn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Vr(e,s.x,r.x,o.x),Vr(e,s.y,r.y,o.y),Vr(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ao=class extends kn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new fe){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],d=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(Eu(a,c.x,l.x,d.x,h.x),Eu(a,c.y,l.y,d.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new fe().fromArray(s))}return this}},wu=Object.freeze({__proto__:null,ArcCurve:Ea,CatmullRomCurve3:wa,CubicBezierCurve:so,CubicBezierCurve3:Ta,EllipseCurve:lr,LineCurve:ro,LineCurve3:Aa,QuadraticBezierCurve:oo,QuadraticBezierCurve3:Ra,SplineCurve:ao}),Ca=class extends kn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new wu[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){let d=c[l];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new wu[s.type]().fromJSON(s))}return this}},ys=class extends Ca{constructor(e){super(),this.type="Path",this.currentPoint=new fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ro(this.currentPoint.clone(),new fe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new oo(this.currentPoint.clone(),new fe(e,t),new fe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new so(this.currentPoint.clone(),new fe(e,t),new fe(n,s),new fe(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new ao(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,c){let l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+l,t+d,n,s,r,o,a,c),this}absellipse(e,t,n,s,r,o,a,c){let l=new lr(e,t,n,s,r,o,a,c);if(this.curves.length>0){let h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);let d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},cr=class extends ys{constructor(e){super(e),this.uuid=ws(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new ys().fromJSON(s))}return this}};function xp(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Sd(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=bp(i,e,r,t)),i.length>80*t){a=1/0,c=1/0;let d=-1/0,h=-1/0;for(let f=t;f<s;f+=t){let u=i[f],g=i[f+1];u<a&&(a=u),g<c&&(c=g),u>d&&(d=u),g>h&&(h=g)}l=Math.max(d-a,h-c),l=l!==0?32767/l:0}return lo(r,o,t,a,c,l,0),o}function Sd(i,e,t,n,s){let r;if(s===Up(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Tu(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Tu(o/n|0,i[o],i[o+1],r);return r&&hr(r,r.next)&&(ho(r),r=r.next),r}function vs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(hr(t,t.next)||Ot(t.prev,t,t.next)===0)){if(ho(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function lo(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Rp(i,n,s,r);let a=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?vp(i,n,s,r):yp(i)){e.push(c.i,i.i,l.i),ho(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Mp(vs(i),e),lo(i,e,t,n,s,r,2)):o===2&&Sp(i,e,t,n,s,r):lo(vs(i),e,t,n,s,r,1);break}}}function yp(i){let e=i.prev,t=i,n=i.next;if(Ot(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,d=Math.min(s,r,o),h=Math.min(a,c,l),f=Math.max(s,r,o),u=Math.max(a,c,l),g=n.next;for(;g!==e;){if(g.x>=d&&g.x<=f&&g.y>=h&&g.y<=u&&zr(s,a,r,c,o,l,g.x,g.y)&&Ot(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function vp(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Ot(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,d=s.y,h=r.y,f=o.y,u=Math.min(a,c,l),g=Math.min(d,h,f),_=Math.max(a,c,l),m=Math.max(d,h,f),p=Lc(u,g,e,t,n),S=Lc(_,m,e,t,n),w=i.prevZ,x=i.nextZ;for(;w&&w.z>=p&&x&&x.z<=S;){if(w.x>=u&&w.x<=_&&w.y>=g&&w.y<=m&&w!==s&&w!==o&&zr(a,d,c,h,l,f,w.x,w.y)&&Ot(w.prev,w,w.next)>=0||(w=w.prevZ,x.x>=u&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&zr(a,d,c,h,l,f,x.x,x.y)&&Ot(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;w&&w.z>=p;){if(w.x>=u&&w.x<=_&&w.y>=g&&w.y<=m&&w!==s&&w!==o&&zr(a,d,c,h,l,f,w.x,w.y)&&Ot(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;x&&x.z<=S;){if(x.x>=u&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&zr(a,d,c,h,l,f,x.x,x.y)&&Ot(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Mp(i,e){let t=i;do{let n=t.prev,s=t.next.next;!hr(n,s)&&Ed(n,t,t.next,s)&&co(n,s)&&co(s,n)&&(e.push(n.i,t.i,s.i),ho(t),ho(t.next),t=i=s),t=t.next}while(t!==i);return vs(t)}function Sp(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Ip(o,a)){let c=wd(o,a);o=vs(o,o.next),c=vs(c,c.next),lo(o,e,t,n,s,r,0),lo(c,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function bp(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,c=r<o-1?e[r+1]*n:i.length,l=Sd(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Pp(l))}s.sort(Ep);for(let r=0;r<s.length;r++)t=wp(s[r],t);return t}function Ep(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function wp(i,e){let t=Tp(i,e);if(!t)return e;let n=wd(t,i);return vs(n,n.next),vs(t,t.next)}function Tp(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(hr(i,t))return t;do{if(hr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let h=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=n&&h>r&&(r=h,o=t.x<t.next.x?t:t.next,h===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,c=o.x,l=o.y,d=1/0;t=o;do{if(n>=t.x&&t.x>=c&&n!==t.x&&bd(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let h=Math.abs(s-t.y)/(n-t.x);co(t,i)&&(h<d||h===d&&(t.x>o.x||t.x===o.x&&Ap(o,t)))&&(o=t,d=h)}t=t.next}while(t!==a);return o}function Ap(i,e){return Ot(i.prev,i,e.prev)<0&&Ot(e.next,i,i.next)<0}function Rp(i,e,t,n){let s=i;do s.z===0&&(s.z=Lc(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Cp(s)}function Cp(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function Lc(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Pp(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function bd(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function zr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&bd(i,e,t,n,s,r,o,a)}function Ip(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Lp(i,e)&&(co(i,e)&&co(e,i)&&Dp(i,e)&&(Ot(i.prev,i,e.prev)||Ot(i,e.prev,e))||hr(i,e)&&Ot(i.prev,i,i.next)>0&&Ot(e.prev,e,e.next)>0)}function Ot(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function hr(i,e){return i.x===e.x&&i.y===e.y}function Ed(i,e,t,n){let s=oa(Ot(i,e,t)),r=oa(Ot(i,e,n)),o=oa(Ot(t,n,i)),a=oa(Ot(t,n,e));return!!(s!==r&&o!==a||s===0&&ra(i,t,e)||r===0&&ra(i,n,e)||o===0&&ra(t,i,n)||a===0&&ra(t,e,n))}function ra(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function oa(i){return i>0?1:i<0?-1:0}function Lp(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Ed(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function co(i,e){return Ot(i.prev,i,i.next)<0?Ot(i,e,i.next)>=0&&Ot(i,i.prev,e)>=0:Ot(i,e,i.prev)<0||Ot(i,i.next,e)<0}function Dp(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function wd(i,e){let t=Dc(i.i,i.x,i.y),n=Dc(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Tu(i,e,t,n){let s=Dc(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ho(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Dc(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Up(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Uc=class{static triangulate(e,t,n=2){return xp(e,t,n)}},Zs=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Au(e),Ru(n,e);let o=e.length;t.forEach(Au);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,Ru(n,t[c]);let a=Uc.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Au(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Ru(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var ii=class i extends ba{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Ri=class i extends vt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,d=c+1,h=e/a,f=t/c,u=[],g=[],_=[],m=[];for(let p=0;p<d;p++){let S=p*f-o;for(let w=0;w<l;w++){let x=w*h-r;g.push(x,-S,0),_.push(0,0,1),m.push(w/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<a;S++){let w=S+l*p,x=S+l*(p+1),A=S+1+l*(p+1),R=S+1+l*p;u.push(w,x,R),u.push(x,A,R)}this.setIndex(u),this.setAttribute("position",new nt(g,3)),this.setAttribute("normal",new nt(_,3)),this.setAttribute("uv",new nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},ur=class i extends vt{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);let a=[],c=[],l=[],d=[],h=e,f=(t-e)/s,u=new I,g=new fe;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){let p=r+m/n*o;u.x=h*Math.cos(p),u.y=h*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/t+1)/2,g.y=(u.y/t+1)/2,d.push(g.x,g.y)}h+=f}for(let _=0;_<s;_++){let m=_*(n+1);for(let p=0;p<n;p++){let S=p+m,w=S,x=S+n+1,A=S+n+2,R=S+1;a.push(w,x,R),a.push(x,A,R)}}this.setIndex(a),this.setAttribute("position",new nt(c,3)),this.setAttribute("normal",new nt(l,3)),this.setAttribute("uv",new nt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},uo=class i extends vt{constructor(e=new cr([new fe(0,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],o=[],a=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let d=0;d<e.length;d++)l(e[d]),this.addGroup(a,c,d),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new nt(s,3)),this.setAttribute("normal",new nt(r,3)),this.setAttribute("uv",new nt(o,2));function l(d){let h=s.length/3,f=d.extractPoints(t),u=f.shape,g=f.holes;Zs.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){let S=g[m];Zs.isClockWise(S)===!0&&(g[m]=S.reverse())}let _=Zs.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){let S=g[m];u=u.concat(S)}for(let m=0,p=u.length;m<p;m++){let S=u[m];s.push(S.x,S.y,0),r.push(0,0,1),o.push(S.x,S.y)}for(let m=0,p=_.length;m<p;m++){let S=_[m],w=S[0]+h,x=S[1]+h,A=S[2]+h;n.push(w,x,A),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Np(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];n.push(o)}return new i(n,e.curveSegments)}};function Np(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Ci=class i extends vt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,d=[],h=new I,f=new I,u=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let S=[],w=p/n,x=0;p===0&&o===0?x=.5/t:p===n&&c===Math.PI&&(x=-.5/t);for(let A=0;A<=t;A++){let R=A/t;h.x=-e*Math.cos(s+R*r)*Math.sin(o+w*a),h.y=e*Math.cos(o+w*a),h.z=e*Math.sin(s+R*r)*Math.sin(o+w*a),g.push(h.x,h.y,h.z),f.copy(h).normalize(),_.push(f.x,f.y,f.z),m.push(R+x,1-w),S.push(l++)}d.push(S)}for(let p=0;p<n;p++)for(let S=0;S<t;S++){let w=d[p][S+1],x=d[p][S],A=d[p+1][S],R=d[p+1][S+1];(p!==0||o>0)&&u.push(w,x,R),(p!==n-1||c<Math.PI)&&u.push(x,A,R)}this.setIndex(u),this.setAttribute("position",new nt(g,3)),this.setAttribute("normal",new nt(_,3)),this.setAttribute("uv",new nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Yt=class extends fi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Qc,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Pa=class extends fi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ld,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ia=class extends fi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function aa(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Fp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Ms=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},La=class extends Ms{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Tc,endingEnd:Tc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ac:r=e,a=2*t-n;break;case Rc:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Ac:o=e,c=2*n-t;break;case Rc:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,d=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*d,this._offsetNext=o*d}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,d=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,u=this._weightNext,g=(n-t)/(s-t),_=g*g,m=_*g,p=-f*m+2*f*_-f*g,S=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,w=(-1-u)*m+(1.5+u)*_+.5*g,x=u*m-u*_;for(let A=0;A!==a;++A)r[A]=p*o[d+A]+S*o[l+A]+w*o[c+A]+x*o[h+A];return r}},Da=class extends Ms{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,d=(n-t)/(s-t),h=1-d;for(let f=0;f!==a;++f)r[f]=o[l+f]*h+o[c+f]*d;return r}},Ua=class extends Ms{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Hn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=aa(t,this.TimeBufferType),this.values=aa(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:aa(e.times,Array),values:aa(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ua(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Da(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new La(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Wr:t=this.InterpolantFactoryMethodDiscrete;break;case fa:t=this.InterpolantFactoryMethodLinear;break;case la:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Wr;case this.InterpolantFactoryMethodLinear:return fa;case this.InterpolantFactoryMethodSmooth:return la}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Fp(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===la,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],d=e[a+1];if(l!==d&&(a!==1||l!==e[0]))if(s)c=!0;else{let h=a*n,f=h-n,u=h+n;for(let g=0;g!==n;++g){let _=t[h+g];if(_!==t[f+g]||_!==t[u+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let h=a*n,f=o*n;for(let u=0;u!==n;++u)t[f+u]=t[h+u]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Hn.prototype.ValueTypeName="";Hn.prototype.TimeBufferType=Float32Array;Hn.prototype.ValueBufferType=Float32Array;Hn.prototype.DefaultInterpolation=fa;var Qi=class extends Hn{constructor(e,t,n){super(e,t,n)}};Qi.prototype.ValueTypeName="bool";Qi.prototype.ValueBufferType=Array;Qi.prototype.DefaultInterpolation=Wr;Qi.prototype.InterpolantFactoryMethodLinear=void 0;Qi.prototype.InterpolantFactoryMethodSmooth=void 0;var Na=class extends Hn{constructor(e,t,n,s){super(e,t,n,s)}};Na.prototype.ValueTypeName="color";var Fa=class extends Hn{constructor(e,t,n,s){super(e,t,n,s)}};Fa.prototype.ValueTypeName="number";var Oa=class extends Ms{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let d=l+a;l!==d;l+=4)Cn.slerpFlat(r,0,o,l-a,o,l,c);return r}},fo=class extends Hn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Oa(this.times,this.values,this.getValueSize(),e)}};fo.prototype.ValueTypeName="quaternion";fo.prototype.InterpolantFactoryMethodSmooth=void 0;var es=class extends Hn{constructor(e,t,n){super(e,t,n)}};es.prototype.ValueTypeName="string";es.prototype.ValueBufferType=Array;es.prototype.DefaultInterpolation=Wr;es.prototype.InterpolantFactoryMethodLinear=void 0;es.prototype.InterpolantFactoryMethodSmooth=void 0;var Ba=class extends Hn{constructor(e,t,n,s){super(e,t,n,s)}};Ba.prototype.ValueTypeName="vector";var za=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(d){a++,r===!1&&s.onStart!==void 0&&s.onStart(d,o,a),r=!0},this.itemEnd=function(d){o++,s.onProgress!==void 0&&s.onProgress(d,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,h){return l.push(d,h),this},this.removeHandler=function(d){let h=l.indexOf(d);return h!==-1&&l.splice(h,2),this},this.getHandler=function(d){for(let h=0,f=l.length;h<f;h+=2){let u=l[h],g=l[h+1];if(u.global&&(u.lastIndex=0),u.test(d))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Td=new za,ka=class{constructor(e){this.manager=e!==void 0?e:Td,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ka.DEFAULT_MATERIAL_NAME="__DEFAULT";var po=class extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},mo=class extends po{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},wc=new ut,Cu=new I,Pu=new I,Nc=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.mapType=ri,this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new sr,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Cu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Cu),Pu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Pu),t.updateMatrixWorld(),wc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(wc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Ss=class extends Kr{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=d*this.view.offsetY,c=a-d*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Fc=class extends Nc{constructor(){super(new Ss(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},dr=class extends po{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new Fc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Ha=class extends xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var oh="\\[\\]\\.:\\/",Op=new RegExp("["+oh+"]","g"),ah="[^"+oh+"]",Bp="[^"+oh.replace("\\.","")+"]",zp=/((?:WC+[\/:])*)/.source.replace("WC",ah),kp=/(WCOD+)?/.source.replace("WCOD",Bp),Hp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ah),Vp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ah),Gp=new RegExp("^"+zp+kp+Hp+Vp+"$"),Wp=["material","materials","bones","map"],Oc=class{constructor(e,t,n){let s=n||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Rt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Op,"")}static parseTrackName(e){let t=Gp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Wp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===l){l=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Rt.Composite=Oc;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Zx=new Float32Array(1);var Iu=new ut,go=class{constructor(e,t,n=0,s=1/0){this.ray=new Ai(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new er,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Iu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Iu),this}intersectObject(e,t=!0,n=[]){return Bc(e,this,n,t),n.sort(Lu),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Bc(e[s],this,n,t);return n.sort(Lu),n}};function Lu(i,e){return i.distance-e.distance}function Bc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Bc(r[o],e,t,!0)}}var Pi=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=tt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(tt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var _o=class extends hi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function lh(i,e,t,n){let s=Xp(n);switch(t){case Jc:return i*e;case il:return i*e/s.components*s.byteLength;case sl:return i*e/s.components*s.byteLength;case jc:return i*e*2/s.components*s.byteLength;case rl:return i*e*2/s.components*s.byteLength;case Kc:return i*e*3/s.components*s.byteLength;case $n:return i*e*4/s.components*s.byteLength;case ol:return i*e*4/s.components*s.byteLength;case vo:case Mo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case So:case bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ll:case hl:return Math.max(i,16)*Math.max(e,8)/4;case al:case cl:return Math.max(i,8)*Math.max(e,8)/2;case ul:case dl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case fl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case pl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ml:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case gl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case _l:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case xl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case yl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case vl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ml:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Sl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case bl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case El:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case wl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Tl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Al:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Rl:case Cl:case Pl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Il:case Ll:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Dl:case Ul:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Xp(i){switch(i){case ri:case qc:return{byteLength:1,components:1};case fr:case Yc:case pr:return{byteLength:2,components:1};case tl:case nl:return{byteLength:2,components:4};case ns:case el:case oi:return{byteLength:4,components:1};case $c:case Zc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Jd(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Yp(i){let e=new WeakMap;function t(a,c){let l=a.array,d=a.usage,h=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),a.onUploadCallback();let u;if(l instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)u=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=i.SHORT;else if(l instanceof Uint32Array)u=i.UNSIGNED_INT;else if(l instanceof Int32Array)u=i.INT;else if(l instanceof Int8Array)u=i.BYTE;else if(l instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,c,l){let d=c.array,h=c.updateRanges;if(i.bindBuffer(l,a),h.length===0)i.bufferSubData(l,0,d);else{h.sort((u,g)=>u.start-g.start);let f=0;for(let u=1;u<h.length;u++){let g=h[f],_=h[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,h[f]=_)}h.length=f+1;for(let u=0,g=h.length;u<g;u++){let _=h[u];i.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let d=e.get(a);(!d||d.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var $p=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Jp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Kp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,em=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,im=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,sm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,om=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,am=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,um=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,dm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,_m=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,xm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ym=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Mm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Sm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Em="gl_FragColor = linearToOutputTexel( gl_FragColor );",wm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Am=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Rm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Cm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Im=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Um=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Nm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Fm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Om=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,km=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Hm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Vm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,qm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ym=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$m=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Km=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,eg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ng=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ig=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,og=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ag=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,hg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ug=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,dg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,fg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,_g=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,xg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,bg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Eg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,wg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ag=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Cg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Pg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ig=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ug=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ng=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Fg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Og=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Vg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Yg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$g=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,e0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,t0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,n0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,i0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,s0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,r0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,o0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,a0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,l0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,d0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,p0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,m0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,g0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,x0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,S0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,b0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,E0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,w0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,T0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,it={alphahash_fragment:$p,alphahash_pars_fragment:Zp,alphamap_fragment:Jp,alphamap_pars_fragment:Kp,alphatest_fragment:jp,alphatest_pars_fragment:Qp,aomap_fragment:em,aomap_pars_fragment:tm,batching_pars_vertex:nm,batching_vertex:im,begin_vertex:sm,beginnormal_vertex:rm,bsdfs:om,iridescence_fragment:am,bumpmap_pars_fragment:lm,clipping_planes_fragment:cm,clipping_planes_pars_fragment:hm,clipping_planes_pars_vertex:um,clipping_planes_vertex:dm,color_fragment:fm,color_pars_fragment:pm,color_pars_vertex:mm,color_vertex:gm,common:_m,cube_uv_reflection_fragment:xm,defaultnormal_vertex:ym,displacementmap_pars_vertex:vm,displacementmap_vertex:Mm,emissivemap_fragment:Sm,emissivemap_pars_fragment:bm,colorspace_fragment:Em,colorspace_pars_fragment:wm,envmap_fragment:Tm,envmap_common_pars_fragment:Am,envmap_pars_fragment:Rm,envmap_pars_vertex:Cm,envmap_physical_pars_fragment:km,envmap_vertex:Pm,fog_vertex:Im,fog_pars_vertex:Lm,fog_fragment:Dm,fog_pars_fragment:Um,gradientmap_pars_fragment:Nm,lightmap_pars_fragment:Fm,lights_lambert_fragment:Om,lights_lambert_pars_fragment:Bm,lights_pars_begin:zm,lights_toon_fragment:Hm,lights_toon_pars_fragment:Vm,lights_phong_fragment:Gm,lights_phong_pars_fragment:Wm,lights_physical_fragment:Xm,lights_physical_pars_fragment:qm,lights_fragment_begin:Ym,lights_fragment_maps:$m,lights_fragment_end:Zm,logdepthbuf_fragment:Jm,logdepthbuf_pars_fragment:Km,logdepthbuf_pars_vertex:jm,logdepthbuf_vertex:Qm,map_fragment:eg,map_pars_fragment:tg,map_particle_fragment:ng,map_particle_pars_fragment:ig,metalnessmap_fragment:sg,metalnessmap_pars_fragment:rg,morphinstance_vertex:og,morphcolor_vertex:ag,morphnormal_vertex:lg,morphtarget_pars_vertex:cg,morphtarget_vertex:hg,normal_fragment_begin:ug,normal_fragment_maps:dg,normal_pars_fragment:fg,normal_pars_vertex:pg,normal_vertex:mg,normalmap_pars_fragment:gg,clearcoat_normal_fragment_begin:_g,clearcoat_normal_fragment_maps:xg,clearcoat_pars_fragment:yg,iridescence_pars_fragment:vg,opaque_fragment:Mg,packing:Sg,premultiplied_alpha_fragment:bg,project_vertex:Eg,dithering_fragment:wg,dithering_pars_fragment:Tg,roughnessmap_fragment:Ag,roughnessmap_pars_fragment:Rg,shadowmap_pars_fragment:Cg,shadowmap_pars_vertex:Pg,shadowmap_vertex:Ig,shadowmask_pars_fragment:Lg,skinbase_vertex:Dg,skinning_pars_vertex:Ug,skinning_vertex:Ng,skinnormal_vertex:Fg,specularmap_fragment:Og,specularmap_pars_fragment:Bg,tonemapping_fragment:zg,tonemapping_pars_fragment:kg,transmission_fragment:Hg,transmission_pars_fragment:Vg,uv_pars_fragment:Gg,uv_pars_vertex:Wg,uv_vertex:Xg,worldpos_vertex:qg,background_vert:Yg,background_frag:$g,backgroundCube_vert:Zg,backgroundCube_frag:Jg,cube_vert:Kg,cube_frag:jg,depth_vert:Qg,depth_frag:e0,distanceRGBA_vert:t0,distanceRGBA_frag:n0,equirect_vert:i0,equirect_frag:s0,linedashed_vert:r0,linedashed_frag:o0,meshbasic_vert:a0,meshbasic_frag:l0,meshlambert_vert:c0,meshlambert_frag:h0,meshmatcap_vert:u0,meshmatcap_frag:d0,meshnormal_vert:f0,meshnormal_frag:p0,meshphong_vert:m0,meshphong_frag:g0,meshphysical_vert:_0,meshphysical_frag:x0,meshtoon_vert:y0,meshtoon_frag:v0,points_vert:M0,points_frag:S0,shadow_vert:b0,shadow_frag:E0,sprite_vert:w0,sprite_frag:T0},ve={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},_i={basic:{uniforms:vn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:it.meshbasic_vert,fragmentShader:it.meshbasic_frag},lambert:{uniforms:vn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Me(0)}}]),vertexShader:it.meshlambert_vert,fragmentShader:it.meshlambert_frag},phong:{uniforms:vn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:it.meshphong_vert,fragmentShader:it.meshphong_frag},standard:{uniforms:vn([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag},toon:{uniforms:vn([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Me(0)}}]),vertexShader:it.meshtoon_vert,fragmentShader:it.meshtoon_frag},matcap:{uniforms:vn([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:it.meshmatcap_vert,fragmentShader:it.meshmatcap_frag},points:{uniforms:vn([ve.points,ve.fog]),vertexShader:it.points_vert,fragmentShader:it.points_frag},dashed:{uniforms:vn([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:it.linedashed_vert,fragmentShader:it.linedashed_frag},depth:{uniforms:vn([ve.common,ve.displacementmap]),vertexShader:it.depth_vert,fragmentShader:it.depth_frag},normal:{uniforms:vn([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:it.meshnormal_vert,fragmentShader:it.meshnormal_frag},sprite:{uniforms:vn([ve.sprite,ve.fog]),vertexShader:it.sprite_vert,fragmentShader:it.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:it.background_vert,fragmentShader:it.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:it.backgroundCube_vert,fragmentShader:it.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:it.cube_vert,fragmentShader:it.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:it.equirect_vert,fragmentShader:it.equirect_frag},distanceRGBA:{uniforms:vn([ve.common,ve.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:it.distanceRGBA_vert,fragmentShader:it.distanceRGBA_frag},shadow:{uniforms:vn([ve.lights,ve.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:it.shadow_vert,fragmentShader:it.shadow_frag}};_i.physical={uniforms:vn([_i.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag};var Nl={r:0,b:0,g:0},As=new Bn,A0=new ut;function R0(i,e,t,n,s,r,o){let a=new Me(0),c=r===!0?0:1,l,d,h=null,f=0,u=null;function g(w){let x=w.isScene===!0?w.background:null;return x&&x.isTexture&&(x=(w.backgroundBlurriness>0?t:e).get(x)),x}function _(w){let x=!1,A=g(w);A===null?p(a,c):A&&A.isColor&&(p(A,1),x=!0);let R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(w,x){let A=g(x);A&&(A.isCubeTexture||A.mapping===xo)?(d===void 0&&(d=new Qe(new Xn(1,1,1),new Pn({name:"BackgroundCubeMaterial",uniforms:Ts(_i.backgroundCube.uniforms),vertexShader:_i.backgroundCube.vertexShader,fragmentShader:_i.backgroundCube.fragmentShader,side:un,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(R,L,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),As.copy(x.backgroundRotation),As.x*=-1,As.y*=-1,As.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(As.y*=-1,As.z*=-1),d.material.uniforms.envMap.value=A,d.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(A0.makeRotationFromEuler(As)),d.material.toneMapped=ht.getTransfer(A.colorSpace)!==xt,(h!==A||f!==A.version||u!==i.toneMapping)&&(d.material.needsUpdate=!0,h=A,f=A.version,u=i.toneMapping),d.layers.enableAll(),w.unshift(d,d.geometry,d.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new Qe(new Ri(2,2),new Pn({name:"BackgroundMaterial",uniforms:Ts(_i.background.uniforms),vertexShader:_i.background.vertexShader,fragmentShader:_i.background.fragmentShader,side:Ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=ht.getTransfer(A.colorSpace)!==xt,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(h!==A||f!==A.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=A,f=A.version,u=i.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function p(w,x){w.getRGB(Nl,sh(i)),n.buffers.color.setClear(Nl.r,Nl.g,Nl.b,x,o)}function S(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(w,x=1){a.set(w),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(w){c=w,p(a,c)},render:_,addToRenderList:m,dispose:S}}function C0(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(y,C,B,F,V){let $=!1,q=h(F,B,C);r!==q&&(r=q,l(r.object)),$=u(y,F,B,V),$&&g(y,F,B,V),V!==null&&e.update(V,i.ELEMENT_ARRAY_BUFFER),($||o)&&(o=!1,x(y,C,B,F),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function d(y){return i.deleteVertexArray(y)}function h(y,C,B){let F=B.wireframe===!0,V=n[y.id];V===void 0&&(V={},n[y.id]=V);let $=V[C.id];$===void 0&&($={},V[C.id]=$);let q=$[F];return q===void 0&&(q=f(c()),$[F]=q),q}function f(y){let C=[],B=[],F=[];for(let V=0;V<t;V++)C[V]=0,B[V]=0,F[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:B,attributeDivisors:F,object:y,attributes:{},index:null}}function u(y,C,B,F){let V=r.attributes,$=C.attributes,q=0,ne=B.getAttributes();for(let G in ne)if(ne[G].location>=0){let ge=V[G],ue=$[G];if(ue===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(ue=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(ue=y.instanceColor)),ge===void 0||ge.attribute!==ue||ue&&ge.data!==ue.data)return!0;q++}return r.attributesNum!==q||r.index!==F}function g(y,C,B,F){let V={},$=C.attributes,q=0,ne=B.getAttributes();for(let G in ne)if(ne[G].location>=0){let ge=$[G];ge===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(ge=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(ge=y.instanceColor));let ue={};ue.attribute=ge,ge&&ge.data&&(ue.data=ge.data),V[G]=ue,q++}r.attributes=V,r.attributesNum=q,r.index=F}function _(){let y=r.newAttributes;for(let C=0,B=y.length;C<B;C++)y[C]=0}function m(y){p(y,0)}function p(y,C){let B=r.newAttributes,F=r.enabledAttributes,V=r.attributeDivisors;B[y]=1,F[y]===0&&(i.enableVertexAttribArray(y),F[y]=1),V[y]!==C&&(i.vertexAttribDivisor(y,C),V[y]=C)}function S(){let y=r.newAttributes,C=r.enabledAttributes;for(let B=0,F=C.length;B<F;B++)C[B]!==y[B]&&(i.disableVertexAttribArray(B),C[B]=0)}function w(y,C,B,F,V,$,q){q===!0?i.vertexAttribIPointer(y,C,B,V,$):i.vertexAttribPointer(y,C,B,F,V,$)}function x(y,C,B,F){_();let V=F.attributes,$=B.getAttributes(),q=C.defaultAttributeValues;for(let ne in $){let G=$[ne];if(G.location>=0){let he=V[ne];if(he===void 0&&(ne==="instanceMatrix"&&y.instanceMatrix&&(he=y.instanceMatrix),ne==="instanceColor"&&y.instanceColor&&(he=y.instanceColor)),he!==void 0){let ge=he.normalized,ue=he.itemSize,Xe=e.get(he);if(Xe===void 0)continue;let Ke=Xe.buffer,mt=Xe.type,je=Xe.bytesPerElement,Q=mt===i.INT||mt===i.UNSIGNED_INT||he.gpuType===el;if(he.isInterleavedBufferAttribute){let ee=he.data,Ee=ee.stride,$e=he.offset;if(ee.isInstancedInterleavedBuffer){for(let Ue=0;Ue<G.locationSize;Ue++)p(G.location+Ue,ee.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Ue=0;Ue<G.locationSize;Ue++)m(G.location+Ue);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let Ue=0;Ue<G.locationSize;Ue++)w(G.location+Ue,ue/G.locationSize,mt,ge,Ee*je,($e+ue/G.locationSize*Ue)*je,Q)}else{if(he.isInstancedBufferAttribute){for(let ee=0;ee<G.locationSize;ee++)p(G.location+ee,he.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let ee=0;ee<G.locationSize;ee++)m(G.location+ee);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let ee=0;ee<G.locationSize;ee++)w(G.location+ee,ue/G.locationSize,mt,ge,ue*je,ue/G.locationSize*ee*je,Q)}}else if(q!==void 0){let ge=q[ne];if(ge!==void 0)switch(ge.length){case 2:i.vertexAttrib2fv(G.location,ge);break;case 3:i.vertexAttrib3fv(G.location,ge);break;case 4:i.vertexAttrib4fv(G.location,ge);break;default:i.vertexAttrib1fv(G.location,ge)}}}}S()}function A(){N();for(let y in n){let C=n[y];for(let B in C){let F=C[B];for(let V in F)d(F[V].object),delete F[V];delete C[B]}delete n[y]}}function R(y){if(n[y.id]===void 0)return;let C=n[y.id];for(let B in C){let F=C[B];for(let V in F)d(F[V].object),delete F[V];delete C[B]}delete n[y.id]}function L(y){for(let C in n){let B=n[C];if(B[y.id]===void 0)continue;let F=B[y.id];for(let V in F)d(F[V].object),delete F[V];delete B[y.id]}}function N(){b(),o=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:N,resetDefaultState:b,dispose:A,releaseStatesOfGeometry:R,releaseStatesOfProgram:L,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function P0(i,e,t){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),t.update(d,n,1)}function o(l,d,h){h!==0&&(i.drawArraysInstanced(n,l,d,h),t.update(d,n,h))}function a(l,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,h);let u=0;for(let g=0;g<h;g++)u+=d[g];t.update(u,n,1)}function c(l,d,h,f){if(h===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)o(l[g],d[g],f[g]);else{u.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,h);let g=0;for(let _=0;_<h;_++)g+=d[_]*f[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function I0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let L=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(L){return!(L!==$n&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(L){let N=L===pr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==ri&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==oi&&!N)}function c(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);let h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:x,vertexTextures:A,maxSamples:R}}function L0(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Wn,a=new et,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let u=h.length!==0||f||n!==0||s;return s=f,n=h.length,u},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=d(h,f,0)},this.setState=function(h,f,u){let g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?d(null):l();else{let S=r?0:n,w=S*4,x=p.clippingState||null;c.value=x,x=d(g,f,w,u);for(let A=0;A!==w;++A)x[A]=t[A];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(h,f,u,g){let _=h!==null?h.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let p=u+_*4,S=f.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,x=u;w!==_;++w,x+=4)o.copy(h[w]).applyMatrix4(S,a),o.normal.toArray(m,x),m[x+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function D0(i){let e=new WeakMap;function t(o,a){return a===Ka?o.mapping=bs:a===ja&&(o.mapping=Es),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Ka||a===ja)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new xa(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var yr=4,Ad=[.125,.215,.35,.446,.526,.582],Ps=20,ch=new Ss,Rd=new Me,hh=null,uh=0,dh=0,fh=!1,Cs=(1+Math.sqrt(5))/2,xr=1/Cs,Cd=[new I(-Cs,xr,0),new I(Cs,xr,0),new I(-xr,0,Cs),new I(xr,0,Cs),new I(0,Cs,-xr),new I(0,Cs,xr),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],U0=new I,Bl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=U0}=r;hh=this._renderer.getRenderTarget(),uh=this._renderer.getActiveCubeFace(),dh=this._renderer.getActiveMipmapLevel(),fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ld(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Id(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(hh,uh,dh),this._renderer.xr.enabled=fh,e.scissorTest=!1,Fl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===bs||e.mapping===Es?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),hh=this._renderer.getRenderTarget(),uh=this._renderer.getActiveCubeFace(),dh=this._renderer.getActiveMipmapLevel(),fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ni,minFilter:ni,generateMipmaps:!1,type:pr,format:$n,colorSpace:gs,depthBuffer:!1},s=Pd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Pd(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=N0(r)),this._blurMaterial=F0(r,e,t)}return s}_compileMaterial(e){let t=new Qe(this._lodPlanes[0],e);this._renderer.compile(t,ch)}_sceneToCubeUV(e,t,n,s,r){let c=new xn(90,1,t,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(Rd),h.toneMapping=Li,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));let _=new zn({name:"PMREM.Background",side:un,depthWrite:!1,depthTest:!1}),m=new Qe(new Xn,_),p=!1,S=e.background;S?S.isColor&&(_.color.copy(S),e.background=null,p=!0):(_.color.copy(Rd),p=!0);for(let w=0;w<6;w++){let x=w%3;x===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[w],r.y,r.z)):x===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[w]));let A=this._cubeSize;Fl(s,x*A,w>2?A:0,A,A),h.setRenderTarget(s),p&&h.render(m,c),h.render(e,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=u,h.autoClear=f,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===bs||e.mapping===Es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ld()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Id());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Qe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Fl(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,ch)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Cd[(s-r-1)%Cd.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let d=3,h=new Qe(this._lodPlanes[s],l),f=l.uniforms,u=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*Ps-1),_=r/g,m=isFinite(r)?1+Math.floor(d*_):Ps;m>Ps&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ps}`);let p=[],S=0;for(let L=0;L<Ps;++L){let N=L/_,b=Math.exp(-N*N/2);p.push(b),L===0?S+=b:L<m&&(S+=2*b)}for(let L=0;L<p.length;L++)p[L]=p[L]/S;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-n;let x=this._sizeLods[s],A=3*x*(s>w-yr?s-w+yr:0),R=4*(this._cubeSize-x);Fl(t,A,R,3*x,2*x),c.setRenderTarget(t),c.render(h,ch)}};function N0(i){let e=[],t=[],n=[],s=i,r=i-yr+1+Ad.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>i-yr?c=Ad[o-i+yr-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),d=-l,h=1+l,f=[d,d,h,d,h,h,d,d,h,h,d,h],u=6,g=6,_=3,m=2,p=1,S=new Float32Array(_*g*u),w=new Float32Array(m*g*u),x=new Float32Array(p*g*u);for(let R=0;R<u;R++){let L=R%3*2/3-1,N=R>2?0:-1,b=[L,N,0,L+2/3,N,0,L+2/3,N+1,0,L,N,0,L+2/3,N+1,0,L,N+1,0];S.set(b,_*g*R),w.set(f,m*g*R);let y=[R,R,R,R,R,R];x.set(y,p*g*R)}let A=new vt;A.setAttribute("position",new on(S,_)),A.setAttribute("uv",new on(w,m)),A.setAttribute("faceIndex",new on(x,p)),e.push(A),s>yr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Pd(i,e,t){let n=new On(i,e,t);return n.texture.mapping=xo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Fl(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function F0(i,e,t){let n=new Float32Array(Ps),s=new I(0,1,0);return new Pn({name:"SphericalGaussianBlur",defines:{n:Ps,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function Id(){return new Pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function Ld(){return new Pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function bh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function O0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===Ka||c===ja,d=c===bs||c===Es;if(l||d){let h=e.get(a),f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Bl(i)),h=l?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{let u=a.image;return l&&u&&u.height>0||d&&u&&s(u)?(t===null&&(t=new Bl(i)),h=l?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let c=0,l=6;for(let d=0;d<l;d++)a[d]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function B0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&js("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function z0(i,e,t,n){let s={},r=new WeakMap;function o(h){let f=h.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let u=r.get(f);u&&(e.remove(u),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function c(h){let f=h.attributes;for(let u in f)e.update(f[u],i.ARRAY_BUFFER)}function l(h){let f=[],u=h.index,g=h.attributes.position,_=0;if(u!==null){let S=u.array;_=u.version;for(let w=0,x=S.length;w<x;w+=3){let A=S[w+0],R=S[w+1],L=S[w+2];f.push(A,R,R,L,L,A)}}else if(g!==void 0){let S=g.array;_=g.version;for(let w=0,x=S.length/3-1;w<x;w+=3){let A=w+0,R=w+1,L=w+2;f.push(A,R,R,L,L,A)}}else return;let m=new(ih(f)?Jr:Zr)(f,1);m.version=_;let p=r.get(h);p&&e.remove(p),r.set(h,m)}function d(h){let f=r.get(h);if(f){let u=h.index;u!==null&&f.version<u.version&&l(h)}else l(h);return r.get(h)}return{get:a,update:c,getWireframeAttribute:d}}function k0(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,u){i.drawElements(n,u,r,f*o),t.update(u,n,1)}function l(f,u,g){g!==0&&(i.drawElementsInstanced(n,u,r,f*o,g),t.update(u,n,g))}function d(f,u,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];t.update(m,n,1)}function h(f,u,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/o,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,u,0,r,f,0,_,0,g);let p=0;for(let S=0;S<g;S++)p+=u[S]*_[S];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function H0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function V0(i,e,t){let n=new WeakMap,s=new Ct;function r(o,a,c){let l=o.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=d!==void 0?d.length:0,f=n.get(a);if(f===void 0||f.count!==h){let b=function(){L.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let u=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],w=0;u===!0&&(w=1),g===!0&&(w=2),_===!0&&(w=3);let x=a.attributes.position.count*w,A=1;x>e.maxTextureSize&&(A=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let R=new Float32Array(x*A*4*h),L=new $r(R,x,A,h);L.type=oi,L.needsUpdate=!0;let N=w*4;for(let y=0;y<h;y++){let C=m[y],B=p[y],F=S[y],V=x*A*4*y;for(let $=0;$<C.count;$++){let q=$*N;u===!0&&(s.fromBufferAttribute(C,$),R[V+q+0]=s.x,R[V+q+1]=s.y,R[V+q+2]=s.z,R[V+q+3]=0),g===!0&&(s.fromBufferAttribute(B,$),R[V+q+4]=s.x,R[V+q+5]=s.y,R[V+q+6]=s.z,R[V+q+7]=0),_===!0&&(s.fromBufferAttribute(F,$),R[V+q+8]=s.x,R[V+q+9]=s.y,R[V+q+10]=s.z,R[V+q+11]=F.itemSize===4?s.w:1)}}f={count:h,texture:L,size:new fe(x,A)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let u=0;for(let _=0;_<l.length;_++)u+=l[_];let g=a.morphTargetsRelative?1:1-u;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function G0(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,d=c.geometry,h=e.get(c,d);if(s.get(h)!==l&&(e.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return h}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}var Kd=new wn,Dd=new xs(1,1),jd=new $r,Qd=new ga,ef=new jr,Ud=[],Nd=[],Fd=new Float32Array(16),Od=new Float32Array(9),Bd=new Float32Array(4);function Mr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Ud[s];if(r===void 0&&(r=new Float32Array(s),Ud[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Jt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Kt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function kl(i,e){let t=Nd[e];t===void 0&&(t=new Int32Array(e),Nd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function W0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function X0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Jt(t,e))return;i.uniform2fv(this.addr,e),Kt(t,e)}}function q0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Jt(t,e))return;i.uniform3fv(this.addr,e),Kt(t,e)}}function Y0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Jt(t,e))return;i.uniform4fv(this.addr,e),Kt(t,e)}}function $0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Jt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if(Jt(t,n))return;Bd.set(n),i.uniformMatrix2fv(this.addr,!1,Bd),Kt(t,n)}}function Z0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Jt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if(Jt(t,n))return;Od.set(n),i.uniformMatrix3fv(this.addr,!1,Od),Kt(t,n)}}function J0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Jt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if(Jt(t,n))return;Fd.set(n),i.uniformMatrix4fv(this.addr,!1,Fd),Kt(t,n)}}function K0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function j0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Jt(t,e))return;i.uniform2iv(this.addr,e),Kt(t,e)}}function Q0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Jt(t,e))return;i.uniform3iv(this.addr,e),Kt(t,e)}}function e_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Jt(t,e))return;i.uniform4iv(this.addr,e),Kt(t,e)}}function t_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function n_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Jt(t,e))return;i.uniform2uiv(this.addr,e),Kt(t,e)}}function i_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Jt(t,e))return;i.uniform3uiv(this.addr,e),Kt(t,e)}}function s_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Jt(t,e))return;i.uniform4uiv(this.addr,e),Kt(t,e)}}function r_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Dd.compareFunction=eh,r=Dd):r=Kd,t.setTexture2D(e||r,s)}function o_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Qd,s)}function a_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ef,s)}function l_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||jd,s)}function c_(i){switch(i){case 5126:return W0;case 35664:return X0;case 35665:return q0;case 35666:return Y0;case 35674:return $0;case 35675:return Z0;case 35676:return J0;case 5124:case 35670:return K0;case 35667:case 35671:return j0;case 35668:case 35672:return Q0;case 35669:case 35673:return e_;case 5125:return t_;case 36294:return n_;case 36295:return i_;case 36296:return s_;case 35678:case 36198:case 36298:case 36306:case 35682:return r_;case 35679:case 36299:case 36307:return o_;case 35680:case 36300:case 36308:case 36293:return a_;case 36289:case 36303:case 36311:case 36292:return l_}}function h_(i,e){i.uniform1fv(this.addr,e)}function u_(i,e){let t=Mr(e,this.size,2);i.uniform2fv(this.addr,t)}function d_(i,e){let t=Mr(e,this.size,3);i.uniform3fv(this.addr,t)}function f_(i,e){let t=Mr(e,this.size,4);i.uniform4fv(this.addr,t)}function p_(i,e){let t=Mr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function m_(i,e){let t=Mr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function g_(i,e){let t=Mr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function __(i,e){i.uniform1iv(this.addr,e)}function x_(i,e){i.uniform2iv(this.addr,e)}function y_(i,e){i.uniform3iv(this.addr,e)}function v_(i,e){i.uniform4iv(this.addr,e)}function M_(i,e){i.uniform1uiv(this.addr,e)}function S_(i,e){i.uniform2uiv(this.addr,e)}function b_(i,e){i.uniform3uiv(this.addr,e)}function E_(i,e){i.uniform4uiv(this.addr,e)}function w_(i,e,t){let n=this.cache,s=e.length,r=kl(t,s);Jt(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Kd,r[o])}function T_(i,e,t){let n=this.cache,s=e.length,r=kl(t,s);Jt(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Qd,r[o])}function A_(i,e,t){let n=this.cache,s=e.length,r=kl(t,s);Jt(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||ef,r[o])}function R_(i,e,t){let n=this.cache,s=e.length,r=kl(t,s);Jt(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||jd,r[o])}function C_(i){switch(i){case 5126:return h_;case 35664:return u_;case 35665:return d_;case 35666:return f_;case 35674:return p_;case 35675:return m_;case 35676:return g_;case 5124:case 35670:return __;case 35667:case 35671:return x_;case 35668:case 35672:return y_;case 35669:case 35673:return v_;case 5125:return M_;case 36294:return S_;case 36295:return b_;case 36296:return E_;case 35678:case 36198:case 36298:case 36306:case 35682:return w_;case 35679:case 36299:case 36307:return T_;case 35680:case 36300:case 36308:case 36293:return A_;case 36289:case 36303:case 36311:case 36292:return R_}}var mh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=c_(t.type)}},gh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=C_(t.type)}},_h=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},ph=/(\w+)(\])?(\[|\.)?/g;function zd(i,e){i.seq.push(e),i.map[e.id]=e}function P_(i,e,t){let n=i.name,s=n.length;for(ph.lastIndex=0;;){let r=ph.exec(n),o=ph.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){zd(t,l===void 0?new mh(a,i,e):new gh(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new _h(a),zd(t,h)),t=h}}}var vr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);P_(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function kd(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var I_=37297,L_=0;function D_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Hd=new et;function U_(i){ht._getMatrix(Hd,ht.workingColorSpace,i);let e=`mat3( ${Hd.elements.map(t=>t.toFixed(4))} )`;switch(ht.getTransfer(i)){case Xr:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Vd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+D_(i.getShaderSource(e),a)}else return r}function N_(i,e){let t=U_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function F_(i,e){let t;switch(e){case td:t="Linear";break;case nd:t="Reinhard";break;case id:t="Cineon";break;case sd:t="ACESFilmic";break;case od:t="AgX";break;case Ja:t="Neutral";break;case rd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ol=new I;function O_(){ht.getLuminanceCoefficients(Ol);let i=Ol.x.toFixed(4),e=Ol.y.toFixed(4),t=Ol.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function B_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Eo).join(`
`)}function z_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function k_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Eo(i){return i!==""}function Gd(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Wd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var H_=/^[ \t]*#include +<([\w\d./]+)>/gm;function xh(i){return i.replace(H_,G_)}var V_=new Map;function G_(i,e){let t=it[e];if(t===void 0){let n=V_.get(e);if(n!==void 0)t=it[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return xh(t)}var W_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xd(i){return i.replace(W_,X_)}function X_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function qd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function q_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===kc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Va?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===gi&&(e="SHADOWMAP_TYPE_VSM"),e}function Y_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case bs:case Es:e="ENVMAP_TYPE_CUBE";break;case xo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function $_(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Es:e="ENVMAP_MODE_REFRACTION";break}return e}function Z_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Wc:e="ENVMAP_BLENDING_MULTIPLY";break;case Qu:e="ENVMAP_BLENDING_MIX";break;case ed:e="ENVMAP_BLENDING_ADD";break}return e}function J_(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function K_(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=q_(t),l=Y_(t),d=$_(t),h=Z_(t),f=J_(t),u=B_(t),g=z_(r),_=s.createProgram(),m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Eo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Eo).join(`
`),p.length>0&&(p+=`
`)):(m=[qd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Eo).join(`
`),p=[qd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Li?"#define TONE_MAPPING":"",t.toneMapping!==Li?it.tonemapping_pars_fragment:"",t.toneMapping!==Li?F_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",it.colorspace_pars_fragment,N_("linearToOutputTexel",t.outputColorSpace),O_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Eo).join(`
`)),o=xh(o),o=Gd(o,t),o=Wd(o,t),a=xh(a),a=Gd(a,t),a=Wd(a,t),o=Xd(o),a=Xd(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===th?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===th?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let w=S+m+o,x=S+p+a,A=kd(s,s.VERTEX_SHADER,w),R=kd(s,s.FRAGMENT_SHADER,x);s.attachShader(_,A),s.attachShader(_,R),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function L(C){if(i.debug.checkShaderErrors){let B=s.getProgramInfoLog(_)||"",F=s.getShaderInfoLog(A)||"",V=s.getShaderInfoLog(R)||"",$=B.trim(),q=F.trim(),ne=V.trim(),G=!0,he=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,A,R);else{let ge=Vd(s,A,"vertex"),ue=Vd(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+$+`
`+ge+`
`+ue)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(q===""||ne==="")&&(he=!1);he&&(C.diagnostics={runnable:G,programLog:$,vertexShader:{log:q,prefix:m},fragmentShader:{log:ne,prefix:p}})}s.deleteShader(A),s.deleteShader(R),N=new vr(s,_),b=k_(s,_)}let N;this.getUniforms=function(){return N===void 0&&L(this),N};let b;this.getAttributes=function(){return b===void 0&&L(this),b};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,I_)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=L_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=R,this}var j_=0,yh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new vh(e),t.set(e,n)),n}},vh=class{constructor(e){this.id=j_++,this.code=e,this.usedTimes=0}};function Q_(i,e,t,n,s,r,o){let a=new er,c=new yh,l=new Set,d=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures,u=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,C,B,F){let V=B.fog,$=F.geometry,q=b.isMeshStandardMaterial?B.environment:null,ne=(b.isMeshStandardMaterial?t:e).get(b.envMap||q),G=ne&&ne.mapping===xo?ne.image.height:null,he=g[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));let ge=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,ue=ge!==void 0?ge.length:0,Xe=0;$.morphAttributes.position!==void 0&&(Xe=1),$.morphAttributes.normal!==void 0&&(Xe=2),$.morphAttributes.color!==void 0&&(Xe=3);let Ke,mt,je,Q;if(he){let j=_i[he];Ke=j.vertexShader,mt=j.fragmentShader}else Ke=b.vertexShader,mt=b.fragmentShader,c.update(b),je=c.getVertexShaderID(b),Q=c.getFragmentShaderID(b);let ee=i.getRenderTarget(),Ee=i.state.buffers.depth.getReversed(),$e=F.isInstancedMesh===!0,Ue=F.isBatchedMesh===!0,st=!!b.map,dt=!!b.matcap,U=!!ne,St=!!b.aoMap,Re=!!b.lightMap,qe=!!b.bumpMap,be=!!b.normalMap,bt=!!b.displacementMap,Ce=!!b.emissiveMap,Je=!!b.metalnessMap,Ut=!!b.roughnessMap,ft=b.anisotropy>0,T=b.clearcoat>0,v=b.dispersion>0,k=b.iridescence>0,K=b.sheen>0,ie=b.transmission>0,J=ft&&!!b.anisotropyMap,Ne=T&&!!b.clearcoatMap,ce=T&&!!b.clearcoatNormalMap,De=T&&!!b.clearcoatRoughnessMap,Ae=k&&!!b.iridescenceMap,oe=k&&!!b.iridescenceThicknessMap,xe=K&&!!b.sheenColorMap,We=K&&!!b.sheenRoughnessMap,Pe=!!b.specularMap,me=!!b.specularColorMap,Oe=!!b.specularIntensityMap,D=ie&&!!b.transmissionMap,se=ie&&!!b.thicknessMap,de=!!b.gradientMap,we=!!b.alphaMap,re=b.alphaTest>0,te=!!b.alphaHash,Ie=!!b.extensions,Ze=Li;b.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Ze=i.toneMapping);let yt={shaderID:he,shaderType:b.type,shaderName:b.name,vertexShader:Ke,fragmentShader:mt,defines:b.defines,customVertexShaderID:je,customFragmentShaderID:Q,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Ue,batchingColor:Ue&&F._colorsTexture!==null,instancing:$e,instancingColor:$e&&F.instanceColor!==null,instancingMorph:$e&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ee===null?i.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:gs,alphaToCoverage:!!b.alphaToCoverage,map:st,matcap:dt,envMap:U,envMapMode:U&&ne.mapping,envMapCubeUVHeight:G,aoMap:St,lightMap:Re,bumpMap:qe,normalMap:be,displacementMap:f&&bt,emissiveMap:Ce,normalMapObjectSpace:be&&b.normalMapType===hd,normalMapTangentSpace:be&&b.normalMapType===Qc,metalnessMap:Je,roughnessMap:Ut,anisotropy:ft,anisotropyMap:J,clearcoat:T,clearcoatMap:Ne,clearcoatNormalMap:ce,clearcoatRoughnessMap:De,dispersion:v,iridescence:k,iridescenceMap:Ae,iridescenceThicknessMap:oe,sheen:K,sheenColorMap:xe,sheenRoughnessMap:We,specularMap:Pe,specularColorMap:me,specularIntensityMap:Oe,transmission:ie,transmissionMap:D,thicknessMap:se,gradientMap:de,opaque:b.transparent===!1&&b.blending===ps&&b.alphaToCoverage===!1,alphaMap:we,alphaTest:re,alphaHash:te,combine:b.combine,mapUv:st&&_(b.map.channel),aoMapUv:St&&_(b.aoMap.channel),lightMapUv:Re&&_(b.lightMap.channel),bumpMapUv:qe&&_(b.bumpMap.channel),normalMapUv:be&&_(b.normalMap.channel),displacementMapUv:bt&&_(b.displacementMap.channel),emissiveMapUv:Ce&&_(b.emissiveMap.channel),metalnessMapUv:Je&&_(b.metalnessMap.channel),roughnessMapUv:Ut&&_(b.roughnessMap.channel),anisotropyMapUv:J&&_(b.anisotropyMap.channel),clearcoatMapUv:Ne&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:ce&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:We&&_(b.sheenRoughnessMap.channel),specularMapUv:Pe&&_(b.specularMap.channel),specularColorMapUv:me&&_(b.specularColorMap.channel),specularIntensityMapUv:Oe&&_(b.specularIntensityMap.channel),transmissionMapUv:D&&_(b.transmissionMap.channel),thicknessMapUv:se&&_(b.thicknessMap.channel),alphaMapUv:we&&_(b.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(be||ft),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!$.attributes.uv&&(st||we),fog:!!V,useFog:b.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ee,skinning:F.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:Xe,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ze,decodeVideoTexture:st&&b.map.isVideoTexture===!0&&ht.getTransfer(b.map.colorSpace)===xt,decodeVideoTextureEmissive:Ce&&b.emissiveMap.isVideoTexture===!0&&ht.getTransfer(b.emissiveMap.colorSpace)===xt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===yn,flipSided:b.side===un,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ie&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ie&&b.extensions.multiDraw===!0||Ue)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return yt.vertexUv1s=l.has(1),yt.vertexUv2s=l.has(2),yt.vertexUv3s=l.has(3),l.clear(),yt}function p(b){let y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(let C in b.defines)y.push(C),y.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(S(y,b),w(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function S(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function w(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),y.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){let y=g[b.type],C;if(y){let B=_i[y];C=Md.clone(B.uniforms)}else C=b.uniforms;return C}function A(b,y){let C;for(let B=0,F=d.length;B<F;B++){let V=d[B];if(V.cacheKey===y){C=V,++C.usedTimes;break}}return C===void 0&&(C=new K_(i,y,b,r),d.push(C)),C}function R(b){if(--b.usedTimes===0){let y=d.indexOf(b);d[y]=d[d.length-1],d.pop(),b.destroy()}}function L(b){c.remove(b)}function N(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:A,releaseProgram:R,releaseShaderCache:L,programs:d,dispose:N}}function ex(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function tx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Yd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function $d(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,f,u,g,_,m){let p=i[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:u,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},i[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=u,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function a(h,f,u,g,_,m){let p=o(h,f,u,g,_,m);u.transmission>0?n.push(p):u.transparent===!0?s.push(p):t.push(p)}function c(h,f,u,g,_,m){let p=o(h,f,u,g,_,m);u.transmission>0?n.unshift(p):u.transparent===!0?s.unshift(p):t.unshift(p)}function l(h,f){t.length>1&&t.sort(h||tx),n.length>1&&n.sort(f||Yd),s.length>1&&s.sort(f||Yd)}function d(){for(let h=e,f=i.length;h<f;h++){let u=i[h];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:d,sort:l}}function nx(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new $d,i.set(n,[o])):s>=r.length?(o=new $d,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function ix(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Me};break;case"SpotLight":t={position:new I,direction:new I,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function sx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var rx=0;function ox(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function ax(i){let e=new ix,t=sx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new I);let s=new I,r=new ut,o=new ut;function a(l){let d=0,h=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,S=0,w=0,x=0,A=0,R=0,L=0;l.sort(ox);for(let b=0,y=l.length;b<y;b++){let C=l[b],B=C.color,F=C.intensity,V=C.distance,$=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)d+=B.r*F,h+=B.g*F,f+=B.b*F;else if(C.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(C.sh.coefficients[q],F);L++}else if(C.isDirectionalLight){let q=e.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let ne=C.shadow,G=t.get(C);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,n.directionalShadow[u]=G,n.directionalShadowMap[u]=$,n.directionalShadowMatrix[u]=C.shadow.matrix,S++}n.directional[u]=q,u++}else if(C.isSpotLight){let q=e.get(C);q.position.setFromMatrixPosition(C.matrixWorld),q.color.copy(B).multiplyScalar(F),q.distance=V,q.coneCos=Math.cos(C.angle),q.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),q.decay=C.decay,n.spot[_]=q;let ne=C.shadow;if(C.map&&(n.spotLightMap[A]=C.map,A++,ne.updateMatrices(C),C.castShadow&&R++),n.spotLightMatrix[_]=ne.matrix,C.castShadow){let G=t.get(C);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=$,x++}_++}else if(C.isRectAreaLight){let q=e.get(C);q.color.copy(B).multiplyScalar(F),q.halfWidth.set(C.width*.5,0,0),q.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=q,m++}else if(C.isPointLight){let q=e.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),q.distance=C.distance,q.decay=C.decay,C.castShadow){let ne=C.shadow,G=t.get(C);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,G.shadowCameraNear=ne.camera.near,G.shadowCameraFar=ne.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=$,n.pointShadowMatrix[g]=C.shadow.matrix,w++}n.point[g]=q,g++}else if(C.isHemisphereLight){let q=e.get(C);q.skyColor.copy(C.color).multiplyScalar(F),q.groundColor.copy(C.groundColor).multiplyScalar(F),n.hemi[p]=q,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=f;let N=n.hash;(N.directionalLength!==u||N.pointLength!==g||N.spotLength!==_||N.rectAreaLength!==m||N.hemiLength!==p||N.numDirectionalShadows!==S||N.numPointShadows!==w||N.numSpotShadows!==x||N.numSpotMaps!==A||N.numLightProbes!==L)&&(n.directional.length=u,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=x+A-R,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=L,N.directionalLength=u,N.pointLength=g,N.spotLength=_,N.rectAreaLength=m,N.hemiLength=p,N.numDirectionalShadows=S,N.numPointShadows=w,N.numSpotShadows=x,N.numSpotMaps=A,N.numLightProbes=L,n.version=rx++)}function c(l,d){let h=0,f=0,u=0,g=0,_=0,m=d.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){let w=l[p];if(w.isDirectionalLight){let x=n.directional[h];x.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),h++}else if(w.isSpotLight){let x=n.spot[u];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(w.isRectAreaLight){let x=n.rectArea[g];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(w.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(w.width*.5,0,0),x.halfHeight.set(0,w.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(w.isPointLight){let x=n.point[f];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(m),f++}else if(w.isHemisphereLight){let x=n.hemi[_];x.direction.setFromMatrixPosition(w.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:n}}function Zd(i){let e=new ax(i),t=[],n=[];function s(d){l.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function o(d){n.push(d)}function a(){e.setup(t)}function c(d){e.setupView(t,d)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function lx(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Zd(i),e.set(s,[a])):r>=o.length?(a=new Zd(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var cx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ux(i,e,t){let n=new sr,s=new fe,r=new fe,o=new Ct,a=new Pa({depthPacking:cd}),c=new Ia,l={},d=t.maxTextureSize,h={[Ti]:un,[un]:Ti,[yn]:yn},f=new Pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:cx,fragmentShader:hx}),u=f.clone();u.defines.HORIZONTAL_PASS=1;let g=new vt;g.setAttribute("position",new on(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Qe(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kc;let p=this.type;this.render=function(R,L,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;let b=i.getRenderTarget(),y=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),B=i.state;B.setBlending(Ii),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let F=p!==gi&&this.type===gi,V=p===gi&&this.type!==gi;for(let $=0,q=R.length;$<q;$++){let ne=R[$],G=ne.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ne,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let he=G.getFrameExtents();if(s.multiply(he),r.copy(G.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/he.x),s.x=r.x*he.x,G.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/he.y),s.y=r.y*he.y,G.mapSize.y=r.y)),G.map===null||F===!0||V===!0){let ue=this.type!==gi?{minFilter:Rn,magFilter:Rn}:{};G.map!==null&&G.map.dispose(),G.map=new On(s.x,s.y,ue),G.map.texture.name=ne.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let ge=G.getViewportCount();for(let ue=0;ue<ge;ue++){let Xe=G.getViewport(ue);o.set(r.x*Xe.x,r.y*Xe.y,r.x*Xe.z,r.y*Xe.w),B.viewport(o),G.updateMatrices(ne,ue),n=G.getFrustum(),x(L,N,G.camera,ne,this.type)}G.isPointLightShadow!==!0&&this.type===gi&&S(G,N),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,y,C)};function S(R,L){let N=e.update(_);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,u.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,u.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new On(s.x,s.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(L,null,N,f,_,null),u.uniforms.shadow_pass.value=R.mapPass.texture,u.uniforms.resolution.value=R.mapSize,u.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(L,null,N,u,_,null)}function w(R,L,N,b){let y=null,C=N.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(C!==void 0)y=C;else if(y=N.isPointLight===!0?c:a,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){let B=y.uuid,F=L.uuid,V=l[B];V===void 0&&(V={},l[B]=V);let $=V[F];$===void 0&&($=y.clone(),V[F]=$,L.addEventListener("dispose",A)),y=$}if(y.visible=L.visible,y.wireframe=L.wireframe,b===gi?y.side=L.shadowSide!==null?L.shadowSide:L.side:y.side=L.shadowSide!==null?L.shadowSide:h[L.side],y.alphaMap=L.alphaMap,y.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,y.map=L.map,y.clipShadows=L.clipShadows,y.clippingPlanes=L.clippingPlanes,y.clipIntersection=L.clipIntersection,y.displacementMap=L.displacementMap,y.displacementScale=L.displacementScale,y.displacementBias=L.displacementBias,y.wireframeLinewidth=L.wireframeLinewidth,y.linewidth=L.linewidth,N.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let B=i.properties.get(y);B.light=N}return y}function x(R,L,N,b,y){if(R.visible===!1)return;if(R.layers.test(L.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&y===gi)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,R.matrixWorld);let F=e.update(R),V=R.material;if(Array.isArray(V)){let $=F.groups;for(let q=0,ne=$.length;q<ne;q++){let G=$[q],he=V[G.materialIndex];if(he&&he.visible){let ge=w(R,he,b,y);R.onBeforeShadow(i,R,L,N,F,ge,G),i.renderBufferDirect(N,null,F,ge,R,G),R.onAfterShadow(i,R,L,N,F,ge,G)}}}else if(V.visible){let $=w(R,V,b,y);R.onBeforeShadow(i,R,L,N,F,$,null),i.renderBufferDirect(N,null,F,$,R,null),R.onAfterShadow(i,R,L,N,F,$,null)}}let B=R.children;for(let F=0,V=B.length;F<V;F++)x(B[F],L,N,b,y)}function A(R){R.target.removeEventListener("dispose",A);for(let N in l){let b=l[N],y=R.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}var dx={[Ga]:Wa,[Xa]:$a,[qa]:Za,[ms]:Ya,[Wa]:Ga,[$a]:Xa,[Za]:qa,[Ya]:ms};function fx(i,e){function t(){let D=!1,se=new Ct,de=null,we=new Ct(0,0,0,0);return{setMask:function(re){de!==re&&!D&&(i.colorMask(re,re,re,re),de=re)},setLocked:function(re){D=re},setClear:function(re,te,Ie,Ze,yt){yt===!0&&(re*=Ze,te*=Ze,Ie*=Ze),se.set(re,te,Ie,Ze),we.equals(se)===!1&&(i.clearColor(re,te,Ie,Ze),we.copy(se))},reset:function(){D=!1,de=null,we.set(-1,0,0,0)}}}function n(){let D=!1,se=!1,de=null,we=null,re=null;return{setReversed:function(te){if(se!==te){let Ie=e.get("EXT_clip_control");te?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),se=te;let Ze=re;re=null,this.setClear(Ze)}},getReversed:function(){return se},setTest:function(te){te?ee(i.DEPTH_TEST):Ee(i.DEPTH_TEST)},setMask:function(te){de!==te&&!D&&(i.depthMask(te),de=te)},setFunc:function(te){if(se&&(te=dx[te]),we!==te){switch(te){case Ga:i.depthFunc(i.NEVER);break;case Wa:i.depthFunc(i.ALWAYS);break;case Xa:i.depthFunc(i.LESS);break;case ms:i.depthFunc(i.LEQUAL);break;case qa:i.depthFunc(i.EQUAL);break;case Ya:i.depthFunc(i.GEQUAL);break;case $a:i.depthFunc(i.GREATER);break;case Za:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=te}},setLocked:function(te){D=te},setClear:function(te){re!==te&&(se&&(te=1-te),i.clearDepth(te),re=te)},reset:function(){D=!1,de=null,we=null,re=null,se=!1}}}function s(){let D=!1,se=null,de=null,we=null,re=null,te=null,Ie=null,Ze=null,yt=null;return{setTest:function(j){D||(j?ee(i.STENCIL_TEST):Ee(i.STENCIL_TEST))},setMask:function(j){se!==j&&!D&&(i.stencilMask(j),se=j)},setFunc:function(j,Gt,$t){(de!==j||we!==Gt||re!==$t)&&(i.stencilFunc(j,Gt,$t),de=j,we=Gt,re=$t)},setOp:function(j,Gt,$t){(te!==j||Ie!==Gt||Ze!==$t)&&(i.stencilOp(j,Gt,$t),te=j,Ie=Gt,Ze=$t)},setLocked:function(j){D=j},setClear:function(j){yt!==j&&(i.clearStencil(j),yt=j)},reset:function(){D=!1,se=null,de=null,we=null,re=null,te=null,Ie=null,Ze=null,yt=null}}}let r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap,d={},h={},f=new WeakMap,u=[],g=null,_=!1,m=null,p=null,S=null,w=null,x=null,A=null,R=null,L=new Me(0,0,0),N=0,b=!1,y=null,C=null,B=null,F=null,V=null,$=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,ne=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(G)[1]),q=ne>=1):G.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),q=ne>=2);let he=null,ge={},ue=i.getParameter(i.SCISSOR_BOX),Xe=i.getParameter(i.VIEWPORT),Ke=new Ct().fromArray(ue),mt=new Ct().fromArray(Xe);function je(D,se,de,we){let re=new Uint8Array(4),te=i.createTexture();i.bindTexture(D,te),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ie=0;Ie<de;Ie++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(se,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,re):i.texImage2D(se+Ie,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,re);return te}let Q={};Q[i.TEXTURE_2D]=je(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=je(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=je(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=je(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ee(i.DEPTH_TEST),o.setFunc(ms),qe(!1),be(zc),ee(i.CULL_FACE),St(Ii);function ee(D){d[D]!==!0&&(i.enable(D),d[D]=!0)}function Ee(D){d[D]!==!1&&(i.disable(D),d[D]=!1)}function $e(D,se){return h[D]!==se?(i.bindFramebuffer(D,se),h[D]=se,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=se),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=se),!0):!1}function Ue(D,se){let de=u,we=!1;if(D){de=f.get(se),de===void 0&&(de=[],f.set(se,de));let re=D.textures;if(de.length!==re.length||de[0]!==i.COLOR_ATTACHMENT0){for(let te=0,Ie=re.length;te<Ie;te++)de[te]=i.COLOR_ATTACHMENT0+te;de.length=re.length,we=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,we=!0);we&&i.drawBuffers(de)}function st(D){return g!==D?(i.useProgram(D),g=D,!0):!1}let dt={[ji]:i.FUNC_ADD,[Fu]:i.FUNC_SUBTRACT,[Ou]:i.FUNC_REVERSE_SUBTRACT};dt[Bu]=i.MIN,dt[zu]=i.MAX;let U={[ku]:i.ZERO,[Hu]:i.ONE,[Vu]:i.SRC_COLOR,[ca]:i.SRC_ALPHA,[$u]:i.SRC_ALPHA_SATURATE,[qu]:i.DST_COLOR,[Wu]:i.DST_ALPHA,[Gu]:i.ONE_MINUS_SRC_COLOR,[ha]:i.ONE_MINUS_SRC_ALPHA,[Yu]:i.ONE_MINUS_DST_COLOR,[Xu]:i.ONE_MINUS_DST_ALPHA,[Zu]:i.CONSTANT_COLOR,[Ju]:i.ONE_MINUS_CONSTANT_COLOR,[Ku]:i.CONSTANT_ALPHA,[ju]:i.ONE_MINUS_CONSTANT_ALPHA};function St(D,se,de,we,re,te,Ie,Ze,yt,j){if(D===Ii){_===!0&&(Ee(i.BLEND),_=!1);return}if(_===!1&&(ee(i.BLEND),_=!0),D!==Nu){if(D!==m||j!==b){if((p!==ji||x!==ji)&&(i.blendEquation(i.FUNC_ADD),p=ji,x=ji),j)switch(D){case ps:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Hc:i.blendFunc(i.ONE,i.ONE);break;case Vc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Gc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case ps:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Hc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Vc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Gc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}S=null,w=null,A=null,R=null,L.set(0,0,0),N=0,m=D,b=j}return}re=re||se,te=te||de,Ie=Ie||we,(se!==p||re!==x)&&(i.blendEquationSeparate(dt[se],dt[re]),p=se,x=re),(de!==S||we!==w||te!==A||Ie!==R)&&(i.blendFuncSeparate(U[de],U[we],U[te],U[Ie]),S=de,w=we,A=te,R=Ie),(Ze.equals(L)===!1||yt!==N)&&(i.blendColor(Ze.r,Ze.g,Ze.b,yt),L.copy(Ze),N=yt),m=D,b=!1}function Re(D,se){D.side===yn?Ee(i.CULL_FACE):ee(i.CULL_FACE);let de=D.side===un;se&&(de=!de),qe(de),D.blending===ps&&D.transparent===!1?St(Ii):St(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);let we=D.stencilWrite;a.setTest(we),we&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Ce(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ee(i.SAMPLE_ALPHA_TO_COVERAGE):Ee(i.SAMPLE_ALPHA_TO_COVERAGE)}function qe(D){y!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),y=D)}function be(D){D!==Du?(ee(i.CULL_FACE),D!==C&&(D===zc?i.cullFace(i.BACK):D===Uu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ee(i.CULL_FACE),C=D}function bt(D){D!==B&&(q&&i.lineWidth(D),B=D)}function Ce(D,se,de){D?(ee(i.POLYGON_OFFSET_FILL),(F!==se||V!==de)&&(i.polygonOffset(se,de),F=se,V=de)):Ee(i.POLYGON_OFFSET_FILL)}function Je(D){D?ee(i.SCISSOR_TEST):Ee(i.SCISSOR_TEST)}function Ut(D){D===void 0&&(D=i.TEXTURE0+$-1),he!==D&&(i.activeTexture(D),he=D)}function ft(D,se,de){de===void 0&&(he===null?de=i.TEXTURE0+$-1:de=he);let we=ge[de];we===void 0&&(we={type:void 0,texture:void 0},ge[de]=we),(we.type!==D||we.texture!==se)&&(he!==de&&(i.activeTexture(de),he=de),i.bindTexture(D,se||Q[D]),we.type=D,we.texture=se)}function T(){let D=ge[he];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function k(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function K(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ie(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ne(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ce(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function De(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ae(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function oe(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(D){Ke.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Ke.copy(D))}function We(D){mt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),mt.copy(D))}function Pe(D,se){let de=l.get(se);de===void 0&&(de=new WeakMap,l.set(se,de));let we=de.get(D);we===void 0&&(we=i.getUniformBlockIndex(se,D.name),de.set(D,we))}function me(D,se){let we=l.get(se).get(D);c.get(se)!==we&&(i.uniformBlockBinding(se,we,D.__bindingPointIndex),c.set(se,we))}function Oe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},he=null,ge={},h={},f=new WeakMap,u=[],g=null,_=!1,m=null,p=null,S=null,w=null,x=null,A=null,R=null,L=new Me(0,0,0),N=0,b=!1,y=null,C=null,B=null,F=null,V=null,Ke.set(0,0,i.canvas.width,i.canvas.height),mt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ee,disable:Ee,bindFramebuffer:$e,drawBuffers:Ue,useProgram:st,setBlending:St,setMaterial:Re,setFlipSided:qe,setCullFace:be,setLineWidth:bt,setPolygonOffset:Ce,setScissorTest:Je,activeTexture:Ut,bindTexture:ft,unbindTexture:T,compressedTexImage2D:v,compressedTexImage3D:k,texImage2D:Ae,texImage3D:oe,updateUBOMapping:Pe,uniformBlockBinding:me,texStorage2D:ce,texStorage3D:De,texSubImage2D:K,texSubImage3D:ie,compressedTexSubImage2D:J,compressedTexSubImage3D:Ne,scissor:xe,viewport:We,reset:Oe}}function px(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new fe,d=new WeakMap,h,f=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return u?new OffscreenCanvas(T,v):Yr("canvas")}function _(T,v,k){let K=1,ie=ft(T);if((ie.width>k||ie.height>k)&&(K=k/Math.max(ie.width,ie.height)),K<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let J=Math.floor(K*ie.width),Ne=Math.floor(K*ie.height);h===void 0&&(h=g(J,Ne));let ce=v?g(J,Ne):h;return ce.width=J,ce.height=Ne,ce.getContext("2d").drawImage(T,0,0,J,Ne),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+J+"x"+Ne+")."),ce}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){i.generateMipmap(T)}function S(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(T,v,k,K,ie=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let J=v;if(v===i.RED&&(k===i.FLOAT&&(J=i.R32F),k===i.HALF_FLOAT&&(J=i.R16F),k===i.UNSIGNED_BYTE&&(J=i.R8)),v===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.R8UI),k===i.UNSIGNED_SHORT&&(J=i.R16UI),k===i.UNSIGNED_INT&&(J=i.R32UI),k===i.BYTE&&(J=i.R8I),k===i.SHORT&&(J=i.R16I),k===i.INT&&(J=i.R32I)),v===i.RG&&(k===i.FLOAT&&(J=i.RG32F),k===i.HALF_FLOAT&&(J=i.RG16F),k===i.UNSIGNED_BYTE&&(J=i.RG8)),v===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RG8UI),k===i.UNSIGNED_SHORT&&(J=i.RG16UI),k===i.UNSIGNED_INT&&(J=i.RG32UI),k===i.BYTE&&(J=i.RG8I),k===i.SHORT&&(J=i.RG16I),k===i.INT&&(J=i.RG32I)),v===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RGB8UI),k===i.UNSIGNED_SHORT&&(J=i.RGB16UI),k===i.UNSIGNED_INT&&(J=i.RGB32UI),k===i.BYTE&&(J=i.RGB8I),k===i.SHORT&&(J=i.RGB16I),k===i.INT&&(J=i.RGB32I)),v===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),k===i.UNSIGNED_INT&&(J=i.RGBA32UI),k===i.BYTE&&(J=i.RGBA8I),k===i.SHORT&&(J=i.RGBA16I),k===i.INT&&(J=i.RGBA32I)),v===i.RGB&&(k===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),v===i.RGBA){let Ne=ie?Xr:ht.getTransfer(K);k===i.FLOAT&&(J=i.RGBA32F),k===i.HALF_FLOAT&&(J=i.RGBA16F),k===i.UNSIGNED_BYTE&&(J=Ne===xt?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function x(T,v){let k;return T?v===null||v===ns||v===mr?k=i.DEPTH24_STENCIL8:v===oi?k=i.DEPTH32F_STENCIL8:v===fr&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ns||v===mr?k=i.DEPTH_COMPONENT24:v===oi?k=i.DEPTH_COMPONENT32F:v===fr&&(k=i.DEPTH_COMPONENT16),k}function A(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Rn&&T.minFilter!==ni?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function R(T){let v=T.target;v.removeEventListener("dispose",R),N(v),v.isVideoTexture&&d.delete(v)}function L(T){let v=T.target;v.removeEventListener("dispose",L),y(v)}function N(T){let v=n.get(T);if(v.__webglInit===void 0)return;let k=T.source,K=f.get(k);if(K){let ie=K[v.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&b(T),Object.keys(K).length===0&&f.delete(k)}n.remove(T)}function b(T){let v=n.get(T);i.deleteTexture(v.__webglTexture);let k=T.source,K=f.get(k);delete K[v.__cacheKey],o.memory.textures--}function y(T){let v=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(v.__webglFramebuffer[K]))for(let ie=0;ie<v.__webglFramebuffer[K].length;ie++)i.deleteFramebuffer(v.__webglFramebuffer[K][ie]);else i.deleteFramebuffer(v.__webglFramebuffer[K]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[K])}else{if(Array.isArray(v.__webglFramebuffer))for(let K=0;K<v.__webglFramebuffer.length;K++)i.deleteFramebuffer(v.__webglFramebuffer[K]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let K=0;K<v.__webglColorRenderbuffer.length;K++)v.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[K]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let k=T.textures;for(let K=0,ie=k.length;K<ie;K++){let J=n.get(k[K]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(k[K])}n.remove(T)}let C=0;function B(){C=0}function F(){let T=C;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),C+=1,T}function V(T){let v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function $(T,v){let k=n.get(T);if(T.isVideoTexture&&Je(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&k.__version!==T.version){let K=T.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(k,T,v);return}}else T.isExternalTexture&&(k.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+v)}function q(T,v){let k=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&k.__version!==T.version){Q(k,T,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+v)}function ne(T,v){let k=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&k.__version!==T.version){Q(k,T,v);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+v)}function G(T,v){let k=n.get(T);if(T.version>0&&k.__version!==T.version){ee(k,T,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+v)}let he={[ua]:i.REPEAT,[Ki]:i.CLAMP_TO_EDGE,[da]:i.MIRRORED_REPEAT},ge={[Rn]:i.NEAREST,[ad]:i.NEAREST_MIPMAP_NEAREST,[yo]:i.NEAREST_MIPMAP_LINEAR,[ni]:i.LINEAR,[Qa]:i.LINEAR_MIPMAP_NEAREST,[ts]:i.LINEAR_MIPMAP_LINEAR},ue={[ud]:i.NEVER,[_d]:i.ALWAYS,[dd]:i.LESS,[eh]:i.LEQUAL,[fd]:i.EQUAL,[gd]:i.GEQUAL,[pd]:i.GREATER,[md]:i.NOTEQUAL};function Xe(T,v){if(v.type===oi&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===ni||v.magFilter===Qa||v.magFilter===yo||v.magFilter===ts||v.minFilter===ni||v.minFilter===Qa||v.minFilter===yo||v.minFilter===ts)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,he[v.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,he[v.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,he[v.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ge[v.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ge[v.minFilter]),v.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ue[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Rn||v.minFilter!==yo&&v.minFilter!==ts||v.type===oi&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Ke(T,v){let k=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",R));let K=v.source,ie=f.get(K);ie===void 0&&(ie={},f.set(K,ie));let J=V(v);if(J!==T.__cacheKey){ie[J]===void 0&&(ie[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),ie[J].usedTimes++;let Ne=ie[T.__cacheKey];Ne!==void 0&&(ie[T.__cacheKey].usedTimes--,Ne.usedTimes===0&&b(v)),T.__cacheKey=J,T.__webglTexture=ie[J].texture}return k}function mt(T,v,k){return Math.floor(Math.floor(T/k)/v)}function je(T,v,k,K){let J=T.updateRanges;if(J.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,k,K,v.data);else{J.sort((oe,xe)=>oe.start-xe.start);let Ne=0;for(let oe=1;oe<J.length;oe++){let xe=J[Ne],We=J[oe],Pe=xe.start+xe.count,me=mt(We.start,v.width,4),Oe=mt(xe.start,v.width,4);We.start<=Pe+1&&me===Oe&&mt(We.start+We.count-1,v.width,4)===me?xe.count=Math.max(xe.count,We.start+We.count-xe.start):(++Ne,J[Ne]=We)}J.length=Ne+1;let ce=i.getParameter(i.UNPACK_ROW_LENGTH),De=i.getParameter(i.UNPACK_SKIP_PIXELS),Ae=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let oe=0,xe=J.length;oe<xe;oe++){let We=J[oe],Pe=Math.floor(We.start/4),me=Math.ceil(We.count/4),Oe=Pe%v.width,D=Math.floor(Pe/v.width),se=me,de=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Oe),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),t.texSubImage2D(i.TEXTURE_2D,0,Oe,D,se,de,k,K,v.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ce),i.pixelStorei(i.UNPACK_SKIP_PIXELS,De),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ae)}}function Q(T,v,k){let K=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(K=i.TEXTURE_3D);let ie=Ke(T,v),J=v.source;t.bindTexture(K,T.__webglTexture,i.TEXTURE0+k);let Ne=n.get(J);if(J.version!==Ne.__version||ie===!0){t.activeTexture(i.TEXTURE0+k);let ce=ht.getPrimaries(ht.workingColorSpace),De=v.colorSpace===Di?null:ht.getPrimaries(v.colorSpace),Ae=v.colorSpace===Di||ce===De?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);let oe=_(v.image,!1,s.maxTextureSize);oe=Ut(v,oe);let xe=r.convert(v.format,v.colorSpace),We=r.convert(v.type),Pe=w(v.internalFormat,xe,We,v.colorSpace,v.isVideoTexture);Xe(K,v);let me,Oe=v.mipmaps,D=v.isVideoTexture!==!0,se=Ne.__version===void 0||ie===!0,de=J.dataReady,we=A(v,oe);if(v.isDepthTexture)Pe=x(v.format===gr,v.type),se&&(D?t.texStorage2D(i.TEXTURE_2D,1,Pe,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,Pe,oe.width,oe.height,0,xe,We,null));else if(v.isDataTexture)if(Oe.length>0){D&&se&&t.texStorage2D(i.TEXTURE_2D,we,Pe,Oe[0].width,Oe[0].height);for(let re=0,te=Oe.length;re<te;re++)me=Oe[re],D?de&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,xe,We,me.data):t.texImage2D(i.TEXTURE_2D,re,Pe,me.width,me.height,0,xe,We,me.data);v.generateMipmaps=!1}else D?(se&&t.texStorage2D(i.TEXTURE_2D,we,Pe,oe.width,oe.height),de&&je(v,oe,xe,We)):t.texImage2D(i.TEXTURE_2D,0,Pe,oe.width,oe.height,0,xe,We,oe.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){D&&se&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Pe,Oe[0].width,Oe[0].height,oe.depth);for(let re=0,te=Oe.length;re<te;re++)if(me=Oe[re],v.format!==$n)if(xe!==null)if(D){if(de)if(v.layerUpdates.size>0){let Ie=lh(me.width,me.height,v.format,v.type);for(let Ze of v.layerUpdates){let yt=me.data.subarray(Ze*Ie/me.data.BYTES_PER_ELEMENT,(Ze+1)*Ie/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,Ze,me.width,me.height,1,xe,yt)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,oe.depth,xe,me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,Pe,me.width,me.height,oe.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?de&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,oe.depth,xe,We,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,Pe,me.width,me.height,oe.depth,0,xe,We,me.data)}else{D&&se&&t.texStorage2D(i.TEXTURE_2D,we,Pe,Oe[0].width,Oe[0].height);for(let re=0,te=Oe.length;re<te;re++)me=Oe[re],v.format!==$n?xe!==null?D?de&&t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,xe,me.data):t.compressedTexImage2D(i.TEXTURE_2D,re,Pe,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?de&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,xe,We,me.data):t.texImage2D(i.TEXTURE_2D,re,Pe,me.width,me.height,0,xe,We,me.data)}else if(v.isDataArrayTexture)if(D){if(se&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Pe,oe.width,oe.height,oe.depth),de)if(v.layerUpdates.size>0){let re=lh(oe.width,oe.height,v.format,v.type);for(let te of v.layerUpdates){let Ie=oe.data.subarray(te*re/oe.data.BYTES_PER_ELEMENT,(te+1)*re/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,te,oe.width,oe.height,1,xe,We,Ie)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,xe,We,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Pe,oe.width,oe.height,oe.depth,0,xe,We,oe.data);else if(v.isData3DTexture)D?(se&&t.texStorage3D(i.TEXTURE_3D,we,Pe,oe.width,oe.height,oe.depth),de&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,xe,We,oe.data)):t.texImage3D(i.TEXTURE_3D,0,Pe,oe.width,oe.height,oe.depth,0,xe,We,oe.data);else if(v.isFramebufferTexture){if(se)if(D)t.texStorage2D(i.TEXTURE_2D,we,Pe,oe.width,oe.height);else{let re=oe.width,te=oe.height;for(let Ie=0;Ie<we;Ie++)t.texImage2D(i.TEXTURE_2D,Ie,Pe,re,te,0,xe,We,null),re>>=1,te>>=1}}else if(Oe.length>0){if(D&&se){let re=ft(Oe[0]);t.texStorage2D(i.TEXTURE_2D,we,Pe,re.width,re.height)}for(let re=0,te=Oe.length;re<te;re++)me=Oe[re],D?de&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,xe,We,me):t.texImage2D(i.TEXTURE_2D,re,Pe,xe,We,me);v.generateMipmaps=!1}else if(D){if(se){let re=ft(oe);t.texStorage2D(i.TEXTURE_2D,we,Pe,re.width,re.height)}de&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,xe,We,oe)}else t.texImage2D(i.TEXTURE_2D,0,Pe,xe,We,oe);m(v)&&p(K),Ne.__version=J.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function ee(T,v,k){if(v.image.length!==6)return;let K=Ke(T,v),ie=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+k);let J=n.get(ie);if(ie.version!==J.__version||K===!0){t.activeTexture(i.TEXTURE0+k);let Ne=ht.getPrimaries(ht.workingColorSpace),ce=v.colorSpace===Di?null:ht.getPrimaries(v.colorSpace),De=v.colorSpace===Di||Ne===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let Ae=v.isCompressedTexture||v.image[0].isCompressedTexture,oe=v.image[0]&&v.image[0].isDataTexture,xe=[];for(let te=0;te<6;te++)!Ae&&!oe?xe[te]=_(v.image[te],!0,s.maxCubemapSize):xe[te]=oe?v.image[te].image:v.image[te],xe[te]=Ut(v,xe[te]);let We=xe[0],Pe=r.convert(v.format,v.colorSpace),me=r.convert(v.type),Oe=w(v.internalFormat,Pe,me,v.colorSpace),D=v.isVideoTexture!==!0,se=J.__version===void 0||K===!0,de=ie.dataReady,we=A(v,We);Xe(i.TEXTURE_CUBE_MAP,v);let re;if(Ae){D&&se&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Oe,We.width,We.height);for(let te=0;te<6;te++){re=xe[te].mipmaps;for(let Ie=0;Ie<re.length;Ie++){let Ze=re[Ie];v.format!==$n?Pe!==null?D?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ie,0,0,Ze.width,Ze.height,Pe,Ze.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ie,Oe,Ze.width,Ze.height,0,Ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ie,0,0,Ze.width,Ze.height,Pe,me,Ze.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ie,Oe,Ze.width,Ze.height,0,Pe,me,Ze.data)}}}else{if(re=v.mipmaps,D&&se){re.length>0&&we++;let te=ft(xe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Oe,te.width,te.height)}for(let te=0;te<6;te++)if(oe){D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,xe[te].width,xe[te].height,Pe,me,xe[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Oe,xe[te].width,xe[te].height,0,Pe,me,xe[te].data);for(let Ie=0;Ie<re.length;Ie++){let yt=re[Ie].image[te].image;D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ie+1,0,0,yt.width,yt.height,Pe,me,yt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ie+1,Oe,yt.width,yt.height,0,Pe,me,yt.data)}}else{D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Pe,me,xe[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Oe,Pe,me,xe[te]);for(let Ie=0;Ie<re.length;Ie++){let Ze=re[Ie];D?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ie+1,0,0,Pe,me,Ze.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ie+1,Oe,Pe,me,Ze.image[te])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),J.__version=ie.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function Ee(T,v,k,K,ie,J){let Ne=r.convert(k.format,k.colorSpace),ce=r.convert(k.type),De=w(k.internalFormat,Ne,ce,k.colorSpace),Ae=n.get(v),oe=n.get(k);if(oe.__renderTarget=v,!Ae.__hasExternalTextures){let xe=Math.max(1,v.width>>J),We=Math.max(1,v.height>>J);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,J,De,xe,We,v.depth,0,Ne,ce,null):t.texImage2D(ie,J,De,xe,We,0,Ne,ce,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),Ce(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,ie,oe.__webglTexture,0,bt(v)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,ie,oe.__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function $e(T,v,k){if(i.bindRenderbuffer(i.RENDERBUFFER,T),v.depthBuffer){let K=v.depthTexture,ie=K&&K.isDepthTexture?K.type:null,J=x(v.stencilBuffer,ie),Ne=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=bt(v);Ce(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce,J,v.width,v.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce,J,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,J,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ne,i.RENDERBUFFER,T)}else{let K=v.textures;for(let ie=0;ie<K.length;ie++){let J=K[ie],Ne=r.convert(J.format,J.colorSpace),ce=r.convert(J.type),De=w(J.internalFormat,Ne,ce,J.colorSpace),Ae=bt(v);k&&Ce(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ae,De,v.width,v.height):Ce(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ae,De,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,De,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ue(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let K=n.get(v.depthTexture);K.__renderTarget=v,(!K.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),$(v.depthTexture,0);let ie=K.__webglTexture,J=bt(v);if(v.depthTexture.format===Js)Ce(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0);else if(v.depthTexture.format===gr)Ce(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function st(T){let v=n.get(T),k=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){let K=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),K){let ie=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,K.removeEventListener("dispose",ie)};K.addEventListener("dispose",ie),v.__depthDisposeCallback=ie}v.__boundDepthTexture=K}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");let K=T.texture.mipmaps;K&&K.length>0?Ue(v.__webglFramebuffer[0],T):Ue(v.__webglFramebuffer,T)}else if(k){v.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[K]),v.__webglDepthbuffer[K]===void 0)v.__webglDepthbuffer[K]=i.createRenderbuffer(),$e(v.__webglDepthbuffer[K],T,!1);else{let ie=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,J)}}else{let K=T.texture.mipmaps;if(K&&K.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),$e(v.__webglDepthbuffer,T,!1);else{let ie=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,J)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function dt(T,v,k){let K=n.get(T);v!==void 0&&Ee(K.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&st(T)}function U(T){let v=T.texture,k=n.get(T),K=n.get(v);T.addEventListener("dispose",L);let ie=T.textures,J=T.isWebGLCubeRenderTarget===!0,Ne=ie.length>1;if(Ne||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=v.version,o.memory.textures++),J){k.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[ce]=[];for(let De=0;De<v.mipmaps.length;De++)k.__webglFramebuffer[ce][De]=i.createFramebuffer()}else k.__webglFramebuffer[ce]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let ce=0;ce<v.mipmaps.length;ce++)k.__webglFramebuffer[ce]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(Ne)for(let ce=0,De=ie.length;ce<De;ce++){let Ae=n.get(ie[ce]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&Ce(T)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ce=0;ce<ie.length;ce++){let De=ie[ce];k.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[ce]);let Ae=r.convert(De.format,De.colorSpace),oe=r.convert(De.type),xe=w(De.internalFormat,Ae,oe,De.colorSpace,T.isXRRenderTarget===!0),We=bt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,We,xe,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,k.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),$e(k.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,v);for(let ce=0;ce<6;ce++)if(v.mipmaps&&v.mipmaps.length>0)for(let De=0;De<v.mipmaps.length;De++)Ee(k.__webglFramebuffer[ce][De],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,De);else Ee(k.__webglFramebuffer[ce],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);m(v)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ne){for(let ce=0,De=ie.length;ce<De;ce++){let Ae=ie[ce],oe=n.get(Ae),xe=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(xe=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,oe.__webglTexture),Xe(xe,Ae),Ee(k.__webglFramebuffer,T,Ae,i.COLOR_ATTACHMENT0+ce,xe,0),m(Ae)&&p(xe)}t.unbindTexture()}else{let ce=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ce=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,K.__webglTexture),Xe(ce,v),v.mipmaps&&v.mipmaps.length>0)for(let De=0;De<v.mipmaps.length;De++)Ee(k.__webglFramebuffer[De],T,v,i.COLOR_ATTACHMENT0,ce,De);else Ee(k.__webglFramebuffer,T,v,i.COLOR_ATTACHMENT0,ce,0);m(v)&&p(ce),t.unbindTexture()}T.depthBuffer&&st(T)}function St(T){let v=T.textures;for(let k=0,K=v.length;k<K;k++){let ie=v[k];if(m(ie)){let J=S(T),Ne=n.get(ie).__webglTexture;t.bindTexture(J,Ne),p(J),t.unbindTexture()}}}let Re=[],qe=[];function be(T){if(T.samples>0){if(Ce(T)===!1){let v=T.textures,k=T.width,K=T.height,ie=i.COLOR_BUFFER_BIT,J=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ne=n.get(T),ce=v.length>1;if(ce)for(let Ae=0;Ae<v.length;Ae++)t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer);let De=T.texture.mipmaps;De&&De.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let Ae=0;Ae<v.length;Ae++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),ce){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ne.__webglColorRenderbuffer[Ae]);let oe=n.get(v[Ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,oe,0)}i.blitFramebuffer(0,0,k,K,0,0,k,K,ie,i.NEAREST),c===!0&&(Re.length=0,qe.length=0,Re.push(i.COLOR_ATTACHMENT0+Ae),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Re.push(J),qe.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,qe)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Re))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let Ae=0;Ae<v.length;Ae++){t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,Ne.__webglColorRenderbuffer[Ae]);let oe=n.get(v[Ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){let v=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function bt(T){return Math.min(s.maxSamples,T.samples)}function Ce(T){let v=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Je(T){let v=o.render.frame;d.get(T)!==v&&(d.set(T,v),T.update())}function Ut(T,v){let k=T.colorSpace,K=T.format,ie=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||k!==gs&&k!==Di&&(ht.getTransfer(k)===xt?(K!==$n||ie!==ri)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),v}function ft(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=B,this.setTexture2D=$,this.setTexture2DArray=q,this.setTexture3D=ne,this.setTextureCube=G,this.rebindTextures=dt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=St,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=Ce}function mx(i,e){function t(n,s=Di){let r,o=ht.getTransfer(s);if(n===ri)return i.UNSIGNED_BYTE;if(n===tl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===nl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===$c)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Zc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===qc)return i.BYTE;if(n===Yc)return i.SHORT;if(n===fr)return i.UNSIGNED_SHORT;if(n===el)return i.INT;if(n===ns)return i.UNSIGNED_INT;if(n===oi)return i.FLOAT;if(n===pr)return i.HALF_FLOAT;if(n===Jc)return i.ALPHA;if(n===Kc)return i.RGB;if(n===$n)return i.RGBA;if(n===Js)return i.DEPTH_COMPONENT;if(n===gr)return i.DEPTH_STENCIL;if(n===il)return i.RED;if(n===sl)return i.RED_INTEGER;if(n===jc)return i.RG;if(n===rl)return i.RG_INTEGER;if(n===ol)return i.RGBA_INTEGER;if(n===vo||n===Mo||n===So||n===bo)if(o===xt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===vo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===So)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===vo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Mo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===So)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===bo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===al||n===ll||n===cl||n===hl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===al)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===cl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ul||n===dl||n===fl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ul||n===dl)return o===xt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===fl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===pl||n===ml||n===gl||n===_l||n===xl||n===yl||n===vl||n===Ml||n===Sl||n===bl||n===El||n===wl||n===Tl||n===Al)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===pl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ml)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===gl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===_l)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===yl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===vl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ml)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Sl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===bl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===El)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===wl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Tl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Al)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rl||n===Cl||n===Pl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Rl)return o===xt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Cl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Pl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Il||n===Ll||n===Dl||n===Ul)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Il)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ll)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Dl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===mr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var gx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_x=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Mh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new no(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Pn({vertexShader:gx,fragmentShader:_x,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Qe(new Ri(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Sh=class extends hi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,d=null,h=null,f=null,u=null,g=null,_=typeof XRWebGLBinding<"u",m=new Mh,p={},S=t.getContextAttributes(),w=null,x=null,A=[],R=[],L=new fe,N=null,b=new xn;b.viewport=new Ct;let y=new xn;y.viewport=new Ct;let C=[b,y],B=new Ha,F=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ee=A[Q];return ee===void 0&&(ee=new tr,A[Q]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(Q){let ee=A[Q];return ee===void 0&&(ee=new tr,A[Q]=ee),ee.getGripSpace()},this.getHand=function(Q){let ee=A[Q];return ee===void 0&&(ee=new tr,A[Q]=ee),ee.getHandSpace()};function $(Q){let ee=R.indexOf(Q.inputSource);if(ee===-1)return;let Ee=A[ee];Ee!==void 0&&(Ee.update(Q.inputSource,Q.frame,l||o),Ee.dispatchEvent({type:Q.type,data:Q.inputSource}))}function q(){s.removeEventListener("select",$),s.removeEventListener("selectstart",$),s.removeEventListener("selectend",$),s.removeEventListener("squeeze",$),s.removeEventListener("squeezestart",$),s.removeEventListener("squeezeend",$),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",ne);for(let Q=0;Q<A.length;Q++){let ee=R[Q];ee!==null&&(R[Q]=null,A[Q].disconnect(ee))}F=null,V=null,m.reset();for(let Q in p)delete p[Q];e.setRenderTarget(w),u=null,f=null,h=null,s=null,x=null,je.stop(),n.isPresenting=!1,e.setPixelRatio(N),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return f!==null?f:u},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",$),s.addEventListener("selectstart",$),s.addEventListener("selectend",$),s.addEventListener("squeeze",$),s.addEventListener("squeezestart",$),s.addEventListener("squeezeend",$),s.addEventListener("end",q),s.addEventListener("inputsourceschange",ne),S.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(L),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,$e=null,Ue=null;S.depth&&(Ue=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ee=S.stencil?gr:Js,$e=S.stencil?mr:ns);let st={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(st),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new On(f.textureWidth,f.textureHeight,{format:$n,type:ri,depthTexture:new xs(f.textureWidth,f.textureHeight,$e,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let Ee={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,t,Ee),s.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new On(u.framebufferWidth,u.framebufferHeight,{format:$n,type:ri,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),je.setContext(s),je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ne(Q){for(let ee=0;ee<Q.removed.length;ee++){let Ee=Q.removed[ee],$e=R.indexOf(Ee);$e>=0&&(R[$e]=null,A[$e].disconnect(Ee))}for(let ee=0;ee<Q.added.length;ee++){let Ee=Q.added[ee],$e=R.indexOf(Ee);if($e===-1){for(let st=0;st<A.length;st++)if(st>=R.length){R.push(Ee),$e=st;break}else if(R[st]===null){R[st]=Ee,$e=st;break}if($e===-1)break}let Ue=A[$e];Ue&&Ue.connect(Ee)}}let G=new I,he=new I;function ge(Q,ee,Ee){G.setFromMatrixPosition(ee.matrixWorld),he.setFromMatrixPosition(Ee.matrixWorld);let $e=G.distanceTo(he),Ue=ee.projectionMatrix.elements,st=Ee.projectionMatrix.elements,dt=Ue[14]/(Ue[10]-1),U=Ue[14]/(Ue[10]+1),St=(Ue[9]+1)/Ue[5],Re=(Ue[9]-1)/Ue[5],qe=(Ue[8]-1)/Ue[0],be=(st[8]+1)/st[0],bt=dt*qe,Ce=dt*be,Je=$e/(-qe+be),Ut=Je*-qe;if(ee.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ut),Q.translateZ(Je),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ue[10]===-1)Q.projectionMatrix.copy(ee.projectionMatrix),Q.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let ft=dt+Je,T=U+Je,v=bt-Ut,k=Ce+($e-Ut),K=St*U/T*ft,ie=Re*U/T*ft;Q.projectionMatrix.makePerspective(v,k,K,ie,ft,T),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ue(Q,ee){ee===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ee.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let ee=Q.near,Ee=Q.far;m.texture!==null&&(m.depthNear>0&&(ee=m.depthNear),m.depthFar>0&&(Ee=m.depthFar)),B.near=y.near=b.near=ee,B.far=y.far=b.far=Ee,(F!==B.near||V!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),F=B.near,V=B.far),B.layers.mask=Q.layers.mask|6,b.layers.mask=B.layers.mask&3,y.layers.mask=B.layers.mask&5;let $e=Q.parent,Ue=B.cameras;ue(B,$e);for(let st=0;st<Ue.length;st++)ue(Ue[st],$e);Ue.length===2?ge(B,b,y):B.projectionMatrix.copy(b.projectionMatrix),Xe(Q,B,$e)};function Xe(Q,ee,Ee){Ee===null?Q.matrix.copy(ee.matrixWorld):(Q.matrix.copy(Ee.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ee.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ee.projectionMatrix),Q.projectionMatrixInverse.copy(ee.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Ks*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(f===null&&u===null))return c},this.setFoveation=function(Q){c=Q,f!==null&&(f.fixedFoveation=Q),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(Q){return p[Q]};let Ke=null;function mt(Q,ee){if(d=ee.getViewerPose(l||o),g=ee,d!==null){let Ee=d.views;u!==null&&(e.setRenderTargetFramebuffer(x,u.framebuffer),e.setRenderTarget(x));let $e=!1;Ee.length!==B.cameras.length&&(B.cameras.length=0,$e=!0);for(let U=0;U<Ee.length;U++){let St=Ee[U],Re=null;if(u!==null)Re=u.getViewport(St);else{let be=h.getViewSubImage(f,St);Re=be.viewport,U===0&&(e.setRenderTargetTextures(x,be.colorTexture,be.depthStencilTexture),e.setRenderTarget(x))}let qe=C[U];qe===void 0&&(qe=new xn,qe.layers.enable(U),qe.viewport=new Ct,C[U]=qe),qe.matrix.fromArray(St.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(St.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(Re.x,Re.y,Re.width,Re.height),U===0&&(B.matrix.copy(qe.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),$e===!0&&B.cameras.push(qe)}let Ue=s.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=n.getBinding();let U=h.getDepthInformation(Ee[0]);U&&U.isValid&&U.texture&&m.init(U,s.renderState)}if(Ue&&Ue.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let U=0;U<Ee.length;U++){let St=Ee[U].camera;if(St){let Re=p[St];Re||(Re=new no,p[St]=Re);let qe=h.getCameraImage(St);Re.sourceTexture=qe}}}}for(let Ee=0;Ee<A.length;Ee++){let $e=R[Ee],Ue=A[Ee];$e!==null&&Ue!==void 0&&Ue.update($e,ee,l||o)}Ke&&Ke(Q,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}let je=new Jd;je.setAnimationLoop(mt),this.setAnimationLoop=function(Q){Ke=Q},this.dispose=function(){}}},Rs=new Bn,xx=new ut;function yx(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,sh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,w,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),d(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&u(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,S,w):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===un&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===un&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let S=e.get(p),w=S.envMap,x=S.envMapRotation;w&&(m.envMap.value=w,Rs.copy(x),Rs.x*=-1,Rs.y*=-1,Rs.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Rs.y*=-1,Rs.z*=-1),m.envMapRotation.value.setFromMatrix4(xx.makeRotationFromEuler(Rs)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=w*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===un&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function vx(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,w){let x=w.program;n.uniformBlockBinding(S,x)}function l(S,w){let x=s[S.id];x===void 0&&(g(S),x=d(S),s[S.id]=x,S.addEventListener("dispose",m));let A=w.program;n.updateUBOMapping(S,A);let R=e.render.frame;r[S.id]!==R&&(f(S),r[S.id]=R)}function d(S){let w=h();S.__bindingPointIndex=w;let x=i.createBuffer(),A=S.__size,R=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,A,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,x),x}function h(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){let w=s[S.id],x=S.uniforms,A=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let R=0,L=x.length;R<L;R++){let N=Array.isArray(x[R])?x[R]:[x[R]];for(let b=0,y=N.length;b<y;b++){let C=N[b];if(u(C,R,b,A)===!0){let B=C.__offset,F=Array.isArray(C.value)?C.value:[C.value],V=0;for(let $=0;$<F.length;$++){let q=F[$],ne=_(q);typeof q=="number"||typeof q=="boolean"?(C.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,B+V,C.__data)):q.isMatrix3?(C.__data[0]=q.elements[0],C.__data[1]=q.elements[1],C.__data[2]=q.elements[2],C.__data[3]=0,C.__data[4]=q.elements[3],C.__data[5]=q.elements[4],C.__data[6]=q.elements[5],C.__data[7]=0,C.__data[8]=q.elements[6],C.__data[9]=q.elements[7],C.__data[10]=q.elements[8],C.__data[11]=0):(q.toArray(C.__data,V),V+=ne.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(S,w,x,A){let R=S.value,L=w+"_"+x;if(A[L]===void 0)return typeof R=="number"||typeof R=="boolean"?A[L]=R:A[L]=R.clone(),!0;{let N=A[L];if(typeof R=="number"||typeof R=="boolean"){if(N!==R)return A[L]=R,!0}else if(N.equals(R)===!1)return N.copy(R),!0}return!1}function g(S){let w=S.uniforms,x=0,A=16;for(let L=0,N=w.length;L<N;L++){let b=Array.isArray(w[L])?w[L]:[w[L]];for(let y=0,C=b.length;y<C;y++){let B=b[y],F=Array.isArray(B.value)?B.value:[B.value];for(let V=0,$=F.length;V<$;V++){let q=F[V],ne=_(q),G=x%A,he=G%ne.boundary,ge=G+he;x+=he,ge!==0&&A-ge<ne.storage&&(x+=A-ge),B.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=x,x+=ne.storage}}}let R=x%A;return R>0&&(x+=A-R),S.__size=x,S.__cache={},this}function _(S){let w={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(w.boundary=4,w.storage=4):S.isVector2?(w.boundary=8,w.storage=8):S.isVector3||S.isColor?(w.boundary=16,w.storage=12):S.isVector4?(w.boundary=16,w.storage=16):S.isMatrix3?(w.boundary=48,w.storage=48):S.isMatrix4?(w.boundary=64,w.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),w}function m(S){let w=S.target;w.removeEventListener("dispose",m);let x=o.indexOf(w.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function p(){for(let S in s)i.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}var zl=class{constructor(e={}){let{canvas:t=xd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,S=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,A=!1;this._outputColorSpace=En;let R=0,L=0,N=null,b=-1,y=null,C=new Ct,B=new Ct,F=null,V=new Me(0),$=0,q=t.width,ne=t.height,G=1,he=null,ge=null,ue=new Ct(0,0,q,ne),Xe=new Ct(0,0,q,ne),Ke=!1,mt=new sr,je=!1,Q=!1,ee=new ut,Ee=new I,$e=new Ct,Ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},st=!1;function dt(){return N===null?G:1}let U=n;function St(M,O){return t.getContext(M,O)}try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",de,!1),t.addEventListener("webglcontextrestored",we,!1),t.addEventListener("webglcontextcreationerror",re,!1),U===null){let O="webgl2";if(U=St(O,M),U===null)throw St(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Re,qe,be,bt,Ce,Je,Ut,ft,T,v,k,K,ie,J,Ne,ce,De,Ae,oe,xe,We,Pe,me,Oe;function D(){Re=new B0(U),Re.init(),Pe=new mx(U,Re),qe=new I0(U,Re,e,Pe),be=new fx(U,Re),qe.reversedDepthBuffer&&f&&be.buffers.depth.setReversed(!0),bt=new H0(U),Ce=new ex,Je=new px(U,Re,be,Ce,qe,Pe,bt),Ut=new D0(x),ft=new O0(x),T=new Yp(U),me=new C0(U,T),v=new z0(U,T,bt,me),k=new G0(U,v,T,bt),oe=new V0(U,qe,Je),ce=new L0(Ce),K=new Q_(x,Ut,ft,Re,qe,me,ce),ie=new yx(x,Ce),J=new nx,Ne=new lx(Re),Ae=new R0(x,Ut,ft,be,k,u,c),De=new ux(x,k,qe),Oe=new vx(U,bt,qe,be),xe=new P0(U,Re,bt),We=new k0(U,Re,bt),bt.programs=K.programs,x.capabilities=qe,x.extensions=Re,x.properties=Ce,x.renderLists=J,x.shadowMap=De,x.state=be,x.info=bt}D();let se=new Sh(x,U);this.xr=se,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let M=Re.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=Re.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(M){M!==void 0&&(G=M,this.setSize(q,ne,!1))},this.getSize=function(M){return M.set(q,ne)},this.setSize=function(M,O,W=!0){if(se.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=M,ne=O,t.width=Math.floor(M*G),t.height=Math.floor(O*G),W===!0&&(t.style.width=M+"px",t.style.height=O+"px"),this.setViewport(0,0,M,O)},this.getDrawingBufferSize=function(M){return M.set(q*G,ne*G).floor()},this.setDrawingBufferSize=function(M,O,W){q=M,ne=O,G=W,t.width=Math.floor(M*W),t.height=Math.floor(O*W),this.setViewport(0,0,M,O)},this.getCurrentViewport=function(M){return M.copy(C)},this.getViewport=function(M){return M.copy(ue)},this.setViewport=function(M,O,W,X){M.isVector4?ue.set(M.x,M.y,M.z,M.w):ue.set(M,O,W,X),be.viewport(C.copy(ue).multiplyScalar(G).round())},this.getScissor=function(M){return M.copy(Xe)},this.setScissor=function(M,O,W,X){M.isVector4?Xe.set(M.x,M.y,M.z,M.w):Xe.set(M,O,W,X),be.scissor(B.copy(Xe).multiplyScalar(G).round())},this.getScissorTest=function(){return Ke},this.setScissorTest=function(M){be.setScissorTest(Ke=M)},this.setOpaqueSort=function(M){he=M},this.setTransparentSort=function(M){ge=M},this.getClearColor=function(M){return M.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(M=!0,O=!0,W=!0){let X=0;if(M){let z=!1;if(N!==null){let ae=N.texture.format;z=ae===ol||ae===rl||ae===sl}if(z){let ae=N.texture.type,ye=ae===ri||ae===ns||ae===fr||ae===mr||ae===tl||ae===nl,Te=Ae.getClearColor(),Se=Ae.getClearAlpha(),Ve=Te.r,Ye=Te.g,ze=Te.b;ye?(g[0]=Ve,g[1]=Ye,g[2]=ze,g[3]=Se,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=Ve,_[1]=Ye,_[2]=ze,_[3]=Se,U.clearBufferiv(U.COLOR,0,_))}else X|=U.COLOR_BUFFER_BIT}O&&(X|=U.DEPTH_BUFFER_BIT),W&&(X|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",de,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",re,!1),Ae.dispose(),J.dispose(),Ne.dispose(),Ce.dispose(),Ut.dispose(),ft.dispose(),k.dispose(),me.dispose(),Oe.dispose(),K.dispose(),se.dispose(),se.removeEventListener("sessionstart",$t),se.removeEventListener("sessionend",Bt),Wt.stop()};function de(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function we(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let M=bt.autoReset,O=De.enabled,W=De.autoUpdate,X=De.needsUpdate,z=De.type;D(),bt.autoReset=M,De.enabled=O,De.autoUpdate=W,De.needsUpdate=X,De.type=z}function re(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function te(M){let O=M.target;O.removeEventListener("dispose",te),Ie(O)}function Ie(M){Ze(M),Ce.remove(M)}function Ze(M){let O=Ce.get(M).programs;O!==void 0&&(O.forEach(function(W){K.releaseProgram(W)}),M.isShaderMaterial&&K.releaseShaderCache(M))}this.renderBufferDirect=function(M,O,W,X,z,ae){O===null&&(O=Ue);let ye=z.isMesh&&z.matrixWorld.determinant()<0,Te=Io(M,O,W,X,z);be.setMaterial(X,ye);let Se=W.index,Ve=1;if(X.wireframe===!0){if(Se=v.getWireframeAttribute(W),Se===void 0)return;Ve=2}let Ye=W.drawRange,ze=W.attributes.position,rt=Ye.start*Ve,gt=(Ye.start+Ye.count)*Ve;ae!==null&&(rt=Math.max(rt,ae.start*Ve),gt=Math.min(gt,(ae.start+ae.count)*Ve)),Se!==null?(rt=Math.max(rt,0),gt=Math.min(gt,Se.count)):ze!=null&&(rt=Math.max(rt,0),gt=Math.min(gt,ze.count));let Lt=gt-rt;if(Lt<0||Lt===1/0)return;me.setup(z,X,Te,W,Se);let ct,_t=xe;if(Se!==null&&(ct=T.get(Se),_t=We,_t.setIndex(ct)),z.isMesh)X.wireframe===!0?(be.setLineWidth(X.wireframeLinewidth*dt()),_t.setMode(U.LINES)):_t.setMode(U.TRIANGLES);else if(z.isLine){let ke=X.linewidth;ke===void 0&&(ke=1),be.setLineWidth(ke*dt()),z.isLineSegments?_t.setMode(U.LINES):z.isLineLoop?_t.setMode(U.LINE_LOOP):_t.setMode(U.LINE_STRIP)}else z.isPoints?_t.setMode(U.POINTS):z.isSprite&&_t.setMode(U.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)js("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),_t.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Re.get("WEBGL_multi_draw"))_t.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let ke=z._multiDrawStarts,Tt=z._multiDrawCounts,at=z._multiDrawCount,dn=Se?T.get(Se).bytesPerElement:1,ai=Ce.get(X).currentProgram.getUniforms();for(let fn=0;fn<at;fn++)ai.setValue(U,"_gl_DrawID",fn),_t.render(ke[fn]/dn,Tt[fn])}else if(z.isInstancedMesh)_t.renderInstances(rt,Lt,z.count);else if(W.isInstancedBufferGeometry){let ke=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Tt=Math.min(W.instanceCount,ke);_t.renderInstances(rt,Lt,Tt)}else _t.render(rt,Lt)};function yt(M,O,W){M.transparent===!0&&M.side===yn&&M.forceSinglePass===!1?(M.side=un,M.needsUpdate=!0,Qt(M,O,W),M.side=Ti,M.needsUpdate=!0,Qt(M,O,W),M.side=yn):Qt(M,O,W)}this.compile=function(M,O,W=null){W===null&&(W=M),p=Ne.get(W),p.init(O),w.push(p),W.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),M!==W&&M.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let X=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let ae=z.material;if(ae)if(Array.isArray(ae))for(let ye=0;ye<ae.length;ye++){let Te=ae[ye];yt(Te,W,z),X.add(Te)}else yt(ae,W,z),X.add(ae)}),p=w.pop(),X},this.compileAsync=function(M,O,W=null){let X=this.compile(M,O,W);return new Promise(z=>{function ae(){if(X.forEach(function(ye){Ce.get(ye).currentProgram.isReady()&&X.delete(ye)}),X.size===0){z(M);return}setTimeout(ae,10)}Re.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let j=null;function Gt(M){j&&j(M)}function $t(){Wt.stop()}function Bt(){Wt.start()}let Wt=new Jd;Wt.setAnimationLoop(Gt),typeof self<"u"&&Wt.setContext(self),this.setAnimationLoop=function(M){j=M,se.setAnimationLoop(M),M===null?Wt.stop():Wt.start()},se.addEventListener("sessionstart",$t),se.addEventListener("sessionend",Bt),this.render=function(M,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(se.cameraAutoUpdate===!0&&se.updateCamera(O),O=se.getCamera()),M.isScene===!0&&M.onBeforeRender(x,M,O,N),p=Ne.get(M,w.length),p.init(O),w.push(p),ee.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),mt.setFromProjectionMatrix(ee,ti,O.reversedDepth),Q=this.localClippingEnabled,je=ce.init(this.clippingPlanes,Q),m=J.get(M,S.length),m.init(),S.push(m),se.enabled===!0&&se.isPresenting===!0){let ae=x.xr.getDepthSensingMesh();ae!==null&&os(ae,O,-1/0,x.sortObjects)}os(M,O,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(he,ge),st=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,st&&Ae.addToRenderList(m,M),this.info.render.frame++,je===!0&&ce.beginShadows();let W=p.state.shadowsArray;De.render(W,M,O),je===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=m.opaque,z=m.transmissive;if(p.setupLights(),O.isArrayCamera){let ae=O.cameras;if(z.length>0)for(let ye=0,Te=ae.length;ye<Te;ye++){let Se=ae[ye];Zn(X,z,M,Se)}st&&Ae.render(M);for(let ye=0,Te=ae.length;ye<Te;ye++){let Se=ae[ye];as(m,M,Se,Se.viewport)}}else z.length>0&&Zn(X,z,M,O),st&&Ae.render(M),as(m,M,O);N!==null&&L===0&&(Je.updateMultisampleRenderTarget(N),Je.updateRenderTargetMipmap(N)),M.isScene===!0&&M.onAfterRender(x,M,O),me.resetDefaultState(),b=-1,y=null,w.pop(),w.length>0?(p=w[w.length-1],je===!0&&ce.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function os(M,O,W,X){if(M.visible===!1)return;if(M.layers.test(O.layers)){if(M.isGroup)W=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(O);else if(M.isLight)p.pushLight(M),M.castShadow&&p.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||mt.intersectsSprite(M)){X&&$e.setFromMatrixPosition(M.matrixWorld).applyMatrix4(ee);let ye=k.update(M),Te=M.material;Te.visible&&m.push(M,ye,Te,W,$e.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||mt.intersectsObject(M))){let ye=k.update(M),Te=M.material;if(X&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),$e.copy(M.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),$e.copy(ye.boundingSphere.center)),$e.applyMatrix4(M.matrixWorld).applyMatrix4(ee)),Array.isArray(Te)){let Se=ye.groups;for(let Ve=0,Ye=Se.length;Ve<Ye;Ve++){let ze=Se[Ve],rt=Te[ze.materialIndex];rt&&rt.visible&&m.push(M,ye,rt,W,$e.z,ze)}}else Te.visible&&m.push(M,ye,Te,W,$e.z,null)}}let ae=M.children;for(let ye=0,Te=ae.length;ye<Te;ye++)os(ae[ye],O,W,X)}function as(M,O,W,X){let z=M.opaque,ae=M.transmissive,ye=M.transparent;p.setupLightsView(W),je===!0&&ce.setGlobalState(x.clippingPlanes,W),X&&be.viewport(C.copy(X)),z.length>0&&wr(z,O,W),ae.length>0&&wr(ae,O,W),ye.length>0&&wr(ye,O,W),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1)}function Zn(M,O,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[X.id]===void 0&&(p.state.transmissionRenderTarget[X.id]=new On(1,1,{generateMipmaps:!0,type:Re.has("EXT_color_buffer_half_float")||Re.has("EXT_color_buffer_float")?pr:ri,minFilter:ts,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ht.workingColorSpace}));let ae=p.state.transmissionRenderTarget[X.id],ye=X.viewport||C;ae.setSize(ye.z*x.transmissionResolutionScale,ye.w*x.transmissionResolutionScale);let Te=x.getRenderTarget(),Se=x.getActiveCubeFace(),Ve=x.getActiveMipmapLevel();x.setRenderTarget(ae),x.getClearColor(V),$=x.getClearAlpha(),$<1&&x.setClearColor(16777215,.5),x.clear(),st&&Ae.render(W);let Ye=x.toneMapping;x.toneMapping=Li;let ze=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),p.setupLightsView(X),je===!0&&ce.setGlobalState(x.clippingPlanes,X),wr(M,W,X),Je.updateMultisampleRenderTarget(ae),Je.updateRenderTargetMipmap(ae),Re.has("WEBGL_multisampled_render_to_texture")===!1){let rt=!1;for(let gt=0,Lt=O.length;gt<Lt;gt++){let ct=O[gt],_t=ct.object,ke=ct.geometry,Tt=ct.material,at=ct.group;if(Tt.side===yn&&_t.layers.test(X.layers)){let dn=Tt.side;Tt.side=un,Tt.needsUpdate=!0,Tr(_t,W,X,ke,Tt,at),Tt.side=dn,Tt.needsUpdate=!0,rt=!0}}rt===!0&&(Je.updateMultisampleRenderTarget(ae),Je.updateRenderTargetMipmap(ae))}x.setRenderTarget(Te,Se,Ve),x.setClearColor(V,$),ze!==void 0&&(X.viewport=ze),x.toneMapping=Ye}function wr(M,O,W){let X=O.isScene===!0?O.overrideMaterial:null;for(let z=0,ae=M.length;z<ae;z++){let ye=M[z],Te=ye.object,Se=ye.geometry,Ve=ye.group,Ye=ye.material;Ye.allowOverride===!0&&X!==null&&(Ye=X),Te.layers.test(W.layers)&&Tr(Te,O,W,Se,Ye,Ve)}}function Tr(M,O,W,X,z,ae){M.onBeforeRender(x,O,W,X,z,ae),M.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(x,O,W,X,M,ae),z.transparent===!0&&z.side===yn&&z.forceSinglePass===!1?(z.side=un,z.needsUpdate=!0,x.renderBufferDirect(W,O,X,z,M,ae),z.side=Ti,z.needsUpdate=!0,x.renderBufferDirect(W,O,X,z,M,ae),z.side=yn):x.renderBufferDirect(W,O,X,z,M,ae),M.onAfterRender(x,O,W,X,z,ae)}function Qt(M,O,W){O.isScene!==!0&&(O=Ue);let X=Ce.get(M),z=p.state.lights,ae=p.state.shadowsArray,ye=z.state.version,Te=K.getParameters(M,z.state,ae,O,W),Se=K.getProgramCacheKey(Te),Ve=X.programs;X.environment=M.isMeshStandardMaterial?O.environment:null,X.fog=O.fog,X.envMap=(M.isMeshStandardMaterial?ft:Ut).get(M.envMap||X.environment),X.envMapRotation=X.environment!==null&&M.envMap===null?O.environmentRotation:M.envMapRotation,Ve===void 0&&(M.addEventListener("dispose",te),Ve=new Map,X.programs=Ve);let Ye=Ve.get(Se);if(Ye!==void 0){if(X.currentProgram===Ye&&X.lightsStateVersion===ye)return en(M,Te),Ye}else Te.uniforms=K.getUniforms(M),M.onBeforeCompile(Te,x),Ye=K.acquireProgram(Te,Se),Ve.set(Se,Ye),X.uniforms=Te.uniforms;let ze=X.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(ze.clippingPlanes=ce.uniform),en(M,Te),X.needsLights=Lo(M),X.lightsStateVersion=ye,X.needsLights&&(ze.ambientLightColor.value=z.state.ambient,ze.lightProbe.value=z.state.probe,ze.directionalLights.value=z.state.directional,ze.directionalLightShadows.value=z.state.directionalShadow,ze.spotLights.value=z.state.spot,ze.spotLightShadows.value=z.state.spotShadow,ze.rectAreaLights.value=z.state.rectArea,ze.ltc_1.value=z.state.rectAreaLTC1,ze.ltc_2.value=z.state.rectAreaLTC2,ze.pointLights.value=z.state.point,ze.pointLightShadows.value=z.state.pointShadow,ze.hemisphereLights.value=z.state.hemi,ze.directionalShadowMap.value=z.state.directionalShadowMap,ze.directionalShadowMatrix.value=z.state.directionalShadowMatrix,ze.spotShadowMap.value=z.state.spotShadowMap,ze.spotLightMatrix.value=z.state.spotLightMatrix,ze.spotLightMap.value=z.state.spotLightMap,ze.pointShadowMap.value=z.state.pointShadowMap,ze.pointShadowMatrix.value=z.state.pointShadowMatrix),X.currentProgram=Ye,X.uniformsList=null,Ye}function Ar(M){if(M.uniformsList===null){let O=M.currentProgram.getUniforms();M.uniformsList=vr.seqWithValue(O.seq,M.uniforms)}return M.uniformsList}function en(M,O){let W=Ce.get(M);W.outputColorSpace=O.outputColorSpace,W.batching=O.batching,W.batchingColor=O.batchingColor,W.instancing=O.instancing,W.instancingColor=O.instancingColor,W.instancingMorph=O.instancingMorph,W.skinning=O.skinning,W.morphTargets=O.morphTargets,W.morphNormals=O.morphNormals,W.morphColors=O.morphColors,W.morphTargetsCount=O.morphTargetsCount,W.numClippingPlanes=O.numClippingPlanes,W.numIntersection=O.numClipIntersection,W.vertexAlphas=O.vertexAlphas,W.vertexTangents=O.vertexTangents,W.toneMapping=O.toneMapping}function Io(M,O,W,X,z){O.isScene!==!0&&(O=Ue),Je.resetTextureUnits();let ae=O.fog,ye=X.isMeshStandardMaterial?O.environment:null,Te=N===null?x.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:gs,Se=(X.isMeshStandardMaterial?ft:Ut).get(X.envMap||ye),Ve=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ye=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),ze=!!W.morphAttributes.position,rt=!!W.morphAttributes.normal,gt=!!W.morphAttributes.color,Lt=Li;X.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(Lt=x.toneMapping);let ct=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,_t=ct!==void 0?ct.length:0,ke=Ce.get(X),Tt=p.state.lights;if(je===!0&&(Q===!0||M!==y)){let zt=M===y&&X.id===b;ce.setState(X,M,zt)}let at=!1;X.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==Tt.state.version||ke.outputColorSpace!==Te||z.isBatchedMesh&&ke.batching===!1||!z.isBatchedMesh&&ke.batching===!0||z.isBatchedMesh&&ke.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&ke.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&ke.instancing===!1||!z.isInstancedMesh&&ke.instancing===!0||z.isSkinnedMesh&&ke.skinning===!1||!z.isSkinnedMesh&&ke.skinning===!0||z.isInstancedMesh&&ke.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&ke.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&ke.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&ke.instancingMorph===!1&&z.morphTexture!==null||ke.envMap!==Se||X.fog===!0&&ke.fog!==ae||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==ce.numPlanes||ke.numIntersection!==ce.numIntersection)||ke.vertexAlphas!==Ve||ke.vertexTangents!==Ye||ke.morphTargets!==ze||ke.morphNormals!==rt||ke.morphColors!==gt||ke.toneMapping!==Lt||ke.morphTargetsCount!==_t)&&(at=!0):(at=!0,ke.__version=X.version);let dn=ke.currentProgram;at===!0&&(dn=Qt(X,O,z));let ai=!1,fn=!1,li=!1,At=dn.getUniforms(),Sn=ke.uniforms;if(be.useProgram(dn.program)&&(ai=!0,fn=!0,li=!0),X.id!==b&&(b=X.id,fn=!0),ai||y!==M){be.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),At.setValue(U,"projectionMatrix",M.projectionMatrix),At.setValue(U,"viewMatrix",M.matrixWorldInverse);let ln=At.map.cameraPosition;ln!==void 0&&ln.setValue(U,Ee.setFromMatrixPosition(M.matrixWorld)),qe.logarithmicDepthBuffer&&At.setValue(U,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&At.setValue(U,"isOrthographic",M.isOrthographicCamera===!0),y!==M&&(y=M,fn=!0,li=!0)}if(z.isSkinnedMesh){At.setOptional(U,z,"bindMatrix"),At.setOptional(U,z,"bindMatrixInverse");let zt=z.skeleton;zt&&(zt.boneTexture===null&&zt.computeBoneTexture(),At.setValue(U,"boneTexture",zt.boneTexture,Je))}z.isBatchedMesh&&(At.setOptional(U,z,"batchingTexture"),At.setValue(U,"batchingTexture",z._matricesTexture,Je),At.setOptional(U,z,"batchingIdTexture"),At.setValue(U,"batchingIdTexture",z._indirectTexture,Je),At.setOptional(U,z,"batchingColorTexture"),z._colorsTexture!==null&&At.setValue(U,"batchingColorTexture",z._colorsTexture,Je));let tn=W.morphAttributes;if((tn.position!==void 0||tn.normal!==void 0||tn.color!==void 0)&&oe.update(z,W,dn),(fn||ke.receiveShadow!==z.receiveShadow)&&(ke.receiveShadow=z.receiveShadow,At.setValue(U,"receiveShadow",z.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Sn.envMap.value=Se,Sn.flipEnvMap.value=Se.isCubeTexture&&Se.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&O.environment!==null&&(Sn.envMapIntensity.value=O.environmentIntensity),fn&&(At.setValue(U,"toneMappingExposure",x.toneMappingExposure),ke.needsLights&&Fi(Sn,li),ae&&X.fog===!0&&ie.refreshFogUniforms(Sn,ae),ie.refreshMaterialUniforms(Sn,X,G,ne,p.state.transmissionRenderTarget[M.id]),vr.upload(U,Ar(ke),Sn,Je)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(vr.upload(U,Ar(ke),Sn,Je),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&At.setValue(U,"center",z.center),At.setValue(U,"modelViewMatrix",z.modelViewMatrix),At.setValue(U,"normalMatrix",z.normalMatrix),At.setValue(U,"modelMatrix",z.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let zt=X.uniformsGroups;for(let ln=0,Oi=zt.length;ln<Oi;ln++){let xi=zt[ln];Oe.update(xi,dn),Oe.bind(xi,dn)}}return dn}function Fi(M,O){M.ambientLightColor.needsUpdate=O,M.lightProbe.needsUpdate=O,M.directionalLights.needsUpdate=O,M.directionalLightShadows.needsUpdate=O,M.pointLights.needsUpdate=O,M.pointLightShadows.needsUpdate=O,M.spotLights.needsUpdate=O,M.spotLightShadows.needsUpdate=O,M.rectAreaLights.needsUpdate=O,M.hemisphereLights.needsUpdate=O}function Lo(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(M,O,W){let X=Ce.get(M);X.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Ce.get(M.texture).__webglTexture=O,Ce.get(M.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:W,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,O){let W=Ce.get(M);W.__webglFramebuffer=O,W.__useDefaultFramebuffer=O===void 0};let Do=U.createFramebuffer();this.setRenderTarget=function(M,O=0,W=0){N=M,R=O,L=W;let X=!0,z=null,ae=!1,ye=!1;if(M){let Se=Ce.get(M);if(Se.__useDefaultFramebuffer!==void 0)be.bindFramebuffer(U.FRAMEBUFFER,null),X=!1;else if(Se.__webglFramebuffer===void 0)Je.setupRenderTarget(M);else if(Se.__hasExternalTextures)Je.rebindTextures(M,Ce.get(M.texture).__webglTexture,Ce.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let ze=M.depthTexture;if(Se.__boundDepthTexture!==ze){if(ze!==null&&Ce.has(ze)&&(M.width!==ze.image.width||M.height!==ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Je.setupDepthRenderbuffer(M)}}let Ve=M.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(ye=!0);let Ye=Ce.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ye[O])?z=Ye[O][W]:z=Ye[O],ae=!0):M.samples>0&&Je.useMultisampledRTT(M)===!1?z=Ce.get(M).__webglMultisampledFramebuffer:Array.isArray(Ye)?z=Ye[W]:z=Ye,C.copy(M.viewport),B.copy(M.scissor),F=M.scissorTest}else C.copy(ue).multiplyScalar(G).floor(),B.copy(Xe).multiplyScalar(G).floor(),F=Ke;if(W!==0&&(z=Do),be.bindFramebuffer(U.FRAMEBUFFER,z)&&X&&be.drawBuffers(M,z),be.viewport(C),be.scissor(B),be.setScissorTest(F),ae){let Se=Ce.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+O,Se.__webglTexture,W)}else if(ye){let Se=O;for(let Ve=0;Ve<M.textures.length;Ve++){let Ye=Ce.get(M.textures[Ve]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Ve,Ye.__webglTexture,W,Se)}}else if(M!==null&&W!==0){let Se=Ce.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Se.__webglTexture,W)}b=-1},this.readRenderTargetPixels=function(M,O,W,X,z,ae,ye,Te=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ce.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ye!==void 0&&(Se=Se[ye]),Se){be.bindFramebuffer(U.FRAMEBUFFER,Se);try{let Ve=M.textures[Te],Ye=Ve.format,ze=Ve.type;if(!qe.textureFormatReadable(Ye)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qe.textureTypeReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=M.width-X&&W>=0&&W<=M.height-z&&(M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Te),U.readPixels(O,W,X,z,Pe.convert(Ye),Pe.convert(ze),ae))}finally{let Ve=N!==null?Ce.get(N).__webglFramebuffer:null;be.bindFramebuffer(U.FRAMEBUFFER,Ve)}}},this.readRenderTargetPixelsAsync=async function(M,O,W,X,z,ae,ye,Te=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ce.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ye!==void 0&&(Se=Se[ye]),Se)if(O>=0&&O<=M.width-X&&W>=0&&W<=M.height-z){be.bindFramebuffer(U.FRAMEBUFFER,Se);let Ve=M.textures[Te],Ye=Ve.format,ze=Ve.type;if(!qe.textureFormatReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qe.textureTypeReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let rt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,rt),U.bufferData(U.PIXEL_PACK_BUFFER,ae.byteLength,U.STREAM_READ),M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Te),U.readPixels(O,W,X,z,Pe.convert(Ye),Pe.convert(ze),0);let gt=N!==null?Ce.get(N).__webglFramebuffer:null;be.bindFramebuffer(U.FRAMEBUFFER,gt);let Lt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await yd(U,Lt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,rt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ae),U.deleteBuffer(rt),U.deleteSync(Lt),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,O=null,W=0){let X=Math.pow(2,-W),z=Math.floor(M.image.width*X),ae=Math.floor(M.image.height*X),ye=O!==null?O.x:0,Te=O!==null?O.y:0;Je.setTexture2D(M,0),U.copyTexSubImage2D(U.TEXTURE_2D,W,0,0,ye,Te,z,ae),be.unbindTexture()};let Ls=U.createFramebuffer(),Ds=U.createFramebuffer();this.copyTextureToTexture=function(M,O,W=null,X=null,z=0,ae=null){ae===null&&(z!==0?(js("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ae=z,z=0):ae=0);let ye,Te,Se,Ve,Ye,ze,rt,gt,Lt,ct=M.isCompressedTexture?M.mipmaps[ae]:M.image;if(W!==null)ye=W.max.x-W.min.x,Te=W.max.y-W.min.y,Se=W.isBox3?W.max.z-W.min.z:1,Ve=W.min.x,Ye=W.min.y,ze=W.isBox3?W.min.z:0;else{let tn=Math.pow(2,-z);ye=Math.floor(ct.width*tn),Te=Math.floor(ct.height*tn),M.isDataArrayTexture?Se=ct.depth:M.isData3DTexture?Se=Math.floor(ct.depth*tn):Se=1,Ve=0,Ye=0,ze=0}X!==null?(rt=X.x,gt=X.y,Lt=X.z):(rt=0,gt=0,Lt=0);let _t=Pe.convert(O.format),ke=Pe.convert(O.type),Tt;O.isData3DTexture?(Je.setTexture3D(O,0),Tt=U.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Je.setTexture2DArray(O,0),Tt=U.TEXTURE_2D_ARRAY):(Je.setTexture2D(O,0),Tt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment);let at=U.getParameter(U.UNPACK_ROW_LENGTH),dn=U.getParameter(U.UNPACK_IMAGE_HEIGHT),ai=U.getParameter(U.UNPACK_SKIP_PIXELS),fn=U.getParameter(U.UNPACK_SKIP_ROWS),li=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,ct.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ct.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ve),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ye),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ze);let At=M.isDataArrayTexture||M.isData3DTexture,Sn=O.isDataArrayTexture||O.isData3DTexture;if(M.isDepthTexture){let tn=Ce.get(M),zt=Ce.get(O),ln=Ce.get(tn.__renderTarget),Oi=Ce.get(zt.__renderTarget);be.bindFramebuffer(U.READ_FRAMEBUFFER,ln.__webglFramebuffer),be.bindFramebuffer(U.DRAW_FRAMEBUFFER,Oi.__webglFramebuffer);for(let xi=0;xi<Se;xi++)At&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ce.get(M).__webglTexture,z,ze+xi),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ce.get(O).__webglTexture,ae,Lt+xi)),U.blitFramebuffer(Ve,Ye,ye,Te,rt,gt,ye,Te,U.DEPTH_BUFFER_BIT,U.NEAREST);be.bindFramebuffer(U.READ_FRAMEBUFFER,null),be.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||Ce.has(M)){let tn=Ce.get(M),zt=Ce.get(O);be.bindFramebuffer(U.READ_FRAMEBUFFER,Ls),be.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ds);for(let ln=0;ln<Se;ln++)At?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,tn.__webglTexture,z,ze+ln):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,tn.__webglTexture,z),Sn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,zt.__webglTexture,ae,Lt+ln):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,zt.__webglTexture,ae),z!==0?U.blitFramebuffer(Ve,Ye,ye,Te,rt,gt,ye,Te,U.COLOR_BUFFER_BIT,U.NEAREST):Sn?U.copyTexSubImage3D(Tt,ae,rt,gt,Lt+ln,Ve,Ye,ye,Te):U.copyTexSubImage2D(Tt,ae,rt,gt,Ve,Ye,ye,Te);be.bindFramebuffer(U.READ_FRAMEBUFFER,null),be.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Sn?M.isDataTexture||M.isData3DTexture?U.texSubImage3D(Tt,ae,rt,gt,Lt,ye,Te,Se,_t,ke,ct.data):O.isCompressedArrayTexture?U.compressedTexSubImage3D(Tt,ae,rt,gt,Lt,ye,Te,Se,_t,ct.data):U.texSubImage3D(Tt,ae,rt,gt,Lt,ye,Te,Se,_t,ke,ct):M.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ae,rt,gt,ye,Te,_t,ke,ct.data):M.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ae,rt,gt,ct.width,ct.height,_t,ct.data):U.texSubImage2D(U.TEXTURE_2D,ae,rt,gt,ye,Te,_t,ke,ct);U.pixelStorei(U.UNPACK_ROW_LENGTH,at),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,dn),U.pixelStorei(U.UNPACK_SKIP_PIXELS,ai),U.pixelStorei(U.UNPACK_SKIP_ROWS,fn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,li),ae===0&&O.generateMipmaps&&U.generateMipmap(Tt),be.unbindTexture()},this.initRenderTarget=function(M){Ce.get(M).__webglFramebuffer===void 0&&Je.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Je.setTextureCube(M,0):M.isData3DTexture?Je.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Je.setTexture2DArray(M,0):Je.setTexture2D(M,0),be.unbindTexture()},this.resetState=function(){R=0,L=0,N=null,be.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ht._getDrawingBufferColorSpace(e),t.unpackColorSpace=ht._getUnpackColorSpace()}};var tf={type:"change"},Th={type:"start"},sf={type:"end"},Hl=new Ai,nf=new Wn,Mx=Math.cos(70*_r.DEG2RAD),jt=new I,In=2*Math.PI,Mt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},wh=1e-6,Vl=class extends _o{constructor(e,t=null){super(e,t),this.state=Mt.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Yn.ROTATE,MIDDLE:Yn.DOLLY,RIGHT:Yn.PAN},this.touches={ONE:si.ROTATE,TWO:si.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new Cn,this._lastTargetPosition=new I,this._quat=new Cn().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Pi,this._sphericalDelta=new Pi,this._scale=1,this._panOffset=new I,this._rotateStart=new fe,this._rotateEnd=new fe,this._rotateDelta=new fe,this._panStart=new fe,this._panEnd=new fe,this._panDelta=new fe,this._dollyStart=new fe,this._dollyEnd=new fe,this._dollyDelta=new fe,this._dollyDirection=new I,this._mouse=new fe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=bx.bind(this),this._onPointerDown=Sx.bind(this),this._onPointerUp=Ex.bind(this),this._onContextMenu=Ix.bind(this),this._onMouseWheel=Ax.bind(this),this._onKeyDown=Rx.bind(this),this._onTouchStart=Cx.bind(this),this._onTouchMove=Px.bind(this),this._onMouseDown=wx.bind(this),this._onMouseMove=Tx.bind(this),this._interceptControlDown=Lx.bind(this),this._interceptControlUp=Dx.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(tf),this.update(),this.state=Mt.NONE}update(e=null){let t=this.object.position;jt.copy(t).sub(this.target),jt.applyQuaternion(this._quat),this._spherical.setFromVector3(jt),this.autoRotate&&this.state===Mt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=In:n>Math.PI&&(n-=In),s<-Math.PI?s+=In:s>Math.PI&&(s-=In),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(jt.setFromSpherical(this._spherical),jt.applyQuaternion(this._quatInverse),t.copy(this.target).add(jt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=jt.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new I(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=jt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Hl.origin.copy(this.object.position),Hl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Hl.direction))<Mx?this.object.lookAt(this.target):(nf.setFromNormalAndCoplanarPoint(this.object.up,this.target),Hl.intersectPlane(nf,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>wh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>wh||this._lastTargetPosition.distanceToSquared(this.target)>wh?(this.dispatchEvent(tf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?In/60*this.autoRotateSpeed*e:In/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){jt.setFromMatrixColumn(t,0),jt.multiplyScalar(-e),this._panOffset.add(jt)}_panUp(e,t){this.screenSpacePanning===!0?jt.setFromMatrixColumn(t,1):(jt.setFromMatrixColumn(t,0),jt.crossVectors(this.object.up,jt)),jt.multiplyScalar(e),this._panOffset.add(jt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;jt.copy(s).sub(this.target);let r=jt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(In*this._rotateDelta.x/t.clientHeight),this._rotateUp(In*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(In*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-In*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(In*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-In*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(In*this._rotateDelta.x/t.clientHeight),this._rotateUp(In*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new fe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Sx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function bx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Ex(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(sf),this.state=Mt.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function wx(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Yn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Mt.DOLLY;break;case Yn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Mt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Mt.ROTATE}break;case Yn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Mt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Mt.PAN}break;default:this.state=Mt.NONE}this.state!==Mt.NONE&&this.dispatchEvent(Th)}function Tx(i){switch(this.state){case Mt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Mt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Mt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Ax(i){this.enabled===!1||this.enableZoom===!1||this.state!==Mt.NONE||(i.preventDefault(),this.dispatchEvent(Th),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(sf))}function Rx(i){this.enabled!==!1&&this._handleKeyDown(i)}function Cx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case si.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Mt.TOUCH_ROTATE;break;case si.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Mt.TOUCH_PAN;break;default:this.state=Mt.NONE}break;case 2:switch(this.touches.TWO){case si.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Mt.TOUCH_DOLLY_PAN;break;case si.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Mt.TOUCH_DOLLY_ROTATE;break;default:this.state=Mt.NONE}break;default:this.state=Mt.NONE}this.state!==Mt.NONE&&this.dispatchEvent(Th)}function Px(i){switch(this._trackPointer(i),this.state){case Mt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Mt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Mt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Mt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Mt.NONE}}function Ix(i){this.enabled!==!1&&i.preventDefault()}function Lx(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Dx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var pe=(i,e,t,n)=>({title:i,lessons:e.split("|"),start:t,dur:n}),Pt=[{id:"nature",title:"Nature",blurb:"Forests, fungi and food webs.",terrain:"forest",top:"#5f9a5a",top2:"#4f8a52",paths:[pe("Forest Floor","Leaf litter|Mosses and ferns|Mushrooms|Fallen logs|Tiny hunters",1,8),pe("Trees of Europe","Oak|Beech|Scots pine|Birch|Chestnut|Rowan",2,9),pe("Birdsong","Dawn chorus|Robin|Blackbird|Owl calls",5,6),pe("Soil Life","Earthworms|Fungal networks|Compost|Roots",8,6),pe("Wildlife Watching","Tracks|Nests|Night visitors|Through the seasons",11,5)]},{id:"biology",title:"Biology & Life",blurb:"Rainforests, cells and slow change.",terrain:"forest",top:"#4f9e6b",top2:"#418c5a",paths:[pe("Rainforest Layers","Emergent giants|Canopy highways|Understory shade|The dark floor",0,8),pe("Cells at Work","Membranes|Mitochondria|Photosynthesis|Division",3,7),pe("Evolution","Variation|Selection|Speciation|Deep time",6,7),pe("Symbiosis","Pollinators|Mycorrhizae|Cleaner fish|Gut microbes",10,5)]},{id:"ocean",title:"Ocean",blurb:"Tides, reefs and the deep blue.",terrain:"pond",top:"#74b0ba",top2:"#62a0ab",paths:[pe("Coral Reefs","Reef builders|Fish of the lagoon|Sharks and rays|The reef at night",1,8),pe("The Deep Sea","Twilight zone|Hydrothermal vents|Giant squid|Bioluminescence",4,8),pe("Tides and Currents","Moon pull|Gyres|Upwelling|El Ni\xF1o",7,6),pe("Coastal Life","Rock pools|Mangroves|Dune plants",11,5)]},{id:"climate",title:"Climate & Environment",blurb:"Ice, air and a warming planet.",terrain:"alpine",top:"#9fc3cc",top2:"#8db2bd",paths:[pe("Frozen Worlds","Glaciers|Sea ice|Permafrost|Ice cores",0,8),pe("Weather Systems","Air masses|Fronts|Storms|Jet streams",2,7),pe("Carbon Cycle","Sinks and sources|Oceans breathe|Forests store|Fossil carbon",6,8),pe("Habitats Under Pressure","Coral bleaching|Range shifts|Extremes|Restoration",10,5)]},{id:"space",title:"Space & Astronomy",blurb:"Desert skies, planets and distant suns.",terrain:"mesa",top:"#b39bb5",top2:"#a189a4",paths:[pe("The Solar System","Rocky planets|Gas giants|Moons|Asteroids",1,8),pe("Stargazing","Constellations|Reading the night sky|Planets to spot",3,6),pe("Telescopes","Lenses and mirrors|Radio eyes|Space observatories",6,7),pe("Galaxies","The Milky Way|Spirals and ellipticals|Dark matter",10,5)]},{id:"geology",title:"Geology & Earth",blurb:"Strata, faults and fossils.",terrain:"mesa",top:"#d89a6a",top2:"#c98658",paths:[pe("Reading Rocks","Igneous|Sedimentary|Metamorphic|The rock cycle",0,8),pe("Canyons and Mesas","Erosion|Strata|Slot canyons|Hoodoos",3,7),pe("Fossils","How fossils form|Ammonites|Dinosaurs|Trace fossils",6,7),pe("Plate Tectonics","Drift|Subduction|Earthquakes|Volcanoes",9,6)]},{id:"physics",title:"Physics & Energy",blurb:"Forces, fields and flowing heat.",terrain:"mesa",top:"#c97b5f",top2:"#b56a4f",paths:[pe("Energy Basics","Kinetic and potential|Conservation|Power",1,7),pe("Heat and Steam","Conduction|Convection|Geothermal",3,7),pe("Electricity","Circuits|Fields|Motors|Grids",6,8),pe("Light","Waves|Spectra|Lenses",10,5)]},{id:"chemistry",title:"Chemistry",blurb:"Crystals, reactions and the table of elements.",terrain:"alpine",top:"#a89ec4",top2:"#968cb3",paths:[pe("Atoms and Bonds","Elements|Ionic and covalent|Molecules",1,8),pe("Crystals","Lattices|Growing crystals|Gemstones|Quartz",3,7),pe("Reactions","Acids and bases|Oxidation|Catalysts",7,7)]},{id:"sport",title:"Sport",blurb:"Trails, summits and match days.",terrain:"alpine",top:"#a8bd8f",top2:"#96ac7e",paths:[pe("Mountain Sports","Trail running|Climbing|Ski touring|Safety",1,8),pe("Training Basics","Endurance|Strength|Recovery|Fueling",4,7),pe("Team Sports","Formations|Set pieces|Reading the game",7,6),pe("Legendary Races","Tour climbs|Marathons|Ocean crossings",10,5),pe("Racket Skills","Serve|Rally|Net play|Match craft",12,4)]},{id:"health",title:"Health & Body",blurb:"Sleep, movement and steady habits.",terrain:"meadow",top:"#9cbf7a",top2:"#8aae69",paths:[pe("Sleep Hygiene","Light and dark|Wind-down routine|Caffeine|Naps",0,7),pe("Gentle Movement","Morning stretch|Walking|Posture",3,6),pe("Nutrition Basics","Plates|Protein|Fiber|Hydration",6,7),pe("Listening to Your Body","Rest days|Signals|Check-ups",10,5)]},{id:"mind",title:"Mind & Psychology",blurb:"Attention, memory and calm.",terrain:"pond",top:"#a3b899",top2:"#92a788",paths:[pe("Breathing","Box breathing|Long exhale|Body scan",1,6),pe("How Memory Works","Encoding|Forgetting|Spaced practice",3,7),pe("Attention","Distraction|Deep work|Flow",6,7),pe("Emotions","Naming feelings|Stress response|Reappraisal",9,6)]},{id:"cooking",title:"Cooking & Food",blurb:"Grow it, cook it, taste it.",terrain:"orchard",top:"#b0a45f",top2:"#9d9350",paths:[pe("Kitchen Garden","Sowing carrots|Tomatoes|Herbs on a sill|Harvest day",0,9),pe("Bread Basics","Flour and water|Kneading|Proofing|Scoring a loaf",3,7),pe("Knife Skills","The claw grip|Dicing|Julienne|Sharpening",6,6),pe("Sauces","Roux|Vinaigrette|Tomato base",9,5),pe("Fermentation","Yogurt|Kimchi|Sourdough",12,4)]},{id:"languages",title:"Languages",blurb:"Words for the people you love.",terrain:"meadow",top:"#8fbf63",top2:"#7aae55",paths:[pe("Early Childhood English","Comforting a crying baby|Routines and transitions|Bath time|Bedtime stories",0,8),pe("Professional English","Introductions|Small talk|Emails that get answers|Meetings",3,8),pe("Travel English","At the airport|Ordering food|Finding the way",7,6),pe("Idioms Garden","Piece of cake|Under the weather|Break the ice|Spill the beans",10,5)]},{id:"art",title:"Art & Design",blurb:"Color, composition and seeing.",terrain:"lavender",top:"#c4a86f",top2:"#b2965e",paths:[pe("Color Theory","Hue and value|Complements|Warm and cool",1,7),pe("Composition","Rule of thirds|Leading lines|Negative space",4,7),pe("Drawing Basics","Gesture|Proportion|Light and shadow",7,6),pe("Looking at Art","Cave walls|Renaissance|Impressionism|Today",10,6)]},{id:"music",title:"Music",blurb:"Rhythm, pitch and play.",terrain:"lavender",top:"#a9b27c",top2:"#97a46d",paths:[pe("Rhythm Basics","Pulse|Quarter notes|Syncopation|Polyrhythm",1,8),pe("Reading Notation","The staff|Clefs|Key signatures|Dynamics",4,8),pe("Ear Training","Intervals|Major or minor|Chords by ear",8,6)]},{id:"history",title:"History",blurb:"Peaks and turning points.",terrain:"alpine",top:"#b5a685",top2:"#a39473",paths:[pe("Ancient Worlds","Mesopotamia|Egypt|Greece|Rome",1,8),pe("Medieval Europe","Castles|Guilds|Plague|Printing press",4,8),pe("Industrial Age","Steam|Railways|Factories|Cities",7,7),pe("Twentieth Century","World wars|Cold war|Decolonization",10,6)]},{id:"technology",title:"Technology & AI",blurb:"Networks, code and learning machines.",terrain:"pond",top:"#7dada4",top2:"#6b9b93",paths:[pe("How the Internet Works","Packets|Routers|Protocols|Data centers",0,8),pe("Machine Learning","Data|Training|Inference|Limits",3,8),pe("Cybersecurity","Passwords|Phishing|Encryption",7,6),pe("Computing History","Vacuum tubes|Transistors|Personal computers",10,5)]},{id:"engineering",title:"Engineering & Invention",blurb:"Bridges, machines and clever fixes.",terrain:"mesa",top:"#93a1a8",top2:"#82919a",paths:[pe("Bridges","Beams|Arches|Suspension|Failure lessons",1,8),pe("Machines","Levers|Gears|Engines|Robots",4,8),pe("Inventions That Stuck","Printing|Electric light|Radio|The chip",8,7)]},{id:"mathematics",title:"Mathematics",blurb:"Patterns, proofs and terraces of ideas.",terrain:"meadow",top:"#a4c76a",top2:"#93b55b",paths:[pe("Numbers","Primes|Fractions|Zero|Infinity",1,8),pe("Geometry","Triangles|Circles|Symmetry|Tilings",4,8),pe("Chance","Probability|Averages|Surprising paradoxes",7,7),pe("Graphs and Networks","Nodes and edges|Trees|Shortest paths",10,6)]},{id:"economics",title:"Economics & Money",blurb:"Harvests, trade and what things cost.",terrain:"orchard",top:"#cbb26a",top2:"#b8a05a",paths:[pe("Money Basics","Coins and notes|Banks|Interest",1,7),pe("Markets","Supply and demand|Prices|Trade",4,8),pe("Booms and Busts","Bubbles|Crashes|Recoveries",8,7),pe("Personal Finance","Budgets|Saving|Compound growth",11,5)]}];function Ui(i,e){let t=(i-e.start)/e.dur;return Math.max(0,Math.min(1,t))}var Ux=[[0,0],[1,0],[-1,1],[0,-1],[0,1],[-1,0],[1,-1]],Ah=[[0,0],[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1],[2,0],[2,-1],[2,-2],[1,-2],[0,-2],[-1,-1],[-2,0],[-2,1],[-2,2],[-1,2],[0,2],[1,2],[3,-2]],Rh=Math.sqrt(3)*3.15+.5,Nx=([i,e])=>{let t=Rh/Math.sqrt(3);return[t*Math.sqrt(3)*(i+e/2),t*1.5*e]},rf=Ah.map(Nx),Fx=Pt.map(i=>{let e=new Map,t=1.035,n=o=>o.map(a=>Math.round(a*1e5)).join(",");i.paths.forEach((o,a)=>{let[c,l]=Ux[a],d=t*Math.sqrt(3)*(c+l/2),h=t*1.5*l,f=Array.from({length:6},(u,g)=>[d+Math.cos(Math.PI/6+g*Math.PI/3)*t,h+Math.sin(Math.PI/6+g*Math.PI/3)*t]);f.forEach((u,g)=>{let _=f[(g+1)%6],m=n(u),p=n(_),S=[m,p].sort().join("|");e.has(S)?e.delete(S):e.set(S,[u,_])})});let s=[...e.values()],r=[s.shift()];for(;s.length;){let o=n(r.at(-1)[1]),a=s.findIndex(c=>n(c[0])===o);if(a<0)throw new Error("Open footprint");r.push(s.splice(a,1)[0])}return r.map(([o])=>o.map(a=>a*1.13))}),Ox=.9,Ch=Pt.map((i,e)=>{let[t,n]=rf[e],s=Fx[e].map(([r,o])=>[r*2.1,o*2.1]);rf.forEach(([r,o],a)=>{if(a===e)return;let c=r-t,l=o-n,d=Math.hypot(c,l),h=d*d/2-Ox/2*d,f=[];s.forEach((u,g)=>{let _=s[(g+1)%s.length],m=c*u[0]+l*u[1]-h,p=c*_[0]+l*_[1]-h;if(m<=0&&f.push(u),m<0!=p<0){let S=m/(m-p);f.push([u[0]+(_[0]-u[0])*S,u[1]+(_[1]-u[1])*S])}}),s=f}),s=s.filter((r,o)=>Math.hypot(r[0]-s[(o+1)%s.length][0],r[1]-s[(o+1)%s.length][1])>1e-5);for(let r=0;r<12;r++){let o=Math.cos(r*Math.PI/6),a=Math.sin(r*Math.PI/6),c=[];s.forEach((l,d)=>{let h=s[(d+1)%s.length],f=o*l[0]+a*l[1]-3.85,u=o*h[0]+a*h[1]-3.85;if(f<=0&&c.push(l),f<0!=u<0){let g=f/(f-u);c.push([l[0]+(h[0]-l[0])*g,l[1]+(h[1]-l[1])*g])}}),s=c}return s}),XM=Ch.map(i=>Math.max(...i.map(([e,t])=>Math.hypot(e,t)))),of=[{name:"Wild Earth",themes:[0,1,2,3]},{name:"Stone & Sky",themes:[4,5,6,7]},{name:"Body & Mind",themes:[8,9,10,11]},{name:"Arts & Letters",themes:[12,13,14,15]},{name:"Human Systems",themes:[16,17,18,19]}];var Ph=[{name:"Earth & cosmos",themes:[0,2,3,4,5],center:[-6,-5],slots:[[0,0],[1,0],[0,1],[-1,1],[-1,0]]},{name:"Life & wellbeing",themes:[1,8,9,10,11],center:[5,-4],slots:[[0,0],[0,-1],[1,-1],[1,0],[0,1]]},{name:"Science & making",themes:[6,7,16,17,18],center:[-5,5],slots:[[0,0],[-1,0],[-1,1],[0,1],[1,0]]},{name:"Culture & society",themes:[12,13,14,15,19],center:[7,6],slots:[[0,0],[0,-1],[1,-1],[-1,0],[0,1]]}],Ih=Array.from({length:20});Ph.forEach(i=>i.themes.forEach((e,t)=>{let[n,s]=i.slots[t];Ih[e]=[i.center[0]+2.65*(n+s/2),i.center[1]+2.65*Math.sqrt(3)/2*s]}));function ss(i){let e=i>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Bx=(i,e,t)=>{let n=Math.sin(i*127.1+e*311.7+t*74.7)*43758.5453;return n-Math.floor(n)};function is(i,e,t=0){let n=i.attributes.position;for(let s=0;s<n.count;s++){let r=n.getX(s),o=n.getY(s),a=n.getZ(s),c=l=>(Bx(Math.round(r*997)+t+l,Math.round(o*991),Math.round(a*983))-.5)*2*e;n.setXYZ(s,r+c(1),o+c(2),a+c(3))}return i}var Uh=class{constructor(e=1){this.pos=[],this.col=[],this.rng=ss(e),this.tmp=new Me}add(e,{p:t=[0,0,0],r:n=[0,0,0],s=[1,1,1],c:r="#ffffff",j:o=.07,grad:a=0}={}){let c=e.index?e.toNonIndexed():e.clone();c.applyMatrix4(new ut().compose(new I(...t),new Cn().setFromEuler(new Bn(...n)),new I(...s)));let l=c.attributes.position.array,d=new Me(r),h=1/0,f=-1/0;for(let u=1;u<l.length;u+=3)h=Math.min(h,l[u]),f=Math.max(f,l[u]);for(let u=0;u<l.length;u+=9){let g=1+(this.rng()-.5)*2*o;for(let _=0;_<3;_++){let m=l[u+_*3+1],p=f>h?(m-h)/(f-h):.5,S=g*(1+a*(p-.5));this.col.push(d.r*S,d.g*S,d.b*S),this.pos.push(l[u+_*3],l[u+_*3+1],l[u+_*3+2])}}c.dispose()}build(){let e=new vt;return e.setAttribute("position",new nt(this.pos,3)),e.setAttribute("color",new nt(this.col,3)),e.computeVertexNormals(),e}},an=(i,e,t)=>new io(i,e,t).translate(0,e/2,0),It=(i,e,t,n)=>new qn(e,i,t,n).translate(0,t/2,0),wt=(i,e,t=.12,n=0)=>is(new ii(i,e).toNonIndexed(),i*t,n),Lh=["#6faa4f","#5f9c47","#7cb857","#4f8f45"],Dh=["#3f7d48","#35703f","#4a8a50"];function af(i){let e=i>=1,t={},n=e?7:5,s=e?1:0,r=(h,f,u)=>{let g=new Uh(f);u(g),t[h]=g.build()},o="#8a6444",a=(h,f,u)=>{if(h.add(It(.07,.04,.55,n),{c:o,j:.05}),h.add(It(.02,.012,.3,4),{p:[.06,.38,0],r:[0,0,-.9],c:o}),[[0,.82,0,.36],[.2,.64,.1,.25],[-.2,.68,-.08,.26],[.04,1.06,-.04,.26],[-.06,.62,.22,.2]].forEach(([_,m,p,S],w)=>h.add(wt(S,s,.14,w),{p:[_,m,p],s:[1,.9,1],c:f[w%f.length],j:.09,grad:.35})),u)for(let _=0;_<(e?9:4);_++){let m=_*2.4,p=.33;h.add(new ii(.045,0),{p:[Math.cos(m)*p*(.8+_%3*.1),.62+_%4*.12,Math.sin(m)*p*.9],c:u,j:.1})}};r("tree",11,h=>a(h,Lh)),r("forestTree",12,h=>a(h,Dh)),r("appleTree",13,h=>a(h,Lh,"#e2573c")),r("blossomTree",14,h=>a(h,["#f1b8c4","#eaa3b4","#f7cdd5"]));let c=h=>f=>{f.add(It(.06,.04,.35,5),{c:"#6e4f38"});let u=e?5:4;for(let g=0;g<u;g++){let _=.42-g*.07,m=.46-g*.03,p=.22+g*.26;f.add(is(an(_,m,e?8:6).toNonIndexed(),.012,g),{p:[0,p,0],r:[0,g*.5,0],c:Dh[g%3],j:.08,grad:.3}),h&&f.add(an(_*.62,m*.55,e?8:6),{p:[0,p+m*.5,0],r:[0,g*.5,0],c:"#f4f6f4",j:.03})}};r("pine",21,c(!1)),r("snowPine",22,c(!0));let l=h=>f=>{if([[0,.17,0,.2],[.17,.12,.05,.14],[-.15,.13,-.04,.15],[.02,.14,.17,.13]].forEach(([u,g,_,m],p)=>f.add(wt(m,s,.14,p),{p:[u,g,_],c:Lh[p%4],j:.09,grad:.4})),h)for(let u=0;u<(e?10:5);u++){let g=u*2.1;f.add(new ii(.035,0),{p:[Math.cos(g)*.2,.18+u%3*.06,Math.sin(g)*.2],c:h,j:.1})}};r("bush",31,l()),r("berryBush",32,l("#d84a4a")),r("herbBush",33,l("#f6f3ea"));let d=(h,f=.36)=>u=>{u.add(It(.012,.01,f,4),{c:"#5d9b48",j:.04}),u.add(an(.05,.1,3),{p:[.03,f*.3,0],r:[0,0,-1.1],c:"#6fae51"}),u.add(an(.05,.1,3),{p:[-.03,f*.5,0],r:[0,0,1.1],c:"#6fae51"});let g=e?6:5;for(let _=0;_<g;_++){let m=_/g*Math.PI*2;u.add(wt(.05,0,.1,_),{p:[Math.cos(m)*.055,f,Math.sin(m)*.055],s:[1,.55,1],c:h,j:.06})}u.add(new ii(.035,0),{p:[0,f+.01,0],c:"#f5c542",j:.04})};return r("flowerPink",41,d("#ee86a9")),r("flowerYellow",42,d("#f6cf4a",.3)),r("flowerWhite",43,d("#fbf8ef",.32)),r("flowerOrange",44,d("#ee8a3c",.28)),r("flowerBlue",45,d("#7fa6e6",.34)),r("sunflower",51,h=>{h.add(It(.025,.02,.78,5),{c:"#5b9645",j:.04}),h.add(an(.1,.22,3),{p:[.07,.25,0],r:[0,0,-1.2],s:[1,1,.5],c:"#69a84e"}),h.add(an(.1,.22,3),{p:[-.07,.42,0],r:[0,0,1.2],s:[1,1,.5],c:"#69a84e"});let f=e?13:8;for(let u=0;u<f;u++){let g=u/f*Math.PI*2;h.add(an(.05,.17,3),{p:[Math.cos(g)*.12,.8+Math.sin(g)*.12*.35,Math.sin(g)*.12],r:[Math.PI/2-.3,0,-g+Math.PI/2],c:"#f8c933",j:.07})}h.add(It(.1,.1,.05,8),{p:[0,.77,.03],r:[.35,0,0],c:"#6b4426",j:.06})}),r("lavender",61,h=>{let f=e?7:4;for(let u=0;u<f;u++){let g=u/f*6.28+.4,_=.14,m=Math.cos(g)*.06,p=Math.sin(g)*.06;h.add(It(.012,.008,.34,4),{p:[m,0,p],r:[Math.sin(g)*_,0,-Math.cos(g)*_],c:"#6d9a58"});for(let S=0;S<(e?5:3);S++)h.add(wt(.034-S*.002,0,.1,u*7+S),{p:[m+Math.cos(g)*.04,.3+S*.045+u%2*.02,p+Math.sin(g)*.04],s:[1,1.3,1],c:S%2?"#9b7bd0":"#8a68c4",j:.08})}}),r("cactus",71,h=>{let f="#5b9a5e";h.add(new pi(.1,.5,3,e?8:6).translate(0,.35,0),{c:f,j:.06}),h.add(new pi(.055,.2,3,6),{p:[.2,.42,0],r:[0,0,0],c:f}),h.add(new pi(.05,.1,3,6),{p:[.14,.31,0],r:[0,0,1.57],c:f}),h.add(new pi(.05,.16,3,6),{p:[-.18,.5,0],c:f}),h.add(new pi(.045,.1,3,6),{p:[-.13,.4,0],r:[0,0,1.57],c:f}),h.add(wt(.04,0,.1),{p:[0,.74,0],c:"#ee6f9a"})}),r("agave",72,h=>{let f=e?11:7;for(let u=0;u<f;u++){let g=u*2.4,_=u%3/3;h.add(is(an(.06,.38-_*.1,4).toNonIndexed(),.004,u),{p:[Math.cos(g)*.03,.04,Math.sin(g)*.03],r:[Math.sin(g)*(.7+_*.4),0,-Math.cos(g)*(.7+_*.4)],s:[1,1,.4],c:u%2?"#7aa88a":"#6b9a7d",j:.07})}}),r("reed",81,h=>{let f=e?6:4;for(let u=0;u<f;u++){let g=u*1.9,_=.55+u%3*.12,m=Math.cos(g)*.05,p=Math.sin(g)*.05,S=.1+u%2*.06;h.add(an(.016,_,4),{p:[m,0,p],r:[Math.sin(g)*S,0,-Math.cos(g)*S],c:u%2?"#7aa95a":"#6b9a50"}),u%2===0&&h.add(It(.025,.025,.12,5),{p:[m+Math.cos(g)*_*S*.9,_*.8,p+Math.sin(g)*_*S*.9],c:"#6b4a32"})}}),r("lotus",82,h=>{h.add(new qn(.2,.2,.012,e?10:7).translate(0,.01,0),{c:"#5da37a",j:.06});let f=e?8:6;for(let u=0;u<f;u++){let g=u/f*6.28;h.add(wt(.06,0,.08,u),{p:[Math.cos(g)*.055,.1,Math.sin(g)*.055],r:[Math.sin(g)*.6,0,-Math.cos(g)*.6],s:[.8,1.6,.8],c:"#f4a4c0",j:.05})}h.add(wt(.03,0,.1),{p:[0,.1,0],c:"#f5cf50"})}),r("fern",91,h=>{let f=e?9:6;for(let u=0;u<f;u++){let g=u/f*6.28,_=.8+u%3*.2;h.add(is(an(.055,.42,4).toNonIndexed(),.004,u),{p:[0,.03,0],r:[Math.sin(g)*_,0,-Math.cos(g)*_],s:[1,1,.3],c:u%2?"#4f9552":"#5aa35a",j:.07})}}),r("mushroom",92,h=>{h.add(It(.035,.03,.12,6),{c:"#f1e8d6"}),h.add(new Ci(.1,8,4,0,6.28,0,Math.PI/2).translate(0,.1,0),{c:"#d6432f",j:.05});for(let f=0;f<4;f++)h.add(new ii(.018,0),{p:[Math.cos(f*1.6)*.055,.17+f%2*.01,Math.sin(f*1.6)*.055],c:"#fff8ea",j:0})}),r("carrot",93,h=>{h.add(an(.045,.2,6),{p:[0,.03,0],r:[Math.PI,0,0],c:"#f08a24",j:.07});let f=e?7:5;for(let u=0;u<f;u++){let g=u/f*6.28;h.add(an(.02,.22,3),{p:[Math.cos(g)*.02,.04,Math.sin(g)*.02],r:[Math.sin(g)*.55,0,-Math.cos(g)*.55],s:[1,1,.5],c:"#5ea84a",j:.06})}}),r("rock",101,h=>{h.add(wt(.12,0,.25,3),{s:[1.3,.7,1],p:[0,.05,0],c:"#b7b2a6",j:.1,grad:.3}),h.add(wt(.07,0,.25,4),{p:[.14,.03,.05],c:"#a8a397",j:.1})}),r("redRock",102,h=>{h.add(wt(.13,0,.25,5),{s:[1.2,.8,1],p:[0,.06,0],c:"#c4714a",j:.1,grad:.4}),h.add(wt(.07,0,.25,6),{p:[-.14,.03,.04],c:"#b5643f",j:.1})}),r("pebble",103,h=>h.add(wt(.035,0,.2,7),{s:[1.4,.5,1],c:"#eee8d8",j:.05})),r("mound",104,h=>h.add(new Ci(.1,8,4,0,6.28,0,Math.PI/2),{s:[1,.45,1],c:"#8a6a4a",j:.1})),r("sprout",105,h=>{h.add(It(.008,.006,.09,3),{c:"#7ab85a"}),h.add(wt(.028,0,.1,1),{p:[.03,.09,0],s:[1.4,.5,1],c:"#8ccb63"}),h.add(wt(.028,0,.1,2),{p:[-.03,.1,0],s:[1.4,.5,1],c:"#7ab85a"})}),r("flag",106,h=>{h.add(It(.012,.012,.6,4),{c:"#d9cdb8"}),h.add(new vt().setFromPoints([new I(0,.6,0),new I(.22,.52,0),new I(0,.44,0)]).setIndex([0,1,2,0,2,1]),{c:"#c65d3b",j:0})}),r("emergentTree",110,h=>{h.add(It(.05,.08,1.15,n),{c:"#7a5a3e",j:.05}),[[0,1.42,0,.42],[.26,1.24,.08,.28],[-.24,1.28,-.1,.29],[.02,1.66,-.05,.3],[-.05,1.22,.26,.24]].forEach(([f,u,g,_],m)=>h.add(wt(_,s,.13,m),{p:[f,u,g],s:[1,.82,1],c:Dh[m%3],j:.08,grad:.4}));for(let f=0;f<(e?7:4);f++){let u=f*2.2;h.add(wt(.035,0,.1,f),{p:[Math.cos(u)*.34,1.28+f%3*.14,Math.sin(u)*.34],c:"#f2b8cf",j:.08})}}),r("oliveTree",111,h=>{h.add(It(.05,.09,.4,n),{c:"#7d6448",j:.08}),h.add(It(.03,.045,.28,4),{p:[.1,.3,.02],r:[0,0,-.5],c:"#7d6448"});let f=["#8fa37c","#9db089","#7d9470"];[[0,.58,0,.3],[.22,.5,.06,.22],[-.2,.52,-.06,.23],[.02,.74,-.04,.2]].forEach(([u,g,_,m],p)=>h.add(wt(m,s,.16,p),{p:[u,g,_],s:[1,.72,1],c:f[p%3],j:.09,grad:.35}))}),r("windmill",112,h=>{h.add(It(.1,.17,.95,e?8:6),{c:"#f0e6d2",j:.05,grad:.25}),h.add(an(.13,.18,e?8:6),{p:[0,.95,0],c:"#a94a2c",j:.05}),h.add(new Xn(.1,.14,.06),{p:[0,.32,.15],c:"#8a6444"});for(let f=0;f<4;f++)h.add(new Xn(.62,.085,.02),{p:[Math.sin(f*Math.PI/2+.4)*.3,1+Math.cos(f*Math.PI/2+.4)*.3,.13],r:[0,0,-f*Math.PI/2-.4],c:"#e8dcc2",j:.03});h.add(It(.035,.035,.08,5),{p:[0,.95,.1],r:[Math.PI/2,0,0],c:"#6e4f38"})}),r("standingStone",113,h=>{h.add(wt(.16,s,.18,8),{p:[0,.32,0],s:[.75,2.4,.55],c:"#9a958a",j:.07,grad:.3}),h.add(wt(.06,0,.2,9),{p:[.2,.03,.1],s:[1.3,.6,1],c:"#a8a397",j:.08})}),r("iceberg",114,h=>{h.add(is(an(.34,.75,e?7:5).toNonIndexed(),.02,3),{p:[-.05,0,0],c:"#eef4f6",j:.05,grad:.35}),h.add(is(an(.22,.5,5).toNonIndexed(),.015,4),{p:[.28,0,.12],r:[0,.7,0],c:"#dceaf2",j:.05,grad:.3}),h.add(wt(.2,s,.12,5),{p:[.05,.02,-.2],s:[1.4,.35,1.1],c:"#cfe4ee",j:.05})}),r("observatory",115,h=>{h.add(It(.24,.27,.42,e?10:7),{c:"#f2efe8",j:.04,grad:.2}),h.add(new Ci(.26,e?12:8,5,0,6.28,0,Math.PI/2).translate(0,.42,0),{c:"#e4ded0",j:.04}),h.add(new Xn(.07,.2,.06),{p:[0,.52,.22],c:"#4a4440",j:0}),h.add(It(.05,.05,.22,5),{p:[0,.58,.26],r:[1.1,0,0],c:"#b9b3a2"})}),r("terraces",116,h=>{let f=["#a4c76a","#93b55b","#84a84e","#759a44"];for(let u=0;u<4;u++)h.add(new qn(.34-u*.08,.38-u*.08,.1,e?10:7).translate(0,.05+u*.1,0),{c:f[u],j:.06});h.add(new qn(.07,.07,.02,7).translate(0,.42,0),{c:"#8fc7d0",j:.03})}),r("coralHead",117,h=>{h.add(wt(.12,s,.15,2),{p:[0,.06,0],s:[1.3,.6,1.2],c:"#d8b898",j:.08});let f=["#f28ca6","#ee8a3c","#f6b1c3"];for(let u=0;u<(e?6:4);u++){let g=u*2.3,_=.35+u%3*.18,m=.3+u%3*.12;h.add(new pi(.045,m,3,5).translate(0,m/2,0),{p:[Math.cos(g)*.1,.08,Math.sin(g)*.1],r:[Math.sin(g)*_,0,-Math.cos(g)*_],c:f[u%3],j:.07}),h.add(wt(.05,0,.1,u),{p:[Math.cos(g)*(.1+_*m*.7),.12+m,Math.sin(g)*(.1+_*m*.7)],c:f[(u+1)%3],j:.08})}}),r("mangrove",118,h=>{for(let f=0;f<5;f++){let u=f/5*6.28;h.add(It(.018,.028,.42,4),{p:[Math.cos(u)*.22,0,Math.sin(u)*.22],r:[Math.sin(u)*.55,0,-Math.cos(u)*.55],c:"#7a5a3e",j:.06})}h.add(It(.06,.05,.35,n),{p:[0,.32,0],c:"#6e4f38"}),[[0,.85,0,.34],[.22,.72,.1,.24],[-.2,.74,-.08,.25]].forEach(([f,u,g,_],m)=>h.add(wt(_,s,.14,m+4),{p:[f,u,g],s:[1,.75,1],c:["#4f8f6a","#5d9c72","#43825e"][m],j:.08,grad:.35}))}),r("basaltColumns",119,h=>{let f=[.55,.8,.42,.68,.3],u=["#7d8891","#6b767f","#8b969e"];f.forEach((g,_)=>{let m=_*2.4,p=_?.16:0;h.add(new qn(.11,.13,g,6).translate(Math.cos(m)*p,g/2,Math.sin(m)*p),{c:u[_%3],j:.06,grad:.3})})}),r("hoodoo",120,h=>{h.add(It(.16,.22,.3,6),{c:"#c4714a",j:.06}),h.add(It(.11,.15,.34,6),{p:[0,.3,0],c:"#b5643f",j:.06}),h.add(wt(.14,s,.15,6),{p:[0,.68,0],s:[1.25,.55,1.1],c:"#d08a5e",j:.07})}),r("volcanicVent",121,h=>{h.add(is(an(.3,.42,e?8:6).toNonIndexed(),.02,7),{c:"#4a3f3a",j:.07,grad:.3}),h.add(wt(.09,0,.15,8),{p:[0,.4,0],s:[1.2,.5,1.2],c:"#e86a2a",j:.12}),h.add(wt(.05,0,.1,9),{p:[.16,.2,.1],c:"#c2542a",j:.1})}),r("crystalCluster",122,h=>{let f=["#9b7bd0","#b394e0","#8a68c4"];[[0,.42,0,.1,0],[.16,.3,.06,.07,.45],[-.15,.26,-.05,.06,-.5],[.04,.2,-.14,.055,.2]].forEach(([u,g,_,m,p],S)=>h.add(is(an(m,g,5).toNonIndexed(),.004,S),{p:[u,0,_],r:[p*.4,S*.8,-p],c:f[S%3],j:.06,grad:.45})),h.add(wt(.08,0,.15,10),{p:[0,.02,0],s:[1.5,.4,1.4],c:"#cfc19e",j:.06})}),r("ruinColumn",123,h=>{h.add(new Xn(.3,.07,.3),{p:[0,.035,0],c:"#ddd5c2",j:.05}),h.add(It(.09,.1,.52,e?9:6),{p:[0,.07,0],c:"#e4dcc8",j:.05,grad:.25}),h.add(new Xn(.24,.06,.24),{p:[0,.6,0],c:"#d5ccb6",j:.05}),h.add(It(.09,.1,.26,6),{p:[.34,.05,.14],r:[0,0,1.35],c:"#d5ccb6",j:.06})}),r("wheat",124,h=>{let f=e?7:5;for(let u=0;u<f;u++){let g=u*2.1,_=.08+u%2*.08,m=Math.cos(g)*.045,p=Math.sin(g)*.045;h.add(It(.008,.006,.42,3),{p:[m,0,p],r:[Math.sin(g)*_,0,-Math.cos(g)*_],c:"#c9a83e"}),h.add(an(.028,.14,4),{p:[m+Math.cos(g)*.42*_*.9,.4,p+Math.sin(g)*.42*_*.9],r:[Math.sin(g)*_,0,-Math.cos(g)*_],c:u%2?"#e0b93c":"#d4ab34",j:.07})}}),t}function lf(){let i=[],e=[];for(let r=0;r<=3;r++){let o=r/3,a=.5*(1-o*.92);i.push(-a*.07,o*1,0,a*.07,o*1,0)}for(let r=0;r<3;r++){let o=r*2;e.push(o,o+1,o+2,o+1,o+3,o+2)}let s=new vt;return s.setAttribute("position",new nt(i,3)),s.setIndex(e),s.computeVertexNormals(),s}var Is=(i,e,t)=>{let n=Math.sin(i*127.1+e*311.7+t*74.7)*43758.5453;return n-Math.floor(n)},Nh=(i,e,t)=>{let n=Math.floor(i),s=Math.floor(e),r=i-n,o=e-s,a=r*r*(3-2*r),c=o*o*(3-2*o),l=Is(n,s,t),d=Is(n+1,s,t),h=Is(n,s+1,t),f=Is(n+1,s+1,t);return l+(d-l)*a+(h-l)*c+(l-d-h+f)*a*c},zx=(i,e,t=0)=>(Nh(i*.9,e*.9,t)-.5)*.5+(Nh(i*2.4,e*2.4,t+3)-.5)*.25,kx=["#a97c52","#946a45","#7b5738","#5f432c"];function Sr(i,e,{K:t=6,top:n="#8fbf63",top2:s="#7aae55",bevel:r=.06,noise:o=.03,seed:a=1,strata:c=kx,colorJitter:l=.08}={}){let d=[],h=[],f=new Me(n),u=new Me(s),g=new Me,_=Math.min(r*i,.12),m=i-_*1.2,p=[Math.cos(Math.PI/6),Math.sin(Math.PI/6)],S=[0,1],w=(F,V)=>`${F},${V}`,x=new Map;for(let F=-t;F<=t;F++)for(let V=-t;V<=t;V++){if(Math.abs(F+V)>t)continue;let $=(F*p[0]+V*S[0])*(m/t),q=(F*p[1]+V*S[1])*(m/t),ne=Math.max(Math.abs(F),Math.abs(V),Math.abs(F+V))/t,G=Math.max(0,1-Math.pow(ne,3)),he=e+(ne>=1?0:zx($+a*17,q-a*5,a)*o*G*2),ge=Nh($*.8+9,q*.8+4,a+11),ue=1+(Is(F,V,a)-.5)*2*l;g.copy(f).lerp(u,ge),g.multiplyScalar(ue),x.set(w(F,V),{x:$,y:he,z:q,c:g.clone()})}let A=(F,V)=>{d.push(F.x,F.y,F.z),h.push(V.r,V.g,V.b)},R=(F,V,$)=>{let q=V.x-F.x,ne=V.z-F.z,G=$.x-F.x,he=$.z-F.z,ge=ne*G-q*he,ue=new Me().copy(F.c).add(V.c).add($.c).multiplyScalar(1/3);ue.multiplyScalar(1+(Is(F.x*3.1,$.z*2.7,a)-.5)*.08),ge>0?(A(F,ue),A(V,ue),A($,ue)):(A(F,ue),A($,ue),A(V,ue))};for(let F=-t;F<=t;F++)for(let V=-t;V<=t;V++){let $=x.get(w(F,V)),q=x.get(w(F+1,V)),ne=x.get(w(F,V+1)),G=x.get(w(F+1,V+1));$&&q&&ne&&R($,q,ne),q&&ne&&G&&R(q,G,ne)}let L=(F,V,$,q)=>{let ne=Math.PI/6+F*Math.PI/3;return{x:Math.cos(ne)*V,y:$,z:Math.sin(ne)*V,c:new Me(q)}},N=f.clone().multiplyScalar(.82),b=(F,V,$,q,ne)=>{let G=[F,V,$,q].map(ue=>({...ue,c:new Me(ne)})),he=(ue,Xe,Ke)=>{let mt=Xe.x-ue.x,je=Xe.y-ue.y,Q=Xe.z-ue.z,ee=Ke.x-ue.x,Ee=Ke.y-ue.y,$e=Ke.z-ue.z,Ue=je*$e-Q*Ee,st=mt*Ee-je*ee,dt=(ue.x+Xe.x+Ke.x)/3,U=(ue.z+Xe.z+Ke.z)/3;return Ue*dt+st*U>0},ge=(ue,Xe,Ke)=>{let mt=1+(Is(ue.x*5,ue.y*7+Ke.z,a)-.5)*.12,je=new Me(ne).multiplyScalar(mt);he(ue,Xe,Ke)?(A(ue,je),A(Xe,je),A(Ke,je)):(A(ue,je),A(Ke,je),A(Xe,je))};ge(G[0],G[1],G[2]),ge(G[0],G[2],G[3])},y=e-_,C=[y,y*.72,y*.44,y*.2,0];for(let F=0;F<6;F++){let V=L(F,m,e),$=L(F+1,m,e),q=L(F,i,y),ne=L(F+1,i,y);b(V,$,ne,q,N.getStyle());for(let G=0;G<4;G++)b(L(F,i,C[G]),L(F+1,i,C[G]),L(F+1,i,C[G+1]),L(F,i,C[G+1]),c[G])}let B=new vt;return B.setAttribute("position",new nt(d,3)),B.setAttribute("color",new nt(h,3)),B.computeVertexNormals(),B}function rs(i,e){let t=new cr,n=new ys;for(let r=0;r<6;r++){let o=Math.PI/6+r*Math.PI/3,a=r?"lineTo":"moveTo";t[a](Math.cos(o)*i,Math.sin(o)*i),n[a](Math.cos(o)*(i-e),Math.sin(o)*(i-e))}t.closePath(),n.closePath(),t.holes.push(n);let s=new uo(t);return s.rotateX(-Math.PI/2),s}var Gl=(i,e,t)=>({x:t*Math.sqrt(3)*(i+e/2),z:t*1.5*e}),wo=(i,e,t)=>Math.abs(i)<=t*Math.sqrt(3)/2&&Math.abs(e)+Math.abs(i)/Math.sqrt(3)<=t;var Hx={desktop:{name:"desktop",detail:1,shadows:!0,dpr:1.75,K:8,cellK:5,trailK:14,plants:30,grass:420,trailPlants:70,trailGrass:1300,creatures:10,pollen:150,clouds:6,fov:34},mobile:{name:"mobile",detail:0,shadows:!1,dpr:1.5,K:4,cellK:3,trailK:7,plants:11,grass:70,trailPlants:22,trailGrass:240,creatures:3,pollen:0,clouds:0,fov:38}},cf="#c65d3b",Tn=.55,Fh=.14,Wl=3.15,Xl=1,To=6.8,br=.8,ql=1.12,hf=.2,Vx=[[0,0],[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],Gx=[0,1,3,5,2,4,6],Ni=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),Bh=i=>(i=Ni(i),i*i*(3-2*i)),Mn=i=>String(i).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Vn=6,Oh=3,uf=[[1,0],[0,1],[1,0],[1,-1],[1,0],[0,1]],Wx={meadow:{sig:["tree","blossomTree","tree"],mid:["bush","flowerPink","flowerBlue","flowerYellow"],low:["flowerPink","flowerYellow","flowerWhite","flowerBlue"],lesson:"tree",flower:"flowerPink"},forest:{sig:["pine","forestTree","pine"],mid:["fern","fern","bush"],low:["mushroom","fern","rock","mushroom"],lesson:"pine",flower:"mushroom"},orchard:{sig:["appleTree","appleTree"],mid:["herbBush","berryBush","sunflower"],low:["carrot","carrot","carrot","flowerWhite"],lesson:"appleTree",flower:"carrot"},mesa:{sig:["cactus","cactus"],mid:["agave","redRock","agave"],low:["flowerOrange","redRock","flowerOrange"],lesson:"cactus",flower:"flowerOrange"},lavender:{sig:["sunflower","sunflower"],mid:["lavender","lavender","lavender"],low:["lavender","flowerYellow","lavender"],lesson:"sunflower",flower:"lavender"},pond:{sig:["reed","reed","blossomTree"],mid:["reed","flowerWhite","bush"],low:["flowerWhite","flowerBlue","reed"],lesson:"lotus",flower:"flowerWhite"},alpine:{sig:["snowPine","snowPine","pine"],mid:["rock","bush","snowPine"],low:["flowerWhite","rock","flowerBlue"],lesson:"snowPine",flower:"flowerWhite"}},df={tree:[.62,.85],blossomTree:[.6,.8],forestTree:[.6,.85],appleTree:[.58,.8],pine:[.62,.9],snowPine:[.6,.85],cactus:[.7,1],sunflower:[.8,1.1],reed:[.9,1.25]};function Yl(i,e,t,n,s){let r=[];for(let o=0;r.length<e&&o<e*40;o++){let a=(i()*2-1)*s,c=(i()*2-1)*s;t(a,c)&&(n>0&&r.some(l=>(l[0]-a)**2+(l[1]-c)**2<n*n)||r.push([a,c]))}return r}var Ao=class{constructor(e,t,n){this.species=e,this.mat=t,this.cast=n,this.items={},this.meshes=[],this.dummy=new Vt}add(e,t){(this.items[e]||=[]).push(t)}build(e){for(let[t,n]of Object.entries(this.items)){let s=new ir(this.species[t],this.mat,n.length);s.castShadow=this.cast,s.receiveShadow=!0,s.frustumCulled=!1,n.forEach((r,o)=>s.setColorAt(o,r.tint||new Me(1,1,1))),s.instanceColor.needsUpdate=!0,s.userData.list=n,this.meshes.push(s),e.add(s)}}update(e){let t=this.dummy;for(let n of this.meshes){let s=n.userData.list;for(let r=0;r<s.length;r++){let o=s[r],a=e.get(o.key)??0,c=Bh((a-o.thr)/o.w);o.inv&&(c=1-c);let l=o.min!=null?o.min+(1-o.min)*c:c,d=o.s*Math.max(l*(o.grow?.65+.35*Ni(a):1),1e-4);t.position.set(o.x,o.y,o.z),t.rotation.set(0,o.rot,0),t.scale.set(d,d,d),t.updateMatrix(),n.setMatrixAt(r,t.matrix)}n.instanceMatrix.needsUpdate=!0}}dispose(){this.meshes.forEach(e=>{e.parent?.remove(e),e.dispose()})}};function ff({container:i,profile:e,state:t,reduced:n=!1,themeShape:s=null,displayProgress:r=null,groupFocus:o=!1,compact:a=!1,world:c=null}){let l=typeof e=="string"?Hx[e]:e,d=l.name==="mobile",h=c?.groups||Ph,f=c?.noun||"group",u=c?.centers||Ih,g=c?.styleOf||(()=>null),_=(E,P)=>{let H=g(P)?.ground;return H?{top:H.top||E.top,top2:H.top2||E.top2}:E},m=(E,P)=>g(P)?.mix||Wx[E.terrain],p=a?h:of,S=E=>a?new I(u[E][0],Tn,u[E][1]):dt[E].center,w=E=>a?Array.from({length:6},(P,H)=>[1.38*Math.cos(Math.PI/6+H*Math.PI/3),1.38*Math.sin(Math.PI/6+H*Math.PI/3)]):Ch[E],x=document.createElement("div");x.className=`lg-root ${d?"lg-mobile":"lg-desktop"}`,x.innerHTML=`<canvas class="lg-canvas" tabindex="0" aria-label="Interactive 3D garden of learning themes. Drag to orbit, scroll or pinch to zoom, tap a hexagon to open it."></canvas>
  <div class="lg-labels" aria-hidden="true"></div><div class="lg-fade"></div>
  <nav class="lg-crumbs" aria-label="Garden location"></nav>
  <div class="lg-stats" aria-label="Progress totals"></div>
  <aside class="lg-panel" aria-live="polite"><button class="lg-handle" aria-label="Expand or collapse details"><span></span></button><div class="lg-panel-body"></div></aside>
  <div class="lg-time"><button class="lg-play" aria-label="Play study timeline"></button><label class="lg-weekwrap"><span class="lg-weeklabel"></span><input class="lg-week" type="range" min="0" max="16" step="0.05" aria-label="Study week"></label><button class="lg-water" aria-label="Water the garden, advance one week"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 1.5C6 5 3.6 7 3.6 10a4.4 4.4 0 0 0 8.8 0C12.4 7 10 5 8 1.5z" fill="currentColor"/></svg><span>Water</span></button></div>
  <div class="lg-zoom"><button data-zoom="in" aria-label="Zoom in">+</button><button data-zoom="out" aria-label="Zoom out">\u2212</button></div><div class="lg-hint"></div><div class="lg-toast" role="status"></div><div class="lg-error" hidden>This garden needs WebGL. Open it in a browser with hardware acceleration enabled.</div>`,i.appendChild(x);let A=E=>x.querySelector(E),R=A(".lg-canvas"),L;try{L=new zl({canvas:R,antialias:!0,alpha:!1,powerPreference:"high-performance"})}catch{return A(".lg-error").hidden=!1,{dispose(){x.remove()},failed:!0}}L.setPixelRatio(Math.min(devicePixelRatio||1,l.dpr)),L.outputColorSpace=En,L.toneMapping=Ja,L.toneMappingExposure=1.02,l.shadows&&(L.shadowMap.enabled=!0,L.shadowMap.type=Va);let N=new nr,b=new Me("#f8eddc");N.fog=new Qr(b,70,200);let y=new xn(l.fov,1,.1,400),C=new Vl(y,R);Object.assign(C,{enableDamping:!0,dampingFactor:.08,rotateSpeed:.7,zoomSpeed:.8,minPolarAngle:.2,maxPolarAngle:1.28,screenSpacePanning:!1,enablePan:!d}),C.mouseButtons={LEFT:Yn.PAN,MIDDLE:Yn.DOLLY,RIGHT:Yn.ROTATE},C.touches={ONE:si.PAN,TWO:si.DOLLY_ROTATE},C.enableZoom=!0,C.panSpeed=1.1,C.autoRotate=!n&&!o,C.autoRotateSpeed=.35,N.add(new mo("#fff7ea","#d9ccb2",1.35));let B=new dr("#fff0d8",2.5);B.position.set(-12,20,11),l.shadows&&(B.castShadow=!0,B.shadow.mapSize.set(4096,4096),Object.assign(B.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:90}),B.shadow.bias=-4e-4,B.shadow.normalBias=.03,B.shadow.radius=3),N.add(B),N.add(B.target);let F=new dr("#cfe0ff",.55);F.position.set(14,8,-10),N.add(F);let V=new Qe(new Ci(200,24,12),new Pn({side:un,depthWrite:!1,fog:!1,uniforms:{top:{value:new Me("#bcd8ea")},mid:{value:new Me("#f9e9d3")},bot:{value:b.clone()}},vertexShader:"varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:"varying vec3 vP; uniform vec3 top,mid,bot; void main(){ float h=vP.y; vec3 c = h>0. ? mix(mid, top, pow(h,.55)) : mix(mid, bot, clamp(-h*4.,0.,1.)); gl_FragColor=vec4(c,1.); }"}));N.add(V);let $=-.95,q=new Qe(new mi(150,48).rotateX(-Math.PI/2),new Yt({color:"#eee6d8",roughness:1}));q.position.y=$,N.add(q);let ne=(()=>{let E=document.createElement("canvas");E.width=E.height=128;let P=E.getContext("2d"),H=P.createRadialGradient(64,64,8,64,64,64);H.addColorStop(0,"rgba(90,70,40,.38)"),H.addColorStop(.55,"rgba(90,70,40,.16)"),H.addColorStop(1,"rgba(90,70,40,0)"),P.fillStyle=H,P.fillRect(0,0,128,128);let Y=new Qe(new Ri(1,1).rotateX(-Math.PI/2),new zn({map:new ar(E),transparent:!0,depthWrite:!1,fog:!1}));return Y.position.y=$+.01,Y.scale.setScalar(76),N.add(Y),Y})(),G=af(l.detail),he=new Yt({vertexColors:!0,flatShading:!0,roughness:.88}),ge=lf();{let E=ge.attributes.position.count,P=new Float32Array(E*3),H=new Me("#3f7d36"),Y=new Me("#a8d466"),Z=new Me;for(let le=0;le<E;le++)Z.copy(H).lerp(Y,ge.attributes.position.getY(le)),P.set([Z.r,Z.g,Z.b],le*3);ge.setAttribute("color",new on(P,3))}let ue={uTime:{value:0}},Xe=new Yt({vertexColors:!0,side:yn,roughness:1});Xe.onBeforeCompile=E=>{E.uniforms.uTime=ue.uTime,E.vertexShader=E.vertexShader.replace("#include <common>",`#include <common>
attribute float aGrow; uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
      vec4 ip = instanceMatrix * vec4(0.,0.,0.,1.);
      float sw = sin(uTime*1.7 + ip.x*1.1 + ip.z*0.8)*0.2 + sin(uTime*2.9 + ip.x*2.3 - ip.z)*0.07;
      float hh = position.y*position.y;
      transformed.y *= aGrow;
      transformed.x += sw*hh*aGrow; transformed.z += sw*0.6*hh*aGrow;`)};let Ke=new Vt;function mt(E,P){if(!E.length)return null;let H=ge.clone(),Y=new Float32Array(E.length);H.setAttribute("aGrow",new _s(Y,1));let Z=new ir(H,Xe,E.length);return E.forEach((le,Be)=>{Ke.position.set(le.x,le.y,le.z),Ke.rotation.set(0,le.rot,0),Ke.scale.setScalar(le.s),Ke.updateMatrix(),Z.setMatrixAt(Be,Ke.matrix),Z.setColorAt(Be,le.tint)}),Z.frustumCulled=!1,Z.userData.list=E,P.add(Z),Z}function je(E,P){if(!E)return;let H=E.geometry.attributes.aGrow,Y=E.userData.list;for(let Z=0;Z<Y.length;Z++){let le=P.get(Y[Z].key)??0;H.array[Z]=.22+.78*Bh(le*1.6)*(.75+.25*Y[Z].v)}H.needsUpdate=!0}let Q=(E,P)=>s?s(E,P):E,ee=new hn;N.add(ee);let Ee=Rh,$e=Ah,Ue=[],st=[],dt=[],U=new Ao(G,he,l.shadows),St=[],Re=ss(20261028);Pt.forEach((E,P)=>{let[H,Y]=$e[P],Z=Gl(H,Y,Ee/Math.sqrt(3)),le=g(P),Be=_(E,P),Fe=new Qe(Q(Sr(Wl,Tn,{K:l.K,top:Be.top2,top2:Be.top,seed:P+1,noise:.015}),P),new Yt({vertexColors:!0,flatShading:!0,roughness:.95}));Fe.position.set(Z.x,0,Z.z),Fe.castShadow=l.shadows,Fe.receiveShadow=!0,Fe.userData.pick={kind:"theme",ti:P},ee.add(Fe),Ue.push(Fe);let ot=m(E,P),Le={ti:P,theme:E,center:new I(Z.x,Tn,Z.z),cells:[]};if(E.paths.forEach((_e,Ge)=>{let[lt,Nt]=Vx[Gx[Ge]],cn=Gl(lt,Nt,Xl*1.035),Ft=Z.x+cn.x,kt=Z.z+cn.z,Zt=new Qe(Sr(Xl,Fh,{K:l.cellK,top:"#"+new Me(Be.top).offsetHSL(0,0,.02*(Ge%3)).getHexString(),top2:Be.top2,seed:P*10+Ge+3,noise:.05,bevel:.05,colorJitter:.09}),new Yt({vertexColors:!0,flatShading:!0,roughness:.95}));Zt.position.set(Ft,Tn,kt),Zt.castShadow=l.shadows,Zt.receiveShadow=!0,Zt.userData.pick={kind:"path",ti:P,pi:Ge},ee.add(Zt),st.push(Zt);let ki=`c${P}.${Ge}`,Dn=Tn+Fh,Hi={pi:Ge,path:_e,key:ki,center:new I(Ft,Dn,kt),mesh:Zt};Le.cells.push(Hi);let Vi=E.terrain==="pond"&&!le?.noPonds,Ht=.42;if(Vi){let He=new Qe(new mi(Ht,20).rotateX(-Math.PI/2),new Yt({color:"#79bfd8",transparent:!0,opacity:.86,roughness:.12,metalness:.1}));He.position.set(Ft,Dn+.012,kt),ee.add(He);let pt=new Qe(new ur(Ht,Ht+.07,20).rotateX(-Math.PI/2),new Yt({color:"#cfc3a4",roughness:1}));pt.position.set(Ft,Dn+.014,kt),ee.add(pt);for(let Et=0;Et<3;Et++){let Dt=Et*2.2+Ge;U.add("lotus",{x:Ft+Math.cos(Dt)*.19,y:Dn+.012,z:kt+Math.sin(Dt)*.19,rot:Re()*6,s:.9+Re()*.3,thr:.15+Et*.2,w:.3,key:ki})}}let ci=(He,pt)=>wo(He,pt,.86)&&(!Vi||Math.hypot(He,pt)>Ht+.14),Un=Yl(Re,Math.round(l.plants*(le?.plantMul??1)),ci,d?.3:.21,.9);Un.forEach((He,pt)=>{let Et=pt/Math.max(1,Un.length-1),Dt=Et<.28?"sig":Et<.62?"mid":"low",Xt=ot[Dt],pn=Xt[Math.floor(Re()*Xt.length)],nn=df[pn],sn,mn,An;Dt==="sig"?(sn=nn?nn[0]+Re()*(nn[1]-nn[0]):.9,mn=.4+Re()*.5,An=.3):Dt==="mid"?(sn=(nn?nn[0]*.9:1)*(.75+Re()*.45),mn=.15+Re()*.4,An=.3):(sn=pn==="rock"||pn==="redRock"?.7+Re()*.6:.9+Re()*.5,mn=.01+Re()*.3,An=.25),U.add(pn,{x:Ft+He[0],y:Dn+.01,z:kt+He[1],rot:Re()*6.28,s:sn,thr:mn,w:An,key:ki,grow:!0,min:.14,tint:new Me().setScalar(.88+Re()*.22)})});let yi=le?.grassMul===0?[]:Yl(Re,Math.round(l.grass*(le?.grassMul??1)),(He,pt)=>wo(He,pt,.9)&&(!Vi||Math.hypot(He,pt)>Ht+.08),0,.92),Gi=new Me(le?.grassTint||Be.top);yi.forEach(He=>St.push({x:Ft+He[0],y:Dn,z:kt+He[1],s:.14+Re()*.16,rot:Re()*6.28,key:ki,v:Re(),tint:Gi.clone().offsetHSL((Re()-.5)*.03,0,(Re()-.5)*.2).addScalar(.45)}))}),le?.sheet){let _e=le.sheet;if(_e.type==="water"){let Ge=new Qe(new mi(_e.r||2.6,36).rotateX(-Math.PI/2),new Yt({color:_e.color,roughness:.14,metalness:.12}));Ge.position.set(Z.x+(_e.dx||0),Tn+.028,Z.z+(_e.dz||0)),Ge.receiveShadow=!0,ee.add(Ge)}else if(_e.type==="river"){let Ge=new Yt({color:_e.color,roughness:.14,metalness:.12});for(let lt=-2;lt<=2;lt++){let Nt=new Qe(new mi(.72,20).rotateX(-Math.PI/2),Ge);Nt.position.set(Z.x+lt*1.05,Tn+.028,Z.z+Math.sin(lt*1.1)*.55),Nt.receiveShadow=!0,ee.add(Nt)}}else if(_e.type==="rings"){let Ge=new zn({color:"#a89a76",transparent:!0,opacity:.8,depthWrite:!1});for(let lt=1;lt<=3;lt++){let Nt=new Qe(new ur(lt*.42,lt*.42+.045,40).rotateX(-Math.PI/2),Ge);Nt.position.set(Z.x+(le.landmark?.dx||0),Tn+.03,Z.z+(le.landmark?.dz||0)),ee.add(Nt)}}}if(le?.landmark){let _e=le.landmark;U.add(_e.name,{x:Z.x+_e.dx,y:Tn+.02,z:Z.z+_e.dz,rot:Re()*6.28,s:_e.s,thr:.18,w:.4,key:`c${P}.0`,grow:!0,min:.3})}dt.push(Le)}),U.build(ee);let qe=mt(St,ee),be=new hn;N.add(be);let bt=[],Ce=new Ao(G,he,l.shadows);if(a){Pt.forEach((E,P)=>{let H=g(P),Y=_(E,P),[Z,le]=u[P],Be=new Qe(Sr(1.38,Tn,{K:l.K,top:Y.top2,top2:Y.top,seed:P+1,noise:.015}),new Yt({vertexColors:!0,flatShading:!0,roughness:.95}));Be.position.set(Z,0,le),Be.castShadow=l.shadows,Be.receiveShadow=!0,Be.userData.pick={kind:"theme",ti:P},be.add(Be),bt.push(Be);let Fe=H?.sheet?.type==="water"?Math.min(1.3,H.sheet.r*.44):E.terrain==="pond"&&!H?.noPonds?.64:0;if(Fe){let ot=new Qe(new mi(Fe,20).rotateX(-Math.PI/2),new Yt({color:H?.sheet?.color||"#79bfd8",roughness:.12,metalness:.1}));ot.position.set(Z+(H?.sheet?.dx||0)*.44,Tn+.02,le+(H?.sheet?.dz||0)*.44),be.add(ot)}});for(let[E,P]of Object.entries(U.items))for(let H of P){let Y=Number(H.key.slice(1).split(".")[0]),Z=dt[Y],le=u[Y];Ce.add(E,{...H,x:le[0]+(H.x-Z.center.x)*.38,z:le[1]+(H.z-Z.center.z)*.38,y:Tn+.015,s:H.s*.68})}Ce.build(be)}let Je=new zn({color:cf,transparent:!0,opacity:.95,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:yn}),Ut=new Qe(rs(Xl,.07),Je),ft=new Qe(rs(Wl+.02,.11),Je),T=new Qe(rs(Xl,.09),Je),v=new Qe(rs(ql,.08),Je);[Ut,ft,T,v].forEach(E=>{E.visible=!1,E.renderOrder=5,N.add(E)}),t.group=t.group==null||t.group<0?-1:t.group%p.length;let k=null;o&&(k=document.createElement("div"),k.className="lg-grpnav",k.innerHTML='<button data-grp="prev" aria-label="Previous group">\u2039</button><button class="lg-worldchip" data-grp="all"></button><button data-grp="next" aria-label="Next group">\u203A</button>',x.appendChild(k));function K(E,P=900){t.group=(E%p.length+p.length)%p.length,j.level!=="garden"&&(j.level="garden",j.ti=j.pi=j.lesson=-1,M()),O(),Jn(),en(Qt(),P)}function ie(E=900){t.group=-1,Jn(),j.level==="garden"&&en(Qt(),E)}function J(){if(!k)return;k.style.display=j.level==="garden"?"":"none";let E=k.querySelector(".lg-worldchip"),P=j.level==="garden"&&t.group>=0;x.classList.toggle("group-focused",P),E.textContent=P?`${p[t.group].name} \xB7 all themes`:`Pick a ${f} to focus`,k.classList.toggle("focused",P)}let Ne=new hn;if(N.add(Ne),l.clouds){let E=new Yt({color:"#ffffff",roughness:1,flatShading:!0,transparent:!0,opacity:.92}),P=ss(77);for(let H=0;H<l.clouds;H++){let Y=new hn,Z=4+Math.floor(P()*3);for(let le=0;le<Z;le++){let Be=new Qe(new ii(1.6+P()*1.6,1),E);Be.position.set((le-Z/2)*2.1,P()*.8,(P()-.5)*2),Be.scale.y=.55,Y.add(Be)}Y.position.set((P()-.5)*90,15+P()*7,-20-P()*45),Y.userData.v=.25+P()*.3,Ne.add(Y)}}let ce=new hn;N.add(ce);let De=new vt().setFromPoints([new I(0,0,0),new I(.16,.09,.05),new I(.12,-.08,.04)]).setIndex([0,1,2,0,2,1]),Ae=ss(5);for(let E=0;E<l.creatures;E++){let P=new hn,H=["#f2a65a","#f5d36b","#e98a9f","#f6f1e4","#8fb8e8"][E%5],Y=new zn({color:H,side:yn}),Z=new Qe(De,Y),le=new Qe(De,Y);le.scale.x=-1,P.add(Z,le),P.userData={wl:Z,wr:le,ph:Ae()*10,rad:1.2+Ae()*2.2,sp:.35+Ae()*.35,off:Ae()*6.28,h:.9+Ae()*1,scale:.8+Ae()*.5},ce.add(P)}let oe=null;if(l.pollen){let E=l.pollen,P=new Float32Array(E*3),H=ss(9);for(let Y=0;Y<E;Y++)P.set([(H()-.5)*22,H()*4,(H()-.5)*22],Y*3);oe=new to(new vt().setAttribute("position",new on(P,3)),new or({color:"#fff0b8",size:.07,transparent:!0,opacity:.75,depthWrite:!1})),oe.frustumCulled=!1,N.add(oe)}let xe=d?140:420,We=new Float32Array(xe*6),Pe=new Float32Array(xe*3);{let E=ss(3);for(let P=0;P<xe;P++)Pe.set([(E()-.5)*2,E(),(E()-.5)*2],P*3)}let me=new eo(new vt().setAttribute("position",new on(We,3)),new rr({color:"#4f9fe0",transparent:!0,opacity:.65,depthWrite:!1}));me.frustumCulled=!1,me.visible=!1,N.add(me);let Oe=new Map(Object.entries(r||{})),D=null,se=null,de=E=>{if(E[0]==="c"){let[H,Y]=E.slice(1).split(".").map(Number);return Ui(t.week,Pt[H].paths[Y])}if(!D)return 0;let P=Ui(t.week,D.path);return E==="T"?P:Ni(P*D.n-Number(E.slice(1)),0,1)},we=(E,P)=>Oe.get(`c${E}.${P}`)??0,re=(E,P)=>{let H=E.lessons.length,Y=P*H,Z=Math.min(H,Math.floor(Y+1e-6)),le=Y-Z;return{n:H,cur:Z,cards:Z>=H?Vn:Math.round(le*Vn),done:Z>=H}};function te(){let E=0,P=0,H=0,Y=0;return Pt.forEach(Z=>Z.paths.forEach(le=>{let Be=Ui(t.week,le),Fe=re(le,Be);Y++,Be>0&&H++,E+=Fe.cur*Vn+(Fe.done?0:Fe.cards),P+=Math.round((Fe.cur*Oh+(Fe.done?0:Math.floor(Fe.cards/2)))*.82)})),{drops:E,carrots:P,started:H,paths:Y}}let Ie=[new Me(1,1,1),new Me(.95,.9,.78),new Me(.83,.79,.68)];function Ze(){se&&(se.traverse(E=>{E.geometry?.dispose?.(),E.userData.own&&E.material?.dispose?.()}),D?.plants.dispose(),N.remove(se),se=null,D=null,[...Oe.keys()].filter(E=>E[0]==="T"||E[0]==="L").forEach(E=>Oe.delete(E)))}function yt(E,P){Ze();let H=Pt[E],Y=H.paths[P],Z=Y.lessons.length,le=m(H,E),Be=_(H,E),Fe=ss(E*100+P*7+1),ot=new hn,Le=br,_e=br+hf,Ge=new Qe(Sr(To,br,{K:l.trailK,top:Be.top,top2:Be.top2,seed:E*10+P+40,noise:.45,bevel:.04,colorJitter:.07}),new Yt({vertexColors:!0,flatShading:!0,roughness:.95}));Ge.rotation.y=Math.PI/6,Ge.castShadow=l.shadows,Ge.receiveShadow=!0,Ge.userData.own=!0,ot.add(Ge);let lt=[[0,0]];for(let He=1;He<Z;He++){let pt=uf[(He-1)%uf.length];lt.push([lt[He-1][0]+pt[0],lt[He-1][1]+pt[1]])}let Nt=lt.map(([He,pt])=>Gl(He,pt,ql*1.06)),cn=(Math.min(...Nt.map(He=>He.x))+Math.max(...Nt.map(He=>He.x)))/2,Ft=(Math.min(...Nt.map(He=>He.z))+Math.max(...Nt.map(He=>He.z)))/2,kt=new Ao(G,he,l.shadows),Zt=[],ki=rs(ql*1,.075),Dn=new mi(.068,12).rotateX(-Math.PI/2),Hi=le.lesson,Vi={tree:.85,pine:.9,snowPine:.9,appleTree:.85,cactus:1.05,lotus:1.25,sunflower:1.15}[Hi]||1;Nt.forEach((He,pt)=>{let Et=He.x-cn,Dt=He.z-Ft,Xt=new Qe(Sr(ql,hf,{K:l.cellK,top:Be.top,top2:Be.top2,seed:E*13+P*5+pt+90,noise:.05,bevel:.05,colorJitter:.07}),new Yt({vertexColors:!0,flatShading:!0,roughness:.95}));Xt.position.set(Et,Le,Dt),Xt.castShadow=l.shadows,Xt.receiveShadow=!0,Xt.userData={pick:{kind:"lesson",i:pt},own:!0},ot.add(Xt);let pn=new Qe(ki,new zn({color:"#b9b3a2",transparent:!0,opacity:.9,depthWrite:!1,side:yn}));pn.position.set(Et,_e+.03,Dt),pn.userData.own=!0,ot.add(pn);let nn=[],sn=[];for(let An=0;An<Vn;An++){let Ir=new zn({color:"#e9e1cd"}),ls=new Qe(Dn,Ir);ls.position.set(Et+(An-(Vn-1)/2)*.21,_e+.04,Dt+.74),ls.userData.own=!0,ot.add(ls),nn.push(Ir),sn.push(ls)}let mn=`L${pt}`;kt.add(Hi,{x:Et,y:_e+.01,z:Dt-.1,rot:Fe()*6,s:Vi,thr:0,w:1,key:mn,min:.2,tint:new Me().setScalar(.96)}),kt.add("mound",{x:Et,y:_e+.01,z:Dt-.1,rot:0,s:1.3,thr:0,w:.25,key:mn,inv:!0}),kt.add("sprout",{x:Et+.1,y:_e+.02,z:Dt-.05,rot:Fe()*6,s:1.4,thr:0,w:.2,key:mn,inv:!0});for(let An=0;An<(d?3:6);An++){let Ir=An/6*6.28+pt*.7,ls=.55+An%2*.08;kt.add(le.flower,{x:Et+Math.cos(Ir)*ls,y:_e+.01,z:Dt-.1+Math.sin(Ir)*ls*.7,rot:Fe()*6,s:1.1+Fe()*.3,thr:.8+An*.025,w:.18,key:mn})}Zt.push({i:pt,pos:new I(Et,_e,Dt),ring:pn,stone:Xt,dotMat:nn})});let Ht=new hn;{let He=new Qe(new qn(.02,.02,.95,5).translate(0,.475,0),new Yt({color:"#d9cdb8",roughness:.9}));He.userData.own=!0;let pt=new vt().setFromPoints([new I(0,.95,0),new I(.36,.84,0),new I(0,.72,0)]).setIndex([0,1,2,0,2,1]);pt.computeVertexNormals();let Et=new Qe(pt,new Yt({color:"#e3a83c",roughness:.6,side:yn,emissive:"#6b4a0e",emissiveIntensity:.3}));Et.userData.own=!0;let Dt=new hn;Dt.add(He,Et),Dt.position.set(-.62,0,.42),Dt.rotation.y=.3;let Xt=document.createElement("canvas");Xt.width=Xt.height=128;let pn=Xt.getContext("2d"),nn=pn.createRadialGradient(64,64,8,64,64,64);nn.addColorStop(0,"rgba(232,179,75,.5)"),nn.addColorStop(.55,"rgba(232,179,75,.18)"),nn.addColorStop(1,"rgba(232,179,75,0)"),pn.fillStyle=nn,pn.fillRect(0,0,128,128);let sn=new Qe(new Ri(1,1).rotateX(-Math.PI/2),new zn({map:new ar(Xt),transparent:!0,depthWrite:!1}));sn.scale.setScalar(3.6),sn.position.y=.015,sn.renderOrder=4,sn.userData.own=!0;let mn=new Qe(G.flowerOrange.clone(),he);mn.scale.setScalar(1.6),mn.position.set(.3,.012,.26),mn.rotation.y=.7,Ht.add(Dt,sn,mn),Ht.userData={halo:sn,pennant:Dt}}ot.add(Ht);let ci=(He,pt)=>wo(pt,He,To-.5)&&Zt.every(Et=>(Et.pos.x-He)**2+(Et.pos.z-pt)**2>3.4);Yl(Fe,l.trailPlants,ci,d?.8:.5,To).forEach((He,pt,Et)=>{let Dt=pt/Et.length,Xt=Dt<.3?"sig":Dt<.65?"mid":"low",pn=le[Xt],nn=pn[Math.floor(Fe()*pn.length)],sn=df[nn],mn=Xt==="sig"?(sn?sn[0]+Fe()*(sn[1]-sn[0]):1)*1.35:Xt==="mid"?1.25*(.8+Fe()*.5):(nn.includes("ock")?1.2:1.5)*(.8+Fe()*.5);kt.add(nn,{x:He[0],y:Le+.03,z:He[1],rot:Fe()*6.28,s:mn,thr:Xt==="sig"?.3+Fe()*.5:Xt==="mid"?.1+Fe()*.4:Fe()*.25,w:.3,key:"T",grow:!0,tint:new Me().setScalar(.9+Fe()*.2)})}),kt.build(ot);let Un=[],yi=new Me(g(E)?.grassTint||Be.top);Yl(Fe,l.trailGrass,(He,pt)=>wo(pt,He,To-.35)&&Zt.every(Et=>(Et.pos.x-He)**2+(Et.pos.z-pt)**2>1.5),0,To).forEach(He=>Un.push({x:He[0],y:Le,z:He[1],s:.22+Fe()*.25,rot:Fe()*6.28,key:"T",v:Fe(),tint:yi.clone().offsetHSL((Fe()-.5)*.03,0,(Fe()-.5)*.2).addScalar(.45)}));let Gi=mt(Un,ot);return D={ti:E,pi:P,theme:H,path:Y,n:Z,nodes:Zt,plants:kt,grass:Gi,nextMark:Ht},N.add(ot),se=ot,ot.visible=!1,["T",...Zt.map(He=>`L${He.i}`)].forEach(He=>Oe.set(He,r?.[He]??0)),D}let j={level:"garden",ti:-1,pi:-1,lesson:-1},Gt=new Pi,$t=new I,Bt=null,Wt=!1,os=new I,as=3,Zn=(E,P)=>{let H=_r.degToRad(y.fov/2),Y=Math.atan(Math.tan(H)*y.aspect);return Math.max(E*1.08/Math.tan(Y),E*(Math.cos(P)*.9+.32)*1.12/Math.tan(H))},wr=E=>{let P=p[E].themes.map(H=>S(H));return new I(P.reduce((H,Y)=>H+Y.x,0)/P.length,.5,P.reduce((H,Y)=>H+Y.z,0)/P.length)};function Tr(E=p[t.group].themes,P=a){let H=x.clientWidth,Y=x.clientHeight,Z=x.getBoundingClientRect(),le=A(".lg-panel").getBoundingClientRect(),Be=(j.level==="garden"?k:A(".lg-stats")).getBoundingClientRect(),Fe=d||H<=900,ot=Fe?24:le.right-Z.left+30,Le=H-(Fe?24:60),_e=Be.bottom-Z.top+34,Ge=Fe?le.top-Z.top-24:Y-105,lt=Math.max(140,Le-ot),Nt=Math.max(110,Ge-_e);y.setViewOffset(H,Y,H/2-(ot+Le)/2,Y/2-(_e+Ge)/2,H,Y),y.updateProjectionMatrix();let cn=Ht=>P?S(Ht):dt[Ht].center,Ft=E.reduce((Ht,ci)=>Ht.add(cn(ci)),new I).divideScalar(E.length),kt=.95,Zt=y.position.clone().sub(C.target),ki=Math.atan2(Zt.x,Zt.z),Dn=y.clone(),Hi=8,Vi=[];E.forEach(Ht=>(P?w(Ht):Array.from({length:6},(ci,Un)=>[3.5*Math.cos(Math.PI/6+Un*Math.PI/3),3.5*Math.sin(Math.PI/6+Un*Math.PI/3)])).forEach(([ci,Un])=>{let yi=cn(Ht);for(let Gi of[0,2.5])Vi.push(new I(yi.x+ci,Gi,yi.z+Un))}));for(let Ht=0;Ht<120&&(Dn.position.setFromSpherical(new Pi(Hi,kt,ki)).add(Ft),Dn.lookAt(Ft),Dn.updateMatrixWorld(),!Vi.every(ci=>{let Un=ci.clone().project(Dn),yi=(Un.x*.5+.5)*H,Gi=(-Un.y*.5+.5)*Y;return yi>ot&&yi<Le&&Gi>_e&&Gi<Ge}));Ht++)Hi*=1.035;return{target:Ft,dist:Hi,polar:kt,pan:3}}function Qt(){if(j.level==="garden"&&o&&t.group>=0)return Tr();if(d?y.setViewOffset(x.clientWidth,x.clientHeight,0,x.clientHeight*.09,x.clientWidth,x.clientHeight):x.clientWidth>900?y.setViewOffset(x.clientWidth,x.clientHeight,-Math.min(170,x.clientWidth*.11),0,x.clientWidth,x.clientHeight):y.clearViewOffset(),y.updateProjectionMatrix(),j.level==="garden"&&a){if(!c)return{target:new I(0,.4,0),dist:Zn(14,.95),polar:.95,pan:3};let P=u.reduce((Z,le)=>Z+le[0],0)/u.length,H=u.reduce((Z,le)=>Z+le[1],0)/u.length,Y=Math.max(...u.map(([Z,le])=>Math.hypot(Z-P,le-H)))+3.6;return{target:new I(P,.4,H),dist:Zn(Y,.95),polar:.95,pan:3}}if(j.level==="garden")return{target:new I(.74,.4,-.26),dist:Zn(d?18.6:18.9,.95),polar:.95,pan:3};if(j.level==="theme"&&a)return Tr([j.ti],!1);if(j.level==="theme")return{target:dt[j.ti].center.clone().setY(.7),dist:Zn(3.9,.92),polar:.92,pan:1.6};if(j.lesson>=0&&D)return{target:D.nodes[j.lesson].pos.clone().setY(br+.45),dist:Zn(2.3,.85),polar:.85,pan:3};let E=D?Math.max(...D.nodes.map(P=>Math.abs(P.pos.x)))+1.7:5;return{target:new I(0,br+.3,0),dist:Zn(Math.max(E,3.4),.86),polar:.86,pan:4}}function Ar(E){let P=j.level==="path";C.minDistance=P?2.6:4.5,C.maxDistance=Math.max(E.dist*1.5,34),P?(os.set(0,br+.3,0),as=(D?Math.max(...D.nodes.map(H=>Math.abs(H.pos.x))):4)+2.2):(os.set(.74,.4,-.26),as=22)}function en(E,P=900,H){y.position.sub(C.target),Gt.setFromVector3(y.position),y.position.add(C.target);let Y={target:E.target.clone(),r:E.dist,phi:E.polar,theta:H??Gt.theta};if(Ar(E),n||P===0){C.target.copy(Y.target),Gt.set(Y.r,Y.phi,Y.theta),y.position.setFromSpherical(Gt).add(C.target),Bt=null;return}let Z=Y.theta-Gt.theta;Z=Math.atan2(Math.sin(Z),Math.cos(Z)),Bt={t0:performance.now(),ms:P,from:{target:C.target.clone(),r:Gt.radius,phi:Gt.phi,theta:Gt.theta},to:Y,dth:Z}}function Io(E){if(!Bt)return;let P=Ni((E-Bt.t0)/Bt.ms),H=P<.5?4*P*P*P:1-Math.pow(-2*P+2,3)/2,Y=Bt.from,Z=Bt.to;if(C.target.lerpVectors(Y.target,Z.target,H),Gt.set(Y.r+(Z.r-Y.r)*H,Y.phi+(Z.phi-Y.phi)*H,Y.theta+Bt.dth*H),y.position.setFromSpherical(Gt).add(C.target),P>=1){let le=Bt.done;Bt=null,le?.()}}C.addEventListener("change",()=>{if(Bt)return;$t.copy(C.target).sub(os);let E=$t.length();E>as&&($t.multiplyScalar((E-as)/E),C.target.sub($t),y.position.sub($t))}),C.addEventListener("start",()=>{C.autoRotate=!1,Bt=null});let Fi=new I,Lo=new I;function Do(E,P){if(y.getWorldDirection(Fi),Fi.y=0,Fi.lengthSq()<1e-6)return;Fi.normalize(),Lo.crossVectors(Fi,y.up).normalize();let H=2*y.position.distanceTo(C.target)*Math.tan(_r.degToRad(y.fov/2))/Math.max(1,x.clientHeight);$t.set(0,0,0).addScaledVector(Lo,E*H).addScaledVector(Fi,-P*H),C.target.add($t),y.position.add($t),Bt=null,C.autoRotate=!1}function Ls(E){y.position.sub(C.target);let P=Ni(y.position.length()*E,C.minDistance,C.maxDistance);y.position.setLength(P).add(C.target),Bt=null,C.autoRotate=!1}x.addEventListener("wheel",E=>{if(E.target.closest(".lg-panel"))return;E.preventDefault(),E.stopPropagation();let P=E.deltaMode===1?16:E.deltaMode===2?x.clientHeight:1;E.ctrlKey||E.metaKey?Ls(Math.exp(E.deltaY*P*.01)):Do(E.deltaX*P,E.deltaY*P)},{capture:!0,passive:!1});let Ds=A(".lg-fade");function M(){let E=j.level==="path";ee.visible=!E&&!(a&&j.level==="garden"),be.visible=a&&j.level==="garden",ne.visible=!E,se&&(se.visible=E)}let O=()=>{Ut.visible=ft.visible=v.visible=!1};function W(E=1e3){if(Wt)return;let P=()=>{j.level="garden",j.ti=j.pi=j.lesson=-1,T.visible=!1,O(),M(),en(Qt(),E,.35),Jn()};j.level==="path"?ae(P):P()}function X(E,P=1e3){if(Wt)return;let H=()=>{j.level="theme",j.ti=E,j.pi=j.lesson=-1,T.visible=!1,O(),M(),Jn(),en(Qt(),P)};j.level==="path"?ae(H):H()}function z(E,P){if(Wt)return;j.ti=E,j.pi=P,j.level="theme",j.lesson=-1,O();let H=dt[E].cells[P];T.position.set(H.center.x,H.center.y+.03,H.center.z),T.visible=!0,Wt=!0,Jn();let Y=()=>{Ds.classList.add("on"),setTimeout(()=>{yt(E,P),j.level="path",T.visible=!1,M(),Bt=null;let Z=Qt();en({...Z,dist:Z.dist*.75},0,.1),en(Z,n?0:1100,.1),Ds.classList.remove("on"),Wt=!1,Pr=!0,Jn()},n?0:360)};en({target:H.center.clone(),dist:Zn(1.3,.9),polar:.9,pan:2},n?0:750),Bt?Bt.done=Y:Y()}function ae(E){if(Wt)return;Wt=!0;let P=j.ti,H=j.pi;Ds.classList.add("on"),setTimeout(()=>{Ze(),j.level="theme",j.lesson=-1,M(),Pr=!0;let Y=dt[P].cells[H];en({target:Y.center.clone(),dist:Zn(1.3,.9),polar:.9,pan:2},0),Ds.classList.remove("on"),Wt=!1,E?.()},n?0:340)}function ye(E){j.level!=="path"||!D||(j.lesson=j.lesson===E?-1:E,en(Qt(),800),Jn())}function Te(){Wt||(j.level==="path"?j.lesson>=0?(j.lesson=-1,en(Qt(),700),Jn()):ae(()=>{en(Qt(),900),Jn()}):j.level==="theme"&&W())}let Se=new go,Ve=new fe,Ye=null,ze=()=>Wt?[]:j.level==="path"?D?D.nodes.map(E=>E.stone):[]:a&&j.level==="garden"?bt:[...st,...Ue];function rt(E,P){let H=R.getBoundingClientRect();Ve.set((E-H.left)/H.width*2-1,-((P-H.top)/H.height)*2+1),Se.setFromCamera(Ve,y);let Y=Se.intersectObjects(ze(),!1)[0];return Y?Y.object.userData.pick:null}function gt(E){let P=E?`${E.kind}.${E.ti??""}.${E.pi??""}.${E.i??""}`:null;if(P===Ye||(Ye=P,O(),R.style.cursor=E?"pointer":"grab",R.title=E?.ti!=null?Pt[E.ti].title:"",!E))return;let H=Y=>{if(a&&j.level==="garden"){ft.geometry.dispose(),ft.geometry=rs(1.4,.07);let[le,Be]=u[Y];ft.position.set(le,Tn+.02,Be),ft.visible=!0;return}s&&(ft.geometry.dispose(),ft.geometry=Q(rs(Wl+.02,.11),Y));let Z=dt[Y];ft.position.set(Z.center.x,Tn+Fh*.4,Z.center.z),ft.visible=!0};if(E.kind==="lesson"){let Y=D.nodes[E.i];v.position.set(Y.pos.x,Y.pos.y+.05,Y.pos.z),v.visible=!0}else if(E.kind==="theme"||j.level==="garden"||E.ti!==j.ti)H(E.ti);else{let Y=dt[E.ti].cells[E.pi].center;Ut.position.set(Y.x,Y.y+.03,Y.z),Ut.visible=!0}}function Lt(E){if(E){if(j.level==="path"){E.kind==="lesson"&&ye(E.i);return}if(j.level==="garden"||E.ti!==j.ti)return X(E.ti);E.kind==="path"&&z(E.ti,E.pi)}}let ct=null;R.addEventListener("pointerdown",E=>{ct={x:E.clientX,y:E.clientY,t:performance.now()}}),R.addEventListener("pointerup",E=>{if(!ct)return;let P=E.clientX-ct.x,H=E.clientY-ct.y,Y=Math.hypot(P,H),Z=performance.now()-ct.t;if(ct=null,o&&j.level==="garden"&&Math.abs(P)>70&&Math.abs(P)>1.6*Math.abs(H)&&Z<500){K((t.group<0?P<0?-1:0:t.group)+(P<0?1:-1));return}Y<7&&Z<600&&Lt(rt(E.clientX,E.clientY))}),R.addEventListener("pointermove",E=>{E.pointerType==="mouse"&&!ct&&gt(rt(E.clientX,E.clientY))}),R.addEventListener("pointerleave",()=>gt(null));let _t=E=>{if(!(!x.isConnected||E.target.matches?.("input")))if(E.key==="Escape"||E.key==="Backspace")Te(),E.preventDefault();else if(/^[1-9]$/.test(E.key)&&j.level!=="path"&&Pt[Number(E.key)-1])X(Number(E.key)-1);else if(E.key.startsWith("Arrow")){if(o&&j.level==="garden"&&(E.key==="ArrowLeft"||E.key==="ArrowRight")){K((t.group<0?E.key==="ArrowRight"?-1:0:t.group)+(E.key==="ArrowRight"?1:-1)),E.preventDefault();return}let P=60;Do(E.key==="ArrowLeft"?-P:E.key==="ArrowRight"?P:0,E.key==="ArrowUp"?-P:E.key==="ArrowDown"?P:0),E.preventDefault()}else E.key==="+"||E.key==="="?Ls(.85):(E.key==="-"||E.key==="_")&&Ls(1.18)};addEventListener("keydown",_t);let ke=A(".lg-crumbs"),Tt=A(".lg-panel-body"),at=A(".lg-stats"),dn=A(".lg-labels"),ai=A(".lg-toast"),fn=A(".lg-panel"),li=A(".lg-week"),At=A(".lg-weeklabel"),Sn=A(".lg-play"),tn={drop:'<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M8 1.5C6 5 3.6 7 3.6 10a4.4 4.4 0 0 0 8.8 0C12.4 7 10 5 8 1.5z" fill="#3f8fd2"/></svg>',carrot:'<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 13.2C4 9 8 5.4 11 5.8c.5 3-2.6 7.6-8 7.4z" fill="#f08a24"/><path d="M10.2 5.4 11.4 2m-.2 3.8L14 4m-3.2 2.6L14.2 7" stroke="#5ea84a" stroke-width="1.5" stroke-linecap="round"/></svg>',play:'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',pause:'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5h3v11H4zm5 0h3v11H9z" fill="currentColor"/></svg>',replay:'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 2.5a5.5 5.5 0 1 0 5.4 6.5h-1.7A3.8 3.8 0 1 1 8 4.2c1 0 1.9.4 2.6 1L8.7 7H14V1.7l-1.8 1.8A5.500 5.500 0 0 0 8 2.5z" fill="currentColor"/></svg>'},zt=(E,P)=>Array.from({length:E},(H,Y)=>`<i class="dot ${Y<P?"on":""}"></i>`).join(""),ln=E=>`${Math.round(E*100)}%`,Oi=E=>{ai.textContent=E,ai.classList.add("on"),clearTimeout(Oi.t),Oi.t=setTimeout(()=>ai.classList.remove("on"),2600)};function xi(){let E=H=>j.level===H?' aria-current="page"':"",P=j.level!=="garden"?'<button class="lg-back" data-go="back" aria-label="Back">\u2039</button>':"";P+=`<button data-go="garden"${E("garden")}>Garden</button>`,j.level!=="garden"&&(P+=`<span class="sep">\u203A</span><button data-go="theme"${E("theme")}>${Mn(Pt[j.ti].title)}</button>`),j.level==="path"&&(P+=`<span class="sep">\u203A</span><button data-go="path"${E("path")}>${Mn(Pt[j.ti].paths[j.pi].title)}</button>`),ke.innerHTML=P}function zh(){let E="";if(j.level==="garden"){let P=o&&t.group>=0?p[t.group]:null,H=P?P.themes.map(Y=>Pt[Y]):a?h.flatMap(Y=>Y.themes.map(Z=>Pt[Z])):Pt;E=`<p class="eyebrow">Little Grains \xB7 sample garden</p><h2>${P?Mn(P.name):"The Garden"}</h2><p class="lede">${P?"Focused world; the rest of the garden blurs into the background. ":""}${a?"One hexagon per theme, arranged in related groups. Select a hexagon to reveal all its learning paths.":s?"Each land follows the footprint of its learning paths. The scenery, lessons and controls are unchanged.":"Each hexagon is a theme. Walk into one to find a hexagon per learning path, then follow its tiles lesson by lesson."}</p><ul class="lg-list">`+H.map(Y=>{let Z=Pt.indexOf(Y),le=Y.paths.filter(ot=>Ui(t.week,ot)>0).length,Be=Y.paths.reduce((ot,Le)=>ot+Ui(t.week,Le),0)/Y.paths.length,Fe=a&&!P?h.find(ot=>ot.themes[0]===Z):null;return`${Fe?`<li class="group-list-title">${Mn(Fe.name)}</li>`:""}<li><button data-theme="${Z}"><span class="sw" style="background:${_(Y,Z).top}"></span><span class="tt"><b>${Mn(Y.title)}</b><small>${le}/${Y.paths.length} paths started</small></span><span class="bar"><i style="width:${ln(Be)}"></i></span></button></li>`}).join("")+"</ul>"}else if(j.level==="theme"){let P=Pt[j.ti];E=`<p class="eyebrow">Theme garden</p><h2>${Mn(P.title)}</h2><p class="lede">${Mn(P.blurb)} One hexagon per learning path; one dot per lesson, filled once completed.</p><ul class="lg-list">`+P.paths.map((H,Y)=>{let Z=Ui(t.week,H),le=re(H,Z);return`<li><button data-path="${Y}"><span class="tt"><b>${d?`${Y+1}. `:""}${Mn(H.title)}</b><span class="dots">${zt(H.lessons.length,le.cur)}</span></span><span class="pc">${Z===0?"Not started":ln(Z)}</span></button></li>`}).join("")+"</ul>"}else if(D){let P=Ui(t.week,D.path),H=re(D.path,P),Y=j.lesson;if(E=`<p class="eyebrow">${Mn(D.theme.title)} \xB7 learning path</p><h2>${Mn(D.path.title)}</h2><p class="lede">${P===0?"Nothing planted yet. Start the first tile to see it sprout.":H.done?"Every tile has bloomed.":`${H.cur} of ${H.n} tiles bloomed. Each dot is a card; the ringed tile is next.`}</p>`,Y>=0){let Z=Ni(P*H.n-Y),le=Z>=1?"done":Z>0?"cur":"todo",Be=le==="done"?Vn:Math.round(Z*Vn);E+=`<div class="lg-lesson"><span class="chip ${le}">${le==="done"?"Bloomed":le==="cur"?"In progress":"Not started"}</span><h3>${Y+1}. ${Mn(D.path.lessons[Y])}</h3><p class="dots big">${zt(Vn,Be)}</p><p>${Be} of ${Vn} cards \xB7 ${le==="done"?Oh:Math.floor(Be/2)} of ${Oh} questions</p><button class="primary" data-start="${Y}">${le==="done"?"Review lesson":le==="cur"?"Continue":"Start lesson"}</button></div>`}E+='<ol class="lg-lessons">'+D.path.lessons.map((Z,le)=>{let Be=Ni(P*H.n-le),Fe=Be>=1?"done":Be>0?"cur":"todo";return`<li><button data-lesson="${le}" class="${Fe} ${le===Y?"sel":""}"><span class="num">${Fe==="done"?"\u2713":le+1}</span><span class="nm">${Mn(Z)}</span><span class="dots">${zt(Vn,Fe==="done"?Vn:Math.round(Be*Vn))}</span></button></li>`}).join("")+"</ol>"}Tt.innerHTML=E}function kh(){let E=te();at.innerHTML=`<span class="chip drop" title="Cards completed">${tn.drop}<b>${E.drops}</b><small>drops</small></span><span class="chip carrot" title="Questions answered correctly">${tn.carrot}<b>${E.carrots}</b><small>carrots</small></span>`+(d?"":`<span class="chip plain"><b>${E.started}</b><small>of ${E.paths} paths growing</small></span>`)}function Rr(){let E=t.week;li.value=E,At.textContent=`Demo week ${Math.floor(E)}`,Sn.innerHTML=t.playing?tn.pause:E>=16?tn.replay:tn.play,Sn.setAttribute("aria-label",t.playing?"Pause study timeline":E>=16?"Replay study timeline":"Play study timeline"),li.style.setProperty("--fill",`${E/16*100}%`)}function Jn(){x.classList.toggle("compact-overview",a&&j.level==="garden"&&(!o||t.group<0)),xi(),zh(),kh(),Rr(),J(),vf(),Pr=!0}x.addEventListener("click",E=>{let P=E.target.closest("button");if(P)if(P.dataset.go){let H=P.dataset.go;H==="garden"?W():H==="theme"?j.level==="path"?ae(()=>{en(Qt(),900),Jn()}):X(j.ti):H==="back"&&Te()}else if(P.dataset.theme)X(Number(P.dataset.theme));else if(P.dataset.path)z(j.ti,Number(P.dataset.path));else if(P.dataset.lesson)ye(Number(P.dataset.lesson));else if(P.dataset.start)Oi("Sample data: lessons open in the real Little Grains app.");else if(P.dataset.grp){let H=P.dataset.grp;H==="all"?ie():K((t.group<0?H==="next"?-1:0:t.group)+(H==="next"?1:-1))}else P.dataset.zoom?Ls(P.dataset.zoom==="in"?.8:1.25):P.classList.contains("lg-handle")?(fn.classList.toggle("open"),o&&t.group>=0&&setTimeout(()=>en(Qt(),0),280)):P.classList.contains("lg-play")?Hh():P.classList.contains("lg-water")&&Vh()}),li.addEventListener("input",()=>{t.playing=!1,t.week=Ni(Number(li.value),0,16),zi=Math.max(zi,.8),Rr()});function Hh(){!t.playing&&t.week>=16&&(t.week=0),t.playing=!t.playing,t.playing&&(zi=1),Rr()}function Vh(){t.playing=!1,t.week=Math.min(16,Math.floor(t.week)+1),zi=1.8,Rr(),Oi(`Week ${Math.floor(t.week)}: the garden drinks.`)}let Uo=[];function vf(){dn.innerHTML="",Uo=[];let E=(P,H,Y,Z={})=>{let le=document.createElement("div");le.className=`lg-label ${P}`,le.innerHTML=H,dn.appendChild(le),Uo.push({el:le,anchor:Y,...Z})};j.level==="garden"&&dt.forEach((P,H)=>{o&&t.group>=0&&!p[t.group].themes.includes(H)||E("theme",`<b>${Mn(P.theme.title)}</b>${d?"":'<span class="dots"></span>'}`,(a?new I(u[H][0],Tn,u[H][1]):P.center.clone()).add(new I(0,a?1.2:1.45,a?.6:Wl*.62)),{ti:H,dots:!0})}),a&&j.level==="garden"&&(!o||t.group<0)&&h.forEach(P=>E("group-name",Mn(P.name),new I(P.center[0],.8,P.center[1]-3.2))),j.level==="theme"&&dt[j.ti].cells.forEach((P,H)=>d?E("lesson",`<i class="n">${H+1}</i>`,P.center.clone().add(new I(0,.85,.28))):E("cell",`<b>${Mn(P.path.title)}</b><span class="dots"></span>`,P.center.clone().add(new I(0,.85,.28)),{ti:j.ti,pi:H,dots:!0,cell:!0})),j.level==="path"&&D&&D.nodes.forEach(P=>E("lesson",`<i class="n">${P.i+1}</i>${d?"":`<b>${Mn(D.path.lessons[P.i])}</b>`}`,P.pos.clone().add(new I(0,d?1.35:1.5,0)),{i:P.i}))}let Gh=A(".lg-hint");Gh.textContent=d?"Drag to move \xB7 pinch to zoom \xB7 two fingers to turn":"Scroll or drag to move \xB7 pinch or ctrl+scroll to zoom \xB7 right-drag to turn",setTimeout(()=>Gh.classList.add("gone"),9e3);let Bi=new I;function Wh(){let E=x.clientWidth,P=x.clientHeight,H=[],Y=o&&t.group>=0&&j.level==="garden",Z=[];for(let le of Uo){Bi.copy(le.anchor).project(y);let Be=Bi.z<1&&Math.abs(Bi.x)<1.1&&Math.abs(Bi.y)<1.1&&!Wt;if(Be&&!le.el.classList.contains("group-name")&&j.level==="garden"&&!(o&&t.group>=0)){let Fe=(Bi.x*.5+.5)*E,ot=(-Bi.y*.5+.5)*P;H.some(([Le,_e])=>Math.abs(Le-Fe)<108&&Math.abs(_e-ot)<34)?Be=!1:H.push([Fe,ot])}if(le.el.style.opacity=Be?1:0,Be){let Fe=(Bi.x*.5+.5)*E,ot=(-Bi.y*.5+.5)*P;if(Y){let Le=le.el.offsetWidth,_e=le.el.offsetHeight;Fe=Ni(Fe,Le/2+12,E-Le/2-12);let Ge=[0,-30,30,-60,60,-90,90];for(let lt of Ge){let Nt=ot+lt,cn={l:Fe-Le/2-3,r:Fe+Le/2+3,t:Nt-_e-3,b:Nt+3};if(Z.every(Ft=>cn.r<Ft.l||cn.l>Ft.r||cn.b<Ft.t||cn.t>Ft.b)){ot=Nt,Z.push(cn);break}}}le.el.style.transform=`translate(-50%,-100%) translate(${Fe.toFixed(1)}px,${ot.toFixed(1)}px)`}}}function Mf(){for(let E of Uo){if(E.dots){let P=E.el.querySelector(".dots");if(!P)continue;if(E.cell){let H=Pt[E.ti].paths[E.pi],Y=re(H,we(E.ti,E.pi)),Z=`${Y.cur}/${Y.n}`;E.k!==Z&&(E.k=Z,P.innerHTML=zt(Y.n,Y.cur))}else{let H=Pt[E.ti],Y=H.paths.filter((Z,le)=>we(E.ti,le)>.004).length;E.k!==Y&&(E.k=Y,P.innerHTML=zt(H.paths.length,Y))}}if(E.i!=null&&D){let P=de(`L${E.i}`);E.el.dataset.state=P>=.995?"done":P>.01?"cur":"todo"}}}let Kn=null,Cr=null,Xh=new Ss(-1,1,1,-1,0,1),Zl=new nr,Jl=new Qe(new Ri(2,2));Zl.add(Jl);let Kl=new Pn({depthTest:!1,depthWrite:!1,uniforms:{tScene:{value:null},tSharp:{value:null},tDepth:{value:null},uStep:{value:new fe},uFinal:{value:!1},uInvProj:{value:new ut},uWorld:{value:new ut},uCenters:{value:dt.map((E,P)=>{let H=S(P);return new fe(H.x,H.z)})},uSelected:{value:new Ct},uFifth:{value:-1}},vertexShader:"varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`
      #include <common>
      varying vec2 vUv; uniform sampler2D tScene,tSharp,tDepth; uniform vec2 uStep,uCenters[20];
      uniform mat4 uInvProj,uWorld; uniform vec4 uSelected; uniform float uFifth; uniform bool uFinal;
      void main(){
        vec4 c=vec4(0.);float total=0.;
        for(int i=-12;i<=12;i++){float x=float(i),weight=exp(-x*x/32.);c+=texture2D(tScene,vUv+uStep*x)*weight;total+=weight;}c/=total;
        if(uFinal){
          float depth=texture2D(tDepth,vUv).x;
          vec4 wp=uInvProj*vec4(vUv*2.-1.,depth*2.-1.,1.); wp/=wp.w; wp=uWorld*wp;
          float best=1.e10; float id=-1.;
          for(int i=0;i<20;i++){float d=distance(wp.xz,uCenters[i]);if(d<best){best=d;id=float(i);}}
          bool selected=abs(id-uSelected.x)<.1||abs(id-uSelected.y)<.1||abs(id-uSelected.z)<.1||abs(id-uSelected.w)<.1||abs(id-uFifth)<.1;
          if(selected&&depth<.99999&&wp.y>-.1)c=texture2D(tSharp,vUv);
        }
        gl_FragColor=c;
        if(uFinal){
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      }`});function qh(){if(!(o&&j.level==="garden"&&t.group>=0)){L.setRenderTarget(null),L.render(N,y);return}let E=L.getDrawingBufferSize(new fe);(!Kn||Kn.width!==E.x||Kn.height!==E.y)&&(Kn?.dispose(),Cr?.dispose(),Kn=new On(E.x,E.y),Kn.depthTexture=new xs(E.x,E.y),Cr=new On(E.x,E.y,{depthBuffer:!1}));let P=N.fog.near,H=N.fog.far,Y=y.position.distanceTo(C.target);N.fog.near=Y+40,N.fog.far=Y+200,L.setRenderTarget(Kn),L.render(N,y),N.fog.near=P,N.fog.far=H;let Z=Kl.uniforms;Jl.material=Kl,Z.tScene.value=Kn.texture,Z.uStep.value.set(1.7/E.x,0),Z.uFinal.value=!1,L.setRenderTarget(Cr),L.render(Zl,Xh),Z.tScene.value=Cr.texture,Z.tSharp.value=Kn.texture,Z.tDepth.value=Kn.depthTexture,Z.uInvProj.value.copy(y.projectionMatrixInverse),Z.uWorld.value.copy(y.matrixWorld),Z.uSelected.value.fromArray(p[t.group].themes),Z.uFifth.value=p[t.group].themes[4]??-1,Z.uStep.value.set(0,1.7/E.y),Z.uFinal.value=!0,L.setRenderTarget(null),L.render(Zl,Xh)}let No=0,Yh=performance.now(),Ln=0,zi=0,Pr=!0,jl=!0,Ql="",$h=!1,Sf=new Me("#5fa84a"),bf=new Me(cf),Ef=new Me("#b9b3a2"),wf=new Me("#3f8fd2"),Tf=new Me("#e9e1cd");function Zh(){let E=Math.max(1,x.clientWidth),P=Math.max(1,x.clientHeight);L.setSize(E,P,!1),y.aspect=E/P,d?y.setViewOffset(E,P,0,P*.09,E,P):E>900?y.setViewOffset(E,P,-Math.min(170,E*.11),0,E,P):y.clearViewOffset(),y.updateProjectionMatrix(),$h?Bt||(o&&t.group>=0?en(Qt(),0):Ar(Qt())):($h=!0,en(Qt(),0,.35))}let Jh=new ResizeObserver(()=>Zh());Jh.observe(x);function Kh(E){if(!jl)return;No=requestAnimationFrame(Kh);let P=Math.min(.05,(E-Yh)/1e3);Yh=E,Ln+=P,t.playing&&(t.week=Math.min(16,t.week+P/2.1),t.week>=16&&(t.playing=!1,zi=.4),Rr());let H=!1,Y=n?1:1-Math.exp(-P*2.6),Z=[];(ee.visible||be.visible)&&Pt.forEach((Le,_e)=>Le.paths.forEach((Ge,lt)=>Z.push(`c${_e}.${lt}`))),D&&se.visible&&(Z.push("T"),D.nodes.forEach(Le=>Z.push(`L${Le.i}`)));for(let Le of Z){let _e=de(Le),Ge=Oe.get(Le)??0,lt=_e-Ge;Math.abs(lt)>4e-4?(Oe.set(Le,Ge+lt*Y),H=!0):lt!==0&&(Oe.set(Le,_e),H=!0)}(H||Pr)&&((ee.visible||be.visible)&&(a&&Ce.update(Oe),U.update(Oe),je(qe,Oe),dt.forEach(Le=>Le.cells.forEach(_e=>{let Ge=Bh((Oe.get(_e.key)??0)*3);_e.mesh.material.color.setRGB(.8+.2*Ge,.74+.26*Ge,.6+.4*Ge)}))),D&&se.visible&&(D.plants.update(Oe),je(D.grass,Oe),D.nodes.forEach(Le=>{let _e=Oe.get(`L${Le.i}`)??0,Ge=de(`L${Le.i}`),lt=Ge>=.995?0:Ge>.01?1:2;Le.ring.material.color.copy(lt===0?Sf:lt===1?bf:Ef),Le.stone.material.color.copy(Ie[lt]);let Nt=Math.round(_e*Vn);Le.dotMat.forEach((cn,Ft)=>cn.color.copy(Ft<Nt?wf:Tf))})),kh(),Mf(),Pr=!1);let le=`${j.level}.${j.ti}.${j.pi}.${j.lesson}.${Math.floor(t.week*2)}`;if(le!==Ql&&(Ql=le,!fn.matches(":hover")||t.playing?zh():Ql=""),D&&se.visible){let Le=Math.min(D.n,Math.floor(Ui(t.week,D.path)*D.n));D.nodes.forEach(Ge=>{Ge.ring.scale.setScalar(Ge.i===Le?1+Math.sin(Ln*3)*.05:1)});let _e=D.nextMark;if(_e.visible=Le<D.n,_e.visible){let Ge=D.nodes[Le].pos;_e.position.set(Ge.x,Ge.y+.004,Ge.z),_e.userData.halo.material.opacity=.8+Math.sin(Ln*2.2)*.2,_e.userData.pennant.rotation.y=.3+Math.sin(Ln*1.4)*.12}}Je.opacity=.75+Math.sin(Ln*5)*.2,ue.uTime.value=Ln,Ne.children.forEach(Le=>{Le.position.x+=Le.userData.v*P,Le.position.x>60&&(Le.position.x=-60)});let Be=C.target,Fe=Math.min(4,y.position.distanceTo(Be)*.22);if(ce.children.forEach(Le=>{let _e=Le.userData,Ge=Ln*_e.sp+_e.off;Le.position.set(Be.x+Math.cos(Ge)*(_e.rad+Fe*.4),Be.y+_e.h+Math.sin(Ln*1.3+_e.ph)*.25,Be.z+Math.sin(Ge*1.2)*(_e.rad+Fe*.4)),Le.rotation.y=-Ge+Math.PI;let lt=Math.sin(Ln*16+_e.ph)*.9;_e.wl.rotation.z=lt,_e.wr.rotation.z=-lt,Le.scale.setScalar(_e.scale*(j.level==="garden"?1.8:1))}),oe){let Le=oe.geometry.attributes.position.array;for(let _e=0;_e<Le.length;_e+=3)Le[_e]+=Math.sin(Ln*.5+_e)*.003+.002,Le[_e+1]+=Math.sin(Ln*.7+_e*.3)*.002,Le[_e+2]+=Math.cos(Ln*.4+_e)*.002,Le[_e]>11&&(Le[_e]-=22),Le[_e+1]>4.2&&(Le[_e+1]=.3);oe.geometry.attributes.position.needsUpdate=!0}zi>0&&!t.playing&&(zi-=P);let ot=zi>0||t.playing;if(me.visible=ot,ot){let Le=Math.min(9,y.position.distanceTo(Be)*.5);for(let _e=0;_e<xe;_e++){let Ge=Pe[_e*3],lt=Pe[_e*3+1],Nt=Pe[_e*3+2],cn=((lt-Ln*.9*(.8+Ge*.2))%1+1)%1,Ft=Be.x+Ge*Le,kt=Be.z+Nt*Le,Zt=Be.y+cn*9-1;We.set([Ft,Zt,kt,Ft-.02,Zt-.34,kt],_e*6)}me.geometry.attributes.position.needsUpdate=!0}Io(E),C.update(),y.updateMatrixWorld(),Wh(),qh()}return Zh(),Jn(),M(),No=requestAnimationFrame(Kh),{root:x,view:j,state:t,prof:l,compact:a,failed:!1,camera:y,controls:C,goGarden:W,goTheme:X,goPath:z,selectLesson:ye,back:Te,water:Vh,togglePlay:Hh,setGroup:K,clearGroup:ie,stats:()=>({calls:L.info.render.calls,triangles:L.info.render.triangles,plants:U.meshes.reduce((E,P)=>E+P.count,0),grass:qe?.count||0}),ready:()=>!Wt&&!Bt,pause:()=>{jl=!1,cancelAnimationFrame(No),Io(performance.now()+1e5),C.update(),y.updateMatrixWorld(),Wh(),qh()},growthReady:()=>[...Oe.entries()].every(([E,P])=>Math.abs(de(E)-P)<4e-4),progressSnapshot:()=>Object.fromEntries(Oe),dispose(){jl=!1,cancelAnimationFrame(No),Jh.disconnect(),removeEventListener("keydown",_t),Ze(),C.dispose(),Kn?.dispose(),Cr?.dispose(),Jl.geometry.dispose(),Kl.dispose(),N.traverse(E=>{E.geometry?.dispose?.();let P=E.material;P&&(Array.isArray(P)?P:[P]).forEach(H=>{H.map?.dispose?.(),H.dispose?.()})}),L.dispose(),L.forceContextLoss?.(),x.remove()}}}var Ro=i=>Pt.findIndex(e=>e.id===i),Co=[[0,0],[1,0],[0,1],[1,-1]],Po=[{id:"forest",name:"Forest",blurb:"Dense and shaded. The one family where planting fills the hex.",themes:["nature","biology","languages","health"].map(Ro),center:[-7,-4.6],slots:Co},{id:"prairie",name:"Prairie",blurb:"Quiet fields: warm golds and sages, bloom drifts, open ground.",themes:["art","cooking","economics","mind"].map(Ro),center:[7,-4.6],slots:Co},{id:"mountains",name:"Mountains",blurb:"Snow, stone and restrained evergreens. The terrain does the talking.",themes:["sport","climate","space","mathematics"].map(Ro),center:[-7.6,3.4],slots:Co},{id:"oceans",name:"Oceans",blurb:"Water and coral. Growth is coral spreading, not trees.",themes:["ocean","technology","music","engineering"].map(Ro),center:[7.6,3.4],slots:Co},{id:"desert",name:"Desert",blurb:"Warm stone. The sparsest family; a single shape carries the hex.",themes:["geology","physics","chemistry","history"].map(Ro),center:[0,9.8],slots:Co}],pf=Array.from({length:Pt.length});Po.forEach(i=>i.themes.forEach((e,t)=>{let[n,s]=i.slots[t];pf[e]=[i.center[0]+2.65*(n+s/2),i.center[1]+2.65*Math.sqrt(3)/2*s]}));var Xx={nature:{mix:{sig:["tree","forestTree","tree"],mid:["fern","bush","fern"],low:["mushroom","fern","rock"],lesson:"tree",flower:"flowerPink"},plantMul:1.7,grassMul:1.1,landmark:{name:"tree",s:1.9,dx:-.95,dz:.55}},biology:{ground:{top:"#3f8a5c",top2:"#2f7a4c"},mix:{sig:["emergentTree","forestTree","tree"],mid:["fern","fern","flowerPink"],low:["flowerPink","mushroom","fern"],lesson:"emergentTree",flower:"flowerPink"},plantMul:1.85,grassMul:1.15,landmark:{name:"emergentTree",s:2,dx:.85,dz:-.6}},languages:{ground:{top:"#8fbf63",top2:"#7aae55"},mix:{sig:["blossomTree","tree","blossomTree"],mid:["bush","herbBush","flowerWhite"],low:["flowerPink","flowerWhite","flowerYellow"],lesson:"blossomTree",flower:"flowerPink"},plantMul:1.5,grassMul:1.1,landmark:{name:"blossomTree",s:1.7,dx:-.8,dz:-.7}},health:{ground:{top:"#9cbf7a",top2:"#8aae69"},mix:{sig:["blossomTree","appleTree"],mid:["herbBush","bush","flowerWhite"],low:["flowerWhite","flowerYellow","flowerPink"],lesson:"appleTree",flower:"flowerWhite"},plantMul:1.45,grassMul:1.05,landmark:{name:"blossomTree",s:1.55,dx:.9,dz:.65}},art:{ground:{top:"#c4a86f",top2:"#b2965e"},mix:{sig:["sunflower"],mid:["lavender","flowerOrange","flowerBlue"],low:["flowerPink","flowerOrange","flowerBlue","flowerYellow"],lesson:"sunflower",flower:"flowerOrange"},plantMul:.9,grassMul:1.25,grassTint:"#c9ab63",landmark:{name:"sunflower",s:1.8,dx:-.9,dz:.6}},cooking:{ground:{top:"#b0a45f",top2:"#9d9350"},mix:{sig:["oliveTree"],mid:["herbBush","wheat","carrot"],low:["carrot","carrot","flowerWhite"],lesson:"oliveTree",flower:"flowerWhite"},plantMul:.9,grassMul:1.1,grassTint:"#b3a556",landmark:{name:"oliveTree",s:1.7,dx:.85,dz:-.55}},economics:{ground:{top:"#cbb26a",top2:"#b8a05a"},mix:{sig:["wheat","wheat"],mid:["wheat","sunflower","wheat"],low:["wheat","flowerOrange","flowerYellow"],lesson:"wheat",flower:"flowerOrange"},plantMul:1,grassMul:1.35,grassTint:"#d8b85a",landmark:{name:"windmill",s:1.9,dx:-.85,dz:-.6}},mind:{ground:{top:"#c9bd97",top2:"#b8ab84"},noPonds:!0,mix:{sig:["standingStone"],mid:["bush","rock"],low:["pebble","rock","flowerWhite"],lesson:"standingStone",flower:"flowerWhite"},plantMul:.4,grassMul:.35,grassTint:"#bdae85",sheet:{type:"rings"},landmark:{name:"standingStone",s:1.6,dx:.55,dz:.4}},sport:{ground:{top:"#e6ecec",top2:"#ccd8d2"},mix:{sig:["snowPine","snowPine"],mid:["rock","snowPine","bush"],low:["flowerWhite","rock","flowerBlue"],lesson:"snowPine",flower:"flowerWhite"},plantMul:.6,grassMul:.4,grassTint:"#dfe8df",landmark:{name:"snowPine",s:1.9,dx:.85,dz:-.6}},climate:{ground:{top:"#d8e6ee",top2:"#bdd2de"},mix:{sig:["iceberg","snowPine"],mid:["rock","snowPine","rock"],low:["rock","pebble","flowerWhite"],lesson:"iceberg",flower:"flowerWhite"},plantMul:.5,grassMul:.3,grassTint:"#d5e2e8",landmark:{name:"iceberg",s:2,dx:-.85,dz:.55}},space:{ground:{top:"#a08bb0",top2:"#8d789c"},mix:{sig:["observatory"],mid:["rock","bush","rock"],low:["pebble","flowerWhite","rock"],lesson:"observatory",flower:"flowerWhite"},plantMul:.45,grassMul:.25,grassTint:"#9c8bac",landmark:{name:"observatory",s:1.8,dx:.8,dz:-.55}},mathematics:{ground:{top:"#a4c76a",top2:"#93b55b"},mix:{sig:["terraces","tree"],mid:["bush","flowerYellow","bush"],low:["flowerWhite","rock","flowerYellow"],lesson:"terraces",flower:"flowerYellow"},plantMul:.65,grassMul:.8,landmark:{name:"terraces",s:1.9,dx:-.85,dz:-.6}},ocean:{ground:{top:"#e6d9ae",top2:"#d6c895"},noPonds:!0,mix:{sig:["coralHead","coralHead"],mid:["coralHead","reed","coralHead"],low:["pebble","coralHead","flowerBlue"],lesson:"coralHead",flower:"flowerBlue"},plantMul:1.1,grassMul:0,sheet:{type:"water",color:"#6fbccb",r:2.92},landmark:{name:"coralHead",s:2.2,dx:-.8,dz:.6}},technology:{ground:{top:"#6f9a8a",top2:"#5d8878"},mix:{sig:["mangrove"],mid:["reed","fern","reed"],low:["reed","flowerWhite","pebble"],lesson:"mangrove",flower:"flowerWhite"},plantMul:.75,grassMul:.5,grassTint:"#6b9585",sheet:{type:"water",color:"#5f9a94",r:1.9,dx:.9,dz:.8},landmark:{name:"mangrove",s:1.9,dx:-.75,dz:-.55}},music:{ground:{top:"#97b06a",top2:"#86a05a"},mix:{sig:["blossomTree","reed"],mid:["reed","flowerBlue","bush"],low:["flowerBlue","flowerWhite","reed"],lesson:"blossomTree",flower:"flowerBlue"},plantMul:.8,grassMul:.9,sheet:{type:"river",color:"#7fc0d8"},landmark:{name:"blossomTree",s:1.6,dx:.85,dz:.6}},engineering:{ground:{top:"#8b9aa4",top2:"#77879a"},mix:{sig:["basaltColumns"],mid:["rock","bush","rock"],low:["pebble","rock","flowerYellow"],lesson:"basaltColumns",flower:"flowerYellow"},plantMul:.55,grassMul:.35,grassTint:"#8b98a2",sheet:{type:"water",color:"#5f7f8c",r:1.6,dx:-1.1,dz:.9},landmark:{name:"basaltColumns",s:1.9,dx:.85,dz:-.5}},geology:{ground:{top:"#d89a6a",top2:"#c98658"},mix:{sig:["hoodoo","cactus"],mid:["agave","redRock","agave"],low:["flowerOrange","redRock","pebble"],lesson:"hoodoo",flower:"flowerOrange"},plantMul:.5,grassMul:.35,grassTint:"#c9986a",landmark:{name:"hoodoo",s:2,dx:-.85,dz:.55}},physics:{ground:{top:"#a05a42",top2:"#8a4a36"},mix:{sig:["volcanicVent","redRock"],mid:["redRock","agave","redRock"],low:["redRock","pebble","flowerOrange"],lesson:"volcanicVent",flower:"flowerOrange"},plantMul:.45,grassMul:.25,grassTint:"#9a6248",landmark:{name:"volcanicVent",s:2,dx:.8,dz:-.6}},chemistry:{ground:{top:"#ded3b0",top2:"#cdc09c"},mix:{sig:["crystalCluster"],mid:["agave","pebble","agave"],low:["pebble","flowerWhite","agave"],lesson:"crystalCluster",flower:"flowerWhite"},plantMul:.45,grassMul:.3,grassTint:"#d6c9a4",landmark:{name:"crystalCluster",s:1.9,dx:-.8,dz:-.6}},history:{ground:{top:"#c9b183",top2:"#b89f73"},mix:{sig:["ruinColumn","tree"],mid:["bush","agave","bush"],low:["pebble","flowerYellow","rock"],lesson:"ruinColumn",flower:"flowerYellow"},plantMul:.5,grassMul:.4,grassTint:"#c2ab7d",landmark:{name:"ruinColumn",s:1.8,dx:.85,dz:.6}}},qx=i=>Xx[Pt[i].id]||null;var mf={groups:Po,centers:pf,styleOf:qx,noun:"family"};var Er=new URLSearchParams(location.search),Yx={week:Er.has("week")?Math.max(0,Math.min(16,Number(Er.get("week"))||0)):16,playing:!1,group:-1},_f=document.querySelector("#mount"),$x=matchMedia("(prefers-reduced-motion: reduce)").matches||Er.has("still"),$l=ff({container:_f,profile:innerWidth<700||Er.has("phone")?"mobile":"desktop",state:Yx,reduced:$x,compact:!0,groupFocus:!0,world:mf});window.__familyGarden=$l;Er.has("still")&&($l.controls.autoRotate=!1);var xf=[...document.querySelectorAll("[data-family]")];function yf(i,e=900){let t=Po.findIndex(n=>n.id===i);t<0?$l.clearGroup(e):$l.setGroup(t,e),xf.forEach(n=>n.setAttribute("aria-pressed",String(n.dataset.family===i))),location.hash.slice(1)!==i&&history.replaceState(null,"","#"+i)}xf.forEach(i=>i.onclick=()=>yf(i.dataset.family));var gf=location.hash.slice(1)||Er.get("family")||"all";yf(Po.some(i=>i.id===gf)?gf:"all",0);new ResizeObserver(([i])=>{_f.style.top=i.target.getBoundingClientRect().height+"px"}).observe(document.querySelector(".experiment-bar"));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
