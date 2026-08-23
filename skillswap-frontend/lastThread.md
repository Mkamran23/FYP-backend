# Show accepted request status

> as accept button is clicked, the status should be shown 'Accepted' and that request should be shown in accepted tab

<details><summary>5 previous messages</summary>

> I’ll trace the request-list state and tab filtering, then update the accept action so the UI immediately reflects “Accepted” in the Accepted tab.
>
> <details><summary>Ran 4 commands</summary>
>
> - Ran `Get-Content -Raw skillswap-frontend/src/components/swapRequests/SwapRequestList.jsx; rg -n "Accept|Accepted|swap request|SwapRequest|status" skillswap-frontend/src`
> - Ran `Get-Content -Raw skillswap-frontend/src/pages/SwapRequests.jsx; Get-Content -Raw skillswap-frontend/src/components/swapRequests/SwapRequestTabs.jsx; Get-Content -Raw skillswap-frontend/src/components/swapRequests/SwapRequestCard.jsx; Get-Content -Raw skillswap-frontend/src/services/swapRequestService.js; rg -n "swap-requests|updateStatus|status.*accepted|Accepted" -g "!skillswap-frontend/node_modules/**"`
> - Ran `rg -n -i "swaprequest|swap request|swap-requests" -g "!skillswap-frontend/node_modules/**" -g "!**/dist/**" .; Get-Content -Raw skillswap-frontend/package.json`
> - Ran `Get-Content -Raw skillswap/services/swapRequestService.js; Get-Content -Raw skillswap/models/swapRequest.js; Get-Content -Raw skillswap-frontend/src/services/apiClient.js; Get-Content -Raw skillswap-frontend/eslint.config.js`
>
> </details>
>
> I found the API already returns the updated request, but the page keeps the current tab and renders raw lowercase status. I’m adjusting the successful accept flow to switch to Accepted and making the label user-facing.
>
> <details><summary>Edited 2 files, ran a command</summary>
>
> - Wrote `./skillswap-frontend/src/components/swapRequests/SwapRequestList.jsx` (+4 -4)
> - Wrote `./skillswap-frontend/src/pages/SwapRequests.jsx` (+1 -0)
> - Ran `$line = 0; Get-Content skillswap-frontend/src/components/swapRequests/SwapRequestList.jsx | ForEach-Object { $line++; "${line}: $_" }; $line = 0; Get-Content skillswap-frontend/src/pages/SwapRequests.jsx | ForEach-Object { $line++; "${line}: $_" }`
> - Wrote `./skillswap-frontend/src/components/swapRequests/SwapRequestList.jsx` (+4 -4)
>
> </details>
>
> System error
>
> You've hit your usage limit. To continue using Codex and get access to GPT-5.3-Codex, start a free trial of Plus today (https://chatgpt.com/explore/plus), or try again at Sep 16th, 2026 1:05 PM.
</details>
