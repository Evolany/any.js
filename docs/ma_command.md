# miniapp SDK commands

### ローカルの開発環境初期化
```Bash
make dev
```

### 同期化
最新のbot設定(app.json) サーバ側の更新をローカルにマージ
```Bash
make pull mod=dev|stg|prod|$your_special_bucket bid=$bid
```

### 本番やstgへの公開
```Bash
make push mod= dev|stg|prod| $your_special_bucket bid=$your_bid
```