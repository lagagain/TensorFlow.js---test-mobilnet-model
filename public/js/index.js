function setup() {
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let pre = document.getElementById("predictions");
  let model = null;

  async function startCamera() {
    
        Webcam.attach("#video");
    setInterval(() => takeSnapshot(), 1000);
  }

  function takeSnapshot() {
    let context = canvas.getContext("2d"),
      width = video.videoWidth,
      height = video.videoHeight;
    
    if(Webcam.loaded){
      Webcam.snap( () => {
        // accept a paramter:data_uri
          },  canvas);
    
      classifyImage();
      }
  }

  async function classifyImage() {
    predictions = await model.classify(canvas);
    displayPredictions(predictions);
  }

  function displayPredictions(predictions) {
    let result;
    
    predictions = predictions.filter(prediction =>{return (prediction.probability > 0.05)});
    predictions = predictions.sort((prod1, prod2) => {return prod1.probability < prod2.probability})
    
    result = predictions.reduce((val, prod) => {
      return val + "\n" + prod.className + ":" + prod.probability
    }, "")
    pre.innerHTML = result;
  }

  async function main() {
    pre.innerHTML = "Opening Camera...."
    await startCamera();
    
    pre.innerHTML = "Loading Model...."
    model = await mobilenet.load();
  }

  main();
}