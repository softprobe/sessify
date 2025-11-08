export type InspectorConfig = {
  // --- 核心身份认证 ---
  apiKey: string;
  userId: string;
  serviceName: string;

  // --- 数据导出配置 ---
  /**
   * 是否启用数据上报到 Softprobe 后端。
   * @default true
   */
  enableTrace?: boolean;

  /**
   * 自定义数据上报地址, 用于覆盖默认的生产环境地址 ('https://o.softprobe.ai')。
   */
  endpoint?: string;

  /**
   * 是否在浏览器控制台打印追踪信息。
   * 建议仅在开发和调试时开启。
   * @default false
   */
  enableConsole?: boolean;

  // --- 自动检测配置 ---
  instrumentations?: {
    /**
     * 是否监听网络请求 (Fetch and XHR)。
     * @default true
     */
    network?: boolean;
    /**
     * 是否监听用户交互事件。
     * @default false
     */
    interaction?: boolean;
    /**
     * 是否记录页面环境和加载信息。
     * @default false
     */
    environment?: boolean;
  };

  // --- 其他配置 ---
  /** 是否开启滚动监听, 默认不开启 */
  observeScroll?: boolean;
};
