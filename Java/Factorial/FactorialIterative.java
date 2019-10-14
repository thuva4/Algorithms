class FactorialIterative {
  static double factorial (int num){
    double result = 1;
    if(num == 0){ //0! is defined as 1
      return result;
    }
    else if(num < 0){
      return -1; //The factorial function is not defined for negatives
    }
    else{
      for(int i = 2; i <= num; i++){
        result = result * i; //Calculation
      }
      return result;
    }
  }
}
