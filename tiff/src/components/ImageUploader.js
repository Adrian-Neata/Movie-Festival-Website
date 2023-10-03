import Axios from "axios";

function ImageUploader() {
    const postImage = e => {
        e.preventDefault();
        const file = document.getElementById("inputGroupFile01").files;
        const formData = new FormData();
    
        formData.append("img", file[0]);
    
        Axios({
          method: "POST",
          url: "http://localhost:5000/image",
          headers: {
            "Content-Type": "application/json"
          },
          data: formData,
        }).then(res => {
          document.getElementById("img").setAttribute("src", `http://localhost:5000/image/${file[0].name}`);
        console.log(file[0]);
        }).catch(err => {
          console.log(err)
        });
    
    };

    return (
        <>
        <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile01"
              aria-describedby="inputGroupFileAddon01"
            />
            <label className="custom-file-label" htmlFor="inputGroupFile01">
              Choose file
            </label>
          </div>

          <button type="button" className="btn btn-primary" onClick={postImage}>Upload</button>
        <img id="img" style={{ display: "block" }} src='http://localhost:5000/image/lab.png'></img>

        </>
    )

}

export default ImageUploader