import java.util.ArrayList;
import java.util.List;

public class PersistenceStateVariables {
    public static List<Integer> avgSalary = new ArrayList<>(List.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    private PersistenceStateVariables() {
    }
    public static void setAvgSalary(int lang, int salary) {
        avgSalary.set(lang, salary);
    }
}
