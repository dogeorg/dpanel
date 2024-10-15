export const getResponse = {
  name: "/system/disks",
  group: "setup",
  method: "get",
  res: [
    {
      name: "/dev/cdrom",
      size: 5368709120,
      sizePretty: "5.00 GB",
      suitableInstallDisk: false,
      suitableDataDisk: false,
      bootMedia: true,
    },
    {
      name: "/dev/sda",
      size: 500107862016,
      sizePretty: "465.76 GB",
      suitableInstallDisk: true,
      suitableDataDisk: true,
    },
    {
      name: "/dev/nvme0n1",
      size: 1000204886016,
      sizePretty: "931.51 GB",
      suitableInstallDisk: true,
      suitableDataDisk: true,
    },
  ],
};

export const postResponse = {
  name: "/system/install",
  group: "setup",
  method: "post",
  res: { success: true }
};
