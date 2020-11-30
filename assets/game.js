window.onload = function () {
  var game = new Phaser.Game(480, 480, Phaser.AUTO, "", {
    preload: preload,
    create: create,
    update: update,
    
  });
  let velocidad = 150;

  var snake = [];
  var snakePath = [];
  var manzanasRojas = [];
  var obstaculos = [];

  var cabeza;
  var cuerpo;
  var manzanaVerde;
  var longitud = 0;
  var manzanasComidas = 0;
  var contador = 0;
  var distancia = 11;

  var derecha = 1;
  var izquierda = 0;
  var abajo = 0;
  var arriba = 0;

  var xAproximado;
  var yAproximado;

  function preload() {
    game.load.image("cabeza", "assets/img/blueCa.png");
    game.load.image("cuerpo", "assets/img/blueCa.png");
    game.load.image("background", "assets/img/back.png");
    game.load.image("manzanaverde", "assets/img/manzanaverde.png");
    game.load.image("manzanaroja", "assets/img/manzanaroja.png");
    game.load.image("obstaculo", "assets/img/obstaculo.png");
  }

  function create() {
    //iniciar fisicas
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //cambiar color de fondo
    game.stage.backgroundColor = "#91B3FD";
    game.add.sprite(0, 0, "background");

    //posicionar culebra
    cabeza = game.add.sprite(128, 128, "cabeza");
    cabeza.scale.setTo(0.45, 0.45);
    snake[0] = cabeza;
    game.physics.enable(cabeza, Phaser.Physics.ARCADE);
    cabeza.body.velocity.x = velocidad;
    cabeza.body.collideWorldBounds = true;

    //posicionar manzana
    var xInicial = Math.round(Math.random() * (14 - 2) + 2) * 32;
    var yInicial = Math.round(Math.random() * (14 - 2) + 2) * 32;
    manzanaVerde = game.add.sprite(xInicial, yInicial, "manzanaverde");
    manzanaVerde.scale.setTo(0.5, 0.5);
    game.physics.enable(manzanaVerde, Phaser.Physics.ARCADE);
    manzanaVerde.body.collideWorldBounds = true;
  }

  function update() {

    //Mover cabeza
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && derecha !== 1) {
      if (arriba === 1) {
        yAproximado = Math.round(cabeza.y / 32) * 32;
      } else if (abajo === 1) {
        yAproximado = Math.round(cabeza.y / 32) * 32;
      }
      cabeza.body.position.y = yAproximado;
      izquierda = 1;
      abajo = 0;
      arriba = 0;
      derecha = 0;
      cabeza.body.velocity.x = -velocidad;
      cabeza.body.velocity.y = 0;
    } else if (
      game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) &&
      izquierda !== 1
    ) {
      if (arriba === 1) {
        yAproximado = Math.round(cabeza.y / 32) * 32;
      } else if (abajo === 1) {
        yAproximado = Math.round(cabeza.y / 32) * 32;
      }
      cabeza.body.position.y = yAproximado;
      izquierda = 0;
      abajo = 0;
      arriba = 0;
      derecha = 1;
      cabeza.body.velocity.x = velocidad;
      cabeza.body.velocity.y = 0;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && abajo !== 1) {
      if (derecha === 1) {
        xAproximado = Math.round(cabeza.x / 32) * 32;
      } else if (izquierda === 1) {
        xAproximado = Math.round(cabeza.x / 32) * 32;
      }
      cabeza.body.position.x = xAproximado;
      izquierda = 0;
      abajo = 0;
      arriba = 1;
      derecha = 0;
      cabeza.body.velocity.y = -velocidad;
      cabeza.body.velocity.x = 0;
    } else if (
      game.input.keyboard.isDown(Phaser.Keyboard.DOWN) &&
      arriba !== 1
    ) {
      if (derecha === 1) {
        xAproximado = Math.round(cabeza.x / 32) * 32;
      } else if (izquierda === 1) {
        xAproximado = Math.round(cabeza.x / 32) * 32;
      }
      cabeza.body.position.x = xAproximado;
      izquierda = 0;
      abajo = 1;
      arriba = 0;
      derecha = 0;
      cabeza.body.velocity.y = velocidad;
      cabeza.body.velocity.x = 0;
    }

    if (
      (Math.abs(cabeza.x - manzanaVerde.x) < 20 ||
        Math.abs(manzanaVerde.x - cabeza.x) < 20) &&
      (Math.abs(cabeza.y - manzanaVerde.y) < 20 ||
        Math.abs(manzanaVerde.y - cabeza.y) < 20)
    ) {
      comer(manzanaVerde);
    }

    //Guardar coordenadas cabeza
    snakePath.unshift({
      coorX: cabeza.x,
      coorY: cabeza.y,
    });

    if (snakePath.length > 900) {
      snakePath.pop();
    }

    //Posicionar el resto del cuerpo
    if (snake.length !== 0) {
      for (let i = 1; i < snake.length; i++) {
        snake[i].x = snakePath[distancia * i].coorX;
        snake[i].y = snakePath[distancia * i].coorY;
      }
    }

    //Detectar colision entre cabeza y manzanaroja
    if (manzanasRojas.length !== 0) {
      if (
        (Math.abs(cabeza.x - manzanasRojas[0].x) < 20 ||
          Math.abs(manzanasRojas[0].x - cabeza.x) < 20) &&
        (Math.abs(cabeza.y - manzanasRojas[0].y) < 20 ||
          Math.abs(manzanasRojas[0].y - cabeza.y) < 20)
      ) {
        longitud -= 2;
        manzanasComidas++;
        contador = 0;
        manzanasRojas[0].destroy();
        manzanasRojas = [];
        snake[snake.length - 1].destroy();
        snake.pop();
        snake[snake.length - 1].destroy();
        snake.pop();
      }
    }

    //Añadir obsatuculos y subir velocidad cada 10 manzanas comidas
    if (manzanasComidas % 10 === 0 && contador === 0) {
      contador = 1;
      velocidad += 4;
      generarObsta();
    }

    //Detectar colision entre obstaculos y snake

    for (let i = 0; i < obstaculos.length; i++) {
      if (
        (Math.abs(cabeza.x - obstaculos[i].obsCoorX) < 20 ||
          Math.abs(obstaculos[i].obsCoorX - cabeza.x) < 20) &&
        (Math.abs(cabeza.y - obstaculos[i].obsCoorY) < 20 ||
          Math.abs(obstaculos[i].obsCoorY - cabeza.y) < 20)
      ) {
      }
    }
  }

  //Metodo cuando come la snake
  function comer(manzana) {
    var xMan = Math.round(Math.random() * (14 - 2) + 2) * 32;
    var yMan = Math.round(Math.random() * (14 - 2) + 2) * 32;

    for (let i = 0; i < obstaculos.length; i++) {
      if (
        xMan - obstaculos[i].obsCoorX < 20 ||
        obstaculos[i].obsCoorX - xMan < 20 ||
        yMan - obstaculos.obsCoorY < 20 ||
        obstaculos.obsCoorY - yMan < 20
      ) {
        xMan = Math.round(Math.random() * (14 - 2) + 2) * 32;
        yMan = Math.round(Math.random() * (14 - 2) + 2) * 32;
      }
    }
    for (let i = 0; i < obstaculos.length; i++) {
      if (
        xMan - obstaculos[i].obsCoorX < 20 ||
        obstaculos[i].obsCoorX - xMan < 20 ||
        yMan - obstaculos.obsCoorY < 20 ||
        obstaculos.obsCoorY - yMan < 20
      ) {
        xMan = Math.round(Math.random() * (14 - 2) + 2) * 32;
        yMan = Math.round(Math.random() * (14 - 2) + 2) * 32;
      }
    }
    manzana.x = xMan;
    manzana.y = yMan;
    longitud++;
    manzanasComidas++;
    contador = 0;
    if (longitud !== 0) {
      var x = snake[longitud - 1].x + 16;
      var y = snake[longitud - 1].y + 16;
      var nuevoCuerpo = game.add.sprite(x, y, "cuerpo");
      nuevoCuerpo.scale.setTo(0.45, 0.45);
    }
    snake.push(nuevoCuerpo);

    if (manzanasRojas.length !== 0) {
      manzanasRojas[0].destroy();
      manzanasRojas = [];
    }
    generarManRoja();
  }

  //metodo generar manzana roja
  function generarManRoja() {
    var numA = Math.round(Math.random() * (10 - 1) + 1);
    if (numA % 3 === 0) {
      manzanaRoja = game.add.sprite(
        Math.round(Math.random() * (14 - 2) + 2) * 32,
        Math.round(Math.random() * (14 - 2) + 2) * 32,
        "manzanaroja"
      );
      manzanaRoja.scale.setTo(0.5, 0.5);
      manzanasRojas.push(manzanaRoja);
      game.physics.enable(manzanaRoja, Phaser.Physics.ARCADE);
      manzanaRoja.body.collideWorldBounds = true;
    }
  }

  //Metodo generacion de obstaculos
  function generarObsta() {
    for (let i = 0; i < 3; i++) {
      var x = Math.round(Math.random() * (14 - 2) + 2) * 32;
      var y = Math.round(Math.random() * (14 - 2) + 2) * 32;
      obstaculo = game.add.sprite(x, y, "obstaculo");
      obstaculo.scale.setTo(0.5, 0.5);
      obstaculos.push({
        obsCoorX: obstaculo.x,
        obsCoorY: obstaculo.y,
      });
    }
  }
};
