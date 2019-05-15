const  fs= require('fs');


 function js(path) {
  try {
    return require(path);
  } catch (error) {
    console.log('load js error :',error);
    return null;
  }
}

 function file(path) {
  console.log("read file:", path);
  return new Promise((r, e) => {
    fs.readFile(path, "utf8", async function(err, data) {
      if (!err) {
        r(data);
      } else {
        console.error("read file", err);
        e(err);
      }
    });
  });
}

 function savefile(path, content) {
  return new Promise((r, e) => {
    fs.writeFile(path, content, {}, async function(err) {
      if (!err) {
        r();
      } else {
        console.error("save file", err);
        e(err);
      }
    });
  });
}

 function mkdir(path) {
  return new Promise((r, e) => {
    fs.mkdir(path, async function(err) {
      r();
      // if (!err) {
      //   r();
      // } else {
      //   console.error("mkdir", err);
      //   e(err);
      // }
    });
  });
}
module.exports = {
  js, file, savefile, mkdir
}
