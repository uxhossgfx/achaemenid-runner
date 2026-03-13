import React, { useEffect, useMemo, useRef, useState } from "react";

const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;
const GROUND_Y = 520;
const GRAVITY = 0.82;
const JUMP_VELOCITY = -14.4;
const START_SPEED = 4.35;
const MAX_SPEED = 9.4;
const PLAYER_X = 54;
const AIR_MOVE_DISTANCE = GAME_WIDTH * 0.12;
const SCALE = 2;
const COLOR = "#111111";
const BG = "#efefef";

const RUNNER_1 = [
  "00000000000000000000000001010110",
  "11111111111111111000000001111110",
  "10000000100000000110000001110111",
  "01111111111111111101100001011101",
  "01111111111111111111010001101111",
  "00000000000000000000101001111010",
  "00111111111111111111100111110110",
  "00011111111111111110011111111011",
  "00000000100000000001000111111110",
  "00000000111111111111100111111110",
  "00000011111111111111110011111110",
  "00000100100010100100001000101110",
  "00001000011101111111111100001110",
  "00001011000010100001000000010110",
  "00010011000010100000000010010000",
  "00100011000111100000011110001000",
  "00101111000000000000001001001000",
  "00101111000000011100000101001000",
  "00101101000000101110000011101000",
  "00101101100001000111111100011000",
  "00101100110001100000000000011000",
  "00101100011001110111111110010000",
  "00111000101001001100010010010000",
  "00111010000001000000000101001000",
  "00110100000001000000000101001000",
  "01110100000100100000001000101000",
  "11110100000010100000101000100100",
  "11010010000010010000000100000000",
  "00011111000001111000011100011110",
];

const RUNNER_2 = [
  "00000000000000000000000001010110",
  "11111111111111111000000001111110",
  "10000000100000000110000001110111",
  "01111111111111111101100001011101",
  "01111111111111111111010001101111",
  "00000000000000000000101001111010",
  "00111111111111111111100111110110",
  "00011111111111111110011111111011",
  "00000000100000000001000111111110",
  "00000000111111111111100111111110",
  "00000011111111111111110011111110",
  "00000100100010100100001000101110",
  "00001000011101111111111100001110",
  "00001011000010100001000000010110",
  "00010011000010100000000010010000",
  "00100011000111100000011110001000",
  "00101111000000000000001001001000",
  "00101111000000011100000101001000",
  "00101101000000101110000011101000",
  "00101101100001000111111100011000",
  "00101100110001100000000000011000",
  "00101100011001110111111110010000",
  "00111000101001001100010010010000",
  "00111010000001000000000101001000",
  "00110100000001000000000101001000",
  "01110100000100100000001000101000",
  "11110100000010100000101000100100",
  "00011111000001111000011100011110",
  "11010010000010010000000100000000",
];

const CLERIC = [
  "00000000000000000111111000000000",
  "00000000000000001011111100000000",
  "00100000000000001101111110000000",
  "01100000000000011110111111000000",
  "11000000000000011100001111000000",
  "01100000000000011000000111000000",
  "00111110000000010000000011000000",
  "00011101000000000000000010000000",
  "00000110110000001000000100000000",
  "00000011101000001011110100000000",
  "00000001110100001110011100000000",
  "00000000111111001111111100000000",
  "00000000011111011111111101100000",
  "00000000001111101111111101110000",
  "00000000000111110111111001111000",
  "00000000000001111000000111111000",
  "00000000000011111111011111111100",
  "00000000001111111111011110111100",
  "00000001111111011111011110111110",
  "00000001111110010111101111011110",
  "00000001111000111111111111111111",
  "00000000000000111111001111111111",
  "00000000000000101010001111111100",
  "00000000000000110011111111111000",
  "00000000000000111111000011110000",
  "00000000000000111111111100000000",
  "00000000000000111111111111110000",
  "00000000000000111111111111110000",
  "00000000000000111111111111110000",
];

