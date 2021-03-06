const fs = require("fs")
const ytdl = require("ytdl-core")


async function downloadVideo(obj, finish) {

    // const info = await ytdl.getInfo(URL.replace('https://www.youtube.com/watch?v=', ''))

    // const titleVideo = info.title

    const video = ytdl(obj.url)

    video.pipe(fs.createWriteStream(`src/videos/${obj.title}.mp4`))

    let starttime = 0
    video.once("response", () => starttime = Date.now())

    video.on("progress", (chunkLength, downloaded, total) => {
        const percent = downloaded / total
        const downloadedSeconds = (Date.now() - starttime) / 1000

        const friedlyPercentage = Number((percent * 100).toFixed(2))
        const downloadedMbs = Number((downloaded / 1024 / 1024).toFixed(2))
        const totalInMbs = Number((total / 1024 / 1024).toFixed(2))
        const estimatedLeft = parseInt(downloadedSeconds / percent - downloadedSeconds, 10)

        const percentStr = `${friedlyPercentage}%`
        const downloadedMbStr = `${downloadedMbs}MB(s) of ${totalInMbs}MB(s)`
        const estimatedLeftStr = `${estimatedLeft} second(s)`

        if (downloaded !== total) {
            console.log(
                `> ${percentStr} downloaded - ${downloadedMbStr} - estimated time left: ${estimatedLeftStr}`
            )
        } else {
            console.log(`✅ Video downloaded. It took: ${downloadedSeconds}second(s) for download process.`)
        }
    })

    video.on('finish', () => finish({ video: `${obj.title}.mp4` }))
}

module.exports = downloadVideo
