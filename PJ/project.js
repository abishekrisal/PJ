// Deposit
// No. of bets
// Bet amount
// Run bet
// Check for win 
// Output result
// Repeat

const prompt = require("prompt-sync")();

//Global Variables
const ROWS = 5;
const COLS = 5;

// Assign the total count of the symbol in the game
const SYMBOLS_COUNT = {
     A: 4, E: 6, I: 8, O: 10 , U: 16
}

// Assign the symbol value 
const SYMBOL_VALUE = {
    A: 5, E: 4, I: 3, O: 2, U: 1
}


//Get deposit amount & check the deposit amount
const Get_Deposit = () => {

  // Loop if the deposit condition is wrong
  while (true) {
    const DepositFromUser = prompt("Enter your deposit: ");     
    const NumberDepositFromUser = parseFloat(DepositFromUser); 

    // output error if not int or zero
    if (isNaN(NumberDepositFromUser) || NumberDepositFromUser <= 0) {  
       console.log("Invalid Deposit!!! Try Again");
    } else {
        //ThisPassword = prompt("Enter Password: ")
       // if (ThisPassword = '167072#Jesus') {
         return NumberDepositFromUser; 
       // } else{
        //  console.log("Wrong Password");
       // }
    };    
  }
};

//Get Line value & check the value
const Get_Lines = () => {
  
  while (true) {
    const GetLineFromUser = prompt("How many Lines do you want to bet: ");     
    const NumberGetLineFromUser = parseFloat(GetLineFromUser); 

    // output error if not int or zero
    if (isNaN(NumberGetLineFromUser) ||  NumberGetLineFromUser <= 0 ||  NumberGetLineFromUser > 3) {  
       console.log("Invalid Lines!!! Try Again");
    } else {
        return  NumberGetLineFromUser;
    };
  }
};

//Cuurent balance, how many lines user want to bet
const Check_For_Bet = (UserBalance,BetLines) => {

  while (true) {
    const ThisBet = prompt("Enter Amount To bet Per lines: ");     
    const NumberThisBet = parseFloat(ThisBet); 

    // The amount user want to bet can't be higher than what their balance or deposit
    if (isNaN(NumberThisBet) ||  NumberThisBet <= 0 || NumberThisBet > (UserBalance / BetLines) ) {  
       console.log("Invalid Bet amount!!! Try Again");
    } else {
        return  NumberThisBet;
    };
  }

};

//checkforthisbet(UserBalance,ThisBetLine,ThisBetAmount)
// After the first total amount deposited, bet amount/line & lines/bet are entered. USe that for ongoing bets. 
// This will check those secondary bets and allow to make changes & minimize user input  
function checkforthisbetround(UserBalance,betlines,betAmount) {
    const NewUserBalance = UserBalance - (betlines * betAmount)
    // The amount user want to bet can't be higher than what their balance or deposit
    if (NewUserBalance >= 0){  
      return true;
    } else {
      return false;
    }
};


const DoSpin = () => {
   const Symbols = []
   ///Get all the symbols with their count value. Make a itemized list of all the items together. 
   for ( const [symbol,count] of Object.entries(SYMBOLS_COUNT)) {
      for (let i = 0; i < count; i++ ){
         Symbols.push(symbol); // get all the symbols
         //console.log(symbol);     
      }
    }
    //  Assign the array to have 3 internal array value with nested arrays.
    const reels = [];
    for (let i = 0; i < COLS; i++) {
         reels.push([]);
         const reelSymbols = [...Symbols]; //Assign all the input to array. 
         //console.log(reelSymbols);
          for ( let j = 0; j < ROWS; j++) {
              const randomIndex = Math.floor(Math.random()*reelSymbols.length);
              const selectedSymbol = reelSymbols[randomIndex];
              reels[i].push(selectedSymbol); 
              //console.log(reels);
              reelSymbols.splice(randomIndex, 1); //remove the value that was selected from the arrays of symbols
          }
    }

    return reels;
};

//After the spin is done transpose the result to show the final reels
const TransposeReels = (reels) => {
  const rows = [];
     for (let i = 0; i < ROWS; i++ ){
        // push row records into nested array  
        rows.push([])
        //console.log(rows); run this to see the result, 
         for (let j = 0; j < COLS; j++ ){
             // insert column data, get item from reels[] & push it to rows[]. 
             rows[i].push(reels[j][i])
             //console.log(rows); run this to see the result,
         }
     }
  return rows;
};

// Get each row & change to string. Lose the comma & change to "|" for output
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i,symbol] of row.entries()) {
      rowString += symbol;
        if (i != rows.length - 1) {
           rowString += " | ";
        }
     }
      //return(printRows);
      console.log(rowString);
  }  
};

const CheckForWins = (rows, bet, lines ) => {
  let winnings = 0;
  
  //Check each rows individually & 
  for (let row = 0; row < lines; row++ ){
      const rowvalues = rows[row];
      console.log(rowvalues)
      let thisvalue = true;
    
      for (const rowvalue of rowvalues) {
        if (rowvalue != rowvalues[0]){
          thisvalue = false; //NO WIN in this spin
          break;
        }
      }  
      
      // If won, get the value from global variable and calculate the win
      if (thisvalue) {
        winnings += bet * SYMBOL_VALUE[rowvalues[0]]
      }
  }

  return winnings;
};

const Playgame = () => {
    let UserBalance = Get_Deposit();
    const NumberGetLineFromUser = Get_Lines();
    const Bet = Check_For_Bet(UserBalance, NumberGetLineFromUser);
    
    // Assign the bet lines & amount it will run until the balance is finished or user changes the value
    let ThisBetLine = NumberGetLineFromUser
    let ThisBetAmount = Bet
    

    while (true) {
     let okaytobet = true;
     okaytobet = checkforthisbetround(UserBalance,ThisBetLine,ThisBetAmount);
    
      if (!okaytobet) {

        console.log ("Low Balance for selected Bet & Lines: " + UserBalance.toString());

          const ChangeBetLinesOrAmount = prompt("Change BetAmount & BetLines. (y/n)? ");
          if (ChangeBetLinesOrAmount == "y"){
            ThisBetLine = Get_Lines();
            ThisBetAmount = Check_For_Bet(UserBalance, ThisBetLine);
          } else {
            break ;
          }
      }

      if(okaytobet){
          // Deduct (bet amount & lines) from the balance.
          UserBalance -= ThisBetAmount * ThisBetLine;
          const reels = DoSpin();
          const row = TransposeReels(reels);
          printRows(row);
          const winnings = CheckForWins(row,Bet,NumberGetLineFromUser);

          // Add winings to the total balance
          UserBalance += winnings;

          // Print winnings to the screen
          if (winnings > 1 ){
          console.log("You won, $" + winnings.toString()); 
          }
                    
          // Check for balance & proceed
          if (UserBalance <= 0){
            console.log ("No Balance To Proceed. Current Balance: " + UserBalance.toString());
            break;
          }
          
          const Playgame = prompt("Current balance:" + UserBalance.toString() + "\n" + "Do you want to Play again (y/n)? ");

          if (Playgame != "y") break; //Close the game 
            
      }
   }
};

Playgame ();
