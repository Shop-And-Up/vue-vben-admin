import Pusher, { Channel } from 'pusher-js';

class PusherService {
  private static pusherInstance: Pusher;
  private static channelName: string;

  /**
   * init
   */
  public static init() {
    this.pusherInstance = new Pusher(import.meta.env.VITE_GLOB_PUSHER_API_KEY, {
      cluster: import.meta.env.VITE_GLOB_PUSHER_CLUSTER,
      forceTLS: true,
    });
  }

  /**
   * setChannel
   */
  public static setChannel(shopId: any) {
    this.channelName = `${import.meta.env.VITE_GLOB_APP_SHORT_NAME}_shop_id_${shopId}`;
  }

  /**
   * setChannel
   */
  public static subscribe(): Channel {
    return this.pusherInstance.subscribe(this.channelName);
  }
}

export default PusherService;
