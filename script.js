// put in 'new' when makeing objs

$(document).ready(function(){
   var numCol = 50;
   var numRow = 50;
   var startLoc;
   var gameover = false;
   var score = 1;
   var direction = 0;
   var lastDirection = 0;
   var intervalTracker = null;
   var iVal = 100;
//var temp = 1;
//var tester = function(){$('#' + temp).addClass('TEST'); temp ++;};

   startLoc = arenaCreator(numCol, numRow);
   
   var currentFood = startLoc;
   $('#' + currentFood).addClass('food');
  
   //the snake object should probably replace with constructor
   var snake = {};
      snake.sBody = linkedList(); 
      snake.sBody.push(startLoc);// replace with linked list to vastly improve performance
      $('#' + startLoc).addClass('snake');
      snake.GROW_SIZE = 5;
      snake.growLeft = 5;
      snake.move = function(){
         if(direction !== 0){
            var head = snake.sBody.peekLast();
            var newHead = head + direction;
            lastDirection = direction;
            //console.log(lastDirection);
            if(((head + direction) < 1) || ((head + direction) > (numCol * numRow))){
               gameover = true;}
            else{
               if((head%numCol === 1 && direction === -1) || (head%numCol === 0 && direction === 1 )){
                  gameover = true;}
               else{
                  var i = 0;
                  
                  while(i < snake.sBody.length && !gameover){
                     if(snake.sBody[i] === newHead){
                        gameover = true;}
                     i++;
                  }
                  if(!gameover){//inbound
                     snake.sBody.push(newHead);
                     if(newHead === currentFood){
                        snake.growLeft += 5;
                        currentFood = nextFood(snake.sBody, numCol, numRow, currentFood);
                     }
                     $('#' + newHead).addClass('snake');
                     if (snake.growLeft === 0){
                        $('#' + snake.sBody[0]).removeClass('snake');
                        snake.sBody.shift();
                     } // main savings for linked list here
                     else{snake.growLeft--;}
                  }
               }
            }
         }
      };


   currentFood = nextFood(snake.sBody, numCol, numRow, currentFood);
   intervalTracker = gameClock(iVal, snake);


   //Resets the game
   var reset = function(){
      clearInterval(intervalTracker);
      direction = 0;
      lastDirection = 0;
      arenaRemover(numRow);
      startLoc = arenaCreator(numCol, numRow);
      snake.sBody = linkedList(); 
      snake.sBody.push(startLoc);
      snake.growLeft = 5;
      $('#' + startLoc).addClass('snake');
      currentFood = nextFood(snake.sBody, numCol, numRow, currentFood);
      gameover = false;
      score = 1;
      intervalTracker = gameClock(iVal, snake);
   }
   
   //direction key-press events
      //right:  1
      //left:  -1
      //up:   -numCol
      //down:  numCol
   $(document).keydown(function(e) {
      switch(e.which) {
         case 37: // left
         if(lastDirection !== 1){
            direction = -1;}
         break;

         case 39: // right
         if(lastDirection !== -1){
            direction = 1;}
         break;
         
         case 38: // up
         if(lastDirection !== numCol){
            direction = -numCol;}
         break;

         case 40: // down
         if(lastDirection !== -numCol){
            direction = numCol;}
         break;

         default: return; 
      }
      e.preventDefault(); 
   });
   
   $('#reset').click(function(){
      reset();
   });

   $('#speed').click(function(){
      clearInterval(intervalTracker);
      if(!isNaN($('#speedInput').val())){
         iVal = $('#speedInput').val();}
      intervalTracker = gameClock(iVal, snake);
      $('#speed').text('Speed (' + iVal + ')');
   });
   
   $('#size').click(function(){
      clearInterval(intervalTracker);
      if(!isNaN($('#sizeInput').val()) && !isNaN($('#sizeInput2').val())){
         arenaRemover(numRow);
         numCol = parseInt( $('#sizeInput').val(),10);
         numRow = parseInt( $('#sizeInput2').val(),10);
         startLoc = arenaCreator(numCol, numRow);}
      reset();
      intervalTracker = gameClock(iVal, snake);
   });

});







//makes grid
var arenaCreator = function(col, row){
   var tracker = $('thead');
   for (i = 1; i <= row; i++) { 
      tracker.after('<tr id="tr'+ i +'"></tr>');
      tracker = $('#tr'+i);
      for (j = 1; j <= col; j++) { 
         tracker.append('<td id="'+((i-1)*col+j)+'"> </td>');
      }
   }
   if(row%2 === 0){
      return col * row / 2 - col / 2;}
   else{
      return Math.ceil(col * row / 2);}
}

//finds location for the next food item
var nextFood = function(body, col, row, curFood){
   var goodFoodLoc = false;
   var newFood = -1;
   while(!goodFoodLoc){
      newFood = getRandomInt(1, col * row + 1)
      var foodCheck = true;
      var i = 0;
      while(i < body.length && foodCheck){
         if(body[i] === newFood){
            foodCheck = false;}
         i++;
      }
      if(foodCheck){
         goodFoodLoc = true;}
   }

   $('#' + curFood).removeClass('food');
   curFood = newFood;
   $('#' + curFood).addClass('food');
   return curFood;
};

//returns a random int [min,max)
var getRandomInt =  function(min, max){
   return Math.floor(Math.random() * (max - min)) + min;
};

function node(value, next) {
   this.value = value;
   this.next = next;
   this.calcArea = function() {
      return this.height * this.width;
   };
}

function linkedList() {
   this.next = null;
   this.last = null;
   this.length = 0;
   this.push = function(value) {
      if(this.next === null){
         this.next = new node(value,null);
         this.last = new node(value,null);}
         else{ 
            this.last.next = node(value,null);
            this.last = this.last.next;}
   };
   this.peekFirst = function() {return this.next.value;};
   this.peekLast = function() {return this.last.value;};
   this.pop = function() {
      if(this.next === null){
         return null;}
      else{
         var val = this.next.value;
         this.next = this.next.next;
         if(this.next === null){
            this.last = null;}
         return val;}
   };
}

var arenaRemover = function(row){
   for (i = 1; i <= row; i++) { 
      $('#tr'+ i ).remove();
   }
}

//start clock
function gameClock(numMilSec, obj) {
   return setInterval(function(){ obj.move(); }, numMilSec);
}

