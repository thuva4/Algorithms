import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ElevatorAlgorithm {

    static void startCSCAN(int pos, List<Integer> disk_requests)
    {
        System.out.println("Using C-SCAN algorithm on pending dist requests: " + disk_requests);
        System.out.println("Starting position is: " + pos + "\n");

        if (disk_requests.size() == 0)
        {
            System.out.println("Nothing to do.");
        }

        Collections.sort(disk_requests);

        int next_array_pos = disk_requests.stream()
                .map(disk_requests::indexOf)
                .filter(x -> disk_requests.get(x) > pos)
                .findFirst().orElse(0);

        int curr_position = pos;
        int seek_number = 1;
        int motion_sum = 0;

        for (int i = 0; i < disk_requests.size(); i++)
        {
            if (next_array_pos == 0 && curr_position != 0)
            {
                curr_position = 0;
                System.out.println("Seek " + seek_number + ": returning head to track 0, motion: 0");
                seek_number++;
            }

            int next_position = disk_requests.get(next_array_pos);
            int motion = Math.abs(curr_position-next_position);
            System.out.println("Seek " + seek_number + ": " + next_position + "-" + curr_position + " motion: " + motion);

            seek_number++;
            motion_sum += motion;

            curr_position = next_position;
            next_array_pos = (next_array_pos+1)%disk_requests.size();
        }

        System.out.println("\nTotal motion C-SCAN: " + motion_sum);
    }

    public static void main(String... arg)
    {
        int pos = 35;

        List<Integer> disk_request_list = Arrays.asList(100, 50, 10, 20, 75);

        startCSCAN(pos, disk_request_list);
    }


}
