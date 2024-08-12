export const getResponse = {
  name: "/setup/facts",
  method: "get",
  group: "setup",
  res: {
    success: true,
    setup: {
      hasPassword: false,
      hasKey: false,
      hasConnection: false,
    },
  }
};
