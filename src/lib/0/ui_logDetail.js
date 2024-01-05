//
function ui_logDetailFlag_changed(my, newValue) {
  my.logDetailFlag = newValue;
  ui_set_hidden(my.logDetail_div, my.logDetailFlag);
}
window.ui_logDetailFlag_changed = ui_logDetailFlag_changed;

// Updates my.logDetail_div with running log
function ui_log(my, ...args) {
  if (!my.logLines) {
    ui_log_init(my);
  }
  if (!my.logDetail_div) {
    ui_logSummary_div(my);
  }
  let key = args[0];
  let ent = ui_logTagEntry(key);
  ent.count++;
  if (ent.console) {
    console.log(...args);
  }
  let str = args.join(' ');
  ui_log_add(my, my.logLines, str);
  ui_log_add(my, ent.lines, str);
  str = my.logLines.join('<br/>');
  my.logDetail_div.html(str);
  // console.log('str', str);
}
window.ui_log = ui_log;

function ui_log_add(my, lines, str) {
  lines.push(str);
  if (lines.length > my.logLinesMax) {
    lines.splice(0, 1);
  }
}

function ui_log_clear(my) {
  my.logLines = [];
  my.logDetail_div.html('');
}
window.ui_log_clear = ui_log_clear;

function ui_logTagEntry(key) {
  let ent = my.logTags[key];
  if (!ent) {
    ent = { count: 0, console: 0, lines: [] };
    my.logTags[key] = ent;
  }
  return ent;
}

function ui_log_init(my) {
  my.logLines = [];
  if (!my.logLinesMax) {
    my.logLinesMax = 5;
  }
  if (!my.logTags) {
    my.logTags = {};
  }
}

function ui_error(...args) {
  ui_log(...args);
  alert(...args);
}
window.ui_error = ui_error;

// --

function ui_toggle_scroll(my) {
  if (window.scrollY > 0) {
    // scroll down some. jump back to top
    console.log('ui_toggle_scroll jump to top');
    window.scrollBy(0, -1000);
    my.scrolling = 0;
  } else {
    // At top. initiated scrolling
    console.log('ui_toggle_scroll start');
    my.scrolling = 1;
    setTimeout(function () {
      console.log('ui_toggle_scroll stop');
      my.scrolling = 0;
    }, my.scrollStopSecs * 1000);
  }
}
window.ui_toggle_scroll = ui_toggle_scroll;

function ui_check_scroll(my) {
  if (my.scrolling) {
    window.scrollBy(0, 1);
  }
}
window.ui_check_scroll = ui_check_scroll;

//
