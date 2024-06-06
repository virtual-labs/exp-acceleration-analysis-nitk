//Script specific to simulation

//program variables
//controls section
var simstatus = 0;
var rotstatus = 1;
a;
//comments section
var commenttext = "Some Text";
var commentloc = 0;
//computing section
var trans = new point(100, 150);
var transV = new point(400, 150);
var transA = new point(310, 220);

//var cross= new point(375,150);
var a = new point(0, 0, "A");
var b = new point(0, 0, "B");
var c = new point(0, 0, "C");
var d = new point(0, 0, "D");

var vo = new point(0, 0, "");
var vba = new point(0, 0, "");
var vcb = new point(0, 0, "");
var vca = new point(0, 0, "");

var ao = new point(0, 0, "Ao");
var ab = new point(0, 0, "Ab");
var acb = new point(0, 0, "Acb"); // acceleration of c wrt b
var ac = new point(0, 0, "Ac");
var accb = new point(0, 0, "ACcb");
var acc = new point(0, 0, "ACc");
var atcb = new point(0, 0, "ATcb");
var atc = new point(0, 0, "ATc");

var Vba = new point(0, 0, "Vba");
var Vcb = new point(0, 0, "Vcb");
var Vca = new point(0, 0, "Vca");

var Ab = new point(0, 0, "Ab");
var Acb = new point(0, 0, "Acb");
var Ac = new point(0, 0, "Ac");

var vel2 = 0,
  vel3 = 0,
  vel4 = 0;
var acctb = 0,
  acccb = 0,
  acclb = 0,
  acctcb = 0,
  accccb = 0,
  acclcb = 0,
  acccc = 0,
  acctc = 0,
  acclc = 0;
var r1 = 40,
  r2 = 40,
  r3 = 40,
  r4 = 40;
var theta2 = 55; // all angles to be defined either in degrees only or radians only throughout the program and convert as and when required
var theta3 = 0,
  theta4 = 0; // All angles in Degrees. (mention the specification in the script like here)
var omega2 = 1; // angular velocity in rad/s
var omega3 = 0,
  omega4 = 0;
var alpha2 = 0,
  alpha3 = 0,
  alpha4 = 0;
var gamma = 0,
  gammadash = 0,
  theta3dash = 0,
  theta4dash = 0;
var k, ka, kb, kc, det;
var flaggrashof = true,
  firstrun = true;
//graphics section
var canvas;
var ctx;
var scaleP = 1;
var scaleV = 1;
//timing section
var simTimeId = setInterval("", "1000");
var pauseTime = setInterval("", "1000");
var time = 0;
//point tracing section
var ptx = [];
var pty = [];
//click status of legend and quick reference
var legendCS = false;
var quickrefCS = false;
//temporary or dummy variables
var temp = 0;

/*
// for trials during development
function trythis()
{ 		alert();}
*/

const PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;

  return dpr / bsr;
})();

const createHiDPICanvas = function (w, h, ratio) {
  if (!ratio) {
    ratio = PIXEL_RATIO;
  }
  var can = document.getElementById("simscreen");
  can.width = w * ratio;
  can.height = h * ratio;
  // can.style.width = w + "px";
  // can.style.height = h + "px";
  can.style.width = can.parentElement.offsetWidth;
  can.style.height = can.parentElement.offsetHeight;
  can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return can;
};

//change simulation specific css content. e.g. padding on top of variable to adjust appearance in variables window
function editcss() {
  $(".variable").css("padding-top", "20px");
  // $('#datatable1').css('position','absolute');
  //$('#datatable2').css('position','absolute');
  // $('#datatable1').css('left','50px');
  // $('#datatable1').css('top','410px');
  //$('#datatable2').css('left','395px');
  //$('#datatable2').css('top','340px');

  $("#legend").css("width", document.getElementById("legendimg").width + "px");
  $("#legendicon").css("top", "471px");
  //$('#quickref').css("height",document.getElementById('quickrefimg').height+"px");
}

//start of simulation here; starts the timer with increments of 0.1 seconds
function startsim() {
  simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
}

