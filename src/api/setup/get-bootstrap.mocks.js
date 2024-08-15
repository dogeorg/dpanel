export const getResponse = {
  name: "/setup/facts",
  method: "get",
  group: "setup",
  res: {
    success: true,
    setup: {
      hasPassword: true,
      hasKey: true,
      hasConnection: false,
    },
  }
};
