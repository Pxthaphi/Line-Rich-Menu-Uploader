const axios = require('axios')
const fs = require('fs')

class Richmenu {
    constructor(data) {
      this.accessToken = data.accessToken
      this.richMenuId = ''
      this.richMenuData = data.richMenuData
      this.imagePath = data.imagePath
    }
  
    run () {
      this._RichmenuCreate().then(richMenuId => {
        return this._RichmenuUploadImage(richMenuId)
      }).then(() => {
        return this._RichmenuSet()
      }).then(() => {
        console.log('Richmenu ตั้งค่าเสร็จสมบูรณ์')
      }).catch(() => {
        console.log('ไม่สามารถดำเนินการได้')
      })
    }
  
    // สร้าง rich menu
    _RichmenuCreate () {
      return new Promise((resolve, reject) => {
        let vm = this
        axios.post('https://api.line.me/v2/bot/richmenu', vm.richMenuData, {
          headers: {
            'Authorization': `Bearer ${vm.accessToken}`,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          console.log('_RichmenuCreate =>', res.data)
          vm.richMenuId = res.data.richMenuId
          resolve(res.data.richMenuId)
        }).catch(err => {
          console.log('[ERROR] _RichmenuCreate => ', err.response.status , err.response.statusText)
          reject(err)
        })
      })
    }
  
    // อัพโหลดรูปภาพ rich menu
    _RichmenuUploadImage (richMenuId) {
      return new Promise((resolve, reject) => {
        let vm = this
        fs.readFile(vm.imagePath, function (err, image) {
          if (err) {
            throw err
          }
          axios.post(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content `, image, {
            headers: {
              'Authorization': `Bearer ${vm.accessToken}`,
              'Content-Type': 'image/png'
            }
          }).then(res => {
            console.log('_RichmenuUploadImage =>', res.data)
            if (res.data) {
              resolve()
            }
          }).catch(err => {
            console.log('[ERROR] _RichmenuUploadImage =>', err.response.status , err.response.statusText)
            reject(err)
          })
        })
      })
    }
  
    // ตั้งค่า rich menu เป็นค่าเริ่มต้น ของ ทุกๆ User
    _RichmenuSet () {
      return new Promise((resolve, reject) => {
        let vm = this
        axios.post(`https://api.line.me/v2/bot/user/all/richmenu/${vm.richMenuId}`, {}, {
          headers: {
            'Authorization': `Bearer ${vm.accessToken}`
          }
        }).then(res => {
          resolve()
        }).catch(err => {
          console.log('[ERROR] _RichmenuSet =>',err)
          reject(err)
        })
      })
    }
  }
  
  module.exports = Richmenu