// switches state of simulation between 0:Playing & 1:Paused
function simstate() {
  var imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluepausedull") {
    document.getElementById("playpausebutton").src = "images/blueplaydull.svg";
    clearInterval(simTimeId);
    simstatus = 1;
    $("#theta2spinner").spinner("value", theta2); //to set simulation parameters on pause
    pauseTime = setInterval("varupdate();", "100");
    document.querySelector(".playPause").textContent = "Play";
  }
  if (imgfilename == "blueplaydull") {
    time = 0;
    clearInterval(pauseTime);
    document.getElementById("playpausebutton").src = "images/bluepausedull.svg";
    simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
    simstatus = 0;
    document.querySelector(".playPause").textContent = "Pause";
  }
}

// switches state of rotation between 1:CounterClockWise & -1:Clockwise
function rotstate() {
  var imgfilename = document.getElementById("rotationbutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluecwdull") {
    document.getElementById("rotationbutton").src = "images/blueccwdull.svg";
    rotstatus = -1;
  }
  if (imgfilename == "blueccwdull") {
    document.getElementById("rotationbutton").src = "images/bluecwdull.svg";
    rotstatus = 1;
  }
}

//Displaying Legend
function showLegend() {
  if (legendCS) {
    $("#legendicon").css("border", "double");
    $("#legend").css("height", "0px");
    $("#legend").css("border", "0px");
    legendCS = false;
  } else {
    $("#legendicon").css("border", "inset red");
    $("#legend").css(
      "height",
      document.getElementById("legendimg").height + "px"
    );
    $("#legend").css("border", "solid 1px");
    legendCS = true;
  }
}

//Initialise system parameters here
function varinit() {
  varchange();
  //Variable r1 slider and number input types
  $("#r1slider").slider("value", 80);
  $("#r1spinner").spinner("value", 80);
  //Variable r2 slider and number input types
  $("#r2slider").slider("value", 40);
  $("#r2spinner").spinner("value", 40);
  //Variable r3 slider and number input types
  $("#r3slider").slider("value", 80);
  $("#r3spinner").spinner("value", 80);
  //Variable r4 slider and number input types
  $("#r4slider").slider("value", 80);
  $("#r4spinner").spinner("value", 80);
  //Variable theta2 slider and number input types
  $("#theta2slider").slider("value", 40);
  $("#theta2spinner").spinner("value", 40);
  //Variable omega2 slider and number input types
  $("#omega2slider").slider("value", 1);
  $("#omega2spinner").spinner("value", 1);
}

