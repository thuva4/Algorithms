/**
 * Determines the day of the week.
 * 
 * @author Atom
 *
 */
public class Doomsday {
	
	/**
	 * Determines the day of the week using Tomohiko Sakamoto's Algorithm
	 * to calculate Day of Week based on Gregorian calendar.
	 * 
	 * @param y year
	 * @param m month
	 * @param d day
	 * @return day of the week (0 = sunday, 6 = saturday)
	 */
	public static int dow(int y, int m, int d) {
		final int[] t = { 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 };
		y -= (m < 3) ? 1 : 0;
		return (y + y/4 - y/100 + y/400 + t[m-1] + d) % 7;
	}
	
	/**
	 * Determines the day of the week using Tomohiko Sakamoto's Algorithm
	 * to calculate Day of Week based on Gregorian calendar.
	 * 
	 * @param y year
	 * @param m month
	 * @param d day
	 * @return day of the week
	 */
	public static String dowS(int y, int m, int d) {
		switch (dow(y, m, d)) {
			case 0: return "Sunday";
			case 1: return "Monday";
			case 2: return "Tuesday";
			case 3: return "Wednesday";
			case 4: return "Thursday";
			case 5: return "Friday";
			case 6: return "Saturday";
			default:
				System.out.println("Unknown dow");
		}
		return null;
	}
	
	public static void main(String[] args) {
		System.out.println(dow(1886, 5, 1) + ": " + dowS(1886, 5, 1));
		System.out.println(dow(1948, 12, 10) + ": " + dowS(1948, 12, 10));
		System.out.println(dow(2001, 1, 15) + ": " + dowS(2001, 1, 15));
		System.out.println(dow(2017, 10, 10) + ": " + dowS(2017, 10, 10));
		System.out.println(dow(2018, 1, 1) + ": " + dowS(2018, 1, 1));
		System.out.println(dow(2018, 2, 16) + ": " + dowS(2018, 2, 16));
		System.out.println(dow(2018, 5, 17) + ": " + dowS(2018, 5, 17));
	}

}
