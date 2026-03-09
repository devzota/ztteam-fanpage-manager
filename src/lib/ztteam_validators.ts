import { z } from "zod";

/** Schema validate URL Facebook */
export const ztteam_FacebookUrlSchema = z.object({
  url: z
    .string()
    .url("Invalid URL format")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          const validDomains = [
            "facebook.com",
            "www.facebook.com",
            "m.facebook.com",
            "web.facebook.com",
          ];
          return validDomains.includes(parsed.hostname);
        } catch {
          return false;
        }
      },
      { message: "URL must be a valid Facebook page URL" }
    ),
});

/** Schema validate khi tạo fanpage mới */
export const ztteam_CreateFanpageSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  pageId: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});