const SUN = [
  "0000000000000010000000000000",
  "0000000000000000000000000000",
  "0000000000000010000000000000",
  "0000000000000010000000000000",
  "0000000000000011000000000000",
  "0000000000000011000000000000",
  "1000000000010011010000000000",
  "0000000000110011010000000000",
  "0010010110111111111110101000",
  "0010000011111111111100000010",
  "0101111111111111111111111100",
  "0010101111111001111111000010",
  "0001011111110000011111110100",
  "0010110000000000000000110010",
  "0001110001111000111100110100",
  "0001100000000000000000011000",
  "0111100001111000011100011110",
  "0011000001110000011100001100",
  "0111000000000000000000001110",
  "0011000000000000000000001100",
  "0011000000000000000000001100",
  "0001000000000000000000001000",
  "1001100000000101000000011001",
  "0001100000000110000000111000",
  "0000110000000100000000110001",
  "0001110000001111100000111100",
  "0000011000000001000001110000",
  "0000001111000000000111000000",
  "0000010111100000011110100000",
  "0000000000111111111001000000",
  "0000010101011111111000000000",
  "0000001010100001010110000000",
  "0000000010100000010101000000",
  "0000010000000000000000000000",
  "0000010000000000000010000000",
  "0000100000000000000010000000",
  "0000000000000000000001000000",
];

const FIGHTER_JET = [
  "00000000000000000111111110000000000000",
  "00000000000000011111111111100000000000",
  "00000000000001111111111111111000000000",
  "00000000000111111111111111111110000000",
  "00000000001111111111111111111111000000",
  "00000000011111111111111111111111100000",
  "00000000111111111111111111111111110000",
  "00000001111111111111111111111111111000",
  "00000011111111111111111111111111111100",
  "00000111111111111111111111111111111110",
  "00001111111111111111111111111111111111",
  "00011111111111111111111111111111111110",
  "00111111111111111111111111111111111100",
  "01111111111111111111111111111111111000",
  "11111111111111111111111111111111110000",
  "01111111111111111111111111111111100000",
  "00111111111110000000000001111111000000",
  "00011111111100000000000000111110000000",
  "00001111111000000000000000011100000000",
  "00000111110000000000000000001000000000",
  "00001111111000000000000000011100000000",
  "00011111111100000000000000111110000000",
  "00111111111110000000000001111111000000",
  "01111111111111111111111111111111100000",
  "11111111111111111111111111111111110000",
  "01111111111111111111111111111111111000",
  "00111111111111111111111111111111111100",
  "00011111111111111111111111111111111110",
  "00001111111111111111111111111111111111",
  "00000111111111111111111111111111111110",
  "00000011111111111111111111111111111100",
  "00000001111111111111111111111111111000",
  "00000000111111111111111111111111110000",
  "00000000011111111111111111111111100000",
  "00000000001111111111111111111111000000",
  "00000000000111111111111111111110000000",
  "00000000000001111111111111111000000000",
  "00000000000000011111111111100000000000",
  "00000000000000000111111110000000000000",
];

const GOV_BUILDING = [
  "0000000000000001111111111111110000000000000000",
  "0000000000000111111111111111111100000000000000",
  "0000000000011111110000000011111111000000000000",
  "0000000001111111000110011000111111110000000000",
  "0011100001111111111111111111111111110000011100",
  "0111111111111111111111111111111111111111111110",
  "0011111111111111111111111111111111111111111100",
  "0000000000000000011111111111000000000000000000",
  "0001111110001111111111111111111110001111110000",
  "0011111110001111111111111111111110001111111000",
  "0011111110001111111111111111111110001111111000",
  "0011001110001111000011110000111110001110011000",
  "0011001110001111000011110000111110001110011000",
  "0011111110001111000011110000111110001111111000",
  "0011111110001111000011110000111110001111111000",
  "0011001110001111000011110000111110001110011000",
  "0011001110001111000011110000111110001110011000",
  "0011111110001111000011110000111110001111111000",
  "0011111110001111000011110000111110001111111000",
  "0011001110001111000011110000111110001110011000",
  "0011001110001111000011110000111110001110011000",
  "0011111110001111000011110000111110001111111000",
  "0011111110001111000011110000111110001111111000",
  "0011001110001111111111111111111110001110011000",
  "0011001110001111111111111111111110001110011000",
  "1111111111111100000000000000001111111111111111",
  "0111111111111100011111111111001111111111111110",
  "0000000011110000011111111111000000111100000000",
  "0000000011110000011111111111000000111100000000",
  "0000000011110000011111111111000000111100000000",
  "0000000011110000011111111111000000111100000000",
  "0000000011110000011111111111000000111100000000",
  "0000000011110000011111111111000000111100000000",
  "0000001111111111111111111111111111111110000000",
  "1111111111111111111111111111111111111111111110",
];

