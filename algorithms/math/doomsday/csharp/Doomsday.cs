using System;

namespace DD{
    public class DoomsDay{
        public static string DayOfWeek(int y, int m, int d){
            int[] t = {0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4};
            y -= (m<3) ? 1 : 0;
            string[] names = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
            int day = (y + y/4 - y/100 + y/400 + t[m-1] + d) % 7;
            return names[day];
        }

        public static void PrintDay(int y, int m, int d){
            Console.WriteLine(DayOfWeek(y, m, d));
        }

        public static void Main(){
            PrintDay(1970, 1, 1);
        }
    }
}
