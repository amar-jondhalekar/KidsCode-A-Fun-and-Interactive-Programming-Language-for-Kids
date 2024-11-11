// Set up the canvas and the object
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initialize the object starting position and direction
let x = 250;
let y = 250;
let angle = 0; // Angle in degrees, starting facing upwards (0°)

// Function to move the object forward
function move(steps) {
  const radians = angle * (Math.PI / 180);  // Convert angle to radians
  x += Math.cos(radians) * steps;
  y += Math.sin(radians) * steps;
  drawObject();
}

// Function to turn the object
function turn(degrees) {
  angle += degrees;
  drawObject();
}

// Function to draw the object
function drawObject() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);  // Draw the object as a circle
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.stroke();
}

// Parse the code and execute the commands
function runCode() {
  const code = document.getElementById('code-input').value;
  const commands = parseCode(code);
  executeCommands(commands);
}

// Parse the code into individual commands
function parseCode(code) {
  // Split the code into commands, assuming each command is on a new line
  const lines = code.split("\n").map(line => line.trim()).filter(line => line);
  const commands = [];

  lines.forEach(line => {
    if (line.startsWith('move(')) {
      const steps = parseInt(line.match(/\d+/)[0]);
      commands.push(() => move(steps));
    } else if (line.startsWith('turn(')) {
      const degrees = parseInt(line.match(/-?\d+/)[0]);
      commands.push(() => turn(degrees));
    } else if (line.startsWith('repeat(')) {
      const repeatCount = parseInt(line.match(/\d+/)[0]);
      const repeatCommands = parseCode(line.slice(line.indexOf("{") + 1, line.lastIndexOf("}")));
      commands.push(() => {
        for (let i = 0; i < repeatCount; i++) {
          repeatCommands.forEach(cmd => cmd());
        }
      });
    }
  });

  return commands;
}

// Execute the parsed commands
function executeCommands(commands) {
  commands.forEach(cmd => cmd());
}

// Event listener for running the code
document.getElementById('run-code').addEventListener('click', runCode);

// Initial object drawing
drawObject();

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});

// Initial Setup: Set the default theme
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light');
}
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));

// move(50)
// turn(90)
// move(30)
// repeat(2) {
//   move(20)
//   turn(45)
// }