const RESIDENTIAL_BUILDING = [
  "000000000000011111111111000000000000",
  "000000000000011111111111000000000000",
  "000000000000011111111111000000000000",
  "000000000000000111111100000000000000",
  "000000000000000111111100000000000000",
  "000000111111111111111111111111000000",
  "000000111111111111111111111111000000",
  "000000111100111100111100111111000000",
  "000000111100111100111100111111000000",
  "011111111111111111111111111111111110",
  "011111111111111111111111111111111110",
  "000000111100111100111100111111000000",
  "000000111100111100111100111111000000",
  "000000111111111111111111111111000000",
  "000000111111111111111111111111000000",
  "000000111100111100111100111111000000",
  "000000111100111100111100111111000000",
  "000000111111111111111111111111000000",
  "000000111111111111111111111111000000",
  "000000111100111100111100111111000000",
  "000000111100111100111100111111000000",
  "000000111111111111111111111111000000",
  "000000111111111111111111111111000000",
  "000000111100111100111100111111000000",
  "000000111100111100111100111111000000",
  "000000111111111111111111111111000000",
  "000000111111111111111111111111000000",
  "000000111111111100001111111111000000",
  "000000111111111100001111111111000000",
  "111111111111111100001111111111111111",
];

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pixelCells(sprite, color = COLOR) {
  const cells = [];
  for (let y = 0; y < sprite.length; y += 1) {
    for (let x = 0; x < sprite[y].length; x += 1) {
      if (sprite[y][x] === "1") {
        cells.push(
          <div
            key={`${x}-${y}`}
            className="absolute"
            style={{
              left: x * SCALE,
              top: y * SCALE,
              width: SCALE,
              height: SCALE,
              background: color,
            }}
          />,
        );
      }
    }
  }
  return cells;
}

function Sprite({ sprite, x, y, color = COLOR }) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: sprite[0].length * SCALE,
        height: sprite.length * SCALE,
      }}
    >
      {pixelCells(sprite, color)}
    </div>
  );
}

function Bullet({ x, y, w = 9, h = 3 }) {
  return <div className="absolute" style={{ left: x, top: y, width: w, height: h, background: COLOR }} />;
}

function Bomb({ x, y }) {
  return (
    <>
      <div className="absolute" style={{ left: x, top: y, width: 4, height: 8, background: COLOR }} />
      <div className="absolute" style={{ left: x - 2, top: y + 8, width: 8, height: 4, background: COLOR }} />
    </>
  );
}

