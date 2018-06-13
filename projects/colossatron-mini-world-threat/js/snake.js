// ---
// Mini World Threat
// Halfbrick
// Adapted from Javascript Snakes game by Jake Gordon: ttps://github.com/jakesgordon/javascript-snakes/
// ---


// For Leaderboard
var LEADERBOARD_SIZE = 5;
var scoreListRef = new Firebase('https://miniworldthreat.firebaseio.com');
var scoreList = [];
var leaderboardTable = document.getElementById('leaderboardTable');
var addScoreModal = document.getElementById('addscore');
var finalScore = 0;




MWT = function() {

  DIR = {
    UP:    0,
    DOWN:  1,
    LEFT:  2,
    RIGHT: 3,
    OPPOSITE: [1, 0, 3, 2],
    ANGLES: [90,270,0,180],
  };

  var cfg = {

    runner: {
      game: false,
      stats: false
    },

    state: {
      initial: 'loading',
      events: [
        { name: 'ready',         from: 'loading',    to: 'menu'        },
        { name: 'viewScores',    from: 'menu',       to: 'highscores'  },
        { name: 'backToMenu',    from: 'highscores', to: 'menu'        },
        { name: 'newGame',       from: 'menu',       to: 'game'        },
        { name: 'newGame',       from: 'name',       to: 'game'        },
        { name: 'quitGame',      from: 'game',       to: 'quit'        },
        { name: 'quitGame',      from: 'quit',       to: 'menu'        },
        { name: 'continueGame',  from: 'quit',       to: 'game'        },
        { name: 'loseGame',      from: 'game',       to: 'menu'        },
        { name: 'newHighScore',  from: 'game',       to: 'name'        },
        { name: 'newScore',      from: 'game',       to: 'newscore'    },
        { name: 'saveHighScore', from: 'name',       to: 'highscores'  },
      ]
    },

    keys: [
      { keys: [Game.Key.Y,     Game.Key.Q],      mode: 'down', state: 'quit',       action: function() { this.quitGame();            } },
      { keys: [Game.Key.N,     Game.Key.ESC],    mode: 'down', state: 'quit',       action: function() { this.continueGame();        } },
      { keys: [Game.Key.ESC],                    mode: 'down', state: 'highscores', action: function() { this.backToMenu();         } },
      { keys: [Game.Key.RETURN],                 mode: 'down', state: 'name',       action: function() { keypress(13); } },
      { keys: [Game.Key.LEFT,  Game.Key.A],      mode: 'down', state: 'game',       action: function() { this.snake.move(DIR.LEFT);  } },
      { keys: [Game.Key.RIGHT, Game.Key.D],      mode: 'down', state: 'game',       action: function() { this.snake.move(DIR.RIGHT); } },
      { keys: [Game.Key.UP,    Game.Key.W],      mode: 'down', state: 'game',       action: function() { this.snake.move(DIR.UP);    } },
      { keys: [Game.Key.DOWN,  Game.Key.S],      mode: 'down', state: 'game',       action: function() { this.snake.move(DIR.DOWN);  } },
      { key:  Game.Key.ESC,                      mode: 'down', state: 'game',       action: function() { this.quitGame();            } }
    ],

    highscores: [
      { name: "you", score:  0 }, 
    ],

    colors: {
      head: '#fff',
      body:  { fill: '#fff'},
      core: { fill: '#B52124' },
      wall:  { fill: '#AA2222'},
      text: '#ff2f32',
      particles: ['#fff']
    },

    images: [
      { id: 'core', url: "images/snake.png" }, 
      { id: 'wall', url: "images/rocks.png" }, 
      { id: 'explosion', url: "images/explosion-all.png" }
    ],

    sounds: [
      { id: 'menu',      name: 'sounds/musicMenu',      formats: ['mp3', 'ogg'], pool: 0, loop: true, volume: 0.7 },
      { id: 'game',      name: 'sounds/musicGameplay',      formats: ['mp3', 'ogg'], pool: 0, loop: true, volume: 0.7 }, 
      { id: 'collect1',   name: 'sounds/pickup',       formats: ['mp3', 'ogg'], pool: 5, volume: 0.7 }, 
      { id: 'upgrade',   name: 'sounds/upgrade',       formats: ['mp3', 'ogg'], pool: 5, volume: 0.7 }, 
      { id: 'powerup',   name: 'sounds/powerup',       formats: ['mp3', 'ogg'], pool: 5, volume: 0.7 }, 
      { id: 'die',       name: 'sounds/explode',       formats: ['mp3', 'ogg'], volume: 0.7 },
      { id: 'move',      name: 'sounds/move',      formats: ['mp3', 'ogg'], pool: 5, volume: 0.7 },
      { id: 'rollover',     name: 'sounds/rollover',      formats: ['mp3', 'ogg'], pool: 5, volume: 0.7 },
      { id: 'click',     name: 'sounds/select',      formats: ['mp3', 'ogg'], pool: 5, volume: 0.7 },
      { id: 'highscore', name: 'sounds/highscore', formats: ['mp3', 'ogg'], volume: 0.7 },
    ],

    sparkles: {
      duration: 800,
      spread:   0,
      max:      0,
      each:     0
    },
    
    tileSize: 32,

    core: { score: 15, growth: 1, images: 4, color: 2, quantity: 2 },
    powerup: { score: 200, color: 20, visible: false },
    snake: { x: 20, y: 8, length: 3, dir: DIR.LEFT }, 
    court: { w: 25, h: 16, layouts: [[
      "fsssssssssssssssssssssssf", 
      "o                       i",  
      "e                       w",  
      "e                io     w",  
      "l                kl     k",  
      "     io                  ",  
      "     we                  ",  
      "     we  io              ",  
      "     we  kl              ",  
      "     we                  ",  
      "     kl                  ",   
      "o            io         i",  
      "e            kl         w",  
      "e                       w",  
      "e                       w",  
      "fnnnnnnnnnnnnnnnnnnnnnnnf", 
    ], [
      "  ksffl                  ", 
      "    we                   ",  
      "    kl                   ",  
      "         innnnnnno       ",  
      "         ksssssssl       ",  
      "nno                   inn",  
      "ssl                   kss",  
      "     inno                ",  
      "     kffl                ",  
      "      we                 ",  
      "      kl                 ",   
      "                 innno   ",  
      "                 wfffe   ",  
      "                 ksssl   ",  
      "  innno                  ",  
      "  wfffe                  ", 
    ], [
      "sssssssssssfffsssssssssss", 
      "           wfe           ",  
      "           wfe           ",  
      "           wfe           ",
      "           wfe           ",    
      "           wfe           ",  
      "           ksl           ",  
      "no                     in",  
      "sl                     ks",  
      "           ino           ",  
      "           wfe           ",   
      "           wfe           ",  
      "           wfe           ",  
      "           wfe           ",  
      "           wfe           ",  
      "nnnnnnnnnnnfffnnnnnnnnnnn", 
    ], [
    "fsssssssssssssssssssssssf",
    "l                       k",
    "      io        io       ",
    "      kl       iffo      ",
    "               kffl      ",
    "                kl       ",
    "o                       i",
    "e                       w",
    "e                       w",
    "l                       k",
    "       io                ",
    "      iffo               ",
    "      kffl               ",
    "       kl                ",
    "o               ino     i",
    "fnnnnnnnnnnnnnnnfffnnnnnf"
    ], [
      "      kssssfffssssl      ",
        "           wfe           ",
        "           wfe           ",
        "           wfe           ",
        "           ksl           ",
        "o                       i",
        "e                       w",
        "fnnnno             innnnf",
        "fssssl             kssssf",
        "e                       w",
        "l                       k",
        "           ino           ",
        "           wfe           ",
        "           wfe           ",
        "           wfe           ",
        "      innnnfffnnnno      " 
    ], [
    "e    ksssssssssssssl    w",
    "e                       w",
    "e           io          w",
    "e           kl          w",
    "e                       w",
    "e  ino                  w",
    "e  ksl               innf",
    "e                    kssf",
    "e                       w",
    "e                       w",
    "e                       w",
    "fno               ino   w",
    "fsl               ksl   w",
    "e        ino            w",
    "e        wfe            w",
    "e    innnfffnnnnnnno    w"
    ]
  ]}

  };

  //=============================================================================

  var game = Class.create({

    initialize: function() {

      this.runner  = new Game.Runner('canvas', this, cfg.runner);
      this.storage = Game.storage();

      this.dom = {
        main:    $('snakes'),
        overlay: $('overlay'),
        logo:    $('logo'),
        controls:    $('controls'),
        loading: $('loading'),
        highscores: $('highscores'),
        award: $('award'),
        modal: $('modal-overlay'),
        sound:   $('sound')
      };

      this.render   = new render(this);
      this.score    = new score(this);
      this.court    = new court(this);
      this.snake    = new snake(this);
      this.core     = new core(this);
      this.powerup  = new powerup(this);
      this.sparkles = new sparkles(this);

      this.resetGame();

      this.menu     = this.buildMenu();
      this.quitmenu = this.buildQuitMenu();
      this.scoremenu = this.buildScoreMenu();

      Game.Key.map(cfg.keys, this);
      StateMachine.create(cfg.state, this);

      Game.loadResources(cfg.images, cfg.sounds, function(resources) {
        this.images = resources.images;
        this.sounds = resources.sounds;
        this.initSound();
        this.ready();
      }.bind(this));
    },

    onenterloading:    function(event, from, to) {  this.dom.logo.fadein(); this.dom.controls.fadein();  this.dom.loading.show();    },
    onleaveloading:    function(event, from, to) { this.dom.loading.fadeout(); },
    onenterhighscores: function(event, from, to) { if (from !== 'name') { this.score.dom.highscores.page.fadein();} },
    onleavehighscores: function(event, from, to) { this.dom.highscores.fadeout(); this.scoremenu.fadeout(); },
    onentername:       function(event, from, to) { this.dom.logo.fadeout(); this.dom.controls.hide();  this.score.newHighScore();  cfg.runner.game = false; },
    onenterquit:       function(event, from, to) { this.dom.highscores.fadeout(); this.dom.logo.fadein(); this.quitmenu.fadein(); this.dom.controls.hide(); cfg.runner.game = false; },
    onleavequit:       function(event, from, to) { this.quitmenu.fadeout();    },
    onentermenu:       function(event, from, to) { this.menu.fadein(); this.dom.controls.show(); },
    onleavemenu:       function(event, from, to) { this.menu.fadeout();  this.dom.controls.fadeout();     },
    onentergame:       function(event, from, to) { this.dom.overlay.fadeout(); this.scoremenu.fadeout();  this.sounds.menu.stop(); this.playGameMusic(); cfg.runner.game = true; },
    onleavegame:       function(event, from, to) { this.dom.overlay.fadein();  this.playMenuMusic(); },

    onready: function() {
      this.runner.start();
    },

    onnewGame: function() {
      this.resetGame();
    },

    onbackToMenu: function() {
      this.playClickFx();
    },    
    
    tweet: function() {
      //newwindow = window.open('http://twitter.com/share?url=http://colossatron.com/mini&text=I scored ' + this.score.score + ' in Mini World Threat! - &count=horizontal', '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
      if (window.focus) {newwindow.focus()}
    },    
    
    facebook: function() {
      //newwindow = window.open('http://www.facebook.com/sharer.php?s=100&p[url]=http://colossatron.com/mini&p[images][0]=http://colossatron.com/img/mwt-logo.png&p[title]=Mini World Threat&p[description]=Colossatron: Mini World Threat&p[summary]=I just scored ' + this.score.score + ' points in Mini World Threat! Can you beat that?', 'facebook-share-dialog','width=626,height=436');
      if (window.focus) {newwindow.focus()}
    },
       
    onchangestate:  function(event, from, to) {
      this.dom.main.removeClassName("state_is_" + from);
      this.dom.main.addClassName("state_is_" + to);
    },

    resetGame: function() {
      this.w     = cfg.court.w;
      this.h     = cfg.court.h;
      this.maxX  = this.w - 1;
      this.maxY  = this.h - 1;

      var courtToPick = cfg.court.layouts[Math.floor(Math.random() * cfg.court.layouts.length)];

      this.court.reset(courtToPick);

      this.snake.reset(cfg.snake);

      // Populate with number of cores set by cfg.core.quantity
      for(var n = 0 ; n < cfg.core.quantity ; n++) {
        this.core.reset(this.unoccupied(), '', n);           
      }

      this.powerup.reset(this.unoccupied());
      this.score.reset();
    },

    initSound: function() {
      this.toggleMute(this.isMute());
      this.dom.sound.on('click', function() { this.toggleMute(); }.bind(this));
      this.dom.sound.show();
    },

    update: function(dt) {
      if (this.is('game')) {
        this.court.update(dt);
        this.snake.update(dt);
        this.core.update(dt);
        this.score.update(dt);
        
        // Check if the head has hit itself or a wall
        if ((this.snake.occupies(this.snake.head, true)) || (this.court.occupies(this.snake.head))) {
          this.playDieFx();
          this.sparkles.add(this.snake.head, { color: 2 });
          
          // Show the high score list instead of regular score screen
          // Needs a high scores database backend to store the top 10 and get by AJAX
          if (this.score.isworthy()) {
            this.newHighScore();
          }
          else {          
            this.newHighScore();
            //this.newScore();
            /*this.loseGame();*/
          }
        }
     
        // Check if the head occupies the same square as the powerup
        if (this.powerup.occupies(this.snake.head) && this.powerup.visible == true) {
          this.sparkles.add(this.powerup.pos, { image: 20 });
          this.snake.lastScore = cfg.powerup.score;
          this.score.increase(cfg.powerup.score); 
          this.playPowerupFx();
          this.powerup.reset(this.unoccupied());
        }

        // Check if the head occupies the same square as one of the cores
        for(var n = 0 ; n < cfg.core.quantity ; n++) { 
          if (this.core.occupies(this.snake.head, n)) {
            color = this.core.data[n].color;
            this.playPickupFx();
            this.sparkles.add(this.core.data[n], { image: this.core.image });
            this.snake.grow(this.core.growth);
            this.core.reset(this.unoccupied(),'',n);   
            
            // Show powerup  
            var hasPowerup = Math.floor(Math.random()*10);
            if (hasPowerup < 2) {
              this.powerup.visible = true;
            }               
          }                  
        }         
                      
 
        
      }
    },

    draw: function(ctx) {
      if (!this.is('loading'))
        this.render.draw(ctx); // defer to helper class
    },

    onclick: function(ev) {
      if (this.can('backToMenu'))
        if (!is.link(ev.target))
          this.backToMenu();
    },

    onfocus: function(ev) {
      if (this.is('menu'))
        this.menu.focus();
      else if (this.is('quit'))
        this.quitmenu.focus();
    },

    onresize: function() {
      this.render.onresize();
    },

    unoccupied: function(pos) {
      var max = 100, p = pos || new Game.Point(), p1 = new Game.Point(), p2 = new Game.Point();
      while(--max) {
        if (!p.blank()) {
          p1.x = p.x-1; p1.y = p.y-1;
          p2.x = p.x-1; p2.y = p.y+1;
          if (!this.court.occupies(p)   && !this.snake.occupies(p)   &&
              !this.court.occupies(p1)  && !this.snake.occupies(p1)  &&
              !this.court.occupies(p2)  && !this.snake.occupies(p2) ) {
            return p;
          }
        }
        p.x = Math.round(Game.Math.random(2, this.maxX - 2));
        p.y = Math.round(Game.Math.random(2, this.maxY - 2));
      }
      return pos; // could not find unoccupied space within 100 attempts so bail out and hope for the best!
    },

    step: function(pos, color, dir) {

      switch(dir) {
        case DIR.LEFT:  return new Game.Point(pos.x == 0 ? this.maxX : pos.x-1, pos.y, dir);
        case DIR.RIGHT: return new Game.Point(pos.x == this.maxX ? 0 : pos.x+1, pos.y, dir);
        case DIR.UP:    return new Game.Point(pos.x, pos.y == 0 ? this.maxY : pos.y-1, dir);
        case DIR.DOWN:  return new Game.Point(pos.x, pos.y == this.maxY ? 0 : pos.y+1, dir);
      }
    },

    toggleMute: function(on) {
      var mute = toBool(on, this.isNotMute());
      this.storage.mute = mute;
      this.dom.sound.setClassName(mute ? 'off' : 'on');
      if (mute) {
        this.sounds.game.stop();
        this.sounds.menu.stop();
      }
      else {
        if (this.is('game'))
          this.playGameMusic();
        else
          this.playMenuMusic();
      }
    },

    allowMusic:      function()   { return true;                      },
    allowFx:         function()   { return !userAgent.isSafari;       }, // safari sucks at playing short sound FX (delays)
    isMute:          function()   { return toBool(this.storage.mute); },
    isNotMute:       function()   { return !this.isMute();            },
    playMenuMusic:   function()   { if (this.allowMusic() && this.isNotMute()) { this.sounds.game.stop(); this.sounds.menu.play(); } },
    playGameMusic:   function()   { if (this.allowMusic() && this.isNotMute()) { this.sounds.menu.stop(); this.sounds.game.play(); } },
    playDieFx:       function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.die.play(); } },
    playPickupFx:    function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.menu.stop(); this.sounds.collect1.play();  } },
    playCombineFx:   function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.menu.stop(); this.sounds.upgrade.play();  } },
    playMoveFx:      function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.menu.stop(); this.sounds.move.play();      } },
    playPowerupFx:   function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.menu.stop(); this.sounds.powerup.play(); } },
    playRolloverFx:   function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.rollover.play(); } },
    playClickFx:     function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.menu.stop(); this.sounds.click.play();     } },
    playHighScoreFx: function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.menu.time(6); this.sounds.menu.play(); this.sounds.highscore.play(); } },

    buildMenu: function() {
      return new Game.Menu(this.dom.overlay, this, {
        id: 'menu',
        visible: false,
        onselect: function() { this.playRolloverFx(); },
        onclick:  function() { this.playClickFx(); },
        items: [
          { text: 'Play',    title: "Start a new game", action: function()  { this.newGame(); } }
          /*,{ text: 'High Scores', title: "View the high scores", action: function()  { this.viewScores(); } } */
        ]
      });
    }, 

    buildQuitMenu: function() {
      return new Game.Menu(this.dom.overlay, this, {
        id: 'quitmenu',
        visible: false,
        onselect: function() { this.playRolloverFx(); },
        onclick: function() { this.playClickFx(); },
        items: [
        { text: 'Continue', title: "Continue your current game", action: function() { this.continueGame(); } },        
        { text: 'End Game',  title: "Quit current game", action: function() { this.quitGame(); } }
      ]});
    },    
    
    buildScoreMenu: function() {
      return new Game.Menu(this.dom.overlay, this, {
        id: 'scoremenu',
        visible: false,
        onselect: function() { this.playRolloverFx(); },
        onclick: function() { this.playClickFx(); },
        items: [
        { text: 'Play Again', title: "Play Mini World Threat",  action: function() { this.newGame(); } },        
        { text: 'Tweet Score',  title: "Post your score on Twitter", action: function() { this.tweet(); }, id: 'twitter' },
        { text: 'Post on Facebook',  title: "Post your score on Facebook", action: function() { this.facebook(); }, id: 'facebook' }
      ]});
    }

  });

  //=============================================================================

  var score = Class.create({

    initialize: function(game) {
      this.game = game;
      this.dom = {
        highscores: {
          page:  $('highscores'),
          title: $('highscores').down('h1'),
          award: $('award'),
          addscore: $('addscore'),
          modal: $('modal-overlay'),
          yourscore:  $('highscores').down('#yourscore'),         
          input: $({tag: 'input', maxlength: 10})
        },
        score: {
          current: $('score').down('.current .value'),
          high:    $('score').down('.high .value')
        }
      };
      this.load();
      this.reset();
    },

    reset:     function()  { this.set(0); },
    set:       function(n) { this.vset(this.score = Math.floor(n)); },
    vset:      function(n) { this.vscore = Math.floor(n); this.redraw = true; },
    increase:  function(n) { this.score = this.score + Math.floor(n); },
    format:    function(n) { return ("0000000" + Math.floor(n)).slice(-6); },
    ishigh:    function()  { return (this.vscore > this.highscore); },
    isworthy:  function()  { this.vset(this.score); return (this.score > this.lowscore); },

    update: function(dt) {
      if (this.vscore < this.score) {
        var wasHigh = this.ishigh();
        this.vset(Math.min(this.score, this.vscore + 1 + (this.score - this.vscore)/12)); // increment in 10ths of the remaining difference (MIN 1)
        if (!wasHigh && this.ishigh()) {
          this.game.playHighScoreFx();
        }        
          
      }
    },

    draw: function() {
      if (this.redraw) {
        this.drawScore(this.vscore);
        if (this.ishigh())
          this.drawHighScore(this.vscore);
        this.game.dom.main.toggleClassName('highscore', this.ishigh());
        this.redraw = false;
      }
    },

    drawScore:     function(n) { this.dom.score.current.update(this.format(n)); },
    drawHighScore: function(n) { this.dom.score.high.update(this.format(n));    },

    newHighScore: function() {
      var entry = {name: this.name, score: this.score};

      if (this.ishigh()) {
        this.game.playHighScoreFx();
      }         

      if (entry.score > 0 && (scoreList.length < LEADERBOARD_SIZE || entry.score > scoreList[LEADERBOARD_SIZE-1].score)) {
        addScoreModal.style.display = 'block';  
        document.getElementById('yourhighscore').innerHTML = entry.score;
        this.dom.highscores.modal.show();

      }
      

      if (entry.score >= 3000) {
        this.dom.highscores.award.show();
        this.dom.highscores.modal.show();
      }         
      
      this.dom.highscores.page.show();
      this.game.scoremenu.show();
      this.dom.highscores.yourscore.innerHTML = entry.score;
      
      
      var nameInput = document.getElementById('nameInput');
      nameInput.select(); 
      nameInput.focus();          
      
      finalScore = entry.score;      
      
      this.save();
      
    },

    onreset: function(ev) {
      delete this.game.storage.highscores;
      this.reset();
      this.load();
      Game.Event.stop(ev);
    },

    load: function() {
      this.highscores = JSON.parse(this.game.storage.highscores || "null") || cfg.highscores;
      this.highscore  = this.highscores[0].score;
      this.drawHighScore(this.highscore);
    },

    save: function() {
      this.highscores = this.insert({score: this.score});
      this.highscore  = this.highscores[0].score;
      this.game.storage.highscores = JSON.stringify(this.highscores);
    },

    insert: function(item) {
      var n, index = null;
      for(n = 0 ; n < this.highscores.length ; n++) {
        if (item.score > this.highscores[n].score) {
          index = n;
          var start  = this.highscores.slice(0, index)
          var middle = [item];
          var end    = this.highscores.slice(index, this.highscores.length-1);
          return start.concat(middle).concat(end);
        }
      }
      return this.highscores;
    }

  });

  //=============================================================================

  var court = Class.create({ 

    initialize: function(game) {
      this.game = game;
    },

    reset: function(map) {
     this.walls = [];
      var x,y,row;
      for(y = 0 ; y < map.length ; y++) {
        row = map[y];
        for(x = 0 ; x < row.length ; x++) {
          if (row[x] != " ") {
            this.walls.push(new Game.Point(x,y,row[x]));  
          } 
        }
      }

      var n, wall;
      for(n = 0 ; n < this.walls.length ; ++n) {
        
          wall = this.walls[n];
          
          // TODO: change to a switch statement
          if (wall.dir == "n") {
            wall.dir = 4;  // north
          } else if (wall.dir == "e") {
            wall.dir = 1;  // east
          } else if (wall.dir == "s") {
            wall.dir = 3;  // south
          } else if (wall.dir == "w") {
            wall.dir = 2;  // west
          } else if (wall.dir == "f") {
            wall.dir = 0;  // full
          } else if (wall.dir == "i") {
            wall.dir = 5;  // top left corner
          } else if (wall.dir == "o") {
            wall.dir = 6;  // top right corner
          } else if (wall.dir == "l") {
            wall.dir = 7;  // bottom right corner
          } else if (wall.dir == "k") {
            wall.dir = 8;  // bottom left corner
          }      
      }  
      

    },

    update: function(dt) {
    },

    occupies: function(pos) {
      var wall, n, max = this.walls.length;
      for(n = 0 ; n < max ; n++) {
        wall = this.walls[n];
        if (wall.equals(pos))
          return true;
      }
      return false;
    }

  });

  //=============================================================================

  var core = Class.create({

    initialize: function(game) {
      this.game    = game;
      this.score   = cfg.core.score;
      this.growth  = cfg.core.growth;
      this.data    = [{x: 0, y: 0, color: 2}];
      this.occupied    = [];
    },

    reset: function(data, image, id) {
      if (!id) { id = 0 }    
      
      this.data[id]  = data || this.data;
      this.image = is.valid(image) ? image : toInt(this.image, -1) + 1;
      this.image = (this.image >= cfg.core.images) ? 0 : this.image;
      
      this.color = Math.floor(Math.random() * 3) + 2; // color core between 2 and 4 (red, yellow, blue)

      this.data[id].color = this.color;   
      this.data[id].step = 640;   
      this.occupied[id] = [
        new Game.Point(this.data[id].x - 1, this.data[id].y - 1, 2, 0)
      ];
    },

    occupies: function(data, id) {
      //var len = this.occupied[id].length;
      for(var n = 0 ; n < 1 ; n++) {
        if (this.occupied[id][n].equals(data))
          return true;
      }
      return false;
    },

    expire: function(step, id) {
      --this.data[id].step;
      
      // Reset steps after timeout
      if (this.data[id].step == 0) {
        this.reset(this.game.unoccupied(),'',id);  
      }
      
      interval = 20;
      
      if (step < 40) interval = 5;
      
      if (step % interval == 0 && step < 90) {
        // Don't draw     
        return false;
      }
      return true;
    },

    update: function(dt) {
    }

  });  
 
  //=============================================================================  
  
  var powerup = Class.create({

    initialize: function(game) {
      this.game    = game;
      this.score   = cfg.powerup.score;
    },

    reset: function(pos, image) {
      this.pos   = pos || this.pos;
      this.image = is.valid(image) ? image : toInt(this.image, -1) + 1;
      this.image = (this.image >= cfg.core.images) ? 0 : this.image;
      this.step    = 240;
      this.occupied = [
        new Game.Point(this.pos.x - 1, this.pos.y - 1, 2)
      ];
      this.visible = false;
    },

    occupies: function(pos) {
      for(var n = 0 ; n < this.occupied.length ; n++) {
        if (this.occupied[n].equals(pos))
          return true;
      }
      return false;
    },
    
    expire: function(step) {
      --this.step;
      
      // Reset steps after timeout
      if (this.step == 0) {
        this.visible = false;
        this.reset(this.game.unoccupied());
      }
      
      interval = 20;
      
      if (step < 40) interval = 5;
      
      if (step % interval == 0 && step < 90) {    
        return false;
      }
      return true;
    },    

    update: function(dt) {
    }

  });

  //=============================================================================

  /* TODO: Can probably remove sparkles now */
  var sparkles = Class.create({

    initialize: function(game) {
      this.game      = game;
      this.all       = [];
      this.particles = [];
    },

    add: function(pos, options) {
      options = options || [];
      var color = 0;
      
      var spark = { pos: pos, image: options.image, color: options.color || (color), opacity: 1.0, particles: this.getParticles(cfg.sparkles.each) };
      this.all.push(spark);
      spark.animator = new Animator({
        duration:   cfg.sparkles.duration,
        transition: Animator.tx.easeOut,
        onComplete: function() { this.remove(spark); }.bind(this)
      });
      spark.animator.addSubject(function(value) { this.explode(spark, value); }.bind(this));
      spark.animator.play();
    },

    getParticles: function(max) {
      var particles = this.particles.splice(0, max);
      var n, max, p;
      for(n = 0, max = particles.length ; n < max ; ++n) {
        p = particles[n];
        p.x = p.y = 0;
      }
      return particles;
    },

    remove: function(spark) {
      delete spark.animator;
      this.particles = this.particles.concat(spark.particles); // put them back in the pool
      var index = this.all.indexOf(spark);
      if (index >= 0)
        this.all.splice(index, 1);
    },

    explode: function(spark, value) {
      spark.opacity = 1.0 - value;

    }

  });

  //=============================================================================

  var snake = Class.create({

    initialize: function(game) {
      this.game = game;
    },

    reset: function(options) {
      this.head   = this.tail = new Game.Point(options.x, options.y, 2, options.dir);
      this.dir    = options.dir;
      this.dt     = 0;
      this.dstep  = 0.15;
      this.moves  = [];
      this.length = 1;
      this.colors = [2,0];
      this.lastScore = 0;
      this.growth = options.length || 10;
      while(--this.growth)
        this.increase();
    },

    update: function(dt) {
      this.dt = this.dt + dt;
      if (this.dt > this.dstep) {
        this.dt = this.dt - this.dstep;
        this.increase(this.moves.shift());
        this.decrease();
      }
    },

    increase: function(changeDir) {
      if (typeof changeDir != 'undefined') {
        this.head.corner = this.dir;
        this.dir = changeDir;
        this.game.playMoveFx(); 
      } 

      this.push(this.game.step(this.head, this.colors[this.length-2], this.dir));
    },

    decrease: function() {
      if (this.growth)
        this.growth--;
      else
        this.pop();
    },

    push: function(segment) {   
      segment.next = this.head;
      this.head.prev = segment;
      this.head = segment;   
      this.length++;
    },    

    pop: function() {
      this.tail = this.tail.prev;
      this.tail.next = null;
      this.length--;
    },

    grow: function(n) { 

      var len = this.colors.length;
      var multiplier = 1;

      var currentColor = this.colors[0];
      
      if (color == currentColor && color == this.colors[1]) {
        // Tier 2 combine - red, yellow , blue
        this.colors.shift(); 
        this.colors[0] = color+6;

        this.pop();
        this.game.playCombineFx();   
        
        if (this.colors[0] == this.colors[1] && this.colors[0] == this.colors[2]) {
          // Tier 3 combine
          var colorCombine = this.colors[0];
          this.colors.shift();
          this.colors.shift();
          this.colors[0] = colorCombine + 6; 
          multiplier = 12;
        } else {
          multiplier = 3;           
        }        
        
        
      } else if (color != currentColor && (currentColor >= 2 && currentColor <= 4)) {
        
        // 2 color combine - orange, green , purple  
        if ((color == 2 && currentColor == 3) || (color == 3 && currentColor == 2)) {
          this.colors[0] = 5;  
        } else if ((color == 2 && currentColor == 4) || (color == 4 && currentColor == 2)) {
          this.colors[0] = 6;
        } else if ((color == 3 && currentColor == 4) || (color == 4 && currentColor == 3)) {
          this.colors[0] = 7;
        }  
        if (this.colors[0] == this.colors[1] && this.colors[0] == this.colors[2]) {
          // Tier 2 combine - orange, green , purple
          var colorCombine = this.colors[0];
          this.colors.shift();
          this.colors.shift();
          
          this.colors[0] = colorCombine + 6; 
          multiplier = 6;

          if (this.colors[0] == this.colors[1] && this.colors[0] == this.colors[2]) {
            this.colors.shift();
            this.colors.shift();
            this.colors[0] = this.colors[0] + 6; 
            multiplier = 18;
          }  
          
          this.game.playCombineFx(); 
          
        } else {
          multiplier = 2; 
          this.game.playPickupFx();            
        } 
        
          

      } else {
 
        // Nothing special so add to array
        this.game.playPickupFx();
        this.head.color = color; 
        this.colors.unshift(color);   
        this.growth += n; 
       
      }
  
    // Increase the score

    this.lastScore = Math.round(this.game.core.score * multiplier);
    this.game.score.increase(this.lastScore); 
    
    // Increase the speed
    if (this.dstep > 0.02) {
      this.dstep -= 0.003;  
    }
    

    },

    move:  function(dir) {
      var previous = this.moves.length ? this.moves[this.moves.length-1] : this.dir;
      if ((dir != previous) && (dir != DIR.OPPOSITE[previous]))
        this.moves.push(dir);
    },

    occupies: function(pos, ignoreHead) {
      var segment = ignoreHead ? this.head.next : this.head;
      do {
        if (segment.equals(pos))
          return true;
      } while (segment = segment.next);
      return false;
    }

  });

  //=============================================================================
  var e = 0;
  var t = 0;
  var starLayer1 = document.getElementById('canvas');
  var starLayer2 = document.getElementById('snakes');
  var bgPos = {x: 0, y: 0};

  var render = Class.create({

    initialize: function(game) {
      this.game = game;
    },

    draw: function(ctx) {
      if (!cfg.runner.game) {
        return;
      }

      if (!this.parts) {
        this.renderParts();  
      }
      
      ctx.globalAlpha = 0.2;
        
      color = this.game.core.color;
      prevColor = this.game.snake.colors[0];

      // Clear the screen
      ctx.clearRect(0, 0, this.game.runner.width, this.game.runner.height);

      var n, max, p, spark, particle, segment;
      
      var angle = Math.random()*100+1;
      var angle = 30;
      
      // pick up core effect
      for(n = 0, max = this.game.sparkles.all.length ; n < max ; ++n) {
        spark = this.game.sparkles.all[n];

        if (is.valid(spark.image)) {
          e += 0.01;

          ctx.globalAlpha = spark.opacity;
          
          ctx.drawImage(this.game.images.core,
            prevColor * cfg.tileSize, 0, cfg.tileSize, cfg.tileSize,
            (spark.pos.x -1.5) * cfg.tileSize,
            (spark.pos.y -1.5) * cfg.tileSize,
            cfg.tileSize * 2,
            cfg.tileSize * 2);        


          if (prevColor > 7) {
            prevColor = prevColor - 6;
          } 
                
          /*
          x = spark.pos.x * cfg.tileSize;
          y = spark.pos.y * cfg.tileSize;
          height = 32;
          width = 32;
          angleInRadians = angle * (Math.PI / 180);
          
          console.log(x);
          console.log(y);
          ctx.translate(x, y);
          ctx.rotate(angleInRadians);
          ctx.drawImage(this.game.images.explosion, -width / 2, -height / 2, width, height);
          ctx.rotate(-angleInRadians);
          ctx.translate(-x, -y);
          */
          

                
          ctx.drawImage(this.game.images.explosion,
            prevColor * cfg.tileSize, 0, cfg.tileSize, cfg.tileSize,
            (spark.pos.x -1.5 * (e+1)) * cfg.tileSize,
            (spark.pos.y -1.5 * (e+1)) * cfg.tileSize,
            cfg.tileSize * 2 * (e+1),
            cfg.tileSize * 2 * (e+1));
      
          
          if (spark.opacity < 0.05) { e = 0; }
        }
      } 

      // render faded when its the background behind a menu
      ctx.globalAlpha = this.game.is('game') ? 1 : 0.2;

      // core
      for(var n = 0 ; n < this.game.core.data.length ; n++) {     
        if(this.game.core.expire(this.game.core.data[n].step,n)) {
          this.drawCore(ctx, this.game.core.data[n], this.game.core.data[n].color);
        }    
      }
      
      // powerup
      if (this.game.powerup.visible == true) {
        if(this.game.powerup.expire(this.game.powerup.step)) {
        
          ctx.drawImage(
            this.game.images.core,
            cfg.tileSize*cfg.powerup.color, 0, 
            cfg.tileSize, 
            cfg.tileSize,
            (this.game.powerup.pos.x-1) * cfg.tileSize,
            (this.game.powerup.pos.y-1) * cfg.tileSize,
            cfg.tileSize,
            cfg.tileSize
          );
        }
            
      }      

      // Background parallax
      posLayer1 = Math.floor(bgPos.x/12) + 'px ' + Math.floor(bgPos.y/12) + 'px';
      posLayer2 = Math.floor(bgPos.x/32) + 'px ' + Math.floor(bgPos.y/32) + 'px';
      
      if (this.game.snake.head.dir == 3) {
        --bgPos.x;
      } else if (this.game.snake.head.dir == 2) {
        ++bgPos.x;
      } else if (this.game.snake.head.dir == 0) {
        ++bgPos.y;
      } else if (this.game.snake.head.dir == 1) {
        --bgPos.y;
      }
     
      starLayer1.style.backgroundPosition = posLayer1;
      starLayer2.style.backgroundPosition = posLayer2;

      // walls
      var len = this.game.court.walls.length;
      for(n = 0, max = len ; n < max ; n++) {
        this.drawWall(ctx, this.game.court.walls[n], n, 5);        
      }

      // body
      var segment = this.game.snake.head.next;
      for(var seg = 0 ; seg < this.game.snake.colors.length ; seg++) {        
        if (segment) {
          var segColor =  this.game.snake.colors[seg];
          this.drawPart(
            ctx, 
            segment,
            segColor, 
            DIR.ANGLES[segment.dir],
            false
          );
          segment = segment.next; // Increment segment
        }       
      }
      
      // head
      this.drawPart(
        ctx, 
        this.game.snake.head,
        1, 
        DIR.ANGLES[this.game.snake.dir],
        true
      );      
      
      // Display the score value on top of everything else
      for(n = 0, max = this.game.sparkles.all.length ; n < max; ++n) {
        ctx.globalAlpha = spark.opacity;
        ctx.fillStyle = cfg.colors.text;
        ctx.strokeStyle = '#ffffff';
        ctx.font = '16pt bold "8bit_wondernominal"';
        ctx.fillText(this.game.snake.lastScore, (spark.pos.x-1) * cfg.tileSize, (spark.pos.y-1) * cfg.tileSize);                                                     
        ctx.strokeText(this.game.snake.lastScore, (spark.pos.x-1) * cfg.tileSize, (spark.pos.y-1) * cfg.tileSize);                                                     
                
      }  

      // score draws itself into DOM element
      this.game.score.draw();
    },

    // Draw a core
    drawCore: function(ctx, pos, color) {
      ctx.drawImage(
        this.game.images.core,
        cfg.tileSize*color, 0, 
        cfg.tileSize, 
        cfg.tileSize,
        (pos.x-1) * cfg.tileSize,
        (pos.y-1) * cfg.tileSize,
        cfg.tileSize,
        cfg.tileSize
      );       
    },

    drawWall: function(ctx, pos, px, py) {
      ctx.drawImage(
        this.game.images.wall, 
        cfg.tileSize * pos.dir, 
        0,
        cfg.tileSize, 
        cfg.tileSize, 
        pos.x * cfg.tileSize, 
        pos.y * cfg.tileSize, 
        cfg.tileSize, 
        cfg.tileSize
      );                  
    },
     
    drawPart: function(ctx, pos, color, angle, isHead) {

      var offsetX = 0;
      var offsetY = 0;
      var offsetSize = cfg.tileSize;

      switch(angle)
      {
      case 90:
        offsetX = offsetSize;
        break;
      case 180:
        offsetX = offsetSize;
        offsetY = offsetSize;
        break;      
      case 270:
        offsetY = offsetSize;
        break;
      default:
      }      
      

      ctx.translate(pos.x * cfg.tileSize + offsetX, pos.y * cfg.tileSize + offsetY);
      ctx.rotate(angle * (Math.PI / 180));

      ctx.drawImage(
        this.game.images.core, 
        cfg.tileSize * color, 0,
        cfg.tileSize, 
        cfg.tileSize, 
        0, 0, 
        cfg.tileSize, 
        cfg.tileSize
      );   
      
      // More efficient than calling ctx.save() and ctx.load() - http://stackoverflow.com/questions/3793397/html5-canvas-drawimage-with-at-an-angle
      ctx.rotate(-angle * (Math.PI / 180));  
      ctx.translate(-(pos.x * cfg.tileSize + offsetX), -(pos.y * cfg.tileSize + offsetY));  
      
    },


    //----------- Init walls

    renderParts: function() {
      this.nparts = 110;
      this.parts  = Game.renderToCanvas((1 + this.nparts) * cfg.tileSize, 6 * cfg.tileSize, function(ctx) {
        var n, percent;
        if (this.game.court.walls.length > this.nparts) {
          throw "not enough room to render all the wall parts"          
        }
        for(var n = 0 ; n < this.game.court.walls.length ; n++) {
          this.renderWall(ctx, { x: n, y: 5 }, this.game.court.walls[n]);          
        }

      }.bind(this));
    },

    renderWall: function(ctx, pos, wall) {
      var x = pos.x * cfg.tileSize;
      var y = pos.y * cfg.tileSize;  

      ctx.drawImage(
        this.game.images.wall, 
        cfg.tileSize * wall.dir, 
        0,
        cfg.tileSize, 
        cfg.tileSize, 
        x, 
        y, 
        cfg.tileSize, 
        cfg.tileSize
      );          

      //ctx.fillStyle   = cfg.colors.wall.fill;
      //ctx.fillRect(x1, y1, cfg.tileSize, cfg.tileSize);
      
    },

    onresize: function() {
      delete this.parts; // will be redrawn on next draw() cycle
    }

  });

  // Play game
  return new game();

  
};


