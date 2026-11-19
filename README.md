# CertAtlas

IT資格の学習サイトです。カタログから資格を選び、専用の学習室で演習と復習に取り組めます。

公開URL　[https://shikaku-atlas.neatsaffron.chatgpt.site](https://shikaku-atlas.neatsaffron.chatgpt.site)

閲覧には、利用権限のあるChatGPTアカウントでのログインが必要です。

## 問題データ

- `data.js` … 資格カタログ(資格IDは並び順で決まるため、追加は各グループの末尾に)
- `data/bank-index.js` … 資格ごとの問題数(カタログ表示用)
- `data/bank/<資格ID>.json` … 問題本体。学習室を開いたときに読み込む
  - `type`: single / multiple / fill(入力式) / written(記述式・自己採点)
  - `why`: 選択肢ごとの解説。`mark` は選択肢中の誤っている部分(画面で赤い波線を引く)、`reason` はその説明
- 収録元: IT資格統括サイト用データ(各資格20問のオリジナル想定問題)、LPIC 学習ルームの模擬試験348問(LPIC-1)、既存の基本問題

## 演習画面の操作

- 選択肢を選んだ直後に正誤と解説を表示(複数選択は指定数を選んだ時点)
- 画面上部の番号で各問題の合否を色表示(緑=正解・赤=不正解・灰=未回答)。押すとその問題へ移動
- キー操作: 1〜5 で選択、Enter で次の問題、← → で問題を移動
