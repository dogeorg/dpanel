export const getResponse = {
  name: "/networks/list",
  group: "networks",
  method: "get",
  res: {
    success: true,
    networks: [
      { type: "ethernet", value: "ethernet", label: "Ethernet", encryption: "MAXIMUM" },
      { type: "wifi", value: "home-wifi", label: "Home Wifi", encryption: "PSK" },
    ],
  }
}
