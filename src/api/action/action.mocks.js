const postResponse = {
  success: true,
  message: "Winner winner, chicken dinner",
  id: 123,
}

export const startMock = {
  name: '/action/:pup/enable',
  method: 'post',
  group: 'pup actions',
  res: postResponse
}

export const stopMock = {
  name: '/action/:pup/disable',
  method: 'post',
  group: 'pup actions',
  res: postResponse
}

export const installMock = {
  name: '/action/:pup/install',
  method: 'post',
  group: 'pup actions',
  res: postResponse
}

export const uninstallMock = {
  name: '/action/:pup/uninstall',
  method: 'post',
  group: 'pup actions',
  res: postResponse
}