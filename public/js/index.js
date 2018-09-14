function setup() {
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let pre = document.getElementById("predictions");
  let model = null;
  const MODEL_FILE_URL = '/model/web_model.pb';
const WEIGHT_MANIFEST_FILE_URL = '/model/weights_manifest.json';
const INPUT_NODE_NAME = 'input';
const OUTPUT_NODE_NAME = 'final_result';
const PREPROCESS_DIVISOR = tf.scalar(255 / 2);
   const VIDEO_PIXELS = 224;

  async function startCamera() {
//     Webcam.set({
//         width: 1024,
//         height: 768
//     });
    Webcam.attach("#video");
  }

  function takeSnapshot() {
    if(!Webcam.loaded){
      startCamera();
    }
    let real_video = video.getElementsByTagName("video")[0];;
    let context = canvas.getContext("2d"),
      width = real_video.videoWidth,
      height = real_video.videoHeight;

    if (width && height) {
      // Setup a canvas with the same dimensions as the video.
      canvas.width = width;
      canvas.height = height;
    }
    
    if(Webcam.loaded){
      Webcam.snap( () => {
        // accept a paramter:data_uri
          },  canvas);
      classifyImage();
      }
  }

  async function classifyImage() {
        const pixels = tf.fromPixels(canvas);
        const centerHeight = pixels.shape[0] / 2;
        const beginHeight = centerHeight - (VIDEO_PIXELS / 2);
        const centerWidth = pixels.shape[1] / 2;
        const beginWidth = centerWidth - (VIDEO_PIXELS / 2);
        const pixelsCropped =
              pixels.slice([beginHeight, beginWidth, 0],
                           [VIDEO_PIXELS, VIDEO_PIXELS, 3]);
    predictions = predict(pixelsCropped)
    topK = getTopKClasses(predictions,10)
    displayPredictions(topK);
  }

  function displayPredictions(predictions) {
    let result;
    
//     predictions = predictions.filter(prediction =>{return (prediction.probability > 0.05)})
//                         .sort((prod1, prod2) => {return prod1.probability < prod2.probability});
    
    result = predictions.reduce((val, prod) => {
      return val + "\n" + prod.label + ":" + prod.value
    }, "")
    pre.innerHTML = result;
  }

  async function main() {
    pre.innerHTML = "Opening Camera...."
    await startCamera();
    
    pre.innerHTML = "Loading Model...."
    model = await tf.loadFrozenModel(
      MODEL_FILE_URL,
      WEIGHT_MANIFEST_FILE_URL
    );
    
    pre.innerHTML = "Loaded Model...."
    setInterval(() => takeSnapshot(), 1000);
  }

  function predict(input){
    const preprocessedInput = tf.div(
        tf.sub(input.asType('float32'), PREPROCESS_DIVISOR),
        PREPROCESS_DIVISOR);
    const reshapedInput =
        preprocessedInput.reshape([1, ...preprocessedInput.shape]);
    const dict = {};
    dict[INPUT_NODE_NAME] = reshapedInput;
    return model.execute(dict, OUTPUT_NODE_NAME);
  }

  function getTopKClasses(predictions, topK){
    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList.sort((a, b) => {
      return b.value - a.value;
    }).slice(0, topK);

    return predictionList.map(x => {
      return {label: SCAVENGER_CLASSES[x.index], value: x.value};
    });
  }
  
  
  main();
}