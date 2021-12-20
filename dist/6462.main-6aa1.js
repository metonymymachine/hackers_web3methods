"use strict";(self.webpackChunkborder=self.webpackChunkborder||[]).push([[6462],{76522:(e,n,t)=>{t.d(n,{e:()=>r,m:()=>a});var r=function(e){var n=e.currentWallet,t=e.selectedWallet;return n?'\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    We have detected that you already have\n    <b>'.concat(n,"</b>\n    installed. If you would prefer to use\n    <b>").concat(t,'</b>\n    instead, then click below to install.\n    </p>\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    <b>Tip:</b>\n    If you already have ').concat(t,' installed, check your\n    browser extension settings to make sure that you have it enabled\n    and that you have disabled any other browser extension wallets.\n    <span\n      class="bn-onboard-clickable"\n      style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;"\n      onclick="window.location.reload();">\n      Then refresh the page.\n    </span>\n    </p>\n    '):'\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    You\'ll need to install <b>'.concat(t,'</b> to continue. Once you have it installed, go ahead and\n    <span\n    class="bn-onboard-clickable"\n      style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;"\n      onclick={window.location.reload();}>\n      refresh the page.\n    </span>\n    ').concat("Opera"===t?'<br><br><i>Hint: If you already have Opera installed, make sure that your web3 wallet is <a style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;" class="bn-onboard-clickable" href="https://help.opera.com/en/touch/crypto-wallet/" rel="noreferrer noopener" target="_blank">enabled</a></i>':"","\n    </p>\n    ")},a=function(e){var n=e.selectedWallet;return'\n  <p style="font-size: 0.889rem;">\n  Tap the button below to <b>Open '.concat(n,"</b>. Please access this site on ").concat(n,"'s in-app browser for a seamless experience.\n  </p>\n  ")}},56462:(e,n,t)=>{t.r(n),t.d(n,{default:()=>l});var r=t(76522),a=t(25108);function o(e,n,t,r,a,o,i){try{var l=e[o](i),s=l.value}catch(e){return void t(e)}l.done?n(s):Promise.resolve(s).then(r,a)}function i(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var i=e.apply(n,t);function l(e){o(i,r,a,l,s,"next",e)}function s(e){o(i,r,a,l,s,"throw",e)}l(void 0)}))}}const l=function(e){var n,o=e.preferred,l=e.label,s=e.svg,c=e.rpcUrl;return{name:l||"wallet.io",svg:s||'\n<svg  width="40" height="40"  viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n\x3c!-- Generator: Sketch 61 (89581) - https://sketch.com --\x3e\n<title>io</title>\n<desc>Created with Sketch.</desc>\n<defs>\n    <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-1">\n        <stop stop-color="#1550FF" offset="0%"></stop>\n        <stop stop-color="#0D8DFF" offset="100%"></stop>\n    </linearGradient>\n</defs>\n<g id="io" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(0.000000, 0.000000)">\n    <g id="编组">\n        <rect id="矩形" fill="url(#linearGradient-1)" x="0" y="0" width="1024" height="1024" rx="192"></rect>\n        <g id="2" transform="translate(142.000000, 354.000000)" fill="#FFFFFF" fill-rule="nonzero">\n            <path d="M731.739038,157.885431 L653.658027,240.742988 C643.041073,252.009426 625.301078,252.535937 614.03464,241.918982 C612.84708,240.799883 611.75951,239.579221 610.784322,238.270905 L529.136156,128.731487 C521.006704,117.824991 521.881341,102.656017 531.210479,92.7561767 L609.29149,9.89862053 C619.908444,-1.36781768 637.648439,-1.89432843 648.914877,8.72262585 C650.102437,9.84172546 651.190007,11.0623873 652.165195,12.3707028 L733.813361,121.910121 C741.942813,132.816618 741.068176,147.985591 731.739038,157.885431 Z" id="路径"></path>\n            <path d="M586.491167,312.367718 L508.410156,395.225274 C497.793202,406.491713 480.053207,407.018223 468.786769,396.401269 C467.599209,395.282169 466.511639,394.061508 465.536451,392.753192 L268.220049,128.032931 C260.090597,117.126435 260.965235,101.957461 270.294372,92.0576207 L348.375384,9.20006454 C358.992338,-2.06637367 376.732333,-2.59288442 387.998771,8.02406986 C389.18633,9.14316947 390.2739,10.3638313 391.249089,11.6721468 L588.56549,276.392408 C596.694942,287.298904 595.820305,302.467878 586.491167,312.367718 Z" id="路径" opacity="0.75"></path>\n            <path d="M586.345922,312.172858 L508.264911,395.030414 C497.647957,406.296852 479.907962,406.823363 468.641524,396.206409 C467.453965,395.087309 466.366395,393.866647 465.391206,392.558332 L369.686767,264.160976 L486.808283,139.874642 L588.420246,276.197548 C596.549698,287.104044 595.67506,302.273017 586.345922,312.172858 Z" id="路径"></path>\n            <path d="M128.683329,11.9400119 L325.99973,276.660273 C334.129182,287.566769 333.254545,302.735743 323.925407,312.635583 L245.844396,395.493139 C235.227442,406.759578 217.487447,407.286088 206.221009,396.669134 C205.033449,395.550035 203.945879,394.329373 202.970691,393.021057 L5.65428933,128.300796 C-2.47516249,117.3943 -1.60052498,102.225326 7.72861266,92.3254858 L85.8096237,9.46792962 C96.426578,-1.79850858 114.166573,-2.32501933 125.433011,8.29193494 C126.620571,9.41103455 127.708141,10.6316964 128.683329,11.9400119 Z" id="路径" opacity="0.5"></path>\n            <path d="M224.568875,140.58034 L326.180837,276.903246 C334.310289,287.809742 333.435651,302.978716 324.106514,312.878556 L246.025503,395.736112 C235.408548,407.002551 217.668554,407.529061 206.402115,396.912107 C205.214556,395.793008 204.126986,394.572346 203.151797,393.26403 L107.447358,264.866675 L224.568875,140.58034 Z" id="路径" opacity="0.5"></path>\n        </g>\n    </g>\n</g>\n</svg>\n',wallet:(n=i(regeneratorRuntime.mark((function e(n){var r,o,l,s,d,u,p,h,f;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=n.getProviderName,o=n.getAddress,l=n.getNetwork,s=n.getBalance,d=window.ethereum||window.web3&&window.web3.currentProvider,!(u="wallet.io"===r(d))||!c){e.next=7;break}return e.next=6,Promise.all([t.e(9826),t.e(8090),t.e(8142),t.e(795),t.e(9835),t.e(2601),t.e(9342)]).then(t.bind(t,12601));case 6:p=e.sent.default;case 7:return h=p?p({rpcUrl:c}):null,f=!1,e.abrupt("return",{provider:d,interface:u?{address:{get:function(){return o(d)}},network:{get:function(){return l(d)}},balance:{get:function(){var e=i(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(h){e.next=3;break}return f||(a.warn('The wallet.io Wallet provider does not allow rpc calls preventing Onboard.js from getting the balance. You can pass in a "rpcUrl" to the wallet.io Wallet initialization object to get the balance.'),f=!0),e.abrupt("return",null);case 3:return e.next=5,o(d);case 5:return n=e.sent,e.abrupt("return",s(h,n));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},name:r(d)}:null});case 10:case"end":return e.stop()}}),e)}))),function(e){return n.apply(this,arguments)}),type:"injected",link:"http://wallet.io/",installMessage:r.m,mobile:!0,preferred:o}}}}]);