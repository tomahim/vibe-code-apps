(()=>{var $n={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ri={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Nu=0,kc=1,Fu=2;var Hc=1,Vo=2,_i=3,Ri=0,dn=1,vn=2,Ui=0,ys=1,Vc=2,Gc=3,Wc=4,Ou=5,es=100,Bu=101,zu=102,ku=103,Hu=104,Vu=200,Gu=201,Wu=202,Xu=203,lo=204,co=205,qu=206,Yu=207,$u=208,Zu=209,Ju=210,Ku=211,ju=212,Qu=213,td=214,Go=0,Wo=1,Xo=2,vs=3,qo=4,Yo=5,$o=6,Zo=7,Xc=0,ed=1,nd=2,Ni=0,id=1,sd=2,rd=3,ad=4,od=5,ld=6,Jo=7;var qc=300,Rs=301,Cs=302,Ko=303,jo=304,xa=306,ho=1e3,ts=1001,uo=1002,Cn=1003,cd=1004;var ya=1005;var ii=1006,Qo=1007;var rs=1008;var ai=1009,Yc=1010,$c=1011,gr=1012,tl=1013,as=1014,oi=1015,_r=1016,el=1017,nl=1018,xr=1020,Zc=35902,Jc=35899,Kc=1021,jc=1022,Zn=1023,tr=1026,yr=1027,il=1028,sl=1029,Qc=1030,rl=1031;var al=1033,va=33776,Ma=33777,Sa=33778,ba=33779,ol=35840,ll=35841,cl=35842,hl=35843,ul=36196,dl=37492,fl=37496,pl=37808,ml=37809,gl=37810,_l=37811,xl=37812,yl=37813,vl=37814,Ml=37815,Sl=37816,bl=37817,El=37818,Tl=37819,wl=37820,Al=37821,Rl=36492,Cl=36494,Pl=36495,Il=36283,Dl=36284,Ll=36285,Ul=36286;var qr=2300,fo=2301,oo=2302,Ac=2400,Rc=2401,Cc=2402;var hd=3200,ud=3201;var th=0,dd=1,Fi="",Tn="srgb",Ms="srgb-linear",Yr="linear",ye="srgb";var xs=7680;var Pc=519,fd=512,pd=513,md=514,eh=515,gd=516,_d=517,xd=518,yd=519,Ic=35044;var nh="300 es",ni=2e3,$r=2001;var ui=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},_n=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],tu=1234567,Vr=Math.PI/180,er=180/Math.PI;function Ps(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(_n[i&255]+_n[i>>8&255]+_n[i>>16&255]+_n[i>>24&255]+"-"+_n[t&255]+_n[t>>8&255]+"-"+_n[t>>16&15|64]+_n[t>>24&255]+"-"+_n[e&63|128]+_n[e>>8&255]+"-"+_n[e>>16&255]+_n[e>>24&255]+_n[n&255]+_n[n>>8&255]+_n[n>>16&255]+_n[n>>24&255]).toLowerCase()}function ne(i,t,e){return Math.max(t,Math.min(e,i))}function ih(i,t){return(i%t+t)%t}function wf(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Af(i,t,e){return i!==t?(e-i)/(t-i):0}function Gr(i,t,e){return(1-e)*i+e*t}function Rf(i,t,e,n){return Gr(i,t,1-Math.exp(-e*n))}function Cf(i,t=1){return t-Math.abs(ih(i,t*2)-t)}function Pf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function If(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Df(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Lf(i,t){return i+Math.random()*(t-i)}function Uf(i){return i*(.5-Math.random())}function Nf(i){i!==void 0&&(tu=i);let t=tu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ff(i){return i*Vr}function Of(i){return i*er}function Bf(i){return(i&i-1)===0&&i!==0}function zf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function kf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Hf(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),d=a((t+n)/2),h=r((t-n)/2),f=a((t-n)/2),u=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*d,c*h,c*f,o*l);break;case"YZY":i.set(c*f,o*d,c*h,o*l);break;case"ZXZ":i.set(c*h,c*f,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*u,o*l);break;case"YXY":i.set(c*u,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*u,o*d,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function js(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function En(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var vr={DEG2RAD:Vr,RAD2DEG:er,generateUUID:Ps,clamp:ne,euclideanModulo:ih,mapLinear:wf,inverseLerp:Af,lerp:Gr,damp:Rf,pingpong:Cf,smoothstep:Pf,smootherstep:If,randInt:Df,randFloat:Lf,randFloatSpread:Uf,seededRandom:Nf,degToRad:Ff,radToDeg:Of,isPowerOfTwo:Bf,ceilPowerOfTwo:zf,floorPowerOfTwo:kf,setQuaternionFromProperEuler:Hf,normalize:En,denormalize:js},ut=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Pn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],h=n[s+3],f=r[a+0],u=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=h;return}if(o===1){t[e+0]=f,t[e+1]=u,t[e+2]=g,t[e+3]=_;return}if(h!==_||c!==f||l!==u||d!==g){let m=1-o,p=c*f+l*u+d*g+h*_,S=p>=0?1:-1,E=1-p*p;if(E>Number.EPSILON){let R=Math.sqrt(E),w=Math.atan2(R,p*S);m=Math.sin(m*w)/R,o=Math.sin(o*w)/R}let y=o*S;if(c=c*m+f*y,l=l*m+u*y,d=d*m+g*y,h=h*m+_*y,m===1-o){let R=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=R,l*=R,d*=R,h*=R}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],h=r[a],f=r[a+1],u=r[a+2],g=r[a+3];return t[e]=o*g+d*h+c*u-l*f,t[e+1]=c*g+d*f+l*h-o*u,t[e+2]=l*g+d*u+o*f-c*h,t[e+3]=d*g-o*h-c*f-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),h=o(r/2),f=c(n/2),u=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*d*h+l*u*g,this._y=l*u*h-f*d*g,this._z=l*d*g+f*u*h,this._w=l*d*h-f*u*g;break;case"YXZ":this._x=f*d*h+l*u*g,this._y=l*u*h-f*d*g,this._z=l*d*g-f*u*h,this._w=l*d*h+f*u*g;break;case"ZXY":this._x=f*d*h-l*u*g,this._y=l*u*h+f*d*g,this._z=l*d*g+f*u*h,this._w=l*d*h-f*u*g;break;case"ZYX":this._x=f*d*h-l*u*g,this._y=l*u*h+f*d*g,this._z=l*d*g-f*u*h,this._w=l*d*h+f*u*g;break;case"YZX":this._x=f*d*h+l*u*g,this._y=l*u*h+f*d*g,this._z=l*d*g-f*u*h,this._w=l*d*h-f*u*g;break;case"XZY":this._x=f*d*h-l*u*g,this._y=l*u*h-f*d*g,this._z=l*d*g+f*u*h,this._w=l*d*h+f*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],d=e[6],h=e[10],f=n+o+h;if(f>0){let u=.5/Math.sqrt(f+1);this._w=.25/u,this._x=(d-c)*u,this._y=(r-l)*u,this._z=(a-s)*u}else if(n>o&&n>h){let u=2*Math.sqrt(1+n-o-h);this._w=(d-c)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+l)/u}else if(o>h){let u=2*Math.sqrt(1+o-n-h);this._w=(r-l)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(c+d)/u}else{let u=2*Math.sqrt(1+h-n-o);this._w=(a-s)/u,this._x=(r+l)/u,this._y=(c+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let u=1-e;return this._w=u*a+e*this._w,this._x=u*n+e*this._x,this._y=u*s+e*this._y,this._z=u*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),d=Math.atan2(l,o),h=Math.sin((1-e)*d)/l,f=Math.sin(e*d)/l;return this._w=a*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(eu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(eu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),d=2*(o*e-r*s),h=2*(r*n-a*e);return this.x=e+c*l+a*h-o*d,this.y=n+c*d+o*l-r*h,this.z=s+c*h+r*d-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ec.copy(this).projectOnVector(t),this.sub(ec)}reflect(t){return this.sub(ec.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ec=new L,eu=new Pn,ee=class i{constructor(t,e,n,s,r,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){let d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],h=n[7],f=n[2],u=n[5],g=n[8],_=s[0],m=s[3],p=s[6],S=s[1],E=s[4],y=s[7],R=s[2],w=s[5],A=s[8];return r[0]=a*_+o*S+c*R,r[3]=a*m+o*E+c*w,r[6]=a*p+o*y+c*A,r[1]=l*_+d*S+h*R,r[4]=l*m+d*E+h*w,r[7]=l*p+d*y+h*A,r[2]=f*_+u*S+g*R,r[5]=f*m+u*E+g*w,r[8]=f*p+u*y+g*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*a*d-e*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],h=d*a-o*l,f=o*c-d*r,u=l*r-a*c,g=e*h+n*f+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=h*_,t[1]=(s*l-d*n)*_,t[2]=(o*n-s*a)*_,t[3]=f*_,t[4]=(d*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=u*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(nc.makeScale(t,e)),this}rotate(t){return this.premultiply(nc.makeRotation(-t)),this}translate(t,e){return this.premultiply(nc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},nc=new ee;function sh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Zr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function vd(){let i=Zr("canvas");return i.style.display="block",i}var nu={};function nr(i){i in nu||(nu[i]=!0,console.warn(i))}function Md(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var iu=new ee().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),su=new ee().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vf(){let i={enabled:!0,workingColorSpace:Ms,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ye&&(s.r=wi(s.r),s.g=wi(s.g),s.b=wi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ye&&(s.r=Qs(s.r),s.g=Qs(s.g),s.b=Qs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Fi?Yr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return nr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return nr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ms]:{primaries:t,whitePoint:n,transfer:Yr,toXYZ:iu,fromXYZ:su,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Tn},outputColorSpaceConfig:{drawingBufferColorSpace:Tn}},[Tn]:{primaries:t,whitePoint:n,transfer:ye,toXYZ:iu,fromXYZ:su,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Tn}}}),i}var he=Vf();function wi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Qs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var zs,po=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{zs===void 0&&(zs=Zr("canvas")),zs.width=t.width,zs.height=t.height;let s=zs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=zs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Zr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=wi(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wi(e[n]/255)*255):e[n]=wi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Gf=0,ir=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=Ps(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ic(s[a].image)):r.push(ic(s[a]))}else r=ic(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ic(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?po.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Wf=0,sc=new L,wn=class i extends ui{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=ts,s=ts,r=ii,a=rs,o=Zn,c=ai,l=i.DEFAULT_ANISOTROPY,d=Fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Ps(),this.name="",this.source=new ir(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(sc).x}get height(){return this.source.getSize(sc).y}get depth(){return this.source.getSize(sc).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==qc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ho:t.x=t.x-Math.floor(t.x);break;case ts:t.x=t.x<0?0:1;break;case uo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ho:t.y=t.y-Math.floor(t.y);break;case ts:t.y=t.y<0?0:1;break;case uo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};wn.DEFAULT_IMAGE=null;wn.DEFAULT_MAPPING=qc;wn.DEFAULT_ANISOTROPY=1;var Ce=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],d=c[4],h=c[8],f=c[1],u=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(d-f)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let E=(l+1)/2,y=(u+1)/2,R=(p+1)/2,w=(d+f)/4,A=(h+_)/4,I=(g+m)/4;return E>y&&E>R?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=w/n,r=A/n):y>R?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=w/s,r=I/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=A/r,s=I/r),this.set(n,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(f-d)*(f-d));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(h-_)/S,this.z=(f-d)/S,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},mo=class extends ui{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ii,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ce(0,0,t,e),this.scissorTest=!1,this.viewport=new Ce(0,0,t,e);let s={width:t,height:e,depth:n.depth},r=new wn(s);this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:ii,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new ir(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Bn=class extends mo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Jr=class extends wn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Cn,this.minFilter=Cn,this.wrapR=ts,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var go=class extends wn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Cn,this.minFilter=Cn,this.wrapR=ts,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var di=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Qn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Qn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Qn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Qn):Qn.fromBufferAttribute(r,a),Qn.applyMatrix4(t.matrixWorld),this.expandByPoint(Qn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Na.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Na.copy(n.boundingBox)),Na.applyMatrix4(t.matrixWorld),this.union(Na)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Qn),Qn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ur),Fa.subVectors(this.max,Ur),ks.subVectors(t.a,Ur),Hs.subVectors(t.b,Ur),Vs.subVectors(t.c,Ur),Yi.subVectors(Hs,ks),$i.subVectors(Vs,Hs),ps.subVectors(ks,Vs);let e=[0,-Yi.z,Yi.y,0,-$i.z,$i.y,0,-ps.z,ps.y,Yi.z,0,-Yi.x,$i.z,0,-$i.x,ps.z,0,-ps.x,-Yi.y,Yi.x,0,-$i.y,$i.x,0,-ps.y,ps.x,0];return!rc(e,ks,Hs,Vs,Fa)||(e=[1,0,0,0,1,0,0,0,1],!rc(e,ks,Hs,Vs,Fa))?!1:(Oa.crossVectors(Yi,$i),e=[Oa.x,Oa.y,Oa.z],rc(e,ks,Hs,Vs,Fa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Qn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Qn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Mi=[new L,new L,new L,new L,new L,new L,new L,new L],Qn=new L,Na=new di,ks=new L,Hs=new L,Vs=new L,Yi=new L,$i=new L,ps=new L,Ur=new L,Fa=new L,Oa=new L,ms=new L;function rc(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ms.fromArray(i,r);let o=s.x*Math.abs(ms.x)+s.y*Math.abs(ms.y)+s.z*Math.abs(ms.z),c=t.dot(ms),l=e.dot(ms),d=n.dot(ms);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}var Xf=new di,Nr=new L,ac=new L,fi=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Xf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Nr.subVectors(t,this.center);let e=Nr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Nr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ac.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Nr.copy(t.center).add(ac)),this.expandByPoint(Nr.copy(t.center).sub(ac))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Si=new L,oc=new L,Ba=new L,Zi=new L,lc=new L,za=new L,cc=new L,Ci=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Si)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Si.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Si.copy(this.origin).addScaledVector(this.direction,e),Si.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){oc.copy(t).add(e).multiplyScalar(.5),Ba.copy(e).sub(t).normalize(),Zi.copy(this.origin).sub(oc);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Ba),o=Zi.dot(this.direction),c=-Zi.dot(Ba),l=Zi.lengthSq(),d=Math.abs(1-a*a),h,f,u,g;if(d>0)if(h=a*c-o,f=a*o-c,g=r*d,h>=0)if(f>=-g)if(f<=g){let _=1/d;h*=_,f*=_,u=h*(h+a*f+2*o)+f*(a*h+f+2*c)+l}else f=r,h=Math.max(0,-(a*f+o)),u=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(a*f+o)),u=-h*h+f*(f+2*c)+l;else f<=-g?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-c),r),u=-h*h+f*(f+2*c)+l):f<=g?(h=0,f=Math.min(Math.max(-r,-c),r),u=f*(f+2*c)+l):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-c),r),u=-h*h+f*(f+2*c)+l);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),u=-h*h+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(oc).addScaledVector(Ba,f),u}intersectSphere(t,e){Si.subVectors(t.center,this.origin);let n=Si.dot(this.direction),s=Si.dot(Si)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c,l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),d>=0?(r=(t.min.y-f.y)*d,a=(t.max.y-f.y)*d):(r=(t.max.y-f.y)*d,a=(t.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(t.min.z-f.z)*h,c=(t.max.z-f.z)*h):(o=(t.max.z-f.z)*h,c=(t.min.z-f.z)*h),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Si)!==null}intersectTriangle(t,e,n,s,r){lc.subVectors(e,t),za.subVectors(n,t),cc.crossVectors(lc,za);let a=this.direction.dot(cc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zi.subVectors(this.origin,t);let c=o*this.direction.dot(za.crossVectors(Zi,za));if(c<0)return null;let l=o*this.direction.dot(lc.cross(Zi));if(l<0||c+l>a)return null;let d=-o*Zi.dot(cc);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ue=class i{constructor(t,e,n,s,r,a,o,c,l,d,h,f,u,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,d,h,f,u,g,_,m)}set(t,e,n,s,r,a,o,c,l,d,h,f,u,g,_,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=d,p[10]=h,p[14]=f,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Gs.setFromMatrixColumn(t,0).length(),r=1/Gs.setFromMatrixColumn(t,1).length(),a=1/Gs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){let f=a*d,u=a*h,g=o*d,_=o*h;e[0]=c*d,e[4]=-c*h,e[8]=l,e[1]=u+g*l,e[5]=f-_*l,e[9]=-o*c,e[2]=_-f*l,e[6]=g+u*l,e[10]=a*c}else if(t.order==="YXZ"){let f=c*d,u=c*h,g=l*d,_=l*h;e[0]=f+_*o,e[4]=g*o-u,e[8]=a*l,e[1]=a*h,e[5]=a*d,e[9]=-o,e[2]=u*o-g,e[6]=_+f*o,e[10]=a*c}else if(t.order==="ZXY"){let f=c*d,u=c*h,g=l*d,_=l*h;e[0]=f-_*o,e[4]=-a*h,e[8]=g+u*o,e[1]=u+g*o,e[5]=a*d,e[9]=_-f*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let f=a*d,u=a*h,g=o*d,_=o*h;e[0]=c*d,e[4]=g*l-u,e[8]=f*l+_,e[1]=c*h,e[5]=_*l+f,e[9]=u*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let f=a*c,u=a*l,g=o*c,_=o*l;e[0]=c*d,e[4]=_-f*h,e[8]=g*h+u,e[1]=h,e[5]=a*d,e[9]=-o*d,e[2]=-l*d,e[6]=u*h+g,e[10]=f-_*h}else if(t.order==="XZY"){let f=a*c,u=a*l,g=o*c,_=o*l;e[0]=c*d,e[4]=-h,e[8]=l*d,e[1]=f*h+_,e[5]=a*d,e[9]=u*h-g,e[2]=g*h-u,e[6]=o*d,e[10]=_*h+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qf,t,Yf)}lookAt(t,e,n){let s=this.elements;return Fn.subVectors(t,e),Fn.lengthSq()===0&&(Fn.z=1),Fn.normalize(),Ji.crossVectors(n,Fn),Ji.lengthSq()===0&&(Math.abs(n.z)===1?Fn.x+=1e-4:Fn.z+=1e-4,Fn.normalize(),Ji.crossVectors(n,Fn)),Ji.normalize(),ka.crossVectors(Fn,Ji),s[0]=Ji.x,s[4]=ka.x,s[8]=Fn.x,s[1]=Ji.y,s[5]=ka.y,s[9]=Fn.y,s[2]=Ji.z,s[6]=ka.z,s[10]=Fn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],h=n[5],f=n[9],u=n[13],g=n[2],_=n[6],m=n[10],p=n[14],S=n[3],E=n[7],y=n[11],R=n[15],w=s[0],A=s[4],I=s[8],M=s[12],x=s[1],P=s[5],O=s[9],F=s[13],k=s[2],Y=s[6],q=s[10],nt=s[14],G=s[3],ht=s[7],gt=s[11],dt=s[15];return r[0]=a*w+o*x+c*k+l*G,r[4]=a*A+o*P+c*Y+l*ht,r[8]=a*I+o*O+c*q+l*gt,r[12]=a*M+o*F+c*nt+l*dt,r[1]=d*w+h*x+f*k+u*G,r[5]=d*A+h*P+f*Y+u*ht,r[9]=d*I+h*O+f*q+u*gt,r[13]=d*M+h*F+f*nt+u*dt,r[2]=g*w+_*x+m*k+p*G,r[6]=g*A+_*P+m*Y+p*ht,r[10]=g*I+_*O+m*q+p*gt,r[14]=g*M+_*F+m*nt+p*dt,r[3]=S*w+E*x+y*k+R*G,r[7]=S*A+E*P+y*Y+R*ht,r[11]=S*I+E*O+y*q+R*gt,r[15]=S*M+E*F+y*nt+R*dt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],d=t[2],h=t[6],f=t[10],u=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*c*h-s*l*h-r*o*f+n*l*f+s*o*u-n*c*u)+_*(+e*c*u-e*l*f+r*a*f-s*a*u+s*l*d-r*c*d)+m*(+e*l*h-e*o*u-r*a*h+n*a*u+r*o*d-n*l*d)+p*(-s*o*d-e*c*h+e*o*f+s*a*h-n*a*f+n*c*d)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],h=t[9],f=t[10],u=t[11],g=t[12],_=t[13],m=t[14],p=t[15],S=h*m*l-_*f*l+_*c*u-o*m*u-h*c*p+o*f*p,E=g*f*l-d*m*l-g*c*u+a*m*u+d*c*p-a*f*p,y=d*_*l-g*h*l+g*o*u-a*_*u-d*o*p+a*h*p,R=g*h*c-d*_*c-g*o*f+a*_*f+d*o*m-a*h*m,w=e*S+n*E+s*y+r*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/w;return t[0]=S*A,t[1]=(_*f*r-h*m*r-_*s*u+n*m*u+h*s*p-n*f*p)*A,t[2]=(o*m*r-_*c*r+_*s*l-n*m*l-o*s*p+n*c*p)*A,t[3]=(h*c*r-o*f*r-h*s*l+n*f*l+o*s*u-n*c*u)*A,t[4]=E*A,t[5]=(d*m*r-g*f*r+g*s*u-e*m*u-d*s*p+e*f*p)*A,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*p-e*c*p)*A,t[7]=(a*f*r-d*c*r+d*s*l-e*f*l-a*s*u+e*c*u)*A,t[8]=y*A,t[9]=(g*h*r-d*_*r-g*n*u+e*_*u+d*n*p-e*h*p)*A,t[10]=(a*_*r-g*o*r+g*n*l-e*_*l-a*n*p+e*o*p)*A,t[11]=(d*o*r-a*h*r-d*n*l+e*h*l+a*n*u-e*o*u)*A,t[12]=R*A,t[13]=(d*_*s-g*h*s+g*n*f-e*_*f-d*n*m+e*h*m)*A,t[14]=(g*o*s-a*_*s-g*n*c+e*_*c+a*n*m-e*o*m)*A,t[15]=(a*h*s-d*o*s+d*n*c-e*h*c-a*n*f+e*o*f)*A,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,d=a+a,h=o+o,f=r*l,u=r*d,g=r*h,_=a*d,m=a*h,p=o*h,S=c*l,E=c*d,y=c*h,R=n.x,w=n.y,A=n.z;return s[0]=(1-(_+p))*R,s[1]=(u+y)*R,s[2]=(g-E)*R,s[3]=0,s[4]=(u-y)*w,s[5]=(1-(f+p))*w,s[6]=(m+S)*w,s[7]=0,s[8]=(g+E)*A,s[9]=(m-S)*A,s[10]=(1-(f+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Gs.set(s[0],s[1],s[2]).length(),a=Gs.set(s[4],s[5],s[6]).length(),o=Gs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],ti.copy(this);let l=1/r,d=1/a,h=1/o;return ti.elements[0]*=l,ti.elements[1]*=l,ti.elements[2]*=l,ti.elements[4]*=d,ti.elements[5]*=d,ti.elements[6]*=d,ti.elements[8]*=h,ti.elements[9]*=h,ti.elements[10]*=h,e.setFromRotationMatrix(ti),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=ni,c=!1){let l=this.elements,d=2*r/(e-t),h=2*r/(n-s),f=(e+t)/(e-t),u=(n+s)/(n-s),g,_;if(c)g=r/(a-r),_=a*r/(a-r);else if(o===ni)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===$r)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=ni,c=!1){let l=this.elements,d=2/(e-t),h=2/(n-s),f=-(e+t)/(e-t),u=-(n+s)/(n-s),g,_;if(c)g=1/(a-r),_=a/(a-r);else if(o===ni)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===$r)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=u,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Gs=new L,ti=new ue,qf=new L(0,0,0),Yf=new L(1,1,1),Ji=new L,ka=new L,Fn=new L,ru=new ue,au=new Pn,zn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],h=s[2],f=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,u),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,u),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ru.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ru,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return au.setFromEuler(this),this.setFromQuaternion(au,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};zn.DEFAULT_ORDER="XYZ";var sr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},$f=0,ou=new L,Ws=new Pn,bi=new ue,Ha=new L,Fr=new L,Zf=new L,Jf=new Pn,lu=new L(1,0,0),cu=new L(0,1,0),hu=new L(0,0,1),uu={type:"added"},Kf={type:"removed"},Xs={type:"childadded",child:null},hc={type:"childremoved",child:null},Ve=class i extends ui{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=Ps(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new L,e=new zn,n=new Pn,s=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ue},normalMatrix:{value:new ee}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ws.setFromAxisAngle(t,e),this.quaternion.multiply(Ws),this}rotateOnWorldAxis(t,e){return Ws.setFromAxisAngle(t,e),this.quaternion.premultiply(Ws),this}rotateX(t){return this.rotateOnAxis(lu,t)}rotateY(t){return this.rotateOnAxis(cu,t)}rotateZ(t){return this.rotateOnAxis(hu,t)}translateOnAxis(t,e){return ou.copy(t).applyQuaternion(this.quaternion),this.position.add(ou.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(lu,t)}translateY(t){return this.translateOnAxis(cu,t)}translateZ(t){return this.translateOnAxis(hu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(bi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ha.copy(t):Ha.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Fr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bi.lookAt(Fr,Ha,this.up):bi.lookAt(Ha,Fr,this.up),this.quaternion.setFromRotationMatrix(bi),s&&(bi.extractRotation(s.matrixWorld),Ws.setFromRotationMatrix(bi),this.quaternion.premultiply(Ws.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(uu),Xs.child=t,this.dispatchEvent(Xs),Xs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Kf),hc.child=t,this.dispatchEvent(hc),hc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),bi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),bi.multiply(t.parent.matrixWorld)),t.applyMatrix4(bi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(uu),Xs.child=t,this.dispatchEvent(Xs),Xs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fr,t,Zf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fr,Jf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){let h=c[l];r(t.shapes,h)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),d=a(t.images),h=a(t.shapes),f=a(t.skeletons),u=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),u.length>0&&(n.animations=u),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let c=[];for(let l in o){let d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Ve.DEFAULT_UP=new L(0,1,0);Ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ei=new L,Ei=new L,uc=new L,Ti=new L,qs=new L,Ys=new L,du=new L,dc=new L,fc=new L,pc=new L,mc=new Ce,gc=new Ce,_c=new Ce,Qi=class i{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),ei.subVectors(t,e),s.cross(ei);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){ei.subVectors(s,e),Ei.subVectors(n,e),uc.subVectors(t,e);let a=ei.dot(ei),o=ei.dot(Ei),c=ei.dot(uc),l=Ei.dot(Ei),d=Ei.dot(uc),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;let f=1/h,u=(l*c-o*d)*f,g=(a*d-o*c)*f;return r.set(1-u-g,g,u)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,Ti)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Ti.x),c.addScaledVector(a,Ti.y),c.addScaledVector(o,Ti.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return mc.setScalar(0),gc.setScalar(0),_c.setScalar(0),mc.fromBufferAttribute(t,e),gc.fromBufferAttribute(t,n),_c.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(mc,r.x),a.addScaledVector(gc,r.y),a.addScaledVector(_c,r.z),a}static isFrontFacing(t,e,n,s){return ei.subVectors(n,e),Ei.subVectors(t,e),ei.cross(Ei).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ei.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),ei.cross(Ei).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;qs.subVectors(s,n),Ys.subVectors(r,n),dc.subVectors(t,n);let c=qs.dot(dc),l=Ys.dot(dc);if(c<=0&&l<=0)return e.copy(n);fc.subVectors(t,s);let d=qs.dot(fc),h=Ys.dot(fc);if(d>=0&&h<=d)return e.copy(s);let f=c*h-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),e.copy(n).addScaledVector(qs,a);pc.subVectors(t,r);let u=qs.dot(pc),g=Ys.dot(pc);if(g>=0&&u<=g)return e.copy(r);let _=u*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(Ys,o);let m=d*g-u*h;if(m<=0&&h-d>=0&&u-g>=0)return du.subVectors(r,s),o=(h-d)/(h-d+(u-g)),e.copy(s).addScaledVector(du,o);let p=1/(m+_+f);return a=_*p,o=f*p,e.copy(n).addScaledVector(qs,a).addScaledVector(Ys,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Sd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ki={h:0,s:0,l:0},Va={h:0,s:0,l:0};function xc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var vt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Tn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=he.workingColorSpace){if(t=ih(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=xc(a,r,t+1/3),this.g=xc(a,r,t),this.b=xc(a,r,t-1/3)}return he.colorSpaceToWorking(this,s),this}setStyle(t,e=Tn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Tn){let n=Sd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wi(t.r),this.g=wi(t.g),this.b=wi(t.b),this}copyLinearToSRGB(t){return this.r=Qs(t.r),this.g=Qs(t.g),this.b=Qs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Tn){return he.workingToColorSpace(xn.copy(this),t),Math.round(ne(xn.r*255,0,255))*65536+Math.round(ne(xn.g*255,0,255))*256+Math.round(ne(xn.b*255,0,255))}getHexString(t=Tn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.workingToColorSpace(xn.copy(this),e);let n=xn.r,s=xn.g,r=xn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,d=(o+a)/2;if(o===a)c=0,l=0;else{let h=a-o;switch(l=d<=.5?h/(a+o):h/(2-a-o),a){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=he.workingColorSpace){return he.workingToColorSpace(xn.copy(this),e),t.r=xn.r,t.g=xn.g,t.b=xn.b,t}getStyle(t=Tn){he.workingToColorSpace(xn.copy(this),t);let e=xn.r,n=xn.g,s=xn.b;return t!==Tn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ki),this.setHSL(Ki.h+t,Ki.s+e,Ki.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ki),t.getHSL(Va);let n=Gr(Ki.h,Va.h,e),s=Gr(Ki.s,Va.s,e),r=Gr(Ki.l,Va.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},xn=new vt;vt.NAMES=Sd;var jf=0,pi=class extends ui{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=Ps(),this.name="",this.type="Material",this.blending=ys,this.side=Ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=lo,this.blendDst=co,this.blendEquation=es,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new vt(0,0,0),this.blendAlpha=0,this.depthFunc=vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xs,this.stencilZFail=xs,this.stencilZPass=xs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(n.blending=this.blending),this.side!==Ri&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==lo&&(n.blendSrc=this.blendSrc),this.blendDst!==co&&(n.blendDst=this.blendDst),this.blendEquation!==es&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==vs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Pc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==xs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==xs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},kn=class extends pi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Xc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var qe=new L,Ga=new ut,Qf=0,on=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ic,this.updateRanges=[],this.gpuType=oi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ga.fromBufferAttribute(this,e),Ga.applyMatrix3(t),this.setXY(e,Ga.x,Ga.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix3(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix4(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyNormalMatrix(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.transformDirection(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=js(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=En(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=js(e,this.array)),e}setX(t,e){return this.normalized&&(e=En(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=js(e,this.array)),e}setY(t,e){return this.normalized&&(e=En(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=js(e,this.array)),e}setZ(t,e){return this.normalized&&(e=En(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=js(e,this.array)),e}setW(t,e){return this.normalized&&(e=En(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=En(e,this.array),n=En(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=En(e,this.array),n=En(n,this.array),s=En(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=En(e,this.array),n=En(n,this.array),s=En(s,this.array),r=En(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ic&&(t.usage=this.usage),t}};var Kr=class extends on{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var jr=class extends on{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Qt=class extends on{constructor(t,e,n){super(new Float32Array(t),e,n)}},tp=0,Wn=new ue,yc=new Ve,$s=new L,On=new di,Or=new di,an=new L,xe=class i extends ui{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=Ps(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sh(t)?jr:Kr)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ee().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Wn.makeRotationFromQuaternion(t),this.applyMatrix4(Wn),this}rotateX(t){return Wn.makeRotationX(t),this.applyMatrix4(Wn),this}rotateY(t){return Wn.makeRotationY(t),this.applyMatrix4(Wn),this}rotateZ(t){return Wn.makeRotationZ(t),this.applyMatrix4(Wn),this}translate(t,e,n){return Wn.makeTranslation(t,e,n),this.applyMatrix4(Wn),this}scale(t,e,n){return Wn.makeScale(t,e,n),this.applyMatrix4(Wn),this}lookAt(t){return yc.lookAt(t),yc.updateMatrix(),this.applyMatrix4(yc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($s).negate(),this.translate($s.x,$s.y,$s.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Qt(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new di);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];On.setFromBufferAttribute(r),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,On.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,On.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(On.min),this.boundingBox.expandByPoint(On.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let n=this.boundingSphere.center;if(On.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Or.setFromBufferAttribute(o),this.morphTargetsRelative?(an.addVectors(On.min,Or.min),On.expandByPoint(an),an.addVectors(On.max,Or.max),On.expandByPoint(an)):(On.expandByPoint(Or.min),On.expandByPoint(Or.max))}On.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)an.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(an));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)an.fromBufferAttribute(o,l),c&&($s.fromBufferAttribute(t,l),an.add($s)),s=Math.max(s,n.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new on(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let I=0;I<n.count;I++)o[I]=new L,c[I]=new L;let l=new L,d=new L,h=new L,f=new ut,u=new ut,g=new ut,_=new L,m=new L;function p(I,M,x){l.fromBufferAttribute(n,I),d.fromBufferAttribute(n,M),h.fromBufferAttribute(n,x),f.fromBufferAttribute(r,I),u.fromBufferAttribute(r,M),g.fromBufferAttribute(r,x),d.sub(l),h.sub(l),u.sub(f),g.sub(f);let P=1/(u.x*g.y-g.x*u.y);isFinite(P)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(h,-u.y).multiplyScalar(P),m.copy(h).multiplyScalar(u.x).addScaledVector(d,-g.x).multiplyScalar(P),o[I].add(_),o[M].add(_),o[x].add(_),c[I].add(m),c[M].add(m),c[x].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let I=0,M=S.length;I<M;++I){let x=S[I],P=x.start,O=x.count;for(let F=P,k=P+O;F<k;F+=3)p(t.getX(F+0),t.getX(F+1),t.getX(F+2))}let E=new L,y=new L,R=new L,w=new L;function A(I){R.fromBufferAttribute(s,I),w.copy(R);let M=o[I];E.copy(M),E.sub(R.multiplyScalar(R.dot(M))).normalize(),y.crossVectors(w,M);let P=y.dot(c[I])<0?-1:1;a.setXYZW(I,E.x,E.y,E.z,P)}for(let I=0,M=S.length;I<M;++I){let x=S[I],P=x.start,O=x.count;for(let F=P,k=P+O;F<k;F+=3)A(t.getX(F+0)),A(t.getX(F+1)),A(t.getX(F+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new on(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,u=n.count;f<u;f++)n.setXYZ(f,0,0,0);let s=new L,r=new L,a=new L,o=new L,c=new L,l=new L,d=new L,h=new L;if(t)for(let f=0,u=t.count;f<u;f+=3){let g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,u=e.count;f<u;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)an.fromBufferAttribute(t,e),an.normalize(),t.setXYZ(e,an.x,an.y,an.z)}toNonIndexed(){function t(o,c){let l=o.array,d=o.itemSize,h=o.normalized,f=new l.constructor(c.length*d),u=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?u=c[_]*o.data.stride+o.offset:u=c[_]*d;for(let p=0;p<d;p++)f[g++]=l[u++]}return new on(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let d=0,h=l.length;d<h;d++){let f=l[d],u=t(f,n);c.push(u)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],d=[];for(let h=0,f=l.length;h<f;h++){let u=l[h];d.push(u.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let l in s){let d=s[l];this.setAttribute(l,d.clone(e))}let r=t.morphAttributes;for(let l in r){let d=[],h=r[l];for(let f=0,u=h.length;f<u;f++)d.push(h[f].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,d=a.length;l<d;l++){let h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},fu=new ue,gs=new Ci,Wa=new fi,pu=new L,Xa=new L,qa=new L,Ya=new L,vc=new L,$a=new L,mu=new L,Za=new L,te=class extends Ve{constructor(t=new xe,e=new kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){$a.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let d=o[c],h=r[c];d!==0&&(vc.fromBufferAttribute(h,t),a?$a.addScaledVector(vc,d):$a.addScaledVector(vc.sub(e),d))}e.add($a)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Wa.copy(n.boundingSphere),Wa.applyMatrix4(r),gs.copy(t.ray).recast(t.near),!(Wa.containsPoint(gs.origin)===!1&&(gs.intersectSphere(Wa,pu)===null||gs.origin.distanceToSquared(pu)>(t.far-t.near)**2))&&(fu.copy(r).invert(),gs.copy(t.ray).applyMatrix4(fu),!(n.boundingBox!==null&&gs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,gs)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,f=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){let m=f[g],p=a[m.materialIndex],S=Math.max(m.start,u.start),E=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let y=S,R=E;y<R;y+=3){let w=o.getX(y),A=o.getX(y+1),I=o.getX(y+2);s=Ja(this,p,t,n,l,d,h,w,A,I),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){let S=o.getX(m),E=o.getX(m+1),y=o.getX(m+2);s=Ja(this,a,t,n,l,d,h,S,E,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){let m=f[g],p=a[m.materialIndex],S=Math.max(m.start,u.start),E=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let y=S,R=E;y<R;y+=3){let w=y,A=y+1,I=y+2;s=Ja(this,p,t,n,l,d,h,w,A,I),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,u.start),_=Math.min(c.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){let S=m,E=m+1,y=m+2;s=Ja(this,a,t,n,l,d,h,S,E,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function ep(i,t,e,n,s,r,a,o){let c;if(t.side===dn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===Ri,o),c===null)return null;Za.copy(o),Za.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Za);return l<e.near||l>e.far?null:{distance:l,point:Za.clone(),object:i}}function Ja(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,Xa),i.getVertexPosition(c,qa),i.getVertexPosition(l,Ya);let d=ep(i,t,e,n,Xa,qa,Ya,mu);if(d){let h=new L;Qi.getBarycoord(mu,Xa,qa,Ya,h),s&&(d.uv=Qi.getInterpolatedAttribute(s,o,c,l,h,new ut)),r&&(d.uv1=Qi.getInterpolatedAttribute(r,o,c,l,h,new ut)),a&&(d.normal=Qi.getInterpolatedAttribute(a,o,c,l,h,new L),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let f={a:o,b:c,c:l,normal:new L,materialIndex:0};Qi.getNormal(Xa,qa,Ya,f.normal),d.face=f,d.barycoord=h}return d}var qn=class i extends xe{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],d=[],h=[],f=0,u=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(d,3)),this.setAttribute("uv",new Qt(h,2));function g(_,m,p,S,E,y,R,w,A,I,M){let x=y/A,P=R/I,O=y/2,F=R/2,k=w/2,Y=A+1,q=I+1,nt=0,G=0,ht=new L;for(let gt=0;gt<q;gt++){let dt=gt*P-F;for(let Xt=0;Xt<Y;Xt++){let Kt=Xt*x-O;ht[_]=Kt*S,ht[m]=dt*E,ht[p]=k,l.push(ht.x,ht.y,ht.z),ht[_]=0,ht[m]=0,ht[p]=w>0?1:-1,d.push(ht.x,ht.y,ht.z),h.push(Xt/A),h.push(1-gt/I),nt+=1}}for(let gt=0;gt<I;gt++)for(let dt=0;dt<A;dt++){let Xt=f+dt+Y*gt,Kt=f+dt+Y*(gt+1),me=f+(dt+1)+Y*(gt+1),jt=f+(dt+1)+Y*gt;c.push(Xt,Kt,jt),c.push(Kt,me,jt),G+=6}o.addGroup(u,G,M),u+=G,f+=nt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Is(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Mn(i){let t={};for(let e=0;e<i.length;e++){let n=Is(i[e]);for(let s in n)t[s]=n[s]}return t}function np(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function rh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:he.workingColorSpace}var bd={clone:Is,merge:Mn},ip=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,In=class extends pi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ip,this.fragmentShader=sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Is(t.uniforms),this.uniformsGroups=np(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Qr=class extends Ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ji=new L,gu=new ut,_u=new ut,yn=class extends Qr{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=er*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Vr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return er*2*Math.atan(Math.tan(Vr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ji.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ji.x,ji.y).multiplyScalar(-t/ji.z),ji.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ji.x,ji.y).multiplyScalar(-t/ji.z)}getViewSize(t,e){return this.getViewBounds(t,gu,_u),e.subVectors(_u,gu)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Vr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Zs=-90,Js=1,_o=class extends Ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new yn(Zs,Js,t,e);s.layers=this.layers,this.add(s);let r=new yn(Zs,Js,t,e);r.layers=this.layers,this.add(r);let a=new yn(Zs,Js,t,e);a.layers=this.layers,this.add(a);let o=new yn(Zs,Js,t,e);o.layers=this.layers,this.add(o);let c=new yn(Zs,Js,t,e);c.layers=this.layers,this.add(c);let l=new yn(Zs,Js,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===ni)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===$r)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,d]=this.children,h=t.getRenderTarget(),f=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(h,f,u),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},ta=class extends wn{constructor(t=[],e=Rs,n,s,r,a,o,c,l,d){super(t,e,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},xo=class extends Bn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ta(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new qn(5,5,5),r=new In({name:"CubemapFromEquirect",uniforms:Is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:dn,blending:Ui});r.uniforms.tEquirect.value=e;let a=new te(s,r),o=e.minFilter;return e.minFilter===rs&&(e.minFilter=ii),new _o(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},un=class extends Ve{constructor(){super(),this.isGroup=!0,this.type="Group"}},rp={type:"move"},rr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new un,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new un,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new un,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=d.position.distanceTo(h.position),u=.02,g=.005;l.inputState.pinching&&f>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(rp)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new un;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}};var ea=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new vt(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ar=class extends Ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var yo=class extends wn{constructor(t=null,e=1,n=1,s,r,a,o,c,l=Cn,d=Cn,h,f){super(null,a,o,c,l,d,s,r,h,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ss=class extends on{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ks=new ue,xu=new ue,Ka=[],yu=new di,ap=new ue,Br=new te,zr=new fi,or=class extends te{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ss(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ap)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new di),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ks),yu.copy(t.boundingBox).applyMatrix4(Ks),this.boundingBox.union(yu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new fi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ks),zr.copy(t.boundingSphere).applyMatrix4(Ks),this.boundingSphere.union(zr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Br.geometry=this.geometry,Br.material=this.material,Br.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),zr.copy(this.boundingSphere),zr.applyMatrix4(n),t.ray.intersectsSphere(zr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ks),xu.multiplyMatrices(n,Ks),Br.matrixWorld=xu,Br.raycast(t,Ka);for(let a=0,o=Ka.length;a<o;a++){let c=Ka[a];c.instanceId=r,c.object=this,e.push(c)}Ka.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ss(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new yo(new Float32Array(s*this.count),s,this.count,il,oi));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Mc=new L,op=new L,lp=new ee,Xn=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Mc.subVectors(n,e).cross(op.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Mc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||lp.getNormalMatrix(t),s=this.coplanarPoint(Mc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},_s=new fi,cp=new ut(.5,.5),ja=new L,lr=class{constructor(t=new Xn,e=new Xn,n=new Xn,s=new Xn,r=new Xn,a=new Xn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ni,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],h=r[5],f=r[6],u=r[7],g=r[8],_=r[9],m=r[10],p=r[11],S=r[12],E=r[13],y=r[14],R=r[15];if(s[0].setComponents(l-a,u-d,p-g,R-S).normalize(),s[1].setComponents(l+a,u+d,p+g,R+S).normalize(),s[2].setComponents(l+o,u+h,p+_,R+E).normalize(),s[3].setComponents(l-o,u-h,p-_,R-E).normalize(),n)s[4].setComponents(c,f,m,y).normalize(),s[5].setComponents(l-c,u-f,p-m,R-y).normalize();else if(s[4].setComponents(l-c,u-f,p-m,R-y).normalize(),e===ni)s[5].setComponents(l+c,u+f,p+m,R+y).normalize();else if(e===$r)s[5].setComponents(c,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),_s.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),_s.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(_s)}intersectsSprite(t){_s.center.set(0,0,0);let e=cp.distanceTo(t.center);return _s.radius=.7071067811865476+e,_s.applyMatrix4(t.matrixWorld),this.intersectsSphere(_s)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(ja.x=s.normal.x>0?t.max.x:t.min.x,ja.y=s.normal.y>0?t.max.y:t.min.y,ja.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ja)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var cr=class extends pi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new vt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},vo=new L,Mo=new L,vu=new ue,kr=new Ci,Qa=new fi,Sc=new L,Mu=new L,So=class extends Ve{constructor(t=new xe,e=new cr){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)vo.fromBufferAttribute(e,s-1),Mo.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=vo.distanceTo(Mo);t.setAttribute("lineDistance",new Qt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qa.copy(n.boundingSphere),Qa.applyMatrix4(s),Qa.radius+=r,t.ray.intersectsSphere(Qa)===!1)return;vu.copy(s).invert(),kr.copy(t.ray).applyMatrix4(vu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){let u=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=u,m=g-1;_<m;_+=l){let p=d.getX(_),S=d.getX(_+1),E=to(this,t,kr,c,p,S,_);E&&e.push(E)}if(this.isLineLoop){let _=d.getX(g-1),m=d.getX(u),p=to(this,t,kr,c,_,m,g-1);p&&e.push(p)}}else{let u=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let _=u,m=g-1;_<m;_+=l){let p=to(this,t,kr,c,_,_+1,_);p&&e.push(p)}if(this.isLineLoop){let _=to(this,t,kr,c,g-1,u,g-1);_&&e.push(_)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function to(i,t,e,n,s,r,a){let o=i.geometry.attributes.position;if(vo.fromBufferAttribute(o,s),Mo.fromBufferAttribute(o,r),e.distanceSqToSegment(vo,Mo,Sc,Mu)>n)return;Sc.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Sc);if(!(l<t.near||l>t.far))return{distance:l,point:Mu.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Su=new L,bu=new L,na=class extends So{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Su.fromBufferAttribute(e,s),bu.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Su.distanceTo(bu);t.setAttribute("lineDistance",new Qt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var hr=class extends pi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new vt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Eu=new ue,Dc=new Ci,eo=new fi,no=new L,ia=class extends Ve{constructor(t=new xe,e=new hr){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(s),eo.radius+=r,t.ray.intersectsSphere(eo)===!1)return;Eu.copy(s).invert(),Dc.copy(t.ray).applyMatrix4(Eu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,h=n.attributes.position;if(l!==null){let f=Math.max(0,a.start),u=Math.min(l.count,a.start+a.count);for(let g=f,_=u;g<_;g++){let m=l.getX(g);no.fromBufferAttribute(h,m),Tu(no,m,c,s,t,e,this)}}else{let f=Math.max(0,a.start),u=Math.min(h.count,a.start+a.count);for(let g=f,_=u;g<_;g++)no.fromBufferAttribute(h,g),Tu(no,g,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Tu(i,t,e,n,s,r,a){let o=Dc.distanceSqToPoint(i);if(o<e){let c=new L;Dc.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var ur=class extends wn{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},bs=class extends wn{constructor(t,e,n=as,s,r,a,o=Cn,c=Cn,l,d=tr,h=1){if(d!==tr&&d!==yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:t,height:e,depth:h};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ir(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},sa=class extends wn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},mi=class i extends xe{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],c=[],l=[],d=e/2,h=Math.PI/2*t,f=e,u=2*h+f,g=n*2+r,_=s+1,m=new L,p=new L;for(let S=0;S<=g;S++){let E=0,y=0,R=0,w=0;if(S<=n){let M=S/n,x=M*Math.PI/2;y=-d-t*Math.cos(x),R=t*Math.sin(x),w=-t*Math.cos(x),E=M*h}else if(S<=n+r){let M=(S-n)/r;y=-d+M*e,R=t,w=0,E=h+M*f}else{let M=(S-n-r)/n,x=M*Math.PI/2;y=d+t*Math.sin(x),R=t*Math.cos(x),w=t*Math.sin(x),E=h+f+M*h}let A=Math.max(0,Math.min(1,E/u)),I=0;S===0?I=.5/s:S===g&&(I=-.5/s);for(let M=0;M<=s;M++){let x=M/s,P=x*Math.PI*2,O=Math.sin(P),F=Math.cos(P);p.x=-R*F,p.y=y,p.z=R*O,o.push(p.x,p.y,p.z),m.set(-R*F,w,R*O),m.normalize(),c.push(m.x,m.y,m.z),l.push(x+I,A)}if(S>0){let M=(S-1)*_;for(let x=0;x<s;x++){let P=M+x,O=M+x+1,F=S*_+x,k=S*_+x+1;a.push(P,O,F),a.push(O,k,F)}}}this.setIndex(a),this.setAttribute("position",new Qt(o,3)),this.setAttribute("normal",new Qt(c,3)),this.setAttribute("uv",new Qt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},gi=class i extends xe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],c=[],l=new L,d=new ut;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let h=0,f=3;h<=e;h++,f+=3){let u=n+h/e*s;l.x=t*Math.cos(u),l.y=t*Math.sin(u),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[f]/t+1)/2,d.y=(a[f+1]/t+1)/2,c.push(d.x,d.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new Qt(a,3)),this.setAttribute("normal",new Qt(o,3)),this.setAttribute("uv",new Qt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Yn=class i extends xe{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let d=[],h=[],f=[],u=[],g=0,_=[],m=n/2,p=0;S(),a===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(d),this.setAttribute("position",new Qt(h,3)),this.setAttribute("normal",new Qt(f,3)),this.setAttribute("uv",new Qt(u,2));function S(){let y=new L,R=new L,w=0,A=(e-t)/n;for(let I=0;I<=r;I++){let M=[],x=I/r,P=x*(e-t)+t;for(let O=0;O<=s;O++){let F=O/s,k=F*c+o,Y=Math.sin(k),q=Math.cos(k);R.x=P*Y,R.y=-x*n+m,R.z=P*q,h.push(R.x,R.y,R.z),y.set(Y,A,q).normalize(),f.push(y.x,y.y,y.z),u.push(F,1-x),M.push(g++)}_.push(M)}for(let I=0;I<s;I++)for(let M=0;M<r;M++){let x=_[M][I],P=_[M+1][I],O=_[M+1][I+1],F=_[M][I+1];(t>0||M!==0)&&(d.push(x,P,F),w+=3),(e>0||M!==r-1)&&(d.push(P,O,F),w+=3)}l.addGroup(p,w,0),p+=w}function E(y){let R=g,w=new ut,A=new L,I=0,M=y===!0?t:e,x=y===!0?1:-1;for(let O=1;O<=s;O++)h.push(0,m*x,0),f.push(0,x,0),u.push(.5,.5),g++;let P=g;for(let O=0;O<=s;O++){let k=O/s*c+o,Y=Math.cos(k),q=Math.sin(k);A.x=M*q,A.y=m*x,A.z=M*Y,h.push(A.x,A.y,A.z),f.push(0,x,0),w.x=Y*.5+.5,w.y=q*.5*x+.5,u.push(w.x,w.y),g++}for(let O=0;O<s;O++){let F=R+O,k=P+O;y===!0?d.push(k,k+1,F):d.push(k+1,k,F),I+=3}l.addGroup(p,I,y===!0?1:2),p+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ra=class i extends Yn{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},bo=class i extends xe{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new Qt(r,3)),this.setAttribute("normal",new Qt(r.slice(),3)),this.setAttribute("uv",new Qt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(S){let E=new L,y=new L,R=new L;for(let w=0;w<e.length;w+=3)u(e[w+0],E),u(e[w+1],y),u(e[w+2],R),c(E,y,R,S)}function c(S,E,y,R){let w=R+1,A=[];for(let I=0;I<=w;I++){A[I]=[];let M=S.clone().lerp(y,I/w),x=E.clone().lerp(y,I/w),P=w-I;for(let O=0;O<=P;O++)O===0&&I===w?A[I][O]=M:A[I][O]=M.clone().lerp(x,O/P)}for(let I=0;I<w;I++)for(let M=0;M<2*(w-I)-1;M++){let x=Math.floor(M/2);M%2===0?(f(A[I][x+1]),f(A[I+1][x]),f(A[I][x])):(f(A[I][x+1]),f(A[I+1][x+1]),f(A[I+1][x]))}}function l(S){let E=new L;for(let y=0;y<r.length;y+=3)E.x=r[y+0],E.y=r[y+1],E.z=r[y+2],E.normalize().multiplyScalar(S),r[y+0]=E.x,r[y+1]=E.y,r[y+2]=E.z}function d(){let S=new L;for(let E=0;E<r.length;E+=3){S.x=r[E+0],S.y=r[E+1],S.z=r[E+2];let y=m(S)/2/Math.PI+.5,R=p(S)/Math.PI+.5;a.push(y,1-R)}g(),h()}function h(){for(let S=0;S<a.length;S+=6){let E=a[S+0],y=a[S+2],R=a[S+4],w=Math.max(E,y,R),A=Math.min(E,y,R);w>.9&&A<.1&&(E<.2&&(a[S+0]+=1),y<.2&&(a[S+2]+=1),R<.2&&(a[S+4]+=1))}}function f(S){r.push(S.x,S.y,S.z)}function u(S,E){let y=S*3;E.x=t[y+0],E.y=t[y+1],E.z=t[y+2]}function g(){let S=new L,E=new L,y=new L,R=new L,w=new ut,A=new ut,I=new ut;for(let M=0,x=0;M<r.length;M+=9,x+=6){S.set(r[M+0],r[M+1],r[M+2]),E.set(r[M+3],r[M+4],r[M+5]),y.set(r[M+6],r[M+7],r[M+8]),w.set(a[x+0],a[x+1]),A.set(a[x+2],a[x+3]),I.set(a[x+4],a[x+5]),R.copy(S).add(E).add(y).divideScalar(3);let P=m(R);_(w,x+0,S,P),_(A,x+2,E,P),_(I,x+4,y,P)}}function _(S,E,y,R){R<0&&S.x===1&&(a[E]=S.x-1),y.x===0&&y.z===0&&(a[E]=R/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function p(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var Hn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let d=n[s],f=n[s+1]-d,u=(a-d)/f;return(s+u)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ut:new L);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new L,s=[],r=[],a=[],o=new L,c=new ue;for(let u=0;u<=t;u++){let g=u/t;s[u]=this.getTangentAt(g,new L)}r[0]=new L,a[0]=new L;let l=Number.MAX_VALUE,d=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let u=1;u<=t;u++){if(r[u]=r[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(ne(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(c.makeRotationAxis(o,g))}a[u].crossVectors(s[u],r[u])}if(e===!0){let u=Math.acos(ne(r[0].dot(r[t]),-1,1));u/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(u=-u);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],u*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},dr=class extends Hn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new ut){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let d=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=c-this.aX,u=l-this.aY;c=f*d-u*h+this.aX,l=f*h+u*d+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Eo=class extends dr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function ah(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,h){let f=(a-r)/l-(o-r)/(l+d)+(o-a)/d,u=(o-a)/d-(c-a)/(d+h)+(c-o)/h;f*=d,u*=d,s(a,o,f,u)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var io=new L,bc=new ah,Ec=new ah,Tc=new ah,To=class extends Hn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(io.subVectors(s[0],s[1]).add(s[0]),l=io);let h=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(io.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=io),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(h),u),_=Math.pow(h.distanceToSquared(f),u),m=Math.pow(f.distanceToSquared(d),u);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),bc.initNonuniformCatmullRom(l.x,h.x,f.x,d.x,g,_,m),Ec.initNonuniformCatmullRom(l.y,h.y,f.y,d.y,g,_,m),Tc.initNonuniformCatmullRom(l.z,h.z,f.z,d.z,g,_,m)}else this.curveType==="catmullrom"&&(bc.initCatmullRom(l.x,h.x,f.x,d.x,this.tension),Ec.initCatmullRom(l.y,h.y,f.y,d.y,this.tension),Tc.initCatmullRom(l.z,h.z,f.z,d.z,this.tension));return n.set(bc.calc(c),Ec.calc(c),Tc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function wu(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function hp(i,t){let e=1-i;return e*e*t}function up(i,t){return 2*(1-i)*i*t}function dp(i,t){return i*i*t}function Wr(i,t,e,n){return hp(i,t)+up(i,e)+dp(i,n)}function fp(i,t){let e=1-i;return e*e*e*t}function pp(i,t){let e=1-i;return 3*e*e*i*t}function mp(i,t){return 3*(1-i)*i*i*t}function gp(i,t){return i*i*i*t}function Xr(i,t,e,n,s){return fp(i,t)+pp(i,e)+mp(i,n)+gp(i,s)}var aa=class extends Hn{constructor(t=new ut,e=new ut,n=new ut,s=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ut){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Xr(t,s.x,r.x,a.x,o.x),Xr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},wo=class extends Hn{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Xr(t,s.x,r.x,a.x,o.x),Xr(t,s.y,r.y,a.y,o.y),Xr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},oa=class extends Hn{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ao=class extends Hn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},la=class extends Hn{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Wr(t,s.x,r.x,a.x),Wr(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ro=class extends Hn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Wr(t,s.x,r.x,a.x),Wr(t,s.y,r.y,a.y),Wr(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ca=class extends Hn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],h=s[a>s.length-3?s.length-1:a+2];return n.set(wu(o,c.x,l.x,d.x,h.x),wu(o,c.y,l.y,d.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new ut().fromArray(s))}return this}},Au=Object.freeze({__proto__:null,ArcCurve:Eo,CatmullRomCurve3:To,CubicBezierCurve:aa,CubicBezierCurve3:wo,EllipseCurve:dr,LineCurve:oa,LineCurve3:Ao,QuadraticBezierCurve:la,QuadraticBezierCurve3:Ro,SplineCurve:ca}),Co=class extends Hn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Au[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){let d=c[l];n&&n.equals(d)||(e.push(d),n=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Au[s.type]().fromJSON(s))}return this}},Pi=class extends Co{constructor(t){super(),this.type="Path",this.currentPoint=new ut,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new oa(this.currentPoint.clone(),new ut(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new la(this.currentPoint.clone(),new ut(t,e),new ut(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new aa(this.currentPoint.clone(),new ut(t,e),new ut(n,s),new ut(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new ca(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){let l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){let l=new dr(t,e,n,s,r,a,o,c);if(this.curves.length>0){let h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);let d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},ns=class extends Pi{constructor(t){super(t),this.uuid=Ps(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Pi().fromJSON(s))}return this}};function _p(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Ed(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Sp(i,t,r,e)),i.length>80*e){o=1/0,c=1/0;let d=-1/0,h=-1/0;for(let f=e;f<s;f+=e){let u=i[f],g=i[f+1];u<o&&(o=u),g<c&&(c=g),u>d&&(d=u),g>h&&(h=g)}l=Math.max(d-o,h-c),l=l!==0?32767/l:0}return ha(r,a,e,o,c,l,0),a}function Ed(i,t,e,n,s){let r;if(s===Lp(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Ru(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Ru(a/n|0,i[a],i[a+1],r);return r&&fr(r,r.next)&&(da(r),r=r.next),r}function Es(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(fr(e,e.next)||Oe(e.prev,e,e.next)===0)){if(da(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ha(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Ap(i,n,s,r);let o=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?yp(i,n,s,r):xp(i)){t.push(c.i,i.i,l.i),da(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=vp(Es(i),t),ha(i,t,e,n,s,r,2)):a===2&&Mp(i,t,e,n,s,r):ha(Es(i),t,e,n,s,r,1);break}}}function xp(i){let t=i.prev,e=i,n=i.next;if(Oe(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,c=e.y,l=n.y,d=Math.min(s,r,a),h=Math.min(o,c,l),f=Math.max(s,r,a),u=Math.max(o,c,l),g=n.next;for(;g!==t;){if(g.x>=d&&g.x<=f&&g.y>=h&&g.y<=u&&Hr(s,o,r,c,a,l,g.x,g.y)&&Oe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function yp(i,t,e,n){let s=i.prev,r=i,a=i.next;if(Oe(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,d=s.y,h=r.y,f=a.y,u=Math.min(o,c,l),g=Math.min(d,h,f),_=Math.max(o,c,l),m=Math.max(d,h,f),p=Lc(u,g,t,e,n),S=Lc(_,m,t,e,n),E=i.prevZ,y=i.nextZ;for(;E&&E.z>=p&&y&&y.z<=S;){if(E.x>=u&&E.x<=_&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&Hr(o,d,c,h,l,f,E.x,E.y)&&Oe(E.prev,E,E.next)>=0||(E=E.prevZ,y.x>=u&&y.x<=_&&y.y>=g&&y.y<=m&&y!==s&&y!==a&&Hr(o,d,c,h,l,f,y.x,y.y)&&Oe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;E&&E.z>=p;){if(E.x>=u&&E.x<=_&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&Hr(o,d,c,h,l,f,E.x,E.y)&&Oe(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;y&&y.z<=S;){if(y.x>=u&&y.x<=_&&y.y>=g&&y.y<=m&&y!==s&&y!==a&&Hr(o,d,c,h,l,f,y.x,y.y)&&Oe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function vp(i,t){let e=i;do{let n=e.prev,s=e.next.next;!fr(n,s)&&wd(n,e,e.next,s)&&ua(n,s)&&ua(s,n)&&(t.push(n.i,e.i,s.i),da(e),da(e.next),e=i=s),e=e.next}while(e!==i);return Es(e)}function Mp(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Pp(a,o)){let c=Ad(a,o);a=Es(a,a.next),c=Es(c,c.next),ha(a,t,e,n,s,r,0),ha(c,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Sp(i,t,e,n){let s=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*n,c=r<a-1?t[r+1]*n:i.length,l=Ed(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Cp(l))}s.sort(bp);for(let r=0;r<s.length;r++)e=Ep(s[r],e);return e}function bp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Ep(i,t){let e=Tp(i,t);if(!e)return t;let n=Ad(e,i);return Es(n,n.next),Es(e,e.next)}function Tp(i,t){let e=t,n=i.x,s=i.y,r=-1/0,a;if(fr(i,e))return e;do{if(fr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let h=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=n&&h>r&&(r=h,a=e.x<e.next.x?e:e.next,h===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,c=a.x,l=a.y,d=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&Td(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){let h=Math.abs(s-e.y)/(n-e.x);ua(e,i)&&(h<d||h===d&&(e.x>a.x||e.x===a.x&&wp(a,e)))&&(a=e,d=h)}e=e.next}while(e!==o);return a}function wp(i,t){return Oe(i.prev,i,t.prev)<0&&Oe(t.next,i,i.next)<0}function Ap(i,t,e,n){let s=i;do s.z===0&&(s.z=Lc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Rp(s)}function Rp(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function Lc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Cp(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Td(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Hr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Td(i,t,e,n,s,r,a,o)}function Pp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Ip(i,t)&&(ua(i,t)&&ua(t,i)&&Dp(i,t)&&(Oe(i.prev,i,t.prev)||Oe(i,t.prev,t))||fr(i,t)&&Oe(i.prev,i,i.next)>0&&Oe(t.prev,t,t.next)>0)}function Oe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function fr(i,t){return i.x===t.x&&i.y===t.y}function wd(i,t,e,n){let s=ro(Oe(i,t,e)),r=ro(Oe(i,t,n)),a=ro(Oe(e,n,i)),o=ro(Oe(e,n,t));return!!(s!==r&&a!==o||s===0&&so(i,e,t)||r===0&&so(i,n,t)||a===0&&so(e,i,n)||o===0&&so(e,t,n))}function so(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ro(i){return i>0?1:i<0?-1:0}function Ip(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&wd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ua(i,t){return Oe(i.prev,i,i.next)<0?Oe(i,t,i.next)>=0&&Oe(i,i.prev,t)>=0:Oe(i,t,i.prev)<0||Oe(i,i.next,t)<0}function Dp(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Ad(i,t){let e=Uc(i.i,i.x,i.y),n=Uc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Ru(i,t,e,n){let s=Uc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function da(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Uc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Lp(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Nc=class{static triangulate(t,e,n=2){return _p(t,e,n)}},Ai=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];Cu(t),Pu(n,t);let a=t.length;e.forEach(Cu);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Pu(n,e[c]);let o=Nc.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function Cu(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Pu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var si=class i extends bo{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var Ii=class i extends xe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,h=t/o,f=e/c,u=[],g=[],_=[],m=[];for(let p=0;p<d;p++){let S=p*f-a;for(let E=0;E<l;E++){let y=E*h-r;g.push(y,-S,0),_.push(0,0,1),m.push(E/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<o;S++){let E=S+l*p,y=S+l*(p+1),R=S+1+l*(p+1),w=S+1+l*p;u.push(E,y,w),u.push(y,R,w)}this.setIndex(u),this.setAttribute("position",new Qt(g,3)),this.setAttribute("normal",new Qt(_,3)),this.setAttribute("uv",new Qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},pr=class i extends xe{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],d=[],h=t,f=(e-t)/s,u=new L,g=new ut;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){let p=r+m/n*a;u.x=h*Math.cos(p),u.y=h*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,d.push(g.x,g.y)}h+=f}for(let _=0;_<s;_++){let m=_*(n+1);for(let p=0;p<n;p++){let S=p+m,E=S,y=S+n+1,R=S+n+2,w=S+1;o.push(E,y,w),o.push(y,R,w)}}this.setIndex(o),this.setAttribute("position",new Qt(c,3)),this.setAttribute("normal",new Qt(l,3)),this.setAttribute("uv",new Qt(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Ts=class i extends xe{constructor(t=new ns([new ut(0,.5),new ut(-.5,-.5),new ut(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],r=[],a=[],o=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new Qt(s,3)),this.setAttribute("normal",new Qt(r,3)),this.setAttribute("uv",new Qt(a,2));function l(d){let h=s.length/3,f=d.extractPoints(e),u=f.shape,g=f.holes;Ai.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){let S=g[m];Ai.isClockWise(S)===!0&&(g[m]=S.reverse())}let _=Ai.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){let S=g[m];u=u.concat(S)}for(let m=0,p=u.length;m<p;m++){let S=u[m];s.push(S.x,S.y,0),r.push(0,0,1),a.push(S.x,S.y)}for(let m=0,p=_.length;m<p;m++){let S=_[m],E=S[0]+h,y=S[1]+h,R=S[2]+h;n.push(E,y,R),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return Up(e,t)}static fromJSON(t,e){let n=[];for(let s=0,r=t.shapes.length;s<r;s++){let a=e[t.shapes[s]];n.push(a)}return new i(n,t.curveSegments)}};function Up(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}var Di=class i extends xe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,d=[],h=new L,f=new L,u=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let S=[],E=p/n,y=0;p===0&&a===0?y=.5/e:p===n&&c===Math.PI&&(y=-.5/e);for(let R=0;R<=e;R++){let w=R/e;h.x=-t*Math.cos(s+w*r)*Math.sin(a+E*o),h.y=t*Math.cos(a+E*o),h.z=t*Math.sin(s+w*r)*Math.sin(a+E*o),g.push(h.x,h.y,h.z),f.copy(h).normalize(),_.push(f.x,f.y,f.z),m.push(w+y,1-E),S.push(l++)}d.push(S)}for(let p=0;p<n;p++)for(let S=0;S<e;S++){let E=d[p][S+1],y=d[p][S],R=d[p+1][S],w=d[p+1][S+1];(p!==0||a>0)&&u.push(E,y,w),(p!==n-1||c<Math.PI)&&u.push(y,R,w)}this.setIndex(u),this.setAttribute("position",new Qt(g,3)),this.setAttribute("normal",new Qt(_,3)),this.setAttribute("uv",new Qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Ye=class extends pi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new vt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new vt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=th,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Po=class extends pi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Io=class extends pi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function ao(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Np(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ws=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Do=class extends ws{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ac,endingEnd:Ac}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Rc:r=t,o=2*e-n;break;case Cc:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Rc:a=t,c=2*n-e;break;case Cc:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}let l=(n-e)*.5,d=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,u=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,p=-f*m+2*f*_-f*g,S=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,E=(-1-u)*m+(1.5+u)*_+.5*g,y=u*m-u*_;for(let R=0;R!==o;++R)r[R]=p*a[d+R]+S*a[l+R]+E*a[c+R]+y*a[h+R];return r}},Lo=class extends ws{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=(n-e)/(s-e),h=1-d;for(let f=0;f!==o;++f)r[f]=a[l+f]*h+a[c+f]*d;return r}},Uo=class extends ws{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Vn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ao(e,this.TimeBufferType),this.values=ao(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ao(t.times,Array),values:ao(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Uo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Lo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Do(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case qr:e=this.InterpolantFactoryMethodDiscrete;break;case fo:e=this.InterpolantFactoryMethodLinear;break;case oo:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qr;case this.InterpolantFactoryMethodLinear:return fo;case this.InterpolantFactoryMethodSmooth:return oo}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&Np(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===oo,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],d=t[o+1];if(l!==d&&(o!==1||l!==t[0]))if(s)c=!0;else{let h=o*n,f=h-n,u=h+n;for(let g=0;g!==n;++g){let _=e[h+g];if(_!==e[f+g]||_!==e[u+g]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let h=o*n,f=a*n;for(let u=0;u!==n;++u)e[f+u]=e[h+u]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Vn.prototype.ValueTypeName="";Vn.prototype.TimeBufferType=Float32Array;Vn.prototype.ValueBufferType=Float32Array;Vn.prototype.DefaultInterpolation=fo;var is=class extends Vn{constructor(t,e,n){super(t,e,n)}};is.prototype.ValueTypeName="bool";is.prototype.ValueBufferType=Array;is.prototype.DefaultInterpolation=qr;is.prototype.InterpolantFactoryMethodLinear=void 0;is.prototype.InterpolantFactoryMethodSmooth=void 0;var No=class extends Vn{constructor(t,e,n,s){super(t,e,n,s)}};No.prototype.ValueTypeName="color";var Fo=class extends Vn{constructor(t,e,n,s){super(t,e,n,s)}};Fo.prototype.ValueTypeName="number";var Oo=class extends ws{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e),l=t*o;for(let d=l+o;l!==d;l+=4)Pn.slerpFlat(r,0,a,l-o,a,l,c);return r}},fa=class extends Vn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Oo(this.times,this.values,this.getValueSize(),t)}};fa.prototype.ValueTypeName="quaternion";fa.prototype.InterpolantFactoryMethodSmooth=void 0;var ss=class extends Vn{constructor(t,e,n){super(t,e,n)}};ss.prototype.ValueTypeName="string";ss.prototype.ValueBufferType=Array;ss.prototype.DefaultInterpolation=qr;ss.prototype.InterpolantFactoryMethodLinear=void 0;ss.prototype.InterpolantFactoryMethodSmooth=void 0;var Bo=class extends Vn{constructor(t,e,n,s){super(t,e,n,s)}};Bo.prototype.ValueTypeName="vector";var zo=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,h){return l.push(d,h),this},this.removeHandler=function(d){let h=l.indexOf(d);return h!==-1&&l.splice(h,2),this},this.getHandler=function(d){for(let h=0,f=l.length;h<f;h+=2){let u=l[h],g=l[h+1];if(u.global&&(u.lastIndex=0),u.test(d))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Rd=new zo,ko=class{constructor(t){this.manager=t!==void 0?t:Rd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};ko.DEFAULT_MATERIAL_NAME="__DEFAULT";var pa=class extends Ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new vt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},ma=class extends pa{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new vt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},wc=new ue,Iu=new L,Du=new L,Fc=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.mapType=ai,this.map=null,this.mapPass=null,this.matrix=new ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lr,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new Ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Iu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Iu),Du.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Du),e.updateMatrixWorld(),wc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(wc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var As=class extends Qr{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Oc=class extends Fc{constructor(){super(new As(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},mr=class extends pa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ve.DEFAULT_UP),this.updateMatrix(),this.target=new Ve,this.shadow=new Oc}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Ho=class extends yn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var oh="\\[\\]\\.:\\/",Fp=new RegExp("["+oh+"]","g"),lh="[^"+oh+"]",Op="[^"+oh.replace("\\.","")+"]",Bp=/((?:WC+[\/:])*)/.source.replace("WC",lh),zp=/(WCOD+)?/.source.replace("WCOD",Op),kp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",lh),Hp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",lh),Vp=new RegExp("^"+Bp+zp+kp+Hp+"$"),Gp=["material","materials","bones","map"],Bc=class{constructor(t,e,n){let s=n||Re.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Re=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Fp,"")}static parseTrackName(t){let e=Vp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Gp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let d=0;d<t.length;d++)if(t[d].name===l){l=d;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Re.Composite=Bc;Re.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Re.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Re.prototype.GetterByBindingType=[Re.prototype._getValue_direct,Re.prototype._getValue_array,Re.prototype._getValue_arrayElement,Re.prototype._getValue_toArray];Re.prototype.SetterByBindingTypeAndVersioning=[[Re.prototype._setValue_direct,Re.prototype._setValue_direct_setNeedsUpdate,Re.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Re.prototype._setValue_array,Re.prototype._setValue_array_setNeedsUpdate,Re.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Re.prototype._setValue_arrayElement,Re.prototype._setValue_arrayElement_setNeedsUpdate,Re.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Re.prototype._setValue_fromArray,Re.prototype._setValue_fromArray_setNeedsUpdate,Re.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Gx=new Float32Array(1);var Lu=new ue,ga=class{constructor(t,e,n=0,s=1/0){this.ray=new Ci(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new sr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Lu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Lu),this}intersectObject(t,e=!0,n=[]){return zc(t,this,n,e),n.sort(Uu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)zc(t[s],this,n,e);return n.sort(Uu),n}};function Uu(i,t){return i.distance-t.distance}function zc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)zc(r[a],t,e,!0)}}var Li=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=ne(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(ne(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var _a=class extends ui{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function ch(i,t,e,n){let s=Wp(n);switch(e){case Kc:return i*t;case il:return i*t/s.components*s.byteLength;case sl:return i*t/s.components*s.byteLength;case Qc:return i*t*2/s.components*s.byteLength;case rl:return i*t*2/s.components*s.byteLength;case jc:return i*t*3/s.components*s.byteLength;case Zn:return i*t*4/s.components*s.byteLength;case al:return i*t*4/s.components*s.byteLength;case va:case Ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Sa:case ba:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ll:case hl:return Math.max(i,16)*Math.max(t,8)/4;case ol:case cl:return Math.max(i,8)*Math.max(t,8)/2;case ul:case dl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case fl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case pl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ml:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case gl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case _l:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case xl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case yl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case vl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ml:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Sl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case bl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case El:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Tl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case wl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Al:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Rl:case Cl:case Pl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Il:case Dl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ll:case Ul:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Wp(i){switch(i){case ai:case Yc:return{byteLength:1,components:1};case gr:case $c:case _r:return{byteLength:2,components:1};case el:case nl:return{byteLength:2,components:4};case as:case tl:case oi:return{byteLength:4,components:1};case Zc:case Jc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function jd(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function qp(i){let t=new WeakMap;function e(o,c){let l=o.array,d=o.usage,h=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let u;if(l instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)u=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=i.SHORT;else if(l instanceof Uint32Array)u=i.UNSIGNED_INT;else if(l instanceof Int32Array)u=i.INT;else if(l instanceof Int8Array)u=i.BYTE;else if(l instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,c,l){let d=c.array,h=c.updateRanges;if(i.bindBuffer(l,o),h.length===0)i.bufferSubData(l,0,d);else{h.sort((u,g)=>u.start-g.start);let f=0;for(let u=1;u<h.length;u++){let g=h[f],_=h[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,h[f]=_)}h.length=f+1;for(let u=0,g=h.length;u<g;u++){let _=h[u];i.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Yp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$p=`#ifdef USE_ALPHAHASH
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
#endif`,Zp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,jp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qp=`#ifdef USE_AOMAP
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
#endif`,em=`#ifdef USE_BATCHING
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
#endif`,nm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,im=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rm=`float G_BlinnPhong_Implicit( ) {
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
#endif`,om=`#ifdef USE_BUMPMAP
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
#endif`,lm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,cm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,um=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,pm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,mm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,gm=`#define PI 3.141592653589793
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
} // validated`,_m=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,xm=`vec3 transformedNormal = objectNormal;
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
#endif`,ym=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,bm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Em=`vec4 LinearTransferOETF( in vec4 value ) {
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
#endif`,wm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Am=`#ifdef USE_ENVMAP
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
#endif`,Rm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cm=`#ifdef USE_ENVMAP
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
#endif`,Pm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Im=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Um=`#ifdef USE_GRADIENTMAP
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
}`,Nm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Fm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Om=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bm=`uniform bool receiveShadow;
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
#endif`,zm=`#ifdef USE_ENVMAP
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
#endif`,km=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Vm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wm=`PhysicalMaterial material;
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
#endif`,Xm=`struct PhysicalMaterial {
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
}`,qm=`
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
#endif`,Ym=`#if defined( RE_IndirectDiffuse )
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
#endif`,$m=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Km=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,eg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ng=`#if defined( USE_POINTS_UV )
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
#endif`,ig=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rg=`#ifdef USE_INSTANCING_MORPH
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
#endif`,og=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lg=`#ifdef USE_MORPHTARGETS
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
#endif`,cg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ug=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,dg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mg=`#ifdef USE_NORMALMAP
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
#endif`,gg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_g=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Sg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Eg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ag=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Cg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Pg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ig=`float getShadowMask() {
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
#endif`,Lg=`#ifdef USE_SKINNING
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
#endif`,Ug=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ng=`#ifdef USE_SKINNING
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
#endif`,Fg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Og=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,kg=`#ifdef USE_TRANSMISSION
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
#endif`,Hg=`#ifdef USE_TRANSMISSION
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
#endif`,Vg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,qg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Yg=`uniform sampler2D t2D;
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
}`,$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jg=`#include <common>
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
}`,Qg=`#if DEPTH_PACKING == 3200
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
}`,e0=`#define DISTANCE
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
}`,n0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,i0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s0=`uniform float scale;
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
}`,r0=`uniform vec3 diffuse;
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
}`,o0=`uniform vec3 diffuse;
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
}`,l0=`#define LAMBERT
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
}`,c0=`#define LAMBERT
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
}`,h0=`#define MATCAP
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
}`,u0=`#define MATCAP
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
}`,d0=`#define NORMAL
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
}`,f0=`#define NORMAL
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
}`,p0=`#define PHONG
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
}`,m0=`#define PHONG
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
}`,g0=`#define STANDARD
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
}`,_0=`#define STANDARD
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
}`,x0=`#define TOON
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
}`,y0=`#define TOON
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
}`,v0=`uniform float size;
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
}`,M0=`uniform vec3 diffuse;
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
}`,S0=`#include <common>
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
}`,b0=`uniform vec3 color;
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
}`,E0=`uniform float rotation;
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
}`,ie={alphahash_fragment:Yp,alphahash_pars_fragment:$p,alphamap_fragment:Zp,alphamap_pars_fragment:Jp,alphatest_fragment:Kp,alphatest_pars_fragment:jp,aomap_fragment:Qp,aomap_pars_fragment:tm,batching_pars_vertex:em,batching_vertex:nm,begin_vertex:im,beginnormal_vertex:sm,bsdfs:rm,iridescence_fragment:am,bumpmap_pars_fragment:om,clipping_planes_fragment:lm,clipping_planes_pars_fragment:cm,clipping_planes_pars_vertex:hm,clipping_planes_vertex:um,color_fragment:dm,color_pars_fragment:fm,color_pars_vertex:pm,color_vertex:mm,common:gm,cube_uv_reflection_fragment:_m,defaultnormal_vertex:xm,displacementmap_pars_vertex:ym,displacementmap_vertex:vm,emissivemap_fragment:Mm,emissivemap_pars_fragment:Sm,colorspace_fragment:bm,colorspace_pars_fragment:Em,envmap_fragment:Tm,envmap_common_pars_fragment:wm,envmap_pars_fragment:Am,envmap_pars_vertex:Rm,envmap_physical_pars_fragment:zm,envmap_vertex:Cm,fog_vertex:Pm,fog_pars_vertex:Im,fog_fragment:Dm,fog_pars_fragment:Lm,gradientmap_pars_fragment:Um,lightmap_pars_fragment:Nm,lights_lambert_fragment:Fm,lights_lambert_pars_fragment:Om,lights_pars_begin:Bm,lights_toon_fragment:km,lights_toon_pars_fragment:Hm,lights_phong_fragment:Vm,lights_phong_pars_fragment:Gm,lights_physical_fragment:Wm,lights_physical_pars_fragment:Xm,lights_fragment_begin:qm,lights_fragment_maps:Ym,lights_fragment_end:$m,logdepthbuf_fragment:Zm,logdepthbuf_pars_fragment:Jm,logdepthbuf_pars_vertex:Km,logdepthbuf_vertex:jm,map_fragment:Qm,map_pars_fragment:tg,map_particle_fragment:eg,map_particle_pars_fragment:ng,metalnessmap_fragment:ig,metalnessmap_pars_fragment:sg,morphinstance_vertex:rg,morphcolor_vertex:ag,morphnormal_vertex:og,morphtarget_pars_vertex:lg,morphtarget_vertex:cg,normal_fragment_begin:hg,normal_fragment_maps:ug,normal_pars_fragment:dg,normal_pars_vertex:fg,normal_vertex:pg,normalmap_pars_fragment:mg,clearcoat_normal_fragment_begin:gg,clearcoat_normal_fragment_maps:_g,clearcoat_pars_fragment:xg,iridescence_pars_fragment:yg,opaque_fragment:vg,packing:Mg,premultiplied_alpha_fragment:Sg,project_vertex:bg,dithering_fragment:Eg,dithering_pars_fragment:Tg,roughnessmap_fragment:wg,roughnessmap_pars_fragment:Ag,shadowmap_pars_fragment:Rg,shadowmap_pars_vertex:Cg,shadowmap_vertex:Pg,shadowmask_pars_fragment:Ig,skinbase_vertex:Dg,skinning_pars_vertex:Lg,skinning_vertex:Ug,skinnormal_vertex:Ng,specularmap_fragment:Fg,specularmap_pars_fragment:Og,tonemapping_fragment:Bg,tonemapping_pars_fragment:zg,transmission_fragment:kg,transmission_pars_fragment:Hg,uv_pars_fragment:Vg,uv_pars_vertex:Gg,uv_vertex:Wg,worldpos_vertex:Xg,background_vert:qg,background_frag:Yg,backgroundCube_vert:$g,backgroundCube_frag:Zg,cube_vert:Jg,cube_frag:Kg,depth_vert:jg,depth_frag:Qg,distanceRGBA_vert:t0,distanceRGBA_frag:e0,equirect_vert:n0,equirect_frag:i0,linedashed_vert:s0,linedashed_frag:r0,meshbasic_vert:a0,meshbasic_frag:o0,meshlambert_vert:l0,meshlambert_frag:c0,meshmatcap_vert:h0,meshmatcap_frag:u0,meshnormal_vert:d0,meshnormal_frag:f0,meshphong_vert:p0,meshphong_frag:m0,meshphysical_vert:g0,meshphysical_frag:_0,meshtoon_vert:x0,meshtoon_frag:y0,points_vert:v0,points_frag:M0,shadow_vert:S0,shadow_frag:b0,sprite_vert:E0,sprite_frag:T0},Mt={common:{diffuse:{value:new vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ee}},envmap:{envMap:{value:null},envMapRotation:{value:new ee},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ee},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0},uvTransform:{value:new ee}},sprite:{diffuse:{value:new vt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}}},xi={basic:{uniforms:Mn([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.fog]),vertexShader:ie.meshbasic_vert,fragmentShader:ie.meshbasic_frag},lambert:{uniforms:Mn([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new vt(0)}}]),vertexShader:ie.meshlambert_vert,fragmentShader:ie.meshlambert_frag},phong:{uniforms:Mn([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new vt(0)},specular:{value:new vt(1118481)},shininess:{value:30}}]),vertexShader:ie.meshphong_vert,fragmentShader:ie.meshphong_frag},standard:{uniforms:Mn([Mt.common,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.roughnessmap,Mt.metalnessmap,Mt.fog,Mt.lights,{emissive:{value:new vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag},toon:{uniforms:Mn([Mt.common,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.gradientmap,Mt.fog,Mt.lights,{emissive:{value:new vt(0)}}]),vertexShader:ie.meshtoon_vert,fragmentShader:ie.meshtoon_frag},matcap:{uniforms:Mn([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,{matcap:{value:null}}]),vertexShader:ie.meshmatcap_vert,fragmentShader:ie.meshmatcap_frag},points:{uniforms:Mn([Mt.points,Mt.fog]),vertexShader:ie.points_vert,fragmentShader:ie.points_frag},dashed:{uniforms:Mn([Mt.common,Mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ie.linedashed_vert,fragmentShader:ie.linedashed_frag},depth:{uniforms:Mn([Mt.common,Mt.displacementmap]),vertexShader:ie.depth_vert,fragmentShader:ie.depth_frag},normal:{uniforms:Mn([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,{opacity:{value:1}}]),vertexShader:ie.meshnormal_vert,fragmentShader:ie.meshnormal_frag},sprite:{uniforms:Mn([Mt.sprite,Mt.fog]),vertexShader:ie.sprite_vert,fragmentShader:ie.sprite_frag},background:{uniforms:{uvTransform:{value:new ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ie.background_vert,fragmentShader:ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ee}},vertexShader:ie.backgroundCube_vert,fragmentShader:ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ie.cube_vert,fragmentShader:ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ie.equirect_vert,fragmentShader:ie.equirect_frag},distanceRGBA:{uniforms:Mn([Mt.common,Mt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ie.distanceRGBA_vert,fragmentShader:ie.distanceRGBA_frag},shadow:{uniforms:Mn([Mt.lights,Mt.fog,{color:{value:new vt(0)},opacity:{value:1}}]),vertexShader:ie.shadow_vert,fragmentShader:ie.shadow_frag}};xi.physical={uniforms:Mn([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ee},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ee},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ee},sheen:{value:0},sheenColor:{value:new vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ee},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ee},attenuationDistance:{value:0},attenuationColor:{value:new vt(0)},specularColor:{value:new vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ee},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ee}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag};var Nl={r:0,b:0,g:0},Ds=new zn,w0=new ue;function A0(i,t,e,n,s,r,a){let o=new vt(0),c=r===!0?0:1,l,d,h=null,f=0,u=null;function g(E){let y=E.isScene===!0?E.background:null;return y&&y.isTexture&&(y=(E.backgroundBlurriness>0?e:t).get(y)),y}function _(E){let y=!1,R=g(E);R===null?p(o,c):R&&R.isColor&&(p(R,1),y=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,y){let R=g(y);R&&(R.isCubeTexture||R.mapping===xa)?(d===void 0&&(d=new te(new qn(1,1,1),new In({name:"BackgroundCubeMaterial",uniforms:Is(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(w,A,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Ds.copy(y.backgroundRotation),Ds.x*=-1,Ds.y*=-1,Ds.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Ds.y*=-1,Ds.z*=-1),d.material.uniforms.envMap.value=R,d.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(w0.makeRotationFromEuler(Ds)),d.material.toneMapped=he.getTransfer(R.colorSpace)!==ye,(h!==R||f!==R.version||u!==i.toneMapping)&&(d.material.needsUpdate=!0,h=R,f=R.version,u=i.toneMapping),d.layers.enableAll(),E.unshift(d,d.geometry,d.material,0,0,null)):R&&R.isTexture&&(l===void 0&&(l=new te(new Ii(2,2),new In({name:"BackgroundMaterial",uniforms:Is(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:Ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=R,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=he.getTransfer(R.colorSpace)!==ye,R.matrixAutoUpdate===!0&&R.updateMatrix(),l.material.uniforms.uvTransform.value.copy(R.matrix),(h!==R||f!==R.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=R,f=R.version,u=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function p(E,y){E.getRGB(Nl,rh(i)),n.buffers.color.setClear(Nl.r,Nl.g,Nl.b,y,a)}function S(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,y=1){o.set(E),c=y,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(E){c=E,p(o,c)},render:_,addToRenderList:m,dispose:S}}function R0(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,a=!1;function o(x,P,O,F,k){let Y=!1,q=h(F,O,P);r!==q&&(r=q,l(r.object)),Y=u(x,F,O,k),Y&&g(x,F,O,k),k!==null&&t.update(k,i.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,y(x,P,O,F),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function c(){return i.createVertexArray()}function l(x){return i.bindVertexArray(x)}function d(x){return i.deleteVertexArray(x)}function h(x,P,O){let F=O.wireframe===!0,k=n[x.id];k===void 0&&(k={},n[x.id]=k);let Y=k[P.id];Y===void 0&&(Y={},k[P.id]=Y);let q=Y[F];return q===void 0&&(q=f(c()),Y[F]=q),q}function f(x){let P=[],O=[],F=[];for(let k=0;k<e;k++)P[k]=0,O[k]=0,F[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:O,attributeDivisors:F,object:x,attributes:{},index:null}}function u(x,P,O,F){let k=r.attributes,Y=P.attributes,q=0,nt=O.getAttributes();for(let G in nt)if(nt[G].location>=0){let gt=k[G],dt=Y[G];if(dt===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(dt=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(dt=x.instanceColor)),gt===void 0||gt.attribute!==dt||dt&&gt.data!==dt.data)return!0;q++}return r.attributesNum!==q||r.index!==F}function g(x,P,O,F){let k={},Y=P.attributes,q=0,nt=O.getAttributes();for(let G in nt)if(nt[G].location>=0){let gt=Y[G];gt===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(gt=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(gt=x.instanceColor));let dt={};dt.attribute=gt,gt&&gt.data&&(dt.data=gt.data),k[G]=dt,q++}r.attributes=k,r.attributesNum=q,r.index=F}function _(){let x=r.newAttributes;for(let P=0,O=x.length;P<O;P++)x[P]=0}function m(x){p(x,0)}function p(x,P){let O=r.newAttributes,F=r.enabledAttributes,k=r.attributeDivisors;O[x]=1,F[x]===0&&(i.enableVertexAttribArray(x),F[x]=1),k[x]!==P&&(i.vertexAttribDivisor(x,P),k[x]=P)}function S(){let x=r.newAttributes,P=r.enabledAttributes;for(let O=0,F=P.length;O<F;O++)P[O]!==x[O]&&(i.disableVertexAttribArray(O),P[O]=0)}function E(x,P,O,F,k,Y,q){q===!0?i.vertexAttribIPointer(x,P,O,k,Y):i.vertexAttribPointer(x,P,O,F,k,Y)}function y(x,P,O,F){_();let k=F.attributes,Y=O.getAttributes(),q=P.defaultAttributeValues;for(let nt in Y){let G=Y[nt];if(G.location>=0){let ht=k[nt];if(ht===void 0&&(nt==="instanceMatrix"&&x.instanceMatrix&&(ht=x.instanceMatrix),nt==="instanceColor"&&x.instanceColor&&(ht=x.instanceColor)),ht!==void 0){let gt=ht.normalized,dt=ht.itemSize,Xt=t.get(ht);if(Xt===void 0)continue;let Kt=Xt.buffer,me=Xt.type,jt=Xt.bytesPerElement,Q=me===i.INT||me===i.UNSIGNED_INT||ht.gpuType===tl;if(ht.isInterleavedBufferAttribute){let tt=ht.data,Et=tt.stride,$t=ht.offset;if(tt.isInstancedInterleavedBuffer){for(let Ut=0;Ut<G.locationSize;Ut++)p(G.location+Ut,tt.meshPerAttribute);x.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let Ut=0;Ut<G.locationSize;Ut++)m(G.location+Ut);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let Ut=0;Ut<G.locationSize;Ut++)E(G.location+Ut,dt/G.locationSize,me,gt,Et*jt,($t+dt/G.locationSize*Ut)*jt,Q)}else{if(ht.isInstancedBufferAttribute){for(let tt=0;tt<G.locationSize;tt++)p(G.location+tt,ht.meshPerAttribute);x.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let tt=0;tt<G.locationSize;tt++)m(G.location+tt);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let tt=0;tt<G.locationSize;tt++)E(G.location+tt,dt/G.locationSize,me,gt,dt*jt,dt/G.locationSize*tt*jt,Q)}}else if(q!==void 0){let gt=q[nt];if(gt!==void 0)switch(gt.length){case 2:i.vertexAttrib2fv(G.location,gt);break;case 3:i.vertexAttrib3fv(G.location,gt);break;case 4:i.vertexAttrib4fv(G.location,gt);break;default:i.vertexAttrib1fv(G.location,gt)}}}}S()}function R(){I();for(let x in n){let P=n[x];for(let O in P){let F=P[O];for(let k in F)d(F[k].object),delete F[k];delete P[O]}delete n[x]}}function w(x){if(n[x.id]===void 0)return;let P=n[x.id];for(let O in P){let F=P[O];for(let k in F)d(F[k].object),delete F[k];delete P[O]}delete n[x.id]}function A(x){for(let P in n){let O=n[P];if(O[x.id]===void 0)continue;let F=O[x.id];for(let k in F)d(F[k].object),delete F[k];delete O[x.id]}}function I(){M(),a=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:M,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function C0(i,t,e){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function a(l,d,h){h!==0&&(i.drawArraysInstanced(n,l,d,h),e.update(d,n,h))}function o(l,d,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,h);let u=0;for(let g=0;g<h;g++)u+=d[g];e.update(u,n,1)}function c(l,d,h,f){if(h===0)return;let u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)a(l[g],d[g],f[g]);else{u.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,h);let g=0;for(let _=0;_<h;_++)g+=d[_]*f[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function P0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Zn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let I=A===_r&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==ai&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==oi&&!I)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);let h=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:y,vertexTextures:R,maxSamples:w}}function I0(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Xn,o=new ee,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let u=h.length!==0||f||n!==0||s;return s=f,n=h.length,u},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){e=d(h,f,0)},this.setState=function(h,f,u){let g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?d(null):l();else{let S=r?0:n,E=S*4,y=p.clippingState||null;c.value=y,y=d(g,f,E,u);for(let R=0;R!==E;++R)y[R]=e[R];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(h,f,u,g){let _=h!==null?h.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let p=u+_*4,S=f.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,y=u;E!==_;++E,y+=4)a.copy(h[E]).applyMatrix4(S,o),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function D0(i){let t=new WeakMap;function e(a,o){return o===Ko?a.mapping=Rs:o===jo&&(a.mapping=Cs),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===Ko||o===jo)if(t.has(a)){let c=t.get(a).texture;return e(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new xo(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Sr=4,Cd=[.125,.215,.35,.446,.526,.582],Ns=20,hh=new As,Pd=new vt,uh=null,dh=0,fh=0,ph=!1,Us=(1+Math.sqrt(5))/2,Mr=1/Us,Id=[new L(-Us,Mr,0),new L(Us,Mr,0),new L(-Mr,0,Us),new L(Mr,0,Us),new L(0,Us,-Mr),new L(0,Us,Mr),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],L0=new L,Bl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=L0}=r;uh=this._renderer.getRenderTarget(),dh=this._renderer.getActiveCubeFace(),fh=this._renderer.getActiveMipmapLevel(),ph=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ud(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ld(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(uh,dh,fh),this._renderer.xr.enabled=ph,t.scissorTest=!1,Fl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Rs||t.mapping===Cs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),uh=this._renderer.getRenderTarget(),dh=this._renderer.getActiveCubeFace(),fh=this._renderer.getActiveMipmapLevel(),ph=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ii,minFilter:ii,generateMipmaps:!1,type:_r,format:Zn,colorSpace:Ms,depthBuffer:!1},s=Dd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dd(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=U0(r)),this._blurMaterial=N0(r,t,e)}return s}_compileMaterial(t){let e=new te(this._lodPlanes[0],t);this._renderer.compile(e,hh)}_sceneToCubeUV(t,e,n,s,r){let c=new yn(90,1,e,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(Pd),h.toneMapping=Ni,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));let _=new kn({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1}),m=new te(new qn,_),p=!1,S=t.background;S?S.isColor&&(_.color.copy(S),t.background=null,p=!0):(_.color.copy(Pd),p=!0);for(let E=0;E<6;E++){let y=E%3;y===0?(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[E],r.y,r.z)):y===1?(c.up.set(0,0,l[E]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[E],r.z)):(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[E]));let R=this._cubeSize;Fl(s,y*R,E>2?R:0,R,R),h.setRenderTarget(s),p&&h.render(m,c),h.render(t,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=S}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Rs||t.mapping===Cs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ud()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ld());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new te(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;Fl(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,hh)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Id[(s-r-1)%Id.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let d=3,h=new te(this._lodPlanes[s],l),f=l.uniforms,u=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*Ns-1),_=r/g,m=isFinite(r)?1+Math.floor(d*_):Ns;m>Ns&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ns}`);let p=[],S=0;for(let A=0;A<Ns;++A){let I=A/_,M=Math.exp(-I*I/2);p.push(M),A===0?S+=M:A<m&&(S+=2*M)}for(let A=0;A<p.length;A++)p[A]=p[A]/S;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:E}=this;f.dTheta.value=g,f.mipInt.value=E-n;let y=this._sizeLods[s],R=3*y*(s>E-Sr?s-E+Sr:0),w=4*(this._cubeSize-y);Fl(e,R,w,3*y,2*y),c.setRenderTarget(e),c.render(h,hh)}};function U0(i){let t=[],e=[],n=[],s=i,r=i-Sr+1+Cd.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Sr?c=Cd[a-i+Sr-1]:a===0&&(c=0),n.push(c);let l=1/(o-2),d=-l,h=1+l,f=[d,d,h,d,h,h,d,d,h,h,d,h],u=6,g=6,_=3,m=2,p=1,S=new Float32Array(_*g*u),E=new Float32Array(m*g*u),y=new Float32Array(p*g*u);for(let w=0;w<u;w++){let A=w%3*2/3-1,I=w>2?0:-1,M=[A,I,0,A+2/3,I,0,A+2/3,I+1,0,A,I,0,A+2/3,I+1,0,A,I+1,0];S.set(M,_*g*w),E.set(f,m*g*w);let x=[w,w,w,w,w,w];y.set(x,p*g*w)}let R=new xe;R.setAttribute("position",new on(S,_)),R.setAttribute("uv",new on(E,m)),R.setAttribute("faceIndex",new on(y,p)),t.push(R),s>Sr&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Dd(i,t,e){let n=new Bn(i,t,e);return n.texture.mapping=xa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Fl(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function N0(i,t,e){let n=new Float32Array(Ns),s=new L(0,1,0);return new In({name:"SphericalGaussianBlur",defines:{n:Ns,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Eh(),fragmentShader:`

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
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function Ld(){return new In({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Eh(),fragmentShader:`

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
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function Ud(){return new In({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ui,depthTest:!1,depthWrite:!1})}function Eh(){return`

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
	`}function F0(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===Ko||c===jo,d=c===Rs||c===Cs;if(l||d){let h=t.get(o),f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new Bl(i)),h=l?e.fromEquirectangular(o,h):e.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{let u=o.image;return l&&u&&u.height>0||d&&u&&s(u)?(e===null&&(e=new Bl(i)),h=l?e.fromEquirectangular(o):e.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let c=0,l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function O0(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&nr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function B0(i,t,e,n){let s={},r=new WeakMap;function a(h){let f=h.target;f.index!==null&&t.remove(f.index);for(let g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];let u=r.get(f);u&&(t.remove(u),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(h){let f=h.attributes;for(let u in f)t.update(f[u],i.ARRAY_BUFFER)}function l(h){let f=[],u=h.index,g=h.attributes.position,_=0;if(u!==null){let S=u.array;_=u.version;for(let E=0,y=S.length;E<y;E+=3){let R=S[E+0],w=S[E+1],A=S[E+2];f.push(R,w,w,A,A,R)}}else if(g!==void 0){let S=g.array;_=g.version;for(let E=0,y=S.length/3-1;E<y;E+=3){let R=E+0,w=E+1,A=E+2;f.push(R,w,w,A,A,R)}}else return;let m=new(sh(f)?jr:Kr)(f,1);m.version=_;let p=r.get(h);p&&t.remove(p),r.set(h,m)}function d(h){let f=r.get(h);if(f){let u=h.index;u!==null&&f.version<u.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:d}}function z0(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,u){i.drawElements(n,u,r,f*a),e.update(u,n,1)}function l(f,u,g){g!==0&&(i.drawElementsInstanced(n,u,r,f*a,g),e.update(u,n,g))}function d(f,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,n,1)}function h(f,u,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/a,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,u,0,r,f,0,_,0,g);let p=0;for(let S=0;S<g;S++)p+=u[S]*_[S];e.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function k0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function H0(i,t,e){let n=new WeakMap,s=new Ce;function r(a,o,c){let l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0,f=n.get(o);if(f===void 0||f.count!==h){let M=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();let u=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],E=0;u===!0&&(E=1),g===!0&&(E=2),_===!0&&(E=3);let y=o.attributes.position.count*E,R=1;y>t.maxTextureSize&&(R=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let w=new Float32Array(y*R*4*h),A=new Jr(w,y,R,h);A.type=oi,A.needsUpdate=!0;let I=E*4;for(let x=0;x<h;x++){let P=m[x],O=p[x],F=S[x],k=y*R*4*x;for(let Y=0;Y<P.count;Y++){let q=Y*I;u===!0&&(s.fromBufferAttribute(P,Y),w[k+q+0]=s.x,w[k+q+1]=s.y,w[k+q+2]=s.z,w[k+q+3]=0),g===!0&&(s.fromBufferAttribute(O,Y),w[k+q+4]=s.x,w[k+q+5]=s.y,w[k+q+6]=s.z,w[k+q+7]=0),_===!0&&(s.fromBufferAttribute(F,Y),w[k+q+8]=s.x,w[k+q+9]=s.y,w[k+q+10]=s.z,w[k+q+11]=F.itemSize===4?s.w:1)}}f={count:h,texture:A,size:new ut(y,R)},n.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let u=0;for(let _=0;_<l.length;_++)u+=l[_];let g=o.morphTargetsRelative?1:1-u;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function V0(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,d=c.geometry,h=t.get(c,d);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return h}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}var Qd=new wn,Nd=new bs(1,1),tf=new Jr,ef=new go,nf=new ta,Fd=[],Od=[],Bd=new Float32Array(16),zd=new Float32Array(9),kd=new Float32Array(4);function Er(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Fd[s];if(r===void 0&&(r=new Float32Array(s),Fd[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ke(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function je(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function kl(i,t){let e=Od[t];e===void 0&&(e=new Int32Array(t),Od[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function G0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function W0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ke(e,t))return;i.uniform2fv(this.addr,t),je(e,t)}}function X0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ke(e,t))return;i.uniform3fv(this.addr,t),je(e,t)}}function q0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ke(e,t))return;i.uniform4fv(this.addr,t),je(e,t)}}function Y0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ke(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),je(e,t)}else{if(Ke(e,n))return;kd.set(n),i.uniformMatrix2fv(this.addr,!1,kd),je(e,n)}}function $0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ke(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),je(e,t)}else{if(Ke(e,n))return;zd.set(n),i.uniformMatrix3fv(this.addr,!1,zd),je(e,n)}}function Z0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ke(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),je(e,t)}else{if(Ke(e,n))return;Bd.set(n),i.uniformMatrix4fv(this.addr,!1,Bd),je(e,n)}}function J0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function K0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ke(e,t))return;i.uniform2iv(this.addr,t),je(e,t)}}function j0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ke(e,t))return;i.uniform3iv(this.addr,t),je(e,t)}}function Q0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ke(e,t))return;i.uniform4iv(this.addr,t),je(e,t)}}function t_(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function e_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ke(e,t))return;i.uniform2uiv(this.addr,t),je(e,t)}}function n_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ke(e,t))return;i.uniform3uiv(this.addr,t),je(e,t)}}function i_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ke(e,t))return;i.uniform4uiv(this.addr,t),je(e,t)}}function s_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Nd.compareFunction=eh,r=Nd):r=Qd,e.setTexture2D(t||r,s)}function r_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ef,s)}function a_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||nf,s)}function o_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||tf,s)}function l_(i){switch(i){case 5126:return G0;case 35664:return W0;case 35665:return X0;case 35666:return q0;case 35674:return Y0;case 35675:return $0;case 35676:return Z0;case 5124:case 35670:return J0;case 35667:case 35671:return K0;case 35668:case 35672:return j0;case 35669:case 35673:return Q0;case 5125:return t_;case 36294:return e_;case 36295:return n_;case 36296:return i_;case 35678:case 36198:case 36298:case 36306:case 35682:return s_;case 35679:case 36299:case 36307:return r_;case 35680:case 36300:case 36308:case 36293:return a_;case 36289:case 36303:case 36311:case 36292:return o_}}function c_(i,t){i.uniform1fv(this.addr,t)}function h_(i,t){let e=Er(t,this.size,2);i.uniform2fv(this.addr,e)}function u_(i,t){let e=Er(t,this.size,3);i.uniform3fv(this.addr,e)}function d_(i,t){let e=Er(t,this.size,4);i.uniform4fv(this.addr,e)}function f_(i,t){let e=Er(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function p_(i,t){let e=Er(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function m_(i,t){let e=Er(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function g_(i,t){i.uniform1iv(this.addr,t)}function __(i,t){i.uniform2iv(this.addr,t)}function x_(i,t){i.uniform3iv(this.addr,t)}function y_(i,t){i.uniform4iv(this.addr,t)}function v_(i,t){i.uniform1uiv(this.addr,t)}function M_(i,t){i.uniform2uiv(this.addr,t)}function S_(i,t){i.uniform3uiv(this.addr,t)}function b_(i,t){i.uniform4uiv(this.addr,t)}function E_(i,t,e){let n=this.cache,s=t.length,r=kl(e,s);Ke(n,r)||(i.uniform1iv(this.addr,r),je(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Qd,r[a])}function T_(i,t,e){let n=this.cache,s=t.length,r=kl(e,s);Ke(n,r)||(i.uniform1iv(this.addr,r),je(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||ef,r[a])}function w_(i,t,e){let n=this.cache,s=t.length,r=kl(e,s);Ke(n,r)||(i.uniform1iv(this.addr,r),je(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||nf,r[a])}function A_(i,t,e){let n=this.cache,s=t.length,r=kl(e,s);Ke(n,r)||(i.uniform1iv(this.addr,r),je(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||tf,r[a])}function R_(i){switch(i){case 5126:return c_;case 35664:return h_;case 35665:return u_;case 35666:return d_;case 35674:return f_;case 35675:return p_;case 35676:return m_;case 5124:case 35670:return g_;case 35667:case 35671:return __;case 35668:case 35672:return x_;case 35669:case 35673:return y_;case 5125:return v_;case 36294:return M_;case 36295:return S_;case 36296:return b_;case 35678:case 36198:case 36298:case 36306:case 35682:return E_;case 35679:case 36299:case 36307:return T_;case 35680:case 36300:case 36308:case 36293:return w_;case 36289:case 36303:case 36311:case 36292:return A_}}var gh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=l_(e.type)}},_h=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=R_(e.type)}},xh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},mh=/(\w+)(\])?(\[|\.)?/g;function Hd(i,t){i.seq.push(t),i.map[t.id]=t}function C_(i,t,e){let n=i.name,s=n.length;for(mh.lastIndex=0;;){let r=mh.exec(n),a=mh.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Hd(e,l===void 0?new gh(o,i,t):new _h(o,i,t));break}else{let h=e.map[o];h===void 0&&(h=new xh(o),Hd(e,h)),e=h}}}var br=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);C_(r,a,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function Vd(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var P_=37297,I_=0;function D_(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var Gd=new ee;function L_(i){he._getMatrix(Gd,he.workingColorSpace,i);let t=`mat3( ${Gd.elements.map(e=>e.toFixed(4))} )`;switch(he.getTransfer(i)){case Yr:return[t,"LinearTransferOETF"];case ye:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Wd(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+D_(i.getShaderSource(t),o)}else return r}function U_(i,t){let e=L_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function N_(i,t){let e;switch(t){case id:e="Linear";break;case sd:e="Reinhard";break;case rd:e="Cineon";break;case ad:e="ACESFilmic";break;case ld:e="AgX";break;case Jo:e="Neutral";break;case od:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Ol=new L;function F_(){he.getLuminanceCoefficients(Ol);let i=Ol.x.toFixed(4),t=Ol.y.toFixed(4),e=Ol.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function O_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ea).join(`
`)}function B_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function z_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ea(i){return i!==""}function Xd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var k_=/^[ \t]*#include +<([\w\d./]+)>/gm;function yh(i){return i.replace(k_,V_)}var H_=new Map;function V_(i,t){let e=ie[t];if(e===void 0){let n=H_.get(t);if(n!==void 0)e=ie[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return yh(e)}var G_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yd(i){return i.replace(G_,W_)}function W_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $d(i){let t=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function X_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Hc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Vo?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===_i&&(t="SHADOWMAP_TYPE_VSM"),t}function q_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Rs:case Cs:t="ENVMAP_TYPE_CUBE";break;case xa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Y_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Cs:t="ENVMAP_MODE_REFRACTION";break}return t}function $_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Xc:t="ENVMAP_BLENDING_MULTIPLY";break;case ed:t="ENVMAP_BLENDING_MIX";break;case nd:t="ENVMAP_BLENDING_ADD";break}return t}function Z_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function J_(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=X_(e),l=q_(e),d=Y_(e),h=$_(e),f=Z_(e),u=O_(e),g=B_(r),_=s.createProgram(),m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ea).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ea).join(`
`),p.length>0&&(p+=`
`)):(m=[$d(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ea).join(`
`),p=[$d(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ni?"#define TONE_MAPPING":"",e.toneMapping!==Ni?ie.tonemapping_pars_fragment:"",e.toneMapping!==Ni?N_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ie.colorspace_pars_fragment,U_("linearToOutputTexel",e.outputColorSpace),F_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ea).join(`
`)),a=yh(a),a=Xd(a,e),a=qd(a,e),o=yh(o),o=Xd(o,e),o=qd(o,e),a=Yd(a),o=Yd(o),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let E=S+m+a,y=S+p+o,R=Vd(s,s.VERTEX_SHADER,E),w=Vd(s,s.FRAGMENT_SHADER,y);s.attachShader(_,R),s.attachShader(_,w),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(P){if(i.debug.checkShaderErrors){let O=s.getProgramInfoLog(_)||"",F=s.getShaderInfoLog(R)||"",k=s.getShaderInfoLog(w)||"",Y=O.trim(),q=F.trim(),nt=k.trim(),G=!0,ht=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,R,w);else{let gt=Wd(s,R,"vertex"),dt=Wd(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+Y+`
`+gt+`
`+dt)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(q===""||nt==="")&&(ht=!1);ht&&(P.diagnostics={runnable:G,programLog:Y,vertexShader:{log:q,prefix:m},fragmentShader:{log:nt,prefix:p}})}s.deleteShader(R),s.deleteShader(w),I=new br(s,_),M=z_(s,_)}let I;this.getUniforms=function(){return I===void 0&&A(this),I};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(_,P_)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=I_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=w,this}var K_=0,vh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Mh(t),e.set(t,n)),n}},Mh=class{constructor(t){this.id=K_++,this.code=t,this.usedTimes=0}};function j_(i,t,e,n,s,r,a){let o=new sr,c=new vh,l=new Set,d=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures,u=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,x,P,O,F){let k=O.fog,Y=F.geometry,q=M.isMeshStandardMaterial?O.environment:null,nt=(M.isMeshStandardMaterial?e:t).get(M.envMap||q),G=nt&&nt.mapping===xa?nt.image.height:null,ht=g[M.type];M.precision!==null&&(u=s.getMaxPrecision(M.precision),u!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",u,"instead."));let gt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,dt=gt!==void 0?gt.length:0,Xt=0;Y.morphAttributes.position!==void 0&&(Xt=1),Y.morphAttributes.normal!==void 0&&(Xt=2),Y.morphAttributes.color!==void 0&&(Xt=3);let Kt,me,jt,Q;if(ht){let j=xi[ht];Kt=j.vertexShader,me=j.fragmentShader}else Kt=M.vertexShader,me=M.fragmentShader,c.update(M),jt=c.getVertexShaderID(M),Q=c.getFragmentShaderID(M);let tt=i.getRenderTarget(),Et=i.state.buffers.depth.getReversed(),$t=F.isInstancedMesh===!0,Ut=F.isBatchedMesh===!0,se=!!M.map,de=!!M.matcap,N=!!nt,Se=!!M.aoMap,Rt=!!M.lightMap,qt=!!M.bumpMap,bt=!!M.normalMap,be=!!M.displacementMap,Ct=!!M.emissiveMap,Jt=!!M.metalnessMap,Ue=!!M.roughnessMap,fe=M.anisotropy>0,C=M.clearcoat>0,v=M.dispersion>0,H=M.iridescence>0,K=M.sheen>0,it=M.transmission>0,J=fe&&!!M.anisotropyMap,Nt=C&&!!M.clearcoatMap,ct=C&&!!M.clearcoatNormalMap,Lt=C&&!!M.clearcoatRoughnessMap,At=H&&!!M.iridescenceMap,at=H&&!!M.iridescenceThicknessMap,xt=K&&!!M.sheenColorMap,Wt=K&&!!M.sheenRoughnessMap,Pt=!!M.specularMap,mt=!!M.specularColorMap,Ot=!!M.specularIntensityMap,U=it&&!!M.transmissionMap,st=it&&!!M.thicknessMap,ft=!!M.gradientMap,Tt=!!M.alphaMap,rt=M.alphaTest>0,et=!!M.alphaHash,It=!!M.extensions,Zt=Ni;M.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Zt=i.toneMapping);let ve={shaderID:ht,shaderType:M.type,shaderName:M.name,vertexShader:Kt,fragmentShader:me,defines:M.defines,customVertexShaderID:jt,customFragmentShaderID:Q,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:u,batching:Ut,batchingColor:Ut&&F._colorsTexture!==null,instancing:$t,instancingColor:$t&&F.instanceColor!==null,instancingMorph:$t&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:tt===null?i.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:Ms,alphaToCoverage:!!M.alphaToCoverage,map:se,matcap:de,envMap:N,envMapMode:N&&nt.mapping,envMapCubeUVHeight:G,aoMap:Se,lightMap:Rt,bumpMap:qt,normalMap:bt,displacementMap:f&&be,emissiveMap:Ct,normalMapObjectSpace:bt&&M.normalMapType===dd,normalMapTangentSpace:bt&&M.normalMapType===th,metalnessMap:Jt,roughnessMap:Ue,anisotropy:fe,anisotropyMap:J,clearcoat:C,clearcoatMap:Nt,clearcoatNormalMap:ct,clearcoatRoughnessMap:Lt,dispersion:v,iridescence:H,iridescenceMap:At,iridescenceThicknessMap:at,sheen:K,sheenColorMap:xt,sheenRoughnessMap:Wt,specularMap:Pt,specularColorMap:mt,specularIntensityMap:Ot,transmission:it,transmissionMap:U,thicknessMap:st,gradientMap:ft,opaque:M.transparent===!1&&M.blending===ys&&M.alphaToCoverage===!1,alphaMap:Tt,alphaTest:rt,alphaHash:et,combine:M.combine,mapUv:se&&_(M.map.channel),aoMapUv:Se&&_(M.aoMap.channel),lightMapUv:Rt&&_(M.lightMap.channel),bumpMapUv:qt&&_(M.bumpMap.channel),normalMapUv:bt&&_(M.normalMap.channel),displacementMapUv:be&&_(M.displacementMap.channel),emissiveMapUv:Ct&&_(M.emissiveMap.channel),metalnessMapUv:Jt&&_(M.metalnessMap.channel),roughnessMapUv:Ue&&_(M.roughnessMap.channel),anisotropyMapUv:J&&_(M.anisotropyMap.channel),clearcoatMapUv:Nt&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:ct&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Lt&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:At&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:at&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:xt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Wt&&_(M.sheenRoughnessMap.channel),specularMapUv:Pt&&_(M.specularMap.channel),specularColorMapUv:mt&&_(M.specularColorMap.channel),specularIntensityMapUv:Ot&&_(M.specularIntensityMap.channel),transmissionMapUv:U&&_(M.transmissionMap.channel),thicknessMapUv:st&&_(M.thicknessMap.channel),alphaMapUv:Tt&&_(M.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(bt||fe),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!Y.attributes.uv&&(se||Tt),fog:!!k,useFog:M.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Et,skinning:F.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:dt,morphTextureStride:Xt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Zt,decodeVideoTexture:se&&M.map.isVideoTexture===!0&&he.getTransfer(M.map.colorSpace)===ye,decodeVideoTextureEmissive:Ct&&M.emissiveMap.isVideoTexture===!0&&he.getTransfer(M.emissiveMap.colorSpace)===ye,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===vn,flipSided:M.side===dn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:It&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(It&&M.extensions.multiDraw===!0||Ut)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ve.vertexUv1s=l.has(1),ve.vertexUv2s=l.has(2),ve.vertexUv3s=l.has(3),l.clear(),ve}function p(M){let x=[];if(M.shaderID?x.push(M.shaderID):(x.push(M.customVertexShaderID),x.push(M.customFragmentShaderID)),M.defines!==void 0)for(let P in M.defines)x.push(P),x.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(S(x,M),E(x,M),x.push(i.outputColorSpace)),x.push(M.customProgramCacheKey),x.join()}function S(M,x){M.push(x.precision),M.push(x.outputColorSpace),M.push(x.envMapMode),M.push(x.envMapCubeUVHeight),M.push(x.mapUv),M.push(x.alphaMapUv),M.push(x.lightMapUv),M.push(x.aoMapUv),M.push(x.bumpMapUv),M.push(x.normalMapUv),M.push(x.displacementMapUv),M.push(x.emissiveMapUv),M.push(x.metalnessMapUv),M.push(x.roughnessMapUv),M.push(x.anisotropyMapUv),M.push(x.clearcoatMapUv),M.push(x.clearcoatNormalMapUv),M.push(x.clearcoatRoughnessMapUv),M.push(x.iridescenceMapUv),M.push(x.iridescenceThicknessMapUv),M.push(x.sheenColorMapUv),M.push(x.sheenRoughnessMapUv),M.push(x.specularMapUv),M.push(x.specularColorMapUv),M.push(x.specularIntensityMapUv),M.push(x.transmissionMapUv),M.push(x.thicknessMapUv),M.push(x.combine),M.push(x.fogExp2),M.push(x.sizeAttenuation),M.push(x.morphTargetsCount),M.push(x.morphAttributeCount),M.push(x.numDirLights),M.push(x.numPointLights),M.push(x.numSpotLights),M.push(x.numSpotLightMaps),M.push(x.numHemiLights),M.push(x.numRectAreaLights),M.push(x.numDirLightShadows),M.push(x.numPointLightShadows),M.push(x.numSpotLightShadows),M.push(x.numSpotLightShadowsWithMaps),M.push(x.numLightProbes),M.push(x.shadowMapType),M.push(x.toneMapping),M.push(x.numClippingPlanes),M.push(x.numClipIntersection),M.push(x.depthPacking)}function E(M,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),M.push(o.mask)}function y(M){let x=g[M.type],P;if(x){let O=xi[x];P=bd.clone(O.uniforms)}else P=M.uniforms;return P}function R(M,x){let P;for(let O=0,F=d.length;O<F;O++){let k=d[O];if(k.cacheKey===x){P=k,++P.usedTimes;break}}return P===void 0&&(P=new J_(i,x,M,r),d.push(P)),P}function w(M){if(--M.usedTimes===0){let x=d.indexOf(M);d[x]=d[d.length-1],d.pop(),M.destroy()}}function A(M){c.remove(M)}function I(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:R,releaseProgram:w,releaseShaderCache:A,programs:d,dispose:I}}function Q_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function tx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Zd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Jd(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h,f,u,g,_,m){let p=i[t];return p===void 0?(p={id:h.id,object:h,geometry:f,material:u,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},i[t]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=u,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),t++,p}function o(h,f,u,g,_,m){let p=a(h,f,u,g,_,m);u.transmission>0?n.push(p):u.transparent===!0?s.push(p):e.push(p)}function c(h,f,u,g,_,m){let p=a(h,f,u,g,_,m);u.transmission>0?n.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function l(h,f){e.length>1&&e.sort(h||tx),n.length>1&&n.sort(f||Zd),s.length>1&&s.sort(f||Zd)}function d(){for(let h=t,f=i.length;h<f;h++){let u=i[h];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function ex(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new Jd,i.set(n,[a])):s>=r.length?(a=new Jd,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function nx(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new vt};break;case"SpotLight":e={position:new L,direction:new L,color:new vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new vt,groundColor:new vt};break;case"RectAreaLight":e={color:new vt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function ix(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var sx=0;function rx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function ax(i){let t=new nx,e=ix(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);let s=new L,r=new ue,a=new ue;function o(l){let d=0,h=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,S=0,E=0,y=0,R=0,w=0,A=0;l.sort(rx);for(let M=0,x=l.length;M<x;M++){let P=l[M],O=P.color,F=P.intensity,k=P.distance,Y=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=O.r*F,h+=O.g*F,f+=O.b*F;else if(P.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(P.sh.coefficients[q],F);A++}else if(P.isDirectionalLight){let q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let nt=P.shadow,G=e.get(P);G.shadowIntensity=nt.intensity,G.shadowBias=nt.bias,G.shadowNormalBias=nt.normalBias,G.shadowRadius=nt.radius,G.shadowMapSize=nt.mapSize,n.directionalShadow[u]=G,n.directionalShadowMap[u]=Y,n.directionalShadowMatrix[u]=P.shadow.matrix,S++}n.directional[u]=q,u++}else if(P.isSpotLight){let q=t.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(O).multiplyScalar(F),q.distance=k,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,n.spot[_]=q;let nt=P.shadow;if(P.map&&(n.spotLightMap[R]=P.map,R++,nt.updateMatrices(P),P.castShadow&&w++),n.spotLightMatrix[_]=nt.matrix,P.castShadow){let G=e.get(P);G.shadowIntensity=nt.intensity,G.shadowBias=nt.bias,G.shadowNormalBias=nt.normalBias,G.shadowRadius=nt.radius,G.shadowMapSize=nt.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=Y,y++}_++}else if(P.isRectAreaLight){let q=t.get(P);q.color.copy(O).multiplyScalar(F),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=q,m++}else if(P.isPointLight){let q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){let nt=P.shadow,G=e.get(P);G.shadowIntensity=nt.intensity,G.shadowBias=nt.bias,G.shadowNormalBias=nt.normalBias,G.shadowRadius=nt.radius,G.shadowMapSize=nt.mapSize,G.shadowCameraNear=nt.camera.near,G.shadowCameraFar=nt.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=Y,n.pointShadowMatrix[g]=P.shadow.matrix,E++}n.point[g]=q,g++}else if(P.isHemisphereLight){let q=t.get(P);q.skyColor.copy(P.color).multiplyScalar(F),q.groundColor.copy(P.groundColor).multiplyScalar(F),n.hemi[p]=q,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Mt.LTC_FLOAT_1,n.rectAreaLTC2=Mt.LTC_FLOAT_2):(n.rectAreaLTC1=Mt.LTC_HALF_1,n.rectAreaLTC2=Mt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=f;let I=n.hash;(I.directionalLength!==u||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==p||I.numDirectionalShadows!==S||I.numPointShadows!==E||I.numSpotShadows!==y||I.numSpotMaps!==R||I.numLightProbes!==A)&&(n.directional.length=u,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=y+R-w,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,I.directionalLength=u,I.pointLength=g,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=p,I.numDirectionalShadows=S,I.numPointShadows=E,I.numSpotShadows=y,I.numSpotMaps=R,I.numLightProbes=A,n.version=sx++)}function c(l,d){let h=0,f=0,u=0,g=0,_=0,m=d.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){let E=l[p];if(E.isDirectionalLight){let y=n.directional[h];y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),h++}else if(E.isSpotLight){let y=n.spot[u];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(E.isRectAreaLight){let y=n.rectArea[g];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(E.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(E.width*.5,0,0),y.halfHeight.set(0,E.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){let y=n.point[f];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),f++}else if(E.isHemisphereLight){let y=n.hemi[_];y.direction.setFromMatrixPosition(E.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function Kd(i){let t=new ax(i),e=[],n=[];function s(d){l.camera=d,e.length=0,n.length=0}function r(d){e.push(d)}function a(d){n.push(d)}function o(){t.setup(e)}function c(d){t.setupView(e,d)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function ox(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new Kd(i),t.set(s,[o])):r>=a.length?(o=new Kd(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var lx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cx=`uniform sampler2D shadow_pass;
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
}`;function hx(i,t,e){let n=new lr,s=new ut,r=new ut,a=new Ce,o=new Po({depthPacking:ud}),c=new Io,l={},d=e.maxTextureSize,h={[Ri]:dn,[dn]:Ri,[vn]:vn},f=new In({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:lx,fragmentShader:cx}),u=f.clone();u.defines.HORIZONTAL_PASS=1;let g=new xe;g.setAttribute("position",new on(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new te(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hc;let p=this.type;this.render=function(w,A,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let M=i.getRenderTarget(),x=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Ui),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let F=p!==_i&&this.type===_i,k=p===_i&&this.type!==_i;for(let Y=0,q=w.length;Y<q;Y++){let nt=w[Y],G=nt.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",nt,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let ht=G.getFrameExtents();if(s.multiply(ht),r.copy(G.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ht.x),s.x=r.x*ht.x,G.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ht.y),s.y=r.y*ht.y,G.mapSize.y=r.y)),G.map===null||F===!0||k===!0){let dt=this.type!==_i?{minFilter:Cn,magFilter:Cn}:{};G.map!==null&&G.map.dispose(),G.map=new Bn(s.x,s.y,dt),G.map.texture.name=nt.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let gt=G.getViewportCount();for(let dt=0;dt<gt;dt++){let Xt=G.getViewport(dt);a.set(r.x*Xt.x,r.y*Xt.y,r.x*Xt.z,r.y*Xt.w),O.viewport(a),G.updateMatrices(nt,dt),n=G.getFrustum(),y(A,I,G.camera,nt,this.type)}G.isPointLightShadow!==!0&&this.type===_i&&S(G,I),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,x,P)};function S(w,A){let I=t.update(_);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,u.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,u.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Bn(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,I,f,_,null),u.uniforms.shadow_pass.value=w.mapPass.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,I,u,_,null)}function E(w,A,I,M){let x=null,P=I.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)x=P;else if(x=I.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let O=x.uuid,F=A.uuid,k=l[O];k===void 0&&(k={},l[O]=k);let Y=k[F];Y===void 0&&(Y=x.clone(),k[F]=Y,A.addEventListener("dispose",R)),x=Y}if(x.visible=A.visible,x.wireframe=A.wireframe,M===_i?x.side=A.shadowSide!==null?A.shadowSide:A.side:x.side=A.shadowSide!==null?A.shadowSide:h[A.side],x.alphaMap=A.alphaMap,x.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,x.map=A.map,x.clipShadows=A.clipShadows,x.clippingPlanes=A.clippingPlanes,x.clipIntersection=A.clipIntersection,x.displacementMap=A.displacementMap,x.displacementScale=A.displacementScale,x.displacementBias=A.displacementBias,x.wireframeLinewidth=A.wireframeLinewidth,x.linewidth=A.linewidth,I.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let O=i.properties.get(x);O.light=I}return x}function y(w,A,I,M,x){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&x===_i)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,w.matrixWorld);let F=t.update(w),k=w.material;if(Array.isArray(k)){let Y=F.groups;for(let q=0,nt=Y.length;q<nt;q++){let G=Y[q],ht=k[G.materialIndex];if(ht&&ht.visible){let gt=E(w,ht,M,x);w.onBeforeShadow(i,w,A,I,F,gt,G),i.renderBufferDirect(I,null,F,gt,w,G),w.onAfterShadow(i,w,A,I,F,gt,G)}}}else if(k.visible){let Y=E(w,k,M,x);w.onBeforeShadow(i,w,A,I,F,Y,null),i.renderBufferDirect(I,null,F,Y,w,null),w.onAfterShadow(i,w,A,I,F,Y,null)}}let O=w.children;for(let F=0,k=O.length;F<k;F++)y(O[F],A,I,M,x)}function R(w){w.target.removeEventListener("dispose",R);for(let I in l){let M=l[I],x=w.target.uuid;x in M&&(M[x].dispose(),delete M[x])}}}var ux={[Go]:Wo,[Xo]:$o,[qo]:Zo,[vs]:Yo,[Wo]:Go,[$o]:Xo,[Zo]:qo,[Yo]:vs};function dx(i,t){function e(){let U=!1,st=new Ce,ft=null,Tt=new Ce(0,0,0,0);return{setMask:function(rt){ft!==rt&&!U&&(i.colorMask(rt,rt,rt,rt),ft=rt)},setLocked:function(rt){U=rt},setClear:function(rt,et,It,Zt,ve){ve===!0&&(rt*=Zt,et*=Zt,It*=Zt),st.set(rt,et,It,Zt),Tt.equals(st)===!1&&(i.clearColor(rt,et,It,Zt),Tt.copy(st))},reset:function(){U=!1,ft=null,Tt.set(-1,0,0,0)}}}function n(){let U=!1,st=!1,ft=null,Tt=null,rt=null;return{setReversed:function(et){if(st!==et){let It=t.get("EXT_clip_control");et?It.clipControlEXT(It.LOWER_LEFT_EXT,It.ZERO_TO_ONE_EXT):It.clipControlEXT(It.LOWER_LEFT_EXT,It.NEGATIVE_ONE_TO_ONE_EXT),st=et;let Zt=rt;rt=null,this.setClear(Zt)}},getReversed:function(){return st},setTest:function(et){et?tt(i.DEPTH_TEST):Et(i.DEPTH_TEST)},setMask:function(et){ft!==et&&!U&&(i.depthMask(et),ft=et)},setFunc:function(et){if(st&&(et=ux[et]),Tt!==et){switch(et){case Go:i.depthFunc(i.NEVER);break;case Wo:i.depthFunc(i.ALWAYS);break;case Xo:i.depthFunc(i.LESS);break;case vs:i.depthFunc(i.LEQUAL);break;case qo:i.depthFunc(i.EQUAL);break;case Yo:i.depthFunc(i.GEQUAL);break;case $o:i.depthFunc(i.GREATER);break;case Zo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Tt=et}},setLocked:function(et){U=et},setClear:function(et){rt!==et&&(st&&(et=1-et),i.clearDepth(et),rt=et)},reset:function(){U=!1,ft=null,Tt=null,rt=null,st=!1}}}function s(){let U=!1,st=null,ft=null,Tt=null,rt=null,et=null,It=null,Zt=null,ve=null;return{setTest:function(j){U||(j?tt(i.STENCIL_TEST):Et(i.STENCIL_TEST))},setMask:function(j){st!==j&&!U&&(i.stencilMask(j),st=j)},setFunc:function(j,Ge,Ze){(ft!==j||Tt!==Ge||rt!==Ze)&&(i.stencilFunc(j,Ge,Ze),ft=j,Tt=Ge,rt=Ze)},setOp:function(j,Ge,Ze){(et!==j||It!==Ge||Zt!==Ze)&&(i.stencilOp(j,Ge,Ze),et=j,It=Ge,Zt=Ze)},setLocked:function(j){U=j},setClear:function(j){ve!==j&&(i.clearStencil(j),ve=j)},reset:function(){U=!1,st=null,ft=null,Tt=null,rt=null,et=null,It=null,Zt=null,ve=null}}}let r=new e,a=new n,o=new s,c=new WeakMap,l=new WeakMap,d={},h={},f=new WeakMap,u=[],g=null,_=!1,m=null,p=null,S=null,E=null,y=null,R=null,w=null,A=new vt(0,0,0),I=0,M=!1,x=null,P=null,O=null,F=null,k=null,Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,nt=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(nt=parseFloat(/^WebGL (\d)/.exec(G)[1]),q=nt>=1):G.indexOf("OpenGL ES")!==-1&&(nt=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),q=nt>=2);let ht=null,gt={},dt=i.getParameter(i.SCISSOR_BOX),Xt=i.getParameter(i.VIEWPORT),Kt=new Ce().fromArray(dt),me=new Ce().fromArray(Xt);function jt(U,st,ft,Tt){let rt=new Uint8Array(4),et=i.createTexture();i.bindTexture(U,et),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let It=0;It<ft;It++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(st,0,i.RGBA,1,1,Tt,0,i.RGBA,i.UNSIGNED_BYTE,rt):i.texImage2D(st+It,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,rt);return et}let Q={};Q[i.TEXTURE_2D]=jt(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=jt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=jt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=jt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),tt(i.DEPTH_TEST),a.setFunc(vs),qt(!1),bt(kc),tt(i.CULL_FACE),Se(Ui);function tt(U){d[U]!==!0&&(i.enable(U),d[U]=!0)}function Et(U){d[U]!==!1&&(i.disable(U),d[U]=!1)}function $t(U,st){return h[U]!==st?(i.bindFramebuffer(U,st),h[U]=st,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=st),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=st),!0):!1}function Ut(U,st){let ft=u,Tt=!1;if(U){ft=f.get(st),ft===void 0&&(ft=[],f.set(st,ft));let rt=U.textures;if(ft.length!==rt.length||ft[0]!==i.COLOR_ATTACHMENT0){for(let et=0,It=rt.length;et<It;et++)ft[et]=i.COLOR_ATTACHMENT0+et;ft.length=rt.length,Tt=!0}}else ft[0]!==i.BACK&&(ft[0]=i.BACK,Tt=!0);Tt&&i.drawBuffers(ft)}function se(U){return g!==U?(i.useProgram(U),g=U,!0):!1}let de={[es]:i.FUNC_ADD,[Bu]:i.FUNC_SUBTRACT,[zu]:i.FUNC_REVERSE_SUBTRACT};de[ku]=i.MIN,de[Hu]=i.MAX;let N={[Vu]:i.ZERO,[Gu]:i.ONE,[Wu]:i.SRC_COLOR,[lo]:i.SRC_ALPHA,[Ju]:i.SRC_ALPHA_SATURATE,[$u]:i.DST_COLOR,[qu]:i.DST_ALPHA,[Xu]:i.ONE_MINUS_SRC_COLOR,[co]:i.ONE_MINUS_SRC_ALPHA,[Zu]:i.ONE_MINUS_DST_COLOR,[Yu]:i.ONE_MINUS_DST_ALPHA,[Ku]:i.CONSTANT_COLOR,[ju]:i.ONE_MINUS_CONSTANT_COLOR,[Qu]:i.CONSTANT_ALPHA,[td]:i.ONE_MINUS_CONSTANT_ALPHA};function Se(U,st,ft,Tt,rt,et,It,Zt,ve,j){if(U===Ui){_===!0&&(Et(i.BLEND),_=!1);return}if(_===!1&&(tt(i.BLEND),_=!0),U!==Ou){if(U!==m||j!==M){if((p!==es||y!==es)&&(i.blendEquation(i.FUNC_ADD),p=es,y=es),j)switch(U){case ys:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Vc:i.blendFunc(i.ONE,i.ONE);break;case Gc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Wc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case ys:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Vc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Gc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Wc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}S=null,E=null,R=null,w=null,A.set(0,0,0),I=0,m=U,M=j}return}rt=rt||st,et=et||ft,It=It||Tt,(st!==p||rt!==y)&&(i.blendEquationSeparate(de[st],de[rt]),p=st,y=rt),(ft!==S||Tt!==E||et!==R||It!==w)&&(i.blendFuncSeparate(N[ft],N[Tt],N[et],N[It]),S=ft,E=Tt,R=et,w=It),(Zt.equals(A)===!1||ve!==I)&&(i.blendColor(Zt.r,Zt.g,Zt.b,ve),A.copy(Zt),I=ve),m=U,M=!1}function Rt(U,st){U.side===vn?Et(i.CULL_FACE):tt(i.CULL_FACE);let ft=U.side===dn;st&&(ft=!ft),qt(ft),U.blending===ys&&U.transparent===!1?Se(Ui):Se(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);let Tt=U.stencilWrite;o.setTest(Tt),Tt&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Ct(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?tt(i.SAMPLE_ALPHA_TO_COVERAGE):Et(i.SAMPLE_ALPHA_TO_COVERAGE)}function qt(U){x!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),x=U)}function bt(U){U!==Nu?(tt(i.CULL_FACE),U!==P&&(U===kc?i.cullFace(i.BACK):U===Fu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Et(i.CULL_FACE),P=U}function be(U){U!==O&&(q&&i.lineWidth(U),O=U)}function Ct(U,st,ft){U?(tt(i.POLYGON_OFFSET_FILL),(F!==st||k!==ft)&&(i.polygonOffset(st,ft),F=st,k=ft)):Et(i.POLYGON_OFFSET_FILL)}function Jt(U){U?tt(i.SCISSOR_TEST):Et(i.SCISSOR_TEST)}function Ue(U){U===void 0&&(U=i.TEXTURE0+Y-1),ht!==U&&(i.activeTexture(U),ht=U)}function fe(U,st,ft){ft===void 0&&(ht===null?ft=i.TEXTURE0+Y-1:ft=ht);let Tt=gt[ft];Tt===void 0&&(Tt={type:void 0,texture:void 0},gt[ft]=Tt),(Tt.type!==U||Tt.texture!==st)&&(ht!==ft&&(i.activeTexture(ft),ht=ft),i.bindTexture(U,st||Q[U]),Tt.type=U,Tt.texture=st)}function C(){let U=gt[ht];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function H(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function it(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Nt(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ct(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Lt(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function At(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function at(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function xt(U){Kt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Kt.copy(U))}function Wt(U){me.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),me.copy(U))}function Pt(U,st){let ft=l.get(st);ft===void 0&&(ft=new WeakMap,l.set(st,ft));let Tt=ft.get(U);Tt===void 0&&(Tt=i.getUniformBlockIndex(st,U.name),ft.set(U,Tt))}function mt(U,st){let Tt=l.get(st).get(U);c.get(st)!==Tt&&(i.uniformBlockBinding(st,Tt,U.__bindingPointIndex),c.set(st,Tt))}function Ot(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ht=null,gt={},h={},f=new WeakMap,u=[],g=null,_=!1,m=null,p=null,S=null,E=null,y=null,R=null,w=null,A=new vt(0,0,0),I=0,M=!1,x=null,P=null,O=null,F=null,k=null,Kt.set(0,0,i.canvas.width,i.canvas.height),me.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:tt,disable:Et,bindFramebuffer:$t,drawBuffers:Ut,useProgram:se,setBlending:Se,setMaterial:Rt,setFlipSided:qt,setCullFace:bt,setLineWidth:be,setPolygonOffset:Ct,setScissorTest:Jt,activeTexture:Ue,bindTexture:fe,unbindTexture:C,compressedTexImage2D:v,compressedTexImage3D:H,texImage2D:At,texImage3D:at,updateUBOMapping:Pt,uniformBlockBinding:mt,texStorage2D:ct,texStorage3D:Lt,texSubImage2D:K,texSubImage3D:it,compressedTexSubImage2D:J,compressedTexSubImage3D:Nt,scissor:xt,viewport:Wt,reset:Ot}}function fx(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ut,d=new WeakMap,h,f=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,v){return u?new OffscreenCanvas(C,v):Zr("canvas")}function _(C,v,H){let K=1,it=fe(C);if((it.width>H||it.height>H)&&(K=H/Math.max(it.width,it.height)),K<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let J=Math.floor(K*it.width),Nt=Math.floor(K*it.height);h===void 0&&(h=g(J,Nt));let ct=v?g(J,Nt):h;return ct.width=J,ct.height=Nt,ct.getContext("2d").drawImage(C,0,0,J,Nt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+it.width+"x"+it.height+") to ("+J+"x"+Nt+")."),ct}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+it.width+"x"+it.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){i.generateMipmap(C)}function S(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(C,v,H,K,it=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let J=v;if(v===i.RED&&(H===i.FLOAT&&(J=i.R32F),H===i.HALF_FLOAT&&(J=i.R16F),H===i.UNSIGNED_BYTE&&(J=i.R8)),v===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(J=i.R8UI),H===i.UNSIGNED_SHORT&&(J=i.R16UI),H===i.UNSIGNED_INT&&(J=i.R32UI),H===i.BYTE&&(J=i.R8I),H===i.SHORT&&(J=i.R16I),H===i.INT&&(J=i.R32I)),v===i.RG&&(H===i.FLOAT&&(J=i.RG32F),H===i.HALF_FLOAT&&(J=i.RG16F),H===i.UNSIGNED_BYTE&&(J=i.RG8)),v===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(J=i.RG8UI),H===i.UNSIGNED_SHORT&&(J=i.RG16UI),H===i.UNSIGNED_INT&&(J=i.RG32UI),H===i.BYTE&&(J=i.RG8I),H===i.SHORT&&(J=i.RG16I),H===i.INT&&(J=i.RG32I)),v===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(J=i.RGB8UI),H===i.UNSIGNED_SHORT&&(J=i.RGB16UI),H===i.UNSIGNED_INT&&(J=i.RGB32UI),H===i.BYTE&&(J=i.RGB8I),H===i.SHORT&&(J=i.RGB16I),H===i.INT&&(J=i.RGB32I)),v===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),H===i.UNSIGNED_INT&&(J=i.RGBA32UI),H===i.BYTE&&(J=i.RGBA8I),H===i.SHORT&&(J=i.RGBA16I),H===i.INT&&(J=i.RGBA32I)),v===i.RGB&&(H===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),v===i.RGBA){let Nt=it?Yr:he.getTransfer(K);H===i.FLOAT&&(J=i.RGBA32F),H===i.HALF_FLOAT&&(J=i.RGBA16F),H===i.UNSIGNED_BYTE&&(J=Nt===ye?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function y(C,v){let H;return C?v===null||v===as||v===xr?H=i.DEPTH24_STENCIL8:v===oi?H=i.DEPTH32F_STENCIL8:v===gr&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===as||v===xr?H=i.DEPTH_COMPONENT24:v===oi?H=i.DEPTH_COMPONENT32F:v===gr&&(H=i.DEPTH_COMPONENT16),H}function R(C,v){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Cn&&C.minFilter!==ii?Math.log2(Math.max(v.width,v.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?v.mipmaps.length:1}function w(C){let v=C.target;v.removeEventListener("dispose",w),I(v),v.isVideoTexture&&d.delete(v)}function A(C){let v=C.target;v.removeEventListener("dispose",A),x(v)}function I(C){let v=n.get(C);if(v.__webglInit===void 0)return;let H=C.source,K=f.get(H);if(K){let it=K[v.__cacheKey];it.usedTimes--,it.usedTimes===0&&M(C),Object.keys(K).length===0&&f.delete(H)}n.remove(C)}function M(C){let v=n.get(C);i.deleteTexture(v.__webglTexture);let H=C.source,K=f.get(H);delete K[v.__cacheKey],a.memory.textures--}function x(C){let v=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(v.__webglFramebuffer[K]))for(let it=0;it<v.__webglFramebuffer[K].length;it++)i.deleteFramebuffer(v.__webglFramebuffer[K][it]);else i.deleteFramebuffer(v.__webglFramebuffer[K]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[K])}else{if(Array.isArray(v.__webglFramebuffer))for(let K=0;K<v.__webglFramebuffer.length;K++)i.deleteFramebuffer(v.__webglFramebuffer[K]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let K=0;K<v.__webglColorRenderbuffer.length;K++)v.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[K]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let H=C.textures;for(let K=0,it=H.length;K<it;K++){let J=n.get(H[K]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),a.memory.textures--),n.remove(H[K])}n.remove(C)}let P=0;function O(){P=0}function F(){let C=P;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),P+=1,C}function k(C){let v=[];return v.push(C.wrapS),v.push(C.wrapT),v.push(C.wrapR||0),v.push(C.magFilter),v.push(C.minFilter),v.push(C.anisotropy),v.push(C.internalFormat),v.push(C.format),v.push(C.type),v.push(C.generateMipmaps),v.push(C.premultiplyAlpha),v.push(C.flipY),v.push(C.unpackAlignment),v.push(C.colorSpace),v.join()}function Y(C,v){let H=n.get(C);if(C.isVideoTexture&&Jt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&H.__version!==C.version){let K=C.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(H,C,v);return}}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+v)}function q(C,v){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){Q(H,C,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+v)}function nt(C,v){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){Q(H,C,v);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+v)}function G(C,v){let H=n.get(C);if(C.version>0&&H.__version!==C.version){tt(H,C,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+v)}let ht={[ho]:i.REPEAT,[ts]:i.CLAMP_TO_EDGE,[uo]:i.MIRRORED_REPEAT},gt={[Cn]:i.NEAREST,[cd]:i.NEAREST_MIPMAP_NEAREST,[ya]:i.NEAREST_MIPMAP_LINEAR,[ii]:i.LINEAR,[Qo]:i.LINEAR_MIPMAP_NEAREST,[rs]:i.LINEAR_MIPMAP_LINEAR},dt={[fd]:i.NEVER,[yd]:i.ALWAYS,[pd]:i.LESS,[eh]:i.LEQUAL,[md]:i.EQUAL,[xd]:i.GEQUAL,[gd]:i.GREATER,[_d]:i.NOTEQUAL};function Xt(C,v){if(v.type===oi&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===ii||v.magFilter===Qo||v.magFilter===ya||v.magFilter===rs||v.minFilter===ii||v.minFilter===Qo||v.minFilter===ya||v.minFilter===rs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,ht[v.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,ht[v.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,ht[v.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,gt[v.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,gt[v.minFilter]),v.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,dt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Cn||v.minFilter!==ya&&v.minFilter!==rs||v.type===oi&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Kt(C,v){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,v.addEventListener("dispose",w));let K=v.source,it=f.get(K);it===void 0&&(it={},f.set(K,it));let J=k(v);if(J!==C.__cacheKey){it[J]===void 0&&(it[J]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),it[J].usedTimes++;let Nt=it[C.__cacheKey];Nt!==void 0&&(it[C.__cacheKey].usedTimes--,Nt.usedTimes===0&&M(v)),C.__cacheKey=J,C.__webglTexture=it[J].texture}return H}function me(C,v,H){return Math.floor(Math.floor(C/H)/v)}function jt(C,v,H,K){let J=C.updateRanges;if(J.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,H,K,v.data);else{J.sort((at,xt)=>at.start-xt.start);let Nt=0;for(let at=1;at<J.length;at++){let xt=J[Nt],Wt=J[at],Pt=xt.start+xt.count,mt=me(Wt.start,v.width,4),Ot=me(xt.start,v.width,4);Wt.start<=Pt+1&&mt===Ot&&me(Wt.start+Wt.count-1,v.width,4)===mt?xt.count=Math.max(xt.count,Wt.start+Wt.count-xt.start):(++Nt,J[Nt]=Wt)}J.length=Nt+1;let ct=i.getParameter(i.UNPACK_ROW_LENGTH),Lt=i.getParameter(i.UNPACK_SKIP_PIXELS),At=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let at=0,xt=J.length;at<xt;at++){let Wt=J[at],Pt=Math.floor(Wt.start/4),mt=Math.ceil(Wt.count/4),Ot=Pt%v.width,U=Math.floor(Pt/v.width),st=mt,ft=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ot),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),e.texSubImage2D(i.TEXTURE_2D,0,Ot,U,st,ft,H,K,v.data)}C.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ct),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Lt),i.pixelStorei(i.UNPACK_SKIP_ROWS,At)}}function Q(C,v,H){let K=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(K=i.TEXTURE_3D);let it=Kt(C,v),J=v.source;e.bindTexture(K,C.__webglTexture,i.TEXTURE0+H);let Nt=n.get(J);if(J.version!==Nt.__version||it===!0){e.activeTexture(i.TEXTURE0+H);let ct=he.getPrimaries(he.workingColorSpace),Lt=v.colorSpace===Fi?null:he.getPrimaries(v.colorSpace),At=v.colorSpace===Fi||ct===Lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);let at=_(v.image,!1,s.maxTextureSize);at=Ue(v,at);let xt=r.convert(v.format,v.colorSpace),Wt=r.convert(v.type),Pt=E(v.internalFormat,xt,Wt,v.colorSpace,v.isVideoTexture);Xt(K,v);let mt,Ot=v.mipmaps,U=v.isVideoTexture!==!0,st=Nt.__version===void 0||it===!0,ft=J.dataReady,Tt=R(v,at);if(v.isDepthTexture)Pt=y(v.format===yr,v.type),st&&(U?e.texStorage2D(i.TEXTURE_2D,1,Pt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,Pt,at.width,at.height,0,xt,Wt,null));else if(v.isDataTexture)if(Ot.length>0){U&&st&&e.texStorage2D(i.TEXTURE_2D,Tt,Pt,Ot[0].width,Ot[0].height);for(let rt=0,et=Ot.length;rt<et;rt++)mt=Ot[rt],U?ft&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,mt.width,mt.height,xt,Wt,mt.data):e.texImage2D(i.TEXTURE_2D,rt,Pt,mt.width,mt.height,0,xt,Wt,mt.data);v.generateMipmaps=!1}else U?(st&&e.texStorage2D(i.TEXTURE_2D,Tt,Pt,at.width,at.height),ft&&jt(v,at,xt,Wt)):e.texImage2D(i.TEXTURE_2D,0,Pt,at.width,at.height,0,xt,Wt,at.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){U&&st&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,Pt,Ot[0].width,Ot[0].height,at.depth);for(let rt=0,et=Ot.length;rt<et;rt++)if(mt=Ot[rt],v.format!==Zn)if(xt!==null)if(U){if(ft)if(v.layerUpdates.size>0){let It=ch(mt.width,mt.height,v.format,v.type);for(let Zt of v.layerUpdates){let ve=mt.data.subarray(Zt*It/mt.data.BYTES_PER_ELEMENT,(Zt+1)*It/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,Zt,mt.width,mt.height,1,xt,ve)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,mt.width,mt.height,at.depth,xt,mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,rt,Pt,mt.width,mt.height,at.depth,0,mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ft&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,mt.width,mt.height,at.depth,xt,Wt,mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,rt,Pt,mt.width,mt.height,at.depth,0,xt,Wt,mt.data)}else{U&&st&&e.texStorage2D(i.TEXTURE_2D,Tt,Pt,Ot[0].width,Ot[0].height);for(let rt=0,et=Ot.length;rt<et;rt++)mt=Ot[rt],v.format!==Zn?xt!==null?U?ft&&e.compressedTexSubImage2D(i.TEXTURE_2D,rt,0,0,mt.width,mt.height,xt,mt.data):e.compressedTexImage2D(i.TEXTURE_2D,rt,Pt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ft&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,mt.width,mt.height,xt,Wt,mt.data):e.texImage2D(i.TEXTURE_2D,rt,Pt,mt.width,mt.height,0,xt,Wt,mt.data)}else if(v.isDataArrayTexture)if(U){if(st&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,Pt,at.width,at.height,at.depth),ft)if(v.layerUpdates.size>0){let rt=ch(at.width,at.height,v.format,v.type);for(let et of v.layerUpdates){let It=at.data.subarray(et*rt/at.data.BYTES_PER_ELEMENT,(et+1)*rt/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,et,at.width,at.height,1,xt,Wt,It)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,xt,Wt,at.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Pt,at.width,at.height,at.depth,0,xt,Wt,at.data);else if(v.isData3DTexture)U?(st&&e.texStorage3D(i.TEXTURE_3D,Tt,Pt,at.width,at.height,at.depth),ft&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,xt,Wt,at.data)):e.texImage3D(i.TEXTURE_3D,0,Pt,at.width,at.height,at.depth,0,xt,Wt,at.data);else if(v.isFramebufferTexture){if(st)if(U)e.texStorage2D(i.TEXTURE_2D,Tt,Pt,at.width,at.height);else{let rt=at.width,et=at.height;for(let It=0;It<Tt;It++)e.texImage2D(i.TEXTURE_2D,It,Pt,rt,et,0,xt,Wt,null),rt>>=1,et>>=1}}else if(Ot.length>0){if(U&&st){let rt=fe(Ot[0]);e.texStorage2D(i.TEXTURE_2D,Tt,Pt,rt.width,rt.height)}for(let rt=0,et=Ot.length;rt<et;rt++)mt=Ot[rt],U?ft&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,xt,Wt,mt):e.texImage2D(i.TEXTURE_2D,rt,Pt,xt,Wt,mt);v.generateMipmaps=!1}else if(U){if(st){let rt=fe(at);e.texStorage2D(i.TEXTURE_2D,Tt,Pt,rt.width,rt.height)}ft&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,xt,Wt,at)}else e.texImage2D(i.TEXTURE_2D,0,Pt,xt,Wt,at);m(v)&&p(K),Nt.__version=J.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function tt(C,v,H){if(v.image.length!==6)return;let K=Kt(C,v),it=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+H);let J=n.get(it);if(it.version!==J.__version||K===!0){e.activeTexture(i.TEXTURE0+H);let Nt=he.getPrimaries(he.workingColorSpace),ct=v.colorSpace===Fi?null:he.getPrimaries(v.colorSpace),Lt=v.colorSpace===Fi||Nt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);let At=v.isCompressedTexture||v.image[0].isCompressedTexture,at=v.image[0]&&v.image[0].isDataTexture,xt=[];for(let et=0;et<6;et++)!At&&!at?xt[et]=_(v.image[et],!0,s.maxCubemapSize):xt[et]=at?v.image[et].image:v.image[et],xt[et]=Ue(v,xt[et]);let Wt=xt[0],Pt=r.convert(v.format,v.colorSpace),mt=r.convert(v.type),Ot=E(v.internalFormat,Pt,mt,v.colorSpace),U=v.isVideoTexture!==!0,st=J.__version===void 0||K===!0,ft=it.dataReady,Tt=R(v,Wt);Xt(i.TEXTURE_CUBE_MAP,v);let rt;if(At){U&&st&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,Ot,Wt.width,Wt.height);for(let et=0;et<6;et++){rt=xt[et].mipmaps;for(let It=0;It<rt.length;It++){let Zt=rt[It];v.format!==Zn?Pt!==null?U?ft&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,It,0,0,Zt.width,Zt.height,Pt,Zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,It,Ot,Zt.width,Zt.height,0,Zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,It,0,0,Zt.width,Zt.height,Pt,mt,Zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,It,Ot,Zt.width,Zt.height,0,Pt,mt,Zt.data)}}}else{if(rt=v.mipmaps,U&&st){rt.length>0&&Tt++;let et=fe(xt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,Ot,et.width,et.height)}for(let et=0;et<6;et++)if(at){U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,xt[et].width,xt[et].height,Pt,mt,xt[et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Ot,xt[et].width,xt[et].height,0,Pt,mt,xt[et].data);for(let It=0;It<rt.length;It++){let ve=rt[It].image[et].image;U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,It+1,0,0,ve.width,ve.height,Pt,mt,ve.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,It+1,Ot,ve.width,ve.height,0,Pt,mt,ve.data)}}else{U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Pt,mt,xt[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Ot,Pt,mt,xt[et]);for(let It=0;It<rt.length;It++){let Zt=rt[It];U?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,It+1,0,0,Pt,mt,Zt.image[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,It+1,Ot,Pt,mt,Zt.image[et])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),J.__version=it.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function Et(C,v,H,K,it,J){let Nt=r.convert(H.format,H.colorSpace),ct=r.convert(H.type),Lt=E(H.internalFormat,Nt,ct,H.colorSpace),At=n.get(v),at=n.get(H);if(at.__renderTarget=v,!At.__hasExternalTextures){let xt=Math.max(1,v.width>>J),Wt=Math.max(1,v.height>>J);it===i.TEXTURE_3D||it===i.TEXTURE_2D_ARRAY?e.texImage3D(it,J,Lt,xt,Wt,v.depth,0,Nt,ct,null):e.texImage2D(it,J,Lt,xt,Wt,0,Nt,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),Ct(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,it,at.__webglTexture,0,be(v)):(it===i.TEXTURE_2D||it>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,it,at.__webglTexture,J),e.bindFramebuffer(i.FRAMEBUFFER,null)}function $t(C,v,H){if(i.bindRenderbuffer(i.RENDERBUFFER,C),v.depthBuffer){let K=v.depthTexture,it=K&&K.isDepthTexture?K.type:null,J=y(v.stencilBuffer,it),Nt=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=be(v);Ct(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,J,v.width,v.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,J,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,J,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Nt,i.RENDERBUFFER,C)}else{let K=v.textures;for(let it=0;it<K.length;it++){let J=K[it],Nt=r.convert(J.format,J.colorSpace),ct=r.convert(J.type),Lt=E(J.internalFormat,Nt,ct,J.colorSpace),At=be(v);H&&Ct(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,At,Lt,v.width,v.height):Ct(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,At,Lt,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Lt,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ut(C,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let K=n.get(v.depthTexture);K.__renderTarget=v,(!K.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),Y(v.depthTexture,0);let it=K.__webglTexture,J=be(v);if(v.depthTexture.format===tr)Ct(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0);else if(v.depthTexture.format===yr)Ct(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function se(C){let v=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==C.depthTexture){let K=C.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),K){let it=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,K.removeEventListener("dispose",it)};K.addEventListener("dispose",it),v.__depthDisposeCallback=it}v.__boundDepthTexture=K}if(C.depthTexture&&!v.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");let K=C.texture.mipmaps;K&&K.length>0?Ut(v.__webglFramebuffer[0],C):Ut(v.__webglFramebuffer,C)}else if(H){v.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[K]),v.__webglDepthbuffer[K]===void 0)v.__webglDepthbuffer[K]=i.createRenderbuffer(),$t(v.__webglDepthbuffer[K],C,!1);else{let it=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,J)}}else{let K=C.texture.mipmaps;if(K&&K.length>0?e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),$t(v.__webglDepthbuffer,C,!1);else{let it=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,J)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function de(C,v,H){let K=n.get(C);v!==void 0&&Et(K.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&se(C)}function N(C){let v=C.texture,H=n.get(C),K=n.get(v);C.addEventListener("dispose",A);let it=C.textures,J=C.isWebGLCubeRenderTarget===!0,Nt=it.length>1;if(Nt||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=v.version,a.memory.textures++),J){H.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(v.mipmaps&&v.mipmaps.length>0){H.__webglFramebuffer[ct]=[];for(let Lt=0;Lt<v.mipmaps.length;Lt++)H.__webglFramebuffer[ct][Lt]=i.createFramebuffer()}else H.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){H.__webglFramebuffer=[];for(let ct=0;ct<v.mipmaps.length;ct++)H.__webglFramebuffer[ct]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(Nt)for(let ct=0,Lt=it.length;ct<Lt;ct++){let At=n.get(it[ct]);At.__webglTexture===void 0&&(At.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&Ct(C)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ct=0;ct<it.length;ct++){let Lt=it[ct];H.__webglColorRenderbuffer[ct]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[ct]);let At=r.convert(Lt.format,Lt.colorSpace),at=r.convert(Lt.type),xt=E(Lt.internalFormat,At,at,Lt.colorSpace,C.isXRRenderTarget===!0),Wt=be(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,xt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,H.__webglColorRenderbuffer[ct])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),$t(H.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Xt(i.TEXTURE_CUBE_MAP,v);for(let ct=0;ct<6;ct++)if(v.mipmaps&&v.mipmaps.length>0)for(let Lt=0;Lt<v.mipmaps.length;Lt++)Et(H.__webglFramebuffer[ct][Lt],C,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Lt);else Et(H.__webglFramebuffer[ct],C,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(v)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Nt){for(let ct=0,Lt=it.length;ct<Lt;ct++){let At=it[ct],at=n.get(At),xt=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(xt=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(xt,at.__webglTexture),Xt(xt,At),Et(H.__webglFramebuffer,C,At,i.COLOR_ATTACHMENT0+ct,xt,0),m(At)&&p(xt)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ct=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,K.__webglTexture),Xt(ct,v),v.mipmaps&&v.mipmaps.length>0)for(let Lt=0;Lt<v.mipmaps.length;Lt++)Et(H.__webglFramebuffer[Lt],C,v,i.COLOR_ATTACHMENT0,ct,Lt);else Et(H.__webglFramebuffer,C,v,i.COLOR_ATTACHMENT0,ct,0);m(v)&&p(ct),e.unbindTexture()}C.depthBuffer&&se(C)}function Se(C){let v=C.textures;for(let H=0,K=v.length;H<K;H++){let it=v[H];if(m(it)){let J=S(C),Nt=n.get(it).__webglTexture;e.bindTexture(J,Nt),p(J),e.unbindTexture()}}}let Rt=[],qt=[];function bt(C){if(C.samples>0){if(Ct(C)===!1){let v=C.textures,H=C.width,K=C.height,it=i.COLOR_BUFFER_BIT,J=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Nt=n.get(C),ct=v.length>1;if(ct)for(let At=0;At<v.length;At++)e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer);let Lt=C.texture.mipmaps;Lt&&Lt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let At=0;At<v.length;At++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(it|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(it|=i.STENCIL_BUFFER_BIT)),ct){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Nt.__webglColorRenderbuffer[At]);let at=n.get(v[At]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,at,0)}i.blitFramebuffer(0,0,H,K,0,0,H,K,it,i.NEAREST),c===!0&&(Rt.length=0,qt.length=0,Rt.push(i.COLOR_ATTACHMENT0+At),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Rt.push(J),qt.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,qt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Rt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ct)for(let At=0;At<v.length;At++){e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,Nt.__webglColorRenderbuffer[At]);let at=n.get(v[At]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,at,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){let v=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function be(C){return Math.min(s.maxSamples,C.samples)}function Ct(C){let v=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Jt(C){let v=a.render.frame;d.get(C)!==v&&(d.set(C,v),C.update())}function Ue(C,v){let H=C.colorSpace,K=C.format,it=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==Ms&&H!==Fi&&(he.getTransfer(H)===ye?(K!==Zn||it!==ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),v}function fe(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=O,this.setTexture2D=Y,this.setTexture2DArray=q,this.setTexture3D=nt,this.setTextureCube=G,this.rebindTextures=de,this.setupRenderTarget=N,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=bt,this.setupDepthRenderbuffer=se,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=Ct}function px(i,t){function e(n,s=Fi){let r,a=he.getTransfer(s);if(n===ai)return i.UNSIGNED_BYTE;if(n===el)return i.UNSIGNED_SHORT_4_4_4_4;if(n===nl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Zc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Jc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Yc)return i.BYTE;if(n===$c)return i.SHORT;if(n===gr)return i.UNSIGNED_SHORT;if(n===tl)return i.INT;if(n===as)return i.UNSIGNED_INT;if(n===oi)return i.FLOAT;if(n===_r)return i.HALF_FLOAT;if(n===Kc)return i.ALPHA;if(n===jc)return i.RGB;if(n===Zn)return i.RGBA;if(n===tr)return i.DEPTH_COMPONENT;if(n===yr)return i.DEPTH_STENCIL;if(n===il)return i.RED;if(n===sl)return i.RED_INTEGER;if(n===Qc)return i.RG;if(n===rl)return i.RG_INTEGER;if(n===al)return i.RGBA_INTEGER;if(n===va||n===Ma||n===Sa||n===ba)if(a===ye)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===va)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ba)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===va)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ma)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Sa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ba)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ol||n===ll||n===cl||n===hl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ol)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===cl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ul||n===dl||n===fl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ul||n===dl)return a===ye?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===fl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===pl||n===ml||n===gl||n===_l||n===xl||n===yl||n===vl||n===Ml||n===Sl||n===bl||n===El||n===Tl||n===wl||n===Al)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===pl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ml)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===gl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===_l)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===yl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===vl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ml)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Sl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===bl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===El)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Tl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wl)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Al)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rl||n===Cl||n===Pl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Rl)return a===ye?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Cl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Pl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Il||n===Dl||n===Ll||n===Ul)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Il)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Dl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ll)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var mx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gx=`
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

}`,Sh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new sa(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new In({vertexShader:mx,fragmentShader:gx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new te(new Ii(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},bh=class extends ui{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,h=null,f=null,u=null,g=null,_=typeof XRWebGLBinding<"u",m=new Sh,p={},S=e.getContextAttributes(),E=null,y=null,R=[],w=[],A=new ut,I=null,M=new yn;M.viewport=new Ce;let x=new yn;x.viewport=new Ce;let P=[M,x],O=new Ho,F=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let tt=R[Q];return tt===void 0&&(tt=new rr,R[Q]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Q){let tt=R[Q];return tt===void 0&&(tt=new rr,R[Q]=tt),tt.getGripSpace()},this.getHand=function(Q){let tt=R[Q];return tt===void 0&&(tt=new rr,R[Q]=tt),tt.getHandSpace()};function Y(Q){let tt=w.indexOf(Q.inputSource);if(tt===-1)return;let Et=R[tt];Et!==void 0&&(Et.update(Q.inputSource,Q.frame,l||a),Et.dispatchEvent({type:Q.type,data:Q.inputSource}))}function q(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",nt);for(let Q=0;Q<R.length;Q++){let tt=w[Q];tt!==null&&(w[Q]=null,R[Q].disconnect(tt))}F=null,k=null,m.reset();for(let Q in p)delete p[Q];t.setRenderTarget(E),u=null,f=null,h=null,s=null,y=null,jt.stop(),n.isPresenting=!1,t.setPixelRatio(I),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return f!==null?f:u},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,e)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(E=t.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",q),s.addEventListener("inputsourceschange",nt),S.xrCompatible!==!0&&await e.makeXRCompatible(),I=t.getPixelRatio(),t.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Et=null,$t=null,Ut=null;S.depth&&(Ut=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Et=S.stencil?yr:tr,$t=S.stencil?xr:as);let se={colorFormat:e.RGBA8,depthFormat:Ut,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(se),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),y=new Bn(f.textureWidth,f.textureHeight,{format:Zn,type:ai,depthTexture:new bs(f.textureWidth,f.textureHeight,$t,void 0,void 0,void 0,void 0,void 0,void 0,Et),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let Et={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,e,Et),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new Bn(u.framebufferWidth,u.framebufferHeight,{format:Zn,type:ai,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),jt.setContext(s),jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function nt(Q){for(let tt=0;tt<Q.removed.length;tt++){let Et=Q.removed[tt],$t=w.indexOf(Et);$t>=0&&(w[$t]=null,R[$t].disconnect(Et))}for(let tt=0;tt<Q.added.length;tt++){let Et=Q.added[tt],$t=w.indexOf(Et);if($t===-1){for(let se=0;se<R.length;se++)if(se>=w.length){w.push(Et),$t=se;break}else if(w[se]===null){w[se]=Et,$t=se;break}if($t===-1)break}let Ut=R[$t];Ut&&Ut.connect(Et)}}let G=new L,ht=new L;function gt(Q,tt,Et){G.setFromMatrixPosition(tt.matrixWorld),ht.setFromMatrixPosition(Et.matrixWorld);let $t=G.distanceTo(ht),Ut=tt.projectionMatrix.elements,se=Et.projectionMatrix.elements,de=Ut[14]/(Ut[10]-1),N=Ut[14]/(Ut[10]+1),Se=(Ut[9]+1)/Ut[5],Rt=(Ut[9]-1)/Ut[5],qt=(Ut[8]-1)/Ut[0],bt=(se[8]+1)/se[0],be=de*qt,Ct=de*bt,Jt=$t/(-qt+bt),Ue=Jt*-qt;if(tt.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ue),Q.translateZ(Jt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ut[10]===-1)Q.projectionMatrix.copy(tt.projectionMatrix),Q.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let fe=de+Jt,C=N+Jt,v=be-Ue,H=Ct+($t-Ue),K=Se*N/C*fe,it=Rt*N/C*fe;Q.projectionMatrix.makePerspective(v,H,K,it,fe,C),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function dt(Q,tt){tt===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(tt.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let tt=Q.near,Et=Q.far;m.texture!==null&&(m.depthNear>0&&(tt=m.depthNear),m.depthFar>0&&(Et=m.depthFar)),O.near=x.near=M.near=tt,O.far=x.far=M.far=Et,(F!==O.near||k!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),F=O.near,k=O.far),O.layers.mask=Q.layers.mask|6,M.layers.mask=O.layers.mask&3,x.layers.mask=O.layers.mask&5;let $t=Q.parent,Ut=O.cameras;dt(O,$t);for(let se=0;se<Ut.length;se++)dt(Ut[se],$t);Ut.length===2?gt(O,M,x):O.projectionMatrix.copy(M.projectionMatrix),Xt(Q,O,$t)};function Xt(Q,tt,Et){Et===null?Q.matrix.copy(tt.matrixWorld):(Q.matrix.copy(Et.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(tt.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(tt.projectionMatrix),Q.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=er*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(f===null&&u===null))return c},this.setFoveation=function(Q){c=Q,f!==null&&(f.fixedFoveation=Q),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(Q){return p[Q]};let Kt=null;function me(Q,tt){if(d=tt.getViewerPose(l||a),g=tt,d!==null){let Et=d.views;u!==null&&(t.setRenderTargetFramebuffer(y,u.framebuffer),t.setRenderTarget(y));let $t=!1;Et.length!==O.cameras.length&&(O.cameras.length=0,$t=!0);for(let N=0;N<Et.length;N++){let Se=Et[N],Rt=null;if(u!==null)Rt=u.getViewport(Se);else{let bt=h.getViewSubImage(f,Se);Rt=bt.viewport,N===0&&(t.setRenderTargetTextures(y,bt.colorTexture,bt.depthStencilTexture),t.setRenderTarget(y))}let qt=P[N];qt===void 0&&(qt=new yn,qt.layers.enable(N),qt.viewport=new Ce,P[N]=qt),qt.matrix.fromArray(Se.transform.matrix),qt.matrix.decompose(qt.position,qt.quaternion,qt.scale),qt.projectionMatrix.fromArray(Se.projectionMatrix),qt.projectionMatrixInverse.copy(qt.projectionMatrix).invert(),qt.viewport.set(Rt.x,Rt.y,Rt.width,Rt.height),N===0&&(O.matrix.copy(qt.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),$t===!0&&O.cameras.push(qt)}let Ut=s.enabledFeatures;if(Ut&&Ut.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=n.getBinding();let N=h.getDepthInformation(Et[0]);N&&N.isValid&&N.texture&&m.init(N,s.renderState)}if(Ut&&Ut.includes("camera-access")&&_){t.state.unbindTexture(),h=n.getBinding();for(let N=0;N<Et.length;N++){let Se=Et[N].camera;if(Se){let Rt=p[Se];Rt||(Rt=new sa,p[Se]=Rt);let qt=h.getCameraImage(Se);Rt.sourceTexture=qt}}}}for(let Et=0;Et<R.length;Et++){let $t=w[Et],Ut=R[Et];$t!==null&&Ut!==void 0&&Ut.update($t,tt,l||a)}Kt&&Kt(Q,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),g=null}let jt=new jd;jt.setAnimationLoop(me),this.setAnimationLoop=function(Q){Kt=Q},this.dispose=function(){}}},Ls=new zn,_x=new ue;function xx(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,rh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,E,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),d(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&u(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,S,E):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===dn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===dn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let S=t.get(p),E=S.envMap,y=S.envMapRotation;E&&(m.envMap.value=E,Ls.copy(y),Ls.x*=-1,Ls.y*=-1,Ls.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ls.y*=-1,Ls.z*=-1),m.envMapRotation.value.setFromMatrix4(_x.makeRotationFromEuler(Ls)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=E*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===dn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function yx(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,E){let y=E.program;n.uniformBlockBinding(S,y)}function l(S,E){let y=s[S.id];y===void 0&&(g(S),y=d(S),s[S.id]=y,S.addEventListener("dispose",m));let R=E.program;n.updateUBOMapping(S,R);let w=t.render.frame;r[S.id]!==w&&(f(S),r[S.id]=w)}function d(S){let E=h();S.__bindingPointIndex=E;let y=i.createBuffer(),R=S.__size,w=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,R,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,y),y}function h(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){let E=s[S.id],y=S.uniforms,R=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let w=0,A=y.length;w<A;w++){let I=Array.isArray(y[w])?y[w]:[y[w]];for(let M=0,x=I.length;M<x;M++){let P=I[M];if(u(P,w,M,R)===!0){let O=P.__offset,F=Array.isArray(P.value)?P.value:[P.value],k=0;for(let Y=0;Y<F.length;Y++){let q=F[Y],nt=_(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,O+k,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,k),k+=nt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(S,E,y,R){let w=S.value,A=E+"_"+y;if(R[A]===void 0)return typeof w=="number"||typeof w=="boolean"?R[A]=w:R[A]=w.clone(),!0;{let I=R[A];if(typeof w=="number"||typeof w=="boolean"){if(I!==w)return R[A]=w,!0}else if(I.equals(w)===!1)return I.copy(w),!0}return!1}function g(S){let E=S.uniforms,y=0,R=16;for(let A=0,I=E.length;A<I;A++){let M=Array.isArray(E[A])?E[A]:[E[A]];for(let x=0,P=M.length;x<P;x++){let O=M[x],F=Array.isArray(O.value)?O.value:[O.value];for(let k=0,Y=F.length;k<Y;k++){let q=F[k],nt=_(q),G=y%R,ht=G%nt.boundary,gt=G+ht;y+=ht,gt!==0&&R-gt<nt.storage&&(y+=R-gt),O.__data=new Float32Array(nt.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=y,y+=nt.storage}}}let w=y%R;return w>0&&(y+=R-w),S.__size=y,S.__cache={},this}function _(S){let E={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(E.boundary=4,E.storage=4):S.isVector2?(E.boundary=8,E.storage=8):S.isVector3||S.isColor?(E.boundary=16,E.storage=12):S.isVector4?(E.boundary=16,E.storage=16):S.isMatrix3?(E.boundary=48,E.storage=48):S.isMatrix4?(E.boundary=64,E.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),E}function m(S){let E=S.target;E.removeEventListener("dispose",m);let y=a.indexOf(E.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function p(){for(let S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}var zl=class{constructor(t={}){let{canvas:e=vd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,S=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ni,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,R=!1;this._outputColorSpace=Tn;let w=0,A=0,I=null,M=-1,x=null,P=new Ce,O=new Ce,F=null,k=new vt(0),Y=0,q=e.width,nt=e.height,G=1,ht=null,gt=null,dt=new Ce(0,0,q,nt),Xt=new Ce(0,0,q,nt),Kt=!1,me=new lr,jt=!1,Q=!1,tt=new ue,Et=new L,$t=new Ce,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},se=!1;function de(){return I===null?G:1}let N=n;function Se(b,B){return e.getContext(b,B)}try{let b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",Tt,!1),e.addEventListener("webglcontextcreationerror",rt,!1),N===null){let B="webgl2";if(N=Se(B,b),N===null)throw Se(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Rt,qt,bt,be,Ct,Jt,Ue,fe,C,v,H,K,it,J,Nt,ct,Lt,At,at,xt,Wt,Pt,mt,Ot;function U(){Rt=new O0(N),Rt.init(),Pt=new px(N,Rt),qt=new P0(N,Rt,t,Pt),bt=new dx(N,Rt),qt.reversedDepthBuffer&&f&&bt.buffers.depth.setReversed(!0),be=new k0(N),Ct=new Q_,Jt=new fx(N,Rt,bt,Ct,qt,Pt,be),Ue=new D0(y),fe=new F0(y),C=new qp(N),mt=new R0(N,C),v=new B0(N,C,be,mt),H=new V0(N,v,C,be),at=new H0(N,qt,Jt),ct=new I0(Ct),K=new j_(y,Ue,fe,Rt,qt,mt,ct),it=new xx(y,Ct),J=new ex,Nt=new ox(Rt),At=new A0(y,Ue,fe,bt,H,u,c),Lt=new hx(y,H,qt),Ot=new yx(N,be,qt,bt),xt=new C0(N,Rt,be),Wt=new z0(N,Rt,be),be.programs=K.programs,y.capabilities=qt,y.extensions=Rt,y.properties=Ct,y.renderLists=J,y.shadowMap=Lt,y.state=bt,y.info=be}U();let st=new bh(y,N);this.xr=st,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let b=Rt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=Rt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(b){b!==void 0&&(G=b,this.setSize(q,nt,!1))},this.getSize=function(b){return b.set(q,nt)},this.setSize=function(b,B,W=!0){if(st.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=b,nt=B,e.width=Math.floor(b*G),e.height=Math.floor(B*G),W===!0&&(e.style.width=b+"px",e.style.height=B+"px"),this.setViewport(0,0,b,B)},this.getDrawingBufferSize=function(b){return b.set(q*G,nt*G).floor()},this.setDrawingBufferSize=function(b,B,W){q=b,nt=B,G=W,e.width=Math.floor(b*W),e.height=Math.floor(B*W),this.setViewport(0,0,b,B)},this.getCurrentViewport=function(b){return b.copy(P)},this.getViewport=function(b){return b.copy(dt)},this.setViewport=function(b,B,W,X){b.isVector4?dt.set(b.x,b.y,b.z,b.w):dt.set(b,B,W,X),bt.viewport(P.copy(dt).multiplyScalar(G).round())},this.getScissor=function(b){return b.copy(Xt)},this.setScissor=function(b,B,W,X){b.isVector4?Xt.set(b.x,b.y,b.z,b.w):Xt.set(b,B,W,X),bt.scissor(O.copy(Xt).multiplyScalar(G).round())},this.getScissorTest=function(){return Kt},this.setScissorTest=function(b){bt.setScissorTest(Kt=b)},this.setOpaqueSort=function(b){ht=b},this.setTransparentSort=function(b){gt=b},this.getClearColor=function(b){return b.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor(...arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha(...arguments)},this.clear=function(b=!0,B=!0,W=!0){let X=0;if(b){let z=!1;if(I!==null){let ot=I.texture.format;z=ot===al||ot===rl||ot===sl}if(z){let ot=I.texture.type,yt=ot===ai||ot===as||ot===gr||ot===xr||ot===el||ot===nl,wt=At.getClearColor(),St=At.getClearAlpha(),Vt=wt.r,Yt=wt.g,zt=wt.b;yt?(g[0]=Vt,g[1]=Yt,g[2]=zt,g[3]=St,N.clearBufferuiv(N.COLOR,0,g)):(_[0]=Vt,_[1]=Yt,_[2]=zt,_[3]=St,N.clearBufferiv(N.COLOR,0,_))}else X|=N.COLOR_BUFFER_BIT}B&&(X|=N.DEPTH_BUFFER_BIT),W&&(X|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",Tt,!1),e.removeEventListener("webglcontextcreationerror",rt,!1),At.dispose(),J.dispose(),Nt.dispose(),Ct.dispose(),Ue.dispose(),fe.dispose(),H.dispose(),mt.dispose(),Ot.dispose(),K.dispose(),st.dispose(),st.removeEventListener("sessionstart",Ze),st.removeEventListener("sessionend",Be),We.stop()};function ft(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function Tt(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;let b=be.autoReset,B=Lt.enabled,W=Lt.autoUpdate,X=Lt.needsUpdate,z=Lt.type;U(),be.autoReset=b,Lt.enabled=B,Lt.autoUpdate=W,Lt.needsUpdate=X,Lt.type=z}function rt(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function et(b){let B=b.target;B.removeEventListener("dispose",et),It(B)}function It(b){Zt(b),Ct.remove(b)}function Zt(b){let B=Ct.get(b).programs;B!==void 0&&(B.forEach(function(W){K.releaseProgram(W)}),b.isShaderMaterial&&K.releaseShaderCache(b))}this.renderBufferDirect=function(b,B,W,X,z,ot){B===null&&(B=Ut);let yt=z.isMesh&&z.matrixWorld.determinant()<0,wt=Pa(b,B,W,X,z);bt.setMaterial(X,yt);let St=W.index,Vt=1;if(X.wireframe===!0){if(St=v.getWireframeAttribute(W),St===void 0)return;Vt=2}let Yt=W.drawRange,zt=W.attributes.position,re=Yt.start*Vt,ge=(Yt.start+Yt.count)*Vt;ot!==null&&(re=Math.max(re,ot.start*Vt),ge=Math.min(ge,(ot.start+ot.count)*Vt)),St!==null?(re=Math.max(re,0),ge=Math.min(ge,St.count)):zt!=null&&(re=Math.max(re,0),ge=Math.min(ge,zt.count));let Ie=ge-re;if(Ie<0||Ie===1/0)return;mt.setup(z,X,wt,W,St);let ce,_e=xt;if(St!==null&&(ce=C.get(St),_e=Wt,_e.setIndex(ce)),z.isMesh)X.wireframe===!0?(bt.setLineWidth(X.wireframeLinewidth*de()),_e.setMode(N.LINES)):_e.setMode(N.TRIANGLES);else if(z.isLine){let kt=X.linewidth;kt===void 0&&(kt=1),bt.setLineWidth(kt*de()),z.isLineSegments?_e.setMode(N.LINES):z.isLineLoop?_e.setMode(N.LINE_LOOP):_e.setMode(N.LINE_STRIP)}else z.isPoints?_e.setMode(N.POINTS):z.isSprite&&_e.setMode(N.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)nr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),_e.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))_e.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let kt=z._multiDrawStarts,we=z._multiDrawCounts,oe=z._multiDrawCount,fn=St?C.get(St).bytesPerElement:1,li=Ct.get(X).currentProgram.getUniforms();for(let pn=0;pn<oe;pn++)li.setValue(N,"_gl_DrawID",pn),_e.render(kt[pn]/fn,we[pn])}else if(z.isInstancedMesh)_e.renderInstances(re,Ie,z.count);else if(W.isInstancedBufferGeometry){let kt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,we=Math.min(W.instanceCount,kt);_e.renderInstances(re,Ie,we)}else _e.render(re,Ie)};function ve(b,B,W){b.transparent===!0&&b.side===vn&&b.forceSinglePass===!1?(b.side=dn,b.needsUpdate=!0,tn(b,B,W),b.side=Ri,b.needsUpdate=!0,tn(b,B,W),b.side=vn):tn(b,B,W)}this.compile=function(b,B,W=null){W===null&&(W=b),p=Nt.get(W),p.init(B),E.push(p),W.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),b!==W&&b.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let X=new Set;return b.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let ot=z.material;if(ot)if(Array.isArray(ot))for(let yt=0;yt<ot.length;yt++){let wt=ot[yt];ve(wt,W,z),X.add(wt)}else ve(ot,W,z),X.add(ot)}),p=E.pop(),X},this.compileAsync=function(b,B,W=null){let X=this.compile(b,B,W);return new Promise(z=>{function ot(){if(X.forEach(function(yt){Ct.get(yt).currentProgram.isReady()&&X.delete(yt)}),X.size===0){z(b);return}setTimeout(ot,10)}Rt.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let j=null;function Ge(b){j&&j(b)}function Ze(){We.stop()}function Be(){We.start()}let We=new jd;We.setAnimationLoop(Ge),typeof self<"u"&&We.setContext(self),this.setAnimationLoop=function(b){j=b,st.setAnimationLoop(b),b===null?We.stop():We.start()},st.addEventListener("sessionstart",Ze),st.addEventListener("sessionend",Be),this.render=function(b,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(st.cameraAutoUpdate===!0&&st.updateCamera(B),B=st.getCamera()),b.isScene===!0&&b.onBeforeRender(y,b,B,I),p=Nt.get(b,E.length),p.init(B),E.push(p),tt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),me.setFromProjectionMatrix(tt,ni,B.reversedDepth),Q=this.localClippingEnabled,jt=ct.init(this.clippingPlanes,Q),m=J.get(b,S.length),m.init(),S.push(m),st.enabled===!0&&st.isPresenting===!0){let ot=y.xr.getDepthSensingMesh();ot!==null&&us(ot,B,-1/0,y.sortObjects)}us(b,B,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ht,gt),se=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1,se&&At.addToRenderList(m,b),this.info.render.frame++,jt===!0&&ct.beginShadows();let W=p.state.shadowsArray;Lt.render(W,b,B),jt===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=m.opaque,z=m.transmissive;if(p.setupLights(),B.isArrayCamera){let ot=B.cameras;if(z.length>0)for(let yt=0,wt=ot.length;yt<wt;yt++){let St=ot[yt];Jn(X,z,b,St)}se&&At.render(b);for(let yt=0,wt=ot.length;yt<wt;yt++){let St=ot[yt];ds(m,b,St,St.viewport)}}else z.length>0&&Jn(X,z,b,B),se&&At.render(b),ds(m,b,B);I!==null&&A===0&&(Jt.updateMultisampleRenderTarget(I),Jt.updateRenderTargetMipmap(I)),b.isScene===!0&&b.onAfterRender(y,b,B),mt.resetDefaultState(),M=-1,x=null,E.pop(),E.length>0?(p=E[E.length-1],jt===!0&&ct.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function us(b,B,W,X){if(b.visible===!1)return;if(b.layers.test(B.layers)){if(b.isGroup)W=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(B);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||me.intersectsSprite(b)){X&&$t.setFromMatrixPosition(b.matrixWorld).applyMatrix4(tt);let yt=H.update(b),wt=b.material;wt.visible&&m.push(b,yt,wt,W,$t.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||me.intersectsObject(b))){let yt=H.update(b),wt=b.material;if(X&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),$t.copy(b.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),$t.copy(yt.boundingSphere.center)),$t.applyMatrix4(b.matrixWorld).applyMatrix4(tt)),Array.isArray(wt)){let St=yt.groups;for(let Vt=0,Yt=St.length;Vt<Yt;Vt++){let zt=St[Vt],re=wt[zt.materialIndex];re&&re.visible&&m.push(b,yt,re,W,$t.z,zt)}}else wt.visible&&m.push(b,yt,wt,W,$t.z,null)}}let ot=b.children;for(let yt=0,wt=ot.length;yt<wt;yt++)us(ot[yt],B,W,X)}function ds(b,B,W,X){let z=b.opaque,ot=b.transmissive,yt=b.transparent;p.setupLightsView(W),jt===!0&&ct.setGlobalState(y.clippingPlanes,W),X&&bt.viewport(P.copy(X)),z.length>0&&Ar(z,B,W),ot.length>0&&Ar(ot,B,W),yt.length>0&&Ar(yt,B,W),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function Jn(b,B,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[X.id]===void 0&&(p.state.transmissionRenderTarget[X.id]=new Bn(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?_r:ai,minFilter:rs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:he.workingColorSpace}));let ot=p.state.transmissionRenderTarget[X.id],yt=X.viewport||P;ot.setSize(yt.z*y.transmissionResolutionScale,yt.w*y.transmissionResolutionScale);let wt=y.getRenderTarget(),St=y.getActiveCubeFace(),Vt=y.getActiveMipmapLevel();y.setRenderTarget(ot),y.getClearColor(k),Y=y.getClearAlpha(),Y<1&&y.setClearColor(16777215,.5),y.clear(),se&&At.render(W);let Yt=y.toneMapping;y.toneMapping=Ni;let zt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),p.setupLightsView(X),jt===!0&&ct.setGlobalState(y.clippingPlanes,X),Ar(b,W,X),Jt.updateMultisampleRenderTarget(ot),Jt.updateRenderTargetMipmap(ot),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let re=!1;for(let ge=0,Ie=B.length;ge<Ie;ge++){let ce=B[ge],_e=ce.object,kt=ce.geometry,we=ce.material,oe=ce.group;if(we.side===vn&&_e.layers.test(X.layers)){let fn=we.side;we.side=dn,we.needsUpdate=!0,Rr(_e,W,X,kt,we,oe),we.side=fn,we.needsUpdate=!0,re=!0}}re===!0&&(Jt.updateMultisampleRenderTarget(ot),Jt.updateRenderTargetMipmap(ot))}y.setRenderTarget(wt,St,Vt),y.setClearColor(k,Y),zt!==void 0&&(X.viewport=zt),y.toneMapping=Yt}function Ar(b,B,W){let X=B.isScene===!0?B.overrideMaterial:null;for(let z=0,ot=b.length;z<ot;z++){let yt=b[z],wt=yt.object,St=yt.geometry,Vt=yt.group,Yt=yt.material;Yt.allowOverride===!0&&X!==null&&(Yt=X),wt.layers.test(W.layers)&&Rr(wt,B,W,St,Yt,Vt)}}function Rr(b,B,W,X,z,ot){b.onBeforeRender(y,B,W,X,z,ot),b.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),z.onBeforeRender(y,B,W,X,b,ot),z.transparent===!0&&z.side===vn&&z.forceSinglePass===!1?(z.side=dn,z.needsUpdate=!0,y.renderBufferDirect(W,B,X,z,b,ot),z.side=Ri,z.needsUpdate=!0,y.renderBufferDirect(W,B,X,z,b,ot),z.side=vn):y.renderBufferDirect(W,B,X,z,b,ot),b.onAfterRender(y,B,W,X,z,ot)}function tn(b,B,W){B.isScene!==!0&&(B=Ut);let X=Ct.get(b),z=p.state.lights,ot=p.state.shadowsArray,yt=z.state.version,wt=K.getParameters(b,z.state,ot,B,W),St=K.getProgramCacheKey(wt),Vt=X.programs;X.environment=b.isMeshStandardMaterial?B.environment:null,X.fog=B.fog,X.envMap=(b.isMeshStandardMaterial?fe:Ue).get(b.envMap||X.environment),X.envMapRotation=X.environment!==null&&b.envMap===null?B.environmentRotation:b.envMapRotation,Vt===void 0&&(b.addEventListener("dispose",et),Vt=new Map,X.programs=Vt);let Yt=Vt.get(St);if(Yt!==void 0){if(X.currentProgram===Yt&&X.lightsStateVersion===yt)return en(b,wt),Yt}else wt.uniforms=K.getUniforms(b),b.onBeforeCompile(wt,y),Yt=K.acquireProgram(wt,St),Vt.set(St,Yt),X.uniforms=wt.uniforms;let zt=X.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(zt.clippingPlanes=ct.uniform),en(b,wt),X.needsLights=Ia(b),X.lightsStateVersion=yt,X.needsLights&&(zt.ambientLightColor.value=z.state.ambient,zt.lightProbe.value=z.state.probe,zt.directionalLights.value=z.state.directional,zt.directionalLightShadows.value=z.state.directionalShadow,zt.spotLights.value=z.state.spot,zt.spotLightShadows.value=z.state.spotShadow,zt.rectAreaLights.value=z.state.rectArea,zt.ltc_1.value=z.state.rectAreaLTC1,zt.ltc_2.value=z.state.rectAreaLTC2,zt.pointLights.value=z.state.point,zt.pointLightShadows.value=z.state.pointShadow,zt.hemisphereLights.value=z.state.hemi,zt.directionalShadowMap.value=z.state.directionalShadowMap,zt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,zt.spotShadowMap.value=z.state.spotShadowMap,zt.spotLightMatrix.value=z.state.spotLightMatrix,zt.spotLightMap.value=z.state.spotLightMap,zt.pointShadowMap.value=z.state.pointShadowMap,zt.pointShadowMatrix.value=z.state.pointShadowMatrix),X.currentProgram=Yt,X.uniformsList=null,Yt}function Cr(b){if(b.uniformsList===null){let B=b.currentProgram.getUniforms();b.uniformsList=br.seqWithValue(B.seq,b.uniforms)}return b.uniformsList}function en(b,B){let W=Ct.get(b);W.outputColorSpace=B.outputColorSpace,W.batching=B.batching,W.batchingColor=B.batchingColor,W.instancing=B.instancing,W.instancingColor=B.instancingColor,W.instancingMorph=B.instancingMorph,W.skinning=B.skinning,W.morphTargets=B.morphTargets,W.morphNormals=B.morphNormals,W.morphColors=B.morphColors,W.morphTargetsCount=B.morphTargetsCount,W.numClippingPlanes=B.numClippingPlanes,W.numIntersection=B.numClipIntersection,W.vertexAlphas=B.vertexAlphas,W.vertexTangents=B.vertexTangents,W.toneMapping=B.toneMapping}function Pa(b,B,W,X,z){B.isScene!==!0&&(B=Ut),Jt.resetTextureUnits();let ot=B.fog,yt=X.isMeshStandardMaterial?B.environment:null,wt=I===null?y.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Ms,St=(X.isMeshStandardMaterial?fe:Ue).get(X.envMap||yt),Vt=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Yt=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),zt=!!W.morphAttributes.position,re=!!W.morphAttributes.normal,ge=!!W.morphAttributes.color,Ie=Ni;X.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Ie=y.toneMapping);let ce=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,_e=ce!==void 0?ce.length:0,kt=Ct.get(X),we=p.state.lights;if(jt===!0&&(Q===!0||b!==x)){let ze=b===x&&X.id===M;ct.setState(X,b,ze)}let oe=!1;X.version===kt.__version?(kt.needsLights&&kt.lightsStateVersion!==we.state.version||kt.outputColorSpace!==wt||z.isBatchedMesh&&kt.batching===!1||!z.isBatchedMesh&&kt.batching===!0||z.isBatchedMesh&&kt.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&kt.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&kt.instancing===!1||!z.isInstancedMesh&&kt.instancing===!0||z.isSkinnedMesh&&kt.skinning===!1||!z.isSkinnedMesh&&kt.skinning===!0||z.isInstancedMesh&&kt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&kt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&kt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&kt.instancingMorph===!1&&z.morphTexture!==null||kt.envMap!==St||X.fog===!0&&kt.fog!==ot||kt.numClippingPlanes!==void 0&&(kt.numClippingPlanes!==ct.numPlanes||kt.numIntersection!==ct.numIntersection)||kt.vertexAlphas!==Vt||kt.vertexTangents!==Yt||kt.morphTargets!==zt||kt.morphNormals!==re||kt.morphColors!==ge||kt.toneMapping!==Ie||kt.morphTargetsCount!==_e)&&(oe=!0):(oe=!0,kt.__version=X.version);let fn=kt.currentProgram;oe===!0&&(fn=tn(X,B,z));let li=!1,pn=!1,ci=!1,Ae=fn.getUniforms(),bn=kt.uniforms;if(bt.useProgram(fn.program)&&(li=!0,pn=!0,ci=!0),X.id!==M&&(M=X.id,pn=!0),li||x!==b){bt.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Ae.setValue(N,"projectionMatrix",b.projectionMatrix),Ae.setValue(N,"viewMatrix",b.matrixWorldInverse);let cn=Ae.map.cameraPosition;cn!==void 0&&cn.setValue(N,Et.setFromMatrixPosition(b.matrixWorld)),qt.logarithmicDepthBuffer&&Ae.setValue(N,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Ae.setValue(N,"isOrthographic",b.isOrthographicCamera===!0),x!==b&&(x=b,pn=!0,ci=!0)}if(z.isSkinnedMesh){Ae.setOptional(N,z,"bindMatrix"),Ae.setOptional(N,z,"bindMatrixInverse");let ze=z.skeleton;ze&&(ze.boneTexture===null&&ze.computeBoneTexture(),Ae.setValue(N,"boneTexture",ze.boneTexture,Jt))}z.isBatchedMesh&&(Ae.setOptional(N,z,"batchingTexture"),Ae.setValue(N,"batchingTexture",z._matricesTexture,Jt),Ae.setOptional(N,z,"batchingIdTexture"),Ae.setValue(N,"batchingIdTexture",z._indirectTexture,Jt),Ae.setOptional(N,z,"batchingColorTexture"),z._colorsTexture!==null&&Ae.setValue(N,"batchingColorTexture",z._colorsTexture,Jt));let nn=W.morphAttributes;if((nn.position!==void 0||nn.normal!==void 0||nn.color!==void 0)&&at.update(z,W,fn),(pn||kt.receiveShadow!==z.receiveShadow)&&(kt.receiveShadow=z.receiveShadow,Ae.setValue(N,"receiveShadow",z.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(bn.envMap.value=St,bn.flipEnvMap.value=St.isCubeTexture&&St.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&B.environment!==null&&(bn.envMapIntensity.value=B.environmentIntensity),pn&&(Ae.setValue(N,"toneMappingExposure",y.toneMappingExposure),kt.needsLights&&zi(bn,ci),ot&&X.fog===!0&&it.refreshFogUniforms(bn,ot),it.refreshMaterialUniforms(bn,X,G,nt,p.state.transmissionRenderTarget[b.id]),br.upload(N,Cr(kt),bn,Jt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(br.upload(N,Cr(kt),bn,Jt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Ae.setValue(N,"center",z.center),Ae.setValue(N,"modelViewMatrix",z.modelViewMatrix),Ae.setValue(N,"normalMatrix",z.normalMatrix),Ae.setValue(N,"modelMatrix",z.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let ze=X.uniformsGroups;for(let cn=0,ki=ze.length;cn<ki;cn++){let yi=ze[cn];Ot.update(yi,fn),Ot.bind(yi,fn)}}return fn}function zi(b,B){b.ambientLightColor.needsUpdate=B,b.lightProbe.needsUpdate=B,b.directionalLights.needsUpdate=B,b.directionalLightShadows.needsUpdate=B,b.pointLights.needsUpdate=B,b.pointLightShadows.needsUpdate=B,b.spotLights.needsUpdate=B,b.spotLightShadows.needsUpdate=B,b.rectAreaLights.needsUpdate=B,b.hemisphereLights.needsUpdate=B}function Ia(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(b,B,W){let X=Ct.get(b);X.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Ct.get(b.texture).__webglTexture=B,Ct.get(b.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:W,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,B){let W=Ct.get(b);W.__webglFramebuffer=B,W.__useDefaultFramebuffer=B===void 0};let Da=N.createFramebuffer();this.setRenderTarget=function(b,B=0,W=0){I=b,w=B,A=W;let X=!0,z=null,ot=!1,yt=!1;if(b){let St=Ct.get(b);if(St.__useDefaultFramebuffer!==void 0)bt.bindFramebuffer(N.FRAMEBUFFER,null),X=!1;else if(St.__webglFramebuffer===void 0)Jt.setupRenderTarget(b);else if(St.__hasExternalTextures)Jt.rebindTextures(b,Ct.get(b.texture).__webglTexture,Ct.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let zt=b.depthTexture;if(St.__boundDepthTexture!==zt){if(zt!==null&&Ct.has(zt)&&(b.width!==zt.image.width||b.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Jt.setupDepthRenderbuffer(b)}}let Vt=b.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(yt=!0);let Yt=Ct.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Yt[B])?z=Yt[B][W]:z=Yt[B],ot=!0):b.samples>0&&Jt.useMultisampledRTT(b)===!1?z=Ct.get(b).__webglMultisampledFramebuffer:Array.isArray(Yt)?z=Yt[W]:z=Yt,P.copy(b.viewport),O.copy(b.scissor),F=b.scissorTest}else P.copy(dt).multiplyScalar(G).floor(),O.copy(Xt).multiplyScalar(G).floor(),F=Kt;if(W!==0&&(z=Da),bt.bindFramebuffer(N.FRAMEBUFFER,z)&&X&&bt.drawBuffers(b,z),bt.viewport(P),bt.scissor(O),bt.setScissorTest(F),ot){let St=Ct.get(b.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+B,St.__webglTexture,W)}else if(yt){let St=B;for(let Vt=0;Vt<b.textures.length;Vt++){let Yt=Ct.get(b.textures[Vt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Vt,Yt.__webglTexture,W,St)}}else if(b!==null&&W!==0){let St=Ct.get(b.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,St.__webglTexture,W)}M=-1},this.readRenderTargetPixels=function(b,B,W,X,z,ot,yt,wt=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=Ct.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&yt!==void 0&&(St=St[yt]),St){bt.bindFramebuffer(N.FRAMEBUFFER,St);try{let Vt=b.textures[wt],Yt=Vt.format,zt=Vt.type;if(!qt.textureFormatReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qt.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=b.width-X&&W>=0&&W<=b.height-z&&(b.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+wt),N.readPixels(B,W,X,z,Pt.convert(Yt),Pt.convert(zt),ot))}finally{let Vt=I!==null?Ct.get(I).__webglFramebuffer:null;bt.bindFramebuffer(N.FRAMEBUFFER,Vt)}}},this.readRenderTargetPixelsAsync=async function(b,B,W,X,z,ot,yt,wt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let St=Ct.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&yt!==void 0&&(St=St[yt]),St)if(B>=0&&B<=b.width-X&&W>=0&&W<=b.height-z){bt.bindFramebuffer(N.FRAMEBUFFER,St);let Vt=b.textures[wt],Yt=Vt.format,zt=Vt.type;if(!qt.textureFormatReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qt.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let re=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,re),N.bufferData(N.PIXEL_PACK_BUFFER,ot.byteLength,N.STREAM_READ),b.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+wt),N.readPixels(B,W,X,z,Pt.convert(Yt),Pt.convert(zt),0);let ge=I!==null?Ct.get(I).__webglFramebuffer:null;bt.bindFramebuffer(N.FRAMEBUFFER,ge);let Ie=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Md(N,Ie,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,re),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ot),N.deleteBuffer(re),N.deleteSync(Ie),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,B=null,W=0){let X=Math.pow(2,-W),z=Math.floor(b.image.width*X),ot=Math.floor(b.image.height*X),yt=B!==null?B.x:0,wt=B!==null?B.y:0;Jt.setTexture2D(b,0),N.copyTexSubImage2D(N.TEXTURE_2D,W,0,0,yt,wt,z,ot),bt.unbindTexture()};let Os=N.createFramebuffer(),Bs=N.createFramebuffer();this.copyTextureToTexture=function(b,B,W=null,X=null,z=0,ot=null){ot===null&&(z!==0?(nr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ot=z,z=0):ot=0);let yt,wt,St,Vt,Yt,zt,re,ge,Ie,ce=b.isCompressedTexture?b.mipmaps[ot]:b.image;if(W!==null)yt=W.max.x-W.min.x,wt=W.max.y-W.min.y,St=W.isBox3?W.max.z-W.min.z:1,Vt=W.min.x,Yt=W.min.y,zt=W.isBox3?W.min.z:0;else{let nn=Math.pow(2,-z);yt=Math.floor(ce.width*nn),wt=Math.floor(ce.height*nn),b.isDataArrayTexture?St=ce.depth:b.isData3DTexture?St=Math.floor(ce.depth*nn):St=1,Vt=0,Yt=0,zt=0}X!==null?(re=X.x,ge=X.y,Ie=X.z):(re=0,ge=0,Ie=0);let _e=Pt.convert(B.format),kt=Pt.convert(B.type),we;B.isData3DTexture?(Jt.setTexture3D(B,0),we=N.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Jt.setTexture2DArray(B,0),we=N.TEXTURE_2D_ARRAY):(Jt.setTexture2D(B,0),we=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);let oe=N.getParameter(N.UNPACK_ROW_LENGTH),fn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),li=N.getParameter(N.UNPACK_SKIP_PIXELS),pn=N.getParameter(N.UNPACK_SKIP_ROWS),ci=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,ce.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ce.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Vt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Yt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,zt);let Ae=b.isDataArrayTexture||b.isData3DTexture,bn=B.isDataArrayTexture||B.isData3DTexture;if(b.isDepthTexture){let nn=Ct.get(b),ze=Ct.get(B),cn=Ct.get(nn.__renderTarget),ki=Ct.get(ze.__renderTarget);bt.bindFramebuffer(N.READ_FRAMEBUFFER,cn.__webglFramebuffer),bt.bindFramebuffer(N.DRAW_FRAMEBUFFER,ki.__webglFramebuffer);for(let yi=0;yi<St;yi++)Ae&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ct.get(b).__webglTexture,z,zt+yi),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ct.get(B).__webglTexture,ot,Ie+yi)),N.blitFramebuffer(Vt,Yt,yt,wt,re,ge,yt,wt,N.DEPTH_BUFFER_BIT,N.NEAREST);bt.bindFramebuffer(N.READ_FRAMEBUFFER,null),bt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(z!==0||b.isRenderTargetTexture||Ct.has(b)){let nn=Ct.get(b),ze=Ct.get(B);bt.bindFramebuffer(N.READ_FRAMEBUFFER,Os),bt.bindFramebuffer(N.DRAW_FRAMEBUFFER,Bs);for(let cn=0;cn<St;cn++)Ae?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,nn.__webglTexture,z,zt+cn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,nn.__webglTexture,z),bn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ze.__webglTexture,ot,Ie+cn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ze.__webglTexture,ot),z!==0?N.blitFramebuffer(Vt,Yt,yt,wt,re,ge,yt,wt,N.COLOR_BUFFER_BIT,N.NEAREST):bn?N.copyTexSubImage3D(we,ot,re,ge,Ie+cn,Vt,Yt,yt,wt):N.copyTexSubImage2D(we,ot,re,ge,Vt,Yt,yt,wt);bt.bindFramebuffer(N.READ_FRAMEBUFFER,null),bt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else bn?b.isDataTexture||b.isData3DTexture?N.texSubImage3D(we,ot,re,ge,Ie,yt,wt,St,_e,kt,ce.data):B.isCompressedArrayTexture?N.compressedTexSubImage3D(we,ot,re,ge,Ie,yt,wt,St,_e,ce.data):N.texSubImage3D(we,ot,re,ge,Ie,yt,wt,St,_e,kt,ce):b.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ot,re,ge,yt,wt,_e,kt,ce.data):b.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ot,re,ge,ce.width,ce.height,_e,ce.data):N.texSubImage2D(N.TEXTURE_2D,ot,re,ge,yt,wt,_e,kt,ce);N.pixelStorei(N.UNPACK_ROW_LENGTH,oe),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,fn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,li),N.pixelStorei(N.UNPACK_SKIP_ROWS,pn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,ci),ot===0&&B.generateMipmaps&&N.generateMipmap(we),bt.unbindTexture()},this.initRenderTarget=function(b){Ct.get(b).__webglFramebuffer===void 0&&Jt.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Jt.setTextureCube(b,0):b.isData3DTexture?Jt.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Jt.setTexture2DArray(b,0):Jt.setTexture2D(b,0),bt.unbindTexture()},this.resetState=function(){w=0,A=0,I=null,bt.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=he._getDrawingBufferColorSpace(t),e.unpackColorSpace=he._getUnpackColorSpace()}};var sf={type:"change"},wh={type:"start"},af={type:"end"},Vl=new Ci,rf=new Xn,vx=Math.cos(70*vr.DEG2RAD),Qe=new L,Dn=2*Math.PI,Me={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Th=1e-6,Gl=class extends _a{constructor(t,e=null){super(t,e),this.state=Me.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:$n.ROTATE,MIDDLE:$n.DOLLY,RIGHT:$n.PAN},this.touches={ONE:ri.ROTATE,TWO:ri.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new Pn,this._lastTargetPosition=new L,this._quat=new Pn().setFromUnitVectors(t.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Li,this._sphericalDelta=new Li,this._scale=1,this._panOffset=new L,this._rotateStart=new ut,this._rotateEnd=new ut,this._rotateDelta=new ut,this._panStart=new ut,this._panEnd=new ut,this._panDelta=new ut,this._dollyStart=new ut,this._dollyEnd=new ut,this._dollyDelta=new ut,this._dollyDirection=new L,this._mouse=new ut,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Sx.bind(this),this._onPointerDown=Mx.bind(this),this._onPointerUp=bx.bind(this),this._onContextMenu=Px.bind(this),this._onMouseWheel=wx.bind(this),this._onKeyDown=Ax.bind(this),this._onTouchStart=Rx.bind(this),this._onTouchMove=Cx.bind(this),this._onMouseDown=Ex.bind(this),this._onMouseMove=Tx.bind(this),this._interceptControlDown=Ix.bind(this),this._interceptControlUp=Dx.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(sf),this.update(),this.state=Me.NONE}update(t=null){let e=this.object.position;Qe.copy(e).sub(this.target),Qe.applyQuaternion(this._quat),this._spherical.setFromVector3(Qe),this.autoRotate&&this.state===Me.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Dn:n>Math.PI&&(n-=Dn),s<-Math.PI?s+=Dn:s>Math.PI&&(s-=Dn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Qe.setFromSpherical(this._spherical),Qe.applyQuaternion(this._quatInverse),e.copy(this.target).add(Qe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=Qe.length();a=this._clampDistance(o*this._scale);let c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let o=new L(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new L(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=Qe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Vl.origin.copy(this.object.position),Vl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Vl.direction))<vx?this.object.lookAt(this.target):(rf.setFromNormalAndCoplanarPoint(this.object.up,this.target),Vl.intersectPlane(rf,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Th||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Th||this._lastTargetPosition.distanceToSquared(this.target)>Th?(this.dispatchEvent(sf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Dn/60*this.autoRotateSpeed*t:Dn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Qe.setFromMatrixColumn(e,0),Qe.multiplyScalar(-t),this._panOffset.add(Qe)}_panUp(t,e){this.screenSpacePanning===!0?Qe.setFromMatrixColumn(e,1):(Qe.setFromMatrixColumn(e,0),Qe.crossVectors(this.object.up,Qe)),Qe.multiplyScalar(t),this._panOffset.add(Qe)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Qe.copy(s).sub(this.target);let r=Qe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Dn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Dn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Dn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Dn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ut,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Mx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Sx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function bx(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(af),this.state=Me.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Ex(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case $n.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Me.DOLLY;break;case $n.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Me.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Me.ROTATE}break;case $n.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Me.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Me.PAN}break;default:this.state=Me.NONE}this.state!==Me.NONE&&this.dispatchEvent(wh)}function Tx(i){switch(this.state){case Me.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Me.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Me.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function wx(i){this.enabled===!1||this.enableZoom===!1||this.state!==Me.NONE||(i.preventDefault(),this.dispatchEvent(wh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(af))}function Ax(i){this.enabled!==!1&&this._handleKeyDown(i)}function Rx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ri.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Me.TOUCH_ROTATE;break;case ri.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Me.TOUCH_PAN;break;default:this.state=Me.NONE}break;case 2:switch(this.touches.TWO){case ri.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Me.TOUCH_DOLLY_PAN;break;case ri.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Me.TOUCH_DOLLY_ROTATE;break;default:this.state=Me.NONE}break;default:this.state=Me.NONE}this.state!==Me.NONE&&this.dispatchEvent(wh)}function Cx(i){switch(this._trackPointer(i),this.state){case Me.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Me.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Me.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Me.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Me.NONE}}function Px(i){this.enabled!==!1&&i.preventDefault()}function Ix(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Dx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var pt=(i,t,e,n)=>({title:i,lessons:t.split("|"),start:e,dur:n}),Le=[{id:"nature",title:"Nature",blurb:"Forests, fungi and food webs.",terrain:"forest",top:"#5f9a5a",top2:"#4f8a52",paths:[pt("Forest Floor","Leaf litter|Mosses and ferns|Mushrooms|Fallen logs|Tiny hunters",1,8),pt("Trees of Europe","Oak|Beech|Scots pine|Birch|Chestnut|Rowan",2,9),pt("Birdsong","Dawn chorus|Robin|Blackbird|Owl calls",5,6),pt("Soil Life","Earthworms|Fungal networks|Compost|Roots",8,6),pt("Wildlife Watching","Tracks|Nests|Night visitors|Through the seasons",11,5)]},{id:"biology",title:"Biology & Life",blurb:"Rainforests, cells and slow change.",terrain:"forest",top:"#4f9e6b",top2:"#418c5a",paths:[pt("Rainforest Layers","Emergent giants|Canopy highways|Understory shade|The dark floor",0,8),pt("Cells at Work","Membranes|Mitochondria|Photosynthesis|Division",3,7),pt("Evolution","Variation|Selection|Speciation|Deep time",6,7),pt("Symbiosis","Pollinators|Mycorrhizae|Cleaner fish|Gut microbes",10,5)]},{id:"ocean",title:"Ocean",blurb:"Tides, reefs and the deep blue.",terrain:"pond",top:"#74b0ba",top2:"#62a0ab",paths:[pt("Coral Reefs","Reef builders|Fish of the lagoon|Sharks and rays|The reef at night",1,8),pt("The Deep Sea","Twilight zone|Hydrothermal vents|Giant squid|Bioluminescence",4,8),pt("Tides and Currents","Moon pull|Gyres|Upwelling|El Ni\xF1o",7,6),pt("Coastal Life","Rock pools|Mangroves|Dune plants",11,5)]},{id:"climate",title:"Climate & Environment",blurb:"Ice, air and a warming planet.",terrain:"alpine",top:"#9fc3cc",top2:"#8db2bd",paths:[pt("Frozen Worlds","Glaciers|Sea ice|Permafrost|Ice cores",0,8),pt("Weather Systems","Air masses|Fronts|Storms|Jet streams",2,7),pt("Carbon Cycle","Sinks and sources|Oceans breathe|Forests store|Fossil carbon",6,8),pt("Habitats Under Pressure","Coral bleaching|Range shifts|Extremes|Restoration",10,5)]},{id:"space",title:"Space & Astronomy",blurb:"Desert skies, planets and distant suns.",terrain:"mesa",top:"#b39bb5",top2:"#a189a4",paths:[pt("The Solar System","Rocky planets|Gas giants|Moons|Asteroids",1,8),pt("Stargazing","Constellations|Reading the night sky|Planets to spot",3,6),pt("Telescopes","Lenses and mirrors|Radio eyes|Space observatories",6,7),pt("Galaxies","The Milky Way|Spirals and ellipticals|Dark matter",10,5)]},{id:"geology",title:"Geology & Earth",blurb:"Strata, faults and fossils.",terrain:"mesa",top:"#d89a6a",top2:"#c98658",paths:[pt("Reading Rocks","Igneous|Sedimentary|Metamorphic|The rock cycle",0,8),pt("Canyons and Mesas","Erosion|Strata|Slot canyons|Hoodoos",3,7),pt("Fossils","How fossils form|Ammonites|Dinosaurs|Trace fossils",6,7),pt("Plate Tectonics","Drift|Subduction|Earthquakes|Volcanoes",9,6)]},{id:"physics",title:"Physics & Energy",blurb:"Forces, fields and flowing heat.",terrain:"mesa",top:"#c97b5f",top2:"#b56a4f",paths:[pt("Energy Basics","Kinetic and potential|Conservation|Power",1,7),pt("Heat and Steam","Conduction|Convection|Geothermal",3,7),pt("Electricity","Circuits|Fields|Motors|Grids",6,8),pt("Light","Waves|Spectra|Lenses",10,5)]},{id:"chemistry",title:"Chemistry",blurb:"Crystals, reactions and the table of elements.",terrain:"alpine",top:"#a89ec4",top2:"#968cb3",paths:[pt("Atoms and Bonds","Elements|Ionic and covalent|Molecules",1,8),pt("Crystals","Lattices|Growing crystals|Gemstones|Quartz",3,7),pt("Reactions","Acids and bases|Oxidation|Catalysts",7,7)]},{id:"sport",title:"Sport",blurb:"Trails, summits and match days.",terrain:"alpine",top:"#a8bd8f",top2:"#96ac7e",paths:[pt("Mountain Sports","Trail running|Climbing|Ski touring|Safety",1,8),pt("Training Basics","Endurance|Strength|Recovery|Fueling",4,7),pt("Team Sports","Formations|Set pieces|Reading the game",7,6),pt("Legendary Races","Tour climbs|Marathons|Ocean crossings",10,5),pt("Racket Skills","Serve|Rally|Net play|Match craft",12,4)]},{id:"health",title:"Health & Body",blurb:"Sleep, movement and steady habits.",terrain:"meadow",top:"#9cbf7a",top2:"#8aae69",paths:[pt("Sleep Hygiene","Light and dark|Wind-down routine|Caffeine|Naps",0,7),pt("Gentle Movement","Morning stretch|Walking|Posture",3,6),pt("Nutrition Basics","Plates|Protein|Fiber|Hydration",6,7),pt("Listening to Your Body","Rest days|Signals|Check-ups",10,5)]},{id:"mind",title:"Mind & Psychology",blurb:"Attention, memory and calm.",terrain:"pond",top:"#a3b899",top2:"#92a788",paths:[pt("Breathing","Box breathing|Long exhale|Body scan",1,6),pt("How Memory Works","Encoding|Forgetting|Spaced practice",3,7),pt("Attention","Distraction|Deep work|Flow",6,7),pt("Emotions","Naming feelings|Stress response|Reappraisal",9,6)]},{id:"cooking",title:"Cooking & Food",blurb:"Grow it, cook it, taste it.",terrain:"orchard",top:"#b0a45f",top2:"#9d9350",paths:[pt("Kitchen Garden","Sowing carrots|Tomatoes|Herbs on a sill|Harvest day",0,9),pt("Bread Basics","Flour and water|Kneading|Proofing|Scoring a loaf",3,7),pt("Knife Skills","The claw grip|Dicing|Julienne|Sharpening",6,6),pt("Sauces","Roux|Vinaigrette|Tomato base",9,5),pt("Fermentation","Yogurt|Kimchi|Sourdough",12,4)]},{id:"languages",title:"Languages",blurb:"Words for the people you love.",terrain:"meadow",top:"#8fbf63",top2:"#7aae55",paths:[pt("Early Childhood English","Comforting a crying baby|Routines and transitions|Bath time|Bedtime stories",0,8),pt("Professional English","Introductions|Small talk|Emails that get answers|Meetings",3,8),pt("Travel English","At the airport|Ordering food|Finding the way",7,6),pt("Idioms Garden","Piece of cake|Under the weather|Break the ice|Spill the beans",10,5)]},{id:"art",title:"Art & Design",blurb:"Color, composition and seeing.",terrain:"lavender",top:"#c4a86f",top2:"#b2965e",paths:[pt("Color Theory","Hue and value|Complements|Warm and cool",1,7),pt("Composition","Rule of thirds|Leading lines|Negative space",4,7),pt("Drawing Basics","Gesture|Proportion|Light and shadow",7,6),pt("Looking at Art","Cave walls|Renaissance|Impressionism|Today",10,6)]},{id:"music",title:"Music",blurb:"Rhythm, pitch and play.",terrain:"lavender",top:"#a9b27c",top2:"#97a46d",paths:[pt("Rhythm Basics","Pulse|Quarter notes|Syncopation|Polyrhythm",1,8),pt("Reading Notation","The staff|Clefs|Key signatures|Dynamics",4,8),pt("Ear Training","Intervals|Major or minor|Chords by ear",8,6)]},{id:"history",title:"History",blurb:"Peaks and turning points.",terrain:"alpine",top:"#b5a685",top2:"#a39473",paths:[pt("Ancient Worlds","Mesopotamia|Egypt|Greece|Rome",1,8),pt("Medieval Europe","Castles|Guilds|Plague|Printing press",4,8),pt("Industrial Age","Steam|Railways|Factories|Cities",7,7),pt("Twentieth Century","World wars|Cold war|Decolonization",10,6)]},{id:"technology",title:"Technology & AI",blurb:"Networks, code and learning machines.",terrain:"pond",top:"#7dada4",top2:"#6b9b93",paths:[pt("How the Internet Works","Packets|Routers|Protocols|Data centers",0,8),pt("Machine Learning","Data|Training|Inference|Limits",3,8),pt("Cybersecurity","Passwords|Phishing|Encryption",7,6),pt("Computing History","Vacuum tubes|Transistors|Personal computers",10,5)]},{id:"engineering",title:"Engineering & Invention",blurb:"Bridges, machines and clever fixes.",terrain:"mesa",top:"#93a1a8",top2:"#82919a",paths:[pt("Bridges","Beams|Arches|Suspension|Failure lessons",1,8),pt("Machines","Levers|Gears|Engines|Robots",4,8),pt("Inventions That Stuck","Printing|Electric light|Radio|The chip",8,7)]},{id:"mathematics",title:"Mathematics",blurb:"Patterns, proofs and terraces of ideas.",terrain:"meadow",top:"#a4c76a",top2:"#93b55b",paths:[pt("Numbers","Primes|Fractions|Zero|Infinity",1,8),pt("Geometry","Triangles|Circles|Symmetry|Tilings",4,8),pt("Chance","Probability|Averages|Surprising paradoxes",7,7),pt("Graphs and Networks","Nodes and edges|Trees|Shortest paths",10,6)]},{id:"economics",title:"Economics & Money",blurb:"Harvests, trade and what things cost.",terrain:"orchard",top:"#cbb26a",top2:"#b8a05a",paths:[pt("Money Basics","Coins and notes|Banks|Interest",1,7),pt("Markets","Supply and demand|Prices|Trade",4,8),pt("Booms and Busts","Bubbles|Crashes|Recoveries",8,7),pt("Personal Finance","Budgets|Saving|Compound growth",11,5)]}];function Oi(i,t){let e=(i-t.start)/t.dur;return Math.max(0,Math.min(1,e))}var Lx=[[0,0],[1,0],[-1,1],[0,-1],[0,1],[-1,0],[1,-1]],Rh=[[0,0],[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1],[2,0],[2,-1],[2,-2],[1,-2],[0,-2],[-1,-1],[-2,0],[-2,1],[-2,2],[-1,2],[0,2],[1,2],[3,-2]],Ch=Math.sqrt(3)*3.15+.5,Ux=([i,t])=>{let e=Ch/Math.sqrt(3);return[e*Math.sqrt(3)*(i+t/2),e*1.5*t]},of=Rh.map(Ux),Ta=Le.map(i=>{let t=new Map,e=1.035,n=a=>a.map(o=>Math.round(o*1e5)).join(",");i.paths.forEach((a,o)=>{let[c,l]=Lx[o],d=e*Math.sqrt(3)*(c+l/2),h=e*1.5*l,f=Array.from({length:6},(u,g)=>[d+Math.cos(Math.PI/6+g*Math.PI/3)*e,h+Math.sin(Math.PI/6+g*Math.PI/3)*e]);f.forEach((u,g)=>{let _=f[(g+1)%6],m=n(u),p=n(_),S=[m,p].sort().join("|");t.has(S)?t.delete(S):t.set(S,[u,_])})});let s=[...t.values()],r=[s.shift()];for(;s.length;){let a=n(r.at(-1)[1]),o=s.findIndex(c=>n(c[0])===a);if(o<0)throw new Error("Open footprint");r.push(s.splice(o,1)[0])}return r.map(([a])=>a.map(o=>o*1.13))}),Nx=.9,os=Le.map((i,t)=>{let[e,n]=of[t],s=Ta[t].map(([r,a])=>[r*2.1,a*2.1]);of.forEach(([r,a],o)=>{if(o===t)return;let c=r-e,l=a-n,d=Math.hypot(c,l),h=d*d/2-Nx/2*d,f=[];s.forEach((u,g)=>{let _=s[(g+1)%s.length],m=c*u[0]+l*u[1]-h,p=c*_[0]+l*_[1]-h;if(m<=0&&f.push(u),m<0!=p<0){let S=m/(m-p);f.push([u[0]+(_[0]-u[0])*S,u[1]+(_[1]-u[1])*S])}}),s=f}),s=s.filter((r,a)=>Math.hypot(r[0]-s[(a+1)%s.length][0],r[1]-s[(a+1)%s.length][1])>1e-5);for(let r=0;r<12;r++){let a=Math.cos(r*Math.PI/6),o=Math.sin(r*Math.PI/6),c=[];s.forEach((l,d)=>{let h=s[(d+1)%s.length],f=a*l[0]+o*l[1]-3.85,u=a*h[0]+o*h[1]-3.85;if(f<=0&&c.push(l),f<0!=u<0){let g=f/(f-u);c.push([l[0]+(h[0]-l[0])*g,l[1]+(h[1]-l[1])*g])}}),s=c}return s}),zM=os.map(i=>Math.max(...i.map(([t,e])=>Math.hypot(t,e)))),lf=[{name:"Wild Earth",themes:[0,1,2,3]},{name:"Stone & Sky",themes:[4,5,6,7]},{name:"Body & Mind",themes:[8,9,10,11]},{name:"Arts & Letters",themes:[12,13,14,15]},{name:"Human Systems",themes:[16,17,18,19]}];var Ah=(i,t,e)=>{let n=Math.sin(i*127.1+t*311.7+e*74.7)*43758.5453;return n-Math.floor(n)};function Wl(i,t,e=Ta[t]){if(!i.getAttribute("color")){let w=new ns,A=new Pi;e.forEach(([M,x],P)=>{w[P?"lineTo":"moveTo"](M,-x),A[P?"lineTo":"moveTo"](M*.967,-x*.967)}),w.closePath(),A.closePath(),w.holes.push(A);let I=new Ts(w).rotateX(-Math.PI/2);return i.dispose(),I}let s=[],r=[],a=Le[t],o=t+1,c=.55,l=.12,d=new vt(a.top2),h=new vt(a.top),f=(w,A)=>{s.push(...w),r.push(A.r,A.g,A.b)},u=(w,A,I,M,x=!1)=>{x&&(A[2]-w[2])*(I[0]-w[0])-(A[0]-w[0])*(I[2]-w[2])<0&&([A,I]=[I,A]),f(w,M),f(A,M),f(I,M)},g=(w,A)=>w.map((I,M)=>(I+A[M])/2),_=(w,A,I,M)=>{if(M){let F=g(w,A),k=g(A,I),Y=g(I,w);_(w,F,Y,M-1),_(F,A,k,M-1),_(Y,k,I,M-1),_(F,k,Y,M-1);return}let x=(w[0]+A[0]+I[0])/3,P=(w[2]+A[2]+I[2])/3,O=d.clone().lerp(h,Ah(Math.floor(x*.8),Math.floor(P*.8),o+11)).multiplyScalar(.94+Ah(x*3.1,P*2.7,o)*.12);u(w,A,I,O,!0)},m=e.map(([w,A])=>new ut(w*.97,A*.97));Ai.triangulateShape(m,[]).forEach(w=>_(...w.map(A=>[m[A].x,c,m[A].y]),2));let p=[c-l,(c-l)*.72,(c-l)*.44,(c-l)*.2,0],S=["#a97c52","#946a45","#7b5738","#5f432c"],E=(w,A,I,M,x)=>{u(w,A,I,x),u(w,I,M,x)},y=Ai.isClockWise(e.map(([w,A])=>new ut(w,A)))?[...e].reverse():e;y.forEach((w,A)=>{let I=y[(A+1)%y.length];E([w[0]*.97,c,w[1]*.97],[I[0]*.97,c,I[1]*.97],[I[0],c-l,I[1]],[w[0],c-l,w[1]],d.clone().multiplyScalar(.82)),p.slice(0,-1).forEach((M,x)=>E([w[0],M,w[1]],[I[0],M,I[1]],[I[0],p[x+1],I[1]],[w[0],p[x+1],w[1]],new vt(S[x]).multiplyScalar(.96+Ah(w[0]*5,M*7+I[1],o)*.08)))});let R=new xe;return R.setAttribute("position",new Qt(s,3)),R.setAttribute("color",new Qt(r,3)),R.computeVertexNormals(),R.computeBoundingSphere(),i.dispose(),R}var Ph=[{name:"Earth & cosmos",themes:[0,2,3,4,5],center:[-6,-5],slots:[[0,0],[1,0],[0,1],[-1,1],[-1,0]]},{name:"Life & wellbeing",themes:[1,8,9,10,11],center:[5,-4],slots:[[0,0],[0,-1],[1,-1],[1,0],[0,1]]},{name:"Science & making",themes:[6,7,16,17,18],center:[-5,5],slots:[[0,0],[-1,0],[-1,1],[0,1],[1,0]]},{name:"Culture & society",themes:[12,13,14,15,19],center:[7,6],slots:[[0,0],[0,-1],[1,-1],[-1,0],[0,1]]}],wa=Array.from({length:20});Ph.forEach(i=>i.themes.forEach((t,e)=>{let[n,s]=i.slots[e];wa[t]=[i.center[0]+2.65*(n+s/2),i.center[1]+2.65*Math.sqrt(3)/2*s]}));function cs(i){let t=i>>>0;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Fx=(i,t,e)=>{let n=Math.sin(i*127.1+t*311.7+e*74.7)*43758.5453;return n-Math.floor(n)};function ls(i,t,e=0){let n=i.attributes.position;for(let s=0;s<n.count;s++){let r=n.getX(s),a=n.getY(s),o=n.getZ(s),c=l=>(Fx(Math.round(r*997)+e+l,Math.round(a*991),Math.round(o*983))-.5)*2*t;n.setXYZ(s,r+c(1),a+c(2),o+c(3))}return i}var Lh=class{constructor(t=1){this.pos=[],this.col=[],this.rng=cs(t),this.tmp=new vt}add(t,{p:e=[0,0,0],r:n=[0,0,0],s=[1,1,1],c:r="#ffffff",j:a=.07,grad:o=0}={}){let c=t.index?t.toNonIndexed():t.clone();c.applyMatrix4(new ue().compose(new L(...e),new Pn().setFromEuler(new zn(...n)),new L(...s)));let l=c.attributes.position.array,d=new vt(r),h=1/0,f=-1/0;for(let u=1;u<l.length;u+=3)h=Math.min(h,l[u]),f=Math.max(f,l[u]);for(let u=0;u<l.length;u+=9){let g=1+(this.rng()-.5)*2*a;for(let _=0;_<3;_++){let m=l[u+_*3+1],p=f>h?(m-h)/(f-h):.5,S=g*(1+o*(p-.5));this.col.push(d.r*S,d.g*S,d.b*S),this.pos.push(l[u+_*3],l[u+_*3+1],l[u+_*3+2])}}c.dispose()}build(){let t=new xe;return t.setAttribute("position",new Qt(this.pos,3)),t.setAttribute("color",new Qt(this.col,3)),t.computeVertexNormals(),t}},ln=(i,t,e)=>new ra(i,t,e).translate(0,t/2,0),Pe=(i,t,e,n)=>new Yn(t,i,e,n).translate(0,e/2,0),Te=(i,t,e=.12,n=0)=>ls(new si(i,t).toNonIndexed(),i*e,n),Ih=["#6faa4f","#5f9c47","#7cb857","#4f8f45"],Dh=["#3f7d48","#35703f","#4a8a50"];function cf(i){let t=i>=1,e={},n=t?7:5,s=t?1:0,r=(h,f,u)=>{let g=new Lh(f);u(g),e[h]=g.build()},a="#8a6444",o=(h,f,u)=>{if(h.add(Pe(.07,.04,.55,n),{c:a,j:.05}),h.add(Pe(.02,.012,.3,4),{p:[.06,.38,0],r:[0,0,-.9],c:a}),[[0,.82,0,.36],[.2,.64,.1,.25],[-.2,.68,-.08,.26],[.04,1.06,-.04,.26],[-.06,.62,.22,.2]].forEach(([_,m,p,S],E)=>h.add(Te(S,s,.14,E),{p:[_,m,p],s:[1,.9,1],c:f[E%f.length],j:.09,grad:.35})),u)for(let _=0;_<(t?9:4);_++){let m=_*2.4,p=.33;h.add(new si(.045,0),{p:[Math.cos(m)*p*(.8+_%3*.1),.62+_%4*.12,Math.sin(m)*p*.9],c:u,j:.1})}};r("tree",11,h=>o(h,Ih)),r("forestTree",12,h=>o(h,Dh)),r("appleTree",13,h=>o(h,Ih,"#e2573c")),r("blossomTree",14,h=>o(h,["#f1b8c4","#eaa3b4","#f7cdd5"]));let c=h=>f=>{f.add(Pe(.06,.04,.35,5),{c:"#6e4f38"});let u=t?5:4;for(let g=0;g<u;g++){let _=.42-g*.07,m=.46-g*.03,p=.22+g*.26;f.add(ls(ln(_,m,t?8:6).toNonIndexed(),.012,g),{p:[0,p,0],r:[0,g*.5,0],c:Dh[g%3],j:.08,grad:.3}),h&&f.add(ln(_*.62,m*.55,t?8:6),{p:[0,p+m*.5,0],r:[0,g*.5,0],c:"#f4f6f4",j:.03})}};r("pine",21,c(!1)),r("snowPine",22,c(!0));let l=h=>f=>{if([[0,.17,0,.2],[.17,.12,.05,.14],[-.15,.13,-.04,.15],[.02,.14,.17,.13]].forEach(([u,g,_,m],p)=>f.add(Te(m,s,.14,p),{p:[u,g,_],c:Ih[p%4],j:.09,grad:.4})),h)for(let u=0;u<(t?10:5);u++){let g=u*2.1;f.add(new si(.035,0),{p:[Math.cos(g)*.2,.18+u%3*.06,Math.sin(g)*.2],c:h,j:.1})}};r("bush",31,l()),r("berryBush",32,l("#d84a4a")),r("herbBush",33,l("#f6f3ea"));let d=(h,f=.36)=>u=>{u.add(Pe(.012,.01,f,4),{c:"#5d9b48",j:.04}),u.add(ln(.05,.1,3),{p:[.03,f*.3,0],r:[0,0,-1.1],c:"#6fae51"}),u.add(ln(.05,.1,3),{p:[-.03,f*.5,0],r:[0,0,1.1],c:"#6fae51"});let g=t?6:5;for(let _=0;_<g;_++){let m=_/g*Math.PI*2;u.add(Te(.05,0,.1,_),{p:[Math.cos(m)*.055,f,Math.sin(m)*.055],s:[1,.55,1],c:h,j:.06})}u.add(new si(.035,0),{p:[0,f+.01,0],c:"#f5c542",j:.04})};return r("flowerPink",41,d("#ee86a9")),r("flowerYellow",42,d("#f6cf4a",.3)),r("flowerWhite",43,d("#fbf8ef",.32)),r("flowerOrange",44,d("#ee8a3c",.28)),r("flowerBlue",45,d("#7fa6e6",.34)),r("sunflower",51,h=>{h.add(Pe(.025,.02,.78,5),{c:"#5b9645",j:.04}),h.add(ln(.1,.22,3),{p:[.07,.25,0],r:[0,0,-1.2],s:[1,1,.5],c:"#69a84e"}),h.add(ln(.1,.22,3),{p:[-.07,.42,0],r:[0,0,1.2],s:[1,1,.5],c:"#69a84e"});let f=t?13:8;for(let u=0;u<f;u++){let g=u/f*Math.PI*2;h.add(ln(.05,.17,3),{p:[Math.cos(g)*.12,.8+Math.sin(g)*.12*.35,Math.sin(g)*.12],r:[Math.PI/2-.3,0,-g+Math.PI/2],c:"#f8c933",j:.07})}h.add(Pe(.1,.1,.05,8),{p:[0,.77,.03],r:[.35,0,0],c:"#6b4426",j:.06})}),r("lavender",61,h=>{let f=t?7:4;for(let u=0;u<f;u++){let g=u/f*6.28+.4,_=.14,m=Math.cos(g)*.06,p=Math.sin(g)*.06;h.add(Pe(.012,.008,.34,4),{p:[m,0,p],r:[Math.sin(g)*_,0,-Math.cos(g)*_],c:"#6d9a58"});for(let S=0;S<(t?5:3);S++)h.add(Te(.034-S*.002,0,.1,u*7+S),{p:[m+Math.cos(g)*.04,.3+S*.045+u%2*.02,p+Math.sin(g)*.04],s:[1,1.3,1],c:S%2?"#9b7bd0":"#8a68c4",j:.08})}}),r("cactus",71,h=>{let f="#5b9a5e";h.add(new mi(.1,.5,3,t?8:6).translate(0,.35,0),{c:f,j:.06}),h.add(new mi(.055,.2,3,6),{p:[.2,.42,0],r:[0,0,0],c:f}),h.add(new mi(.05,.1,3,6),{p:[.14,.31,0],r:[0,0,1.57],c:f}),h.add(new mi(.05,.16,3,6),{p:[-.18,.5,0],c:f}),h.add(new mi(.045,.1,3,6),{p:[-.13,.4,0],r:[0,0,1.57],c:f}),h.add(Te(.04,0,.1),{p:[0,.74,0],c:"#ee6f9a"})}),r("agave",72,h=>{let f=t?11:7;for(let u=0;u<f;u++){let g=u*2.4,_=u%3/3;h.add(ls(ln(.06,.38-_*.1,4).toNonIndexed(),.004,u),{p:[Math.cos(g)*.03,.04,Math.sin(g)*.03],r:[Math.sin(g)*(.7+_*.4),0,-Math.cos(g)*(.7+_*.4)],s:[1,1,.4],c:u%2?"#7aa88a":"#6b9a7d",j:.07})}}),r("reed",81,h=>{let f=t?6:4;for(let u=0;u<f;u++){let g=u*1.9,_=.55+u%3*.12,m=Math.cos(g)*.05,p=Math.sin(g)*.05,S=.1+u%2*.06;h.add(ln(.016,_,4),{p:[m,0,p],r:[Math.sin(g)*S,0,-Math.cos(g)*S],c:u%2?"#7aa95a":"#6b9a50"}),u%2===0&&h.add(Pe(.025,.025,.12,5),{p:[m+Math.cos(g)*_*S*.9,_*.8,p+Math.sin(g)*_*S*.9],c:"#6b4a32"})}}),r("lotus",82,h=>{h.add(new Yn(.2,.2,.012,t?10:7).translate(0,.01,0),{c:"#5da37a",j:.06});let f=t?8:6;for(let u=0;u<f;u++){let g=u/f*6.28;h.add(Te(.06,0,.08,u),{p:[Math.cos(g)*.055,.1,Math.sin(g)*.055],r:[Math.sin(g)*.6,0,-Math.cos(g)*.6],s:[.8,1.6,.8],c:"#f4a4c0",j:.05})}h.add(Te(.03,0,.1),{p:[0,.1,0],c:"#f5cf50"})}),r("fern",91,h=>{let f=t?9:6;for(let u=0;u<f;u++){let g=u/f*6.28,_=.8+u%3*.2;h.add(ls(ln(.055,.42,4).toNonIndexed(),.004,u),{p:[0,.03,0],r:[Math.sin(g)*_,0,-Math.cos(g)*_],s:[1,1,.3],c:u%2?"#4f9552":"#5aa35a",j:.07})}}),r("mushroom",92,h=>{h.add(Pe(.035,.03,.12,6),{c:"#f1e8d6"}),h.add(new Di(.1,8,4,0,6.28,0,Math.PI/2).translate(0,.1,0),{c:"#d6432f",j:.05});for(let f=0;f<4;f++)h.add(new si(.018,0),{p:[Math.cos(f*1.6)*.055,.17+f%2*.01,Math.sin(f*1.6)*.055],c:"#fff8ea",j:0})}),r("carrot",93,h=>{h.add(ln(.045,.2,6),{p:[0,.03,0],r:[Math.PI,0,0],c:"#f08a24",j:.07});let f=t?7:5;for(let u=0;u<f;u++){let g=u/f*6.28;h.add(ln(.02,.22,3),{p:[Math.cos(g)*.02,.04,Math.sin(g)*.02],r:[Math.sin(g)*.55,0,-Math.cos(g)*.55],s:[1,1,.5],c:"#5ea84a",j:.06})}}),r("rock",101,h=>{h.add(Te(.12,0,.25,3),{s:[1.3,.7,1],p:[0,.05,0],c:"#b7b2a6",j:.1,grad:.3}),h.add(Te(.07,0,.25,4),{p:[.14,.03,.05],c:"#a8a397",j:.1})}),r("redRock",102,h=>{h.add(Te(.13,0,.25,5),{s:[1.2,.8,1],p:[0,.06,0],c:"#c4714a",j:.1,grad:.4}),h.add(Te(.07,0,.25,6),{p:[-.14,.03,.04],c:"#b5643f",j:.1})}),r("pebble",103,h=>h.add(Te(.035,0,.2,7),{s:[1.4,.5,1],c:"#eee8d8",j:.05})),r("mound",104,h=>h.add(new Di(.1,8,4,0,6.28,0,Math.PI/2),{s:[1,.45,1],c:"#8a6a4a",j:.1})),r("sprout",105,h=>{h.add(Pe(.008,.006,.09,3),{c:"#7ab85a"}),h.add(Te(.028,0,.1,1),{p:[.03,.09,0],s:[1.4,.5,1],c:"#8ccb63"}),h.add(Te(.028,0,.1,2),{p:[-.03,.1,0],s:[1.4,.5,1],c:"#7ab85a"})}),r("flag",106,h=>{h.add(Pe(.012,.012,.6,4),{c:"#d9cdb8"}),h.add(new xe().setFromPoints([new L(0,.6,0),new L(.22,.52,0),new L(0,.44,0)]).setIndex([0,1,2,0,2,1]),{c:"#c65d3b",j:0})}),r("emergentTree",110,h=>{h.add(Pe(.05,.08,1.15,n),{c:"#7a5a3e",j:.05}),[[0,1.42,0,.42],[.26,1.24,.08,.28],[-.24,1.28,-.1,.29],[.02,1.66,-.05,.3],[-.05,1.22,.26,.24]].forEach(([f,u,g,_],m)=>h.add(Te(_,s,.13,m),{p:[f,u,g],s:[1,.82,1],c:Dh[m%3],j:.08,grad:.4}));for(let f=0;f<(t?7:4);f++){let u=f*2.2;h.add(Te(.035,0,.1,f),{p:[Math.cos(u)*.34,1.28+f%3*.14,Math.sin(u)*.34],c:"#f2b8cf",j:.08})}}),r("oliveTree",111,h=>{h.add(Pe(.05,.09,.4,n),{c:"#7d6448",j:.08}),h.add(Pe(.03,.045,.28,4),{p:[.1,.3,.02],r:[0,0,-.5],c:"#7d6448"});let f=["#8fa37c","#9db089","#7d9470"];[[0,.58,0,.3],[.22,.5,.06,.22],[-.2,.52,-.06,.23],[.02,.74,-.04,.2]].forEach(([u,g,_,m],p)=>h.add(Te(m,s,.16,p),{p:[u,g,_],s:[1,.72,1],c:f[p%3],j:.09,grad:.35}))}),r("windmill",112,h=>{h.add(Pe(.1,.17,.95,t?8:6),{c:"#f0e6d2",j:.05,grad:.25}),h.add(ln(.13,.18,t?8:6),{p:[0,.95,0],c:"#a94a2c",j:.05}),h.add(new qn(.1,.14,.06),{p:[0,.32,.15],c:"#8a6444"});for(let f=0;f<4;f++)h.add(new qn(.62,.085,.02),{p:[Math.sin(f*Math.PI/2+.4)*.3,1+Math.cos(f*Math.PI/2+.4)*.3,.13],r:[0,0,-f*Math.PI/2-.4],c:"#e8dcc2",j:.03});h.add(Pe(.035,.035,.08,5),{p:[0,.95,.1],r:[Math.PI/2,0,0],c:"#6e4f38"})}),r("standingStone",113,h=>{h.add(Te(.16,s,.18,8),{p:[0,.32,0],s:[.75,2.4,.55],c:"#9a958a",j:.07,grad:.3}),h.add(Te(.06,0,.2,9),{p:[.2,.03,.1],s:[1.3,.6,1],c:"#a8a397",j:.08})}),r("iceberg",114,h=>{h.add(ls(ln(.34,.75,t?7:5).toNonIndexed(),.02,3),{p:[-.05,0,0],c:"#eef4f6",j:.05,grad:.35}),h.add(ls(ln(.22,.5,5).toNonIndexed(),.015,4),{p:[.28,0,.12],r:[0,.7,0],c:"#dceaf2",j:.05,grad:.3}),h.add(Te(.2,s,.12,5),{p:[.05,.02,-.2],s:[1.4,.35,1.1],c:"#cfe4ee",j:.05})}),r("observatory",115,h=>{h.add(Pe(.24,.27,.42,t?10:7),{c:"#f2efe8",j:.04,grad:.2}),h.add(new Di(.26,t?12:8,5,0,6.28,0,Math.PI/2).translate(0,.42,0),{c:"#e4ded0",j:.04}),h.add(new qn(.07,.2,.06),{p:[0,.52,.22],c:"#4a4440",j:0}),h.add(Pe(.05,.05,.22,5),{p:[0,.58,.26],r:[1.1,0,0],c:"#b9b3a2"})}),r("terraces",116,h=>{let f=["#a4c76a","#93b55b","#84a84e","#759a44"];for(let u=0;u<4;u++)h.add(new Yn(.34-u*.08,.38-u*.08,.1,t?10:7).translate(0,.05+u*.1,0),{c:f[u],j:.06});h.add(new Yn(.07,.07,.02,7).translate(0,.42,0),{c:"#8fc7d0",j:.03})}),r("coralHead",117,h=>{h.add(Te(.12,s,.15,2),{p:[0,.06,0],s:[1.3,.6,1.2],c:"#d8b898",j:.08});let f=["#f28ca6","#ee8a3c","#f6b1c3"];for(let u=0;u<(t?6:4);u++){let g=u*2.3,_=.35+u%3*.18,m=.3+u%3*.12;h.add(new mi(.045,m,3,5).translate(0,m/2,0),{p:[Math.cos(g)*.1,.08,Math.sin(g)*.1],r:[Math.sin(g)*_,0,-Math.cos(g)*_],c:f[u%3],j:.07}),h.add(Te(.05,0,.1,u),{p:[Math.cos(g)*(.1+_*m*.7),.12+m,Math.sin(g)*(.1+_*m*.7)],c:f[(u+1)%3],j:.08})}}),r("mangrove",118,h=>{for(let f=0;f<5;f++){let u=f/5*6.28;h.add(Pe(.018,.028,.42,4),{p:[Math.cos(u)*.22,0,Math.sin(u)*.22],r:[Math.sin(u)*.55,0,-Math.cos(u)*.55],c:"#7a5a3e",j:.06})}h.add(Pe(.06,.05,.35,n),{p:[0,.32,0],c:"#6e4f38"}),[[0,.85,0,.34],[.22,.72,.1,.24],[-.2,.74,-.08,.25]].forEach(([f,u,g,_],m)=>h.add(Te(_,s,.14,m+4),{p:[f,u,g],s:[1,.75,1],c:["#4f8f6a","#5d9c72","#43825e"][m],j:.08,grad:.35}))}),r("basaltColumns",119,h=>{let f=[.55,.8,.42,.68,.3],u=["#7d8891","#6b767f","#8b969e"];f.forEach((g,_)=>{let m=_*2.4,p=_?.16:0;h.add(new Yn(.11,.13,g,6).translate(Math.cos(m)*p,g/2,Math.sin(m)*p),{c:u[_%3],j:.06,grad:.3})})}),r("hoodoo",120,h=>{h.add(Pe(.16,.22,.3,6),{c:"#c4714a",j:.06}),h.add(Pe(.11,.15,.34,6),{p:[0,.3,0],c:"#b5643f",j:.06}),h.add(Te(.14,s,.15,6),{p:[0,.68,0],s:[1.25,.55,1.1],c:"#d08a5e",j:.07})}),r("volcanicVent",121,h=>{h.add(ls(ln(.3,.42,t?8:6).toNonIndexed(),.02,7),{c:"#4a3f3a",j:.07,grad:.3}),h.add(Te(.09,0,.15,8),{p:[0,.4,0],s:[1.2,.5,1.2],c:"#e86a2a",j:.12}),h.add(Te(.05,0,.1,9),{p:[.16,.2,.1],c:"#c2542a",j:.1})}),r("crystalCluster",122,h=>{let f=["#9b7bd0","#b394e0","#8a68c4"];[[0,.42,0,.1,0],[.16,.3,.06,.07,.45],[-.15,.26,-.05,.06,-.5],[.04,.2,-.14,.055,.2]].forEach(([u,g,_,m,p],S)=>h.add(ls(ln(m,g,5).toNonIndexed(),.004,S),{p:[u,0,_],r:[p*.4,S*.8,-p],c:f[S%3],j:.06,grad:.45})),h.add(Te(.08,0,.15,10),{p:[0,.02,0],s:[1.5,.4,1.4],c:"#cfc19e",j:.06})}),r("ruinColumn",123,h=>{h.add(new qn(.3,.07,.3),{p:[0,.035,0],c:"#ddd5c2",j:.05}),h.add(Pe(.09,.1,.52,t?9:6),{p:[0,.07,0],c:"#e4dcc8",j:.05,grad:.25}),h.add(new qn(.24,.06,.24),{p:[0,.6,0],c:"#d5ccb6",j:.05}),h.add(Pe(.09,.1,.26,6),{p:[.34,.05,.14],r:[0,0,1.35],c:"#d5ccb6",j:.06})}),r("wheat",124,h=>{let f=t?7:5;for(let u=0;u<f;u++){let g=u*2.1,_=.08+u%2*.08,m=Math.cos(g)*.045,p=Math.sin(g)*.045;h.add(Pe(.008,.006,.42,3),{p:[m,0,p],r:[Math.sin(g)*_,0,-Math.cos(g)*_],c:"#c9a83e"}),h.add(ln(.028,.14,4),{p:[m+Math.cos(g)*.42*_*.9,.4,p+Math.sin(g)*.42*_*.9],r:[Math.sin(g)*_,0,-Math.cos(g)*_],c:u%2?"#e0b93c":"#d4ab34",j:.07})}}),e}function hf(){let i=[],t=[];for(let r=0;r<=3;r++){let a=r/3,o=.5*(1-a*.92);i.push(-o*.07,a*1,0,o*.07,a*1,0)}for(let r=0;r<3;r++){let a=r*2;t.push(a,a+1,a+2,a+1,a+3,a+2)}let s=new xe;return s.setAttribute("position",new Qt(i,3)),s.setIndex(t),s.computeVertexNormals(),s}var Fs=(i,t,e)=>{let n=Math.sin(i*127.1+t*311.7+e*74.7)*43758.5453;return n-Math.floor(n)},Uh=(i,t,e)=>{let n=Math.floor(i),s=Math.floor(t),r=i-n,a=t-s,o=r*r*(3-2*r),c=a*a*(3-2*a),l=Fs(n,s,e),d=Fs(n+1,s,e),h=Fs(n,s+1,e),f=Fs(n+1,s+1,e);return l+(d-l)*o+(h-l)*c+(l-d-h+f)*o*c},Ox=(i,t,e=0)=>(Uh(i*.9,t*.9,e)-.5)*.5+(Uh(i*2.4,t*2.4,e+3)-.5)*.25,Bx=["#a97c52","#946a45","#7b5738","#5f432c"];function Tr(i,t,{K:e=6,top:n="#8fbf63",top2:s="#7aae55",bevel:r=.06,noise:a=.03,seed:o=1,strata:c=Bx,colorJitter:l=.08}={}){let d=[],h=[],f=new vt(n),u=new vt(s),g=new vt,_=Math.min(r*i,.12),m=i-_*1.2,p=[Math.cos(Math.PI/6),Math.sin(Math.PI/6)],S=[0,1],E=(F,k)=>`${F},${k}`,y=new Map;for(let F=-e;F<=e;F++)for(let k=-e;k<=e;k++){if(Math.abs(F+k)>e)continue;let Y=(F*p[0]+k*S[0])*(m/e),q=(F*p[1]+k*S[1])*(m/e),nt=Math.max(Math.abs(F),Math.abs(k),Math.abs(F+k))/e,G=Math.max(0,1-Math.pow(nt,3)),ht=t+(nt>=1?0:Ox(Y+o*17,q-o*5,o)*a*G*2),gt=Uh(Y*.8+9,q*.8+4,o+11),dt=1+(Fs(F,k,o)-.5)*2*l;g.copy(f).lerp(u,gt),g.multiplyScalar(dt),y.set(E(F,k),{x:Y,y:ht,z:q,c:g.clone()})}let R=(F,k)=>{d.push(F.x,F.y,F.z),h.push(k.r,k.g,k.b)},w=(F,k,Y)=>{let q=k.x-F.x,nt=k.z-F.z,G=Y.x-F.x,ht=Y.z-F.z,gt=nt*G-q*ht,dt=new vt().copy(F.c).add(k.c).add(Y.c).multiplyScalar(1/3);dt.multiplyScalar(1+(Fs(F.x*3.1,Y.z*2.7,o)-.5)*.08),gt>0?(R(F,dt),R(k,dt),R(Y,dt)):(R(F,dt),R(Y,dt),R(k,dt))};for(let F=-e;F<=e;F++)for(let k=-e;k<=e;k++){let Y=y.get(E(F,k)),q=y.get(E(F+1,k)),nt=y.get(E(F,k+1)),G=y.get(E(F+1,k+1));Y&&q&&nt&&w(Y,q,nt),q&&nt&&G&&w(q,G,nt)}let A=(F,k,Y,q)=>{let nt=Math.PI/6+F*Math.PI/3;return{x:Math.cos(nt)*k,y:Y,z:Math.sin(nt)*k,c:new vt(q)}},I=f.clone().multiplyScalar(.82),M=(F,k,Y,q,nt)=>{let G=[F,k,Y,q].map(dt=>({...dt,c:new vt(nt)})),ht=(dt,Xt,Kt)=>{let me=Xt.x-dt.x,jt=Xt.y-dt.y,Q=Xt.z-dt.z,tt=Kt.x-dt.x,Et=Kt.y-dt.y,$t=Kt.z-dt.z,Ut=jt*$t-Q*Et,se=me*Et-jt*tt,de=(dt.x+Xt.x+Kt.x)/3,N=(dt.z+Xt.z+Kt.z)/3;return Ut*de+se*N>0},gt=(dt,Xt,Kt)=>{let me=1+(Fs(dt.x*5,dt.y*7+Kt.z,o)-.5)*.12,jt=new vt(nt).multiplyScalar(me);ht(dt,Xt,Kt)?(R(dt,jt),R(Xt,jt),R(Kt,jt)):(R(dt,jt),R(Kt,jt),R(Xt,jt))};gt(G[0],G[1],G[2]),gt(G[0],G[2],G[3])},x=t-_,P=[x,x*.72,x*.44,x*.2,0];for(let F=0;F<6;F++){let k=A(F,m,t),Y=A(F+1,m,t),q=A(F,i,x),nt=A(F+1,i,x);M(k,Y,nt,q,I.getStyle());for(let G=0;G<4;G++)M(A(F,i,P[G]),A(F+1,i,P[G]),A(F+1,i,P[G+1]),A(F,i,P[G+1]),c[G])}let O=new xe;return O.setAttribute("position",new Qt(d,3)),O.setAttribute("color",new Qt(h,3)),O.computeVertexNormals(),O}function hs(i,t){let e=new ns,n=new Pi;for(let r=0;r<6;r++){let a=Math.PI/6+r*Math.PI/3,o=r?"lineTo":"moveTo";e[o](Math.cos(a)*i,Math.sin(a)*i),n[o](Math.cos(a)*(i-t),Math.sin(a)*(i-t))}e.closePath(),n.closePath(),e.holes.push(n);let s=new Ts(e);return s.rotateX(-Math.PI/2),s}var Xl=(i,t,e)=>({x:e*Math.sqrt(3)*(i+t/2),z:e*1.5*t}),Aa=(i,t,e)=>Math.abs(i)<=e*Math.sqrt(3)/2&&Math.abs(t)+Math.abs(i)/Math.sqrt(3)<=e;var zx={desktop:{name:"desktop",detail:1,shadows:!0,dpr:1.75,K:8,cellK:5,trailK:14,plants:30,grass:420,trailPlants:70,trailGrass:1300,creatures:10,pollen:150,clouds:6,fov:34},mobile:{name:"mobile",detail:0,shadows:!1,dpr:1.5,K:4,cellK:3,trailK:7,plants:11,grass:70,trailPlants:22,trailGrass:240,creatures:3,pollen:0,clouds:0,fov:38}},uf="#c65d3b",An=.55,Nh=.14,ql=3.15,Yl=1,Ra=6.8,wr=.8,$l=1.12,df=.2,kx=[[0,0],[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],Hx=[0,1,3,5,2,4,6],Bi=(i,t=0,e=1)=>Math.min(e,Math.max(t,i)),Oh=i=>(i=Bi(i),i*i*(3-2*i)),Sn=i=>String(i).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),Gn=6,Fh=3,ff=[[1,0],[0,1],[1,0],[1,-1],[1,0],[0,1]],Vx={meadow:{sig:["tree","blossomTree","tree"],mid:["bush","flowerPink","flowerBlue","flowerYellow"],low:["flowerPink","flowerYellow","flowerWhite","flowerBlue"],lesson:"tree",flower:"flowerPink"},forest:{sig:["pine","forestTree","pine"],mid:["fern","fern","bush"],low:["mushroom","fern","rock","mushroom"],lesson:"pine",flower:"mushroom"},orchard:{sig:["appleTree","appleTree"],mid:["herbBush","berryBush","sunflower"],low:["carrot","carrot","carrot","flowerWhite"],lesson:"appleTree",flower:"carrot"},mesa:{sig:["cactus","cactus"],mid:["agave","redRock","agave"],low:["flowerOrange","redRock","flowerOrange"],lesson:"cactus",flower:"flowerOrange"},lavender:{sig:["sunflower","sunflower"],mid:["lavender","lavender","lavender"],low:["lavender","flowerYellow","lavender"],lesson:"sunflower",flower:"lavender"},pond:{sig:["reed","reed","blossomTree"],mid:["reed","flowerWhite","bush"],low:["flowerWhite","flowerBlue","reed"],lesson:"lotus",flower:"flowerWhite"},alpine:{sig:["snowPine","snowPine","pine"],mid:["rock","bush","snowPine"],low:["flowerWhite","rock","flowerBlue"],lesson:"snowPine",flower:"flowerWhite"}},pf={tree:[.62,.85],blossomTree:[.6,.8],forestTree:[.6,.85],appleTree:[.58,.8],pine:[.62,.9],snowPine:[.6,.85],cactus:[.7,1],sunflower:[.8,1.1],reed:[.9,1.25]};function Zl(i,t,e,n,s){let r=[];for(let a=0;r.length<t&&a<t*40;a++){let o=(i()*2-1)*s,c=(i()*2-1)*s;e(o,c)&&(n>0&&r.some(l=>(l[0]-o)**2+(l[1]-c)**2<n*n)||r.push([o,c]))}return r}var Ca=class{constructor(t,e,n){this.species=t,this.mat=e,this.cast=n,this.items={},this.meshes=[],this.dummy=new Ve}add(t,e){(this.items[t]||=[]).push(e)}build(t){for(let[e,n]of Object.entries(this.items)){let s=new or(this.species[e],this.mat,n.length);s.castShadow=this.cast,s.receiveShadow=!0,s.frustumCulled=!1,n.forEach((r,a)=>s.setColorAt(a,r.tint||new vt(1,1,1))),s.instanceColor.needsUpdate=!0,s.userData.list=n,this.meshes.push(s),t.add(s)}}update(t){let e=this.dummy;for(let n of this.meshes){let s=n.userData.list;for(let r=0;r<s.length;r++){let a=s[r],o=t.get(a.key)??0,c=Oh((o-a.thr)/a.w);a.inv&&(c=1-c);let l=a.min!=null?a.min+(1-a.min)*c:c,d=a.s*Math.max(l*(a.grow?.65+.35*Bi(o):1),1e-4);e.position.set(a.x,a.y,a.z),e.rotation.set(0,a.rot,0),e.scale.set(d,d,d),e.updateMatrix(),n.setMatrixAt(r,e.matrix)}n.instanceMatrix.needsUpdate=!0}}dispose(){this.meshes.forEach(t=>{t.parent?.remove(t),t.dispose()})}};function mf({container:i,profile:t,state:e,reduced:n=!1,themeShape:s=null,displayProgress:r=null,groupFocus:a=!1,compact:o=!1,world:c=null}){let l=typeof t=="string"?zx[t]:t,d=l.name==="mobile",h=c?.groups||Ph,f=c?.noun||"group",u=c?.centers||wa,g=c?.styleOf||(()=>null),_=(T,D)=>{let V=g(D)?.ground;return V?{top:V.top||T.top,top2:V.top2||T.top2}:T},m=(T,D)=>g(D)?.mix||Vx[T.terrain],p=o?h:lf,S=T=>o?new L(u[T][0],An,u[T][1]):de[T].center,E=T=>o?Array.from({length:6},(D,V)=>[1.38*Math.cos(Math.PI/6+V*Math.PI/3),1.38*Math.sin(Math.PI/6+V*Math.PI/3)]):os[T],y=document.createElement("div");y.className=`lg-root ${d?"lg-mobile":"lg-desktop"}`,y.innerHTML=`<canvas class="lg-canvas" tabindex="0" aria-label="Interactive 3D garden of learning themes. Drag to orbit, scroll or pinch to zoom, tap a hexagon to open it."></canvas>
  <div class="lg-labels" aria-hidden="true"></div><div class="lg-fade"></div>
  <nav class="lg-crumbs" aria-label="Garden location"></nav>
  <div class="lg-stats" aria-label="Progress totals"></div>
  <aside class="lg-panel" aria-live="polite"><button class="lg-handle" aria-label="Expand or collapse details"><span></span></button><div class="lg-panel-body"></div></aside>
  <div class="lg-time"><button class="lg-play" aria-label="Play study timeline"></button><label class="lg-weekwrap"><span class="lg-weeklabel"></span><input class="lg-week" type="range" min="0" max="16" step="0.05" aria-label="Study week"></label><button class="lg-water" aria-label="Water the garden, advance one week"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 1.5C6 5 3.6 7 3.6 10a4.4 4.4 0 0 0 8.8 0C12.4 7 10 5 8 1.5z" fill="currentColor"/></svg><span>Water</span></button></div>
  <div class="lg-zoom"><button data-zoom="in" aria-label="Zoom in">+</button><button data-zoom="out" aria-label="Zoom out">\u2212</button></div><div class="lg-hint"></div><div class="lg-toast" role="status"></div><div class="lg-error" hidden>This garden needs WebGL. Open it in a browser with hardware acceleration enabled.</div>`,i.appendChild(y);let R=T=>y.querySelector(T),w=R(".lg-canvas"),A;try{A=new zl({canvas:w,antialias:!0,alpha:!1,powerPreference:"high-performance"})}catch{return R(".lg-error").hidden=!1,{dispose(){y.remove()},failed:!0}}A.setPixelRatio(Math.min(devicePixelRatio||1,l.dpr)),A.outputColorSpace=Tn,A.toneMapping=Jo,A.toneMappingExposure=1.02,l.shadows&&(A.shadowMap.enabled=!0,A.shadowMap.type=Vo);let I=new ar,M=new vt("#f8eddc");I.fog=new ea(M,70,200);let x=new yn(l.fov,1,.1,400),P=new Gl(x,w);Object.assign(P,{enableDamping:!0,dampingFactor:.08,rotateSpeed:.7,zoomSpeed:.8,minPolarAngle:.2,maxPolarAngle:1.28,screenSpacePanning:!1,enablePan:!d}),P.mouseButtons={LEFT:$n.PAN,MIDDLE:$n.DOLLY,RIGHT:$n.ROTATE},P.touches={ONE:ri.PAN,TWO:ri.DOLLY_ROTATE},P.enableZoom=!0,P.panSpeed=1.1,P.autoRotate=!n&&!a,P.autoRotateSpeed=.35,I.add(new ma("#fff7ea","#d9ccb2",1.35));let O=new mr("#fff0d8",2.5);O.position.set(-12,20,11),l.shadows&&(O.castShadow=!0,O.shadow.mapSize.set(4096,4096),Object.assign(O.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:90}),O.shadow.bias=-4e-4,O.shadow.normalBias=.03,O.shadow.radius=3),I.add(O),I.add(O.target);let F=new mr("#cfe0ff",.55);F.position.set(14,8,-10),I.add(F);let k=new te(new Di(200,24,12),new In({side:dn,depthWrite:!1,fog:!1,uniforms:{top:{value:new vt("#bcd8ea")},mid:{value:new vt("#f9e9d3")},bot:{value:M.clone()}},vertexShader:"varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:"varying vec3 vP; uniform vec3 top,mid,bot; void main(){ float h=vP.y; vec3 c = h>0. ? mix(mid, top, pow(h,.55)) : mix(mid, bot, clamp(-h*4.,0.,1.)); gl_FragColor=vec4(c,1.); }"}));I.add(k);let Y=-.95,q=new te(new gi(150,48).rotateX(-Math.PI/2),new Ye({color:"#eee6d8",roughness:1}));q.position.y=Y,I.add(q);let nt=(()=>{let T=document.createElement("canvas");T.width=T.height=128;let D=T.getContext("2d"),V=D.createRadialGradient(64,64,8,64,64,64);V.addColorStop(0,"rgba(90,70,40,.38)"),V.addColorStop(.55,"rgba(90,70,40,.16)"),V.addColorStop(1,"rgba(90,70,40,0)"),D.fillStyle=V,D.fillRect(0,0,128,128);let $=new te(new Ii(1,1).rotateX(-Math.PI/2),new kn({map:new ur(T),transparent:!0,depthWrite:!1,fog:!1}));return $.position.y=Y+.01,$.scale.setScalar(76),I.add($),$})(),G=cf(l.detail),ht=new Ye({vertexColors:!0,flatShading:!0,roughness:.88}),gt=hf();{let T=gt.attributes.position.count,D=new Float32Array(T*3),V=new vt("#3f7d36"),$=new vt("#a8d466"),Z=new vt;for(let lt=0;lt<T;lt++)Z.copy(V).lerp($,gt.attributes.position.getY(lt)),D.set([Z.r,Z.g,Z.b],lt*3);gt.setAttribute("color",new on(D,3))}let dt={uTime:{value:0}},Xt=new Ye({vertexColors:!0,side:vn,roughness:1});Xt.onBeforeCompile=T=>{T.uniforms.uTime=dt.uTime,T.vertexShader=T.vertexShader.replace("#include <common>",`#include <common>
attribute float aGrow; uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
      vec4 ip = instanceMatrix * vec4(0.,0.,0.,1.);
      float sw = sin(uTime*1.7 + ip.x*1.1 + ip.z*0.8)*0.2 + sin(uTime*2.9 + ip.x*2.3 - ip.z)*0.07;
      float hh = position.y*position.y;
      transformed.y *= aGrow;
      transformed.x += sw*hh*aGrow; transformed.z += sw*0.6*hh*aGrow;`)};let Kt=new Ve;function me(T,D){if(!T.length)return null;let V=gt.clone(),$=new Float32Array(T.length);V.setAttribute("aGrow",new Ss($,1));let Z=new or(V,Xt,T.length);return T.forEach((lt,Bt)=>{Kt.position.set(lt.x,lt.y,lt.z),Kt.rotation.set(0,lt.rot,0),Kt.scale.setScalar(lt.s),Kt.updateMatrix(),Z.setMatrixAt(Bt,Kt.matrix),Z.setColorAt(Bt,lt.tint)}),Z.frustumCulled=!1,Z.userData.list=T,D.add(Z),Z}function jt(T,D){if(!T)return;let V=T.geometry.attributes.aGrow,$=T.userData.list;for(let Z=0;Z<$.length;Z++){let lt=D.get($[Z].key)??0;V.array[Z]=.22+.78*Oh(lt*1.6)*(.75+.25*$[Z].v)}V.needsUpdate=!0}let Q=(T,D)=>s?s(T,D):T,tt=new un;I.add(tt);let Et=Ch,$t=Rh,Ut=[],se=[],de=[],N=new Ca(G,ht,l.shadows),Se=[],Rt=cs(20261028);Le.forEach((T,D)=>{let[V,$]=$t[D],Z=Xl(V,$,Et/Math.sqrt(3)),lt=g(D),Bt=_(T,D),Ft=new te(Q(Tr(ql,An,{K:l.K,top:Bt.top2,top2:Bt.top,seed:D+1,noise:.015}),D),new Ye({vertexColors:!0,flatShading:!0,roughness:.95}));Ft.position.set(Z.x,0,Z.z),Ft.castShadow=l.shadows,Ft.receiveShadow=!0,Ft.userData.pick={kind:"theme",ti:D},tt.add(Ft),Ut.push(Ft);let ae=m(T,D),Dt={ti:D,theme:T,center:new L(Z.x,An,Z.z),cells:[]};if(T.paths.forEach((_t,Gt)=>{let[le,Ne]=kx[Hx[Gt]],hn=Xl(le,Ne,Yl*1.035),Fe=Z.x+hn.x,ke=Z.z+hn.z,Je=new te(Tr(Yl,Nh,{K:l.cellK,top:"#"+new vt(Bt.top).offsetHSL(0,0,.02*(Gt%3)).getHexString(),top2:Bt.top2,seed:D*10+Gt+3,noise:.05,bevel:.05,colorJitter:.09}),new Ye({vertexColors:!0,flatShading:!0,roughness:.95}));Je.position.set(Fe,An,ke),Je.castShadow=l.shadows,Je.receiveShadow=!0,Je.userData.pick={kind:"path",ti:D,pi:Gt},tt.add(Je),se.push(Je);let Gi=`c${D}.${Gt}`,Un=An+Nh,Wi={pi:Gt,path:_t,key:Gi,center:new L(Fe,Un,ke),mesh:Je};Dt.cells.push(Wi);let Xi=T.terrain==="pond"&&!lt?.noPonds,He=.42;if(Xi){let Ht=new te(new gi(He,20).rotateX(-Math.PI/2),new Ye({color:"#79bfd8",transparent:!0,opacity:.86,roughness:.12,metalness:.1}));Ht.position.set(Fe,Un+.012,ke),tt.add(Ht);let pe=new te(new pr(He,He+.07,20).rotateX(-Math.PI/2),new Ye({color:"#cfc3a4",roughness:1}));pe.position.set(Fe,Un+.014,ke),tt.add(pe);for(let Ee=0;Ee<3;Ee++){let De=Ee*2.2+Gt;N.add("lotus",{x:Fe+Math.cos(De)*.19,y:Un+.012,z:ke+Math.sin(De)*.19,rot:Rt()*6,s:.9+Rt()*.3,thr:.15+Ee*.2,w:.3,key:Gi})}}let hi=(Ht,pe)=>Aa(Ht,pe,.86)&&(!Xi||Math.hypot(Ht,pe)>He+.14),Nn=Zl(Rt,Math.round(l.plants*(lt?.plantMul??1)),hi,d?.3:.21,.9);Nn.forEach((Ht,pe)=>{let Ee=pe/Math.max(1,Nn.length-1),De=Ee<.28?"sig":Ee<.62?"mid":"low",Xe=ae[De],mn=Xe[Math.floor(Rt()*Xe.length)],sn=pf[mn],rn,gn,Rn;De==="sig"?(rn=sn?sn[0]+Rt()*(sn[1]-sn[0]):.9,gn=.4+Rt()*.5,Rn=.3):De==="mid"?(rn=(sn?sn[0]*.9:1)*(.75+Rt()*.45),gn=.15+Rt()*.4,Rn=.3):(rn=mn==="rock"||mn==="redRock"?.7+Rt()*.6:.9+Rt()*.5,gn=.01+Rt()*.3,Rn=.25),N.add(mn,{x:Fe+Ht[0],y:Un+.01,z:ke+Ht[1],rot:Rt()*6.28,s:rn,thr:gn,w:Rn,key:Gi,grow:!0,min:.14,tint:new vt().setScalar(.88+Rt()*.22)})});let vi=lt?.grassMul===0?[]:Zl(Rt,Math.round(l.grass*(lt?.grassMul??1)),(Ht,pe)=>Aa(Ht,pe,.9)&&(!Xi||Math.hypot(Ht,pe)>He+.08),0,.92),qi=new vt(lt?.grassTint||Bt.top);vi.forEach(Ht=>Se.push({x:Fe+Ht[0],y:Un,z:ke+Ht[1],s:.14+Rt()*.16,rot:Rt()*6.28,key:Gi,v:Rt(),tint:qi.clone().offsetHSL((Rt()-.5)*.03,0,(Rt()-.5)*.2).addScalar(.45)}))}),lt?.sheet){let _t=lt.sheet;if(_t.type==="water"){let Gt=new te(new gi(_t.r||2.6,36).rotateX(-Math.PI/2),new Ye({color:_t.color,roughness:.14,metalness:.12}));Gt.position.set(Z.x+(_t.dx||0),An+.028,Z.z+(_t.dz||0)),Gt.receiveShadow=!0,tt.add(Gt)}else if(_t.type==="river"){let Gt=new Ye({color:_t.color,roughness:.14,metalness:.12});for(let le=-2;le<=2;le++){let Ne=new te(new gi(.72,20).rotateX(-Math.PI/2),Gt);Ne.position.set(Z.x+le*1.05,An+.028,Z.z+Math.sin(le*1.1)*.55),Ne.receiveShadow=!0,tt.add(Ne)}}else if(_t.type==="rings"){let Gt=new kn({color:"#a89a76",transparent:!0,opacity:.8,depthWrite:!1});for(let le=1;le<=3;le++){let Ne=new te(new pr(le*.42,le*.42+.045,40).rotateX(-Math.PI/2),Gt);Ne.position.set(Z.x+(lt.landmark?.dx||0),An+.03,Z.z+(lt.landmark?.dz||0)),tt.add(Ne)}}}if(lt?.landmark){let _t=lt.landmark;N.add(_t.name,{x:Z.x+_t.dx,y:An+.02,z:Z.z+_t.dz,rot:Rt()*6.28,s:_t.s,thr:.18,w:.4,key:`c${D}.0`,grow:!0,min:.3})}de.push(Dt)}),N.build(tt);let qt=me(Se,tt),bt=new un;I.add(bt);let be=[],Ct=new Ca(G,ht,l.shadows);if(o){Le.forEach((T,D)=>{let V=g(D),$=_(T,D),[Z,lt]=u[D],Bt=new te(Tr(1.38,An,{K:l.K,top:$.top2,top2:$.top,seed:D+1,noise:.015}),new Ye({vertexColors:!0,flatShading:!0,roughness:.95}));Bt.position.set(Z,0,lt),Bt.castShadow=l.shadows,Bt.receiveShadow=!0,Bt.userData.pick={kind:"theme",ti:D},bt.add(Bt),be.push(Bt);let Ft=V?.sheet?.type==="water"?Math.min(1.3,V.sheet.r*.44):T.terrain==="pond"&&!V?.noPonds?.64:0;if(Ft){let ae=new te(new gi(Ft,20).rotateX(-Math.PI/2),new Ye({color:V?.sheet?.color||"#79bfd8",roughness:.12,metalness:.1}));ae.position.set(Z+(V?.sheet?.dx||0)*.44,An+.02,lt+(V?.sheet?.dz||0)*.44),bt.add(ae)}});for(let[T,D]of Object.entries(N.items))for(let V of D){let $=Number(V.key.slice(1).split(".")[0]),Z=de[$],lt=u[$];Ct.add(T,{...V,x:lt[0]+(V.x-Z.center.x)*.38,z:lt[1]+(V.z-Z.center.z)*.38,y:An+.015,s:V.s*.68})}Ct.build(bt)}let Jt=new kn({color:uf,transparent:!0,opacity:.95,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:vn}),Ue=new te(hs(Yl,.07),Jt),fe=new te(hs(ql+.02,.11),Jt),C=new te(hs(Yl,.09),Jt),v=new te(hs($l,.08),Jt);[Ue,fe,C,v].forEach(T=>{T.visible=!1,T.renderOrder=5,I.add(T)}),e.group=e.group==null||e.group<0?-1:e.group%p.length;let H=null;a&&(H=document.createElement("div"),H.className="lg-grpnav",H.innerHTML='<button data-grp="prev" aria-label="Previous group">\u2039</button><button class="lg-worldchip" data-grp="all"></button><button data-grp="next" aria-label="Next group">\u203A</button>',y.appendChild(H));function K(T,D=900){e.group=(T%p.length+p.length)%p.length,j.level!=="garden"&&(j.level="garden",j.ti=j.pi=j.lesson=-1,b()),B(),Kn(),en(tn(),D)}function it(T=900){e.group=-1,Kn(),j.level==="garden"&&en(tn(),T)}function J(){if(!H)return;H.style.display=j.level==="garden"?"":"none";let T=H.querySelector(".lg-worldchip"),D=j.level==="garden"&&e.group>=0;y.classList.toggle("group-focused",D),T.textContent=D?`${p[e.group].name} \xB7 all themes`:`Pick a ${f} to focus`,H.classList.toggle("focused",D)}let Nt=new un;if(I.add(Nt),l.clouds){let T=new Ye({color:"#ffffff",roughness:1,flatShading:!0,transparent:!0,opacity:.92}),D=cs(77);for(let V=0;V<l.clouds;V++){let $=new un,Z=4+Math.floor(D()*3);for(let lt=0;lt<Z;lt++){let Bt=new te(new si(1.6+D()*1.6,1),T);Bt.position.set((lt-Z/2)*2.1,D()*.8,(D()-.5)*2),Bt.scale.y=.55,$.add(Bt)}$.position.set((D()-.5)*90,15+D()*7,-20-D()*45),$.userData.v=.25+D()*.3,Nt.add($)}}let ct=new un;I.add(ct);let Lt=new xe().setFromPoints([new L(0,0,0),new L(.16,.09,.05),new L(.12,-.08,.04)]).setIndex([0,1,2,0,2,1]),At=cs(5);for(let T=0;T<l.creatures;T++){let D=new un,V=["#f2a65a","#f5d36b","#e98a9f","#f6f1e4","#8fb8e8"][T%5],$=new kn({color:V,side:vn}),Z=new te(Lt,$),lt=new te(Lt,$);lt.scale.x=-1,D.add(Z,lt),D.userData={wl:Z,wr:lt,ph:At()*10,rad:1.2+At()*2.2,sp:.35+At()*.35,off:At()*6.28,h:.9+At()*1,scale:.8+At()*.5},ct.add(D)}let at=null;if(l.pollen){let T=l.pollen,D=new Float32Array(T*3),V=cs(9);for(let $=0;$<T;$++)D.set([(V()-.5)*22,V()*4,(V()-.5)*22],$*3);at=new ia(new xe().setAttribute("position",new on(D,3)),new hr({color:"#fff0b8",size:.07,transparent:!0,opacity:.75,depthWrite:!1})),at.frustumCulled=!1,I.add(at)}let xt=d?140:420,Wt=new Float32Array(xt*6),Pt=new Float32Array(xt*3);{let T=cs(3);for(let D=0;D<xt;D++)Pt.set([(T()-.5)*2,T(),(T()-.5)*2],D*3)}let mt=new na(new xe().setAttribute("position",new on(Wt,3)),new cr({color:"#4f9fe0",transparent:!0,opacity:.65,depthWrite:!1}));mt.frustumCulled=!1,mt.visible=!1,I.add(mt);let Ot=new Map(Object.entries(r||{})),U=null,st=null,ft=T=>{if(T[0]==="c"){let[V,$]=T.slice(1).split(".").map(Number);return Oi(e.week,Le[V].paths[$])}if(!U)return 0;let D=Oi(e.week,U.path);return T==="T"?D:Bi(D*U.n-Number(T.slice(1)),0,1)},Tt=(T,D)=>Ot.get(`c${T}.${D}`)??0,rt=(T,D)=>{let V=T.lessons.length,$=D*V,Z=Math.min(V,Math.floor($+1e-6)),lt=$-Z;return{n:V,cur:Z,cards:Z>=V?Gn:Math.round(lt*Gn),done:Z>=V}};function et(){let T=0,D=0,V=0,$=0;return Le.forEach(Z=>Z.paths.forEach(lt=>{let Bt=Oi(e.week,lt),Ft=rt(lt,Bt);$++,Bt>0&&V++,T+=Ft.cur*Gn+(Ft.done?0:Ft.cards),D+=Math.round((Ft.cur*Fh+(Ft.done?0:Math.floor(Ft.cards/2)))*.82)})),{drops:T,carrots:D,started:V,paths:$}}let It=[new vt(1,1,1),new vt(.95,.9,.78),new vt(.83,.79,.68)];function Zt(){st&&(st.traverse(T=>{T.geometry?.dispose?.(),T.userData.own&&T.material?.dispose?.()}),U?.plants.dispose(),I.remove(st),st=null,U=null,[...Ot.keys()].filter(T=>T[0]==="T"||T[0]==="L").forEach(T=>Ot.delete(T)))}function ve(T,D){Zt();let V=Le[T],$=V.paths[D],Z=$.lessons.length,lt=m(V,T),Bt=_(V,T),Ft=cs(T*100+D*7+1),ae=new un,Dt=wr,_t=wr+df,Gt=new te(Tr(Ra,wr,{K:l.trailK,top:Bt.top,top2:Bt.top2,seed:T*10+D+40,noise:.45,bevel:.04,colorJitter:.07}),new Ye({vertexColors:!0,flatShading:!0,roughness:.95}));Gt.rotation.y=Math.PI/6,Gt.castShadow=l.shadows,Gt.receiveShadow=!0,Gt.userData.own=!0,ae.add(Gt);let le=[[0,0]];for(let Ht=1;Ht<Z;Ht++){let pe=ff[(Ht-1)%ff.length];le.push([le[Ht-1][0]+pe[0],le[Ht-1][1]+pe[1]])}let Ne=le.map(([Ht,pe])=>Xl(Ht,pe,$l*1.06)),hn=(Math.min(...Ne.map(Ht=>Ht.x))+Math.max(...Ne.map(Ht=>Ht.x)))/2,Fe=(Math.min(...Ne.map(Ht=>Ht.z))+Math.max(...Ne.map(Ht=>Ht.z)))/2,ke=new Ca(G,ht,l.shadows),Je=[],Gi=hs($l*1,.075),Un=new gi(.068,12).rotateX(-Math.PI/2),Wi=lt.lesson,Xi={tree:.85,pine:.9,snowPine:.9,appleTree:.85,cactus:1.05,lotus:1.25,sunflower:1.15}[Wi]||1;Ne.forEach((Ht,pe)=>{let Ee=Ht.x-hn,De=Ht.z-Fe,Xe=new te(Tr($l,df,{K:l.cellK,top:Bt.top,top2:Bt.top2,seed:T*13+D*5+pe+90,noise:.05,bevel:.05,colorJitter:.07}),new Ye({vertexColors:!0,flatShading:!0,roughness:.95}));Xe.position.set(Ee,Dt,De),Xe.castShadow=l.shadows,Xe.receiveShadow=!0,Xe.userData={pick:{kind:"lesson",i:pe},own:!0},ae.add(Xe);let mn=new te(Gi,new kn({color:"#b9b3a2",transparent:!0,opacity:.9,depthWrite:!1,side:vn}));mn.position.set(Ee,_t+.03,De),mn.userData.own=!0,ae.add(mn);let sn=[],rn=[];for(let Rn=0;Rn<Gn;Rn++){let Lr=new kn({color:"#e9e1cd"}),fs=new te(Un,Lr);fs.position.set(Ee+(Rn-(Gn-1)/2)*.21,_t+.04,De+.74),fs.userData.own=!0,ae.add(fs),sn.push(Lr),rn.push(fs)}let gn=`L${pe}`;ke.add(Wi,{x:Ee,y:_t+.01,z:De-.1,rot:Ft()*6,s:Xi,thr:0,w:1,key:gn,min:.2,tint:new vt().setScalar(.96)}),ke.add("mound",{x:Ee,y:_t+.01,z:De-.1,rot:0,s:1.3,thr:0,w:.25,key:gn,inv:!0}),ke.add("sprout",{x:Ee+.1,y:_t+.02,z:De-.05,rot:Ft()*6,s:1.4,thr:0,w:.2,key:gn,inv:!0});for(let Rn=0;Rn<(d?3:6);Rn++){let Lr=Rn/6*6.28+pe*.7,fs=.55+Rn%2*.08;ke.add(lt.flower,{x:Ee+Math.cos(Lr)*fs,y:_t+.01,z:De-.1+Math.sin(Lr)*fs*.7,rot:Ft()*6,s:1.1+Ft()*.3,thr:.8+Rn*.025,w:.18,key:gn})}Je.push({i:pe,pos:new L(Ee,_t,De),ring:mn,stone:Xe,dotMat:sn})});let He=new un;{let Ht=new te(new Yn(.02,.02,.95,5).translate(0,.475,0),new Ye({color:"#d9cdb8",roughness:.9}));Ht.userData.own=!0;let pe=new xe().setFromPoints([new L(0,.95,0),new L(.36,.84,0),new L(0,.72,0)]).setIndex([0,1,2,0,2,1]);pe.computeVertexNormals();let Ee=new te(pe,new Ye({color:"#e3a83c",roughness:.6,side:vn,emissive:"#6b4a0e",emissiveIntensity:.3}));Ee.userData.own=!0;let De=new un;De.add(Ht,Ee),De.position.set(-.62,0,.42),De.rotation.y=.3;let Xe=document.createElement("canvas");Xe.width=Xe.height=128;let mn=Xe.getContext("2d"),sn=mn.createRadialGradient(64,64,8,64,64,64);sn.addColorStop(0,"rgba(232,179,75,.5)"),sn.addColorStop(.55,"rgba(232,179,75,.18)"),sn.addColorStop(1,"rgba(232,179,75,0)"),mn.fillStyle=sn,mn.fillRect(0,0,128,128);let rn=new te(new Ii(1,1).rotateX(-Math.PI/2),new kn({map:new ur(Xe),transparent:!0,depthWrite:!1}));rn.scale.setScalar(3.6),rn.position.y=.015,rn.renderOrder=4,rn.userData.own=!0;let gn=new te(G.flowerOrange.clone(),ht);gn.scale.setScalar(1.6),gn.position.set(.3,.012,.26),gn.rotation.y=.7,He.add(De,rn,gn),He.userData={halo:rn,pennant:De}}ae.add(He);let hi=(Ht,pe)=>Aa(pe,Ht,Ra-.5)&&Je.every(Ee=>(Ee.pos.x-Ht)**2+(Ee.pos.z-pe)**2>3.4);Zl(Ft,l.trailPlants,hi,d?.8:.5,Ra).forEach((Ht,pe,Ee)=>{let De=pe/Ee.length,Xe=De<.3?"sig":De<.65?"mid":"low",mn=lt[Xe],sn=mn[Math.floor(Ft()*mn.length)],rn=pf[sn],gn=Xe==="sig"?(rn?rn[0]+Ft()*(rn[1]-rn[0]):1)*1.35:Xe==="mid"?1.25*(.8+Ft()*.5):(sn.includes("ock")?1.2:1.5)*(.8+Ft()*.5);ke.add(sn,{x:Ht[0],y:Dt+.03,z:Ht[1],rot:Ft()*6.28,s:gn,thr:Xe==="sig"?.3+Ft()*.5:Xe==="mid"?.1+Ft()*.4:Ft()*.25,w:.3,key:"T",grow:!0,tint:new vt().setScalar(.9+Ft()*.2)})}),ke.build(ae);let Nn=[],vi=new vt(g(T)?.grassTint||Bt.top);Zl(Ft,l.trailGrass,(Ht,pe)=>Aa(pe,Ht,Ra-.35)&&Je.every(Ee=>(Ee.pos.x-Ht)**2+(Ee.pos.z-pe)**2>1.5),0,Ra).forEach(Ht=>Nn.push({x:Ht[0],y:Dt,z:Ht[1],s:.22+Ft()*.25,rot:Ft()*6.28,key:"T",v:Ft(),tint:vi.clone().offsetHSL((Ft()-.5)*.03,0,(Ft()-.5)*.2).addScalar(.45)}));let qi=me(Nn,ae);return U={ti:T,pi:D,theme:V,path:$,n:Z,nodes:Je,plants:ke,grass:qi,nextMark:He},I.add(ae),st=ae,ae.visible=!1,["T",...Je.map(Ht=>`L${Ht.i}`)].forEach(Ht=>Ot.set(Ht,r?.[Ht]??0)),U}let j={level:"garden",ti:-1,pi:-1,lesson:-1},Ge=new Li,Ze=new L,Be=null,We=!1,us=new L,ds=3,Jn=(T,D)=>{let V=vr.degToRad(x.fov/2),$=Math.atan(Math.tan(V)*x.aspect);return Math.max(T*1.08/Math.tan($),T*(Math.cos(D)*.9+.32)*1.12/Math.tan(V))},Ar=T=>{let D=p[T].themes.map(V=>S(V));return new L(D.reduce((V,$)=>V+$.x,0)/D.length,.5,D.reduce((V,$)=>V+$.z,0)/D.length)};function Rr(T=p[e.group].themes,D=o){let V=y.clientWidth,$=y.clientHeight,Z=y.getBoundingClientRect(),lt=R(".lg-panel").getBoundingClientRect(),Bt=(j.level==="garden"?H:R(".lg-stats")).getBoundingClientRect(),Ft=d||V<=900,ae=Ft?24:lt.right-Z.left+30,Dt=V-(Ft?24:60),_t=Bt.bottom-Z.top+34,Gt=Ft?lt.top-Z.top-24:$-105,le=Math.max(140,Dt-ae),Ne=Math.max(110,Gt-_t);x.setViewOffset(V,$,V/2-(ae+Dt)/2,$/2-(_t+Gt)/2,V,$),x.updateProjectionMatrix();let hn=He=>D?S(He):de[He].center,Fe=T.reduce((He,hi)=>He.add(hn(hi)),new L).divideScalar(T.length),ke=.95,Je=x.position.clone().sub(P.target),Gi=Math.atan2(Je.x,Je.z),Un=x.clone(),Wi=8,Xi=[];T.forEach(He=>(D?E(He):Array.from({length:6},(hi,Nn)=>[3.5*Math.cos(Math.PI/6+Nn*Math.PI/3),3.5*Math.sin(Math.PI/6+Nn*Math.PI/3)])).forEach(([hi,Nn])=>{let vi=hn(He);for(let qi of[0,2.5])Xi.push(new L(vi.x+hi,qi,vi.z+Nn))}));for(let He=0;He<120&&(Un.position.setFromSpherical(new Li(Wi,ke,Gi)).add(Fe),Un.lookAt(Fe),Un.updateMatrixWorld(),!Xi.every(hi=>{let Nn=hi.clone().project(Un),vi=(Nn.x*.5+.5)*V,qi=(-Nn.y*.5+.5)*$;return vi>ae&&vi<Dt&&qi>_t&&qi<Gt}));He++)Wi*=1.035;return{target:Fe,dist:Wi,polar:ke,pan:3}}function tn(){if(j.level==="garden"&&a&&e.group>=0)return Rr();if(d?x.setViewOffset(y.clientWidth,y.clientHeight,0,y.clientHeight*.09,y.clientWidth,y.clientHeight):y.clientWidth>900?x.setViewOffset(y.clientWidth,y.clientHeight,-Math.min(170,y.clientWidth*.11),0,y.clientWidth,y.clientHeight):x.clearViewOffset(),x.updateProjectionMatrix(),j.level==="garden"&&o){if(!c)return{target:new L(0,.4,0),dist:Jn(14,.95),polar:.95,pan:3};let D=u.reduce((Z,lt)=>Z+lt[0],0)/u.length,V=u.reduce((Z,lt)=>Z+lt[1],0)/u.length,$=Math.max(...u.map(([Z,lt])=>Math.hypot(Z-D,lt-V)))+3.6;return{target:new L(D,.4,V),dist:Jn($,.95),polar:.95,pan:3}}if(j.level==="garden")return{target:new L(.74,.4,-.26),dist:Jn(d?18.6:18.9,.95),polar:.95,pan:3};if(j.level==="theme"&&o)return Rr([j.ti],!1);if(j.level==="theme")return{target:de[j.ti].center.clone().setY(.7),dist:Jn(3.9,.92),polar:.92,pan:1.6};if(j.lesson>=0&&U)return{target:U.nodes[j.lesson].pos.clone().setY(wr+.45),dist:Jn(2.3,.85),polar:.85,pan:3};let T=U?Math.max(...U.nodes.map(D=>Math.abs(D.pos.x)))+1.7:5;return{target:new L(0,wr+.3,0),dist:Jn(Math.max(T,3.4),.86),polar:.86,pan:4}}function Cr(T){let D=j.level==="path";P.minDistance=D?2.6:4.5,P.maxDistance=Math.max(T.dist*1.5,34),D?(us.set(0,wr+.3,0),ds=(U?Math.max(...U.nodes.map(V=>Math.abs(V.pos.x))):4)+2.2):(us.set(.74,.4,-.26),ds=22)}function en(T,D=900,V){x.position.sub(P.target),Ge.setFromVector3(x.position),x.position.add(P.target);let $={target:T.target.clone(),r:T.dist,phi:T.polar,theta:V??Ge.theta};if(Cr(T),n||D===0){P.target.copy($.target),Ge.set($.r,$.phi,$.theta),x.position.setFromSpherical(Ge).add(P.target),Be=null;return}let Z=$.theta-Ge.theta;Z=Math.atan2(Math.sin(Z),Math.cos(Z)),Be={t0:performance.now(),ms:D,from:{target:P.target.clone(),r:Ge.radius,phi:Ge.phi,theta:Ge.theta},to:$,dth:Z}}function Pa(T){if(!Be)return;let D=Bi((T-Be.t0)/Be.ms),V=D<.5?4*D*D*D:1-Math.pow(-2*D+2,3)/2,$=Be.from,Z=Be.to;if(P.target.lerpVectors($.target,Z.target,V),Ge.set($.r+(Z.r-$.r)*V,$.phi+(Z.phi-$.phi)*V,$.theta+Be.dth*V),x.position.setFromSpherical(Ge).add(P.target),D>=1){let lt=Be.done;Be=null,lt?.()}}P.addEventListener("change",()=>{if(Be)return;Ze.copy(P.target).sub(us);let T=Ze.length();T>ds&&(Ze.multiplyScalar((T-ds)/T),P.target.sub(Ze),x.position.sub(Ze))}),P.addEventListener("start",()=>{P.autoRotate=!1,Be=null});let zi=new L,Ia=new L;function Da(T,D){if(x.getWorldDirection(zi),zi.y=0,zi.lengthSq()<1e-6)return;zi.normalize(),Ia.crossVectors(zi,x.up).normalize();let V=2*x.position.distanceTo(P.target)*Math.tan(vr.degToRad(x.fov/2))/Math.max(1,y.clientHeight);Ze.set(0,0,0).addScaledVector(Ia,T*V).addScaledVector(zi,-D*V),P.target.add(Ze),x.position.add(Ze),Be=null,P.autoRotate=!1}function Os(T){x.position.sub(P.target);let D=Bi(x.position.length()*T,P.minDistance,P.maxDistance);x.position.setLength(D).add(P.target),Be=null,P.autoRotate=!1}y.addEventListener("wheel",T=>{if(T.target.closest(".lg-panel"))return;T.preventDefault(),T.stopPropagation();let D=T.deltaMode===1?16:T.deltaMode===2?y.clientHeight:1;T.ctrlKey||T.metaKey?Os(Math.exp(T.deltaY*D*.01)):Da(T.deltaX*D,T.deltaY*D)},{capture:!0,passive:!1});let Bs=R(".lg-fade");function b(){let T=j.level==="path";tt.visible=!T&&!(o&&j.level==="garden"),bt.visible=o&&j.level==="garden",nt.visible=!T,st&&(st.visible=T)}let B=()=>{Ue.visible=fe.visible=v.visible=!1};function W(T=1e3){if(We)return;let D=()=>{j.level="garden",j.ti=j.pi=j.lesson=-1,C.visible=!1,B(),b(),en(tn(),T,.35),Kn()};j.level==="path"?ot(D):D()}function X(T,D=1e3){if(We)return;let V=()=>{j.level="theme",j.ti=T,j.pi=j.lesson=-1,C.visible=!1,B(),b(),Kn(),en(tn(),D)};j.level==="path"?ot(V):V()}function z(T,D){if(We)return;j.ti=T,j.pi=D,j.level="theme",j.lesson=-1,B();let V=de[T].cells[D];C.position.set(V.center.x,V.center.y+.03,V.center.z),C.visible=!0,We=!0,Kn();let $=()=>{Bs.classList.add("on"),setTimeout(()=>{ve(T,D),j.level="path",C.visible=!1,b(),Be=null;let Z=tn();en({...Z,dist:Z.dist*.75},0,.1),en(Z,n?0:1100,.1),Bs.classList.remove("on"),We=!1,Dr=!0,Kn()},n?0:360)};en({target:V.center.clone(),dist:Jn(1.3,.9),polar:.9,pan:2},n?0:750),Be?Be.done=$:$()}function ot(T){if(We)return;We=!0;let D=j.ti,V=j.pi;Bs.classList.add("on"),setTimeout(()=>{Zt(),j.level="theme",j.lesson=-1,b(),Dr=!0;let $=de[D].cells[V];en({target:$.center.clone(),dist:Jn(1.3,.9),polar:.9,pan:2},0),Bs.classList.remove("on"),We=!1,T?.()},n?0:340)}function yt(T){j.level!=="path"||!U||(j.lesson=j.lesson===T?-1:T,en(tn(),800),Kn())}function wt(){We||(j.level==="path"?j.lesson>=0?(j.lesson=-1,en(tn(),700),Kn()):ot(()=>{en(tn(),900),Kn()}):j.level==="theme"&&W())}let St=new ga,Vt=new ut,Yt=null,zt=()=>We?[]:j.level==="path"?U?U.nodes.map(T=>T.stone):[]:o&&j.level==="garden"?be:[...se,...Ut];function re(T,D){let V=w.getBoundingClientRect();Vt.set((T-V.left)/V.width*2-1,-((D-V.top)/V.height)*2+1),St.setFromCamera(Vt,x);let $=St.intersectObjects(zt(),!1)[0];return $?$.object.userData.pick:null}function ge(T){let D=T?`${T.kind}.${T.ti??""}.${T.pi??""}.${T.i??""}`:null;if(D===Yt||(Yt=D,B(),w.style.cursor=T?"pointer":"grab",w.title=T?.ti!=null?Le[T.ti].title:"",!T))return;let V=$=>{if(o&&j.level==="garden"){fe.geometry.dispose(),fe.geometry=hs(1.4,.07);let[lt,Bt]=u[$];fe.position.set(lt,An+.02,Bt),fe.visible=!0;return}s&&(fe.geometry.dispose(),fe.geometry=Q(hs(ql+.02,.11),$));let Z=de[$];fe.position.set(Z.center.x,An+Nh*.4,Z.center.z),fe.visible=!0};if(T.kind==="lesson"){let $=U.nodes[T.i];v.position.set($.pos.x,$.pos.y+.05,$.pos.z),v.visible=!0}else if(T.kind==="theme"||j.level==="garden"||T.ti!==j.ti)V(T.ti);else{let $=de[T.ti].cells[T.pi].center;Ue.position.set($.x,$.y+.03,$.z),Ue.visible=!0}}function Ie(T){if(T){if(j.level==="path"){T.kind==="lesson"&&yt(T.i);return}if(j.level==="garden"||T.ti!==j.ti)return X(T.ti);T.kind==="path"&&z(T.ti,T.pi)}}let ce=null;w.addEventListener("pointerdown",T=>{ce={x:T.clientX,y:T.clientY,t:performance.now()}}),w.addEventListener("pointerup",T=>{if(!ce)return;let D=T.clientX-ce.x,V=T.clientY-ce.y,$=Math.hypot(D,V),Z=performance.now()-ce.t;if(ce=null,a&&j.level==="garden"&&Math.abs(D)>70&&Math.abs(D)>1.6*Math.abs(V)&&Z<500){K((e.group<0?D<0?-1:0:e.group)+(D<0?1:-1));return}$<7&&Z<600&&Ie(re(T.clientX,T.clientY))}),w.addEventListener("pointermove",T=>{T.pointerType==="mouse"&&!ce&&ge(re(T.clientX,T.clientY))}),w.addEventListener("pointerleave",()=>ge(null));let _e=T=>{if(!(!y.isConnected||T.target.matches?.("input")))if(T.key==="Escape"||T.key==="Backspace")wt(),T.preventDefault();else if(/^[1-9]$/.test(T.key)&&j.level!=="path"&&Le[Number(T.key)-1])X(Number(T.key)-1);else if(T.key.startsWith("Arrow")){if(a&&j.level==="garden"&&(T.key==="ArrowLeft"||T.key==="ArrowRight")){K((e.group<0?T.key==="ArrowRight"?-1:0:e.group)+(T.key==="ArrowRight"?1:-1)),T.preventDefault();return}let D=60;Da(T.key==="ArrowLeft"?-D:T.key==="ArrowRight"?D:0,T.key==="ArrowUp"?-D:T.key==="ArrowDown"?D:0),T.preventDefault()}else T.key==="+"||T.key==="="?Os(.85):(T.key==="-"||T.key==="_")&&Os(1.18)};addEventListener("keydown",_e);let kt=R(".lg-crumbs"),we=R(".lg-panel-body"),oe=R(".lg-stats"),fn=R(".lg-labels"),li=R(".lg-toast"),pn=R(".lg-panel"),ci=R(".lg-week"),Ae=R(".lg-weeklabel"),bn=R(".lg-play"),nn={drop:'<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M8 1.5C6 5 3.6 7 3.6 10a4.4 4.4 0 0 0 8.8 0C12.4 7 10 5 8 1.5z" fill="#3f8fd2"/></svg>',carrot:'<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 13.2C4 9 8 5.4 11 5.8c.5 3-2.6 7.6-8 7.4z" fill="#f08a24"/><path d="M10.2 5.4 11.4 2m-.2 3.8L14 4m-3.2 2.6L14.2 7" stroke="#5ea84a" stroke-width="1.5" stroke-linecap="round"/></svg>',play:'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',pause:'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5h3v11H4zm5 0h3v11H9z" fill="currentColor"/></svg>',replay:'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 2.5a5.5 5.5 0 1 0 5.4 6.5h-1.7A3.8 3.8 0 1 1 8 4.2c1 0 1.9.4 2.6 1L8.7 7H14V1.7l-1.8 1.8A5.500 5.500 0 0 0 8 2.5z" fill="currentColor"/></svg>'},ze=(T,D)=>Array.from({length:T},(V,$)=>`<i class="dot ${$<D?"on":""}"></i>`).join(""),cn=T=>`${Math.round(T*100)}%`,ki=T=>{li.textContent=T,li.classList.add("on"),clearTimeout(ki.t),ki.t=setTimeout(()=>li.classList.remove("on"),2600)};function yi(){let T=V=>j.level===V?' aria-current="page"':"",D=j.level!=="garden"?'<button class="lg-back" data-go="back" aria-label="Back">\u2039</button>':"";D+=`<button data-go="garden"${T("garden")}>Garden</button>`,j.level!=="garden"&&(D+=`<span class="sep">\u203A</span><button data-go="theme"${T("theme")}>${Sn(Le[j.ti].title)}</button>`),j.level==="path"&&(D+=`<span class="sep">\u203A</span><button data-go="path"${T("path")}>${Sn(Le[j.ti].paths[j.pi].title)}</button>`),kt.innerHTML=D}function Hh(){let T="";if(j.level==="garden"){let D=a&&e.group>=0?p[e.group]:null,V=D?D.themes.map($=>Le[$]):o?h.flatMap($=>$.themes.map(Z=>Le[Z])):Le;T=`<p class="eyebrow">Little Grains \xB7 sample garden</p><h2>${D?Sn(D.name):"The Garden"}</h2><p class="lede">${D?"Focused world; the rest of the garden blurs into the background. ":""}${o?"One hexagon per theme, arranged in related groups. Select a hexagon to reveal all its learning paths.":s?"Each land follows the footprint of its learning paths. The scenery, lessons and controls are unchanged.":"Each hexagon is a theme. Walk into one to find a hexagon per learning path, then follow its tiles lesson by lesson."}</p><ul class="lg-list">`+V.map($=>{let Z=Le.indexOf($),lt=$.paths.filter(ae=>Oi(e.week,ae)>0).length,Bt=$.paths.reduce((ae,Dt)=>ae+Oi(e.week,Dt),0)/$.paths.length,Ft=o&&!D?h.find(ae=>ae.themes[0]===Z):null;return`${Ft?`<li class="group-list-title">${Sn(Ft.name)}</li>`:""}<li><button data-theme="${Z}"><span class="sw" style="background:${_($,Z).top}"></span><span class="tt"><b>${Sn($.title)}</b><small>${lt}/${$.paths.length} paths started</small></span><span class="bar"><i style="width:${cn(Bt)}"></i></span></button></li>`}).join("")+"</ul>"}else if(j.level==="theme"){let D=Le[j.ti];T=`<p class="eyebrow">Theme garden</p><h2>${Sn(D.title)}</h2><p class="lede">${Sn(D.blurb)} One hexagon per learning path; one dot per lesson, filled once completed.</p><ul class="lg-list">`+D.paths.map((V,$)=>{let Z=Oi(e.week,V),lt=rt(V,Z);return`<li><button data-path="${$}"><span class="tt"><b>${d?`${$+1}. `:""}${Sn(V.title)}</b><span class="dots">${ze(V.lessons.length,lt.cur)}</span></span><span class="pc">${Z===0?"Not started":cn(Z)}</span></button></li>`}).join("")+"</ul>"}else if(U){let D=Oi(e.week,U.path),V=rt(U.path,D),$=j.lesson;if(T=`<p class="eyebrow">${Sn(U.theme.title)} \xB7 learning path</p><h2>${Sn(U.path.title)}</h2><p class="lede">${D===0?"Nothing planted yet. Start the first tile to see it sprout.":V.done?"Every tile has bloomed.":`${V.cur} of ${V.n} tiles bloomed. Each dot is a card; the ringed tile is next.`}</p>`,$>=0){let Z=Bi(D*V.n-$),lt=Z>=1?"done":Z>0?"cur":"todo",Bt=lt==="done"?Gn:Math.round(Z*Gn);T+=`<div class="lg-lesson"><span class="chip ${lt}">${lt==="done"?"Bloomed":lt==="cur"?"In progress":"Not started"}</span><h3>${$+1}. ${Sn(U.path.lessons[$])}</h3><p class="dots big">${ze(Gn,Bt)}</p><p>${Bt} of ${Gn} cards \xB7 ${lt==="done"?Fh:Math.floor(Bt/2)} of ${Fh} questions</p><button class="primary" data-start="${$}">${lt==="done"?"Review lesson":lt==="cur"?"Continue":"Start lesson"}</button></div>`}T+='<ol class="lg-lessons">'+U.path.lessons.map((Z,lt)=>{let Bt=Bi(D*V.n-lt),Ft=Bt>=1?"done":Bt>0?"cur":"todo";return`<li><button data-lesson="${lt}" class="${Ft} ${lt===$?"sel":""}"><span class="num">${Ft==="done"?"\u2713":lt+1}</span><span class="nm">${Sn(Z)}</span><span class="dots">${ze(Gn,Ft==="done"?Gn:Math.round(Bt*Gn))}</span></button></li>`}).join("")+"</ol>"}we.innerHTML=T}function Vh(){let T=et();oe.innerHTML=`<span class="chip drop" title="Cards completed">${nn.drop}<b>${T.drops}</b><small>drops</small></span><span class="chip carrot" title="Questions answered correctly">${nn.carrot}<b>${T.carrots}</b><small>carrots</small></span>`+(d?"":`<span class="chip plain"><b>${T.started}</b><small>of ${T.paths} paths growing</small></span>`)}function Pr(){let T=e.week;ci.value=T,Ae.textContent=`Demo week ${Math.floor(T)}`,bn.innerHTML=e.playing?nn.pause:T>=16?nn.replay:nn.play,bn.setAttribute("aria-label",e.playing?"Pause study timeline":T>=16?"Replay study timeline":"Play study timeline"),ci.style.setProperty("--fill",`${T/16*100}%`)}function Kn(){y.classList.toggle("compact-overview",o&&j.level==="garden"&&(!a||e.group<0)),yi(),Hh(),Vh(),Pr(),J(),yf(),Dr=!0}y.addEventListener("click",T=>{let D=T.target.closest("button");if(D)if(D.dataset.go){let V=D.dataset.go;V==="garden"?W():V==="theme"?j.level==="path"?ot(()=>{en(tn(),900),Kn()}):X(j.ti):V==="back"&&wt()}else if(D.dataset.theme)X(Number(D.dataset.theme));else if(D.dataset.path)z(j.ti,Number(D.dataset.path));else if(D.dataset.lesson)yt(Number(D.dataset.lesson));else if(D.dataset.start)ki("Sample data: lessons open in the real Little Grains app.");else if(D.dataset.grp){let V=D.dataset.grp;V==="all"?it():K((e.group<0?V==="next"?-1:0:e.group)+(V==="next"?1:-1))}else D.dataset.zoom?Os(D.dataset.zoom==="in"?.8:1.25):D.classList.contains("lg-handle")?(pn.classList.toggle("open"),a&&e.group>=0&&setTimeout(()=>en(tn(),0),280)):D.classList.contains("lg-play")?Gh():D.classList.contains("lg-water")&&Wh()}),ci.addEventListener("input",()=>{e.playing=!1,e.week=Bi(Number(ci.value),0,16),Vi=Math.max(Vi,.8),Pr()});function Gh(){!e.playing&&e.week>=16&&(e.week=0),e.playing=!e.playing,e.playing&&(Vi=1),Pr()}function Wh(){e.playing=!1,e.week=Math.min(16,Math.floor(e.week)+1),Vi=1.8,Pr(),ki(`Week ${Math.floor(e.week)}: the garden drinks.`)}let La=[];function yf(){fn.innerHTML="",La=[];let T=(D,V,$,Z={})=>{let lt=document.createElement("div");lt.className=`lg-label ${D}`,lt.innerHTML=V,fn.appendChild(lt),La.push({el:lt,anchor:$,...Z})};j.level==="garden"&&de.forEach((D,V)=>{a&&e.group>=0&&!p[e.group].themes.includes(V)||T("theme",`<b>${Sn(D.theme.title)}</b>${d?"":'<span class="dots"></span>'}`,(o?new L(u[V][0],An,u[V][1]):D.center.clone()).add(new L(0,o?1.2:1.45,o?.6:ql*.62)),{ti:V,dots:!0})}),o&&j.level==="garden"&&(!a||e.group<0)&&h.forEach(D=>T("group-name",Sn(D.name),new L(D.center[0],.8,D.center[1]-3.2))),j.level==="theme"&&de[j.ti].cells.forEach((D,V)=>d?T("lesson",`<i class="n">${V+1}</i>`,D.center.clone().add(new L(0,.85,.28))):T("cell",`<b>${Sn(D.path.title)}</b><span class="dots"></span>`,D.center.clone().add(new L(0,.85,.28)),{ti:j.ti,pi:V,dots:!0,cell:!0})),j.level==="path"&&U&&U.nodes.forEach(D=>T("lesson",`<i class="n">${D.i+1}</i>${d?"":`<b>${Sn(U.path.lessons[D.i])}</b>`}`,D.pos.clone().add(new L(0,d?1.35:1.5,0)),{i:D.i}))}let Xh=R(".lg-hint");Xh.textContent=d?"Drag to move \xB7 pinch to zoom \xB7 two fingers to turn":"Scroll or drag to move \xB7 pinch or ctrl+scroll to zoom \xB7 right-drag to turn",setTimeout(()=>Xh.classList.add("gone"),9e3);let Hi=new L;function qh(){let T=y.clientWidth,D=y.clientHeight,V=[],$=a&&e.group>=0&&j.level==="garden",Z=[];for(let lt of La){Hi.copy(lt.anchor).project(x);let Bt=Hi.z<1&&Math.abs(Hi.x)<1.1&&Math.abs(Hi.y)<1.1&&!We;if(Bt&&!lt.el.classList.contains("group-name")&&j.level==="garden"&&!(a&&e.group>=0)){let Ft=(Hi.x*.5+.5)*T,ae=(-Hi.y*.5+.5)*D;V.some(([Dt,_t])=>Math.abs(Dt-Ft)<108&&Math.abs(_t-ae)<34)?Bt=!1:V.push([Ft,ae])}if(lt.el.style.opacity=Bt?1:0,Bt){let Ft=(Hi.x*.5+.5)*T,ae=(-Hi.y*.5+.5)*D;if($){let Dt=lt.el.offsetWidth,_t=lt.el.offsetHeight;Ft=Bi(Ft,Dt/2+12,T-Dt/2-12);let Gt=[0,-30,30,-60,60,-90,90];for(let le of Gt){let Ne=ae+le,hn={l:Ft-Dt/2-3,r:Ft+Dt/2+3,t:Ne-_t-3,b:Ne+3};if(Z.every(Fe=>hn.r<Fe.l||hn.l>Fe.r||hn.b<Fe.t||hn.t>Fe.b)){ae=Ne,Z.push(hn);break}}}lt.el.style.transform=`translate(-50%,-100%) translate(${Ft.toFixed(1)}px,${ae.toFixed(1)}px)`}}}function vf(){for(let T of La){if(T.dots){let D=T.el.querySelector(".dots");if(!D)continue;if(T.cell){let V=Le[T.ti].paths[T.pi],$=rt(V,Tt(T.ti,T.pi)),Z=`${$.cur}/${$.n}`;T.k!==Z&&(T.k=Z,D.innerHTML=ze($.n,$.cur))}else{let V=Le[T.ti],$=V.paths.filter((Z,lt)=>Tt(T.ti,lt)>.004).length;T.k!==$&&(T.k=$,D.innerHTML=ze(V.paths.length,$))}}if(T.i!=null&&U){let D=ft(`L${T.i}`);T.el.dataset.state=D>=.995?"done":D>.01?"cur":"todo"}}}let jn=null,Ir=null,Yh=new As(-1,1,1,-1,0,1),Jl=new ar,Kl=new te(new Ii(2,2));Jl.add(Kl);let jl=new In({depthTest:!1,depthWrite:!1,uniforms:{tScene:{value:null},tSharp:{value:null},tDepth:{value:null},uStep:{value:new ut},uFinal:{value:!1},uInvProj:{value:new ue},uWorld:{value:new ue},uCenters:{value:de.map((T,D)=>{let V=S(D);return new ut(V.x,V.z)})},uSelected:{value:new Ce},uFifth:{value:-1}},vertexShader:"varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`
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
      }`});function $h(){if(!(a&&j.level==="garden"&&e.group>=0)){A.setRenderTarget(null),A.render(I,x);return}let T=A.getDrawingBufferSize(new ut);(!jn||jn.width!==T.x||jn.height!==T.y)&&(jn?.dispose(),Ir?.dispose(),jn=new Bn(T.x,T.y),jn.depthTexture=new bs(T.x,T.y),Ir=new Bn(T.x,T.y,{depthBuffer:!1}));let D=I.fog.near,V=I.fog.far,$=x.position.distanceTo(P.target);I.fog.near=$+40,I.fog.far=$+200,A.setRenderTarget(jn),A.render(I,x),I.fog.near=D,I.fog.far=V;let Z=jl.uniforms;Kl.material=jl,Z.tScene.value=jn.texture,Z.uStep.value.set(1.7/T.x,0),Z.uFinal.value=!1,A.setRenderTarget(Ir),A.render(Jl,Yh),Z.tScene.value=Ir.texture,Z.tSharp.value=jn.texture,Z.tDepth.value=jn.depthTexture,Z.uInvProj.value.copy(x.projectionMatrixInverse),Z.uWorld.value.copy(x.matrixWorld),Z.uSelected.value.fromArray(p[e.group].themes),Z.uFifth.value=p[e.group].themes[4]??-1,Z.uStep.value.set(0,1.7/T.y),Z.uFinal.value=!0,A.setRenderTarget(null),A.render(Jl,Yh)}let Ua=0,Zh=performance.now(),Ln=0,Vi=0,Dr=!0,Ql=!0,tc="",Jh=!1,Mf=new vt("#5fa84a"),Sf=new vt(uf),bf=new vt("#b9b3a2"),Ef=new vt("#3f8fd2"),Tf=new vt("#e9e1cd");function Kh(){let T=Math.max(1,y.clientWidth),D=Math.max(1,y.clientHeight);A.setSize(T,D,!1),x.aspect=T/D,d?x.setViewOffset(T,D,0,D*.09,T,D):T>900?x.setViewOffset(T,D,-Math.min(170,T*.11),0,T,D):x.clearViewOffset(),x.updateProjectionMatrix(),Jh?Be||(a&&e.group>=0?en(tn(),0):Cr(tn())):(Jh=!0,en(tn(),0,.35))}let jh=new ResizeObserver(()=>Kh());jh.observe(y);function Qh(T){if(!Ql)return;Ua=requestAnimationFrame(Qh);let D=Math.min(.05,(T-Zh)/1e3);Zh=T,Ln+=D,e.playing&&(e.week=Math.min(16,e.week+D/2.1),e.week>=16&&(e.playing=!1,Vi=.4),Pr());let V=!1,$=n?1:1-Math.exp(-D*2.6),Z=[];(tt.visible||bt.visible)&&Le.forEach((Dt,_t)=>Dt.paths.forEach((Gt,le)=>Z.push(`c${_t}.${le}`))),U&&st.visible&&(Z.push("T"),U.nodes.forEach(Dt=>Z.push(`L${Dt.i}`)));for(let Dt of Z){let _t=ft(Dt),Gt=Ot.get(Dt)??0,le=_t-Gt;Math.abs(le)>4e-4?(Ot.set(Dt,Gt+le*$),V=!0):le!==0&&(Ot.set(Dt,_t),V=!0)}(V||Dr)&&((tt.visible||bt.visible)&&(o&&Ct.update(Ot),N.update(Ot),jt(qt,Ot),de.forEach(Dt=>Dt.cells.forEach(_t=>{let Gt=Oh((Ot.get(_t.key)??0)*3);_t.mesh.material.color.setRGB(.8+.2*Gt,.74+.26*Gt,.6+.4*Gt)}))),U&&st.visible&&(U.plants.update(Ot),jt(U.grass,Ot),U.nodes.forEach(Dt=>{let _t=Ot.get(`L${Dt.i}`)??0,Gt=ft(`L${Dt.i}`),le=Gt>=.995?0:Gt>.01?1:2;Dt.ring.material.color.copy(le===0?Mf:le===1?Sf:bf),Dt.stone.material.color.copy(It[le]);let Ne=Math.round(_t*Gn);Dt.dotMat.forEach((hn,Fe)=>hn.color.copy(Fe<Ne?Ef:Tf))})),Vh(),vf(),Dr=!1);let lt=`${j.level}.${j.ti}.${j.pi}.${j.lesson}.${Math.floor(e.week*2)}`;if(lt!==tc&&(tc=lt,!pn.matches(":hover")||e.playing?Hh():tc=""),U&&st.visible){let Dt=Math.min(U.n,Math.floor(Oi(e.week,U.path)*U.n));U.nodes.forEach(Gt=>{Gt.ring.scale.setScalar(Gt.i===Dt?1+Math.sin(Ln*3)*.05:1)});let _t=U.nextMark;if(_t.visible=Dt<U.n,_t.visible){let Gt=U.nodes[Dt].pos;_t.position.set(Gt.x,Gt.y+.004,Gt.z),_t.userData.halo.material.opacity=.8+Math.sin(Ln*2.2)*.2,_t.userData.pennant.rotation.y=.3+Math.sin(Ln*1.4)*.12}}Jt.opacity=.75+Math.sin(Ln*5)*.2,dt.uTime.value=Ln,Nt.children.forEach(Dt=>{Dt.position.x+=Dt.userData.v*D,Dt.position.x>60&&(Dt.position.x=-60)});let Bt=P.target,Ft=Math.min(4,x.position.distanceTo(Bt)*.22);if(ct.children.forEach(Dt=>{let _t=Dt.userData,Gt=Ln*_t.sp+_t.off;Dt.position.set(Bt.x+Math.cos(Gt)*(_t.rad+Ft*.4),Bt.y+_t.h+Math.sin(Ln*1.3+_t.ph)*.25,Bt.z+Math.sin(Gt*1.2)*(_t.rad+Ft*.4)),Dt.rotation.y=-Gt+Math.PI;let le=Math.sin(Ln*16+_t.ph)*.9;_t.wl.rotation.z=le,_t.wr.rotation.z=-le,Dt.scale.setScalar(_t.scale*(j.level==="garden"?1.8:1))}),at){let Dt=at.geometry.attributes.position.array;for(let _t=0;_t<Dt.length;_t+=3)Dt[_t]+=Math.sin(Ln*.5+_t)*.003+.002,Dt[_t+1]+=Math.sin(Ln*.7+_t*.3)*.002,Dt[_t+2]+=Math.cos(Ln*.4+_t)*.002,Dt[_t]>11&&(Dt[_t]-=22),Dt[_t+1]>4.2&&(Dt[_t+1]=.3);at.geometry.attributes.position.needsUpdate=!0}Vi>0&&!e.playing&&(Vi-=D);let ae=Vi>0||e.playing;if(mt.visible=ae,ae){let Dt=Math.min(9,x.position.distanceTo(Bt)*.5);for(let _t=0;_t<xt;_t++){let Gt=Pt[_t*3],le=Pt[_t*3+1],Ne=Pt[_t*3+2],hn=((le-Ln*.9*(.8+Gt*.2))%1+1)%1,Fe=Bt.x+Gt*Dt,ke=Bt.z+Ne*Dt,Je=Bt.y+hn*9-1;Wt.set([Fe,Je,ke,Fe-.02,Je-.34,ke],_t*6)}mt.geometry.attributes.position.needsUpdate=!0}Pa(T),P.update(),x.updateMatrixWorld(),qh(),$h()}return Kh(),Kn(),b(),Ua=requestAnimationFrame(Qh),{root:y,view:j,state:e,prof:l,compact:o,failed:!1,camera:x,controls:P,goGarden:W,goTheme:X,goPath:z,selectLesson:yt,back:wt,water:Wh,togglePlay:Gh,setGroup:K,clearGroup:it,stats:()=>({calls:A.info.render.calls,triangles:A.info.render.triangles,plants:N.meshes.reduce((T,D)=>T+D.count,0),grass:qt?.count||0}),ready:()=>!We&&!Be,pause:()=>{Ql=!1,cancelAnimationFrame(Ua),Pa(performance.now()+1e5),P.update(),x.updateMatrixWorld(),qh(),$h()},growthReady:()=>[...Ot.entries()].every(([T,D])=>Math.abs(ft(T)-D)<4e-4),progressSnapshot:()=>Object.fromEntries(Ot),dispose(){Ql=!1,cancelAnimationFrame(Ua),jh.disconnect(),removeEventListener("keydown",_e),Zt(),P.dispose(),jn?.dispose(),Ir?.dispose(),Kl.geometry.dispose(),jl.dispose(),I.traverse(T=>{T.geometry?.dispose?.();let D=T.material;D&&(Array.isArray(D)?D:[D]).forEach(V=>{V.map?.dispose?.(),V.dispose?.()})}),A.dispose(),A.forceContextLoss?.(),y.remove()}}}var Bh={week:16,playing:!1,group:-1},_f=document.querySelector("#mount"),$e,zh=!1,gf=i=>new Promise(t=>setTimeout(t,i)),kh={compactfocus:{shape:null,compact:!0,groups:!0},compact:{shape:null,compact:!0},hex:{shape:null},paths:{shape:Wl},interlock:{shape:(i,t)=>Wl(i,t,os[t])},groups:{shape:(i,t)=>Wl(i,t,os[t]),groups:!0}};async function xf(i){if(zh)return;zh=!0;let t=$e?{view:{...$e.view},compact:$e.compact,progress:$e.progressSnapshot(),camera:$e.camera.position.clone(),target:$e.controls.target.clone()}:null;document.querySelectorAll("[data-shape]").forEach(n=>n.disabled=!0),$e?.dispose();let e=kh[i]||kh.paths;if($e=mf({container:_f,profile:innerWidth<700?"mobile":"desktop",state:Bh,reduced:matchMedia("(prefers-reduced-motion:reduce)").matches,themeShape:e.shape,displayProgress:t?.progress,groupFocus:!!e.groups,compact:!!e.compact}),window.__shapeGarden=$e,t){let n=t.view;if(n.level==="theme"&&$e.goTheme(n.ti,0),n.level==="path"){for($e.goPath(n.ti,n.pi);!$e.ready();)await gf(30);if(n.lesson>=0)for($e.selectLesson(n.lesson);!$e.ready();)await gf(30)}$e.camera.position.copy(t.camera),$e.controls.target.copy(t.target),$e.controls.update(),t.compact!==!!e.compact&&n.level==="garden"&&$e.goGarden(0),e.groups&&Bh.group>=0&&$e.view.level==="garden"&&$e.setGroup(Bh.group,0)}document.querySelectorAll("[data-shape]").forEach(n=>{n.setAttribute("aria-pressed",String(n.dataset.shape===i)),n.disabled=!1}),zh=!1}document.querySelectorAll("[data-shape]").forEach(i=>i.onclick=()=>xf(i.dataset.shape));xf(kh[location.hash.slice(1)]?location.hash.slice(1):"paths");window.__shapeExperiment={counts:Le.map((i,t)=>({name:i.title,paths:i.paths.length,outlineVertices:Ta[t].length,interlockVertices:os[t].length})),polygons:Ta,interlocking:os,compactCenters:wa};new ResizeObserver(([i])=>{_f.style.top=i.target.getBoundingClientRect().height+"px"}).observe(document.querySelector(".experiment-bar"));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
