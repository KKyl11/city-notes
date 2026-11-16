# City Notes

Explore the World, One City at a Time.

以 Editorial Minimalist 風格呈現東京、巴黎、紐約、雪梨與開普敦的繁體中文城市筆記。大學 AGENTS.md 作業；不含商業服務、會員或後端。

- Repository：[KKyl11/city-notes](https://github.com/KKyl11/city-notes)
- Live：[City Notes](https://kkyl11.github.io/city-notes/)（已部署並完成公開瀏覽器驗證，結果見 SUBMISSION.md）

## 功能與技術
Home 精選五城；Explore 支援中英文城市名、國家搜尋、洲別合併篩選、筆數、空狀態與清除；City 共用模板包含景點、美食、季節、建議、照片與來源；About 介紹策展理念。響應式、鍵盤導覽、減少動態偏好。Vite 8、Vanilla ES Modules、HTML、CSS tokens、JSON、Node 24；僅 Vite 與 Playwright 開發依賴，無執行期套件、遠端字型或付費 API。

## 結構
```
AGENTS.md                 AI 開發與內容規範
index/explore/city/about.html  四個 MPA 入口
src/data/cities/*.json    城市資料唯一來源
src/utils/               glob 載入、搜尋、BASE_URL 路徑
src/components/          導覽、頁尾、卡片
src/pages/               四種共用頁面渲染
src/styles/              tokens、global、components
public/images/{slug}/    本地 WebP 照片
templates/city.example.json  以東京為結構範例，不會另行載入
scripts/                 驗證、擴充測試、瀏覽器測試
.github/workflows/deploy.yml  Pages Actions
```

## 本地執行
安裝 Node.js 24 LTS 後：
```sh
npm ci
npm run dev
npm run validate
npm test
npm run build
npm run preview
```
`npm test` 驗證搜尋與錯誤資料，暫時加入第六座 fixture、建置確認 glob 發現，再清除並重建。請勿與其他建置同時執行。`npm run test:browser` 需先啟動 preview，預設以已安裝 Microsoft Edge headless 執行；可用 `TEST_URL` 測正式網址。CI 不要求 Edge，執行 validate、簡單功能/擴充測試及 build。

## 新增城市
先讀 [AGENTS.md](AGENTS.md)。複製範例為 `src/data/cities/{slug}.json`，更換全部城市內容，填入三景點、三飲食、三建議與至少兩個已查證來源；將兩張已授權照片放入 `public/images/{slug}/`，同步 metadata 與 [ASSET_CREDITS.md](ASSET_CREDITS.md)。執行驗證、測試、建置並檢查瀏覽器。首頁、Explore、洲別選項與 `city.html?slug={slug}` 均自動使用新資料，不需城市清單或新 HTML。Release 1.0 保持五城。

## 圖片與內容
十張照片為本地壓縮 WebP，作者、照片頁與 Unsplash License 見 ASSET_CREDITS.md 與城市頁末。內容以自己的繁中文字整理，來源列於各 JSON；未列易變票價及營業時間。自動驗證只驗 URL 格式，無法證明來源有效或授權，來源研究須另行檢視。系統字型避免外部字型請求。

## GitHub Pages
main push 或手動觸發 workflow：Node 24 → npm ci → validate → test → build → upload-pages-artifact → deploy-pages。Repository Settings / Pages 的 Source 使用 GitHub Actions。Vite 從 `GITHUB_REPOSITORY` 推導 project base，使用者站點則為 `/`；本地亦可用 `BASE_PATH` 覆寫。所有 UI 站內連結與圖片透過 paths.js。四個實體 HTML 入口不依賴 SPA rewrite，城市 query 可直接分享與重新整理。

官方設定參考：[Vite 靜態部署](https://vite.dev/guide/static-deploy.html)、[GitHub Pages 自訂 workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

作業繳交內容集中於 [SUBMISSION.md](SUBMISSION.md)。使用者自行填學號、系級、姓名並向學校正式繳交。
