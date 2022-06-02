import * as UTILS from "./utils";

var objectName = "", hoverCount = 0;

/**
 * @TODO
 * @param {*} params 
 */
export function setEvents(params) {
  window.addEventListener("resize", onResize);
  window.addEventListener("click", onFirstClick);
  
  /**
   * @TODO
   * @param {*} e 
   */
  function onResize(e) {
    params.camera.aspect = window.innerWidth / window.innerHeight;
    params.camera.updateProjectionMatrix();
    params.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * @TODO
   * @param {*} e 
   */
  function onFirstClick(e) {
    const canvas = document.getElementsByTagName("canvas")[0];
    canvas.classList.add("show");

    const faq = document.getElementById("faq");
    faq.classList.add("show");
    
    const faqTitle = document.getElementById("faq-title");
    faqTitle.addEventListener("click", onFaqClick);

    const quality = document.getElementById("quality");
    quality.classList.add("show");
    quality.addEventListener("click", onQualityClick);

    const fps = document.getElementById("fps-counter");
    fps.classList.add("show");
    
    UTILS.countFPS();
    window.addEventListener("click", onClick);
    window.addEventListener("mousemove", onMove);
    window.removeEventListener("click", onFirstClick);
  }

  /**
   * @TODO
   * @param {*} e 
   */
  function onFaqClick(e) {
    const faq = document.getElementById("faq-questions");
    if (faq.classList.contains("show"))
      faq.classList.remove("show");
    else
      faq.classList.add("show");
  }

  /**
   * @TODO
   * @param {*} e 
   */
  function onQualityClick(e) {
    const quality = document.getElementById("curr-quality");
    const currQuality = quality.innerText;
    
    let nextQuality = "Low";
    switch(currQuality) {
      case "Low":
        nextQuality = "Medium";
        break;
      case "Medium":
        nextQuality = "High";
        break;
      case "High":
        nextQuality = "Low";
        break;
    }
    quality.innerText = nextQuality;
    setQuality(nextQuality);
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

  /**
   * @TODO
   * @param {*} quality 
   */
  function setQuality(quality) {
    let shadows = true, mapSize = 1024;
    switch(quality) {
      case "Low":
        shadows = true;
        mapSize = 1024;
        break;
      case "Medium":
        shadows = true;
        mapSize = 2048;
        break;
      case "High":
        shadows = true;
        mapSize = 4096;
        break;
    }

    params.light.shadow.map.dispose();
    params.light.shadow.map = null;
    params.light.castShadow = shadows;
    params.light.shadow.mapSize.width = mapSize;
    params.light.shadow.mapSize.height = mapSize;
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
