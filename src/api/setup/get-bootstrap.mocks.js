export const getResponse = {
  name: "/setup/facts",
  method: "get",
  group: "setup",
  res: {
    success: true,
    setup: {
      hasGeneratedKey: false,
      hasConfiguredNetwork: false,
      hasCompletedInitialConfiguration: false
    },
  }
};
