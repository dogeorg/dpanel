export const getResponse = {
  name: "/system/updates",
  method: "get",
  group: "updates",
  res: {
    success: true,
    updates: [{
      name: 'Dogebox',
      version: '0.3.2',
      short: 'Bundles Dogeboxd, DKM, dPanel',
      link: 'https://github.com/dogeorg/dogeboxd/release/foo',
      long: 'This update deserunt amet ex in labore dolore et veniam dolor culpa enim dolor in deserunt do aliquip mollit dolor elit dolore dolore aute proident consectetur consequat in nostrud sit occaecat est in cupidatat laboris nulla.'
    },
    {
      name: 'NixOS',
      short: 'Security patches',
      link: 'https://github.com/dogeorg/dogebox/release/bar',
      long: 'This update deserunt amet ex in labore dolore et veniam dolor culpa enim dolor in deserunt do aliquip mollit dolor elit dolore dolore aute proident consectetur consequat in nostrud sit occaecat est in cupidatat laboris nulla.'
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

