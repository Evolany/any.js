/**
 * @Copywrite (c) 2021, evolany, http://evolany.com 
 */

 var $conf=$conf||{};
 $conf.any_path = $conf.lib_path = $conf.lib_path||$conf.any_path ;
 var $ui={},TEXTS=TEXTS||{};
 const LOCALES = ['af_ZA','ar_AR','az_AZ','be_BY','bg_BG','bn_IN','bs_BA','ca_ES','cs_CZ','cy_GB','da_DK','de_DE','el_GR','en_GB','en_PI','en_UD','en_US','eo_EO','es_ES','es_LA','et_EE','eu_ES','fa_IR','fb_LT','fi_FI','fo_FO','fr_CA','fr_FR','fy_NL','ga_IE','gl_ES','he_IL','hi_IN','hr_HR','hu_HU','hy_AM','id_ID','is_IS','it_IT','ja_JP','ka_GE','km_KH','ko_KR','ku_TR','la_VA','lt_LT','lv_LV','mk_MK','ml_IN','ms_MY','nb_NO','ne_NP','nl_NL','nn_NO','pa_IN','pl_PL','ps_AF','pt_BR','pt_PT','ro_RO','ru_RU','sk_SK','sl_SI','sq_AL','sr_RS','sv_SE','sw_KE','ta_IN','te_IN','th_TH','tl_PH','tr_TR','uk_UA','vi_VN','zh_CN','zh_HK','zh_TW'];
 
 /**
  * @return {
  * 	name:MSIE|Firefox|Chrome|Safari|Opera|iPhone|iPad|iPod|Android|BlackBerry|IEMobile
  * 	ver:float
  * 	os: Win|Mac|Linux|iPhone|iPod|iPad|Android|IEMobile|BlackBerry
  * 	osver : float //mobile only
  * 	osname : WinXP|Vista|Win7|Win8|Win8.1|Win10 //Windows only
  * 	mobile : true|false //Mobile only
  * 	simulator : true|false  //mobile only
  * }
  * */
 const $browser = (function(){
	 var ua=navigator.userAgent,u,p=navigator.platform,r={},
		 n=ua.match(/(MSIE|Trident|Firefox|Chrome|Safari|Opera)[\/\s](\d+\.*\d*)/i);
	 // console.log(i,n,p);
	 r.name = n?n[1].toLowerCase():"unknown";
	 r.ver = n?parseFloat(n[2]):0;
	 if(r.name=="trident"){
		 r.name = "msie";
		 n = ua.match(/rv:(\d+\.?\d*)/);
		 if(n) r.ver=parseFloat(n[1]);
	 }
	 if(r.name=="safari"){
		 n = ua.match(/Version\/(\d+\.*\d*)/);
		 if(n) r.ver=parseFloat(n[1]);
	 }
	 if((/(iPad|iPhone|iPod|Android)/gi).test(ua) && (/Mobile/gi).test(ua) &&
		 !(/CriOS/).test(ua) &&
		 !(/FxiOS/).test(ua) &&
		 !(/OPiOS/).test(ua) &&
		 !(/mercury/).test(ua)){//mobile, supports iphone, android, mobileIE only.
			 console.log("UA",ua)
		 u = ua.match(/(iphone|ipad|ipod|android)/i);
		 r.os = u?u[0].toLowerCase():"Unknown";
		 var mptn = {'iphone':/^iphone/i,'ipad':/^ipad/i,'ipod':/^ipod/i,'android':/^linux\s(arm|i)/i,'iemobile':/win/i};
		 r.simulator = !p.match(mptn[r.os]); //check its device or simulator
		 if(u=ua.match(/(iPhone|iPad|iPod)\sOS\s([\d_]+)/i))
			 r.osver=u[2].split("_").join(".");
		 if(u=ua.match(/(Android|BlackBerry|Windows\sPhone\sOS)\s([\d\.]+)/i))
			 r.osver=u[2];
		 r.name = r.name=='unknown'? r.os:r.name;
		 r.mobile = true;
		 
	 }else{ //pc
		 u = p.match(/(x11|linux|mac|win)/i);
		 r.os = u?(u[0].toLowerCase()=='x11'?"linux":u[0].toLowerCase()):"unknown";
		 if(u=ua.match(/Mac\sOS\sX\s([\d_]+)/i)){
			 r.osver=u[1].split("_").join(".");
		 }
		 if(u=ua.match(/Windows\sNT\s([\d\.]+)/i)){
			 r.osver = u[1];
			 r.osname = {'5.1':'WinXP','5.2':'WinXP','6.0':'Vista','6.1':'Win7','6.2':'Win8','6.3':'Win8.1','10.0':'Win10'}[r.osver];
		 }
	 }
	 r.lang = navigator.language.split("-")[0];
	 if((r.name=="Unknown"||r.os=="Unknown")&&$app&&$app.onError)
		 $app.onError("unsupported_error");
	 r.statusbar = window.statusbar && window.statusbar.visible;
	 r.toolbar = window.toolsbar && window.toolsbar.visible;
	 return r;
 })();
 
 const __RESVD = ['for','as','index','view','app','this'];
 
 function $id(domid){
	 return document.getElementById(domid);
 }
 /* shot cuts */
 // if(!$) //to support jquery
 var $ = function(query,each){
	 var usingView = ($app.status === "loaded" && $this && $this.layer);
	 var res = usingView? $this.layer.find(query,each):document.querySelectorAll(query);
	 if (!usingView && res) {
		 if(each) res.each(each);
		 var qs=query.split(" "),qu=qs[qs.length-1];
		 res = qu.indexOf("#")==0? res[0]:res;
	 }
	 return res;
 }
 
 var TSX=0,TSY=0;
 $.args=null,
 $.__events = {
	 'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	 'MouseEvents': /^(?:click|dblclick|touch(start|end|up|cancel)|mouse(?:down|up|over|move|out))$/,
	 'KeyboardEvents': /^(?:keyup|keydown|keypress|input)$/,
 },
 $.__eventOpts = {
	 pointerX: 0,
	 pointerY: 0,
	 button: 0,
	 ctrlKey: false,
	 altKey: false,
	 shiftKey: false,
	 metaKey: false,
	 bubbles: true,
	 cancelable: true
 },
 
 $.__HTML_ESC = {"nbsp":" ","iexcl":"¡","cent":"¢","pound":"£","curren":"¤","yen":"¥","brvbar":"¦","sect":"§","uml":"¨","copy":"©","ordf":"ª","laquo":"«","not":"¬","reg":"®","macr":"¯","deg":"°","plusmn":"±","sup2":"²","sup3":"³","acute":"´","micro":"µ","para":"¶","middot":"·","cedil":"¸","sup1":"¹","ordm":"º","raquo":"»","frac14":"¼","frac12":"½","frac34":"¾","iquest":"¿","Agrave":"À","Aacute":"Á","Acirc":"Â","Atilde":"Ã","Auml":"Ä","Aring":"Å","AElig":"Æ","Ccedil":"Ç","Egrave":"È","Eacute":"É","Ecirc":"Ê","Euml":"Ë","Igrave":"Ì","Iacute":"Í","Icirc":"Î","Iuml":"Ï","ETH":"Ð","Ntilde":"Ñ","Ograve":"Ò","Oacute":"Ó","Ocirc":"Ô","Otilde":"Õ","Ouml":"Ö","times":"×","Oslash":"Ø","Ugrave":"Ù","Uacute":"Ú","Ucirc":"Û","Uuml":"Ü","Yacute":"Ý","THORN":"Þ","szlig":"ß","agrave":"à","aacute":"á","acirc":"â","atilde":"ã","auml":"ä","aring":"å","aelig":"æ","ccedil":"ç","egrave":"è","eacute":"é","ecirc":"ê","euml":"ë","igrave":"ì","iacute":"í","icirc":"î","iuml":"ï","eth":"ð","ntilde":"ñ","ograve":"ò","oacute":"ó","ocirc":"ô","otilde":"õ","ouml":"ö","divide":"÷","oslash":"ø","ugrave":"ù","uacute":"ú","ucirc":"û","uuml":"ü","yacute":"ý","thorn":"þ","yuml":"ÿ","fnof":"ƒ","Alpha":"Α","Beta":"Β","Gamma":"Γ","Delta":"Δ","Epsilon":"Ε","Zeta":"Ζ","Eta":"Η","Theta":"Θ","Iota":"Ι","Kappa":"Κ","Lambda":"Λ","Mu":"Μ","Nu":"Ν","Xi":"Ξ","Omicron":"Ο","Pi":"Π","Rho":"Ρ","Sigma":"Σ","Tau":"Τ","Upsilon":"Υ","Phi":"Φ","Chi":"Χ","Psi":"Ψ","Omega":"Ω","alpha":"α","beta":"β","gamma":"γ","delta":"δ","epsilon":"ε","zeta":"ζ","eta":"η","theta":"θ","iota":"ι","kappa":"κ","lambda":"λ","mu":"μ","nu":"ν","xi":"ξ","omicron":"ο","pi":"π","rho":"ρ","sigmaf":"ς","sigma":"σ","tau":"τ","upsilon":"υ","phi":"φ","chi":"χ","psi":"ψ","omega":"ω","thetasym":"ϑ","upsih":"ϒ","piv":"ϖ","bull":"•","hellip":"…","prime":"′","Prime":"″","oline":"‾","frasl":"⁄","weierp":"℘","image":"ℑ","real":"ℜ","trade":"™","alefsym":"ℵ","larr":"←","uarr":"↑","rarr":"→","darr":"↓","harr":"↔","crarr":"↵","lArr":"⇐","uArr":"⇑","rArr":"⇒","dArr":"⇓","hArr":"⇔","forall":"∀","part":"∂","exist":"∃","empty":"∅","nabla":"∇","isin":"∈","notin":"∉","ni":"∋","prod":"∏","sum":"∑","minus":"−","lowast":"∗","radic":"√","prop":"∝","infin":"∞","ang":"∠","and":"∧","or":"∨","cap":"∩","cup":"∪","int":"∫","there4":"∴","sim":"∼","cong":"≅","asymp":"≈","ne":"≠","equiv":"≡","le":"≤","ge":"≥","sub":"⊂","sup":"⊃","nsub":"⊄","sube":"⊆","supe":"⊇","oplus":"⊕","otimes":"⊗","perp":"⊥","sdot":"⋅","lceil":"⌈","rceil":"⌉","lfloor":"⌊","rfloor":"⌋","lang":"〈","rang":"〉","loz":"◊","spades":"♠","clubs":"♣","hearts":"♥","diams":"♦","quot":'"',"amp":"&","lt":"<","gt":">","OElig":"Œ","oelig":"œ","Scaron":"Š","scaron":"š","Yuml":"Ÿ","circ":"ˆ","tilde":"˜","ndash":"–","mdash":"—","lsquo":"‘","rsquo":"’","sbquo":"‚","ldquo":"“","rdquo":"”","bdquo":"„","dagger":"†","Dagger":"‡","permil":"‰","lsaquo":"‹","rsaquo":"›","euro":"€"};
 
 $.__rules = ['.hidden','tag'];//save global visibility css rules to hide sub elements @see addRules
 
 IE_RESERVED_ATTRS = ["type","method"];
 
 // var __={},/**runtimes variables will be deleted in ?ms */
 // __set=function(k,v,ms){__[k] = v;ms=ms||300;setTimeout(function(key){delete __[key];}, ms, k);},
 // __clear=function(){__={};};
 
 $.__runtime = {}
 $.put = (k,v)=>$.__runtime[k]=v;
 $.get = (k)=>$.at($.__runtime, k);
 $.clear = ()=>$.__runtime = {};
 
 $.__uuid = 0;
 
 var $this;//current view.
 
 /**
  * check if class/function/const declared
  * @param {*} x : string, name of the class/function/const
  */
 $.exists = function(name){
	 return eval(`typeof(${name})`)!=='undefined';
 }
 /**
  * get class/function/const by name
  * @param {*} name 
  * @returns 
  */
 $.reflect = function(name){
	 return $.exists(name) ? eval(`${name}`) : undefined;
 }
 
 $.isArray = function(v){
	 return v && Object.prototype.toString.call(v) === '[object Array]';
 }
 $.isFunc = function(f) {
	 return f && f instanceof Function ;
 }
 
 $.isFile = function(v){
	 return Object.prototype.toString.call(v) === '[object File]';
 }
 $.isBool = function(va){
	 return va===true || va===false;
 }
 $.isElement = function(obj) {
	 if(obj==null)return false;
	 try {
		 return obj && (obj instanceof HTMLElement || obj instanceof SVGElement || (obj.constructor && obj.constructor.name=="Element"));
	 }catch(e){
		 return (typeof obj==="object") &&
			 (obj.nodeType===1) && (typeof obj.style === "object") &&
			 (typeof obj.ownerDocument ==="object");
	   }
 }
 $.isNumber = function(n){return typeof n=='number' || ($.isString(n) && n.match(/^[0-9.]+$/) && isFinite(n));}
 $.isString = function(o){return typeof o == 'string' || o instanceof String;}
 $.isObject = function(o){return typeof o === "object";}
 $.isGenerator = function(fn){return fn&&fn.constructor&&fn.constructor.name==='GeneratorFunction'};
 $.jsonDecode = function(str, defaultValue){
	 if(!$.isString(str))return str || defaultValue;
	 try {
		 return JSON.parse(str);
	 } catch (e) {
		 return defaultValue;
	 }
 }
 $.keys=function(obj){
	 var s = [];if($.isObject(obj))for(var k in obj){s.push(k);}return s;
 };
 $.values=function(obj){
	 var s = [];for(var k in obj){s.push(obj[k]);}return s;
 };
 $.unique=function(arr){
	 var a = [];for(var i in arr){if(!$.isFunc(arr[i])&&a.indexOf(arr[i])<0)a.push(arr[i]);} return a;
 };
 $.trim=function(arr,func){
	 var a = [];for (var i=0; i<arr.length;i++){
		 var v = arr[i];if(func){
			 if(func(v))a.push(v);
		 }else if(v===0||(v!=null && v!=undefined && v!="")) 
			 a.push(v);
	 }return a;
 };
 $.empty =function(obj){
	 return (!obj)||($.isArray(obj)&&obj.length<=0)||
		 ($.isObject(obj)&&Object.keys(obj).length<=0);
 }
 //get min, max value
 $.range = function(arr,col){
	 if(!arr)return false;
	 var min,max,v,i;
	 for(i=0;i<arr.length;i++){
		 v = col? arr[i][col]:arr[i];
		 if(!min){min=v;max=v;}
		 if(min>v)min=v;
		 if(max<v)max=v;
	 }
	 return [min,max];
 }
 
 /**
  * @example:
  * var c = $.sync(function*(){
  * 	var a = yield (()=>{setTimeout(()=>{console.log("aaaa");return 1},2000)})(),
  *  console.log("a finished",a);
  *  var b = yield (()=>{setTimeout(()=>{console.log("aaaa");return 1},2000)})(),
  *  console.log("b finished",b);
  *  return 3;
  * })
  * console.log("c=",c);
  */
 $.sync = function(g){
	 var it = g(), ret;
	 (function iterate(val){// asynchronously iterate over generator
		 ret = it.next(val);
		 if (!ret.done) {
			 // poor man's "is it a promise?" test
			 if (typeof(ret.value) === 'object' && "then" in ret.value) {// wait on the promise
				 ret.value.then( iterate );
			 }else {// immediate value: just send right back in
				 setTimeout( function(){// avoid synchronous recursion
					 iterate( ret.value );
				 }, 0 );
			 }
		 }
	 })();
 }
 
 /**
 * @param : get JS params
 */
 $.getArguments = function(){
	 if($.args)return $.args;
	 var scripts = document.getElementsByTagName("script");
	 $.args = {};
	 for(var i in scripts){
		 var sc = scripts[i];
		 if(sc.src.indexOf('any.js')>=0){
			 var pstrs = sc.src.split('any.js');
			 var pstr = pstrs[1];
			 if(pstr.indexOf("?")==0){
				 pstr= pstr.replace("?","");
				 pstrs = pstr.split('&');
				 for(var j in pstrs){
					 var parts = pstrs[j].split('=');
					 $.args[parts[0]] = parts[1];
				 }
			 }
			 return $.args;
		 }
	 }
 }
 
 $.getCookie = function(key){
	 if(document.cookie){
		 var kvs = $.unserialize(document.cookie,";");
		 return kvs[key];
	 }
	 return null;
 }
 $.unserialize = function(paramStr,rowSpliter,kvSpliter){
	 if(!paramStr) return null;
	 rowSpliter = rowSpliter||"&";
	 kvSpliter = kvSpliter||"=";
	 paramStr = paramStr.replace(/^(.*)\?/i,'');
	 var parts = paramStr.split(rowSpliter);
	 var params = {};
	 for(var i=0,p;p=parts[i];i++){
		  var ps = p.split(kvSpliter);
		  if(ps.length==2)
			 params[ps[0].trim()] = ps[1];
	 }
	 return params;
 }
 $.serialize = function(params,rowSpliter,kvSpliter) {
	 var pairs = [];
	 rowSpliter = rowSpliter||"&";
	 kvSpliter = kvSpliter||"=";
	 for (var k in params) {
		pairs.push([k,params[k]].join(kvSpliter));
	 }
	 return pairs.join(rowSpliter);
 }
 
 $.send = function(target,msg,data){
	 if(!target || !$.isString(msg))return;
	 var fo = 'on'+msg.split(/[\-_]+/g).map(e=>e.ucfirst()).join('');
	 fn = $.isFunc(target[fo])? fo : ($.isFunc(target.onMessage)?'onMessage':false);
	 if(target && fn){
		 var func = target[fn];
		 var args = Array.from(arguments);
		 args = fn=='onMessage'?args.slice(1):args.slice(2);
		 return func.apply(target,args);
	 }
	 return;
 }
 $.sendAsync = async function(target,msg,data){
	 if(!target || !$.isString(msg))return;
	 var fo = 'on'+msg.split(/[\-_]+/g).map(e=>e.ucfirst()).join('');
	 fn = $.isFunc(target[fo])? fo : ($.isFunc(target.onMessageAsync)?'onMessageAsync':false);
	 if(target && fn){
		 var func = target[fn];
		 var args = Array.from(arguments);
		 args = fn=='onMessageAsync'?args.slice(1):args.slice(2);
		 return await func.apply(target,args);
	 }
	 return;
 }
 
 /**
  * preload image list (or css|font)
  * */
 $.preload = function(files, onfileLoad, onfileError){
	 for(var i =0;i<files.length;i++){
		 var f = files[i];
		 if(f.indexOf("http")!=0&&$conf.preload_image_path){
			 if(f.indexOf($conf.preload_image_path)!=0){
				 f = $conf.preload_image_path + f;
			 }
		 }
		 var img = new Image();
		 if(onfileLoad)img.onload = function(e){e=e||window.event;var target=e.target||e.srcElement;onfileLoad(target.src);};
		 if(onfileError)img.onerror =function(e){e=e||window.event;onfileError(e.target||e.srcElement);};
		 img.src = f;
	 }
 }
 
 $.clone = function(o){
	 if(typeof(o)==="object" || $.isArray(o))
		 return JSON.parse(JSON.stringify(o));
	 else if($.isArray(o)){
		 return o.slice(0)
	 } 
	 return o;
 }
 
 //link css files
 $.link = function(filepath){
	 if(!filepath)return;
	 var id = filepath.replace(/[\/\.]/g,'_');
	 if($("link#"+id).length>0)return;
	 var link = document.createElement( "link" )
		 .attr({id:id, href:filepath, type:"text/css", rel:"stylesheet"});
	 document.getElementsByTagName( "head" )[0].appendChild(link);
 }
 
 $.isHTML = (str)=>{
	 if(!$.isString(str)) return false;
	 var a = $div({innerHTML:str});
	   for (var c = a.childNodes, i = c.length; i--; ) {
		 if (c[i].nodeType == 1) return true; 
	 }
	   return false;
 }
 
 /**
  * kanji num => 0-9 form number
  *  s = "五万九千八百零一"
	 s = "五百四十一万九千八百三十一"
	 s = "伍陌萬弐陌卌壱"
 */
 $.text2num = function(s){
	 var v = 0,n = 0;
	 var nmap = {'一':1,'壱':1,'壹':1,'弌':2,'二':2,'弐':2,'貳':2,'貮':2,'贰':2,'三':3,'参':3,'參':3,'弎':3,'叁':3,'叄':3,'四':4,'肆':4,'五':5,'伍':5,'六':6,'陸':6,'陸':6,'七':7,'漆':7,'柒':7,'八':8,'捌':8,'九':9,'玖':9}
	 var bmap = {'十':10,'拾':10,'廿':20,'卄':20,'卅':30,'丗':30,'卌':40,'百':100,'陌':100,'千':1000,'阡':1000,'仟':1000}
	 var b4map = {'万':10000,'萬':10000,'億':100000000,'兆':1000000000000}
	 s = s.replace(/[０-９]/g, function(s) { //０−９ => 0-9
		 return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	 });
	 var ns = "";
	 for(var x=0,c;c=s.charAt(x);x++){
		 if(c.match(/[0-9]/)){
			 ns+=c;
			 n = parseInt(ns);
		 }else if(c in nmap){
			 n=nmap[c];
		 }else if(c in bmap){
			 v+=n*bmap[c];
			 n=0;
			 ns="";
		 }else if(c in b4map){
			 if(n>0)v+=n;
			 v*=b4map[c];
			 n=0;
			 ns="";
		 }
	 }
	 if(n>0)v+=n;
	 // console.log(v)
	 return v;
 }
 
 /**
  * include js files
  * @example:
  * 	$.include('test_view', callback, 'param1', 'param2')
  *  when its loaded: callback('param1','param2') will be executed.
  */
 $.include = function(src, callback){
	 if(src.indexOf(".js")<0)
		 src+=".js";
	 if(src.charAt(0)!='/' && !src.match(/^https*:\//))
		 src = $conf.lib_path+src;
	 var jsId = src.split("/");
	 jsId = jsId[jsId.length-1].replace(/\./g,"_").replace(/\?.*/,'');
	 
	 var time = new Date().getTime();
	 var cb = callback?($.isString(callback)?window[callback]:callback):null;
	 var args = [];//user parameters
	 for(let i=2;i<arguments.length;i++)
		 args.push(arguments[i]);
	 var se = $(`script#${jsId}`,true);
	 var included = function(e){
		 if(!$app.__included)
			 $app.__included = [];
		 var t=e.target||e.srcElement;
		 if(t.readyState == "loading")
			 return;
		 if(e.type=="error"){
			 if($app.onError) return $app.onError("app_include_error",t.src);
			 else throw new Error("ERROR : Failed to load "+t.src);
		 }
		 t.onload = t.onreadystatechange = null;
		 $app.__included.push(t.id);
		 if(cb){cb.apply(window,args)}
	 };
	 if(!se||!se.length){
		 se = document.createElement("script");
		 se.id= jsId;
		 se.type = "text/javascript";
		 se.onload = se.onreadystatechange = included;
		 se.onerror = included;
		 var head = document.head?document.head: document.getElementsByTagName('head')[0];
		 se.src = $conf.mode=='Developing'?src+"?v="+time : src+"?v="+($conf.app_ver||'');
		 head.appendChild(se)
	 }else{
		 se = se[0];
		 if(se.readyState=='loading'){
			 se.onload = se.onreadystatechange = included;
		 }else
			 included({target:se,type:'loaded'});
	 }
 }
 
 /**
  * include multiple files
  */
 $.includes = (files, opts)=>{
	 // opts: onLoaded, onError, onCompleted,  useOrgUrl
	 opts = opts||{};
	 if(empty(files)) return false;
	 $app.__included = $app.__included || [];
	 let idx=-1;
	 const check_completed = ()=>{
		 if(idx+1>=files.length) {
			 if(opts.onCompleted) try{ opts.onCompleted(); } catch(e) {console.error(e);}
		 }
	 }
	 var load = (src)=>new Promise((resolve, reject)=>{
		 let isJS = src.includes(".js");
		 // let isCSS = src.includes(".css");
		 if(isJS&&!src.includes(".")&&!opts.useOrgUrl) src+=".js";
		 if(!src.match(/^(https*|\/|\.)/)) src = $conf.lib_path+src;
		 let jsId = $.md5(src);
		 if($app.__included.includes(jsId) || document.getElementById(jsId)) {
			 idx++; return resolve(src);
		 }
 
		 if($conf.mode.match(/develop/i)&&!opts.useOrgUrl)
			 src+= (src.indexOf('?')>0 ? '&':'?') + 'timestamp=' + new Date().getTime();
		 let tag = isJS? 
			 $e('script',{id : jsId, src: src},document.head) : 
			 $e('link',{id : jsId, href: src, rel:"stylesheet",type:"text/css"},document.head);
		 tag.bind('load',() => {
			 idx++; resolve(src);
			 $app.__included.push(src);
			 // console.log(`success to load file: ${src}`);
			 if(opts.onLoaded) try{ opts.onLoaded(src); } catch(e) {console.error(e);}
		 })
		 .bind('error',() => {
			 idx++; reject(src);
			 // console.error(`Failed to load file: ${src}`);
			 if(opts.onError) try{ opts.onError(src); } catch(e) {console.error(e);}
		 });
	 }).then(r=>{
		 check_completed(); return r;
	 },(r)=>{//
		 check_completed(); return r;
	 });
	 let promises = files.map(f=>load(f));
	 return Promise.all(promises);
 }
 
 $.extend = function(destination, source, except=[]) {
	 for (var f in source)
		  if(!(f in destination) && !except.includes(f)) destination[f] = source[f];
	 return destination;
 }
 
 /**
  * send log to dummy url log.html. for apache log analyzing.
  * 
  * $conf.log_path = "/log.php"
  * $.log("my_action"); => /log.php?action=my_view:$UID:my_action
  *  
  */
 $.log = function(action,params){
	 if(!$conf.log_path)return;
	 var p = $.serialize(params);
	 action=[$this.name, action].join("/");
	 if($http)
		 $http.get([log_path,"/",action,"?",p].join(""));
 };
 $.rand = function(min, max) {
	 var argc = arguments.length;
	 if (argc === 0) {
		 min = 0;
		 max = 2147483647;
	 } else if (argc === 1) {
		 max = min;
		 min = 1;
	 }
	 return Math.floor(Math.random() * (max - min + 1)) + min;
 };
 /**
  * generate key string with specified length, and character set.
  * @param  $len: length of the key
  * @param  $chars: charactor set string
  * @return a key string
  * @example
  *  keygen(64, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.;,-$%()!@")
  */
 $.keygen = function(len,chars){
	 len = len||16;
	 chars = chars||"abcdefghijklmnopqrstuvwxyz0123456789_.;,-$%()!@";
	 var keys=[],clen=chars.length;
	 for(var i=0;i<len;i++){
		 keys.push(chars[$.rand(0,clen-1)]);
	 }
	 return keys.join('');
 }
 /**
  * generate uuid 
  * @return {[type]} [description]
  */
 $.uuid = function(){
	 var d = new Date().getTime();
	 var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		 var r = (d + Math.random()*16)%16 | 0;
		 d = Math.floor(d/16);
		 return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	 });
	 return uuid;
 };
 
 
 $.documentHeight = function() {
	 var d = document.documentElement ? document.documentElement:document.body;
	 return Math.max(d.scrollHeight, d.offsetHeight,d.clientHeight);
 }
 $.screenWidth = function(){
	 return  window.innerWidth|| document.documentElement.clientWidth|| document.getElementsByTagName('body')[0].clientWidth;
 }
 $.screenHeight = function(){
	 return  window.innerHeight|| document.documentElement.clientHeight|| document.getElementsByTagName('body')[0].clientHeight;
 }
 $.rect = function(el){
	 return el&&el.rect?el.rect():{left:0,top:0,width:0,height:0};
 }
 $.remove = function(el){
	 if($.isElement(el) && el.attr('view-index')) delete $app.__views[el.attr('view-index')];
	 if(el&&!$.isString(el)&&el.remove)return el.remove();
	 if($.isString(el)&&el.startsWith("#")){
		 $.remove($id(el.replace("#","")));
	 }
 }
 $.show = function(el){
	 if(el&&el.show)el.show(); return el;
 }
 $.hide = function(el){
	 if(el&&el.hide)el.hide(); return el;
 }
 $.fire = function(el){
	 if(el&&el.fire)el.fire(); return el;
 }
 
 $.hover = function(el,in_func,out_func){
	 if(!in_func)return;
	 el.bind('mouseenter',function(e) {
		 elog("in",this.tagName+"."+this.className);
		 in_func.call(e.target,e);
	 });
	 el.bind('onmouseleave',function(e) {
		 elog("out",this.tagName+"."+this.className);
		 if(!out_func)return;
		 var pt = $.cursor(e);
		 var rect = $.rect(el);
		 // console.error("out-rect",pt,rect);
		 if(!$.inRect(pt,rect)){
			 out_func.call(e.target,e);
		 }
	 });
 }
 $.insertChar = function(ipt,char){
	 if (ipt.selectionStart || ipt.selectionStart == '0') {
		 var startPos = ipt.selectionStart;
		 var endPos = ipt.selectionEnd;
		 ipt.value = ipt.value.substring(0, startPos)
			 + char
			 + ipt.value.substring(endPos, ipt.value.length);
		 ipt.selectionStart = startPos+char.length;
		 ipt.selectionEnd = endPos+char.length;
	 } else {
		 ipt.value += char;
	 }
 }
 
 /**
  * timestamp to date string
  * @param  {long} time : timestamp, 14bit
  * @param  {string} locale : en-GB, en-US, ja-JP, zh-CN, ko-KR ...
  * @return {string} : the date time string
  */
 $.time2str = function(time, locale){
	 var str = time+"";
	 if(str.length==11)time*=1000;
	 str =  new Date(time).toLocaleDateString(locale);
	 if(locale.match(/^(zh|ja)/)){
		 var ps = str.split("/");
		 for(var i=0,p;p=ps[i];i++){
			 if(p.length==1)ps[i]="0"+p;
		 }
		 return ps.join("-");
	 }else
		 return str;
 }
 
 /**
  * wrap text to specified format
  * - thousand : 1000 > 1,000
  * - date:YYYY-MM-DD hh:mm:ss (W) > 2020-09-11 12:00:32 (金)
  */
 $.wrap = function(str, format){
	 if(empty(str)) return '';
	 // elog("wrap", str, format)
	 if(format == 'thousand'){
		 return new Number( `${str}`.replace(/[^\d]/g,'') ).toLocaleString();
	 }else if(format.startsWith('date:')){
		 let v = `${str}`.replace(/[^\d]/g,'');
		 if(v.length==10) v += '000';
		 if(v.length!=13) return "";
		 return new Date(parseInt(v)).format(format.replace(/^date:/,''));
	 }
	 return str;
 }
 
 /**
 * return mouse position;
 */
 $.cursor = function(e,target){
	 $.__mouseX=0;$.__mouseY=0;
	 if (e.pageX || e.pageY) { 
		 $.__mouseX = e.pageX;
		 $.__mouseY = e.pageY;
	 } else { 
		 $.__mouseX = e.clientX + document.body.scrollLeft; 
		 $.__mouseY = e.clientY + document.body.scrollTop; 
	 } 
	 return {x:$.__mouseX,y:$.__mouseY};
 }
 $.inRect = function(point, rect){
	 return point.x>=rect.left && point.x<=rect.left+rect.width
			 && point.y>=rect.top && point.y<=rect.top+rect.height;
 }
 /**
  * @param r1 : rect1
  * @param r2 : rect2
  */
 $.overlay = function(r1, r2){
	 if(!r1||!r2)return false;
	 if($.isElement(r1)&&$.isElement(r2))
		 return $.overlay($.rect(r1),$.rect(r2))
	 var l1 = r1.left, l2 = r2.left,
		 t1 = r1.top, t2 = r2.top,
		 b1 = t1+r1.height, b2 = t2+r2.height,
		 rt1 = l1+r1.width, rt2 = l2+r2.width;
	 return !(rt1 < l2 || l1 > rt2 || b1 < t2 || t1 > b2);
 }
 
 /**
  * show file/image upload window
  * example:
  * */
 $.uploadWindow = function(callback,multiple,types,withsize){
	 var fname = "__tmpFileForm";
	 //, iname="__tmpFileBtn";
	 // var imgform = $id(fname,true);
	 // if(imgform==undefined){
	 $.remove($id(fname,true))
	 var imgform = $form({id:fname, enctype:"multipart/form-data" }, document.body).css({border:'0px',height:'0px',width:'0px',display:"none"});
	 var params = {type:"file", name:"tempfile"};
	 if(multiple) params["multiple"] = "multiple";
	 if(types) params.accept = types;
	 var ipt = $input(params,imgform);
	 ipt.bind("change",function(e){
		 console.log("changes",this.files,this.value)
		 if(!this.value)return;
		 var ext = this.value.match(/\.([^\.]+)$/)[1]||'';
		 ext = ext.toLowerCase();
		 if(["jpg","png","gif","bmp", "jpeg"].indexOf(ext)>=0){
			 $.imagesData(this.files, function(fs){
				 if(callback) callback(fs);
				 $.remove($id(fname,true))
			 },withsize)
		 }else{
			 callback(this.value, this.files);
			 $.remove($id(fname,true))
		 }
	 });
	 ipt.fire("click");
	 return imgform;
 }
 
 /**
  * local files to Base64 src data list
  * @param {*} fs : local File list
  * @param {*} cb : callback func
  */
 $.imagesData = function(fs, cb, withsize){
	 var len = fs.length, files = [];
	 //TODO filter images
	 // if(["jpg","png","gif","bmp", "jpeg"].indexOf(ext)>=0){
	 for(var i=0,f; f=fs[i++]; i){
		 var reader = new FileReader();
		 reader.file = f;
		 reader.onload = function (e2) {
			 var src = e2.target.result;
			 if(withsize){
				 var file = this.file;
				 var im = new Image();
				 im.onload = function(e3){
					 files.push({file:file,src:src,width:this.width,height:this.height,size:file.size,type:file.type});
					 if(files.length>=len){
						 cb(files);
					 }
				 }
				 im.src = src;
			 }else{
				 files.push({file:this.file,src:src});
				 if(files.length>=len){
					 cb(files);
				 }
			 }
		 };
		 reader.readAsDataURL(f);	
	 }
 }
 
 /**
  * update all elements with the same classname
  * with the specified value under `dom`
  */
 $.updateChain = function(cls,v,dom){
	 if(!cls||!v)return;
	 var ipt = this;//the original input item
	 dom = dom||($this?$this.layer:document.body);
	 dom.find(`.${cls}`,(el,i)=>{
		 if(['INPUT','TEXTAREA','SELECT'].indexOf(el.tagName)>=0){
			 el.value = v;
		 }else if(el.chain && $.isString(el.chain)){
			 if(el.chain.startsWith('style.')){
				 var c = el.chain.replace('style.','');
				 if(el.style.hasOwnProperty(c))
					 el.style[c] = c=='backgroundImage'?`url(${v})`: v;
			 }else el[el.chain]=v;
		 }else if(el.chain && $.isFunc(el.chain)){
			 el.chain.call(el,v,i,ipt);
		 }else
			 el.innerHTML = (v+"").split('\n').join('<BR>');
	 });
 }
 $.md5 = function(str) {
	 if(!str)return '';
	 var xl;
	 var rotateLeft = function(lValue, iShiftBits) {
		 return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	 };
 
	 var addUnsigned = function(lX, lY) {
		 var lX4, lY4, lX8, lY8, lResult;
		 lX8 = (lX & 0x80000000);
		 lY8 = (lY & 0x80000000);
		 lX4 = (lX & 0x40000000);
		 lY4 = (lY & 0x40000000);
		 lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		 if (lX4 & lY4) {
			 return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		 }
		 if (lX4 | lY4) {
			 if (lResult & 0x40000000) {
				 return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			 } else {
				 return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			 }
		 } else {
			 return (lResult ^ lX8 ^ lY8);
		 }
	 };
 
	 var _F = function(x, y, z) {
		 return (x & y) | ((~x) & z);
	 };
	 var _G = function(x, y, z) {
		 return (x & z) | (y & (~z));
	 };
	 var _H = function(x, y, z) {
		 return (x ^ y ^ z);
	 };
	 var _I = function(x, y, z) {
		 return (y ^ (x | (~z)));
	 };
 
	 var _FF = function(a, b, c, d, x, s, ac) {
		 a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
		 return addUnsigned(rotateLeft(a, s), b);
	 };
 
	 var _GG = function(a, b, c, d, x, s, ac) {
		 a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
		 return addUnsigned(rotateLeft(a, s), b);
	 };
 
	 var _HH = function(a, b, c, d, x, s, ac) {
		 a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
		 return addUnsigned(rotateLeft(a, s), b);
	 };
 
	 var _II = function(a, b, c, d, x, s, ac) {
		 a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
		 return addUnsigned(rotateLeft(a, s), b);
	 };
 
	 var convertToWordArray = function(str) {
		 var lWordCount;
		 var lMessageLength = str.length;
		 var lNumberOfWords_temp1 = lMessageLength + 8;
		 var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		 var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		 var lWordArray = new Array(lNumberOfWords - 1);
		 var lBytePosition = 0;
		 var lByteCount = 0;
		 while (lByteCount < lMessageLength) {
			 lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			 lBytePosition = (lByteCount % 4) * 8;
			 lWordArray[lWordCount] = (lWordArray[lWordCount] | (str
					 .charCodeAt(lByteCount) << lBytePosition));
			 lByteCount++;
		 }
		 lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		 lBytePosition = (lByteCount % 4) * 8;
		 lWordArray[lWordCount] = lWordArray[lWordCount]
				 | (0x80 << lBytePosition);
		 lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		 lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		 return lWordArray;
	 };
 
	 var wordToHex = function(lValue) {
		 var wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
		 for (lCount = 0; lCount <= 3; lCount++) {
			 lByte = (lValue >>> (lCount * 8)) & 255;
			 wordToHexValue_temp = "0" + lByte.toString(16);
			 wordToHexValue = wordToHexValue
					 + wordToHexValue_temp.substr(
							 wordToHexValue_temp.length - 2, 2);
		 }
		 return wordToHexValue;
	 };
 
	 var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
 
	 str = str.utf8_encode();
	 x = convertToWordArray(str);
	 a = 0x67452301;
	 b = 0xEFCDAB89;
	 c = 0x98BADCFE;
	 d = 0x10325476;
 
	 xl = x.length;
	 for (k = 0; k < xl; k += 16) {
		 AA = a;
		 BB = b;
		 CC = c;
		 DD = d;
		 a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		 d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		 c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		 b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		 a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		 d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		 c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		 b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		 a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		 d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		 c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		 b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		 a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		 d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		 c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		 b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		 a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		 d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		 c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		 b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		 a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		 d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		 c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		 b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		 a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		 d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		 c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		 b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		 a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		 d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		 c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		 b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		 a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		 d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		 c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		 b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		 a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		 d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		 c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		 b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		 a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		 d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		 c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		 b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		 a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		 d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		 c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		 b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		 a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		 d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		 c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		 b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		 a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		 d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		 c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		 b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		 a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		 d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		 c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		 b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		 a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		 d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		 c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		 b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		 a = addUnsigned(a, AA);
		 b = addUnsigned(b, BB);
		 c = addUnsigned(c, CC);
		 d = addUnsigned(d, DD);
	 }
 
	 var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
 
	 return temp.toLowerCase();
 };
 
 /**
  * let obj = {
  * 	item.name : 'apple',
  * 	item.num : 3,
  * 	total : 30
  * }
  * get item obj from obj by calling obj.at("item") 
  * @param {*} obj : obj to search by keypath
  * @param {*} key : key or keypath in obj
  * @returns mixed, value at keypath
  * @example
  * 	$.at({"item.name":'my',"item.num":3,total:30}, "item") 
  * 	=> {name:'apple', num:3}
  * @example
  * 	$.at({"item.name":'my',"item.num":3,"item.opts.key":'size',"item.opts.value":'large',total:30}, "item.opts")
  * 	=> {}
  */
 $.at = function(obj, key){
	 if(empty(obj) || empty(key)) return;
	 if(!$.isString(key)) return obj[key];
	 let kparts = key.split('.');
	 if(kparts.length>1) 
		 return $.at( $.at(obj, kparts.shift()) , kparts.join(".") );
	 let ks = Object.keys(obj).filter(k=>k==key || k.startsWith(`${key}.`));
	 if(empty(ks)) return;
	 else if(ks.length==1 && ks[0]==key) return obj[key];
	 else {
		 ks.sort();
		 let re = {};
		 for(let k of ks){
			 let o = re, ps = k.split('.'), v = obj[k];
			 for(let i=0,p;p=ps[i];i++)
				 o = o[p] = o[p] || (i>=ps.length-1 ? v : {});
		 }
		 return re[key];
	 }
 }
 /**
  * set data with keypath & value
  * @param {*} obj 
  * @param {*} key : keypath like a.b.c
  * @param {*} value : value to set, undefined means delete
  * @example $.set($this, "form.name", "my name") >> $this.form.name = "my name"
  */
 $.set = (obj, keypath, value)=>{
	 if(!$.isObject(obj) || empty(keypath) || !$.isString(keypath)) 
		 return elog("ERR:red", "$.set requires Object, String, value ");
	 let o = obj;
	 let ps = keypath.split(".")
	 ps.forEach((k, i)=>{
		 if(i>=ps.length-1) {
			 if(value===undefined) delete o[k];
			 else o[k] = value;
		 }else  o = o[k] = o[k] || {}
	 })
 }
 
 /**
  * eval template string to data (object/string...)
  * @param {string} key 
  * @param {*} data 
  * @param {*} opts 
  */
 $.eval = (key, data={}, opts={})=>{
	 let {pref} = opts;
	 if( pref && key === `{{${pref}}}` ) return data;
	 if($.isString(key) && key.match(/^\{\{.+\}\}$/)) {
		 key = key.replace(/[{}]/g,"")
		 if(key.startsWith('state.')) return $app.getState(key.replace(/^state\./,''));
		 let k = key.includes(".") ? key.replace(/^[^.]+\./, '') : key;
		 let da =  key.includes(".") ? ( key.startsWith("app.") ? window.$app.vars : data ) : (window.$this ? window.$this.vars : {});
		 return $.at(da||{}, k);
	 }else if($.isObject(key)){
		 let n = {};
		 Object.entries(data).forEach(([k,v])=>{
			 n[k] = ($.isString(v) && v.match(/^\{\{.+\}\}$/)) ? $.eval(v, data, opts) : v;
		 })
		 return n;
	 }
 }
 
 /**
  * eval str with {{var_name}} to evaluated string
  * @param {*} k : key or keypath with {{xxx}}
  * @param {*} data : { user:{...}, item:{...} } e.g.
  */
 $.evalString = (str,data={})=>{
	 if(!str||!$.isString(str))return str;
	 let ms = str.match(/\{\{([^}]+)\}\}/g);
	 if(!ms) return str;
	 ms.forEach(k=>{
		 let vk = k.replace(/[{}]/g,''); 
		 if(vk.startsWith('!')) return str = str.split(k).join(`{{${vk.replace('!','')}}}`);
		 let m = vk.match(/^([a-zA-Z_0-9]+)\./);
		 let v ;
		 if(m){
			 if(m[1]=='app') v = $app[vk.replace(/^[a-zA-Z_0-9]+\./,'')];
			 else v = $.at(data,vk) || (window.$this? $.at(window.$this.vars,vk) : '');
		 }else{
			 v = $.at(data,vk) || (window.$this ? (window.$this.vars || window.$this)[vk]  : '');
		 }
		 str = str.split(k).join(v||'');
		 // elog("KMV", vk, k, v, m&&m[1], data, $.at(data,vk), str);
	 })
	 return str;
 }
 
 /**
  * compile html code to Element
  * those code are not built with $e() function
  * <div loop="" items="varname">, <div if="">, <div on="">, 
  * @param {*} html :  html is from outside input, which are pure html code without using $e function, such like miniapp setting page html components or list.desc
  * @param {*} data 
  */
 $.compile = (html, data={}) => {
	 if(empty(html))return html;
	 let dummy = $div({html:html});
	 
	 //solve for
	 let es = [...dummy.find("for,[loop]")];
	 es.reverse(); //from bottom to top, from children to parent
	 es.forEach(el=>{
		 let loop = el.attr('loop'), as = el.attr('as') || 'e', index = el.attr('index') || 'i';
		 if(loop) {
			 if(!loop.match(/^\{\{.+\}\}$/)) 
				 return elog("ERR:red", '<for> tag needs loop="{{varName}}" or loop={{arrayName as item}}"');
			 let ss = loop.split(/\s+/);
			 ss.forEach((p,i)=>{
				 if(i==0) loop = p.replace(/[{}]/g,'');
				 if(i%2==0) return;
				 if(p=='as') as = ss[i+1];
				 if(p=='index') index = ss[i+1];
			 })
 
			 el.removeAttribute('loop');
			 
			 //get data
			 let da = $.at(data, loop) || (
				 loop.startsWith("$app.") ? 
					 $.at($app.vars, loop.replace("$app.","")) : 
					 $.at($this.vars, loop.replace("$this.","")) 
				 );
			 
			 //loop and eval
			 let srcs = [];
			 let lb = el.tagName=='FOR' ? el.innerHTML : el.outerHTML;
			 if(da && $.isObject(da)) da = Object.values(da);
			 if(da && $.isArray(da)){
				 da.forEach(e=>{
					 srcs.push($.evalString(lb, {[as]:e, [index]:index}));
				 })
			 }
			 let dm = $div(srcs.join("\n"));
 
			 //insert 
			 let la = el;
			 [...dm.children].forEach(ne=>{
				 ne.right(la);
				 la = ne;
			 })
			 
			 //remove el;
			 $.remove(el);
		 }
	 })
 
	 return [...dummy.children];	
 }
 
 /**
  * template string to Element
  * @param {*} html 
  * @param {*} data 
  * @param {*} opts 
  * @param {*} template : original <template> tag
  * 
  * @spec supported attributes
	 - on
	 - loop
	 - if
	 - 
  * 	
  */
 $.render = function(html, data, opts={}, template){
	 if(empty(html))return html;
	 
	 let dummy = $div();
	 let {pref, tmpl, idx, i, loop, key, keypath} = {...{idx:'i', i:0}, ...opts};
	 if($browser.name=="safari")//fix safari bug
		 html = html.replace(/&quot;[^%]+%7B%7B([a-zA-Z_0-9\.]+)%7D%7D&quot;/g, "{{$1}}")
	 dummy.innerHTML = html;
	 
	 //set children key-values with variables
	 dummy.find("*",node=>{
		 if(node.attr('parse')==='false') return;
		 if(node.tagName=='TEMPLATE'){
			 //evals this first
			 [...node.attributes].forEach(a=>{
				 let {name, value} = a;
				 if(!name.match(/\-\-/) && `${value}`.match(/\{\{.+\}\}/))
					 node.attr(name, $.eval(value, data, opts))
			 });
 
			 if(node.attr("if--conditions")){
				 let t = node.attr("tmpl");
				 let evs = $.get(t);
				 if(evs && $.isFunc(evs.if)){
					 let rs = evs.if(data, node);
					 if(rs) return node.render(data, {children:rs});
				 }
			 }else{
				 let lv = node.attr("loop--var"), da = data;
				 if(lv){
					 da = lv.startsWith("app.") ? window.$app : (lv.startsWith(`${pref}.`) ? data : window.$this);
					 if(da) da = $.at(da.vars||da, lv.replace(/^[^.]+\./, ''))
				 }
				 return node.render(da, opts)
			 }
			 return;
		 }else{
			 if(node.attr("v--keypath") && pref){
				 let scope = node.attr("v--scope"), vk = node.getAttribute(`var--${pref}`), vv = vk?node.data(vk):false;
				 vv = vv? vv.replace(/\{\{[^\}]+\}\}/,data[node.attr("v--keypath")]): data[node.attr("v--keypath")];
				 if(scope && vk && node[scope] && vv) node[scope][vk] = vv;
				 else node.attr( vk || 'innerHTML' , data[node.attr("v--keypath")] );
			 }
		 }
			 
		 //settle tagname is variable
		 if(node.tagName == 'TAG'){
			 let fn = node.getAttribute('tag--name');
			 let va = node.getAttribute('tag--var');
			 fn = fn ? $.eval(fn, data, {pref:pref}) : fn;
			 va = va ? $.eval(va, data, {pref:pref}) : va;
			 if(!fn) return;
			 fn = fn.startsWith("$") ? fn: `$${fn}`;	
			 if($.isFunc(window[fn])) window[fn](va).right(node);
		 }
 
		 //original properties
		 let attrs = [];
		 let hk = node.attr("format--html") || node.innerHTML;
		 if(empty(node.children) && hk && `${hk}`.match(/\{\{.+\}\}/)) //solve innerHTML
			 attrs.push({name:'innerHTML', value:hk});	
		 ['value', 'src'].forEach(k=>{
			 if(!empty(node[k]) && `${node[k]}`.match(/\{\{.+\}\}/)) 
				 attrs.push({name:k, value:node[k]});
		 });
		 
 
		 //custom properties
		 [...node.attributes].forEach(a=>{
			 let {name, value} = a;
			 if(name == 'on') {
				 node.attr("on", $.unserialize(value));
			 }
 
			 if(name.match(/^on\-+/) && !empty(value)){
				 node.on(name.replace(/^on\-+/,''), value, window.$this, node);
			 }
 
			 if(!name.match(/\-\-/) && `${value}`.match(/\{\{.+\}\}/))
				 attrs.push({name:name, value:value});
 
			 //prevent override rendered contents again
			 if(name.match(/\-\-/) && loop && !['on','if','tmpl'].includes(name.split("--")[0])){
				 node.removeAttribute(name);
			 }
		 });
 
 
		 attrs.forEach(({name, value})=>{
			 value = value.replace(/\{\{(.+?)\}\}/g, (m, k)=>{
				 let v = $.evalString(m, empty(pref) ? {...data, [idx]:i}: {[pref]:data, [idx]:i});
				 return (v || v==='0' || v===0) ? v+"":"";
			 });
			 node.attr(['innerhtml','textcontent'].includes(name)?'html':name, value);
		 })
 
		 //set template events
		 let tid = node.attr("tmpl--id") || node.attr("tmpl");
		 let evs = $.get(tid) || [];
		 // elog("EVS:purple", evs);
		 for(let ev in evs){
			 if($.isFunc(evs[ev])){
				 ev = ev.replace("@","");
				 node.removeAttribute(`on--${ev}`)
				 if(ev=='loaded'){
					 evs[ev]({target:node, data:data, pref:pref});
				 }else{
					 node.addEventListener(ev, evs[ev])
				 }
			 }
		 }
		 
		 if(tmpl && !node.attr("tmpl--id")) 
			 node.attr('tmpl--id', tmpl)
	 });
	 
	 dummy.find("tag, template").remove();
 
	 return [...dummy.children]
 }
 
 /**
  * set vars in attr()/css() to element for parser
  * @param {*} el 
  * @param {*} k 
  * @param {*} v 
  * @returns 
  */
 $.setVars = (el,k,v,pref)=>{
	 if([false,'false'].includes(el.parse)) return;
	 if(!$.isString(k) || !$.isString(v)) return;
	 // solve vars
	 let ms = `${v||''}`.match(/\{\{([^}]+)\}\}/g);
	 if(ms){	
		 ms.forEach(m=>{
			 if(m.includes(" ")) return;
			 let kns = m.replace(/\{app\./,'{app__').replace(/[{}]/g, '').split(".");
			 if(kns[0] && `${kns[0]}`.match(/^[a-zA-Z0-9_.]+$/)){
				 el.setAttribute(`var--${kns[0]}`,k)
				 if(pref) el.setAttribute(`v--scope`,pref)
				 if(kns[1])
					 el.setAttribute('v--keypath', kns.slice(1).join(".") )
			 }
		 })
		 el.setAttribute( k=='innerHTML'? `format--html`:`data-${k}`, v );
		 el[k] = $.evalString(v);
		 return el;
	 }
 }
 
 const __eventMap = new WeakMap();
 
 /**
  * common func of $app.setState / $this.setState
  * key path supported
  * data is saved as {
  * 	cart.item.title : 'My title',
  *  cart.item.price : 23840,
  *  cart.num : 1,
  *  address.consignee : 'my name'
  * }
  * you can get data with 
  * $app.getState("cart") to get cart as object
  * 
  * 
  * 
  * @param {*} state 
  * @param {*} delegate 
  */
 $.setState = async function(state, delegate){
	 if($.isString(state)){
		 if(arguments.length>=3 && arguments[1]!==undefined){
			 state = {[arguments[0]]:arguments[1]};
			 delegate = arguments[2];
		 }else return;
	 }
	 elog("STATE:green",state);
	 delegate = delegate || window.$this || window.$app;
	 let data = delegate.__state = delegate.__state||{};
	 let target = delegate.layer || document.body;
	 if(typeof state === 'function') {
		 state = state(data);
		 if(typeof state.then === 'function') {
			 state = await state;
		 }
	 }
	 Object.assign(data, state);
	 for(let [key, value] of Object.entries(state)){
		 target.find(`[data-state="${key}"]`,el=>{
			 $.updateState(el, delegate);
		 });
		 target.find(`input[state_key="${key}"],textarea[state_key="${key}"]`,el=>{
			 if(document.activeElement !== el)
				 el.value = value;
		 })
		 //set state to outer html element for css 
		 if(target && !$.isObject(value) && !$.isArray(value)) 
			 target.attr(`state-${key}`, value);
	 }
	 return data;
 }
 
 $.pushState = (k, v, delegate)=>{
	 let s = $.getState(k, delegate);
	 if(!$.isArray(s)) s = s!==undefined? [s] : [];
	 s.push(v);
	 $.setState({[k]:s},delegate);
 }
 
 /**
  * remmove key from state
  * OR remove elements from state array
  * @param k : string or string ends with [] (array)
  * @param v : int(index of array), object (element to delete), string (element to delete from arr)
  * @param delegate : $app or $this
  * 
  * @example remove a key : 
  * 		$app.deleteState("myKey");
  * @example remove an element from array by index: 
  * 		$app.deleteState("myKey[]", 1); //remove 2nd elements
  * @example remove an element from array by string value : 
  * 		$app.deleteState("myKey[]", "a");// ["a","b"] > ["b"]
  * @example remove an element from array by object value: 
  * 		$app.deleteState("myKey[]", {a:1});// [{a:1},{b:2}] > [{b:2}]
  */
 $.deleteState = async function (k, delegate) {
	 if(empty(k)) return false;
	 let v;
	 if(arguments.length>=3 || (delegate&&!$.isObject(delegate))){
		 v = arguments[1];
		 delegate = arguments[2];
	 }
	 delegate = delegate || window.$this || window.$app;
	 delegate.__state = delegate.__state||{};
	 if(`${k}`.match(/\[\]$/)) {//remove from array
		 k = k.replace(/\[\]/,'');
		 if(v===undefined) return $.deleteState(k, delegate);
		 let s = $.getState(k, delegate);
		 if(!$.isArray(s)) s = [s];
		 if($.isNumber(v)) s.splice(v,1);
		 else s = s.filter(e=>typeof e==typeof v&&typeof v=='object'?JSON.stringify(e)!=JSON.stringify(v):e!=v);
		 $.setState({[k]:s},delegate);
	 }else
		 delete delegate.__state[k];
 }
 
 $.initState = (target, delegate)=>{
	 delegate = delegate || window.$this || window.$app;
	 const config = { attributes: true, childList: true, subtree: true };
	 const callback = function(mutationsList, observer) {
		 mutationsList.forEach(mutation => {
			 if (mutation.type === 'childList') {
				 mutation.addedNodes.forEach(node => {
					 if(node.tagName) {
						 const name = node.getAttribute('data-state');
						 if(name) {
							 $.updateState(node,delegate);
						 }
						 [...node.querySelectorAll('[data-state]')].forEach(e => {
							 const name = e.getAttribute('data-state');
							 if(name) {
								 $.updateState(e,delegate);
							 }
						 })
					 }
				 })
			 } else if (mutation.type === 'attributes') {
				 if(mutation.attributeName === 'data-state') {
					 $.updateState(mutation.target,delegate);
				 }
			 }
		 });
	 };
	 const observer = new MutationObserver(callback);
	 observer.observe(target, config);
 }
 $.updateState = (el, delegate)=>{
	 delegate = delegate || window.$this || window.$app;
	 if(el && el.tagName) {
		 delegate.__state = delegate.__state||{};
		 const va = $.getState(el.attr('data-state'),delegate);
		 const events = __eventMap.get(el);
		 if(events && events['state']) {
			 if(typeof va !== 'undefined')
				 el.dispatchEvent(new CustomEvent('state', {detail: va}));
		 } else if(typeof va!== 'undefined'){
			 el.innerText = va.toString();
		 }
	 }
 }
 
 /**
  * 
  * @param {*} key 
  * @param {*} delegate : $app or $this
  */
 $.getState = (key, delegate)=>{
	 delegate = delegate || window.$this || window.$app;
	 delegate.__state = delegate.__state||{};
	 if(empty(key)) return;
	 if(key.match(/\[\]/)) key = key.replace(/\[\]/, '');
	 return $.at(delegate.__state,key);
 }
 
 const _log = (function () {
	 var Log = Error; // does this do anything?  proper inheritance...?
	 Log.prototype.write = function (args) {
		 var suffix = {
			 "@": (this.lineNumber
					 ? this.fileName + ':' + this.lineNumber + ":1" // add arbitrary column value for chrome linking
					 : extractLineNumberFromStack(this.stack)
			 )
		 };
		 args = args.concat([suffix]);
		 if (console && console.log) {
			 if (console.log.apply) { console.log.apply(console, args); } else { console.log(args); } 
		 }
	 };
	 var extractLineNumberFromStack = function (stack) {
		 if(!stack) return '?'; // fix undefined issue reported by @sigod
		 // correct line number according to how Log().write implemented
		 var line = stack.split('\n')[2];
		 // fix for various display text
		 line = (line.indexOf(' (') >= 0
			 ? line.split(' (')[1].substring(0, line.length - 1)
			 : line.split('at ')[1]
			 );
		 return line;
	 };
 
	 return function (params) {
		 if(!$conf.mode.match(/(test|demo|develop)/i))return;
		 Log().write(Array.prototype.slice.call(arguments, 0));
	 };
 })();
 
 /**
  * 
  * @param {*} tag : tagname+color 
  * @example elog("ERR:red", e.getMessage())
  */
 var elog_filters = [];
 const elog = function(tag, msg){
	 if(!elog.server && (!$conf||!$conf.mode.match(/(test|local|staging|demo|develop)/i)))return;
	 let ts = $.isString(tag)? tag.split(":") : ['LOG', '#5F5BFF'];
	 let color = ts[1] || "#5F5BFF";
	 let chk = elog.check(ts[0])
	 if(!chk) return;
	 console.log(`%c${ts[0]}`, `background:${color};color:white;padding: 2px 8px;border-radius:4px;`, ...[...arguments].slice(1), (Error().stack.split("\n")[2]||'lines-unknown').replace(/^\s+at\s/,'@'));
 }
 elog.init = ()=>{
	 let ex = $cache.get('ELOG-FILTERS');
	 if(!empty(ex)) elog_filters = ex.split(",");
 }
 elog.reset = ()=>{
	 $cache.del('ELOG-FILTERS');
	 elog_filters = [];
 }
 elog.check = (k)=>{let x = new RegExp(`^${k}[.*-]*`,'i'); return !elog_filters.find(kk=>kk.match(x));}
 elog.on = (k)=> {
	 let x = new RegExp(`${k}[.*-]*`,'i'); elog_filters = elog_filters.filter(kk=>kk.match(x));
	 $cache.set('ELOG-FILTERS', elog_filters.join(","))
 };
 elog.off = (k)=> {k=k.split(":")[0];if(elog.check(k)) elog_filters.push(k);$cache.set('ELOG-FILTERS', elog_filters.join(","))}
 elog.pop = (logs, title)=>{
	 logs = $.isArray(logs) ? logs : [logs]
	 $pop(`elog-popup-${title}`, $ul({class:'elogs'},
		 [
			 $li({class:'title',html:title},),
			 ... logs.map(l=>$li([
				 $h4(`${l.label} ${l.location}`),
				 $code($.isObject(l.msg)?hljs.highlight('json', JSON.stringify(l.msg)).value : l.msg+'')
			 ]))
		 ]
	 ))
 }
 
 var $app = {
	 status : "normal",
	 viewIdx : 1,
	 views : [],
	 legacy : false, //check if its old system
	 hashData : null,//data for view transition
	 __state : {},
	 start : function(start_view){
		 if($app.status=="stopped")
			 throw new Error("This app has been stopped for some reason.");
		 var ac = window.location.href.split("#")[1];
		 elog.init();
		 // fixed: 
		 // LINE's LIFF: Auto add "#access_token=XXXXXX&context_token=XXXX"
		 if(ac) {
			 if(ac.indexOf("access_token=")>=0) ac = '';
			 else if(ac.startsWith('/')){
				 let ps = ac.substring(1).split("/");
				 if(!empty(ps[0])){
					 ac = ps[0].replace(/\-/g,'_')+"_view"
					 let state = $cache.get('last-history-state');
					 if(state) $app.start_params = JSON.parse(state);
				 }
			 }else if(ac.startsWith('!')){//shortcut url
				 $app.start_params = {};
				 ac = $app.decodeShortcutURL(ac, $app.start_params);
				 // console.log("DECODE-VIEW", ac, $app.start_params);
				 // ac=false;
			 }
		 }
		 $app.css_rules = $e('style',{id:'runtime-rules'},document.head);
		 $app.page_prefix = new Date().getTime()+"_";//for localStorage conflict
		 $app.start_view = ac||($.isString(start_view)?start_view:$conf.default_view);
		 if(!$app.start_view){
			 if($app.onError)$app.onError("no_start_view_error");
			 throw new Error("No start view");
		 }
		 $conf.modules=$conf.modules||[];
		 $conf.view_path=$conf.view_path||'/js/views/';
		 if($app.onLoadView) $app.onLoadView($app.start_view)
		 if(!window[$app.start_view])$conf.modules.push($conf.view_path+$app.start_view);
		 $conf.lib_path=$conf.lib_path||'/js/';
		 $app.legacy = $conf.modules.indexOf("any.legacy")>=0;
		 //preload
		 var images = $conf.preload_images?$conf.preload_images:[];
		 var load = $conf.modules.length+images.length, loaded=0;
		 if(!load)
			 return $app.preloaded();
		 var step = function(){
			 loaded++;
			 var progress = parseInt(loaded*100/load);
			 if($app.onLoadProgress)
				 $app.onLoadProgress(progress);
			 if(loaded>=load)
				 $app.preloaded();
		 }; 
		 for(var i=0,m;m=$conf.modules[i];i++)
			 $.include(m, step, m);
		 if(images.length>0)
			 $.preload(images, step, step);
 
		 // Observer state changes
		 // if($app.useState) {
			 $.initState(document.body, $app);
		 // }
	 },
	 stop : function(){
		 $app.status = "stopped";
		 $("body > article.layer", function(a){a.parentNode.removeChild(a);})
		 $("body > main.layer", function(a){a.parentNode.removeChild(a);})
	 },
	 preloaded : function(){
		 $app.onLoad=$app.onLoad||$app.onload;
		 if($app.onLoad) $app.onLoad();
		 else $app.loaded();
	 },
	 loaded : function(){
		 $app.status = "loaded";
		 $app.hash = window.location.hash;
		 if($browser.mobile && $browser.statusbar) document.body.addClass('with-statusbar');
		 if($browser.mobile && $browser.toolbar) document.body.addClass('with-toolbar');
		 // $app.views.push($app.start_view);
		 $app = $observe($app,{},{scope:'app'});
		 window.addEventListener('popstate',$app.onUrlChanged);
		 $app.openView($app.start_view,$app.start_params||{});
 
	 },
	 onMessage : function(type, data){
		 switch(type){
			 case "view-stop":
				 return $app.stop();
			 // case "view-loaded":
			 // 	return $app.drawView($this);
			 case "view-close":
				 return $app.closeView($this,data);
			 default:
				 break;
		 }
	 },
	 trans : function(e){
		 var url = this.getAttribute("url");
		 e = e||window.event;
		 e.stopPropagation();
		 $app.openUrl(url);
	 },
	 onUrlChanged : function(e) {
		 let state = e.state || {view:$app.start_view};
		 elog('HISTORY:red', state, location.hash, $app.hash);
		 // location.reload();
		 let {view} = state;
		 // ['view','short','path'].forEach(k=>delete state[k])
		 $cache.set('last-history-state', JSON.stringify(state.data));
		 if($app.views.includes(view)){//back
			 $app.views.pop();
			 if(empty($app.views)){//prevent jump to other site
				 history.pushState(state, T(view), $conf.encrypt_url===false ? state.path : state.encrypt);
			 }
			 $app.historyView = window[view];
			 $app.closeView($this, state.data) 
		 }else{//forword ??
			 $app.openView(view, state)
		 }
	 },
	 openUrl : function(url) {
		 if(url && $.isString(url) && url.trim().length>0){
			 if(url.indexOf("http:")==0 || url.indexOf("https:")==0){
				 return location.href = url;
			 }else{//init view 
				 $app.openView(url,{},url.match(/@\?*/));
			 }
		 }else{
			 if($app.onError)$app.onError("unsupported_url_type_error",{url:url});
			 throw new Error("ERROR : $app.openView requires string type url");
		 }
	 },
	 /**
	  * build a shortcut url for a certain view with params
	  * @param {*} view : view name
	  * @param {*} params : params send to View.onLoad
	  */
	 encodeShortcutURL : function(view,params){
		 //build query 
		 var q = view+'?'+$.serialize(params||{});
		 // return '#!'+$.rand(1,9)+btoa(q);
		 return '#!'+$.rand(1,9)+btoa(encodeURIComponent(q));
	 },
	 decodeShortcutURL : function(code, params){
		 if(!code || !`${code}`.match(/^!/))return false;
		 try{
			 var c = decodeURIComponent(atob(code.substring(2)));
			 var [v,p] = c.split("?");
			 if(params && !empty(p)) {
				 p = $.unserialize(p);
				 for(let k in p){
					 params[k] = p[k];
				 }
			 }
			 return v;
		 }catch(e){
			 return false;
		 }
	 },
	 /**
	  * view transition logics
	  *
	  * #init
	  * start $app.onUrlChanged to listen URL hash change info.
	  *
	  * #manually open view
	  * A : if transition
	  * 	1 : create dummy <A> with url
	  * 	2 : fire click event against this <A>
	  * 	3 : url will be changed (by browser)
	  * 	4 : $app.onUrlChanged will do the rest things
	  *
	  * B : no transition 
	  *  1 : solve view name, params, opener
	  *  2 : handle onInactive of opener
	  *  3 : extend target view controller, if its not inited
	  *  4 : target view.onLoad
	  *  5 : target.loaded
	  *  6 : target.drawHeader
	  *  7 : target.drawContent
	  *  8 : target.drawFooter
	  * 
	  * @param  {[type]} !noTrans [whether appends anchor url (#name_of_the_view) to current one]
	  */
	 openView : async function(url, args, opts, included){
		 
		 if(!url)return;
		 var vname = url;
 
		 //solve opts
		 opts = opts===true || opts===false ? {popup : opts} : (opts||{});
		 let {popup} = opts;
		 if(popup && !opts.style) opts.style = 'popup';
 
		 // //solve remove url or object
		 // if($.isString(url)){
		 // 	vname = url.split("?")[0];
		 // 	if($app.onLoadView) $app.onLoadView(vname)
		 // 	if(!included&&!window[vname] && !$(`script#${vname.split('.').join('_')}`).length){
		 // 		var surf = $conf.mode=='Product'?'':"?ver="+(new Date().getTime());
		 // 		return $.include(($conf.view_path||'/js/')+vname+".js"+surf,$app.openView,url,args,popup,true)
		 // 	}
		 // }else if($.isObject(url)){
		 // 	vname = url.name;
		 // }
		 
		 let noUpdateState = ['line','fb'].includes($conf.oname);
		 if(!popup){//view transition
			 let canTrans = ($this && $this.onTransition)?$this.onTransition.call($this,url,args,false):true;
			 if(canTrans===false)return;
			 $app.targetView = vname;
			 $app.closeView($this);
			 $app.hashData = args||{};
			 if(!noUpdateState) {
				 let path = `${location.origin}${location.pathname.endsWith('/')?location.pathname:location.pathname+'/'}#/${vname.replace(/_view$/,'').replace(/_/g,'-')}`;
				 let state = {data:args||{}, view:vname, path:path, encrypt:$app.encodeShortcutURL(vname,$app.hashData), cid:$app.views.length};
				 elog("HISTORY:orange", state, state.view, $app.views)
				 history.pushState(state, T(vname), $conf.encrypt_url===false ? path : state.encrypt);
				 $cache.set('last-history-state', JSON.stringify(state.data));
			 }
			 $app.views.push(vname);
		 }
 
		 let params = $.extend(args||{} , $.isString(url) && $.unserialize(url)||{} );
		 
		 $controller(vname,params,{popup});
		 
		 /*
		 let view = await $app.initView($.isObject(url)? url : vname)
 
		 if(popup){
			 window.$parent = $this;
			 view.isPopup = true;
			 $.send($parent, "inactive");
		 }
		 view.params = params||{};
		 view.options = opts;
		 $this = view;
		 $this.onLoad = $this.onLoad || $this.onload;
		 if($this.super && $this.super.onLoad)
			 $this.super.onLoad.call($this,params);
		 if($this.onLoad)
			 $this.onLoad.call($this,params);
		 else
			 $this.loaded.call($this);//$controller.loaded
		 */
	 },
	 /**
	  * open a view as a subview under another view controller
	  * @param  {[type]} view_name [description]
	  * @param  {[type]} params    [description]
	  * @param  {[type]} header    [description]
	  * @param  {[type]} content   [description]
	  * @param  {[type]} footer    [description]
	  * @param  {[type]} layer     [description]
	  * @return {[type]}           [description]
	  */
	 openSubview : async function(view_name, params, header, content, footer, changeRoot=false){
		 
		 $controller(view_name, params, {popup:true, header, content, footer, parentView:$this?$this.name:false})
 
		 // var v = view_name;
		 // if($.isString(view_name)){
		 // 	var vname = view_name.replace(/[#@\?].*/,'');
		 // 	v = window[vname];
		 // 	if(!v&&!$(`script#${vname.split('.').join('_')}`).length){
		 // 		var surf = $conf.mode=='Product'?'':"?ver="+(new Date().getTime());
		 // 		return $.include(($conf.view_path||'/js/')+vname+".js"+surf,$app.openSubview,view_name,params,header,content,footer,changeRoot);
		 // 	}
		 // }
		 // if(!v)return;
		 // v.parentView = $this?$this.name:null;
		 // window.$parent = $this;
		 // if(!v.close || !v.loaded){
		 // 	$.extend(v, $controller);
		 // 	v.__state = {};
		 // 	await $app.extendSuperView(v);
		 // }
 
		 // if(!v.observer){//not inited
		 // 	window[v.name] = v.observer = $observe(v,params);
		 // 	//TODO reset observer
		 // }
		 // let observer = v.observer;
		 // if(changeRoot) $this = observer;
		 // else $child = observer;
		 // if(header){observer.header=header}
		 // else if(header===false){observer.noHeader=true;}
		 // if(content){content.innerHTML="";observer.content=content;observer.layer=content.parentNode}
		 // if(footer){observer.footer=footer;}
		 // else if(footer===false){observer.noFooter=true;}
		 // observer.params = params || {};
		 // //$this = v;
		 // if(observer.onLoad) {	
		 // 	observer.onLoad.call(observer, params);
		 // }else{
		 // 	observer.render.call(observer, header, content, footer, observer.layer);
		 // }
	 },
	 openPopup : async function(view_name, params){
		 // $app.popups = $app.popups || [];
		 //make dom frame
		 let h,c,f,dom = $article({class:view_name},[h=$header(),c=$main(),f=$footer()],document.body).addClass('hidden');
		 //opensubview
		 await $app.openSubview(view_name, params, h, c, f);
		 let v = window[view_name];
		 if(v.noHeader) $.remove(h);
		 if(v.noFooter) $.remove(f);
		 return $pop(view_name, dom.removeClass('hidden'));
	 },
	 drawView : function(view){
		 if(!view) return; //FIXME
		 // if(!view.isPopup)
		 // 	// $app.hideOthers(view);
		 // view.render.call(view, $app.viewIdx++);
	 },
	 closeView : function(view,data){
		 if(!view) return;
		 if(view.onClose)
			 view.onClose();
		 
		 if(window.$parent){
			 $.send($parent,'subview-close', {subview:view.name, view:$parent.name, data:data});
			 $.send($parent,'active', {subview:view.name, view:$parent.name, data:data});
			 delete window.$parent;
		 }
 
		 if(view.layer){
			 $.remove(view.layer);
		 }
 
		 if(!$app.taretView){
			 $this = $app.historyView || window[$app.start_view];
			 if($this.layer) {
				 if(!$this.layer.parentNode)
				 document.body.append($this.layer)
				 $this.layer.show();
				 var oa = $this.onActive||$app.onActive;
				 if(oa){
					 oa.call($this,view,data);
				 }
				 delete $app.historyView;
			 }
		 }
		 
	 },
 
	 // hideOthers : function(view){
	 // 	for(var i=0;i<$app.views.length;i++){
	 // 		var v = window[$app.views[i]];
	 // 		if($app.views[i]!=view.name && v && v.layer)
	 // 			//console.log("hide:",v.layer);
	 // 			v.layer.hide();
	 // 	}
	 // },
 
	 initView : async function(view){
		 if($app.onLoadView) $app.onLoadView(view)
		 if($.isString(view))
			 view = window[view];
		 if(!view){
			 if($app.onError)$app.onError("view_not_exists_error", {name:view});
			 throw new Error(`Error :no view(${view}) to enhance`);
		 }
		 var vname = view.name;
		 if(view && (!view.close || !view.loaded)){
			 view.name = view.name|| vname;
			 view = $.extend(view, $controller);
			 view.__state = {};
			 view = await $app.extendSuperView(view,true);
			 if(!view.observer)
				 window[vname] = view.observer = $observe(view, {})
		 }
		 return window[vname];
	 },
 
	 callView : async function(to_view,msg,data){
		 let view = await $app.initView(to_view);
		 if(view && $.isFunc(view.onMessage)){
			 view.onMessage.call(view,msg,data);
		 }
	 },
 
	 extendSuperView : async (v, setSuper=false)=>{
		 const exts = ['drawHeader','drawContent','drawFooter','onRender','onLoad'];
		 if($.isString(v.extend)){
			 if($.isObject(window[v.extend]))
				 $.extend(v, window[v.extend],exts);
			 else{
				 let fn = `${($conf.view_path||'/js/')}${v.extend}.js`;
				 await $.includes([fn]).catch(e=>{elog("ERR:red", `failed to load ${v.extend}.js`)})
				 if(window[v.extend]){
					 $.extend(v, window[v.extend],exts)
				 }
			 }
			 if(setSuper) v.super = window[v.extend]
		 }
		 return v;
	 },
 
	 onRuntimeEvent : (tmpl, event, data, el) => {
		 
	 },
 
	 setState: async function(state) {return $.setState.apply($app,[...arguments].concat($app))},
	 getState: (key)=>{return $.getState(key, $app)},
	 updateState: (el)=>{return $.updateState(el, $app)},
	 pushState: (k,v)=>{return $.pushState(k,v,$app)},
	 deleteState: function(k){return $.deleteState.apply($app,[...arguments].concat($app))},
 
 };
 
 
 /***
  a state listener
  
  * every compnent/view/app can have a state (data) 
  * can be access as $state in namescope
  # Observer
	  when state changes it will , listen to the changes , and ...
	  * notice the host such like $this by $.send(host, 'change')
	 * udpate related html tags
  # Reset 
	 can `reset` when open a new view or the space of a new component
	 * it will $.send(host, "reset")
  # Keypath
	  * get / set support (.) keypath
  * 
  */
 const $observe = function(host, data={}, opts={scope : 'view'}){
	 //init data
	 let vars = {
		 vars : data || {},
		 doms : {},
		 funcs : {}
	 };
	 let {scope} = opts;
	 let attrobs = {};
	 let layer;
 
	 const update_doms = (k, v)=>{
		 // var dom = vars.doms.layer || (scope == 'view' && window.$this ? $this.layer : document.body);
		 dom = layer || document.body;
		 // elog('DOM:red',dom)
		 if(!dom || empty(k)) return;
		 k = scope!='view' ? `${scope}__${k}` : k;
		 let kk = k.split(".")[0];
		 let ds = dom.find(`*[var--${kk}], *[var--${k.replace(/\./g, '\\.')}], *[filter--${kk}], *[if--${kk}], *[if--func], *[loop--var="${kk}"], *[loop--var^="${kk}."], *[loop--from="${kk}"], *[loop--to="${kk}"]`, (el)=>{
			 // elog("update_doms:teal",k,v,el)
			 let vw = el.views()[0] || {};
			 if(el.attr('parse')==='false') return;
			 if(el.getAttribute(`loop--var`)==k){
				 if($.isArray(v)) el.render(v,{key:kk, keypath:k})
			 }else if(el.getAttribute(`loop--var`) && el.getAttribute(`loop--var`).startsWith(`${kk}\.`)){
				 let vn = el.getAttribute(`loop--var`);
				 if(kk!=k && vn!=k) return;
				 let vs = vn.replace(/^[^\.]+\./,'');
				 vs = v[vs] || [];
				 el.render(vs,{pref:k});
				 $.send(el,'update',k,v)
			 }else if(el.getAttribute(`loop--from`)==k||el.getAttribute(`loop--to`)==k){
				 if($.isNumber(v)) el.render(v)
			 }else if(el.hasAttribute(`filter--${kk}`)){
				 el.checkFilter(k,v);
			 }else if(el.hasAttribute(`if--${kk}`)||el.hasAttribute(`if--func`)){
				 el.checkIf(k,v);
			 }else{
				 if($.isString(v) || $.isNumber(v) || !v){
					 let updk = el.getAttribute(`var--${k}`) || el.getAttribute(`var--${kk}`) || 'innerHTML';
					 let format = el.getAttribute(updk=='innerHTML' ? 'format--html' : `format--${updk}`) || `{{${updk}}}`;
					 el.attr( updk , $.evalString(format, vw?vw.vars:{}) );
				 }else if($.isArray(v) || $.isObject(v)){
					 if(el.tagName!='TEMPLATE'){
						 if(el.attr("v--keypath")){
							 let scope = el.attr("v--scope"), vk = el.getAttribute(`var--${kk}`), vv = vk?el.data(vk):false;
							 // elog("SCO:green", v[el.attr("v--keypath")], v)
							 vv = vv? vv.replace(/\{\{[^\}]+\}\}/,v[el.attr("v--keypath")]): v[el.attr("v--keypath")];
							 // elog("SCO:red", scope, el, v[el.attr("v--keypath")], vv)
							 if(scope && vk && el[scope] && vv) el[scope][vk] = vv;
							 else el.attr( vk || 'innerHTML' , v[el.attr("v--keypath")] );
						 }
					 }else {
						 el.render(v,{pref:k});
						 $.send(el,'update',k,v)
					 }
				 }
				 if(el.hasAttribute("on--update")) {
					 let ev = new CustomEvent('update', {detail : {key:k, data:v, target:el}});
					 el.dispatchEvent(ev)
				 }
			 }
		 })
		 // elog("DS:red", ds);
		 if(($.isString(v) && v.length<32) || $.isNumber(v))
			 dom.attr(k, v)
	 }
 
	 //observer for attributes : this.form.title = blah
	 const attribute_observer = {
		 get(target, key, receiver) {
			 if (key === Symbol.iterator)
				 return target[Symbol.iterator].bind(target);
			 else
				 return Reflect.get(target, key, receiver);
		 },
		 set(o, k, v){
			 o[k] = v;
			 // elog("SUB-SET:red", o)
			 update_doms(`${o.__path}.${k}`,v)
		 },
		 deleteProperty(obj,k){
			 delete o[k];
			 // elog("SUB-DEL:red", o)
			 update_doms(`${o.__path}.${k}`,'')
		 }
	 }
 
	 const observer = {
		 get : function(obj, k, receiver){//with keypath (.) support, getter
			 if(!$.isString(k)) return Reflect.get(...arguments);
			 // elog("GET:teal",obj.name,k)
			 if(k.startsWith("__")) return $.at(host,k);
			 if(['vars','doms','funcs'].includes(k))
				 return vars[k];
			 return k.includes('.') ? $.at(vars.vars,k) :
				 vars.vars[k]!==undefined?vars.vars[k] : vars.doms[k]!==undefined?vars.doms[k] : vars.funcs[k]!==undefined?vars.funcs[k] : Reflect.get(...arguments);
		 },
		 set : function(obj, k, v){//setter
			 // elog("SET:red",k,v)
			 if(k==='vars') return true;
			 if(k==='observer') {
				 if(v instanceof $observe) host.observer=v;
				 else return true;
			 }
			 if(k=="layer" && $.isElement(v)) layer = v;
			 if($.isString(k) && k.startsWith("__")) return host[k] = v;
			 ['vars','doms','funcs'].forEach(f=>delete vars[f][k]); // delete old val
			 if($.isElement(v)) vars.doms[k] = v;
			 else if($.isFunc(v)) vars.funcs[k] = v;
			 else {
				 // elog("SET:teal",`${obj.name}.${k}=`,v)
				 let k0 = k.split(".")[0];
				 let rtv = host.__runtime ? $.at(host.__runtime,k0) : false;
				 v = rtv ? ($.isObject(v) ? {...v, ...rtv} : rtv) : v;
				 if(host.__runtime) $.set(host.__runtime,k0,undefined);//remove from runtime
				 // vars.vars[k] = $.isObject(v) ? new Proxy({...v, __path:k}, attribute_observer) : v;
				 vars.vars[k] = v;
				 if( ['rendering','rendered'].includes(host.__status) ){
					 //update Elements with var=k
					 update_doms(k,v)
				 }
					 
			 }
			 $.send(host, "change", k, v);
			 return true;
		 },
		 deleteProperty : function(obj,k){
			 // elog("DEL:red",obj.name,k)
			 if(k==='vars') return;
			 if(k==='observer') return;
			 delete vars.vars[k];
			 delete vars.doms[k];
			 delete vars.funcs[k];
			 $.send(host, "change", k, undefined);
			 update_doms(k, undefined)
		 }
	 }
 
	 this.reset = ()=>{
		 vars = {};
		 $.send(host, "reset")
	 }
 
	 return new Proxy(host, observer);
 }
 
 
 /**
  * use view as subview, base class of controller
  * @param {*} vname 
  * @param {*} params 
  * @param {*} opts 
  * @returns DOM  
  * @example
  * $div({class:"my-class"}, [
  *     $view('my_test_view', {title: "my title"}),
  *     $p("my text ....")
  * ])
  * 
  * const my_test_view={
  * 	   draw(w){
  *         $p(this.params.title, w)
  * 		   $div("{{varname}}")
  *     }
  * }
  */
 const $view = function(vname, params, opts={}){
	 const idx = $app.viewIdx++;
	 const layer = View.createLayout(vname, idx);
	 if($this){
		 $this.__loading = $this.__loading || {};
		 $this.__loading[`${idx}`]=1;
	 }
	 View.factory(vname, params, {...opts,layer,idx})
	 .then(view=>{//load view file & init view object 
		 $app.__views[`${idx}`] = view;
		 if(view.super && view.super.onLoad)
			 view.super.onLoad.call(view,view.params);
		 view.onLoad.call(view,params);
	 })
	 return layer;
 }
 
 class View{
	 static async factory(vname, params={}, opts={}){
		 $app.__wrappers = $app.__wrappers || {}
		 let o;
		 if($.isString(vname)){
			 if(!$.exists(vname) && !$(`script#${vname.split('.').join('_')}`).length){
				 var suf = $conf.mode=='Product'?'':"?ver="+(new Date().getTime());
				 await $.includes([($conf.view_path||'/js/')+vname+".js"+suf]);
				 $app.__wrappers[vname] = $.reflect(vname);
			 }
			 o = $.reflect(vname);
			 if(!o){
				 if(opts.idx && $this && $this.__loading)
					 delete $this.__loading[`${opts.idx}`]
				 if($app.onError)$app.onError("view_not_exists_error", {name:vname});
				 return false;
			 }
			 if(!$app.__wrappers[vname]) $app.__wrappers[vname] = o;//original settings
			 o = $app.__wrappers[vname];
		 }else 
			 o = vname;
		 
		 const cls = (opts.scope||'view').ucfirst();
		 let view = eval(` new ${cls} `);
		 const idx = opts.idx || $app.viewIdx++;
		 view.idx = idx;
		 view.scope = cls.toLowerCase();
		 if($.isString(vname)) view.name = view.name|| vname;
		 view.params = params;
		 view.__status = 'init';
		 $.extend(view, o);
		 $.extend(view, opts);
		 view = await $app.extendSuperView(view,true);
		 view.onLoad = view.onLoad || view.onload || function(p){this.loaded()}
		 let observer = $observe(view, {});
		 $app.__views = $app.__views || {};
		 $app.__views[`${idx}`] = observer;
		 return observer;
	 }
 
	 get status(){
		 return this.__status
	 }
	 loaded(){
		 this.__status = 'loaded';
		 $.send(this.scope=='controller'?$app:$this, 'view-loaded');
		 this.render();
	 }
	 remove(){
		 this.__status = 'removed';
		 $.remove(this.layer);
		 $.send(this.scope=='controller'?$app:$this,"view-removed",this);
	 }
	 reload(params){
		 this.__status = 'init';
		 this.params = params || this.params;
		 if(this.super && this.super.onLoad)
			 this.super.onLoad.call(this,this.params);
		 this.onLoad.call(this,this.params);
	 }
	 dom(){ 
		 return this.layer ; 
	 }
	 static createLayout(vname, idx, scope='view'){
		 const tags = scope == 'controller' ? ['ARTICLE','MAIN'] : ['DIV','DIV'];
		 return window[tags[0]]({class:`view ${vname}`, view:vname, 'view-index':idx, ref:vname, scope},[
			 window[tags[1]]({class:'wrapper', view:vname, 'view-index':idx, scope})
		 ])
	 }
	 
	 drawLayout(){
		 // elog("view.drawLayout")
		 if(this.super && this.super.draw)
			 this.super.draw.call(this, layer);
		 if(this.draw)
			 this.draw.call(this, this.wrapper, this.layer);
	 }
 
	 async render(data){
		 // elog("render", data)
		 this.__status = 'drawing';
		 // this.layer = this.layer || View.createLayout(this.name, $app.viewIdx++, opts);
		 this.wrapper = this.layer.find1st('.wrapper');
		 this.drawLayout();
		 
		 let view = this;
		 const scope = this.scope;
		 const reserved = ['name','status', '__state','__status','__runtime','observer','noHeader','noFooter','extend','__reserved_keywords'];
 
		 let render_data = ()=>{
			 view.__status = 'rendering';
			 //auto render
			 for(let [k,v] of Object.entries(view) )
				 if(!reserved.includes(k) && !$.isFunc(v))
					 view[k] = v;
			 if(view.vars)
				 for(let k in view.vars) view[k] = view.vars[k];
 
			 if(view.super && view.super.onRender)
				 view.super.onRender.call(view,view.params||{});
			 if($.isFunc(view.onRender))
				 view.onRender.call(view,view.params||{})
 
			 //set runtime vars to $this
			 if(!empty(view.__runtime)){
				 let vw = view;
				 Object.keys(vw.__runtime).forEach(k=>{
					 vw[k] = vw.__runtime[k];
					 delete vw.__runtime[k];
				 })	
			 }
			 view.__runtime = [];//remove temprary data during rendering doms.
			 view.__status = 'rendered';
 
			 const idx = view.idx;
			 if(idx && !empty($this.__loading)) delete $this.__loading[`${idx}`];
			 $.send(scope=='controller'?$app:$this,"view-rendered",view);
		 }
 
		 if(scope=='controller' && !empty($this.__loading)){
			 let intv = setInterval(()=>{
				 if(!empty($this.__loading)) return;
				 clearInterval(intv);
				 render_data();
			 })
		 }else{
			 render_data();
		 }
	 
	 }
 };
 
 /**
  * view controller base class
  * 
  * properties you should specify
  * 	[string] name 	: the view's name
  * 	[bool] reuable : whether a view is reusable. (won't be removed when its going to the background)
  *
  * DON'T use these property names under $this | your_view
  * 	.parentView
  * 	.params
  * 	.render
  * 	
  * 
  * delegate methods
  * 	- onLoad 		: a view is on initilization process
  * 	- onActive 		: a view is going to forground
  * 	- onInactive 	: a view is going to background
  * 	- onTransition 	: a view is going to transit to another view
  * 	- onClose 		: a popup view is closing itself
  *  - onRender 		: after called this.render, set data for this view
  * 	- drawHeader 	: draw view's <header> tag
  * 	- drawContent 	: draw view's body <section> tag
  * 	- drawFooter 	: draw view's <footer> tag
  */
 
 const $controller = function(vname, params, opts={}){
	 const idx = $app.viewIdx++;
	 const layer = Controller.createLayout(vname, idx, 'controller');
	 return Controller.factory(vname, params, {...opts,layer,idx,scope:'controller'})
	 .then(view=>{//load view file & init view object 
		 if(!view) return;
		 window[vname] = view;
		 ['header', 'footer'].forEach(k=>{
			 if(view[`no${k.ucfirst()}`]) {
				 $.remove(view[k]);
				 delete view[k];
			 }
		 })
		 if(view.parentView){
			 window.$parent = $this;
			 view.isPopup = true;
			 view.layer = view.content.parentNode;
			 if(view.layer) view.layer.css({zIndex:view.idx})
			 $.send($parent, "inactive");
			 $child = view;
		 }else{
			 $this = view;
			 document.body.append(view.layer);
		 }
			 
		 if(view.super && view.super.onLoad)
			 view.super.onLoad.call(view,view.params);
		 
		 view.onLoad.call(view,params);
	 })
 }
 
 class Controller extends View{
	 static async factory(vname, params={}, opts={}){
		 return View.factory(vname, params, {...opts, scope:'controller'});
	 }
 
	 close(data){
		 this.__status = 'closed';
		 $.send($app,"view-close",data);
	 }
 
	 drawLayout(){
		 // elog("controller.drawLayout")
		 this.layer.addClass('controller').css({zIndex:100+this.idx})
		 .bind('click', ({currentTarget})=>{
			 if(currentTarget && currentTarget.tagName=='ARTICLE' && currentTarget.hasClass('controller'))
				 $.send(window[this.name], 'click-layer');//click-mask
		 })
 
		 this.content = this.content || this.wrapper;
 
		 if(!this.noHeader){
			 this.header = this.subview ? this.header : (this.header || $header()).left(this.content);
			 if(this.header){
				 this.header.attr({view:this.name, 'view-index':this.idx, scope:this.scope})
				 if(this.super && this.super.drawHeader)
					 this.super.drawHeader.call(this,this.header,this.layer);
				 if(this.drawHeader) 
					 this.drawHeader.call(this,this.header,this.layer);
				 else if($app.drawHeader)
					 $app.drawHeader.call(this,this.header,this.layer);
			 }
		 }
 
		 if($app.drawContent)
			 $app.drawContent.call(this, this.content, this.layer);
		 if(this.super && this.super.drawContent)
			 this.super.drawContent.call(this,this.content,this.layer);
		 if(this.drawContent)
			 this.drawContent.call(this, this.content, this.layer);
 
		 if(!this.noFooter){
			 this.footer = this.subview ? this.footer : (this.footer || $footer()).right(this.content);
			 if(this.footer){
				 this.footer.attr({view:this.name, 'view-index':this.idx, scope:this.scope})
				 if(this.drawFooter) 
					 this.drawFooter.call(this,this.footer,this.layer);
				 if(this.super && this.super.drawFooter)
					 this.super.drawFooter.call(this,this.footer,this.layer);
				 else if($app.drawFooter)
					 $app.drawFooter.call(this,this.footer,this.layer);
			 }
		 }
 
	 }
 };
 
 /*
 YYYY     4-digit year             1999
 YY       2-digit year             99
 MMMM     full month name          February
 MMM      3-letter month name      Feb
 MM       2-digit month number     02
 M        month number             2
 DDDD     full weekday name        Wednesday
 DDD      3-letter weekday name    Wed
 W        1-kanji weekday name     金
 DD       2-digit day number       09
 D        day number               9
 th       day ordinal suffix       nd
 hhh      military/24-based hour   17
 hh       2-digit hour             05
 h        hour                     5
 mm       2-digit minute           07
 m        minute                   7
 ss       2-digit second           09
 s        second                   9
 ampm     "am" or "pm"             pm
 AMPM     "AM" or "PM"             PM
 
 now.format( "YYYY-MM-DD hh:mm:ss (W)" ) = 2011-10-10 23:11:34 (金)
 */
 Date.prototype.format = function(formatString){
	 if(isNaN(this.getTime())) return "";
	 var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,W,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
	 var d = this;
	 YY = ((YYYY=d.getFullYear())+"").slice(-2);
	 MM = (M=d.getMonth()+1)<10?('0'+M):M;
	 MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
	 DD = (D=d.getDate())<10?('0'+D):D;
	 DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()]).substring(0,3);
	 W = ["日","月","火","水","木","金","土"][d.getDay()];
	 th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
	 formatString = formatString.replace("YYYY",YYYY).replace("YY",YY).replace("MMMM",MMMM).replace("MMM",MMM).replace("MM",MM).replace("M",M).replace("DDDD",DDDD).replace("DDD",DDD).replace("DD",DD).replace("D",D).replace("th",th).replace("W",W);
 
	 h=(hhh=d.getHours());
	 if (h==0) h=24;
	 if (h>12) h-=12;
	 hh = h<10?('0'+h):h;
	 hhh = hhh<10?('0'+hhh):hhh;
	 AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
	 mm=(m=d.getMinutes())<10?('0'+m):m;
	 ss=(s=d.getSeconds())<10?('0'+s):s;
	 return formatString.replace("hhh",hhh).replace("hh",hh).replace("h",h).replace("mm",mm).replace("m",m).replace("ss",ss).replace("s",s).replace("ampm",ampm).replace("AMPM",AMPM);
 };
 
 String.prototype.ucfirst = function(){
	 return this.charAt(0).toUpperCase()+this.substring(1);
 };
 String.prototype.camelCase = function() {
	 return this.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
		 .replace(/\s/g, '').replace(/^(.)/, function($1) { return $1.toLowerCase(); });
 }
 String.prototype.formatNumber = function(){
	 var a = this;
	 var a = a.replace(new RegExp("^(\\d{" + (a.length%3?a.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
	 return a.replace(/\s/g,',');
 }
 String.prototype.toHex = function(){
	 var str = [],len = this.length;
	 for (var i=0; i < len; i += 1) {
		 var c = this.charCodeAt(i);
		 str.push(c.toString(16));
	 }
	 return str.join('');
 };
 String.prototype.fromHex = function(){
	 var arr = [];
	 for (var i = 0; i < this.length; i +=2) {
		 arr.push(String.fromCharCode(parseInt(this.substr(i, 2), 16)));
	 }
	 return arr.join('');
 };
 String.prototype.toHexUTF8 = function(){
	 var hex, i, str = [];
	 for (i=0; i<this.length; i++) {
		 hex = this.charCodeAt(i).toString(16);
		 str.push( ("000"+hex).slice(-4) );
	 }
	 return str.join('');
 };
 String.prototype.fromHexUTF8 = function(){
	 var j, hexes = this.match(/.{1,4}/g) || [], back=[];
	 for(j = 0; j<hexes.length; j++) {
		 back.push( String.fromCharCode(parseInt(hexes[j], 16)) );
	 }
	 return back.join('');
 };
 String.prototype.bin2hex = function() {
	 let s = unescape(encodeURIComponent(this));
	 let str = [];
	 for (let i=0; i<s.length;i++) {
		 str.push(s.charCodeAt(i).toString(16));
	 }
	 return str.join('');
 }
 String.prototype.hex2bin = function() {
	 let str = [];
	 for (let i = 0; i < this.length; i+=2) {
		 str.push(String.fromCharCode(parseInt(this.substr(i, 2), 16)));
	 }
	 return decodeURIComponent(escape(str.join('')));
 }
 String.prototype.getByte=function(){
	 var count = 0;
	 for (var i=0; i<this.length; i++){
		 var n = htmlencode(this.charAt(i));
		 if (n.length < 4) count++; else count+=2;
	 }
	 return count;
 };
 String.prototype.trim = function() {
	 return this.replace(/^\s+|\s+$/g, "");
 };
 String.prototype.CJKLength = function() {
	 var str = htmlencode(this).replace(/%u.{4}/gm,"1").replace(/%.{2}/gm,"1");
	 return str.length;
 };
 String.prototype.splice = function( idx, len, sub ) {
	 return (this.slice(0,idx) + sub + this.slice(idx + Math.abs(len)));
 };
 String.prototype.halfWidth=function(){
	 return this.replace(/[\uff01-\uff5e]/g,function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); });
 }
 
 if (typeof String.prototype.startsWith != 'function') {
	 String.prototype.startsWith = function(prefix) { return this.slice(0, prefix.length) == prefix; };
 } 
 if (typeof String.prototype.endsWith != 'function') {
	 String.prototype.endsWith = function(suffix) { return this.slice(-suffix.length) == suffix; };
 }
 
 String.prototype.validate = function(type){ 
	 var val;
	 if(type.indexOf(":")) {
		 var parts = type.split(":");
		 type = parts[0]; val = parts[1];
		 if (parts[2]) var val2 = parts[2];
	 }
	 switch(type){
		 case "is-same":
			 var e1=$('input[name="'+val+'"]'),e2=$('input[name="'+val2+'"]');
			 return e1&&e2&&e1.length>0&&e2.length>0&&e1[0].value === e2[0].value;
		 case "kanji":
			 return this.match(/^[一-龯]+$/);
		 case "katakana":
			 return this.match(/^[ァ-ヺ\s　ー]*$/);
		 case "hirakana":
			 return this.match(/^[ぁ-ん\s　]*$/);
		 case "japanese-name":
			 return this.replace(/[\s　]/,'').match(/^[ぁ-んァ-ヺ一-龯]+$/);
		 case "number":
			 return this.match(/^[\d\.]+$/);
		 case "email":
			 return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(.+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this);
		 case "phone-jp":
			 return /^\+*\d{2,4}[\-ー−]*\d{2,4}[\-ー−]*\d{3,4}$/.test(this);
		 case "zipcode-jp":
			 return /^\d{3}[\-ー−]*\d{4}$/.test(this);
		 case "url":
			 return /^\//.test(this) || /^((http|https|ftp)\:\/\/)*([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|xyz|link|[a-zA-Z]{2,6}))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\?\'\\\+&;%\$#\=~_\-@:+!\(\)]+))*/.test(this);
		 case "len":
			 var min = parseInt(parts[1]);
			 var max = parts.length>=3 ? parseInt(parts[2]):Number.MAX_SAFE_INTEGER;
			 return this.length>=min && this.length<=max;
		 case "Ymd":
			 return /[12]\d{3}[\-ー年\.−]*\d{1,2}[\-ー月\.−]*\d{1,2}/.test(this);
		 case "Ym":
			 return /[12]\d{3}[\-ー年\.−]*\d{1,2}/.test(this);
		 case "Ymdhi":
			 return /[12]\d{3}[\-ー年\.−]*\d{1,2}[\-ー月\.−]*\d{1,2}\s+(午前|午後|am|pm)*\d{1,2}[時:]\d{1,2}/.test(this);
		 case "hi":
			 return /^(午前|午後|am|pm)*\d{1,2}[時:]\d{1,2}/.test(this);
		 case "name":
			 return this.match(/^([\u00c0-\u01ffa-zA-Z'\-ァ-ヺー・ぁ-ん一-龯\u4e00-\u9a05])+([\s　]*[\u00c0-\u01ffa-zA-Z'-ァ-ヺー・ぁ-ん一-龯\u4e00-\u9a05]+)*/i);
		 case "line"	://line id
			 return this.match(/^([.\-_0-9a-z]+)$/i);
		 case "age"	://
			 return this.match(/^[0-9一二三四五六七八九十百零\s　]+(years\b|yrs*\b|歳|才|岁)*$/);
		 case "price"://
			 return this.match(/^([0-9\.一壱壹弌二弐貳貮贰三参參弎叁叄四肆五伍六陸陸七漆柒八捌九玖拾廿卄卅丗卌百十陌千阡仟萬億兆零\s　]+(.*(ドル|ヲン|ユーロ|€|＄|£|㌦|㍀|\$|¥|￥)|.*[円元鎊株币圓角块塊分刀毛]|yen|jpy|usd|cny|fr|eur|bgp|\bb\b|\bm\b|\bk\b|billiions*|millions*|hundreds*|thousands*)*)+$/i);
		 case "az09"://
			 return this.match(/^([0-9a-z]+)$/);
	  }
	 return true;
 };
 String.prototype.utf8_encode = function() {
	 var string = this;
	 var utftext = '', start, end, stringl = 0;
 
	 start = end = 0;
	 stringl = string.length;
	 for ( var n = 0; n < stringl; n++) {
		 var c1 = string.charCodeAt(n);
		 var enc = null;
 
		 if (c1 < 128) {
			 end++;
		 } else if (c1 > 127 && c1 < 2048) {
			 enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
		 } else {
			 enc = String.fromCharCode((c1 >> 12) | 224,
					 ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
		 }
		 if (enc !== null) {
			 if (end > start) {
				 utftext += string.slice(start, end);
			 }
			 utftext += enc;
			 start = end = n + 1;
		 }
	 }
 
	 if (end > start) {
		 utftext += string.slice(start, stringl);
	 }
 
	 return utftext;
 };
 
 String.prototype.timediff = function(){
	 let v = this.match(/^\d+$/) ? parseInt(this) : Math.ceil(Date.parse(this)/1000);
	 if(Number.isNaN(v)) return '';
	 var n = new Date();
	 var d = Math.floor((n-new Date(v*1000))/86400/1000);
	 var str = v;
	 if(d>365) str= Math.floor(d/365)+T('years.ago');
	 else if(d>30) str= Math.floor(d/30)+T('months.ago');
	 else if(d>2) str= d+T('days.ago');
	 else if(d>1) str= T('yesterday');
	 else {
		 var s = Math.floor(n.getTime()/1000 - v);
		 if(s>=3600) str = Math.floor(s/3600)+T('hours.ago');
		 else if(s>=60) str = Math.floor(s/60)+T('minutes.ago');
		 else str = s+T('seconds.ago');
	 }
	 return str;
 }
 
 Array.prototype.last = function(){
	 return this.length>=1?this[this.length - 1]:null;
 };
 
 Array.prototype.hash = function(key,value){
	 if(!key) return null;
	 var hash = {};
	 for(var el of this){
		 hash[el[key]+""] = value?el[value]:el;
	 }
	 return hash;
 };
 
 
 NodeList.prototype.each = function(func){
	 if(func && $.isFunc(func)) for(var i=0;i<this.length;i++)
		 func.call(this,this[i],i);
	 return this;
 };
 
 NodeList.prototype.callfunc = function(func,k,v){
	 var f = $.isString(func)? Element.prototype[func]:false;
	 if(f) for (var i=0;i<this.length;i++)
		 f.call(this[i], k, v);
	 return this;
 };
 
 NodeList.prototype.attr = function(k,v){return this.callfunc("attr",k,v);};
 NodeList.prototype.css = function(k,v){return this.callfunc("css",k,v);};
 NodeList.prototype.remove = function(k,v){return this.callfunc("remove");};
 NodeList.prototype.bind = function(k,v){return this.callfunc("bind",k,v);};
 //NodeList.prototype.unbind = function(k){return this.callfunc("unbind",k);};
 NodeList.prototype.hide = function(k){return this.callfunc("hide",k);};
 NodeList.prototype.show = function(k){return this.callfunc("show",k);};
 NodeList.prototype.addClass = function(v){return this.callfunc("addClass",v);};
 NodeList.prototype.removeClass = function(v){return this.callfunc("removeClass",v);};
 NodeList.prototype.animate = function(o){return this.callfunc("animate",o);};
 NodeList.prototype.forEach = Array.prototype.forEach;
 NodeList.prototype.toArray = function(){
	 return [].slice.call(this, 0);
 }
 
 var $deltas = {
	 linear : function (progress) {
		 return progress;
	 },
	 /** accelerator
	  * o > >> >>> >>>> >>>>>
	  * */
	 quad : function (progress) {
		 return Math.pow(progress, 2);
	 },
	 /** accelerator faster
	  * o > >>> >>>>> >>>>>>> >>>>>>>>>>>
	  * */
	 quad5 : function (progress) {
		 return Math.pow(progress, 5);
	 },
	 
	 /** throwing 
	  * o >> > ... > >> >>> >>>>
	  * */
	 circ : function (progress) {
		 return 1 - Math.sin(Math.acos(progress));
	 },
	 /** bow - arrow 
	  * << < o > >> >>> >>>>
	  * */
	 back : function (progress, x) {
		 x = x||1.5;
		 return Math.pow(progress, 2) * ((x + 1) * progress - x);
	 },
	 /**  
	  * < > < > < > o > >> >>> >>>>
	  * */
	 bounce : function (progress) {
		 for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
			 if (progress >= (7 - 4 * a) / 11) {
				 return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
			 }
		 }
	 },
	 /** 
	  * < > << >> <<< >>> o > >> >>> >>>>
	  * */
	 elastic : function (progress, x) {
		 x = x||0.1;
		 return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress);
	 },
	 
	 /**
	  * reverse
	  * example : easeOut('bounce')(progress);
	  * */
	 easeOut : function (delta) {
		 if(typeof(delta)=="string")
			 delta = $deltas[delta];
		 return function(progress){
			 return 1 - delta(1 - progress);
		 };
	 },
	 
	 /**
	  * repeat 0~50% and reverse. 
	  * */
	 easeInOut : function (delta) { 
		 if(typeof(delta)=="string")
			 delta = $deltas[delta];
		 return function(progress){
			 if (progress <= 0.5) { // the first half of the animation)
				 return delta(2 * progress) / 2;
			 } else { // the second half
				 return (2 - delta(2 * (1 - progress))) / 2;
			 }
		 };
	 }
 };	
 
 var __element = {
 
	 isSvg : function(){
		 window.__svgTagIndex = window.__svgTagIndex||__tags.indexOf('svg');
		 return __tags.indexOf(this.tagName.toLowerCase())>=window.__svgTagIndex;
	 },
 
	 addClass : function(cls) {
		 if(!cls || !cls.trim || !cls.trim().length) return this;
		 cls = cls.trim();
		 if(this.classList){
			 cls = cls.split(/\s+/);
			 for(let c of cls)
				 if(!empty(c)) this.classList.add(c);
			 return this;
		 }
		 var cn = this.isSvg()? (this.getAttribute("class")||""):this.className;
		 cn = cn.split(/\s+/g).filter(c=>c!=cls);
		 cn.push(cls);
		 if(this.isSvg())
			 this.setAttribute("class",cn.join(' '));
		 else
			 this.className=cn.join(' ');
		 return this;
	 },
	 
	 removeClass : function(cls) {
		 if(!cls || !cls.trim || !cls.trim().length) return this;
		 if(this.classList){
			 cls = cls.trim().split(/\s+/);
			 for(let c of cls)
				 if(!empty(c)) this.classList.remove(c);
			 return this;
		 }
		 cls = cls.trim();
		 var iS = this.isSvg();
		 var cn = iS?this.getAttribute("class"):this.className;
		 cn = cn.split(/\s+/g).filter(c=>c!=cls);
		 cn = cn.join(' ');
		 if(iS)
			 this.setAttribute('class',cn);
		 else 
			 this.className = cn;
		 return this;
	 },
 
	 hasClass : function(cls){
		 if(this.classList)
			 return cls && this.classList.contains(cls);
		 var iS = this.isSvg();
		 var cn = (iS?this.getAttribute("class"):this.className)||'';
		 return cn.split(/\s+/g).filter(c=>c==cls).length>0;
	 },
	 
	 css : function(arg1,arg2){
		 if(typeof(arg1)=="string"){
			 if(arg2!==undefined){
				 if(arg1.includes("background") && arg2.includes("url(") && $conf.image_path && !arg2.includes("data:image") && !arg2.includes("http") && !arg2.includes("/") && !arg2.includes("{{") ){
					 arg2 = arg2.replace("url(", "url("+$conf.image_path);
				 }
				 let flags = '';
				 arg1 = arg1.replace( /([A-Z])/, "-$1").toLowerCase();
				 if(`${arg2}`.match(/important/)){
					 arg2 = arg2.replace(/\s*!important\s*/,'');
					 flags = "important";
				 }
				 if($.isString(arg2) && arg2.includes("{{"))
					 $.setVars(this,arg1,arg2,'style');
				 this.style.setProperty(arg1, arg2, flags);
				 return this;
			 } else
				 return this.style[arg1];
		 }else if(typeof(arg1)=="object" && !arg2){
			 for(var f in arg1){
				 this.css(f,arg1[f]);
			 }
		 }
		 return this;
	 },
 
	 /**
	  * define rules for elements to show/hide child nodes
	  
	 --- CSS code ---
	 .hidden,
	 FORM[rule-id="FORM1594289251805"][filter-schema="facility"] *[schema]:not([schema="facility"]),
	 FORM[rule-id="FORM1594289251805"][filter-role="admi"] *[role]:not([role="admi"]){
		 visibility: hidden; position: absolute;
	 }
 
	 */
	 addRules : function(o){
		 if(!this.attr('rule-id')) this.attr('rule-id', this.tagName+new Date().getTime());
		 let rid = this.attr('rule-id');
		 let el = this;
		 if(!empty(o) && $.isObject(o)){
			 let pref = `${el.tagName}[rule-id="${rid}"]`;
			 // let filter = $.unserialize(this.attr('filter'));
			 Object.entries(o).forEach(([k,v])=>{
				 if(empty(k)) return;
				 v = `${v}`.trim();
				 let hide = `${pref}[filter--${k}="${v}"] *[${k}]:not([${k}~="${v}"])`;
				 $.__rules = $.__rules.filter(r=>!r.startsWith(`${pref}[filter--${k}=`))
				 $.__rules.push(hide);
			 })
		 }else if($.css_rules) return;
		 //affect global runtime rules
		 let rules = `${$.__rules.join(",")}{visibility: hidden; position: fixed;}\n`;
		 // elog("NEW-RULES:red",rules);
		 $.remove($.css_rules);
		 $.css_rules = $styles(rules, document.head, "runtime-rules");
	 },
 
	 /**
	  * set attribute to element
	  * @param {*} arg1 : object or string
	  * @param {*} arg2 : value if arg1 is not object
	  * 
	  - var 
	  * $div({var:'contentName'}) //if $this.contentName updated, this.innerHTML will be updated too
	  * $div({var:{'html':'app.title', cid:'contentId'}}) // if $app.title updated this.html will be updated, if $this.contentId be updated, this.cid will be changed to $this.contentId
	  * 
	  */
	 attr : function(arg1,arg2){
		 if(typeof(arg1)=="string"){
			 if(arg1=="id"){
				 this.id = arg2;
				 // __set(arg2,this);
				 return this;
			 }
			 if(arg1=="html"||arg1=="innerhtml")
				 arg1 = "innerHTML";
 
			 if(arg1=="class"||arg1=="classname")
				 arg1 = "className";
 
			 if(arg1=="url" && typeof(arg2)=="string" && ["INPUT","SELECT","TEXTAREA"].indexOf(this.tagName)<0)
				 this.bind("click", $app.trans);
 
			 if(arg1=='var' && $.isString(arg2)) arg2 = {[arg2.replace(/[{}]/g,'').split(".")[0]] : 'innerHTML'};
 
			 if(arg1=="data") {
				 elog("WARN:orange", "cannot set attribute 'data', use '_data' or other names instead");
				 arg1="_data";
			 }
 
			 if(arguments.length==2){//set
				 //if
				 if(['if'].includes(arg1)){
					 specialKey = 'if';
					 if(!$.isString(arg2) && !$.isFunc(arg2) || ($.isString(arg2) && !`${arg2}`.match(/^{\{.+\}\}$/))) {
						 elog("ERR:red", `[attr.${arg1}] can only be string with JS conditional expr. such as "{{items.length>0}} or use FUNCTION type"`, arg1, arg2);
						 return this;
					 }
					 if($.isString(arg2)){
						 //extract vars
						 let vs = arg2.replace(/[{}]/g,"").replace(/\bapp\./g,'APP__').split(/\s*(&&|\|\|)\s*/).map(e=>e.replace(/^[!(\s]*/,'').split(/[^a-zA-Z0-9_]/)[0]).filter(e=>e&&e.trim().length).map(e=>e.replace(/\bAPP__/g,'app.'));
						 if(empty(vs)){
							 elog("ERR:red", `[attr.${arg1}] no variables found.`, arg1, arg2);
							 return this;
						 }
						 //set to if-var
						 vs.forEach(v=>{
							 this.setAttribute(`if--${v}`, '');
						 })
						 this.setAttribute('if', arg2);
					 }else if($.isFunc(arg2)){
						 this.setAttribute(this.attr("type")=='conditions' ? 'if--conditions':'if--func',true);
						 if(!this.getAttribute("tmpl"))
							 this.setAttribute('tmpl', `t${++$.__uuid}`);
						 $.put(`${this.getAttribute("tmpl")}.if`, arg2)
					 }
					 this['if'] = arg2;
					 return this.checkIf();
				 }
 
				 //loop
				 if(['loop'].includes(arg1)){
					 let ms = `${arg2}`.match(/^\{\{([^}]+)\}\}$/);
					 if(!$.isString(arg2) || !ms) {
						 elog("ERR:red", `[attr.${arg1}] can only be string. such as "{{items}} or {{items as item}} or {{0..8 as i step 1}}", default element name is "e"`, arg1, arg2);
						 return this;
					 }
					 if(ms[1].match(/^\s*(\d+)\.\.([^\s]*)/)){//for i=min..max loop
						 let [_0,from,to,_1,idx,_2,step] = ms[1].match(/^\s*([^\s]+)\.\.([^\s]*)\s*(as)*\s*([^\s]*)\s*(step)*\s*(\d*)/);
						 if(__RESVD.includes(idx)) return elog('ERR:red',`reserved keywords : ${idx}`);
						 this.setAttribute(`loop--from`,from||0);
						 this.setAttribute(`loop--to`,to);
						 this.setAttribute(`loop--index`,idx||'i');
						 this.setAttribute(`loop--step`,step||1);
					 }else{//for e of items loop
						 let [v, idc] = ms[1].split(/\s*as\s*/);
						 if(__RESVD.includes(idc)) return elog('ERR:red',`reserved keywords : ${idc}`);
						 this.setAttribute(`loop--var`,v);
						 if(idc) this.setAttribute(`loop--as`,idc);
					 }
					 return this;
				 }
 
				 if(['as','index','step'].includes(arg1) && ($.isString(arg2) || $.isNumber(arg2))){
					 if(!(arg1=='step' && this.tagName=="INPUT")){
						 if(__RESVD.includes(arg2)) return elog('ERR:red',`reserved keywords : ${arg2}`);
						 this.setAttribute(`loop--${arg1}`,arg2);
						 return this;
					 }
				 }
 
				 //events
				 if(arg1.startsWith("on-"))
					 arg1.replace(/^on\-+/, "@");
 
				 if(arg1.startsWith("@") && !empty(arg2)){
					 if(!this.attr('tmpl'))
						 this.setAttribute('tmpl', `t${++$.__uuid}`);
					 let k = arg1.substring(1);
					 arg2 = $.isString(arg2) ? arg2.trim() : arg2;
					 arg1 = 'on';
					 arg2 = {[k] : arg2};
					 // elog("ON:orange", arg1, arg2, this);
				 }
 
				 if(['filter'].includes(arg1) && $.isString(arg2)){
					 let ms = `${arg2}`.match(/^\{\{([^}]+)\}\}$/);
					 if(!ms) {
						 elog("ERR:red", `[attr.${arg1}] can only be string. such as "{{schema}} or {{schema && role}}"`, arg1, arg2);
						 return this;
					 }
					 arg2={};
					 ms[1].split(/\s*[&,]+\s*/).map(v=>arg2[v]=true);
				 }
 
				 if(['var','on','filter'].includes(arg1)){
					 if(!$.isObject(arg2)) {
						 const desc = {
							 'var' 	: "var: {prop1: 'var_name', prop2: 'app.var_name2'}",
							 'on' 	: "on: {click: 'my-event'}",
							 'filter' : "filter: {key1: 'val1', key2: 'val2,val3' } or String of {{key1, key2}}",
						 }
						 elog("ERR:red", `[attr.${arg1}] can only be object. ${desc[arg1]}`, arg1, arg2);
						 return this;
					 }
					 // elog(`${arg1}:red`, arg1, arg2, this);
					 let exists = this.attr(arg1);
					 if(arg1!='on'&&!empty(exists) && $.isString(exists)) arg2 = { ...$.unserialize(exists), ...arg2 };
					 if(arg1!='on')this.setAttribute(arg1, $.serialize(arg2));
					 let keypaths = [];
					 Object.entries(arg2).forEach(([k, v])=>{
						 if(empty(k)) return;
						 let isApp = k.startsWith("app.");
						 k = k.replace(/^app\./,'');
						 if(arg1 == 'var'){
							 let da = isApp && window.$app? $.at($app, k) : $.at(window.$this, k);
							 if(da && !empty(v)) this.attr(v, da)
						 }else if(arg1 == 'on'){
							 if($.isFunc(v)){
								 let tmpl = this.attr("tmpl");
								 $.put(`${tmpl}.${k}`, v)
								 if(['loaded', 'update'].includes(k))
									 this.setAttribute(`on--${k}`, '')
								 this.addEventListener(k, v);
							 }else
								 this.addEventListener(k,function(e){
									 e.stopPropagation();
									 $.send(k.startsWith("app.") ? window.$app : window.$this, v, e);
								 })
						 }
						 if(k.includes('.')){
							 let kn = k.split(".")[0];
							 if(!keypaths.includes(kn)){
								 keypaths.push(kn);
								 this.attr(`${arg1}--${kn}`,'');	
							 }
						 }else
							 this.attr(`${arg1}--${k}`,v);
					 })	
					 if(arg1=='filter') this.addRules(arg2);//add rules to children
					 return this;
				 }
 
				 if(arg2 === undefined || $.isArray(arg2) || $.isObject(arg2) || $.isFunc(arg2) ) return this;
				 
				 //solve special values
				 let vv = arg2;
				 if(this.tagName.toUpperCase() == "IMG" && arg1.toLowerCase()=="src"){
					 vv = $conf.image_path && !arg2.includes("data:image") && !arg2.startsWith("http") && !arg2.startsWith("/") && !arg2.includes("{{")? $conf.image_path+arg2:arg2;
				 }else if(["value","id","placeHolder","title"].includes(arg1)){
					 vv = htmldecode(arg2);
				 }else if(['innerHTML','textContent','innerText'].includes(arg1) ){
					 if(`${vv}`.startsWith('@'))
						 vv = vv.charAt(1)=='.' ? T(this.tagName.toLowerCase()+vv.substring(1)) : T(vv);
					 if(this.attr('wrapper'))
						 vv = $.wrap(vv, this.attr('wrapper'))
				 }
 
				 if(arg1 === 'wrapper' && !empty(this.innerHTML))
					 this.innerHTML = $.wrap(this.innerHTML, vv)
				 
				 // solve vars
				 if($.setVars(this, arg1, vv)) return this;
 
				 //set to Element
				 this[arg1] = vv;
				 let ignoreAttrs = ['value','innerHTML','textContent','innerText','checked','disabled','readonly','selected','selectedIndex','className'];
				 if(!ignoreAttrs.includes(arg1)){
					 this.setAttribute(arg1, vv);
				 }else if(!['innerHTML','textContent','innerText','className'].includes(arg1)){//FIXME later
					 if($.isFunc(this.data))
						 this.data(arg1, vv)
				 }
				 
				 //solve state
				 if(arg1=='innerHTML' && `${arg2}`.match(/\bdata\-state['"\s]*=/)){
					 ma = `${arg2}`.split("\n").join("____BR____").match(/\bdata\-state['"\s]*=['"\s]*([^'"]+)/g);
					 if(!empty(ma)){
						 ma.forEach(mm=>{
							 mm = mm.replace(/^data\-state=["']/,'').replace(/["']$/,'');
							 va = window.$this && $this.getState(mm) || window.$app && $app.getState(mm);
							 if(va){
								 this.find(`[data-state="${mm}"]`).forEach(c=>{
									 let m = `${c.innerText}`.match(/\{\{state\.([^}]+)\}\}/);
									 if(m && m[0]) c.innerHTML = c.innerHTML.replace(/\{\{state\.[^}]+\}\}/g, va).split("____BR____").join("\n");
									 else c.innerText = `${va}`.split("____BR____").join("\n");
								 })
							 }
						 })
					 }
				 }
 
				 //solve innerHTML = <tags><child-tags>...
				 if(arg1 === 'innerHTML')
					 this.find("*[wrapper]", (el)=>{
						 if(!empty(el.innerHTML))
							 el.innerHTML = $.wrap(el.innerHTML, el.attr('wrapper'))
					 })
 
			 }else{//get
				 var v = this.getAttribute(arg1) || this[arg1] || this.getAttribute(`data-${arg1}`);
				 if(arg1 == 'var')
					 return v? $.unserialize(v) : {};
				 return v && `${v}`.match(/^\d+$/)?parseInt(v):v;
			 }
		 }else if(typeof(arg1)=="object" && !arg2){
			 for(var _f in arg1){
				 this.attr(_f,arg1[_f]);
			 }	
		 }
		 return this;
	 },
 
	 /**
	  * set data as attribute with prefix of ("data-")
	  * @param {*} k 
	  * @param {*} v 
	  */
	 data : function(k, v){
		 if(arguments.length==0){//GET all
			 return {...this.dataset};
		 } else if(arguments.length==1){//get 1
			 return this.getAttribute(k.startsWith("data-")?k:`data-${k}`);
		 } else if(v===undefined){//del
			 this.removeAttribute(k.startsWith("data-")?k:`data-${k}`)
			 return this;
		 } else {
			 this.setAttribute(k.startsWith("data-")?k:`data-${k}`, v);
			 return this;
		 }
	 },
 
	 find : function(q,f){
		 if(!q)return false;
		 q = q.replace(/\?.*/g,'');
		 var qs=q.split(/\s+/),qu=qs[qs.length-1];
		 var r=this.querySelectorAll(q);
		 if($.isFunc(f)) for(var i=0,el;el=r[i];i++) f(el,i);
		 return qu.indexOf("#")==0?r[0]:r;
	 },
	 
	 find1st : function(q){var qs=q.split(" "),qu=qs[qs.length-1];var r=this.querySelectorAll(q);return r?r[0]:null;},
 
	 /**
	  * find text node only with specified "text",
	  * @param text : [Optional] null means all nodes text node that .nodeValue.trim().length>1
	  * 			   : someTextValue means query condition
	   * @param excludeTags : [optional] exclude these tagnames of lowercase
	  * @example : dom.findByText : (null, ["option","body"])
	  * @example : dom.findByText : ("mytext")
	  */
	 findByText : function(text, excludeTags){
		 var filter = {
			 acceptNode: function(node){
				 if(node.nodeType === document.TEXT_NODE && 
					 (text&&node.nodeValue.includes(text)||!text&&node.nodeValue.trim().length>0)){
					 return NodeFilter.FILTER_ACCEPT;
				 }
				 return NodeFilter.FILTER_REJECT;
			 }
		 }
		 var nodes = [];
		 var walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT, filter, false);
		 while(walker.nextNode()){
			 var n = walker.currentNode.parentNode;
			 if(!excludeTags || (excludeTags&&excludeTags.indexOf(n.nodeName.toLowerCase())<0))
				 nodes.push(n);
		 }
		 return nodes;
	 },
 
 
	 bind : function(arg1, arg2, cap=false){
		 if(typeof(arg1)=="string"){
			 if(arg2){
				 if(arg1.match(/[,\s]+/)){
					 let es = arg1.split(/[,\s]+/);
					 var el = this;
					 es.forEach(e=>el.bind(e, arg2))
				 }else{
					 arg1 = arg1.replace(/^on/,'');
					 if(!$browser.mobile && arg1.indexOf("touch")==0) 
						 arg1 = {"touchstart":"click","touchmove":"mousemove","touchend":"mouseup"}[arg1];
					 var el = this;
 
					 if($.isFunc(arg2)){
						 let fn = (e)=>{
							 arg2.call(el, e, e.target.views()[0])
						 }
						 this.addEventListener(arg1, fn, cap);
					 }
					 // this.addEventListener(arg1, arg2, cap);
 
					 if($app.useState) {
						 const events = __eventMap.get(el) || {};
						 events[arg1] 
						 if(events[arg1]) {
							 events[arg1].push(arg2);
						 }else{
							 events[arg1] = [arg2];
						 }
						 __eventMap.set(el, events);
					 }
				 }
			 }
		 }else if(typeof(arg1)=="object" && !arg2){
			 for(var f in arg1){
				 this.bind(f,arg1[f]);
			 }
		 }
		 return this;
	 },
 
	 unbind : function(){
		 console.log("ERR : unbind is removed, since it will lead a performance problem. use lock,unlock instead.")
	 },
 
	 /**
	  * bind event to all childs, such like ul-li, dl-dd
	  * @param {str} ename :event name
	  * @param {*} fn : function
	  */
	 binds : function(ename, fn){
		 if(!empty(this.children) && ename && fn)
			 [...this.children].forEach(el=>el.bind(ename, fn));
		 return this;
	 },
 
	 /**
	  * alternative of bind
	  * instead of specify function, you specify a msg type to send to $this view
	  * @param {*} eventName : mouse/keyboard/other event
	  * @param {*} msg : msg string
	  * @param {*} delegate : who to send the msg , default is $this
	  */
	 on : function(eventName, msg, delegate){
		 let args = [...arguments].slice(3);
		 let es = `${eventName}`.split(",").map(e=>e.trim()).filter(e=>!empty(e));
		 // elog("ON:red", eventName, es, msg, delegate)
		 if(empty(es)||empty(msg)) {
			 elog('WARN:orange',`Cannot bind event [${eventName}] to `, this); return this;
		 }
		 for(let en of es)
		 this.addEventListener(en, function(e){
			 e.stopPropagation();
			 let v = this.views()[0];
			 $.send(delegate||v||window.$this,msg,e,v,...args);
		 });
		 return this;
	 },
 
	 onKeyup : function(code, cb){
		 if(!cb||(this.tagName!='INPUT'&&this.tagName!='TEXTAREA'))return this;
		 return this.bind('keydown',function(e){
			 var c = e.which || e.keyCode;
			 if(code)
				 if(c==code) e.preventDefault();
			 if(c==27) {//esc, cancel
				 this.blur();
			 }
			 if(c==229) this.attr("ja",1);
			 else { this.removeAttribute("ja"); delete this["ja"]; }
			 if(c==18)this.attr('alt',1);
		 })
		 .bind('keyup',function(e){
			 var c = e.which || e.keyCode;
			 var ja = this.attr("ja")==1;
			 if(ja&&c==32){
				 e.preventDefault();
			 }
			 if(!ja && ((code&&c==code&&cb) || !code)){
				 cb.call(this,e);
			 }	
		 })
	 },
 
	 onEnterKey : function(cb){
		 return this.onKeyup(13,cb);
	 },
 
	 onHover : function(inFunc, outFunc){
		 $.hover(this,inFunc,outFunc);
		 return this;
	 },
 
	 onloaded : function(cb){
		 var el = this;
		 if(cb)
			 el.addEventListener("DOMNodeInserted", function(e){
				 cb.call(el,e)
			 }, false);
		 return el;
	 },
	 onremoved : function(cb){
		 var el = this;
		 if(cb)
			 el.addEventListener("DOMNodeRemoved", function(e){
				 cb.call(el,e)
			 }, false);
		 return el;
	 },
 
	 /**
	  * clone a element including childs and append to target.
	  * @param  replace:optional, insert the new clone obj before current one.and distory current one.
	  * FIXME : IE does not support cloneNode?
	  * @return cloned DOMElement.
	  */
	 clone : function(replace){
		 var c=this.cloneNode(true);
		 if(replace && this.parentNode){
			 this.parentNode.insertBefore(c, this);
			 this.remove();
		 }
		 return c;
	 },
	 
	 /**
	  * get the child numerical index in its parent node.
	  * @return {int} 0-N
	  */
	 index : function(){
		 var  i= 0;
		 while((elem=elem.previousSibling)!=null) ++i;
		 return i;
	 },
 
	 rect : function(){
		 var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop,
			 scrollLeft = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
		 if(this.getBoundingClientRect){
			 var r = this.getBoundingClientRect();//Read only
			 return {top:r.top+scrollTop, width:r.width, left:r.left+scrollLeft, height: r.height};
		 }	
		 var _x = 0,_y = 0,w = this.width(),h = this.height();
		 var el = this;
		 while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
			 _x += el.offsetLeft - el.scrollLeft;
			 _y += el.offsetTop - el.scrollTop;
			 el = el.offsetParent;
		 }
		 //offsetWidth (includes padding...)
		 return { top: _y+scrollTop, left: _x+scrollLeft,width:w,height:h};			
	 },
	 
	 height : function(){
		 return Math.max(this.clientHeight||0,this.scrollHeight||0,this.offsetHeight||0);
	 },
	 width : function(){
		 return Math.max(this.clientWidth||0,this.scrollWidth||0,this.offsetWidth||0);
	 },
 
	 hide : function(time){
		 if(time>0)
			 this.animate({duration:time,style:"easeIn",step:function(el,delta){
				 el.style.opacity=1-delta;
				 if(delta>=1){el.style.opacity=1;el.style.display="none";}
			 }});
		 else
			 this.style.display = "none";
		 return this;
	 },
	 show : function(time){
		 if(time>0){
			 this.css({"opacity":0}).animate({duration:time,style:"easeOut",step:function(el,delta){
				 el.style.opacity=delta;
			 }});
			 this.style.removeProperty("display");
		 }else{
			 this.style.removeProperty("display");
		 }
		 return this;
	 },
	 remove : function(el){
		 if(this.parentNode)
			 this.parentNode.removeChild(this);
	 },
	 left : function(target) {
		 if($.isElement(target) && target.parentNode)
			 target.parentNode.insertBefore(this,target);
		 return this;
	 },
	 right : function(target) {
		 if($.isElement(target) && target.parentNode)
			 if(target.nextSibling)
				 target.parentNode.insertBefore(this, target.nextSibling);
			 else
				 target.parentNode.appendChild(this);
		 //else TODO $app.onError
		 return this;
	 },
	 /**
	  * disable | enable selection of a node.
	  * @param  string v : none|all|text|element
	  * @return this node.
	  */
	 selectable : function(v){
		 v = v===false?"none":(v===true?"all":v);
		 return this.bind("selectstart",function(e){return e.preventDefault();}).css({"-moz-user-select": v, "-webkit-user-select": v, "-ms-user-select":v, "user-select":v});
	 },
	 /**
	  * Animation refactored
		 @delay : time wait to start
		 @frame : how many frames per second. (1000ms) || 50
		 @duration : The full time the animation should take, in ms. default = 1000ms
		 @delta(progress) : A function name, which returns the current animation progress. @see $deltas
		 @style : easeIn(default), easeOut, easeInOut
		 @step(element, delta) : function. do the real job
		 @examples:
		 $id("img").animate({delta :"bounce",style : "easeOut",step: function(el, delta){
			 el.style.marginTop = delta*600;
		 }}).animate({delta :"quad",style :"easeOut",step:function(el, delta){
			 el.style.marginLeft = delta*600;
			 el.style.width = delta*24*10; 
		 }});
		 
	  * */
	 animate : function (opts) {
		 var ele = this;
		 if(opts.delay){
			 var delay = parseInt(opts.delay);
			 delete opts["delay"];
			 setTimeout(function(arg){
				 if(arg.ele)
					 arg.ele.animate(arg.opts);
			 }, delay, {ele:ele, opts:opts});
			 return ele;
		 }
		 var start = Date.now();
		 opts.duration = opts.duration||1000;
		 opts.frame = opts.frame || 60;
		 opts.interval = 1000/opts.frame;
		 opts.delta = opts.delta || "linear";
		 var interv= setInterval(function() {
			 var timePassed = new Date - start;
			 var progress = timePassed / opts.duration;
			 if (progress > 1) progress = 1;
			 var delta = $deltas[opts.delta];
			 if(opts.style){
				 if(opts.style=="easeOut") delta = $deltas.easeOut(delta);
				 if(opts.style=="easeInOut") delta = $deltas.easeInOut(delta);
			 }
			 var delta_value = delta(progress); 
			 opts.step(ele, delta_value);
			 if (progress == 1) {
				 clearInterval(interv);
			 }
		 }, opts.interval);
		 return this;
	 },
 
	 fire : function(eventName, option){
		 var opt = $.extend(option||{}, $.__eventOpts),
			 oe=null, etype = null;
		 for (var name in $.__events){
			 if ($.__events[name].test(eventName)) { etype = name; break; }
		 }
		 if (!etype){
			 if($app.onError)$app.onError("event_fire_error",{name:eventName});
			 throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
		 }
		 if(this[eventName]){
			 this[eventName]();
		 }else if (document.createEvent){//Webkit & FF
			 oe = document.createEvent(etype);
			 if (etype === 'HTMLEvents'){
				 oe.initEvent(eventName, opt.bubbles, opt.cancelable);
				 this.dispatchEvent(oe);
			 }else if(etype == "MouseEvents"){
				 oe.initMouseEvent(eventName, opt.bubbles, opt.cancelable, document.defaultView,
						 opt.button, opt.pointerX, opt.pointerY, opt.pointerX, opt.pointerY,
						 opt.ctrlKey, opt.altKey, opt.shiftKey, opt.metaKey, opt.button, this);
				 this.dispatchEvent(oe);
			 }else {//keyboard
				 if(option&&option.key=='Enter'){
					 option = {
						 code: 'Enter',key: 'Enter',
						 charKode: 13,keyCode: 13,
						 view: window
					 }
				 }
				 var ke = new KeyboardEvent(eventName, option);//option example:{key : "a", char : "a", shiftKey: true}
				 this.dispatchEvent(ke);
				 return this;
			 }
		 }else{//IE
			 opt.clientX = opt.pointerX;
			 opt.clientY = opt.pointerY;
			 var evt = document.createEventObject();
			 oe = $.extend(evt, opt);
			 this.fireEvent('on' + eventName, oe);
		 }
		 return this;
	 },
 
	 /**
	  * render template to Elements
	  */
	 render(data, opts={}){
		 let org = this.tagName=='TEMPLATE' ? document.body.find1st(`template[tmpl="${this.attr('tmpl')}"]`) || this : this;
		 if(!org) return false && elog("ERR:red", org, this.attr("tmpl"), this); 
		 let children = [...(opts.children || org.children || [])];
		 let cfuncs = this.child_funcs || false;//children element is function
		 if(cfuncs) {
			 Object.keys(cfuncs).map(k=>parseInt(k)).sort().forEach(k=>{
				 children.splice(k, 0, cfuncs[`${k}`]);
			 })
		 }
		 if(!org || ( empty(children) && !this.parse ) ){
			 return false && elog("ERR:red", org, this.attr("tmpl"), this);
		 }
		 let html = this.tagName=='TEMPLATE' ? [...children].map((d,i)=>$.isFunc(d)?'{{func}}':d.outerHTML).join("\n") : this.outerHTML;
		 let tmpl = this.attr("tmpl");//template id
		 let {pref} = opts;
		 let override = "override" in opts? opts.override : true;
		 pref = pref || '';
 
		 if(override && this.parentNode) this.parentNode.find(`[tmpl--id="${tmpl}"]`).remove();
 
		 let res = [];
		 let isLoop = false;
		 let idx = this.attr('loop--index')||'i';
		 let vw = this.views()[0] || {};
		 if(this.attr('loop--var')){//for loops
			 let lk = this.attr('loop--var');
			 if(!lk||!lk.trim().length||!html||!html.trim().length||(!html.includes("{{") && !html.includes("tag--"))) return this;
			 data = data || (lk.startsWith("app.")?$app[lk.replace(/^app\./,'')] : vw[lk] || $this[lk]);
			 if(!$.isArray(data) && !$.isObject(data)) return this;
			 if(!$.isArray(data)) data = [data];
			 pref = this.attr('loop--as')||'e'
			 isLoop = true;
		 }else if(this.hasAttribute('loop--from')&&this.hasAttribute('loop--to')){//for-loops with index
			 let from = this.attr('loop--from');
			 let to = this.attr('loop--to');
			 let step = parseInt(this.attr('loop--step'))||1;
			 // elog("RENDER:red",from,to,idx,step)
			 from = `${from}`.match(/[^\d]/)? $.evalString(`{{${from}}}`, data) : parseInt(from)
			 to = `${to}`.match(/[^\d]/)? $.evalString(`{{${to}}}`, data) : parseInt(to)
			 if(!$.isNumber(from)||!$.isNumber(to)||from==to) return this;
			 let [start, end] = from<to ? [from, to] : [to, from];
			 data = [];
			 for(let i=start;i<end;i+=step){
				 data[i] = {[idx]:i};
			 }
			 isLoop = true;
			 // elog("RENDER-data:red",from,to,data)
		 }else{//var
			 data = [data||{}];
		 }
 
		 let last = this, el = this;
		 data.forEach((d,i)=>{
			 $.iteritor = {data:d, index:i};
			 children.forEach((c,x)=>{
				 let nodes = $.isFunc(c) ? [c(d,i,el)] : 
					 $.render(c.outerHTML, d, {tmpl, pref:pref, index:idx, i:i, loop:isLoop, key:opts.key||false, keypath:opts.keypath||false}, org);	
				 nodes.forEach(node=>{
					 if(node && node.right){
						 res.push(node);
						 node.right(last)
						 node.dispatchEvent(new CustomEvent('loaded', {detail : {target:node, data:d} }))
						 last = node;
					 }
				 })
			 })
		 });
		 delete $.iteritor;
		 return res;
	 },
 
	 checkIf(k,v){
		 let rs = this.attr('if');
		 if(empty(rs)) return;
		 try{
			 let tmpl = this.attr('tmpl');
			 if(tmpl) 
				 document.body.find(`[tmpl--id="${tmpl}"]`).remove();
			 else 
				 this.addClass('hidden');
			 if($.isFunc(rs) ? rs(k,v,this) : eval(`with($this.vars){${rs.replace(/(^\{\{|\}\}$)/g,'')}}`)) {
				 if(tmpl && this.tagName=='TEMPLATE') this.render(); 
				 else {
					 if(this.attr("format--html"))
						 this.innerHTML = $.evalString(this.attr("format--html"))
					 this.removeClass('hidden');
				 }
			 }else{
				 this.addClass('hidden');
			 }
			 return this;
		 }catch(err){
			 elog("WARN-if:orange", "wrong if-expr. ", rs, err);
			 return this;
		 }
	 },
 
	 checkFilter(k,v){
		 let fs = this.attr('filter');
		 if(empty(fs)) return;
		 fs = $.unserialize(fs);
		 fs[k] = v;
		 this.attr( 'filter', fs );
		 return this;
	 },
 
	 /**
	  * get parent $view s of this element
	  */
	 views(){
		 return empty(this.scopes) ? [] : this.scopes.map(v=>$app.__views[v]);
	 }
 
 
 };
 
 $.extend(Element.prototype,__element);
 
 $.append = function(el, children, defaultTag){
	 if(!children)return false;
	 if($.isElement(children))
		 el.append(children)
	 else if($.isArray(children) && !empty(children)) {
		 defaultTag = defaultTag || $conf.defaultTag || 'div'
		 children.forEach((c,i)=>{
			 if(!c) return;
			 if($.isFunc(c)){
				 el.child_funcs = el.child_funcs || {}
				 el.child_funcs[`${i}`]=c;
			 }else if($.isFunc(c.dom) && c.dom()){
				 el.append(c.dom())
			 }else if($.isArray(c)){
				 $e.append($ul({},el), c, "li")
			 }else if($.isElement(c)){
				 el.append(c)
			 }else if($.isString(c)){
				 el.append(defaultTag?window[`$${defaultTag}`](c):$div(c))
			 }else if($.isObject(c)){
				 let child = c.items || []
				 delete c.items;
				 el.append(defaultTag?window[`$${defaultTag}`](c, child):$div(c, child))
			 }
		 })
	 }
 
	 if(el.attr('view') && el.attr('view-index') && el.attr('scope')=='view'){//is view container
		 const idx = el.attr('view-index');
		 el.find('*',e=>{
			 // e.scopes = (e.attr('view-list')||'').split(',').filter(v=>!empty(v));
			 e.scopes = e.scopes||[];
			 e.scopes.push(idx)
			 // e.attr("view-list", e.scopes.join(','))
			 // e.attr(`view-${idx}`, 1);
		 })
	 }
 }
 
 
 /**
  * DOM functions 
  * cases
  * 	1.1. "" - tagName
	 2.1. "", (), 	- tagName, func
	 2.2. "", {}|"",	- tagName, attr
	 2.3. "", []|<>,	- tagName, sub
	 3.1. "", (), *			- tagName, func, *
	 3.2. "", {}|"", <>|""	- tagName, attr, tar
	 3.3. "", {}|"", []|<>	- tagName, attr, sub
	 3.4. "", []|<>, <>|""	- tagName, sub, tar
	 4.1. "", {}|"", []|<>, <>|""		- tagName, attr, sub, tar
	 5.1. "", {}|"", []|<>, <>|"", ""	- tagName, attr, sub, tar, namespace
  */
 var $e = function(){
	 let ps = [...arguments];
	 
	 //funcs : needs to convert to value first
	 if($.isFunc(ps[1])) ps[1] = ps[1]();
 
	 //2nd sub > Omitted args
	 if($.isElement(ps[1])||$.isArray(ps[1])) {
		 ps[1] = $.isElement(ps[1]) ? [ps[1]] : ps[1];
		 ps.splice(1,0,{});
	 }
 
	 //3nd targte > omitted children
	 if(!ps[2]||$.isElement(ps[2])||$.isString(ps[2])) ps.splice(2,0,[]);
 
	 let [type, args, children, target, namespace] = ps;
 
	 // elog("$e", type, args, children, target, namespace)
	 
	 //solve type
	 type = $.isString(namespace) && $.isString(type)? type.replace(/_/g, "-"):type;
	 let clss, ids, tag;
	 if(type && $.isString(type)){
		 let ms = type.match(/(\{\{[^}]+\}\})/);
		 if(ms) {//is var
			 type = 'tag';//placeholder
			 tag = ms[1];
			 // elog("TGA:red",tag)
		 }else{//solve tag.ClassName, tag#id
			 clss = type.match(/\.([a-z0-9\-_]+)/gi);
			 if(clss&&clss.length) clss=clss.map(function(e){return e.replace('.','')}).join(' ');
			 ids = type.match(/#([a-z0-9\-_]+)/i);
			 if(ids&&ids.length)ids=ids[0].replace('#','');
			 type = type.split(/[#\.]+/)[0];
		 }
	 }
 
	 //make element
	 let _el = //tag && window[tag] && $.isFunc(window[tag]) ? tag(args) : 
		 $.isString(type)? ($.isString(namespace)? document.createElementNS(namespace,type):document.createElement(type)) : ($.isElement(type)?type:null);
	 if(!_el) throw new Error("ERROR : $e wrong parameters ");
	 if(clss) _el.className=clss;
	 if(ids) _el.id=ids;
 
	 let tmplVars = {};
 
	 //solve args
	 args = args || {}
	 if($.isString(args)){
		 switch(type){
			 case "img" : args = {src : $conf.image_path && args.indexOf("data:image")<0 && args.indexOf("http")<0 && !args.match(/^url\(\//)? $conf.image_path+args:args};
				 break;
			 case "a" : args = {href : args};
				 break;
			 default :
				 let lb = `${args}`.charAt(0)=='@'?(args.charAt(1)=='.'?T(_el.tagName.toLowerCase()+args.substring(1)):T(args.substring(1))): args;
				 args = lb.match(/\{\{.+\}\}/) ? (tag ? {'tag--var':lb} : {'html':lb}):
					  lb.match(/<.*?>/) ? {html:lb} : {textContent:lb};
				 break;
		 }
	 } 
	 if($.isElement(args)){
		 $.append(_el, args)
	 }else if($.isObject(args)){
		 if(tag) {
			 let kn = empty(ps[1])? 'tag--var':'tag--name';
			 // args[kn] = kn=='tag--var' ? tag.replace(/[{}]/g, '') :tag;
			 args[kn] = tag;
		 }
		 if('parse' in args)//has to be set first, parse means whether to render
			 _el.attr("parse", args['parse'])
		 //check vars > templates
		 let vstr = Object.entries(args).map(([k,v])=>`${k}=${v}`).join(";");
		 let ms = `${vstr}`.match(/([a-zA-Z0-9_.]+)\s*=\s*\{\{([^}]+)\}\}/g);
		 let as = `${vstr}`.match(/(@[a-zA-Z]+)\s*=/);
		 
		 if( (ms || as) && !_el.attr("tmpl--id"))
			 // _el.attr('tmpl', $.md5(_el.tagName+vstr+new Date().getTime()));
			 _el.attr('tmpl', `t${++$.__uuid}`);
		 //templates
		 if(_el.tagName!=='TEMPLATE' && ms && args['parse']!==false){
			 ['tmpl','var','loop','if','as','step','value'].forEach(k=>{
				 if(k=='value' && ! (empty(args[k]) && `${args[k]}`.match(/\{\{.+\}\}/) && args.parse ) ) return;
				 if(args[k])tmplVars[k]=args[k]; 
				 if(!["if", "value"].includes(k)&&!$.isFunc(args[k])) delete args[k];
			 });
		 }
		 for(let _k in args){
			 _el.attr(_k, args[_k]);
			 if(_k === 'ref' && $this) {
				 if(!$this.refs) {
					 $this.refs = {};
				 }
				 if(/^\[(.+)\]$/[Symbol.match](args[_k])) {
					 const key = /^\[(.+)\]$/[Symbol.match](args[_k])[1];
					 if($.isArray($this.refs[key])) {
						 $this.refs[key].push(_el);
					 } else {
						 $this.refs[key] = [_el];
					 }
				 } else {
					 $this.refs[args[_k]] = _el;
				 }
			 }
		 }
	 }
 
	 //solve children	
	 
 
	 //solve target
	 if(!empty(target) && $.isString(target))
		 target = document.getElementById(target);
 
	 //solve template
	 if(!empty(tmplVars)){
		 let tmpl = $template(tmplVars, [_el], target);
		 if(!tmpl.attr("tmpl")) tmpl.attr('tmpl', `t${++$.__uuid}`);
		 if($.isNumber(tmpl.attr('loop--from')) && $.isNumber(tmpl.attr('loop--to'))){
			 setTimeout(()=>{tmpl.render()}, 100);//start a new thread to do this
		 }
		 return tmpl;
	 }
 
	 $.append(_el, children)
 
	 if($.isElement(target))
		 $.append(target, _el)
 
	 if(window["$DOMListener"]){//FIXME 
		 _el.onloaded(()=>{$.send(window["$DOMListener"],'element-loaded',_el)})
	 }
	 return _el;
 };
 
 
 
 /**
 NOT IN USE : "html","script","link","iframe","head","body","meta",
 NOT IN USE (Deprecated) : "acronym","applet","basefont","big","center","dir","font","frame","frameset","noframes","strike","tt"
 NOT IN USE (uncommon) : ,"dialog","bdi","command","menu","track","wbr"
 NOT IN USE (Others) : "object"-"param","noscript",
 
 NOT IN USE (Duplicated) :  "blockquote" -> "q"
 
 Override : "select"(with TODO:"optgroup","option") -> use $select() instead
 Override : "style" -> use $styles(rules, target) instead
 
 Layout example :
 <artile>
	 <header> 	: header
	 <nav>		: navigator
	 <aside>		: sidemenu
		 <details>		: sidemenu group item
			 <summary> 	: sidemenu group title
			 <p>			: sidemenu items under group
			 <p>
	 <main>			: main content
		 <section>	: content
		 <section>	: content
		 ...
	 <footer>	:
 
 
 */
 const __tags = [ 
 //Struct Common
 "div","p","span","br","hr",
 "ul","ol","li","dl","dt","dd",
 "main","article","section","aside","footer","header","nav",	//HTML5,main:IE>12
 
 //Table
 "table","caption","tbody","thead","tfoot","colgroup","col","tr","td","th",
 
 //Form
 "form","fieldset","legend","input","label","textarea","select","option",
 
 //Markup
 "b","h1","h2","h3","h4","h5","h6","cite","pre",
 "s","u","i","mark","q","small","sub","sup","abbr","bdo","ruby",
 "time","rp","rt",
 'del','ins',
 //HTML5
 
 //Phrase - Maybe will be deprecated in the future
 "em","dfn","code","samp","strong","kbd","var",
 
 //Struct Image
 "map","area",
 "figure","figcaption", /*card figure > img+figcaption*/
 
 //Resources, Objects, Tools
 "a","img","button",
 "progress",
 "address",//location address
 "base",//url
 "canvas",
 "embed","audio","video","source","progress", //HTML5
 
 'datalist',/** <datalist id="opts"><option>...</datalist> along with <input list='opts'> */
 'data',/** <data value='234'>Label</data> */
 'keygen','output',
 'template','slot',
 
 //uncommon tags,IE not supported
 "details","summary",/* details > summary + p + p */
 "meter",/* ie>13 similar with progress*/
 ];
 
 const __svg_tags = ['svg','altglyph','altglyphdef','altglyphitem','animate','animateColor','animateMotion','animateTransform',
 'circle','clippath','color_profile','cursor','defs','desc','ellipse',
 'feblend','fecolormatrix','fecomponenttransfer','fecomposite','feconvolvematrix','fediffuselighting','fedisplacementmap','fedistantlight','feflood','fefunca','fefuncb','fefuncg','fefuncr','fegaussianblur','feimage','femerge','femergenode','femorphology','feoffset','fepointlight','fespecularlighting','fespotlight','fetile','feturbulence',
 'filter','font','font_face','font_face_format','font_face_name','font_face_src','font_face_uri','foreignobject',
 'g','glyph','glyphref','hkern','image','line','lineargradient','marker','mask','metadata','missing_glyph',
 'mpath','path','pattern','polygon','polyline','radialgradient','rect','script','set','stop','style','switch','symbol','text','textpath','tref','tspan','use','view','vkern'
 ];
 
 [__tags, __svg_tags].forEach(ts=>{
	 ts.forEach(t=>{
		 window[`$${t}`] = window[t.toUpperCase()] = function(){return $e(...[t,...arguments,__svg_tags.includes(t)?'http://www.w3.org/2000/svg':false]);}
	 });
 })
 
 
 
 
 /**
  * for html template
  * @example
 <!-- HTML -->
 <for-loop items='$this.data' item="e">
   <h4>{{e.title}}</h4>
   <p>{{e.price}}</p>
 </for-loop>
 
 <!-- JS -->
 var my_test_view = {
   data : [
	 {title: 'item 1', price:1200},
	 {title: 'item 2', price:1000},
	 {title: 'item 3', price:800},
   ]
 }
  */
 class Loop extends HTMLElement{
	 constructor() {
		 // Always call super first in constructor
		 super();
		 let items = this.attr("items"),
			 item = this.attr("item") || 'e';
		 try{
			 items = eval(`window.${items}`) || [];
			 // console.log("Loop::items",items);
			 let tmpl = this.innerHTML;
			 if(!items.length || !tmpl.length) return this;
			 tmpl = tmpl.replace(new RegExp(`\\{\\{${item}\\.`,'g'), "{{");
			 let ks = tmpl.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
			 this.innerHTML = "";
			 //create outer el
			 let ul = $ul({}, this);
			 for(let o of items){
				 let txt = `${tmpl}`;//copy template
				 ks.forEach(k=>{
					 let kn = k.replace(/[{}]/g,'');
					 txt=txt.split(k).join(o[kn]||'');
				 })
				 $li({html:txt},ul)
			 }  
		 }catch(e){console.error("err",e); return this;}
	 }
 }
 customElements.define('for-loop', Loop);
 
 
 /**
  * 
  * @deprecated : use $pick instead
  * checkbox / radiobox
  * 
  * @params options : [{label:"label1",value:"value1"},{label:"label2",value:"value2"}}
  * @params attrs : {
  * 			name:xxxx, //required name of form item
  * 			type:checkbox|radio //required.
  * 			drawOption : function(el, i, attrs ){} //custom drawing,
  * 			             // el=<label>-<input> element, i=index, 
  *			valueType : number(default)|text, if options[i] is string, use number idx or text as value
  * 			onclick : function(){},... //other events are also supported,
  * 			wrapper : true, a wrapper DIV will be added to target, to contain all options
  * 		}
  * @params target //which dom to insert
  * 
  * */
 var $sel = function(options,attrs,target){
	 let {onclick, onchange, value, multiple, valueType, type, name,  wrapper} = attrs || {};
	 delete attrs["onclick"];
	 let values = value===undefined? []: $.isArray(value)?value:value+"";
	 if($.isString(values) || $.isNumber(values))
		 values = `${values}`.split(",") || [];
 
	 var doms = [];
 
	 var vars = attrs['var'];
	 if($.isString(vars)) vars = {values:vars};
 
	 let tar = wrapper? $div({class:'sel-wrapper'}, target) : target;
	 if(vars && tar) {
		 tar.attr("var", vars)
		 tar.onUpdate = (k,v)=>{
			 elog("$sel:changes",k,v,vars)
			 // elog("OPT-vars",vars)
			 let vd = Object.entries(vars).find(([tn, vn])=>vn==k);
			 if(vd){//find target value name <-> outside var name
				 if(vd[0] == "value"){//on value changes
					 tar.find('.sel-option.on').removeClass("on");
					 tar.find('input:checked',(ip)=>ip.checked=false);
					 if(!empty(v)){
						 let qr = v.map(vv=>`.sel-option[value="${vv}"]`).join(",");
						 tar.find(qr,(el)=>{el.addClass("on");el.find1st("input").checked="checked"})
					 }
				 }//TODO: change options
			 }
		 }
	 }
	 this.draw = ()=>{
		 for(let i=0,o;o=options[i];i++){
			 let v = $.isObject(o)?o.value:('text'==valueType?o:i+1), ip;
			 let lb = $label({value:v,html:$.isObject(o)?o.label:o,class:`sel-option ${type} `+(o.class||'')},[
				 ip = $input({type:type, name:name, value:v}).css({display:"block",position:"absolute",left:0,top:"50%",transform:"translateY(-50%)"})
			 ],tar)
			 .bind("click",function(e){
				 // elog("clicked", e.target);
				 let checked = lb.hasClass("on");
				 if(!multiple){
					 lb.parentNode.find(".on",l=>{
						 l.removeClass("on")
						 l.find("input",ip=>ip.checked=false)
					 })
				 }
				 if(!checked){
					 lb.addClass("on")
					 ip.checked="checked";
				 }else if(multiple){
					 lb.removeClass("on")
					 ip.checked=false;
				 }
				 let vs = [...lb.parentNode.find("input:checked")].map(p=>p.value);
				 // elog("checked", checked, vs, ip)
				 if(onchange) onchange.call(ip, {target:ip}, vs, attrs)
				 e.stopPropagation()
				 if(e.target.tagName!='INPUT')
					 e.preventDefault();
			 })
			 .css({position:"relative","text-align":"left",cursor:"pointer"});
 
			 if(values.includes(v+"")) {
				 lb.addClass('on');
				 ip.checked = true;
			 }
			 
			 if(attrs.columns)lb.css({width:100/parseInt(attrs.columns)+"%"});
			 
			 // if(onclick) lb.bind("change",onclick);
			 doms.push(lb);
		 }
		 // elog("doms",doms);
		 return doms;
	 }
 
	 return this.draw();
 };
 
 /** @deprecated use $pick instead */
 var $radio = function(options,attrs,target){
	 attrs = attrs||{};
	 delete attrs["multiple"];
	 attrs.type='radio';
	 return $sel(options,attrs,target);
 };
 //window.RADIO = $radio;
 
 /** @deprecated use $pick instead */
 var $checkbox = function(options,attrs,target){
	 attrs = attrs||{};
	 attrs.multiple=1;
	 attrs.type='checkbox';
	 return $sel(options,attrs,target);
 };
 //window.CHECKBOX = $checkbox;
 
 /** @deprecated use $pick instead */
 var $select = function(values,attrs,target){
	 var ats = {};
	 for(var k in attrs)
		 if(!$.isFunc(attrs[k])&&!$.isObject(attrs[k])&&!$.isArray(attrs[k]))
			 ats[k] = attrs[k]
	 var s = $e("select",ats,target);
	 if($.isArray(values)){
		 for(var i=0,v;v=values[i];i++)
			 $e("option",{value:$.isObject(v)?v.value:i+1,html:$.isObject(v)?v.label:v}, s);
	 }else{
		 for(var k in values){
			 var v = values[k];
			 if(!$.isFunc(v)){
				 $e("option",{value:$.isObject(v)?v.value:k,html:$.isObject(v)?v.label:v}, s);
			 }
		 }
	 }
	 if(attrs.value)
		 s.value = attrs.value;
	 return s;
 };
 
 
 /**
  * for-loop in js code
  * 
  * @param {*} attrs : string like "{{items as item}}" or object like {loop:"{{items}}",as:"item"}
  * @param {*} children : Array of DOMElements
  * @param {*} tar : parent node
  * @example : 
  * $for("{{items}}", [
  * 		$li({i:"{{i}}", html:"{{e.title}}"})
  * ])
  */
 const $for = (attrs, children, tar)=>{
	 attrs = $.isString(attrs) && attrs.match(/^\{\{.+\}\}$/) ? {loop:attrs} : 
			 $.isObject(attrs) && attrs.loop ? attrs : 
			 false && elog('ERR:red','$for requires string like "{{items as item}}" or object like {loop:"{{items}}",as:"item"} as 1st param');
	 children = $.isArray(children) && !empty(children) ? children : 
				$.isElement(children) ? [children] : 
				false && elog('ERR:red','$for requires array of DOMElements as 2nd param');
	 if(!attrs||!children) return;
	 return $template(attrs, children, tar);
 }
 
 /**
  * if condition, inline style
  * @param : array of [func1, elements/array, func2, elements/array, .... , tar (only if odd number of arguments)]
  * @example
	  $for('{{items}}',[
		 $if((e)=>e.price>1000,[
			 $span("1000円~"),
		 ],(e)=>e.price>800,[
			 $span("800円~"),
		 ],(e)=>e.price<=800,[
			 $span("~799円"),
		 ])
	 ]),
  * 
  */
 const $if = function(){
	 let cs = [...arguments];
	 if(empty(cs)) return false && elog("ERR:red", "$if() requires parameters");
	 let tar = cs.length%2==1 ? cs.pop() : false;
	 let ns = [];
	 for(let i=0,c;c=cs[i];i++){
		 if(empty(c)) return false && elog('ERR:red','all arguments of $if() can not be empty');
		 if(i%2==0 && !$.isFunc(c))
			 return false && elog('ERR:red','all `odd` arguments of $if() should be function ');
		 if(i%2==1){
			 if (!$.isElement(c) && !$.isArray(c))
				 return false && elog('ERR:red','all `even` arguments of $if() should be DOMELement of DOMElement array ');
			 ns.push([cs[i-1], $.isElement(c)?[c]:c])
		 }
	 }
	 let dom = $template({type:'conditions',if:(item, el)=>{
		 for(let [c, e] of ns)
			 if (c(item, el)) return e;
	 }});
	 if(tar) tar.appendChild(dom)
	 return dom;
 
 }
 
 
 
 /**
  * add css rules runtime.
  * 
  * @param rules : hash | css string 
  * @example
  * $styles({
  * 	".myClass" : {width:30, height:"40px"},
  *  "#myId" : {width:30, height:"40px"},
  * 	...
  * },document.head);
  *
  * @param target : where to insert
  * @param id : id of the style tag (optional)
  * 
  * @return new style tag id;
  * */
 var $styles=function(rules,target,id=false,className=false){
	 target = target||document.body;
	 var opt = {type:"text/css"};
	 if(id)opt.id = id;
	 if(className)opt.className = className;
	 var cs = $e('style',opt,target);
	 var tn = document.createTextNode("");
	 if(typeof(rules)=="string"){
		 tn.appendData(rules);
	 }else{
		 for(var k in rules){
			 var v = typeof(rules[k])=="string"?rules[k] : $.serialize(rules[k], ";", ":");
			 if($.isFunc(v))continue;
			 tn.appendData([k, "{", v, "}\n"].join(""));
		 }
	 }
	 cs.appendChild(tn);
	 return cs;
 };
 
 /**
  * k > multi-lang text
  */
 const T = function (key) {
	 $.la = $.la || 0;
	 // Supports T`key_name` usage
	 if(Array.isArray(key)) {
		 key = key.reduce((acc, cur, i) => acc + cur + (arguments[i + 1] || ''), '');
	 }
	 var k = key.charAt(0)=='@'?key.substring(1):key;
	 var t = TEXTS&&TEXTS[k]?(TEXTS[k][$.la]||TEXTS[k][0]):false;
	 if(t && t.indexOf('%')>=0 && !Array.isArray(key)){
		 for(let i=1;i<arguments.length;i++){
			 t = t.replace('%s', arguments[i]);
			 t = t.split(`%${i}`).join(arguments[i]);
		 }
	 }
	 return t||key;
 }
 
 const fetch_json = async function(f){const r = await fetch(f);const j = await r.json();return j;}
 
 var $http = {
	 getRequest : function(){
		 return (window.XMLHttpRequest) ? new XMLHttpRequest()/*code for IE7+, Firefox, Chrome, Opera, Safari*/
		 :new ActiveXObject("Microsoft.XMLHTTP"); /*ie5-6*/
	 },
	 
	 /**
	  * 
	  * @param  Object opts
	  *     .url
	  *     .method
	  *     .params
	  *     .callback
	  *     .format
	  *     .onprogress
	  * 	   .content_type : "Content-Type":"application/json"
	  * 
	  */
	 ajax : function(opts){
		 //ajax : function(method, url, params, callback, format, onprogress){
		 if(!opts || !opts.url) throw "ERR: $http.ajax wrong params ";
 
		 var url = $conf.http_host && !opts.url.startsWith("http") ? $conf.http_host+(opts.url.replace(/^file:*\/\//, '')) : opts.url,
			 xhr = $http.getRequest(),
			 params = opts.params||{},
			  format = opts.format||"json",
			  method = opts.method||"GET",
			  callback = opts.callback||null,
			 content_type = opts.content_type||"text/plain;charset=UTF-8",
			 auth = opts.authorization||false;
 
		 
		 var ks = Object.keys(params);
		 for(var i=0,k;k=ks[i++];){
			 if(params[k]===undefined)
				 delete(params[k]);
		 }
		 xhr.runtime = {
			 callback : callback,
			 format : format,
			 url : url,
			 method : method,
			 params : params
		 };
		 if(opts.onprogress)
			 xhr.runtime.onprogress = opts.onprogress;
 
		 var isFile = false;
		 method =method.toUpperCase();
		 var data = method == "UPLOAD"?new FormData():[];//GET does not support formdata
		   if(params){
			 if(content_type.match(/application\/json/) && ($.isArray(params)||$.isObject(params)))
				 data = JSON.stringify(params);
			 else{
				 for (var key in params){
					 var v = params[key];
					 var vs = $.isArray(v)?v:[v];
					 var isf = false;
					 for(var i=0,vi;vi=vs[i++];){
						 if((method == "UPLOAD")&&$.isFile(vi)){
							 var k_ = key.endsWith('[]')?key:key+'[]';
							 data.append(k_,vi,vi.name);
							 isFile=true;
							 isf = true;
						 }
					 }
					 if(!isf){
						 if(method=="UPLOAD"){
						 if($.isObject(v)||$.isArray(v))v=JSON.stringify(v)
							 data.append(key,v);
							 //data.push(encodeURIComponent(key)+'='+(v));
						 }else{
							 data.push(encodeURIComponent(key)+'='+encodeURIComponent(v));
						 }	
					 }
				 }
				 if(method == 'GET'){
					 var prefix = url.indexOf('?')>0 ? '&':'?';
					 url += prefix + data.join('&');
					 data = null;
				 }else if(method != "UPLOAD")
					 data = data.join("&")
			 }
		   }
		 if(method == "UPLOAD"){
			 //method = "POST";
			 isFile = true;
			 xhr.upload.addEventListener("progress", function(e) {
				 var pc = parseInt(100 - (e.loaded / e.total * 100));
				 if(xhr.runtime.onprogress)
					 xhr.runtime.onprogress(pc);
			 }, false);
		 }
		 
		 return new Promise((resolve,reject)=>{
			 xhr.onreadystatechange=function(){
				 if (xhr.readyState==4 ){
					 var res = xhr.responseText;
					 var ctype = xhr.getResponseHeader('content-type') || "";
					 if (xhr.runtime.format === 'json' && res && ctype.match(/(application\/json|text\/plain)/i)) {
						 try{
							 res = JSON.parse(res);
							 let logs = false;
							 if($.isObject(res) && res.__elog){
								 logs = res.__elog;
								 if($.isString(logs))
									 logs = JSON.parse(logs);
								 let u = url.replace(/^https*:\/\//,'').replace(/\?.*/,'');
								 let ms = (new Date().getTime() - parseInt(res.time)*1000)/1000;
								 if($.isArray(logs))
									 logs.forEach(l=>{
										 //TODO :do this outside?
										 if(l.msg && l.msg.template && l.msg.data){
											 let str = l.msg.template
											 if($.isArray(l.msg.data)){
												 for(let v of l.msg.data){
													 str = str.replace('?',`${v}`.match(/[^\d]/)?`'${v}'`:v);
												 }	
											 }else{
												 for(let k in l.msg.data){
													 let v = l.msg.data[k];
													 str = str.split(':'+k).join(`${v}`.match(/[^\d]/)?`'${v}'`:v)
												 }
											 }
											 l.msg = str;
										 }
									 })
								 if(elog.server=='pop'){
									 elog.pop([{label:"URL",msg:`${u} (${ms}s)`},...logs,{label:"RESPONSE",msg:res.data}],$.rand(10000000));
								 }else
									 elog(`[SERVER] ${u} (${ms}s):purple`, {logs:logs, response:res.data});
								 res = res.data;
							 }
						 }catch(ex){
							 var err = $.extend({code:xhr.status,type:"json_error"},xhr.runtime);
							 if($app.onError)$app.onError("http_parse_error",err);
							 if(xhr.runtime.callback)
								 xhr.runtime.callback(null,err)
							 return elog("HTTP-JSON-ERR:red", err);
							 // if(reject)reject(res,err);
						 }
					 }
 
 
					 if(xhr.status==200||xhr.status==205){
						 if((xhr.runtime.format === 'js'||ctype.match(/application\/javascript/i)) && res){
							 try{
								 eval(res);
								 if(resolve)return resolve(res);
							 }catch(e){
								 return elog("HTTP-JS-ERR:red", e);
								 // if(reject)return reject(res,err);
							 }
						 }
						 if(xhr.runtime.callback)
							 return xhr.runtime.callback(res)
						 if(resolve)return resolve(res);
					 }else{
						 var errors = $.extend({
							 code : xhr.status,
							 message : xhr.getResponseHeader("ERROR_MESSAGE"),
							 data : res
						 },xhr.runtime);
						 if($app.onError)$app.onError("http_server_error",errors);
						 if(xhr.runtime.callback)
							 xhr.runtime.callback(null, errors);	
						 
						 if(elog.server=='pop'){
							 elog.pop([{msg:errors, label:'ERROR', location:xhr.status}, {msg:data,label:"res"}],$.rand(10000000));
						 }else
							 elog("HTTP-ERR:red", errors)
						 // if(reject)reject(errors);
					 }
				 }
			 };
			 xhr.open(method == "UPLOAD"?'POST':method,url,true);
			 if(elog.server)
				 xhr.setRequestHeader('ELOG', 'true');
			 xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			 //if(method=='GET')
			 if(method!="UPLOAD")
				 xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			 if(content_type.match(/application\/json/)){
				 xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
			 }
			 if(auth) xhr.setRequestHeader("Authorization", auth);
			 xhr.send(data);
		 })
		   
	 },
	 get : function(url, params, callback, format){
		 return $http.ajax({url:url, method:"GET", params:params, callback:callback, format:format});
	 },
	 post : function(url, params, callback, format){
		 return $http.ajax({url:url, method:"POST", params:params, callback:callback, format:format});
	 },
	 put : function(url, params, callback, format){
		 return $http.ajax({url:url, method:"PUT", params:params, callback:callback, format:format});
	 },
	 del : function(url, params, callback, format){
		 return $http.ajax({url:url, method:"DELETE", params:params, callback:callback, format:format});
	 },
	 upload : function(url, params, callback, format, onprogress){
		 return $http.ajax({url:url, method:"UPLOAD", params:params, callback:callback, format:format, onprogress:onprogress});
	 },
	 postJSON : function(url,params,callback,format){
		 return $http.ajax({url:url, method:"POST", params:params, callback:callback, format:format,
			 'content_type':'application/json'
		 });
	 }
 };
 
 var empty = function(o){
	 if(!o||o==='')return true;
	 if($.isObject(o)&&Object.keys(o).length==0)return true;
	 if($.isArray(o)&&o.length==0)return true;
	 return false;
 }
 var parse_str = function(str){
	 var rs={};
	 str.replace(/^.*\?/,'').split('&').forEach(e=>{let es=e.split('=');rs[es[0]]=es[1]});
	 return rs;
 }
 
 var htmlencode = function(str) {
	 if(!$.isString(str)) return str;
	 if(!$.__HTML_ESC_EXP){
		 $.__HTML_ESC_REV=[];
		 for(var k in $.__HTML_ESC)
			 $.__HTML_ESC_REV[$.__HTML_ESC[k]]=k;
		 $.__HTML_ESC_EXP = new RegExp("["+Object.keys($.__HTML_ESC_REV).join("")+"]","giu");
	 }
	 return str.replace($.__HTML_ESC_EXP,function(x){
		 var v = $.__HTML_ESC_REV[x.substring(1,x.length-1)];
		 return v?"&"+v+";":x;
	 });
 }
 
 var htmldecode = function(str) {
	 if(!$.isString(str)) return str;
	 if(!$.__HTML_ESC_DEXP)
		 $.__HTML_ESC_DEXP = new RegExp("&("+Object.keys($.__HTML_ESC).join("|")+");","giu");
	 return str.replace($.__HTML_ESC_DEXP,function(x){
		 return $.__HTML_ESC[x.substring(1,x.length-1)]||x;
	 });
 };
 
 var is_safari_private_mode = function(cb){
	 var storage = window.sessionStorage;
	 try {
		 storage.setItem("_test_key", "test");
		 storage.removeItem("_test_key");
	 } catch (e) {
		 if (e.code === DOMException.QUOTA_EXCEEDED_ERR && storage.length === 0)
			 return true;
	 }
	 return false;
 }
 
 //its just a wrapper of server side
 var $cache = {
	 init : function(){
		 $cache.prefix = location.hostname+"-";
		 // if(!$cache.prefix) $app.page_prefix=$cache.prefix=new Date().getTime()+"_";
	 },
	 get : function(key){
		 $cache.init();
		 return localStorage.getItem($cache.prefix+key);
	 },
	 set : function(key,value){
		 $cache.init();
		 if(!is_safari_private_mode()){
			 localStorage.setItem($cache.prefix+key,value);
		 }	
	 },
	 del : function(key){
		 $cache.init();
		 if(!is_safari_private_mode())
			 localStorage.removeItem($cache.prefix+key);
	 },
	 incr : function(key,v){
		 $cache.init();
		 v = v||1;
		 var x = $cache.get(key)||0;
		 $cache.set(key,v+x);
	 },
 }
 
 
 // var $push = {
 // 	enabled : false,
 // 	config : function(){
 // 		if (!('showNotification' in ServiceWorkerRegistration.prototype))  
 // 			return console.warn('Notifications aren\'t supported.');    
	 
 // 		if (Notification.permission === 'denied')
 // 			return console.warn('The user has blocked notifications.');    
	 
 // 		if (!('PushManager' in window))
 // 			return console.warn('Push messaging isn\'t supported.');    
	 
 // 		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
 // 		// Do we already have a push message subscription?  
 // 		serviceWorkerRegistration.pushManager.getSubscription()  
 // 			.then(function(subscription) {  
 // 				if (!subscription) {  
 // 					// We aren't subscribed to push, so set UI  
 // 					// to allow the user to enable push  
 // 					return;  
 // 				}
 // 				// Keep your server in sync with the latest subscriptionId
 // 				sendSubscriptionToServer(subscription);
 // 			})  
 // 			.catch(function(err) {  
 // 				console.warn('Error during getSubscription()', err);  
 // 			});  
 // 		});  
 // 	},
 // 	subscribe : function(){
 // 		if(!navigator.serviceWorker)return;
 // 		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
 // 			serviceWorkerRegistration.pushManager.subscribe()  
 // 			  .then(function(subscription) {  
 // 				$push.enabled = true;  
 // 				// TODO: Send the subscription.endpoint to your server  
 // 				// and save it to send a push message at a later date
 // 				return sendSubscriptionToServer(subscription);  
 // 			  })  
 // 			  .catch(function(e) {  
 // 				if (Notification.permission === 'denied') {  
 // 				} else {  
 // 				  console.error('Unable to subscribe to push.', e);  
 // 				}  
 // 			  });  
 // 		  });  
 // 	}
 // }
 
 
 var $fcm = {
	 _project : false,
	 _saveToken : false,
	 _oauthToken : false,
	 _oauthTokenURL : false,
	 init : function(proj,f_save_token,oauth_token_url){
		 $fcm._project = proj;
		 $fcm._saveToken = f_save_token;
		 $fcm._oauthTokenURL = oauth_token_url;
		 const messaging = firebase.messaging();
		 messaging.requestPermission()
		 .then(function() {
			 // console.log('Notification permission granted.');
			 // TODO(developer): Retrieve an Instance ID token for use with FCM.
			 $fcm.getToken()
		 })
		 .catch(function(err) {
			 // console.log('Unable to get permission to notify.', err);
		 });
	 },
 
	 getToken : function(){
		 var cb = $fcm._saveToken||function(){}
		 const messaging = firebase.messaging();
		 messaging.getToken()
		 .then(function(currentToken) {
			 if (currentToken) {
				 cb(currentToken);
				 // $fcm.test(currentToken);
			 } else {
				 // Show permission request.
				 console.log('No Instance ID token available. Request permission to generate one.');
				 // Show permission UI.
				 updateUIForPushPermissionRequired();
				 cb(false);
			 }
		 })
		 .catch(function(err) {
			 console.log('An error occurred while retrieving token. ', err);
			 cb(false);
		 });
 
		 messaging.onTokenRefresh($fcm.getToken);
	 },
	 
 }
 
 const $pop = (name,content,opts={})=>{
	 if(!name || !content) return;
	 if(!$app.popups){
		 $app.pops = [];
		 $app.v_pops = $app.v_pops || $div({class:'pops'},document.body);
	 }
	 const dom = $div({ class: 'pop', name: name }, [
		 $div({ class: 'dismiss' }).bind('click', () => $pop.close(name)),
		 $div({ class: 'window', name:name }, [
			 $div({ class: 'content' }, $.isArray(content)?content:[content]),
			 $i({ class: 'icon close'}).bind('click', () => $pop.close(name))
		 ])
	 ], $app.v_pops);
	 requestAnimationFrame(() => dom.classList.add('active'));
 }
 $pop.close = (name)=>{
	 if(!$app.v_pops) return;
	 if(empty(name)) $app.v_pops.innerHTML = "";
	 else $app.v_pops.find(`div[name="${name}"]`,e=>{
		 e.classList.remove('active');
		 e.addEventListener('transitionend', () => {
			 e.remove();
		 })
		 if(!$pop.noticed && name==$this.name){
			 $pop.noticed = true;
			 $this.close();
			 $pop.noticed = false;
		 }
	 })
 }
 
 