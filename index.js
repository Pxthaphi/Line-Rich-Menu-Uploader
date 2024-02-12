const richmenu = require('./uploader')

function main() {
  const setting = new richmenu({
    accessToken: '', // Channel AccessToken
    richMenuData: {

    },
    imagePath: 'assets/img/.png' 
  })
  setting.run()
}

main()