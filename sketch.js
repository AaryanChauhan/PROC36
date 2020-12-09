//Create variables here
var dog,dogImg,happyDogImg,happyDog,dataBase,foodS,foodStock;
var feedButton,addButton;
var fedTime,lastFed;
var foodObj;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  console.log(database);
  createCanvas(500,500);

  dog = createSprite(250,250,20,20);
  dog.addImage(dogImg);
  dog.scale = 0.1;

  foodObj = new food();
  
  feed = createButton("Feed the Dog");
  feed.position(700,35);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
}


function draw() {  
  background(46,139,87);

  drawSprites();

  

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12) {
    text("Last Feed : " + lastFed%12 + " PM", 350,30);
  }
  else if(lastFed == 0) {
    text("Last Feed : 12 AM",350,30);
  }
  else {
    text("Last Feed : " + lastFed + " AM", 350,30);
  }

  foodObj.display();
}

function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {

  if(x<=0) {
    x=0;
  }
  else {
    x = x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog() {
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}