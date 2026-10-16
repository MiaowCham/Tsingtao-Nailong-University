# 青岛奶龙学院访问导航

无需构建或安装依赖，直接打开 index.html 即可预览。

## GitHub Pages

在仓库 Settings → Pages 中，选择 Deploy from a branch，分支 main，目录 / (root)。
所有本地资源使用相对路径，兼容仓库子路径 /Tsingtao-Nailong-University/、用户站点和自定义域名。根目录 .nojekyll 用于直接发布静态文件，无需 Jekyll 处理。不要添加指向域名根目录的 base 标签，否则仓库子路径下的资源会加载失败。

- icon.png：页面内校徽。
- logo.png：浏览器网站图标和 Apple 主屏幕图标。
- script.js 顶部 LOADING_MS 和 IDLE_SECONDS：加载时间和无操作跳转时间。
- 入口加载完成后，无操作 5 秒跳转官网；暂停后本次访问不再自动跳转。

修改后推送 main，GitHub Pages 会按仓库 Pages 设置发布。若网站图标仍显示旧图，可强制刷新或清除站点缓存。
