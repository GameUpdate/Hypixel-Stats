module.exports = async (err) => {
    console.log(err)
}

process.on('unhandledRejection', error => {
    return
});