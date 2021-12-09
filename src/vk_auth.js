
async function loadVKAuth() {
  let nowApiId = null;
  if (window.location.hostname == "silverfoxxxy.github.io") {
    nowApiId = 8015693;
  }
  if (window.location.hostname == "letters-reader2.tk") {
    nowApiId = 8014472;
  }
  if (nowApiId != null) {
    VK.init({
      apiId: nowApiId
    });
  }
  console.log(window.location.hostname);
  // window.location.hostname
  // VK.UI.button("vk_auth");
  // VK.Widgets.Auth("vk_auth", {"authUrl":"dev_login"});
  if (nowApiId != null) {
    VK.Widgets.Auth("vk_auth", {"onAuth":function(data) {tryVKData(data);}});
    VK.Widgets.Auth("vk_auth2", {"onAuth":function(data) {addVKData(data);}});
  }
}

loadVKAuth();
