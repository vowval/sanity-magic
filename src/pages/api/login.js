import { Magic } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  // exchange the did from Magic for some user data
  const did = req.headers.authorization.split("Bearer").pop().trim();
  console.log("DID:", did);
  const user = await new Magic(
    process.env.MAGIC_SECRET_KEY
  ).users.getMetadataByToken(did);
  console.log('USER:',user);
  // Author a couple of cookies to persist a user's session
  const token = await Iron.seal(
    user,
    process.env.ENCRYPTION_SECRET,
    Iron.defaults
  );
  console.log('Token:',token);
  CookieService.setTokenCookie(res, token);

  res.end();
};
