import ky from "ky";

interface MomoResponse<T> {
  errors: string[];
  data: T;
  success: boolean;
}

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
    afterResponse: [
      async (_, __, response) => {
        if (response.status != 200) {
          return;
        }

        const data = (await response.json()) as MomoResponse<any>;
        if (!data.success) {
          throw new Error(data.errors.join(", "));
        }

        return Response.json(data.data);
      },
    ],
  },
});