function Explosion({ x, y, size = 18 }) {
  return (
    <>
      <div className="absolute" style={{ left: x + size * 0.35, top: y, width: 2, height: size, background: COLOR }} />
      <div className="absolute" style={{ left: x, top: y + size * 0.35, width: size, height: 2, background: COLOR }} />
      <div className="absolute" style={{ left: x + size * 0.12, top: y + size * 0.12, width: size * 0.76, height: 2, background: COLOR, transform: 'rotate(45deg)', transformOrigin: 'center' }} />
      <div className="absolute" style={{ left: x + size * 0.12, top: y + size * 0.12, width: size * 0.76, height: 2, background: COLOR, transform: 'rotate(-45deg)', transformOrigin: 'center' }} />
    </>
  );
}

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function createCleric(speed) {
  const w = CLERIC[0].length * SCALE;
  const h = CLERIC.length * SCALE;
  const buildingType = Math.random() < 0.4 ? (Math.random() < 0.5 ? "residential" : "government") : null;
  const buildingSprite =
    buildingType === "residential"
      ? RESIDENTIAL_BUILDING
      : buildingType === "government"
        ? GOV_BUILDING
        : null;
  const buildingW = buildingSprite ? buildingSprite[0].length * SCALE : 0;
  const buildingH = buildingSprite ? buildingSprite.length * SCALE : 0;

  return {
    id: crypto.randomUUID(),
    type: "cleric",
    x: GAME_WIDTH + rand(20, 90),
    y: GROUND_Y - h + 3,
    w,
    h,
    speedBoost: rand(0, speed * 0.12),
    shotTimer: rand(22, 46),
    buildingType,
    buildingSprite,
    buildingSide: Math.random() < 0.7 ? "right" : "left",
    buildingOffsetX: Math.random() < 0.5 ? 8 : 16,
    buildingY: buildingSprite ? GROUND_Y - buildingH + 10 : null,
    buildingW,
    buildingH,
  };
}

function createJet(speed) {
  const w = FIGHTER_JET[0].length * SCALE;
  const h = FIGHTER_JET.length * SCALE;
  return {
    id: crypto.randomUUID(),
    type: "jet",
    x: GAME_WIDTH + rand(40, 140),
    y: rand(88, 210),
    w,
    h,
    speedBoost: rand(0.4, speed * 0.08),
    bombTimer: rand(24, 48),
  };
}

function runSpriteSanityChecks() {
  const spriteSets = [
    ["RUNNER_1", RUNNER_1],
    ["RUNNER_2", RUNNER_2],
    ["CLERIC", CLERIC],
    ["SUN", SUN],
    ["FIGHTER_JET", FIGHTER_JET],
    ["GOV_BUILDING", GOV_BUILDING],
    ["RESIDENTIAL_BUILDING", RESIDENTIAL_BUILDING],
  ];

  spriteSets.forEach(([name, sprite]) => {
    if (!Array.isArray(sprite) || sprite.length === 0) {
      throw new Error(`${name} must be a non-empty sprite array.`);
    }
    const width = sprite[0].length;
    sprite.forEach((row, index) => {
      if (row.length !== width) {
        throw new Error(`${name} row ${index} has inconsistent width.`);
      }
      if (!/^[01]+$/.test(row)) {
        throw new Error(`${name} row ${index} must contain only 0/1 characters.`);
      }
    });
  });
}

runSpriteSanityChecks();