// Initialise and Monitor variable containing user inputs of system parameters.
//change #id and repeat block for new variable. Make sure new <div> with appropriate #id is included in the markup
function varchange() {
  //Variable r1 slider and number input types
  $("#r1slider").slider({ max: 100, min: 20, step: 2 }); // slider initialisation : jQuery widget
  $("#r1spinner").spinner({ max: 100, min: 20, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#r1slider").on("slide", function (e, ui) {
    $("#r1spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#r1spinner").on("spin", function (e, ui) {
    $("#r1slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#r1spinner").on("change", function () {
    varchange();
  });

  //Variable r1 slider and number input types
  $("#r2slider").slider({ max: 100, min: 20, step: 2 }); // slider initialisation : jQuery widget
  $("#r2spinner").spinner({ max: 100, min: 20, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#r2slider").on("slide", function (e, ui) {
    $("#r2spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
    r2changed();
  });
  $("#r2spinner").on("spin", function (e, ui) {
    $("#r2slider").slider("value", ui.value);
    ptx = [];
    pty = [];
    r2changed();
  });
  $("#r2spinner").on("change", function () {
    varchange();
  });

  //Variable r1 slider and number input types
  $("#r3slider").slider({ max: 100, min: 20, step: 2 }); // slider initialisation : jQuery widget
  $("#r3spinner").spinner({ max: 100, min: 20, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#r3slider").on("slide", function (e, ui) {
    $("#r3spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#r3spinner").on("spin", function (e, ui) {
    $("#r3slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#r3spinner").on("change", function () {
    varchange();
  });

  //Variable r1 slider and number input types
  $("#r4slider").slider({ max: 100, min: 20, step: 2 }); // slider initialisation : jQuery widget
  $("#r4spinner").spinner({ max: 100, min: 20, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#r4slider").on("slide", function (e, ui) {
    $("#r4spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#r4spinner").on("spin", function (e, ui) {
    $("#r4slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#r4spinner").on("change", function () {
    varchange();
  });

  //Variable theta2 slider and number input types
  $("#theta2slider").slider({ max: 360, min: 0, step: 2 }); // slider initialisation : jQuery widget
  $("#theta2spinner").spinner({ max: 360, min: 0, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#theta2slider").on("slide", function (e, ui) {
    $("#theta2spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#theta2spinner").on("spin", function (e, ui) {
    $("#theta2slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#theta2spinner").on("change", function () {
    varchange();
  });

  //Variable omega2 slider and number input types
  $("#omega2slider").slider({ max: 1.8, min: 0.2, step: 0.2 }); // slider initialisation : jQuery widget
  $("#omega2spinner").spinner({ max: 1.8, min: 0.2, step: 0.2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#omega2slider").on("slide", function (e, ui) {
    $("#omega2spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#omega2spinner").on("spin", function (e, ui) {
    $("#omega2slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#omega2spinner").on("change", function () {
    varchange();
  });

  varupdate();
}

//Four Bar Specific : resetting lower limit of r1 r3 r4 on change of r2
function r2changed() {
  $("#r1slider").slider({ min: $("#r2spinner").spinner("value") });
  $("#r3slider").slider({ min: $("#r2spinner").spinner("value") });
  $("#r4slider").slider({ min: $("#r2spinner").spinner("value") });
  $("#r1spinner").spinner({ min: $("#r2spinner").spinner("value") });
  $("#r3spinner").spinner({ min: $("#r2spinner").spinner("value") });
  $("#r4spinner").spinner({ min: $("#r2spinner").spinner("value") });
}

//Computing of various system parameters
function varupdate() {
  $("#r1slider").slider("value", $("#r1spinner").spinner("value")); //updating slider location with change in spinner(debug)
  $("#r2slider").slider("value", $("#r2spinner").spinner("value"));
  $("#r3slider").slider("value", $("#r3spinner").spinner("value"));
  $("#r4slider").slider("value", $("#r4spinner").spinner("value"));
  $("#theta2slider").slider("value", $("#theta2spinner").spinner("value"));
  $("#omega2slider").slider("value", $("#omega2spinner").spinner("value"));

  r1 = $("#r1spinner").spinner("value");
  r2 = $("#r2spinner").spinner("value");
  r3 = $("#r3spinner").spinner("value");
  r4 = $("#r4spinner").spinner("value");

  if (!simstatus) {
    $("#omega2set").show();
    $("#theta2set").hide();

    $("#r1spinner").spinner("disable");
    $("#r2spinner").spinner("disable");
    $("#r3spinner").spinner("disable");
    $("#r4spinner").spinner("disable");
    $("#r1slider").slider("disable");
    $("#r2slider").slider("disable");
    $("#r3slider").slider("disable");
    $("#r4slider").slider("disable");

    omega2 = rotstatus * $("#omega2spinner").spinner("value");
    theta2 = theta2 + 0.1 * deg(omega2);
    theta2 = theta2 % 360;
  }

  if (simstatus) {
    if (firstrun) {
      r2changed();
      firstrun = false;
    }
    $("#r1spinner").spinner("enable");
    $("#r2spinner").spinner("enable");
    $("#r3spinner").spinner("enable");
    $("#r4spinner").spinner("enable");
    $("#r1slider").slider("enable");
    $("#r2slider").slider("enable");
    $("#r3slider").slider("enable");
    $("#r4slider").slider("enable");

    $("#omega2set").hide();
    $("#theta2set").show();
    theta2 = $("#theta2spinner").spinner("value");
    omega2 = rotstatus * $("#omega2spinner").spinner("value");
  }
  checkGrashof();
  if (flaggrashof) {
    k = (r2 * r2 - r3 * r3 + r4 * r4 + r1 * r1) / 2;
    ka = k - r2 * (r1 - r4) * Math.cos(rad(theta2)) - r4 * r1;
    kb = -2 * r2 * r4 * Math.sin(rad(theta2));
    kc = k - r2 * (r1 + r4) * Math.cos(rad(theta2)) + r4 * r1;
    det = kb * kb - 4 * ka * kc;

    a.xcoord = 0;
    a.ycoord = 0;
    vo.xcoord = 0;
    vo.ycoord = 0;
    ao.xcoord = 0;
    ao.ycoord = 0;

    b.xcoord = a.xcoord + r2 * Math.cos(rad(theta2));
    b.ycoord = a.ycoord + r2 * Math.sin(rad(theta2));
    d.xcoord = a.xcoord + r1;
    d.ycoord = a.ycoord;

    if (r1 == r3 && r2 == r4) {
      theta4 = theta2;
    }
    //else
    {
      theta4 = deg(2 * Math.atan((-kb - Math.sqrt(det)) / (2 * ka)));
    }

    c.xcoord = d.xcoord + r4 * Math.cos(rad(theta4));
    c.ycoord = d.ycoord + r4 * Math.sin(rad(theta4));
    theta3 = deg(Math.atan((c.ycoord - b.ycoord) / (c.xcoord - b.xcoord)));

    gamma = theta4 - theta3;

    if (theta2 < 0) theta2 += 360;
    if (theta3 < 0) theta3 += 180;
    if (theta4 < 0) theta4 += 360;

    // Velocity Calculations

    if (Math.abs(r2 * omega2) < 20) scaleV = 4;
    else if (Math.abs(r2 * omega2) > 20 && Math.abs(r2 * omega2) < 40)
      scaleV = 3;
    else if (Math.abs(r2 * omega2) > 120 && Math.abs(r2 * omega2) < 160)
      scaleV = 0.5;
    else if (Math.abs(r2 * omega2) > 160) scaleV = 0.25;
    else scaleV = 1;

    vel2 = r2 * omega2 * scaleV;
    vba.xcoord = vo.xcoord + vel2 * Math.cos(rad(theta2 + 90));
    vba.ycoord = vo.ycoord + vel2 * Math.sin(rad(theta2 + 90));
    omega3 =
      (((r2 * omega2) / r3) *
        (Math.sin(rad(theta2)) * Math.cos(rad(theta4)) -
          Math.sin(rad(theta4)) * Math.cos(rad(theta2)))) /
      (Math.sin(rad(theta4)) * Math.cos(rad(theta3)) -
        Math.sin(rad(theta3)) * Math.cos(rad(theta4)));
    omega4 =
      (((r2 * omega2) / r4) *
        (Math.sin(rad(theta2)) * Math.cos(rad(theta3)) -
          Math.sin(rad(theta3)) * Math.cos(rad(theta2)))) /
      (Math.sin(rad(theta4)) * Math.cos(rad(theta3)) -
        Math.sin(rad(theta3)) * Math.cos(rad(theta4)));
    vel3 = r3 * omega3 * scaleV;
    vel4 = r4 * omega4 * scaleV;
    vcb.xcoord = vba.xcoord + vel3 * Math.cos(rad(theta3 + 90));
    vcb.ycoord = vba.ycoord + vel3 * Math.sin(rad(theta3 + 90));
    vca.xcoord = vo.xcoord + vel4 * Math.cos(rad(theta4 + 90));
    vca.ycoord = vo.ycoord + vel4 * Math.sin(rad(theta4 + 90));

    //acceleration calculations

    acccb = r2 * omega2 * omega2;
    acctb = 0;
    acclb = Math.sqrt(acctb * acctb + acccb * acccb);
    accccb = r3 * omega3 * omega3;
    acccc = r4 * omega4 * omega4;
    var ta = 0,
      tb = 0,
      tc = 0,
      td = 0,
      te = 0,
      tf = 0;

    ta = r4 * Math.sin(rad(theta4));
    tb = r3 * Math.sin(rad(theta3));
    td = r4 * Math.cos(rad(theta4));
    te = r3 * Math.cos(rad(theta3));
    tc =
      acccb * Math.cos(rad(theta2)) +
      accccb * Math.cos(rad(theta3)) -
      acccc * Math.cos(rad(theta4));
    tf =
      -acccb * Math.sin(rad(theta2)) -
      accccb * Math.sin(rad(theta3)) +
      acccc * Math.sin(rad(theta4));

    alpha3 = (tc * td - ta * tf) / (ta * te - tb * td);
    alpha4 = (tc * te - tb * tf) / (ta * te - tb * td);
    acctcb = alpha3 * r3;
    acclcb = Math.sqrt(acctcb * acctcb + accccb * accccb);
    acctc = alpha4 * r4;
    acclc = Math.sqrt(acctc * acctc + acccc * acccc);

    //Acceleration Scale Calculation

    if (
      Math.round(Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))) <
      10
    )
      scaleA = 10;
    else if (
      Math.round(
        Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))
      ) >= 10 &&
      Math.round(Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))) <
        20
    )
      scaleA = 4;
    else if (
      Math.round(
        Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))
      ) >= 20 &&
      Math.round(Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))) <
        40
    )
      scaleA = 2;
    else if (
      Math.round(
        Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))
      ) >= 40 &&
      Math.round(Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))) <
        120
    )
      scaleA = 1;
    else if (
      Math.round(
        Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))
      ) >= 120 &&
      Math.round(Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc))) <
        150
    )
      scaleA = 0.5;
    else
      scaleA =
        1 /
        Math.round(
          Math.max(Math.abs(acclb), Math.abs(acclcb), Math.abs(acclc)) / 100
        );

    //Acceleration Coordinate Definitions
    ao.xcoord = 0;
    ao.ycoord = 0;
    ab.xcoord = ao.xcoord + scaleA * acclb * Math.cos(rad(180 + theta2));
    ab.ycoord = ao.ycoord + scaleA * acclb * Math.sin(rad(180 + theta2));

    accb.xcoord = ab.xcoord + scaleA * accccb * Math.cos(rad(180 + theta3));
    accb.ycoord = ab.ycoord + scaleA * accccb * Math.sin(rad(180 + theta3));
    atcb.xcoord = accb.xcoord + scaleA * acctcb * Math.cos(rad(90 + theta3));
    atcb.ycoord = accb.ycoord + scaleA * acctcb * Math.sin(rad(90 + theta3));

    acb.xcoord = atcb.xcoord;
    acb.ycoord = atcb.ycoord;

    acc.xcoord = ao.xcoord + scaleA * acccc * Math.cos(rad(180 + theta4));
    acc.ycoord = ao.ycoord + scaleA * acccc * Math.sin(rad(180 + theta4));
    atc.xcoord = acc.xcoord + scaleA * acctc * Math.cos(rad(90 + theta4));
    atc.ycoord = acc.ycoord + scaleA * acctc * Math.sin(rad(90 + theta4));

    ac.xcoord = atc.xcoord;
    ac.ycoord = atc.ycoord;

    // printcomment("AD=r1   AB=r2   BC=r3   CD=r4<br> r1 is grounded. r2 is given input<br> Data table contains actual values",1);
    // printcomment("V and A in table are linear Velocity and Acceleration, respectively, of one end of link wrt another",2);
  }
  draw();
}

//Simulation graphics
function draw() {
  // canvas = document.getElementById("simscreen");
  //Create canvas with the device resolution.
  canvas = createHiDPICanvas(550, 400);

  //Create canvas with a custom resolution.
  // var myCustomCanvas = createHiDPICanvas(500, 200, 4);
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 550, 400); //clears the complete canvas#simscreen everytime
  if (flaggrashof) {
    $("#titleincanvas").show();
    $("#datatable1").show();
    //$('#datatable2').show();
    $("#vba").show();
    $("#vcb").show();
    $("#vca").show();
    $("#ab").show();
    $("#acb").show();
    $("#ac").show();
    $("#legendicon").show();

    a = pointtrans(a, trans);
    b = pointtrans(b, trans);
    c = pointtrans(c, trans);
    d = pointtrans(d, trans);

    document.getElementById("titleincanvas").innerHTML = "Grashof Linkage";
    pointjoin(a, b, ctx, "#0066FF");
    pointjoin(b, c, ctx, "#D00000");
    pointjoin(c, d, ctx, "#005500");
    pointjoin(d, a, ctx, "#993300");

    pointdisp(a, ctx);
    pointdisp(b, ctx);
    pointdisp(c, ctx);
    pointdisp(d, ctx);
    // Position Diagram Title
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = "500 1.4rem 'Nunito'";

    ctx.fillStyle = "#000000";

    //displaying scale values
    if (scaleP >= 1)
      ctx.fillText("Position Diagram (Scale = 1:" + scaleP + ")", 20, 50);
    if (scaleP < 1)
      ctx.fillText("Position Diagram (Scale = " + 1 / scaleP + ":1)", 50, 50);

    if (scaleV >= 1)
      ctx.fillText("Velocity Diagram (Scale = 1:" + scaleV + ")", 300, 50);
    if (scaleV < 1)
      ctx.fillText("Velocity Diagram (Scale = " + 1 / scaleV + ":1)", 300, 50);

    if (scaleA >= 1)
      ctx.fillText("Acceleration Diagram (Scale = 1:" + scaleA + ")", 200, 320);
    if (scaleA < 1)
      ctx.fillText(
        "Acceleration Diagram (Scale = " + 1 / scaleA + ":1)",
        200,
        320
      );
    ctx.restore();
    ctx.restore();

    drawvel(ctx);
  } else {
    $("#titleincanvas").hide();
    $("#datatable1").hide();
    //$('#datatable2').hide();
    $("#vba").hide();
    $("#vcb").hide();
    $("#vca").hide();
    $("#ab").hide();
    $("#acb").hide();
    $("#ac").hide();
    $("#legendicon").hide();
    $("#newComment").hide();
    ctx.strokeStyle = "#000000";
    ctx.font = "16px 'Nunito',san-serif";
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeText("Combination does not satisfy Grashof rule ", 100, 200);

    ctx.restore();

    ctx.strokeText("Please go to non-Grashof simulation", 100, 300);
    ctx.strokeText("if you wish to work with the given", 105, 314);
    ctx.strokeText("link combination", 180, 330);

    // printcomment("Please go to non-Grashof simulation<br>if you wish to work with the given <br> link combination",0)
  }
}

//function to draw velocity diagram
function drawvel(ctx) {
  //Velocity Diagram
  vo = pointtrans(vo, transV);
  vba = pointtrans(vba, transV);
  vca = pointtrans(vca, transV);
  vcb = pointtrans(vcb, transV);

  pointjoin(vo, vba, ctx, "#0066FF", 2);
  drawArrow(
    vba.xcoord,
    vba.ycoord,
    ctx,
    180 - theta2 - rotstatus * 90,
    15,
    30,
    "#0066FF"
  );

  pointjoin(vba, vcb, ctx, "#D00000", 2);
  drawArrow(
    vcb.xcoord,
    vcb.ycoord,
    ctx,
    180 - theta3 - signof(omega3) * 90,
    15,
    30,
    "#D00000"
  );

  pointjoin(vo, vca, ctx, "#005500", 2);
  drawArrow(
    vca.xcoord,
    vca.ycoord,
    ctx,
    180 - theta4 - signof(omega4) * 90,
    15,
    30,
    "#005500"
  );

  (Vba.xcoord = (vo.xcoord + vba.xcoord) / 2), // Calculate the midpoint along the x-axis
    (Vba.ycoord = (vo.ycoord + vba.ycoord) / 2); // Calculate the midpoint along the y-axis
  pointdisp(Vba, ctx, 2, "blue", "white", "black", "12px", "12px");

  (Vcb.xcoord = (vba.xcoord + vcb.xcoord) / 2), // Calculate the midpoint along the x-axis
    (Vcb.ycoord = (vba.ycoord + vcb.ycoord) / 2); // Calculate the midpoint along the y-axis
  pointdisp(Vcb, ctx, 2, "blue", "white", "black", "12px", "12px");

  (Vca.xcoord = (vo.xcoord + vca.xcoord) / 2), // Calculate the midpoint along the x-axis
    (Vca.ycoord = (vo.ycoord + vca.ycoord) / 2); // Calculate the midpoint along the y-axis
  pointdisp(Vca, ctx, 2, "blue", "white", "black", "12px", "12px");

  //positioning labels
  document.getElementById("vba").style.position = "absolute";
  document.getElementById("vca").style.position = "absolute";
  document.getElementById("vcb").style.position = "absolute";
  document.getElementById("vba").style.margin = "0";
  document.getElementById("vca").style.margin = "0";
  document.getElementById("vcb").style.margin = "0";
  document.getElementById("vba").style.width = "20px";
  document.getElementById("vba").style.height = "20px";
  document.getElementById("vca").style.width = "20px";
  document.getElementById("vca").style.height = "20px";
  document.getElementById("vcb").style.width = "20px";
  document.getElementById("vcb").style.height = "20px";
  document.getElementById("vba").style.fontSize = "11px";
  document.getElementById("vca").style.fontSize = "11px";
  document.getElementById("vcb").style.fontSize = "11px";
  document.getElementById("vba").style.left =
    "" + (-10 + Math.round(60 + transV.xcoord + vba.xcoord) / 2) + "px";
  document.getElementById("vba").style.top =
    "" + (-10 + Math.round(200 + transV.ycoord + vba.ycoord) / 2) + "px";
  document.getElementById("vca").style.left =
    "" + (-10 + Math.round(60 + transV.xcoord + vcb.xcoord) / 2) + "px";
  document.getElementById("vca").style.top =
    "" + (-10 + Math.round(200 + transV.ycoord + vcb.ycoord) / 2) + "px";
  document.getElementById("vcb").style.left =
    "" + (-10 + Math.round(60 + vba.xcoord + vca.xcoord) / 2) + "px";
  document.getElementById("vcb").style.top =
    "" + (-10 + Math.round(200 + vba.ycoord + vca.ycoord) / 2) + "px";

  drawacc(ctx);
}

//function to check whether links satisfy grashof condition
function checkGrashof() {
  var links = new Array(4);
  links[0] = r1;
  links[1] = r2;
  links[2] = r3;
  links[3] = r4;
  links.sort(function (p, q) {
    return p - q;
  });
  var s = links[0];
  var p = links[1];
  var q = links[2];
  var l = links[3];
  if (s + l > p + q) {
    flaggrashof = false;
  } else {
    flaggrashof = true;
  }
}

function drawacc(context) {
  document.getElementById("datatable1").innerHTML =
    "\
<table>\
<tr><th>Link</th><th>Length</th><th>&theta;</th><th>&omega;</th><th>V</th><th>&alpha;</th><th>A<sub>c</sub></th><th>A<sub>t</sub></th><th>A</th></tr>\
<tr><td>r2</td><td>" +
    r2 +
    "</td><td>" +
    roundd(theta2, 2) +
    "</td><td>" +
    roundd(omega2, 2) +
    "</td><td>" +
    roundd(r2 * omega2, 2) +
    "</td><td>" +
    roundd(alpha2, 2) +
    "</td><td>" +
    roundd(acccb, 2) +
    "</td><td>" +
    roundd(acctb, 2) +
    "</td><td>" +
    roundd(acclb, 2) +
    "</td></tr>\
<tr><td>r3</td><td>" +
    r3 +
    "</td><td>" +
    roundd(theta3, 2) +
    "</td><td>" +
    roundd(omega3, 2) +
    "</td><td>" +
    roundd(r3 * omega3, 2) +
    "</td><td>" +
    roundd(alpha3, 2) +
    "</td><td>" +
    roundd(accccb, 2) +
    "</td><td>" +
    roundd(acctcb, 2) +
    "</td><td>" +
    roundd(acclcb, 2) +
    "</td></tr>\
<tr><td>r4</td><td>" +
    r4 +
    "</td><td>" +
    roundd(theta4, 2) +
    "</td><td>" +
    roundd(omega4, 2) +
    "</td><td>" +
    roundd(r4 * omega4, 2) +
    "</td><td>" +
    roundd(alpha4, 2) +
    "</td><td>" +
    roundd(acccc, 2) +
    "</td><td>" +
    roundd(acctc, 2) +
    "</td><td>" +
    roundd(acclc, 2) +
    "</td></tr>\
<tr><td>(Units)</td><td>mm</td><td>&deg;</td><td>rad/s</td><td>mm/s</td><td>rad/s<sup>2</sup></td><td>mm/s<sup>2</sup></td><td>mm/s<sup>2</sup></td><td>mm/s<sup>2</sup></td></tr>\
</table>";

  //Acceleration Diagram
  ao = pointtrans(ao, transA);
  ab = pointtrans(ab, transA);
  acb = pointtrans(acb, transA);
  ac = pointtrans(ac, transA);
  accb = pointtrans(accb, transA);
  acc = pointtrans(acc, transA);
  atcb = pointtrans(atcb, transA);
  atc = pointtrans(atc, transA);

  angcb = deg(Math.atan((acb.ycoord - ab.ycoord) / (acb.xcoord - ab.xcoord)));
  angc = deg(Math.atan((ac.ycoord - ao.ycoord) / (ac.xcoord - ao.xcoord)));

  pointjoin(ao, ab, context, "#0066FF", 3);
  drawArrow(ab.xcoord, ab.ycoord, context, -theta2, 15, 30, "#0066FF");

  pointjoin(ab, accb, context, "#D00000", 1);
  drawArrow(accb.xcoord, accb.ycoord, context, -theta3, 15, 30, "#D00000");

  pointjoin(ab, acb, context, "#D00000", 3);
  drawArrow(
    acb.xcoord,
    acb.ycoord,
    context,
    270 - signof(acb.xcoord - ab.xcoord) * 90 + angcb,
    15,
    30,
    "#D00000"
  );

  pointjoin(ao, acc, context, "#005500", 1);
  drawArrow(acc.xcoord, acc.ycoord, context, -theta4, 15, 30, "#005500");

  pointjoin(ao, ac, context, "#005500", 3);
  drawArrow(
    ac.xcoord,
    ac.ycoord,
    context,
    270 - signof(ac.xcoord - ao.xcoord) * 90 + angc,
    15,
    30,
    "#005500"
  );

  (Ab.xcoord = (ao.xcoord + ab.xcoord) / 2), // Calculate the midpoint along the x-axis
    (Ab.ycoord = (ao.ycoord + ab.ycoord) / 2); // Calculate the midpoint along the y-axis
  pointdisp(Ab, ctx, 2, "blue", "white", "black", "12px", "12px");

  (Acb.xcoord = (ab.xcoord + acb.xcoord) / 2), // Calculate the midpoint along the x-axis
    (Acb.ycoord = (ab.ycoord + acb.ycoord) / 2); // Calculate the midpoint along the y-axis
  pointdisp(Acb, ctx, 2, "blue", "white", "black", "12px", "12px");

  (Ac.xcoord = (ao.xcoord + ac.xcoord) / 2), // Calculate the midpoint along the x-axis
    (Ac.ycoord = (ao.ycoord + ac.ycoord) / 2); // Calculate the midpoint along the y-axis
  pointdisp(Ac, ctx, 2, "blue", "white", "black", "12px", "12px");

  // dashed line for Tangential Accelerations
  context.save();
  context.beginPath();
  context.setLineDash([5, 5]);
  pointjoin(acc, atc, context, "#005500", 1);
  drawArrow(
    atc.xcoord,
    atc.ycoord,
    context,
    -theta4 + signof(acctc) * 90,
    15,
    30,
    "#005500"
  );
  pointjoin(accb, atcb, context, "#D00000", 1);
  drawArrow(
    atcb.xcoord,
    atcb.ycoord,
    context,
    -theta3 + signof(acctcb) * 90,
    15,
    30,
    "#D00000"
  );
  context.closePath();
  context.restore();

  //positioning labels
  document.getElementById("ab").style.position = "absolute";
  document.getElementById("acb").style.position = "absolute";
  document.getElementById("ac").style.position = "absolute";
  document.getElementById("ab").style.margin = "0";
  document.getElementById("acb").style.margin = "0";
  document.getElementById("ac").style.margin = "0";
  document.getElementById("ab").style.width = "20px";
  document.getElementById("ab").style.height = "20px";
  document.getElementById("acb").style.width = "20px";
  document.getElementById("acb").style.height = "20px";
  document.getElementById("ac").style.width = "20px";
  document.getElementById("ac").style.height = "20px";
  document.getElementById("ab").style.fontSize = "11px";
  document.getElementById("acb").style.fontSize = "11px";
  document.getElementById("ac").style.fontSize = "11px";
  document.getElementById("ab").style.left =
    "" + (-10 + Math.round(60 + transA.xcoord + ab.xcoord) / 2) + "px";
  document.getElementById("ab").style.top =
    "" + (-10 + Math.round(200 + transA.ycoord + ab.ycoord) / 2) + "px";
  document.getElementById("ac").style.left =
    "" + (-10 + Math.round(60 + transA.xcoord + ac.xcoord) / 2) + "px";
  document.getElementById("ac").style.top =
    "" + (-10 + Math.round(200 + transA.ycoord + ac.ycoord) / 2) + "px";
  document.getElementById("acb").style.left =
    "" + (-10 + Math.round(60 + ab.xcoord + acb.xcoord) / 2) + "px";
  document.getElementById("acb").style.top =
    "" + (-10 + Math.round(200 + ab.ycoord + acb.ycoord) / 2) + "px";
}
// prints comments passed as 'commenttext' in location specified by 'commentloc' in the comments box;
// 0 : Single comment box, 1 : Left comment box, 2 : Right comment box
function printcomment(commenttext, commentloc) {
  if (commentloc == 0) {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 1) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 2) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxright").innerHTML = commenttext;
  } else {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML =
      "<center>please report this issue to adityaraman@gmail.com</center>";
    // ignore use of deprecated tag <center> . Code is executed only if printcomment function receives inappropriate commentloc value
  }
}
