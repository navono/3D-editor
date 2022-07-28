import * as CANNON from 'cannon-es';
import TheBallGame from './theBallGame';
import Obstacle from './obstacle';

export default class Physics {
  public world = new CANNON.World();
  public bodies: { [id: string]: CANNON.Body } = {};

  public groundMaterial: CANNON.Material;
  public slipperyMaterial: CANNON.Material;

  public jewelBody: CANNON.Body = new CANNON.Body();

  private theBallGame: TheBallGame;

  constructor(theBallGame: TheBallGame, io: any) {
    this.theBallGame = theBallGame;

    this.world.gravity.set(0, -9.82, 0);

    this.groundMaterial = new CANNON.Material('groundMaterial');
    this.groundMaterial.friction = 0.25;
    this.groundMaterial.restitution = 0.25;
    this.slipperyMaterial = new CANNON.Material('slipperyMaterial');
    this.slipperyMaterial.friction = 0.25;
    this.slipperyMaterial.restitution = 0.25;

    const groundShape = new CANNON.Box(new CANNON.Vec3(25, 1, 25));
    const groundBody = new CANNON.Body({
      mass: 0,
      material: this.groundMaterial,
    });
    groundBody.addShape(groundShape);
    groundBody.position.x = 0;
    groundBody.position.y = -1;
    groundBody.position.z = 0;
    this.world.addBody(groundBody);

    const jewelShape = new CANNON.Sphere(1);
    this.jewelBody = new CANNON.Body({
      mass: 1,
      material: this.slipperyMaterial,
    });
    this.jewelBody.addShape(jewelShape);
    this.jewelBody.position.x = Math.random() * 50 - 25;
    this.jewelBody.position.y = 20;
    this.jewelBody.position.z = Math.random() * 50 - 25;
    this.jewelBody.addEventListener('collide', (e: any) => {
      if (theBallGame.gameWinner === '' && theBallGame.gameClock > -1) {
        Object.keys(theBallGame.players).forEach((p) => {
          if (theBallGame.players[p].bodyId === e.contact.bj.id) {
            theBallGame.gameWinner = p;
            theBallGame.resentWinners.push({
              screenName: theBallGame.players[p].screenName,
              time: theBallGame.gameClock,
            });
            while (theBallGame.resentWinners.length > 10) {
              theBallGame.resentWinners.shift();
            }
            theBallGame.gameClock = 0;
            console.log('Game Winner = ' + p);
            this.jewelBody.sleep();
            this.jewelBody.position.y = -1; //send it out of bounds

            io.emit(
              'winner',
              this.bodies[p].position,
              theBallGame.players[p].screenName,
              theBallGame.resentWinners
            );
          }
        });
      }
    });
    this.world.addBody(this.jewelBody);
    this.bodies['jewel'] = this.jewelBody;
  }

  public createPlayerSphere(id: string): number {
    const sphereShape = new CANNON.Sphere(1);
    const sphereBody = new CANNON.Body({
      mass: 1,
      material: this.slipperyMaterial,
    }); //, angularDamping: .9 })
    sphereBody.addShape(sphereShape);
    sphereBody.addEventListener('collide', (e: any) => {
      if (e.contact.ni.dot(new CANNON.Vec3(0, 1, 0)) < -0.5) {
        this.theBallGame.players[id].canJump = true;
      }
    });
    sphereBody.position.x = Math.random() * 50 - 25;
    sphereBody.position.y = 2;
    sphereBody.position.z = Math.random() * 50 - 25;
    this.world.addBody(sphereBody);

    this.bodies[id] = sphereBody;

    return sphereBody.id;
  }

  public regenerateObstacles(obstacles: { [id: string]: Obstacle }): void {
    for (let i = 0; i < 10; i++) {
      const size = {
        x: Math.random() * 4 + 1,
        y: Math.random() * 4 + 1,
        z: Math.random() * 4 + 1,
      };
      const cubeShape = new CANNON.Box(new CANNON.Vec3(size.x, size.y, size.z));
      const cubeBody = new CANNON.Body({ mass: 1 });
      cubeBody.addShape(cubeShape);
      cubeBody.position.x = Math.random() * 50 - 25;
      cubeBody.position.y = Math.random() * 20 + 10;
      cubeBody.position.z = Math.random() * 50 - 25;

      obstacles[i] = new Obstacle();
      obstacles[i].s = { x: size.x, y: size.y, z: size.z };

      if (this.bodies['obstacle_' + i]) {
        this.world.removeBody(this.bodies['obstacle_' + i]); //remove old
      }
      this.world.addBody(cubeBody); // add new
      this.bodies['obstacle_' + i] = cubeBody;
    }
  }
}
