function dstore_device_onChild() {
  // Setup listener for changes to firebase db device
  let { database, ref, onChildAdded, onChildChanged, onChildRemoved } = fb_.fbase;
  let path = `${my.dstore_rootPath}/${my.roomName}/device`;
  let refPath = ref(database, path);

  onChildAdded(refPath, (data) => {
    receivedDeviceKey('dstore_device_onChild Added', data);
  });

  onChildChanged(refPath, (data) => {
    // console.log('dstore_device_onChild Changed', data);
    receivedDeviceKey('dstore_device_onChild Changed', data);
  });

  onChildRemoved(refPath, (data) => {
    receivedDeviceKey('dstore_device_onChild Removed', data, { remove: 1 });
  });

  function receivedDeviceKey(msg, data, remove) {
    let key = data.key;
    let val = data.val();
    // ui_log(my, msg, key, 'n=', Object.keys(val).length);
    // ui_log(my, msg, key, 'n=', JSON.stringify(val));
    ui_log(my, msg, key, val.name_s);

    if (remove) {
      if (my.stored_devices) {
        delete my.stored_devices[key];
        my.ndevice = Object.keys(my.stored_devices).length;
      }
      return;
    }
    dstore_device_fetch(key, val);
  }
}

function dstore_device_fetch(uid, val) {
  if (!my.stored_devices) {
    my.stored_devices = {};
  }
  let device = my.stored_devices[uid];
  let fresh = 0;
  if (!device) {
    // First use of device, add to my.stored_devices
    let index = Object.keys(my.stored_devices).length;
    let layer;
    let crossLayer;
    // !!@ move to dstore_pixchip
    // in p5js allocate graphics layers
    if (window.createGraphics && my.vwidth) {
      layer = createGraphics(my.vwidth, my.vheight);
      crossLayer = createGraphics(my.vwidth, my.vheight);
    }
    device = { uid, index, layer, crossLayer };
    my.stored_devices[uid] = device;
    my.ndevice = index + 1;
    fresh = 1;
  }
  if (val) {
    device.serverValues = val;
  }
  if (fresh && uid == my.uid) {
    // device must be inited to record visit event
    dstore_device_visit();
  }
  return device;
}

// --

function dstore_device_remove() {
  let { database, ref, set } = fb_.fbase;
  let path = `${my.dstore_rootPath}/${my.roomName}/device/${my.uid}`;
  let refPath = ref(database, path);
  set(refPath, {})
    .then(() => {
      // Data saved successfully!
      // ui_log(my, 'dstore_device_remove OK');
    })
    .catch((error) => {
      // The write failed...
      ui_log(my, 'dstore_device_remove error', error);
    });
}

// --

function dstore_device_summary() {
  let arr = Object.values(my.stored_devices).sort((item1, item2) => {
    let date1 = item1.serverValues.date_s;
    let date2 = item2.serverValues.date_s;
    return date1.localeCompare(date2);
  });
  let lines = [];
  for (let item of arr) {
    let { uid } = item;
    let { date_s, visit_count, update_count, userAgent } = item.serverValues;
    userAgent = userAgent.substring(8, 48);
    lines.push(date_s + ' visit_count ' + visit_count + ' update_count ' + update_count);
    lines.push(uid + ' ' + userAgent);
    // console.log('');
  }
  lines.push('dstore_device_summary n ' + arr.length);
  // console.log('dstore_device_summary', arr);
  console.log(lines.join('\n'));
}
