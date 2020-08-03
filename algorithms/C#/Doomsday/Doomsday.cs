using System;

namespace DD{
    public class DoomsDay{
        public static int DayOfWeek(int y, int m, int d){
            int[] t = {0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4};
            y -= (m<3) ? 1 : 0;
            return (y + y/4 - y/100 + y/400 + t[m-1] + d) % 7;
        }

        public static void PrintDay(int y, int m, int d){
            switch(DayOfWeek(y,m,d)){
                case 0:
                    Console.WriteLine("Sunday");
                    break;
                case 1:
                    Console.WriteLine("Monday");
                    break;
                case 2:
                    Console.WriteLine("Tuesday");
                    break;
                case 3:
                    Console.WriteLine("Wednesday");
                    break;
                case 4:
                    Console.WriteLine("Thursday");
                    break;
                case 5:
                    Console.WriteLine("Friday");
                    break;
                case 6:
                    Console.WriteLine("Saturday");
                    break;                
                default:
                    Console.WriteLine("Doomsday");
                    break;
            }
        }

        public static void Main(){
            PrintDay(1970, 1, 1);
        }
    }
}