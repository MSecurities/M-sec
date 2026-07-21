import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DownloadPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  const isAndroid = /android/i.test(userAgent);
  const isiOS = /iphone|ipad|ipod/i.test(userAgent);

  const iosUrl = "https://apps.apple.com/mn/app/m-securities-mn/id6745858855";
  const androidUrl =
    "https://play.google.com/store/apps/details?id=com.istock.msec&hl=en";

  if (isAndroid) {
    redirect(androidUrl);
  } else if (isiOS) {
    redirect(iosUrl);
  } else {
    redirect("/download/select");
  }

  return null; // This line will never be reached due to the redirects above
}
