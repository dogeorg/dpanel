export const getResponse = {
  name: "/dkm/list",
  group: "DKM",
  method: "get",
  res: {
    success: true,
    list: [],
  }
};

export const getMockList = {
  success: true,
  list: [{ type: "master", created: Date.now() }],
};
