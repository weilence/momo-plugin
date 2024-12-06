import ky from "ky";

interface MomoResponse<T> {
  errors: string[];
  data: T;
  success: boolean;
}

const api = ky.extend({
  prefixUrl: config.prefixUrl,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (request.headers.has("Authorization")) {
          return;
        }

        const apiToken =
          (await storage.getItem<string>("local:apiToken")) || "";

        request.headers.set("Authorization", `Bearer ${apiToken}`);
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

interface Notepad {
  id: string;
  status: "PUBLISHED" | "UNPUBLISHED" | "DELETED";
  title: string;
  brief: string;
  content: string;
  tags: string[];
}

const notepadTemplate = {
  title: "浏览器单词同步",
  brief: "浏览器插件单词同步(请勿修改描述)",
};

export async function syncWordLibrary(words: string[]) {
  if (words.length === 0) {
    words = ["#"];
  }

  const data = await api.get<{ notepads: Notepad[] }>(`notepads`).json();
  const pluginNotePad = data.notepads.find(
    (notepad) => notepad.brief === notepadTemplate.brief
  );
  const payload = {
    notepad: {
      status: "UNPUBLISHED",
      content: words.join("\n"),
      title: notepadTemplate.title,
      brief: notepadTemplate.brief,
      tags: [],
    },
  };
  if (!pluginNotePad) {
    await api.post(`notepads`, {
      json: payload,
    });
  } else {
    await api.post(`notepads/${pluginNotePad.id}`, {
      json: payload,
    });
  }
}

export async function testApiToken(apiToken: string) {
  try {
    await api
      .get("notepads", {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })
      .json();
    return true;
  } catch (error) {
    return false;
  }
}
