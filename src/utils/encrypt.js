import JSEncrypt from 'jsencrypt/bin/jsencrypt'
let encryptor = new JSEncrypt()
let publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJjMxhztoUfs2XaX8+Ck5h1LSGXeBziDCJyoODjJ8mNe+8BoatdGZvFGoS1QTfMaPWfJzWeE/c9wqsuN20+HWEECAwEAAQ=='

encryptor.setPublicKey(publicKey)

function encrypt(inputStr) {
    return encryptor.encrypt(inputStr)
}

export default encrypt