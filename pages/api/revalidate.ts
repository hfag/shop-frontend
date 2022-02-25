import { NextApiRequest, NextApiResponse } from "next";
import { pathnamesByLanguage } from "../../utilities/urls";
import { supportedLanguages } from "../../utilities/i18n";

// Query parameters: {secret: string, type: string, slugs: string[], languages: string[]}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const slugs = req.query.slugs,
    languages = req.query.languages;

  if (!Array.isArray(slugs)) {
    return res
      .status(401)
      .json({ message: "Query arg 'slugs' must be an array" });
  }
  if (slugs.find((slug) => !slug)) {
    return res.status(401).json({
      message: `Query arg 'slugs' must contain only truthy values, '${slugs.join(
        "','"
      )}' was given`,
    });
  }

  if (!Array.isArray(languages)) {
    return res
      .status(401)
      .json({ message: "Query arg 'languages' must be an array" });
  }

  if (languages.find((l) => !supportedLanguages.includes(l))) {
    return res.status(401).json({
      message: `Query arg 'languages' must contain only the values '${supportedLanguages.join(
        "','"
      )}', '${languages.join("','")}' was given`,
    });
  }

  if (slugs.length !== languages.length) {
    return res.status(401).json({
      message: "Array sizes of args 'slugs' and 'languages' must match",
    });
  }

  const type = Array.isArray(req.query.type)
    ? req.query.type[0]
    : req.query.type;

  try {
    switch (type) {
      case "product":
        await Promise.all(
          languages.map((lang, index) => {
            return res.unstable_revalidate(
              `/${lang}/${pathnamesByLanguage.product.languages[lang]}/${slugs[index]}`
            );
          })
        );
        break;
      case "collection":
        await Promise.all([
          /* Front pages */
          ...languages.map((lang) => res.unstable_revalidate(`/${lang}`)),
          /* Collection / Product category pages */
          ...languages.map((lang, index) => {
            return res.unstable_revalidate(
              `/${lang}/${pathnamesByLanguage.productCategory.languages[lang]}/${slugs[index]}`
            );
          }),
        ]);
        break;
      case "page":
        await Promise.all(
          languages.map((lang, index) => {
            return res.unstable_revalidate(
              `/${lang}/${pathnamesByLanguage.page.languages[lang]}/${slugs[index]}`
            );
          })
        );
        break;
      case "post":
        await Promise.all([
          /* Front page */
          ...languages.map((lang) => res.unstable_revalidate(`/${lang}`)),
          /* Collection / Product category pages */
          ...languages.map((lang, index) => {
            return res.unstable_revalidate(
              `/${lang}/${pathnamesByLanguage.post.languages[lang]}/${slugs[index]}`
            );
          }),
        ]);
        break;
      default:
        return res.status(400).json({ message: "Invalid type" });
    }

    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    console.error(err);
    return res.status(500).send("Error revalidating");
  }
}
