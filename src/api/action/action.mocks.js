const postResponse = [
  // When successful
  {
    success: true,
    message: "Winner winner, chicken dinner",
  },
  // When fail
  {
    message: "Loser loser, tofu bruiser",
    errors: [1,2,3]
  }
];

export const mock = {
  name: '/action/:pup/start',
  method: 'get',
  group: 'pup actions',
  res: postResponse
}