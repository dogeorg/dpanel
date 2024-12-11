export const MOCK_PUP_LIST = [
  {
    name: "Dogecoin Core",
    part: {
      application: { bytes: "131072000" }, // 128MB in bytes
      storage: { bytes: "7152000" }, // 7.15MB in bytes 
      cache: { bytes: "251200000000" } // 251GB in bytes (the)
    }
  },
  {
    name: "Dogemap",
    part: {
      application: { bytes: "25600000" },
      storage: { bytes: "524288000" },
      cache: { bytes: "104857600" }
    }
  },
  {
    name: "Dogenet",
    part: {
      application: { bytes: "15360000" },
      storage: { bytes: "262144000" },
      cache: { bytes: "52428800" }
    }
  },
  {
    name: "Gigawallet",
    part: {
      application: { bytes: "35840000" },
      storage: { bytes: "1048576000" },
      cache: { bytes: "209715200" }
    }
  },
  {
    name: "Identity",
    part: {
      application: { bytes: "20480000" },
      storage: { bytes: "524288000" },
      cache: { bytes: "104857600" }
    }
  },
  {
    name: "Libdogecoin SPV",
    part: {
      application: { bytes: "46080000" },
      storage: { bytes: "5242880000" },
      cache: { bytes: "1048576000" }
    }
  }
]