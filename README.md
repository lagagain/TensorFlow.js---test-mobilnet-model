# TensorFlow.js---test-mobilnet-model

這是參考[TensorFlow.js中其中一個Demo](https://emojiscavengerhunt.withgoogle.com/)。主要是為了瞭解Tensorflow
的運作方式，所以直接使用了DEMO給的模型來玩。

開啓後，會針對相機畫面判斷各個物品的機率。總之[直接開來](https://lagagain.github.io/TensorFlow.js---test-mobilnet-model/public/)看看吧。


# 需求

可能要使用Firefox才能進行。Chrome好像調整過API....


# 本地使用

非常簡單，將`public`目錄設爲HTTP-Server的根目錄就行了。甚至應該可以直接開啓`public/index.html`

## 可能遇到的問題

相機在文件中說明需要HTTPS才會開啓，尤其在Chrome一定要走HTTPS協定(localhost好像就沒差)。
