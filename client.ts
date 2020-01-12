const ZeroFrame = require("zeroframe-ws-client");

interface ZeroFrameOptions {
  host?: string;
  port?: number;
}

interface ContentJson {
  address: string; // "1B27wUJFvVVxUEAC9LaCWoJm9svy8k1wUk";
  address_index: number; // 204481;
  "background-color": string; // "#FFF";
  clone_root: string; ///"template-new";
  cloned_from: string; // "1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D";
  description: string; // "";
  files: {
    // fileName = "index.html"
    [fileName: string]: {
      sha512: string; // "66d08e6b9cb9615da488d43b019c91a5f18c8856a291ec589f4f42ee84df2441";
      size: number; // 386;
    };
  };
  ignore: string; // "";
  inner_path: string; // "content.json";
  modified: number; // 1577549593;
  postmessage_nonce_security: boolean; // true;
  signers_sign: string; // "G1Q4q/SzypDVi++SHZDeMNqfIkwXqnMOqd+P9EXySB1ASeDZtmefwv0/Gd0W4M13Hi4ubyDYa2aBzfSIwMnBK0o=";
  signs: {
    // signerAddress = "1B27wUJFvVVxUEAC9LaCWoJm9svy8k1wUk"
    [signerAddress: string]: string; // "G2+qvElG4DBNvrm4hfDC9LfDEsu8ZvgKQYH5JWY+7e9HHwkDmEFzWeP0Qjxct9++D5x6XFh76PdCiYgzasQ8buM=";
  };
  signs_required: number; // 1;
  title: string; // "my new site";
  translate: string[]; // ["js/all.js"];
  zeronet_version: string; // "0.7.1";
}

function ZeroFrameTs(siteAddress: string, options?: ZeroFrameOptions) {
  const zeroframe = new ZeroFrame(siteAddress, {
    instance: {
      host: options && options.host,
      port: options && options.port
    }
  });

  const timeout = 100;

  async function siteInfo() {
    const siteInfo: string | null = await zeroframe.cmdp("siteInfo", {});
    if (!siteInfo) throw Error("Null site info");
    return JSON.parse(siteInfo);
  }

  async function fileGet(innerPath: string): Promise<string> {
    const fileData: string | null = await zeroframe.cmdp("fileGet", {
      inner_path: innerPath,
      timeout
    });
    if (!fileData) throw Error(`Null file get ${innerPath}`);
    return fileData;
  }

  async function fileGetJson<T>(innerPath: string): Promise<T> {
    const dataString = await fileGet(innerPath);
    return JSON.parse(dataString);
  }

  async function contentJsonGet(): Promise<ContentJson> {
    const contentJson = await fileGetJson<ContentJson>("content.json");
    return contentJson;
  }

  function close() {
    return zeroframe.close();
  }

  return {
    siteInfo,
    fileGet,
    fileGetJson,
    contentJsonGet,
    close
  };
}

test();

async function test() {
  const zeroframe = ZeroFrameTs("1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D", {
    host: "zeronet.dappnode",
    port: 80
  });

  //   const siteInfo = await zeroframe.cmdp("siteInfo", {});
  //   console.log(JSON.stringify(siteInfo, null, 2));
  console.log("Getting file");
  const contentJson = await zeroframe.contentJsonGet();
  console.log("Got file");
  zeroframe.close();

  //   const jsonFiles = Object.entries(contentJson.files)
  //     .map(([path, file]) => ({
  //       path,
  //       ...file
  //     }))
  //     .filter(file => file.path.endsWith(".json"));

  //   for (const jsonFile of jsonFiles) {
  //     const jsonData = await zeroframe.fileGetJson(jsonFile.path);
  //     console.log("=".repeat(20) + "\n" + jsonFile.path + "\n" + "=".repeat(20));
  //     console.log(jsonData);
  //   }
}
