# City Notes — AI 開發規範

## 1. Project overview
City Notes 是給繁體中文讀者的靜態城市指南，以 Editorial Minimalist 排版探索世界。Release 1.0 僅發布 Tokyo、Paris、New York、Sydney、Cape Town。未來以新增資料擴充，不複製頁面。課程繳交由使用者自行完成。

## 2. Technology stack
使用 Vite、HTML5、CSS Variables、Vanilla JavaScript ES Modules、JSON、Node.js 與 GitHub Actions / Pages。無後端、登入、資料庫；不得無故引入框架或大型依賴。Node 24 LTS，npm lockfile 必須提交。

## 3. Repository structure
- `src/data/cities/{slug}.json`：城市內容唯一來源，新增城市只增加 JSON 與圖片。
- `src/utils/city-loader.js`：Vite glob 自動發現資料；搜尋與洲別選項由資料衍生。
- `src/utils/paths.js`：集中使用 BASE_URL 建立站內與圖片網址。
- `src/components/`：共用導覽、頁尾、城市卡片。
- `src/pages/`：Home、Explore、City、About 渲染。
- `src/styles/`：tokens、global、components；改設計先修改共用規則。
- `public/images/{slug}/`：本地壓縮照片。
- `scripts/validate-cities.mjs`：資料檢查；`scripts/test.mjs`：精簡行為驗證。
- `templates/city.example.json`：非發布範例。四個根目錄 HTML 為 MPA 入口。

## 4. Design system rules
顏色僅在 tokens.css 定義：ivory #F7F5F0、white #FFFFFF、charcoal #242424、muted #625F59、olive #58634D、border #E5E1D9。文字對比須足夠。英文標題 Georgia serif，中文 system sans，行高至少 1.7；標題用 clamp。間距以 8px 倍數為主，內容最大寬 1280px。900px 以下卡片雙欄，600px 以下單欄。卡片照片 4:3、標題與國家資訊一致；Hero 使用實際城市照片、清楚可讀文字。導覽顯示當前頁、手機不隱藏必要連結。連結和表單需鍵盤可用、有可見 focus；每頁一個 h1、語意 landmarks、skip link；圖片具具體 alt 與尺寸，非首屏 lazy load。動畫僅輕微 hover，遵循 prefers-reduced-motion。

## 5. City data schema
所有下列欄位必填，字串不可空白；不允許 unknown 欄位（避免拼錯未被發現）。
- `slug`: 小寫英文字母及數字，以連字號分隔，唯一且與檔名相同。
- `name`, `country`: `{zh: string, en: string}`。
- `continent`: Asia / Europe / North America / South America / Oceania / Africa / Antarctica。
- `tagline`, `summary`, `bestTimeToVisit`: 有內容的繁體中文文字。summary 應介紹地方特色，季節提示不可承諾天氣。
- `tags`: 至少 1 個非空字串。
- `heroImage`: Image 物件。
- `attractions`: 至少 3 個 `{name, category, description}` 字串物件。
- `foods`: 至少 3 個 `{name, description}` 字串物件。
- `travelTips`: 至少 3 個 `{title, description}` 字串物件。
- `gallery`: 至少 1 個 Image 物件，須為額外照片。
- `sources`: 至少 2 個 `{title, url}`，可信官方或第一手內容來源。
- Image: `{src, alt, author, sourceUrl, license, licenseUrl}` 皆為非空字串；src 為 `images/{slug}/...webp` 本地路徑，檔案必須存在。來源及授權為 HTTPS；所有來源網址均須 HTTPS，禁止 example.com 與虛構來源。
驗證器檢查格式，不能證明網頁有效或授權真實；研究時必須另行開啟原始來源查證。避免未核實的票價、營業時間、安全保證；需即時資訊時引導訪客查官方公告。攝影不得冒充城市紀實；不得虛構作者或授權。

## 6. New city creation SOP
1. 讀本文件、`templates/city.example.json`、現有城市 JSON 和載入器。
2. 查閱至少兩個可信來源，記錄網址；用自己的繁中語句撰寫內容，不複製文章。
3. 建立 `src/data/cities/{slug}.json`，完成全部欄位與最低筆數。
4. 查證可公開儲存的攝影授權，下載壓縮成 WebP 至 `public/images/{slug}/`；填 metadata，更新 ASSET_CREDITS.md。
5. 執行 `npm run validate`、`npm test`、`npm run build`，修正錯誤後才提交。
6. 開啟 Explore，確認自動新增、中文/英文/國家搜尋與洲別合併篩選；直接開啟 `city.html?slug={slug}` 並重新整理。
7. 檢查現有城市、導航、圖片與手機畫面；不得修改城市名單常數或複製 HTML。
8. 回報變更檔案、實際測試結果、來源、限制；不得將 fixture 發布為內容。Release 1.0 維持五城；新增正式城市需明確需求。

## 7. Existing city modification SOP
先讀完整 JSON，保留其他欄位並保持 Schema 相容；內容變更重新查來源；替換照片同步 metadata 與 credits，移除確認無引用的舊照片。執行全部本地品質關卡，確認其他城市無回歸。

## 8. Shared component rules
所有城市使用 `city.html?slug=...` 與單一 City 渲染器。重複介面置於 components，重複樣式置於共用 CSS；不得建立城市專屬模板、手寫城市陣列或在 UI 放內容資料。使用 DOM escaping 處理資料；站內路徑統一透過 paths.js，不硬編碼 repository 前綴。

## 9. AI coding rules
Read before modifying；最小範圍變更；檔名 kebab-case、JS camelCase。保留正常功能，不捏造來源、授權、測試或部署結果。不引入無必要依賴。提交前驗證並檢查 staged files；不提交 secrets、.env、node_modules、dist、測試截圖。架構變更同步本規範與 README。禁止操作學校繳交系統。

## 10. Quality gates
`npm run validate`、`npm test`、`npm run build` 必須通過。瀏覽器檢查四種頁面、五城、無效 slug、搜尋/篩選/清除/空狀態、圖片、鍵盤與手機寬度，無明顯 runtime error。部署使用官方 Pages Actions，從 GITHUB_REPOSITORY 推導 base；main push 部署，須確認 workflow 成功及公開網址，未完成不得回報 deployed。

## 11. Definition of Done
新增城市需 JSON 合法、內容完整、授權查證、圖片 metadata 完整、自動被發現、詳細頁直接存取正常、build 成功、既有頁面正常。專案交付另需 Public repo、Pages 公開驗證，以及含真實網址與完整 AGENTS 文字的 SUBMISSION.md。缺少授權等阻礙須明列，不能當成完成。

## 12. Maintenance and extension example
例如未來新增 Kyoto：依 SOP 查京都官方旅遊來源，建立 `kyoto.json`，準備兩張已授權圖片、三個景點/美食/建議；loader 的 glob 自動將資料帶入首頁、Explore 與共用 City 模板，Asia 篩選自然包含新資料，無須改 HTML。本次 `npm test` 會暫時加入清楚標記 fixture，執行資料驗證與 Vite build，檢查產物包含 fixture 後在 finally 移除，再建置五城版本。fixture 不代表真實旅遊資料，不能發布。
