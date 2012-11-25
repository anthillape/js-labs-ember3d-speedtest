var App = Em.Application.create();

App.sceneModel = Em.Object.create({
  fov : 550,
  n : 0,
  numParticles : 70,
  interval : 30
});

App.PlaneModel = Em.Object.extend({
  index : 0,
  message : 'hi',
  x : 0,
  y : 0,
  z : 0,
  vx : 0,
  vy : 0,
  vz : 0,
  size : 50,
  mass : function(){return this.get('size') * this.get('size') * this.get('size')}.property('size'),
  color : '#000000',
  scale : function(){ return App.sceneModel.get('fov') / ( App.sceneModel.get('fov') + this.get('z') )}.property('z'),
  xx : function(){ return this.get('x') * this.get('scale') + 700}.property('x','scale'),
  yy : function(){ return this.get('y') * this.get('scale') + 300}.property('y','scale'),
  sizeScaled : function(){ return this.get('size') * this.get('scale')}.property('size','scale'),
  planeStyle : function(){
    return "top:"+this.get('yy')+"px;left:"+this.get('xx')+"px;width:"+this.get('sizeScaled')+"px;height:"+this.get('sizeScaled')+"px;background-color:"+this.get('color')+";z-index:"+(-Math.floor(this.get('z')*1000)+";opacity:"+Math.min(Math.floor(1/this.get('z')*600000),1000)/1000+";");
  }.property('xx','yy','sizeScaled'),
  init : function(){

    if(this.index > App.sceneModel.numParticles*2/3 )
    {
      this.set('color',"#00ff00");
      this.set('x', Math.random()*100 - 50 + 1000);
      this.set('y', Math.random()*100 - 50);
      this.set('z', Math.random()*100 + 1000);
      this.set('message', '');
      this.set('size',Math.random()*40+10);
    }
    else if(this.index > App.sceneModel.numParticles*1/3)
    {
      this.set('color',"#ff0000" );
      this.set('x', Math.random()*1000 - 500 - 1000);
      this.set('y', Math.random()*80 - 40 - 300);
      this.set('z', Math.random()*1000);
      this.set('message', '');
      this.set('size',Math.random()*40+10);
    }
    else
    {
      this.set('color',"#0000ff" );
      this.set('x', Math.random()*1000 - 500 - 1000);
      this.set('y', Math.random()*1000 - 500 +300);
      this.set('z', Math.random()*1000 + 2000);
      this.set('message', '');
      this.set('size',Math.random()*40+4);
    }
  }
});

App.planeController = Em.ArrayController.create({
  content : [],
  numParticles : App.sceneModel.numParticles,
  init : function(){
    for(var i = 0; i < this.numParticles; i++ )
    {
      this.content.addObject(App.PlaneModel.create({index:i}));
    }
    var that = this;
    setInterval(function(){that.advance(that)},App.sceneModel.interval);
  },
  advance : function(that){

    for( var i = 0; i < that.numParticles; i++ ){
      var a = that.content[i];
      for( var j = 0; j < that.numParticles; j++){
        var b = that.content[j];
        var dx = a.get('x') - b.get('x');
        var dy = a.get('y') - b.get('y');
        var dz = a.get('z') - b.get('z');
        var f = Math.pow(dx * dx + dy * dy + dz * dz, 1/3);
        f = Math.max(f,50);
        if(f == 0) break;
        f = 1/f* (a.get('mass') + b.get('mass'))/1000;
        f = f*f*f;

        a.set('vx', a.get('vx') + dx * f / 100000);
        a.set('vy', a.get('vy') + dy * f / 100000);
        a.set('vz', a.get('vz') + dz * f / 100000);
      }
      a.set('x', a.get('x') - a.get('vx'));
      a.set('y', a.get('y') - a.get('vy'));
      a.set('z', a.get('z') - a.get('vz'));
    }

  }
});

App.PlaneView = Em.View.extend({

});
