

import React, { useRef } from "react";

import useScript from "../lib/use-script";

const Comments = () => {
  const comment = useRef(null);

  const status = useScript({
    url: "https://utteranc.es/client.js",
    theme: "github-light",
    issueTerm: "pathname",
    repo: "jun1st/new-blog",
    crossOrigin: "anonymous",
    ref: comment
  });

  return (
    <div className="w-full">
      {
        <div ref={comment}></div>
      }
    </div>
  );
};

export default Comments;
