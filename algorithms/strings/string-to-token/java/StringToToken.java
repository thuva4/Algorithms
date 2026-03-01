import java.util.ArrayList;
import java.util.List;

public class StringToToken {
    public static String[] tokenize(String text, String delimiter) {
        if (text.isEmpty()) {
            return new String[0];
        }
        if (delimiter.isEmpty()) {
            return new String[]{text};
        }
        String[] parts = text.split(java.util.regex.Pattern.quote(delimiter), -1);
        List<String> result = new ArrayList<>();
        for (String part : parts) {
            if (!part.isEmpty()) {
                result.add(part);
            }
        }
        return result.toArray(new String[0]);
    }
}
