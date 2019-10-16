class CocktailSort {
  static int[] cSort(int[] toSort){
    int buffer = 0;
    int start = -1;
    int end = toSort.length - 2;
    boolean swapped; //Finished sorting when nothing has been swapped
    do {
      swapped = false;
      start++; //Moving lower border

      for(int i = start; i <= end; i++) { //Sorting upwards
        if(toSort[i] > toSort[i + 1]) {
          buffer = toSort[i];
          toSort[i] = toSort[i + 1];
          toSort[i + 1] = buffer;
          swapped = true;
        }
      }

      if(swapped == false) break;
      swapped = false;
      end--; //Moving upper border

      for(int i = end; i >= start; i--) { //Sorting downwards
        if(toSort[i] > toSort[i + 1]) {
          buffer = toSort[i];
          toSort[i] = toSort[i + 1];
          toSort[i + 1] = buffer;
          swapped = true;
        }
      }
    } while(swapped);
    return toSort;
  }
}
