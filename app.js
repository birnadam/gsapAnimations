// ================== GSAP Animations ================= //
const hero = document.querySelector(".hero");
const slider = document.querySelector(".slider");
const logo = document.querySelector("#logo");
const hamburger = document.querySelector(".hamburger");
const headline = document.querySelector(".headline");

const t1 = new TimelineMax();

t1.fromTo(hero, 1, { height: "0%" }, { height: "80%", ease: Power2.easeInOut })
  .fromTo(
    hero,
    1.2,
    { width: "100%" },
    { width: "80%", ease: Power2.easeInOut }
  )
  .fromTo(
    slider,
    1.2,
    { x: "-100%" },
    { x: "0%", ease: Power2.easeInOut },
    "-=1.2"
  )
  .fromTo(logo, .5, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, "-=.5")
  .fromTo(hamburger, 1, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, "-=.5")
  .fromTo(headline, 1, { opacity: 0, x: 240 }, { opacity: 1, x: 0 }, "-=.5");


// ================== Emoji Animations ================= //
console.clear();

let width = window.innerWidth;
let height = window.innerHeight;
const body = document.body;

const theButton = document.querySelector(".hamburger");
const theWrapper = document.querySelector(".hero");

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const enjoymojis = ["🍬", "🍫", "🍭", "🥤", "💰", "🍪", "🍕"];
const enjoys = [];
const radius = 15;

const Cd = 0.42; // Dimensionless
const rho = 1.55; // kg / m^3
const A = Math.PI * radius * radius / 10000; // m^2
const ag = 9.81; // m / s^2
const frameRate = 1 / 60;

function createEnjoy() /* create a enjoy */ {
  const vx = getRandomArbitrary(-10, 10); // x velocity
  const vy = getRandomArbitrary(-10, 1);  // y velocity
  
  const el = document.createElement("div");
  el.className = "enjoy";

  const inner = document.createElement("span");
  inner.className = "inner";
  inner.innerText = enjoymojis[getRandomInt(0, enjoymojis.length - 1)];
  el.appendChild(inner);
  
  theWrapper.appendChild(el);

  const rect = el.getBoundingClientRect();

  const lifetime = getRandomArbitrary(2000, 3000);

  el.style.setProperty("--lifetime", lifetime);

  const enjoy = {
    el,
    absolutePosition: { x: rect.left, y: rect.top },
    position: { x: rect.left, y: rect.top },
    velocity: { x: vx, y: vy },
    mass: 0.1, //kg
    radius: el.offsetWidth, // 1px = 1cm
    restitution: -.55,
    
    lifetime,
    direction: vx > 0 ? 1 : -1,

    animating: true,

    remove() {
      this.animating = false;
      this.el.parentNode.removeChild(this.el);
    },

    animate() {
      const enjoy = this;
      let Fx =
        -0.5 *
        Cd *
        A *
        rho *
        enjoy.velocity.x *
        enjoy.velocity.x *
        enjoy.velocity.x /
        Math.abs(enjoy.velocity.x);
      let Fy =
        -0.5 *
        Cd *
        A *
        rho *
        enjoy.velocity.y *
        enjoy.velocity.y *
        enjoy.velocity.y /
        Math.abs(enjoy.velocity.y);

      Fx = isNaN(Fx) ? 0 : Fx;
      Fy = isNaN(Fy) ? 0 : Fy;

      // Calculate acceleration ( F = ma )
      var ax = Fx / enjoy.mass;
      var ay = ag + Fy / enjoy.mass;
      // Integrate to get velocity
      enjoy.velocity.x += ax * frameRate;
      enjoy.velocity.y += ay * frameRate;

      // Integrate to get position
      enjoy.position.x += enjoy.velocity.x * frameRate * 100;
      enjoy.position.y += enjoy.velocity.y * frameRate * 100;
      
      enjoy.checkBounds();
      enjoy.update();
    },
    
    checkBounds() {

      if (enjoy.position.y > height - enjoy.radius) {
        enjoy.velocity.y *= enjoy.restitution;
        enjoy.position.y = height - enjoy.radius;
      }
      if (enjoy.position.x > width - enjoy.radius) {
        enjoy.velocity.x *= enjoy.restitution;
        enjoy.position.x = width - enjoy.radius;
        enjoy.direction = -1;
      }
      if (enjoy.position.x < enjoy.radius) {
        enjoy.velocity.x *= enjoy.restitution;
        enjoy.position.x = enjoy.radius;
        enjoy.direction = 1;
      }

    },

    update() {
      const relX = this.position.x - this.absolutePosition.x;
      const relY = this.position.y - this.absolutePosition.y;

      this.el.style.setProperty("--x", relX);
      this.el.style.setProperty("--y", relY);
      this.el.style.setProperty("--direction", this.direction);
    }
  };

  setTimeout(() => {
    enjoy.remove();
  }, lifetime);

  return enjoy;
}


function animationLoop() {
  var i = enjoys.length;
  while (i--) {
    enjoys[i].animate();

    if (!enjoys[i].animating) {
      enjoys.splice(i, 1);
    }
  }

  requestAnimationFrame(animationLoop);
}

animationLoop();

function addEnjoys() {
  if (enjoys.length > 40) {
    return;
  }
  for (let i = 0; i < 10; i++) {
    enjoys.push(createEnjoy());
  }
}

theButton.addEventListener("click", addEnjoys);
theButton.click();

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
});