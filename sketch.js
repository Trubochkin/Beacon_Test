/**
 * Trilateration example using p5js.org
 * Trilateration math by https://gist.github.com/kdzwinel/8235348
 * Example by Djonathan Krause, 2018
 */
let dateTimeFrom = new Date(2019, 4, 13).getTime();
let dateTimeTo = new Date().getTime();

let beacons = [];
let b1, b2, b3;
// let dataG1, dataG2, dataG3;

const SCALE = 0.2;
const WIDTH = 5900 * SCALE;
const HEIGHT = 6900 * SCALE;

let gateways = [
  {
    id: "240ac4298198",
    color: "#e00000", // red
    colorCircle: "rgba(240, 0, 0, 0.15)",
    pos: [WIDTH * 0.1, 30],
    data: []
  },
  {
    id: "240ac429de7c",
    color: "#000ad1", // blue
    colorCircle: "rgba(0, 0, 240, 0.15)",
    pos: [WIDTH * 0.03, HEIGHT * 0.95],
    data: []
  },
  {
    id: "240ac4286df4",
    color: "#00a022", // green
    colorCircle: "rgba(0, 240, 0, 0.15)",
    pos: [WIDTH * 0.97, HEIGHT * 0.86],
    data: []
  }
];

function preload() {
  // preload() runs once
  axios
    .get("http://176.106.1.136:9000/api/Data/list", {
      params: {
        timeFrom: dateTimeFrom,
        timeTo: dateTimeTo
      }
    })
    .then(function(response) {
      // handle success
      gateways.forEach((gateway, i) => {
        gateway.data = response.data.filter(element => {
          return element.iD_GW == gateways[i].id;
        });
      });
      console.log(gateway.data);
      redraw();
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    });
}

/**
 * Setup program
 */
function setup() {
  // createCanvas(windowWidth * 0.95, windowHeight * 0.95);
  createCanvas(WIDTH + 2000, HEIGHT + 2000);
  textSize(20);

  // Create beacons
  b1 = new Beacon("b1", { x: 50, y: 50 }, "red");
  b2 = new Beacon("b2", { x: width - 50, y: 50 }, "blue");
  b3 = new Beacon("b3", { x: width - 60, y: height - 830 * SCALE }, "green");

  beacons.push(b1);
  beacons.push(b2);
  beacons.push(b3);
  noLoop();

  let configDatepicker = {
    timepicker: true,
    minDate: new Date(dateTimeFrom),
    // maxDate: new Date(),
    todayButton: new Date()
  }

  $("#datepicker_from").datepicker(configDatepicker);
  $("#datepicker_to").datepicker(configDatepicker);

  $("#datepicker_from").datepicker({
    onSelect: function(formattedDate, date, inst) {
      dateTimeFrom = date.getTime();
    },
    onHide: function(inst, animationCompleted) {
      console.log("onHide1", this)
      // inst.selectDates(new Date(2019, 4, 12));
      inst.date = new Date(2019, 4, 12);
      animationCompleted ? preload() : 0;
    },
    onShow: function(inst, animationCompleted) {
      console.log("onShow1", inst)
      inst.opts.todayButton = new Date();
    }
  });

  $("#datepicker_to").datepicker({
    onSelect: function(formattedDate, date, inst) {
      dateTimeTo= date.getTime();
    },
    onHide: function(inst, animationCompleted) {
      animationCompleted ? preload() : 0;
    },
    onShow: function(inst, animationCompleted) {
      // console.log("onShow2", inst)
      inst.opts.todayButton = new Date();
    }
  })
    
}

/**
 * This will loop for ever
 */
function draw() {
  translate(500, 100);
  background(255);
  strokeWeight(20);
  strokeCap(PROJECT);
  stroke(122);
  beginShape();
  vertex(WIDTH * 0.05, 0);
  vertex(WIDTH, 0);
  vertex(WIDTH, HEIGHT * 0.88);
  vertex(WIDTH * 0.73, HEIGHT * 0.88);
  vertex(WIDTH * 0.73, HEIGHT);
  vertex(WIDTH * 0.05, HEIGHT);
  vertex(WIDTH * 0.05, HEIGHT * 0.97);
  vertex(0, HEIGHT * 0.97);
  vertex(0, HEIGHT * 0.03);
  vertex(WIDTH * 0.05, HEIGHT * 0.03);
  vertex(WIDTH * 0.05, 0);
  endShape();

  strokeWeight(15);
  noFill();
  rect(WIDTH * 0.48, 0, WIDTH * 0.52, HEIGHT * 0.51);

  strokeWeight(18);
  stroke(255);
  line(WIDTH * 0.5, HEIGHT * 0.51, WIDTH * 0.6, HEIGHT * 0.51);
  strokeWeight(22);
  line(WIDTH * 0.45, HEIGHT, WIDTH * 0.55, HEIGHT);

  stroke(122);
  strokeCap(ROUND);
  strokeWeight(10);
  line(WIDTH * 0.52, HEIGHT * 0.57, WIDTH * 0.61, HEIGHT * 0.51);
  line(WIDTH * 0.47, HEIGHT * 1.06, WIDTH * 0.57, HEIGHT);

  // Draw beacons
  for (gateway of gateways) {
    push();
    noStroke();
    fill(gateway.color);
    ellipse(gateway.pos[0], gateway.pos[1], 50);
    pop();

    push();
    // var c = color(122, 153, 22, 0.1);
    stroke(gateway.colorCircle);
    strokeWeight(1);
    noFill();
    if (gateway.data.length > 0) {
      gateway.data.forEach(e => {
        ellipse(gateway.pos[0], gateway.pos[1], e.distance * 1000 * 0.2);
      });
    }
  }

  push();
  strokeWeight(0);
  textSize(42);
  textStyle(NORMAL);
  fill(0);
  text("6.9m x 5.9m", WIDTH * 0.77, HEIGHT * 0.95);
  pop();
}

// function mousePressed() {
//   preload();
// }

setInterval(function() {
  preload();
}, 10000);
