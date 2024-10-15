export const getResponse = {
  name: "/system/install/disks",
  group: "setup",
  method: "get",
  res: [
    {
      name: "sda",
      size: 500107862016,
      sizePretty: "465.76 GB",
    },
    {
      name: "nvme0n1",
      size: 1000204886016,
      sizePretty: "931.51 GB",
    },
  ],
};

export const postResponse = {
  name: "/system/install",
  group: "setup",
  method: "post",
  res: { success: true }
};
