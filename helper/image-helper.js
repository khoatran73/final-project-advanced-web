module.exports = function imageHelper(file) {
    if (!file.mimetype.match(/image.*/)) {
        return JSON.stringify({ code: 1, message: "Chỉ hổ trợ định dạng hình ảnh" })
    } else if (file.size > (1024 * 1024 * 5)) {
        return JSON.stringify({ code: 1, message: "Size ảnh không được quá 5MB" })
    } else {
        return JSON.stringify({ code: 0, message: "ok" })
    }
}