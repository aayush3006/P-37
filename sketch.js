var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var namebox, namebutton, name;

function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
bedroom=loadImage("images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(500,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(250,350);
  dog.addImage(sadDog);
  dog.scale=0.25;
  
  feed=createButton("Feed the dog");
  feed.position(300,25);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(400,25);
  addFood.mousePressed(addFoods);

  namebox = createInput("Unknown Dog");
  namebox.position(50, 50);

  namebutton = createButton("Name");
  namebutton.position(50, 75);
  namebutton.mousePressed(() => {
  name = namebox.value();
  });
}

function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();

  textSize(20);
  fill(255);
  textAlign(CENTER, CENTER);
  text(`Food Remaining: ${foodS}`, 250, 105);

  text(name, 250, 455);
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}