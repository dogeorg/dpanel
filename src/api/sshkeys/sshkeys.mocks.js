export const getSSHPublicKeysResponse = {
  name: "/system/ssh/keys",
  group: "SSH",
  method: "get",
  res: {
    success: true,
    keys: [{ key: "flibble-wibble-mocked-response", id: "ABC123" }],
  }
};