public class StringToToken {

    public static void main(String[] args) {

        String str = "Hacktober is the best event for open source contribution";
        String delemiter = " ";

        String[] tokens = str.split(delemiter);

        for (String token : tokens)
        {
            System.out.println(token);
        }

    }

}
