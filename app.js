// ==================================================
// CLASSES START
// ==================================================

// Vector2
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Addition
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    
    // Subtraction
    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    // Scale
    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    // Normalized
    normalized() {
        return this.scale(1.0 / this.length);
    }

    // Length
    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    // Length squared
    get length_squared() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }

    // Distance
    distance(v) {
        return v.subtract(this).length;
    }

    // Distance squared
    distance_squared(v) {
        return v.subtract(this).length_squared;
    }

    // Returns a string version of this Vector2
    to_string() {
        return "[" + this.x + ", " + this.y + "]";
    }
}

// Dot. Represents a dot with a position and a direction.
class Dot {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
}

// ==================================================
// CLASSES END
// ==================================================

let dpi;
let canvas;
let context;
let last_update = -1;

// TODO: Create new dots when the size changes (to ensure that they are in the rect and that the correct amount has been spawned)...
// TODO: Calculate number of dots to spawn by dividing the width with ten (and rounding to closest integer)...
let dots_to_spawn = 87; // The number of dots to spawn
const DOTS_PER_PIXEL = 0.00014 //... .00014
const DOT_SPEED = 40; // The speed of a dot
const DOT_RADIUS = 2; // The radius of a dot
const LINE_DISTANCE_THRESHOLD = 200; // The threshold for how close two dots need to be for a line to be draw between them
const DOT_COLOR = "rgb(50, 224, 196, 1.0)"; // rgba(255, 255, 255, 1.0)
const LINE_COLOR = "rgb(50, 224, 196, 1.0)";

let dots = [] // Array that contains all dots

$(document).ready(function() {
    console.log("ready!");
    init();

    $(window).resize(function() {
        resize();
        create_dots();
    });
});

function init() {
    //dpi = window.devicePixelRatio;
    canvas = $("#canvas")[0];
    resize();
    window.requestAnimationFrame(update);
    create_dots();
}

function create_dots() {
    // Empty array
    dots = [];
    // Calculate 'dots_to_spawn' based on width
    dots_to_spawn = canvas.width * canvas.height * DOTS_PER_PIXEL;
    // Create the dots
    for (let i = 0; i < dots_to_spawn; i++) {
        let position = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
        let direction = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1).normalized();
        dots.push(new Dot(position, direction.scale(DOT_SPEED)));
    }
}

function resize() {
    console.log("resize");
    //let width = $(window).width() - $("#canvas").offset().left - Math.abs($("#canvas").outerWidth(true) - $("#canvas").outerWidth());
    //let height = $(window).height() - $("#canvas").offset().top - Math.abs($("#canvas").outerHeight(true) - $("#canvas").outerHeight());

    let width = $(window).innerWidth();
    let height = $(window).innerHeight();

    console.log(width + " | " + height);

    $("#canvas").attr("width", width);
    $("#canvas").attr("height", height);
}

function update(this_update) {

    let delta = 0
    if (last_update != -1) {
        delta = (this_update - last_update) / 1000;
    }
    last_update = this_update;

    // Update the dots
    dots.forEach(function(dot) {
        // Update position
        dot.position = dot.position.add(dot.velocity.scale(delta));

        // Check for collision with walls
        if (dot.position.x - DOT_RADIUS * 0.5 < 0) {
            dot.velocity.x *= -1
            dot.position.x = DOT_RADIUS * 0.5
        }
        else if (dot.position.x + DOT_RADIUS * 0.5 > canvas.width) {
            dot.velocity.x *= -1
            dot.position.x = canvas.width - DOT_RADIUS * 0.5;
        }
        if (dot.position.y - DOT_RADIUS * 0.5 < 0) {
            dot.velocity.y *= -1
            dot.position.y = DOT_RADIUS * 0.5
        }
        else if (dot.position.y + DOT_RADIUS * 0.5 > canvas.height) {
            dot.velocity.y *= -1
            dot.position.y = canvas.height - DOT_RADIUS * 0.5
        }

    });

    // Draw the dots (and lines)
    draw();

    // Request animation frame
    window.requestAnimationFrame(update);
}

function draw() {
    // Get context
    context = canvas.getContext("2d");

    // Clear rect
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Find and draw lines
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            var dist = dots[i].position.distance(dots[j].position);
            if (dist < LINE_DISTANCE_THRESHOLD) {
                context.strokeStyle = "rgba(50, 224, 196, " + (1 - (dist / LINE_DISTANCE_THRESHOLD)) + ")";
                context.beginPath();
                context.moveTo(dots[i].position.x, dots[i].position.y);
                context.lineTo(dots[j].position.x, dots[j].position.y);
                context.stroke();
            }
        }
    }

    // Draw dots
    /*
    dots.forEach(function(dot) {
        context.fillStyle = DOT_COLOR;
        context.beginPath();
        context.arc(dot.position.x, dot.position.y, DOT_RADIUS, 0, 2 * Math.PI);
        context.fill();
    });
    */
}