export default function DinoRunnerGame() {
  const [phase, setPhase] = useState("splash");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [playerX, setPlayerX] = useState(PLAYER_X);
  const [playerY, setPlayerY] = useState(GROUND_Y);
  const [velocityY, setVelocityY] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [jets, setJets] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [speed, setSpeed] = useState(START_SPEED);
  const [frame, setFrame] = useState(0);

  const obstacleTimer = useRef(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const runTickRef = useRef(0);
  const velocityRef = useRef(0);
  const playerXRef = useRef(PLAYER_X);
  const speedRef = useRef(START_SPEED);
  const obstaclesRef = useRef([]);
  const jumpsUsedRef = useRef(0);
  const explosionTimeoutsRef = useRef([]);

  const playerSprite = frame === 0 ? RUNNER_1 : RUNNER_2;

  const playerBox = useMemo(() => {
    const h = playerSprite.length * SCALE - 4;
    const w = playerSprite[0].length * SCALE - 8;
    return { x: playerX + 4, y: playerY - h, w, h };
  }, [playerX, playerY, playerSprite]);

  useEffect(() => {
    const savedBest = Number(localStorage.getItem("iran-runner-best") || 0);
    setBest(savedBest);
  }, []);

  useEffect(() => {
    velocityRef.current = velocityY;
  }, [velocityY]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    obstaclesRef.current = obstacles;
  }, [obstacles]);

  const resetRun = () => {
    setPhase("playing");
    setScore(0);
    setPlayerX(PLAYER_X);
    setPlayerY(GROUND_Y);
    setVelocityY(0);
    setObstacles([]);
    setJets([]);
    setProjectiles([]);
    setBombs([]);
    setExplosions([]);
    setSpeed(START_SPEED);
    velocityRef.current = 0;
    playerXRef.current = PLAYER_X;
    speedRef.current = START_SPEED;
    obstaclesRef.current = [];
    jumpsUsedRef.current = 0;
    explosionTimeoutsRef.current.forEach(clearTimeout);
    explosionTimeoutsRef.current = [];
    obstacleTimer.current = 0;
    runTickRef.current = 0;
    lastTimeRef.current = 0;
  };

  const exitToSplash = () => {
    setPhase("splash");
    setScore(0);
    setPlayerY(GROUND_Y);
    setVelocityY(0);
    setObstacles([]);
    setJets([]);
    setProjectiles([]);
    setBombs([]);
    setExplosions([]);
    setSpeed(START_SPEED);
    velocityRef.current = 0;
    speedRef.current = START_SPEED;
    obstaclesRef.current = [];
    jumpsUsedRef.current = 0;
    obstacleTimer.current = 0;
    runTickRef.current = 0;
    lastTimeRef.current = 0;
    explosionTimeoutsRef.current.forEach(clearTimeout);
    explosionTimeoutsRef.current = [];
  };

  const jump = () => {
    if (phase === "splash" || phase === "gameover") {
      resetRun();
      setVelocityY(JUMP_VELOCITY);
      velocityRef.current = JUMP_VELOCITY;
      jumpsUsedRef.current = 1;
      return;
    }

    if (phase === "playing") {
      const grounded = playerY >= GROUND_Y - 0.5;
      if (grounded) {
        setVelocityY(JUMP_VELOCITY);
        velocityRef.current = JUMP_VELOCITY;
        jumpsUsedRef.current = 1;
      } else if (jumpsUsedRef.current < 4) {
        const jumpMultiplier = jumpsUsedRef.current === 1 ? 0.94 : jumpsUsedRef.current === 2 ? 0.9 : 0.86;
        const multiJumpVelocity = JUMP_VELOCITY * jumpMultiplier;
        setVelocityY(multiJumpVelocity);
        velocityRef.current = multiJumpVelocity;
        jumpsUsedRef.current += 1;
      }
    }
  };

  const moveRunner = (direction) => {
    if (phase !== "playing") return;
    if (playerY >= GROUND_Y - 0.5) return;

    const delta = AIR_MOVE_DISTANCE * direction;
    setPlayerX((prev) => {
      const next = clamp(prev + delta, PLAYER_X - AIR_MOVE_DISTANCE, PLAYER_X + AIR_MOVE_DISTANCE);
      playerXRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (["Space", "ArrowUp", "ArrowLeft", "ArrowRight", "Escape"].includes(e.code)) e.preventDefault();
      if (e.code === "Space" || e.code === "ArrowUp") jump();
      if (e.code === "ArrowLeft") moveRunner(-1);
      if (e.code === "ArrowRight") moveRunner(1);
      if (e.code === "Escape") exitToSplash();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, playerY]);

  useEffect(() => {
    const loop = (ts) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = ts;
      }
      const dt = Math.min((ts - lastTimeRef.current) / 16.67, 2.1);
      lastTimeRef.current = ts;

      if (phase === "playing") {
        let nextVelocity = velocityRef.current + GRAVITY * dt;
        let landed = false;

        setPlayerY((prevY) => {
          const nextY = prevY + nextVelocity * dt;
          if (nextY >= GROUND_Y) {
            landed = true;
            return GROUND_Y;
          }
          return nextY;
        });

        if (landed && nextVelocity > 0) {
          nextVelocity = 0;
          jumpsUsedRef.current = 0;
        }
        velocityRef.current = nextVelocity;
        setVelocityY(nextVelocity);

        const nextSpeed = clamp(speedRef.current + 0.00145 * dt, START_SPEED, MAX_SPEED);
        speedRef.current = nextSpeed;
        setSpeed(nextSpeed);
        setScore((prev) => prev + 0.1 * dt);

        obstacleTimer.current += dt;
        const spawnThreshold = clamp(88 - nextSpeed * 2.1, 52, 88);
        if (obstacleTimer.current >= spawnThreshold) {
          obstacleTimer.current = 0;
          setObstacles((prev) => {
            const next = [...prev, createCleric(nextSpeed)];
            obstaclesRef.current = next;
            return next;
          });
          if (Math.random() < 0.32) {
            setJets((prev) => [...prev, createJet(nextSpeed)]);
          }
        }

        setObstacles((prev) => {
          const next = prev
            .map((obs) => {
              const moved = { ...obs, x: obs.x - (nextSpeed + obs.speedBoost) * dt };
              if (moved.buildingSprite) {
                moved.buildingX =
                  moved.buildingSide === "right"
                    ? moved.x + moved.w + moved.buildingOffsetX
                    : moved.x - moved.buildingW - moved.buildingOffsetX;
              }
              moved.shotTimer -= dt;
              if (moved.shotTimer <= 0) {
                setProjectiles((shots) => [
                  ...shots,
                  {
                    id: crypto.randomUUID(),
                    x: moved.x + 20,
                    y: moved.y + 26,
                    w: 9,
                    h: 3,
                    vx: -(nextSpeed + 2.5),
                    vy: 0.25,
                  },
                ]);
                moved.shotTimer = rand(34, 60);
              }
              return moved;
            })
            .filter((obs) => obs.x + obs.w > -80);
          obstaclesRef.current = next;
          return next;
        });

        setJets((prev) =>
          prev
            .map((jet) => {
              const moved = { ...jet, x: jet.x - (nextSpeed + jet.speedBoost + 1.2) * dt };
              moved.bombTimer -= dt;
              if (moved.bombTimer <= 0) {
                const activeClerics = obstaclesRef.current.filter((o) => o.x > -20 && o.x < GAME_WIDTH + 40);
                // Bias bombing toward buildings more often than the runner
                const targetRunner = activeClerics.length === 0 ? true : Math.random() < 0.10;
                const targetX = targetRunner
                  ? playerXRef.current + RUNNER_1[0].length * SCALE * 0.55
                  : (() => {
                      const cleric = activeClerics[Math.floor(Math.random() * activeClerics.length)];
                      if (cleric.buildingSprite) {
                        const bx = cleric.buildingX ?? (cleric.buildingSide === "right"
                          ? cleric.x + cleric.w + cleric.buildingOffsetX
                          : cleric.x - cleric.buildingW - cleric.buildingOffsetX);
                        return bx + cleric.buildingW * 0.5;
                      }
                      return cleric.x + CLERIC[0].length * SCALE * 0.55;
                    })();

                setBombs((prevBombs) => [
                  ...prevBombs,
                  {
                    id: crypto.randomUUID(),
                    x: moved.x + moved.w * 0.56,
                    y: moved.y + moved.h * 0.7,
                    w: 8,
                    h: 12,
                    targetX,
                    vx: clamp((targetX - (moved.x + moved.w * 0.56)) / 58, -1.8, 1.8),
                    vy: 3.6,
                    targetRunner,
                  },
                ]);
                moved.bombTimer = rand(40, 72);
              }
              return moved;
            })
            .filter((jet) => jet.x + jet.w > -60),
        );

        setProjectiles((prev) =>
          prev
            .map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt }))
            .filter((p) => p.x > -24 && p.y < GAME_HEIGHT + 20),
        );

        setBombs((prev) => {
          const remaining = [];
          const destroyedBuildingIds = new Set();
          const newExplosions = [];

          for (const bomb of prev) {
            const moved = { ...bomb, x: bomb.x + bomb.vx * dt, y: bomb.y + bomb.vy * dt };
            let consumed = false;

            for (const obs of obstaclesRef.current) {
              if (!obs.buildingSprite || destroyedBuildingIds.has(obs.id)) continue;
              const buildingBox = {
                x: obs.buildingX ?? (obs.buildingSide === "right" ? obs.x + obs.w + obs.buildingOffsetX : obs.x - obs.buildingW - obs.buildingOffsetX),
                y: obs.buildingY,
                w: obs.buildingW,
                h: obs.buildingH,
              };
              if (intersects(moved, buildingBox)) {
                destroyedBuildingIds.add(obs.id);
                newExplosions.push({
                  id: crypto.randomUUID(),
                  x: moved.x - 6,
                  y: moved.y - 6,
                  size: 22,
                });
                consumed = true;
                break;
              }
            }

            if (!consumed && moved.y < GAME_HEIGHT + 18 && moved.x > -20 && moved.x < GAME_WIDTH + 20) {
              remaining.push(moved);
            }
          }

          if (destroyedBuildingIds.size > 0) {
            setObstacles((current) => {
              const next = current.map((obs) => (destroyedBuildingIds.has(obs.id) ? { ...obs, buildingSprite: null, buildingW: 0, buildingH: 0, buildingX: null } : obs));
              obstaclesRef.current = next;
              return next;
            });
          }

          if (newExplosions.length > 0) {
            setExplosions((current) => [...current, ...newExplosions]);
            newExplosions.forEach((explosion) => {
              const timeoutId = window.setTimeout(() => {
                setExplosions((current) => current.filter((item) => item.id !== explosion.id));
              }, 140);
              explosionTimeoutsRef.current.push(timeoutId);
            });
          }

          return remaining;
        });

        runTickRef.current += dt;
        if (runTickRef.current > 7) {
          runTickRef.current = 0;
          setFrame((f) => (f + 1) % 2);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    const hitObstacle = obstacles.some((obs) =>
      intersects(playerBox, { x: obs.x + 8, y: obs.y + 6, w: obs.w - 12, h: obs.h - 8 }),
    );
    const hitShot = projectiles.some((p) => intersects(playerBox, p));
    const hitBomb = bombs.some((b) => intersects(playerBox, b));

    if (hitObstacle || hitShot || hitBomb) {
      const finalScore = Math.floor(score);
      const nextBest = Math.max(best, finalScore);
      setBest(nextBest);
      localStorage.setItem("iran-runner-best", String(nextBest));
      setPhase("gameover");
    }
  }, [phase, obstacles, projectiles, bombs, playerBox, score, best]);

  useEffect(() => {
    return () => {
      explosionTimeoutsRef.current.forEach(clearTimeout);
      explosionTimeoutsRef.current = [];
    };
  }, []);

  const scoreText = String(Math.floor(score)).padStart(5, "0");
  const bestText = String(best).padStart(5, "0");

  return (
    <div className="min-h-screen flex items-center justify-center p-3" style={{ background: BG, color: COLOR }}>
      <div className="w-full max-w-[430px]">
        <div
          className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: COLOR }}
        >
          <div>Offline Runner</div>
          <div>
            HI {bestText} {scoreText}
          </div>
        </div>

        <div
          className="relative mx-auto overflow-hidden border shadow-lg"
          style={{ width: "100%", aspectRatio: "9 / 16", background: BG, borderColor: "#d6d6d6", touchAction: "manipulation" }}
          onPointerDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const tapX = e.clientX - rect.left;
            const width = rect.width;
            if (phase === "playing" && playerY < GROUND_Y - 0.5) {
              if (tapX < width * 0.33) {
                moveRunner(-1);
              } else if (tapX > width * 0.67) {
                moveRunner(1);
              } else {
                jump();
              }
            } else {
              jump();
            }
          }}
        >
          {phase === "splash" ? (
            <div className="absolute inset-0 px-7 pt-10 pb-8" style={{ color: COLOR }} onPointerDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const tapX = e.clientX - rect.left;
            const width = rect.width;
            if (phase === "playing" && playerY < GROUND_Y - 0.5) {
              if (tapX < width * 0.33) {
                moveRunner(-1);
              } else if (tapX > width * 0.67) {
                moveRunner(1);
              } else {
                jump();
              }
            } else {
              jump();
            }
          }}>
              <div className="mb-7 flex items-start gap-4">
                <Sprite sprite={RUNNER_1} x={0} y={0} />
                <div className="pt-1 pl-[68px]" style={{ minHeight: RUNNER_1.length * SCALE }}>
                  <div
                    className="font-mono text-[21px] leading-7 uppercase tracking-[0.04em] max-w-[218px]"
                    style={{ imageRendering: "pixelated" }}
                  >
                    The Iran government has disconnected the Internet to intensify its crackdown on the people.
                  </div>
                </div>
              </div>

              <div className="space-y-4 font-mono text-[14px] leading-6 uppercase tracking-[0.03em] max-w-[304px]">
                <div className="flex gap-3">
                  <span>•</span>
                  <span>Tens of thousands have been killed as state violence escalated.</span>
                </div>
                <div className="flex gap-3">
                  <span>•</span>
                  <span>The regime continues to target and silence voices demanding an end to repression.</span>
                </div>
                <div className="flex gap-3">
                  <span>•</span>
                  <span>All of this is unfolding while the country is under bombardment from the U.S. and Israel.</span>
                </div>
              </div>

              <div className="mt-6 font-mono text-[12px] uppercase tracking-[0.1em] opacity-80">
                bear witness · stay connected · tap / multi-tap / press space to begin
              </div>

              <div className="absolute left-7 bottom-14 font-mono text-[12px] opacity-70">ERR_INTERNET_DISCONNECTED</div>
              <div className="absolute left-7 right-7 bottom-6 font-mono text-[10px] opacity-65">
                Design by @hossgfx Copyright 2026 © All rights reserved.
              </div>
            </div>
          ) : (
            <>
              <Sprite sprite={SUN} x={246} y={58} />

              <div className="absolute left-0 right-0" style={{ top: GROUND_Y, height: 2, background: COLOR }} />
              <div
                className="absolute left-0 right-0"
                style={{
                  top: GROUND_Y + 10,
                  height: 2,
                  background:
                    "repeating-linear-gradient(to right, #bcbcbc 0px, #bcbcbc 22px, transparent 22px, transparent 38px)",
                }}
              />

              <Sprite sprite={playerSprite} x={playerX} y={playerY - playerSprite.length * SCALE} />

              {jets.map((jet) => (
                <Sprite key={jet.id} sprite={FIGHTER_JET} x={jet.x} y={jet.y} />
              ))}

              {obstacles.map((obs) => (
                <React.Fragment key={obs.id}>
                  {obs.buildingSprite && typeof obs.buildingX === "number" ? (
                    <Sprite sprite={obs.buildingSprite} x={obs.buildingX} y={obs.buildingY} />
                  ) : null}
                  <Sprite sprite={CLERIC} x={obs.x} y={obs.y} />
                </React.Fragment>
              ))}

              {projectiles.map((p) => (
                <Bullet key={p.id} x={p.x} y={p.y} w={p.w} h={p.h} />
              ))}

              {bombs.map((b) => (
                <Bomb key={b.id} x={b.x} y={b.y} />
              ))}

              {explosions.map((explosion) => (
                <Explosion key={explosion.id} x={explosion.x} y={explosion.y} size={explosion.size} />
              ))}
            </>
          )}

          {phase !== "splash" && (
            <button
              onClick={exitToSplash}
              className="absolute right-4 top-4 font-mono text-[11px] uppercase tracking-[0.1em] border px-2 py-1 opacity-80"
              style={{ borderColor: COLOR, color: COLOR }}
            >
              Esc
            </button>
          )}

          {phase === "gameover" && (
            <div className="absolute inset-x-0 top-[148px] text-center font-mono" style={{ color: COLOR }}>
              <div className="text-[26px] tracking-[0.12em] mb-4">GAME OVER</div>
              <button
                onClick={resetRun}
                className="border px-4 py-2 text-[13px] uppercase tracking-[0.12em]"
                style={{ borderColor: COLOR }}
              >
                Restart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
