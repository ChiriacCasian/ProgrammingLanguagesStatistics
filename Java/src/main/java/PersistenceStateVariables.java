import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Component;

@Component
public class PersistenceStateVariables {
    /// currently 40 empty slots
    public static List<Integer> avgSalary = new ArrayList<>(List.of(0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0));
    public static List<Integer> listings = new ArrayList<>(List.of(0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0));
    public static List<Integer> newListings = new ArrayList<>(List.of(0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0));

    private PersistenceStateVariables() {
    }
    public static void setAvgSalary(int lang, int salary) {
        avgSalary.set(lang, salary);
    }
    /// listings, newListings, avgSalary
    public static List<Tile>  getTiles(){
        List<Tile> tiles = new ArrayList<>();
        for(int f = 0; f < avgSalary.size(); f++) {
            tiles.add(new Tile(f, avgSalary.get(f), listings.get(f), newListings.get(f)));
        }
        tiles.add(new Tile(12, 13, 144, 222)) ;
        return tiles ;
    }
}
