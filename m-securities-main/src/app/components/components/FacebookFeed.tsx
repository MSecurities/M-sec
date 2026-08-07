"use client";

import { useEffect } from "react";

const FB_PAGE_URL = "https://www.facebook.com/profile.php?id=61570245532774";

export default function FacebookFeed() {
  useEffect(() => {
    // Facebook SDK-г нэг л удаа ачаална
    if (document.getElementById("facebook-jssdk")) {
      // SDK аль хэдийн байгаа бол зөвхөн parse хийнэ
      (window as any).FB?.XFBML?.parse();
      return;
    }

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/mn_MN/sdk.js#xfbml=1&version=v19.0";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center py-8">
      <div id="fb-root"></div>
      <div
        className="fb-page"
        data-href={FB_PAGE_URL}
        data-tabs="timeline"
        data-width="500"
        data-height="700"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote cite={FB_PAGE_URL} className="fb-xfbml-parse-ignore">
          <a href={FB_PAGE_URL}>М Секьюритис ҮЦК</a>
        </blockquote>
      </div>
    </div>
  );
}
