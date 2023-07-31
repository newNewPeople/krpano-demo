<template>
    <div class="test">
  
    </div>
  </template>
  
  <script>
      import axios from "axios"
    export default {
      name : 'jszip',
      data() {
    return {

    }
  },
mounted() {
    const JSZip = require('jszip');


axios({
    url: "https://cdn.jiajutech.com/jiaju/xr/2023/7/27/d11cecc8-2050-49ce-8395-c37b0843f32d_pngZip.7z",
    method: 'GET',
    responseType: 'arraybuffer'
}).then(response => {
    console.log("response",response)
    
    const new_zip = new JSZip();
    
    new_zip.loadAsync(response.data).then(function (zip) {
        zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
            console.log("entry: ", zipEntry.name);
            if(zipEntry.name.endsWith('.png')) {
                zip.file(zipEntry.name).async('arraybuffer').then(function (content) {
                    // 内容是图片文件的内容，你可以使用它
                });
            }
        });
    });
});

  },
  destroyed() {

  },
  methods: {


  }
    }
  </script>
  <style lang='less'>
   
  </style>
  