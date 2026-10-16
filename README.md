# 松櫻祭 · 集章 PWA

獨立於 [官網](https://github.com/fearnot221/evergreenbloom) 的集章服務。
只有一份部署設定：**docker-compose.yml**。一個 Node 24 容器同時提供前端與 API，
使用內建 SQLite，資料庫及待審照片保存在 named volume game-data。
沒有額外的 Compose profile、override、資料庫服務或套件依賴。

## 啟動

    cp .env.example .env

在 .env 填入：

- STAFF_USERNAME：首次建立的工作人員帳號（3 至 32 個英數、點、底線或連字號）。
- STAFF_PASSWORD：至少 12 個字元的工作人員密碼，不要使用範例或共用密碼。
- STAMP_KEYS：JSON 物件，包含 lake、library、gate 三個各不相同的現場代碼。
  每個代碼為 16 至 80 個大寫英數或連字號；可各執行一次 openssl rand -hex 16
  並轉成大寫。不要把代碼或 .env 提交至公開 repo。
- APP_ORIGIN：瀏覽器實際使用的完整 origin，不含結尾斜線。預設 http://localhost:8080 。
  正式環境必須是 HTTPS，例如 https://play.example.org （尚未指定正式網址）。
- PWA_PORT：本機映射埠，預設 8080。若修改，APP_ORIGIN 的埠也要對應。
- VITE_WEBSITE_URL：官網網址；這一項改動需要重新建置前端。

    docker compose up -d --build --wait
    docker compose logs -f

開啟 http://localhost:8080/play ，加入主畫面後從 /game 註冊、登入與集章。
工作人員用同一套帳密登入 /staff，不使用管理金鑰。
啟動時未設定必要密碼或現場代碼會直接失敗，不會默默使用公開測試值。
若本機已由代理人建立 .env，隨機產生的工作人員帳密與現場代碼就在該檔案，
只用於本機驗證；正式部署請重新設定。

正式伺服器需自行設定 HTTPS 反向代理，轉送至本機埠。預設僅綁定 loopback；
不會將未加密 API 或資料庫埠開放到外網。代理不得改寫瀏覽器的 Origin。
確定正式 PWA origin 後，再設定官網的 VITE_PWA_URL 並重部署官網。

## 登入與權限

參加者可自行註冊帳密帳號；公開註冊永遠只能取得 player 角色。
密碼使用隨機 salt 與 scrypt 雜湊，不存明碼；登入使用隨機 HttpOnly、
SameSite=Lax Cookie，資料庫只保存 session token 雜湊，有效期 7 天。
HTTPS origin 會加上 Secure。登出立即撤銷該 session；不能以客戶端送出的角色或
user ID 冒充工作人員。所有寫入 API 要求正確 Origin，並有基本頻率與大小限制。

STAFF_USERNAME 是啟動時建立的 staff 帳號。維持同一帳號並更換
STAFF_PASSWORD 後重新建立容器，會更新密碼並撤銷該工作人員的舊 session。
更換 STAFF_USERNAME 會新增另一個工作人員，不會撤銷舊帳號的角色；撤銷或額外角色
管理目前須由受信任的資料庫管理者處理。沒有公開提權 API。

SSO 尚未串接，沒有自助找回密碼或 email 流程。未來 SSO 必須明確連結到既有 user ID，
不能只比對使用者名稱就視為同一人。不同帳號可能屬於同一個人；現階段限制的是
**每個帳號一次**，不宣稱能辨識自然人。

## 驗章與兌獎

現場 QR：<PWA origin>/stamp/<spot>?k=<private-code>。
既有 LAKE-26 / BOOK-26 / GATE-26 公開示範碼已停用；請在設定新代碼後重新製作 QR。

- 掃碼：伺服器檢查該點代碼，再寫入自己的集章紀錄。
- 問答：代碼及答案都由伺服器核對；正解不再打包到前端。
- 拍照：使用者明確同意後，上傳 JPEG / PNG / WebP，最多 3 MB；伺服器檢查檔頭與
  大小，先列待審。工作人員在 /staff 查看照片並通過，才由伺服器發章。
  檔頭檢查不代表內容符合任務，仍須人工確認。退回可重傳；重傳會換審核 ID，
  避免舊照片的畫面批准到新照片。
- 照片通過或退回時移除影像欄位，保留狀態、同意時間、審核帳號與時間。
  逾 7 天未處理的照片在 API 請求或每小時清理時退回並移除影像。
  資料庫舊頁面、WAL 或備份仍需依主辦單位保存政策處理，不能當成實體抹除承諾。
- 集滿所有伺服器有效章後顯示隨機兌獎碼。工作人員先查詢資格、確認發放，再核銷。
  伺服器交易重新檢查資格，並以 UNIQUE(user_id) 保證重送或同時核銷仍只留一筆。
  紀錄含編號、參加者、伺服器時間、核銷帳號與章數；無刪改紀錄的 API。
  工作人員頁顯示最近 100 筆，完整歷史仍在資料庫。

章、session、照片與兌獎 API 全部 no-store，service worker 明確略過 /api/。
離線只保留 App 與說明；不會在離線時發章、核銷或先顯示假成功。
舊版 localStorage 章不匯入有效紀錄。已安裝的舊 App 需連線，關閉所有舊分頁／視窗後
重新開啟，讓新版 worker 啟用。

現場代碼只證明持有代碼，不能防止拍照轉傳或保證實際到場。位置、題目與獎品仍待
主辦單位確認；目前只有「集滿全部章、每帳號一次」的一種兌獎規則。

## 資料保存與備份

docker compose down 不刪除 named volume；重新建立容器仍保留帳號、章與兌獎紀錄。
**不要執行 docker compose down -v**，那會刪除資料。
本服務是單一實例；不要讓多個容器在網路檔案系統共用同一份 SQLite。

連線中的資料庫請用 SQLite backup API 產生一致快照，不要直接複製主檔而漏掉 WAL：

    docker compose exec -T pwa node --input-type=module -e "import {DatabaseSync,backup} from 'node:sqlite'; const db=new DatabaseSync('/data/game.sqlite'); await backup(db,'/data/backup.sqlite'); db.close();"
    docker compose cp pwa:/data/backup.sqlite ./backup.sqlite

備份含帳號雜湊、進度、待審照片與兌獎紀錄，應受限存放並依保存政策清理。
還原前停止寫入，保存原始檔及 WAL，再從一致快照還原；不要覆蓋執行中的資料庫。

## 開發與驗證

    npm ci
    npm run check
    npm run build

Node 24 是必要條件；較早的 Node 24 仍會提示 SQLite / type stripping 實驗警告。
本機後端可用 DATABASE_PATH=/tmp/songying-dev.sqlite npm run server 啟動在 8080；
另開 npm run dev。Vite 只轉譯由其本機頁面發出的 Origin，代理到預設後端。
前後端使用一致 origin 後，也可直接以 Docker 驗證。
開發模式的 /game?standalone 可在分頁測試；正式模式保留安裝檢查。

測試包含帳密、角色拒絕、CSRF、無效代碼／答案、照片審核與重傳競態、
重複集章、同時兌獎、session 到期／撤銷、重啟保存、照片清理及一致快照。
CI 使用同一份 docker-compose.yml 建置並啟動；工作流程中的帳密及代碼僅為 CI 測試值。

設計見 docs/DESIGN.md；目前架構見 docs/ARCHITECTURE.md；
實測結果見 docs/PROTOTYPE-NOTES.md。歷史紀錄不是目前產品的完整功能清單。
