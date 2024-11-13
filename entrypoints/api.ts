import ky from "ky";
import config from "./config";
import { configStore } from "./store";

export default ky.extend({
  prefixUrl: config.prefixUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set(
          "Authorization",
          `Bearer ${configStore.getState().apiToken}`
        );
      },
    ],
  },
});
