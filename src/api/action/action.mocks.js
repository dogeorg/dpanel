const postResponse = {
  success: true,
  message: "Winner winner, chicken dinner",
  id: 123,
}

export const startMock = {
  name: '/action/:pup/start',
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
