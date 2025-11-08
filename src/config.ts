export type InspectorConfig = {
  // 业务相关
  apiKey: string;
  userId: string;
  /** 区分业务线 */
  serviceName: string;
  /** 接收span的地址，POST <collectorEndpoint>/v1/traces */
  collectorEndpoint?: string;
  /** 'dev' | 'prd' */
  env?: string;

  // 配置相关
  /** 是否开启滚动监听, 默认不开启 */
  observeScroll?: boolean;

  /**
   * 自动检测配置
   */
  instrumentations?: {
    /**
     * 是否监听网络请求 (Fetch and XHR)
     * @default true
     */
    network?: boolean;
    /**
     * 是否监听用户交互事件
     * @default true
     */
    interaction?: boolean;
    /**
     * 是否记录页面环境和加载信息
     * @default true
     */
    environment?: boolean;
  };
};
