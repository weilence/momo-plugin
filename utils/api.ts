import ky from "ky";

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
