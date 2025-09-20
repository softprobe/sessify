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
};
