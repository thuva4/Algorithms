public class Luhn {
    public static boolean luhnCheck(String number) {
        int sum = 0;
        boolean doubleDigit = false;

        for (int i = number.length() - 1; i >= 0; i--) {
            char ch = number.charAt(i);
            if (!Character.isDigit(ch)) {
                return false;
            }
            int digit = ch - '0';
            if (doubleDigit) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            doubleDigit = !doubleDigit;
        }

        return sum % 10 == 0;
    }
}
