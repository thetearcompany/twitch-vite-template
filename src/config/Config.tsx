import { useEffect } from "react";

function Config() {
  useEffect(() => {
    Twitch.ext.onAuthorized(function (auth) {
      console.log("on Authorize!", auth.token);
    });
  }, []);

  return (
    <div style={{ backgroundColor: "white" }}>
      Hello, world. From Config Page
    </div>
  );
}

export default Config;
