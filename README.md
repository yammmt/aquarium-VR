# aquarium-VR
Cardboard 的なものでみると立体視ができるあれ
## 使い方
1. index.html をブラウザ (Firefox) で開くと, 魚らしき物体が三体動いているのが見える.
2. index.html をテキストエディタ (メモ帳など) で開く.
3. init(); と animate(); の間に色々書いてある.
4. 例えば, 38 行目の "lightblue" を "red" に変えてみる.
5. 1 で開いたときに水色 (みたいな色) だった魚が赤色に変わっているのがわかる.
6. 他にも色々変えてみる. 下参照

## addFish()
- name: 魚の種類を変えられる. A, B, C に対応.
- x: 魚の現れる位置を変えられる. 
- y: 魚の現れる位置を変えられる. 負の値は無効.
- z: 魚の現れる位置を変えられる. 
- color: 魚の色を変えられる. 変えられる色は, http://www.colordic.org/ に名前のある色 (blue とか darkgreen とか olive とか)
- scale: 魚の大きさを変えられる. 大きいほど魚も大きくなる. 
- speed: 魚の泳ぐ速さを変えられる. 大きいほど速い. 
- direction: 魚の泳ぐ向きを変えられる. X か Y のどちらか.
それぞれの値を設定しない場合, scale と speed は固定値を, それ以外の値はランダム値をとります. 

参考 : http://vr.chromeexperiments.com/  
テクスチャ : http://exor-stock.deviantart.com/art/poolwater-9200603
