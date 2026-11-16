# 擴充性驗證

目標：證明新增 JSON 能透過 glob 進入現有介面，共用模板與搜尋不需維護城市名單。

執行 `npm test`：先驗證中英文、國家、合併篩選與錯誤資料，再由既有資料建立清楚標記的 `src/data/cities/extension-fixture.json`（South America）。暫時複製已授權照片至 `public/images/extension-fixture/`，確認六筆資料驗證通過、搜尋/新洲別可選中 fixture，執行 Vite build，檢查正式 JS bundle 包含 `Extension Fixture`。finally 移除 fixture 與圖片，再驗證、重建五城版本。核心 UI 無修改。fixture 只供技術整合，不代表真實城市，也不會發布。

2026-11-16 實際結果：PASS。六城驗證與 build 成功；清除後五城驗證與 build 成功。未遇到測試問題。測試驗證 production bundle 的自動發現及共用搜尋函式；未以第六城執行瀏覽器點擊，五座正式城市另由瀏覽器測試確認共用模板。

未來新增 Kyoto：依 AGENTS.md 查官方資料、建立 kyoto.json 與授權照片、執行上述關卡，最後檢查 Explore 與 `city.html?slug=kyoto`。不必修改 HTML 或清單。
