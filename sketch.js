var dog,dogImg,happyDog;
var database;
var foodS,foodStock,foodObj;
var feed,addFood;
var fedTime,lastFed;
var form;
function preload(){
   dogImg=loadImage("images/dogImg.png");
   happyDog=loadImage("images/dogImg1.png");
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  dog=createSprite(410, 270,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed=createButton("Feed The Dog");
  feed.position(700, 100);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(810,100);
  addFood.mousePressed(addFoods);

  var input = createInput("Dog Name");
        var button = createButton("Submit");
        var greeting = createElement("h3")

        input.position(900, 100)
        button.position(900, 130)

        button.mousePressed(function(){
            input.hide();
            button.hide();
            var name = input.value();

            greeting.html("Dog Name: " + name)
            greeting.position(900, 80)
        });


}

// function to display UI
function draw() {
  background(46,139,87);
 
  foodObj.display();

  

  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

   
  if (lastFed>=12){
    fill("white");
    text("Last Feed :"+lastFed%12 + "PM",350,30);
  }
  else if (lastFed===0){
    fill("white");
    text("Last Feed : 12 AM",350,30);
  }
  else{
    fill("white");
    text("Last Feed:"+lastFed +"AM",350,30);
  }

 
  
  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,50);
  textSize(13);
  
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
    
  
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}
function feedDog(){
dog.addImage(happyDog);

foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
Food:foodObj.getFoodStock(),
FeedTime:hour()
})
}
function addFoods(){
foodS++;
database.ref('/').update({
Food:foodS
})
}