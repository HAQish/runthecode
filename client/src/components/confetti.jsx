import React, { Component } from 'react';

const style = {
  position: 'relative',
  zIndex: 10000000000
};

export default class Confetti extends Component {
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.props.active) {
      confetti(this.container, nextProps.config);
    }
  }

  setRef(ref) {
    this.container = ref;
  }

  render() {
    return <div className={this.props.className} style={style} ref={this.setRef} />;
  }
}

function createElements(root, elementCount) {
  return Array
    .from({ length: elementCount })
    .map((_, index) => {
      const element = document.createElement('div');
      element.classList.add("confetti");
      element.classList.add("c" + ((index % 5) + 1));
      root.appendChild(element);
      return element;
    });
}

function randomPhysics(angle, spread, startVelocity, random) {
  const radAngle = angle * (Math.PI / 180);
  const radSpread = spread * (Math.PI / 180);
  return {
    x: 0,
    y: 0,
    wobble: random() * 10,
    velocity: (startVelocity * 0.5) + (random() * startVelocity),
    angle2D: -radAngle + ((0.5 * radSpread) - (random() * radSpread)),
    angle3D: -(Math.PI / 4) + (random() * (Math.PI / 2)),
    tiltAngle: random() * Math.PI
  };
}

function updateFetti(fetti, progress, decay) {
  /* eslint-disable no-param-reassign */
  fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
  fetti.physics.wobble += 0.1;
  fetti.physics.velocity *= decay;
  fetti.physics.y += 3;
  fetti.physics.tiltAngle += 0.1;

  const { x, y, tiltAngle, wobble } = fetti.physics;
  const wobbleX = x + (10 * Math.cos(wobble));
  const wobbleY = y + (10 * Math.sin(wobble));
  const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;

  fetti.element.style.transform = transform;
  fetti.element.style.opacity = 1 - progress;

  /* eslint-enable */
}

function animate(root, fettis, decay) {
  const totalTicks = 700;
  let tick = 0;

  function update() {
    fettis.forEach((fetti) => updateFetti(fetti, tick / totalTicks, decay));

    tick += 1;
    if (tick < totalTicks) {
      requestAnimationFrame(update);
    } else {
      fettis.forEach((fetti) => {
        if (fetti.element.parentNode === root) {
          return root.removeChild(fetti.element);
        }
      });
    }
  }

  requestAnimationFrame(update);
}

function confetti(root, {
  angle = 90,
  decay = 0.9,
  spread = 45,
  startVelocity = 45,
  elementCount = 50,
  random = Math.random,
} = {}) {
  const elements = createElements(root, elementCount);
  const fettis = elements.map((element) => ({
    element,
    physics: randomPhysics(angle, spread, startVelocity, random)
  }));

  animate(root, fettis, decay);
}
