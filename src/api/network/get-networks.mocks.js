export const getResponse = {
  name: "/networks/list",
  group: "networks",
  method: "get",
  res: {
    success: true,
    networks: [
      { type: "ethernet", interface: "eth0" },
      { type: "ethernet", interface: "eth1" },
      {
        type: "wifi",
        interface: "wlan0",
        ssids: [
          {
            ssid: "DogeBox",
            bssid: "AA:AA:AA:AA:AA:AA:AA:AA",
            encryption: "WPA2"
          },
          {
            ssid: "Open Network",
            bssid: "BB:BB:BB:BB:BB:BB:BB:BB",
          }
        ]
      }
    ],
  }
}
