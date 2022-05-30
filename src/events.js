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
  
  function onClick(e) {
    var intersects = UTILS.getIntersection({
      camera: params.camera,
      objects: params.objects,
      event: e 
    });
    if (intersects.length > 0) {
      var url = intersects[0].object.userData.url;
      window.open(url, "_blank");
    }
  }
  
  function onMove(e) {
    var intersects = UTILS.getIntersection({
      camera: params.camera,
      objects: params.objects,
      event: e 
    });
    if (intersects.length > 0) {
      document.body.style.cursor = "pointer";
      var selectedObject = intersects[0].object; // First intersected object
      if (params.objects.includes(selectedObject) && !hoverCount) {
        params.assets[selectedObject.name].hover = true;
        objectName = selectedObject.name;
        hoverCount++;
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
