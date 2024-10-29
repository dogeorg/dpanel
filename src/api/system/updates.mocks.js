export const getResponse = {
  name: "/system/updates",
  method: "get",
  group: "updates",
  res: {
    success: true,
    updates: [{
      name: 'dogebox',
      version: '0.3.2',
      summary_short: 'Various improvements to Dogeboxd, dPanel and DKM',
    }]
  }
};

export const postResponse = {
  name: "/system/updates/commence",
  method: "post",
  group: "updates",
  res: {
    success: true,
  }
};

