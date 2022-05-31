import * as UTILS from "./utils";

var objectName = "", hoverCount = 0;

/**
 * @TODO
 * @param {*} params 
 */
export function setEvents(params) {
  window.addEventListener("resize", onResize);
  window.addEventListener("click", onClick);
  window.addEventListener("mousemove", onMove);
  
  function onResize(e) {
    params.camera.aspect = window.innerWidth / window.innerHeight;
    params.camera.updateProjectionMatrix();
    params.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * @TODO
   * @param {*} e 
   */
  function onClick(e) {
    var intersects = UTILS.getIntersection({
      camera: params.camera,
      objects: params.objects,
      event: e 
    });
    if (intersects.length > 0) {
      var url = intersects[0].object.userData.url;
      if (url) window.open(url, "_blank");
    }
  }
  
  /**
   * @TODO
   * @param {*} e 
   */
  function onMove(e) {
    var intersects = UTILS.getIntersection({
      camera: params.camera,
      objects: params.objects,
      event: e 
    });
    if (intersects.length > 0) {
      var selectedObject = intersects[0].object; // First intersected object
      if (params.objects.includes(selectedObject) && !hoverCount) {
        document.body.style.cursor = "pointer";
        if (params.assets[selectedObject.name].selectable) {
          params.assets[selectedObject.name].hover = true;
          hoverCount++;
        }
        if (params.assets[selectedObject.name].audio) {
          var audio = document.getElementsByTagName("audio")[0];
          if (audio.paused) {
            audio.volume = 0.1;
            audio.play();
          }
        }
        objectName = selectedObject.name;
        UTILS.setVisibility({ divID: objectName, visibility: "visible" });
      }
    }
    else if (objectName) {
      document.body.style.cursor = "default";
      UTILS.setVisibility({ divID: objectName, visibility: "hidden" });
      params.assets[objectName].hover = false;
      hoverCount = 0;
    }
  }
}

/**
 * @TODO
 * @param {*} params 
 */
export function rotateObjects(params) {
  params.objects.forEach((object) => {
    object.rotation.y += 0.005;
    if (hoverCount == 1 && params.assets[object.name].hover) {
      object.rotation.y += 0.025;
    }
  });
}
