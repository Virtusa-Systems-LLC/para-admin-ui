import React from "react";
import Iframe from "react-iframe";

const OriginalAuth = () => {
  return (
    <>
      <Iframe
        url="https://authui.virtusasystems.com/docs/hello.html"
        position="absolute"
        width="100%"
        id="myFrame"
        className="myClassname"
        height="100%"
      />
    </>
  );
};

export default OriginalAuth;
