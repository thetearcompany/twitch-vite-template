import { useEffect } from "react";

function ViewerPanel() {
  useEffect(() => {
    Twitch.ext.onAuthorized(function (auth) {
      console.log("on Authorize!", auth.token);
    });
  }, []);

  return (
    <div style={{ backgroundColor: "white" }}>
      Hello, world. From Viewer/Mobile Panel
    </div>
  );
}

export default ViewerPanel;
