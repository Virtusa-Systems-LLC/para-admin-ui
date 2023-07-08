import { AwsClient } from "aws4fetch";

const fetchAuthServer = async (
  accessKey,
  secretKey,
  url,
  method = "GET",
  body = null
) => {
  const aws = new AwsClient({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    service: `para`,
    region: "us-east-1",
  });
  let request;
  if (method === "GET") {
    request = await aws.sign(url, {});
  }
  if (method === "PUT" && body !== null) {
    request = await aws.sign(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }
  if (method === "POST" && body !== null) {
    request = await aws.sign(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  const response = await fetch(request);
  return response;
};

const fetchAPI = async (token, url, method = "GET", data = null) => {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  if (method === "GET") {
    const res = await fetch(url, {
      method,
      headers: myHeaders,
    });
    return res;
  } else if (method === "POST" || method === "PUT" || method === "DELETE") {
    const res = await fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: myHeaders,
    });
    return res;
  }
};

export { fetchAuthServer, fetchAPI };