function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
} 

function keypress(e) {

  if (e == 13 || e.keycode == 13) {
    var nameElem = document.getElementById('nameInput');
    var name = nameElem.value;

    if (name.length === 0) { return };

    if (finalScore > 0 && (scoreList.length < LEADERBOARD_SIZE || finalScore > scoreList[LEADERBOARD_SIZE-1].score)) {
      var userScoreRef = scoreListRef.child(name);
      //userScoreRef.setWithPriority({ name:name, score:finalScore }, finalScore);
      scoreListRef.push({ name:name, score:finalScore });
    }
    
    document.getElementById('yourhighscore').innerHTML = '';
    addScoreModal.style.display = 'none';
    if (finalScore < 3000) {
      document.getElementById('modal-overlay').style.display = 'none';
    }
  }
};  

// Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
function handleScoreAdded(scoreSnapshot) {
  scoreList.push({'name' : scoreSnapshot.val().name, 'score' : scoreSnapshot.val().score})

  scoreList = sortByKey(scoreList, 'score');
  scoreList.reverse();
  var scoreListString = '';
  
  var len = LEADERBOARD_SIZE-1;
  if (scoreList.length-1 <  len) {
    len = scoreList.length-1;
  }

  for (var i = 0; i <= len; i++) { 
    scoreListString = scoreListString + '<tr><td class="count">' + parseInt(i+1) + '.</td><td class="name">' + scoreList[i].name + '</td><td class="score">' + scoreList[i].score + '</td></tr>';
  }
  leaderboardTable.innerHTML = scoreListString;
  //leaderboardTable.innerHTML = '<em>Coming soon</em>';

}

var scoreListView = scoreListRef;

scoreListView.on('child_added', function (newScoreSnapshot) {
  handleScoreAdded(newScoreSnapshot);
});

var changedCallback = function (scoreSnapshot) {
  handleScoreAdded(scoreSnapshot);
};
scoreListView.on('child_moved', changedCallback);
scoreListView.on('child_changed', changedCallback);

