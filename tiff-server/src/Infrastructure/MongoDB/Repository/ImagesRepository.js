const gfs = require('..').getGFS;

const getImageByName = async (req, res) => {
    resGFS = await gfs()

    file = await resGFS.files.find({ filename: req.params.filename }).toArray(function (err, files) {
        if (err !== null) {
            return res.status(400).json({
                err: "Something went wrong"
            });
        }

        file = files[0]
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists"
            });
        }

        // Check if image
        if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
            // Read output to browser
            const readstream = resGFS.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({err: "Not an image"});
        }
    
    })
        
    
}
module.exports = {
    getImageByName
}