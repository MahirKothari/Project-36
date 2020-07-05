//Create variables here
var dog,dogImg1,dogImg2;
var database,foodS,foodStock;
var fedTime,lastFed;
var feed,addFood,foodObject,sadDog;
var changeState,readState,gameState;
var bedroom,garden,washroom;

function preload()
{
  //load images here
  dogImg1 = loadImage("images/Dog.png")
  dogImg2 = loadImage("images/happydog.png")
  bedroom = loadImage("images/Bed Room.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Wash Room.png")
}

function setup() {
	createCanvas(1000, 400);
  database = firebase.database();
  dog = createSprite(250,300,150,150);
  dog.addImage(dogImg1);
  dog.scale = 0.5;
  foodObject = new Food();
  foodStock = database.ref('food')
  foodStock.on("value",readStock);
  feed = createButton("feedTheDog")
  feed.position(700,95);
  feed.mousePressed(feedDog);
  addFood = createButton("addFood");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState =data.val();
  });
}


function draw() {  

background(46,139,87)
foodObject.display();
fedTime = database.ref('feedTime')
fedTime.on("value",function(data){
  lastFed = data.val();
})
fill(255,255,254);
textSize(15);
if (lastFed>= 12) {
  text("lastFeed:"+lastFed % 12+"pm",350,30);
}
else if (lastFed === 0) {
  text("lastFeed:12am",350,30);
}
else{
  text("lastFeed:"+lastFed+"am",350,30)
}

if (gameState!="Hungry") {
  feed.hide();
  addFood.hide();
  dog.remove();
}
else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}

currentTime=hour();
if (currentTime==(lastFed+1)) {
update("Playing");
foodObj.garden();
}
else if (currentTime==(lastFed+2)) {
  update("Sleeping");
  foodObj.bedroom();
}
else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)) {
  update("Bathing");
  foodObj.washroom();
}
else{
  update("Hungry");
  foodObject.display();
}


  drawSprites();
  //add styles here

}

function readStock(data){
  foodS = data.val();
  foodObject.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg2);
  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    food:foodObject.getFoodStock(),
    feedTime:hour()
  })
}

function addFoods(){
  foodS++
  database.ref('/').update({
    food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}