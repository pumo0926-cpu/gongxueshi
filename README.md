# 共学室

周周阿朴初中自主学习产品的共学体验 Demo。通过约定学习时间和同伴学习氛围，帮助孩子启动并持续完成学、练、改。

## 本地运行

无需安装依赖或构建。在仓库根目录运行：

```sh
python3 -m http.server 8766 --bind 127.0.0.1 --directory up-focus-club/dist
```

打开手机版 Demo：`http://127.0.0.1:8766/mobile.html`。

| 入口 | 地址 |
| --- | --- |
| 手机版完整体验 | `/mobile.html` |
| 手机版候场 | `/mobile.html?scene=waiting` |
| 手机版共学成果 | `/mobile.html?scene=results` |
| 手机版微信提醒 | `/mobile.html?scene=reminders` |
| 微信邀约原页面 | `/?view=wechat` |
| 候场原页面 | `/?view=waiting` |
| 共学成果原页面 | `/classroom.html?day=0` |

## 当前体验

- 微信老师邀约，展示课程、场次、示例预约人数和热门时段，支持直接预约。
- 9座教室，课程黑板与倒计时；可入座、邀请同伴、点击头像打招呼、击掌和送爱心。
- 头像展示已学节数；等待页和成果页各显示3条自动轮换的共学动态。
- 候场保留“换个场次”和“等待共学 / 开始共学”，另有演示开场时间开关。
- 学习视频默认静音，上方叠放当前共学头像；随后进入练习与错题订正。
- 等待页和成果页共用教室、头像位置与顶部品牌样式。
- 开场后1小时内可启动；黑板保留主题和倒计时，超过启动窗口不再入场，已开始的学习可继续。
- 共学成果底部提供下两次共学的日期、课程及预约入口。未来预约独立保存，不覆盖已有学习进度。
- 微信提醒演示支持实际预约时间、开场前1小时、开场10分钟未到、已入场四种场景；未到提醒显示还有50分钟可启动，仅在页面模拟，不会向真实微信发消息。
- 共学成果分为已学完、订正中、分享收获、分享感受；支持提交和保存自己的分享。

## 文件说明

- `up-focus-club/dist/`：可直接运行的页面、脚本、样式及图片视频。
- `up-focus-club/.openai/hosting.json`：原 Sites 项目配置。
- `docs/previews/`：手机版界面截图。

预览图：[候场教室](docs/previews/mobile-demo-waiting.png) · [学习视频](docs/previews/mobile-demo-learning.png) · [共学成果](docs/previews/mobile-demo-results.png)。

## 演示范围

同伴、人数和活动为示例。预约、学习进度与分享保存在当前浏览器的 localStorage 中，不提供真实多人同步、消息发送、支付或会员验证。电脑端打开 mobile.html 时采用手机尺寸，手机端全屏显示。

本仓库存放当前预览版本；提交 GitHub 不会自动发布或更新原 Sites 站点。

## GitHub Pages 发布

仓库保持私有。首次启用：进入仓库 Settings → Pages，在 Build and deployment 的 Source 中选择 GitHub Actions。随后到 Actions 运行“Publish co-learning Demo to GitHub Pages”，或重新运行此前因未启用 Pages 而失败的流程。

部署流程只上传 `up-focus-club/dist/` 中的静态页面与资源。启用后，后续对该目录的 main 分支提交将自动更新站点，不依赖本地电脑。发布成功时，以 Actions 的 github-pages 环境给出的地址为准；手机版入口为该地址下的 `mobile.html`。

私有仓库使用 GitHub Pages 需要账号套餐支持（如 GitHub Pro）。仓库私有与演示站点公开是两项独立设置；此 Demo 的 Pages 用于公开体验。不支持当前套餐时，不会自动将仓库改成公开或升级付费。
